import { createHmac, createHash, timingSafeEqual } from 'node:crypto'

export const SECTION_COOKIE = 'section_access'
export const SECTION_BUCKET = 'section'
export const SECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

// Un seul mot de passe commun pour toutes les vidéos de la section : variable SECTION_PASSWORD.
// Il se saisit une fois sur l'accueil (/section/) et ouvre tout. Changer la variable déconnecte tout le monde.
function password(): string | null {
  return process.env.SECTION_PASSWORD || null
}

function token(): string | null {
  const p = password()
  if (!p) return null
  return createHmac('sha256', p).update('section-access-v3').digest('hex')
}

function safeEqual(x: string, y: string): boolean {
  const a = Buffer.from(x)
  const b = Buffer.from(y)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Valeur du cookie d'accès (null si aucun mot de passe n'est configuré).
export function accessCookieValue(): string | null {
  return token()
}

// Le cookie prouve-t-il que le membre a saisi le mot de passe ?
export function hasAccess(cookieValue: string | undefined): boolean {
  const t = token()
  return !!cookieValue && !!t && safeEqual(cookieValue, t)
}

// Le mot de passe saisi est-il le bon ?
export function passwordMatches(candidate: string): boolean {
  const p = password()
  if (!p) return false
  const h = (s: string) => createHash('sha256').update(s).digest()
  return timingSafeEqual(h(candidate.trim()), h(p))
}

// Empêche une redirection vers un autre site après la connexion.
export function safeNext(next: unknown): string {
  return typeof next === 'string' && /^\/section(\/[^\\]*)?$/.test(next) && !next.includes('//')
    ? next
    : '/section/'
}
