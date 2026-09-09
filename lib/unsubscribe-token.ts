import { createHmac, timingSafeEqual } from 'crypto'

// Token de désinscription : base64url(email).signature-HMAC
// L'email est embarqué dans le token pour éviter un second paramètre d'URL
// (les emails avec un « + » sont corrompus par l'encodage query-string).

const SIG_LENGTH = 27

function getSecret() {
  const secret = process.env.UNSUBSCRIBE_SECRET
  if (!secret) console.error('UNSUBSCRIBE_SECRET is not set')
  return secret
}

function sign(email: string, secret: string): string {
  return createHmac('sha256', secret).update(email).digest('base64url').slice(0, SIG_LENGTH)
}

export function createUnsubscribeToken(email: string): string | null {
  const secret = getSecret()
  if (!secret) return null
  const normalized = email.trim().toLowerCase()
  const payload = Buffer.from(normalized, 'utf-8').toString('base64url')
  return `${payload}.${sign(normalized, secret)}`
}

// Retourne l'email si la signature est valide, sinon null.
export function verifyUnsubscribeToken(token: unknown): string | null {
  const secret = getSecret()
  if (!secret || typeof token !== 'string' || token.length > 512) return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature || signature.length !== SIG_LENGTH) return null

  let email: string
  try {
    email = Buffer.from(payload, 'base64url').toString('utf-8')
  } catch {
    return null
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null

  const expected = Buffer.from(sign(email, secret))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  return email
}
