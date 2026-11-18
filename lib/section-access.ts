import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { createServiceClient } from '@/lib/supabase/service'

// ─────────────────────────────────────────────────────────────────────────────
// Accès à l'espace membres /section — tout est vérifié dans la base Supabase :
//   • section_settings       : le mot de passe commun, HACHÉ (scrypt), jamais en clair ;
//   • section_sessions       : une ligne par connexion. Le cookie du membre est un jeton aléatoire de 256 bits,
//                              seule son empreinte SHA-256 est en base. Une session se révoque seule ; changer
//                              le mot de passe les révoque toutes ;
//   • section_login_attempts : chaque essai de connexion, pour limiter les essais en rafale par adresse IP.
// Tout est fermé par défaut : en cas d'erreur de base, personne n'entre.
// (migration : supabase/migrations/20261118_section_acces.sql ; gestion : scripts/section-acces.mjs)
// ─────────────────────────────────────────────────────────────────────────────

export const SECTION_COOKIE = 'section_session'
export const SECTION_BUCKET = 'section'
export const SESSION_DAYS = 30
export const SECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * SESSION_DAYS
// Anciens cookies (mot de passe en variable d'environnement) : plus lus, effacés à la connexion.
export const OLD_COOKIES = ['section_access', 'atelier_access']

const MAX_FAILS = 5        // essais ratés autorisés…
const WINDOW_MIN = 15      // …par adresse IP et par fenêtre de 15 minutes
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/

const db = () => createServiceClient()
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex')

function scrypt(password: string, salt: Buffer, N: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scryptCb(password, salt, 32, { N, r, p }, (err, key) => (err ? reject(err) : resolve(key))),
  )
}

// Format du hachage : scrypt$N$r$p$sel(base64)$hachage(base64)  (identique à scripts/section-acces.mjs)
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, N, r, p, salt, hash] = stored.split('$')
  if (alg !== 'scrypt' || !salt || !hash) return false
  const expected = Buffer.from(hash, 'base64')
  const got = await scrypt(password, Buffer.from(salt, 'base64'), Number(N), Number(r), Number(p))
  return got.length === expected.length && timingSafeEqual(got, expected)
}

// Adresse IP du visiteur (sur Vercel, x-forwarded-for est posé par la plateforme, pas par le visiteur).
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim() || headers.get('x-real-ip') || 'inconnue'
}

export type LoginResult =
  | { ok: true; token: string }
  | { ok: false; reason: 'mauvais' | 'trop' | 'serveur' }

// Vérifie le mot de passe dans la base. Chaque essai est enregistré AVANT d'être vérifié (une rafale d'essais
// simultanés est donc comptée en entier), puis marqué réussi si le mot de passe est bon.
export async function login(password: string, ip: string, userAgent: string): Promise<LoginResult> {
  const supabase = db()
  const { data: settings, error: e0 } = await supabase
    .from('section_settings')
    .select('password_hash, ip_salt')
    .eq('id', 1)
    .maybeSingle()
  if (e0 || !settings) return { ok: false, reason: 'serveur' }

  const ipHash = sha256(`${settings.ip_salt}:${ip}`)
  const { data: attempt, error: e1 } = await supabase
    .from('section_login_attempts')
    .insert({ ip_hash: ipHash, success: false })
    .select('id')
    .single()
  if (e1 || !attempt) return { ok: false, reason: 'serveur' }

  const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString()
  const { count, error: e2 } = await supabase
    .from('section_login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('success', false)
    .gte('created_at', since)
  if (e2) return { ok: false, reason: 'serveur' }
  if ((count ?? 0) > MAX_FAILS) return { ok: false, reason: 'trop' }

  if (!(await verifyPassword(password, settings.password_hash))) return { ok: false, reason: 'mauvais' }

  const token = randomBytes(32).toString('base64url')
  const { error: e3 } = await supabase.from('section_sessions').insert({
    token_hash: sha256(token),
    expires_at: new Date(Date.now() + SECTION_COOKIE_MAX_AGE * 1000).toISOString(),
    ip_hash: ipHash,
    user_agent: userAgent.slice(0, 200),
  })
  if (e3) return { ok: false, reason: 'serveur' }

  await supabase.from('section_login_attempts').update({ success: true }).eq('id', attempt.id)
  // Ménage : vieux essais et sessions expirées depuis plus d'une semaine.
  await supabase.from('section_login_attempts').delete().lt('created_at', new Date(Date.now() - 2 * 86_400_000).toISOString())
  await supabase.from('section_sessions').delete().lt('expires_at', new Date(Date.now() - 7 * 86_400_000).toISOString())
  return { ok: true, token }
}

// La session du cookie est-elle valable (existe, non révoquée, non expirée) ?
// Un résultat positif est gardé 60 s en mémoire (évite une requête par image de la page) : une session révoquée
// est donc coupée en une minute au plus.
const okCache = new Map<string, number>()
export async function hasSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue || !TOKEN_RE.test(cookieValue)) return false
  const h = sha256(cookieValue)
  const now = Date.now()
  const hit = okCache.get(h)
  if (hit && hit > now) return true

  const { data, error } = await db()
    .from('section_sessions')
    .select('id, last_seen_at')
    .eq('token_hash', h)
    .is('revoked_at', null)
    .gt('expires_at', new Date(now).toISOString())
    .maybeSingle()
  if (error || !data) {
    okCache.delete(h)
    return false
  }
  if (okCache.size > 500) for (const [k, v] of okCache) if (v <= now) okCache.delete(k)
  okCache.set(h, now + 60_000)
  if (now - Date.parse(data.last_seen_at) > 10 * 60_000) {
    await db().from('section_sessions').update({ last_seen_at: new Date(now).toISOString() }).eq('id', data.id)
  }
  return true
}

export async function revokeSession(cookieValue: string | undefined): Promise<void> {
  if (!cookieValue || !TOKEN_RE.test(cookieValue)) return
  const h = sha256(cookieValue)
  okCache.delete(h)
  await db().from('section_sessions').update({ revoked_at: new Date().toISOString() }).eq('token_hash', h).is('revoked_at', null)
}

// Une requête POST doit venir de notre propre site (jamais d'une autre page web).
export function sameOrigin(request: { headers: Headers }): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === request.headers.get('host')
  } catch {
    return false
  }
}

// Page où aller après la connexion : uniquement une page de /section/ (jamais un autre site).
export const AFTER_LOGIN = '/section/ressources/'
export function safeNext(next: unknown): string {
  if (typeof next !== 'string' || !/^\/section(\/[^\\]*)?$/.test(next) || next.includes('//')) return AFTER_LOGIN
  return /^\/section\/?$/.test(next) ? AFTER_LOGIN : next
}
