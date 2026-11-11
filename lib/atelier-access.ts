import { createHmac, createHash, timingSafeEqual } from 'node:crypto'

export const ATELIER_COOKIE = 'atelier_access'
export const ATELIER_BUCKET = 'atelier'
export const ATELIER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

// Le cookie est dérivé du mot de passe : changer ATELIER_PASSWORD invalide tous les accès existants.
export function accessToken(): string | null {
  const password = process.env.ATELIER_PASSWORD
  if (!password) return null
  return createHmac('sha256', password).update('atelier-access-v1').digest('hex')
}

export function hasAccess(cookieValue: string | undefined): boolean {
  const expected = accessToken()
  if (!expected || !cookieValue) return false
  const a = Buffer.from(cookieValue)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function passwordMatches(candidate: string): boolean {
  const password = process.env.ATELIER_PASSWORD
  if (!password) return false
  const h = (s: string) => createHash('sha256').update(s).digest()
  return timingSafeEqual(h(candidate.trim()), h(password))
}

// Empêche une redirection vers un autre site après la connexion.
export function safeNext(next: unknown): string {
  return typeof next === 'string' && /^\/atelier(\/[^\\]*)?$/.test(next) && !next.includes('//')
    ? next
    : '/atelier/'
}
