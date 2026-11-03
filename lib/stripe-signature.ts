import { createHmac, timingSafeEqual } from 'node:crypto'

// Vérifie l'en-tête `Stripe-Signature` sans le SDK Stripe : HMAC-SHA256 de `t.corps`,
// comparé en temps constant, avec une tolérance de 5 minutes contre le rejeu.
export function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
  toleranceSeconds = 300,
): boolean {
  if (!header || !secret) return false

  let timestamp = ''
  const signatures: string[] = []
  for (const part of header.split(',')) {
    const separator = part.indexOf('=')
    if (separator === -1) continue
    const key = part.slice(0, separator).trim()
    const value = part.slice(separator + 1).trim()
    if (key === 't') timestamp = value
    if (key === 'v1') signatures.push(value)
  }

  const t = Number(timestamp)
  if (!timestamp || !Number.isFinite(t) || signatures.length === 0) return false
  if (Math.abs(nowSeconds - t) > toleranceSeconds) return false

  const expected = Buffer.from(createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex'))
  return signatures.some(signature => {
    const candidate = Buffer.from(signature)
    return candidate.length === expected.length && timingSafeEqual(candidate, expected)
  })
}
