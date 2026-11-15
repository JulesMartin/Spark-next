import { createHmac, createHash, timingSafeEqual } from 'node:crypto'

export const ATELIER_COOKIE = 'atelier_access'
export const ATELIER_BUCKET = 'atelier'
export const ATELIER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

// Mots de passe par palier :
//   ATELIER_PASSWORD     = palier 1 (vidéo 1)
//   ATELIER_PASSWORD_2   = palier 2 (ouvre les vidéos 1 et 2)
//   ATELIER_PASSWORD_3   = palier 3 (ouvre les vidéos 1, 2 et 3) … etc.
// Un abonné qui résilie garde son palier : il n'ouvre jamais les vidéos suivantes.
const MAX_LEVEL = 50

export function passwordForLevel(level: number): string | null {
  const v = level === 1 ? process.env.ATELIER_PASSWORD : process.env[`ATELIER_PASSWORD_${level}`]
  return v ? v : null
}

function configuredLevels(): number[] {
  const out: number[] = []
  for (let l = 1; l <= MAX_LEVEL; l++) if (passwordForLevel(l)) out.push(l)
  return out
}

function tokenFor(level: number): string | null {
  const password = passwordForLevel(level)
  if (!password) return null
  return createHmac('sha256', password).update(`atelier-access-v2-${level}`).digest('hex')
}

function safeEqual(x: string, y: string): boolean {
  const a = Buffer.from(x)
  const b = Buffer.from(y)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Valeur du cookie pour un palier : « niveau.signature »
export function cookieForLevel(level: number): string | null {
  const t = tokenFor(level)
  return t ? `${level}.${t}` : null
}

// Palier ouvert par un cookie (0 = aucun accès). Changer le mot de passe d'un palier
// invalide seulement les accès de ce palier.
export function accessLevel(cookieValue: string | undefined): number {
  if (!cookieValue) return 0
  const m = /^(\d{1,2})\.([0-9a-f]+)$/.exec(cookieValue)
  if (m) {
    const level = Number(m[1])
    const t = tokenFor(level)
    return t && safeEqual(m[2], t) ? level : 0
  }
  // Ancien cookie (avant les paliers) = palier 1
  const legacy = process.env.ATELIER_PASSWORD
  if (legacy) {
    const old = createHmac('sha256', legacy).update('atelier-access-v1').digest('hex')
    if (safeEqual(cookieValue, old)) return 1
  }
  return 0
}

// Palier ouvert par un mot de passe saisi (0 = mot de passe inconnu). Le plus haut palier gagne.
export function levelForPassword(candidate: string): number {
  const h = (s: string) => createHash('sha256').update(s).digest()
  const c = h(candidate.trim())
  let found = 0
  for (const l of configuredLevels()) {
    if (timingSafeEqual(c, h(passwordForLevel(l)!))) found = Math.max(found, l)
  }
  return found
}

// Numéro de vidéo d'un chemin du bucket (video-N/… ou telechargements/video-N/…), 0 si commun à tous.
export function requiredLevel(key: string): number {
  const m = /^(?:telechargements\/)?video-(\d+)(?:\/|$)/.exec(key)
  return m ? Number(m[1]) : 0
}

// Palier requis pour une adresse du site (/atelier/video-2/…), sans planter sur un % mal formé.
export function requiredLevelForPath(pathname: string): number {
  try {
    return requiredLevel(decodeURIComponent(pathname).replace(/^\/atelier\/?/, ''))
  } catch {
    return 0
  }
}

// Empêche une redirection vers un autre site après la connexion.
export function safeNext(next: unknown): string {
  return typeof next === 'string' && /^\/atelier(\/[^\\]*)?$/.test(next) && !next.includes('//')
    ? next
    : '/atelier/'
}
