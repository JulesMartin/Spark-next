// Nettoyage des inputs de formulaires publics (capture, subscribe).
// Pas d'injection SQL possible (client Supabase paramétré) — on neutralise ici
// le XSS stocké, l'injection de formules Google Sheets et les données hors format.

const MAX_NAME = 80
const MAX_HANDLE = 80
const MAX_EMAIL = 254
const MAX_PHONE = 25

// Retire balises HTML, caractères de contrôle et préfixes de formule tableur (= + @)
function stripDangerous(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f]/g, '')
    .replace(/^[=+@]+/, '')
    .trim()
}

export function sanitizeName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const clean = stripDangerous(value).slice(0, MAX_NAME)
  return clean || null
}

export function sanitizeHandle(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const clean = stripDangerous(value).slice(0, MAX_HANDLE)
  return clean || null
}

export function sanitizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  if (email.length > MAX_EMAIL) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

export function sanitizePhone(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const phone = value.replace(/[^\d+().\-\s]/g, '').trim().slice(0, MAX_PHONE)
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 6) return null
  return phone
}

// Slug campagne : minuscules, chiffres, tirets uniquement (ex: cowork-dm)
export function sanitizeCampaign(value: unknown, fallback: string): string | null {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value !== 'string') return null
  const slug = value.trim().toLowerCase()
  if (!/^[a-z0-9][a-z0-9-]{0,49}$/.test(slug)) return null
  return slug
}
