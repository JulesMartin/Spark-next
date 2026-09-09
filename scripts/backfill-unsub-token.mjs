/**
 * Écrit l'attribut UNSUB_TOKEN sur tous les contacts Brevo existants.
 * À lancer une seule fois, après avoir créé l'attribut texte UNSUB_TOKEN dans Brevo.
 * Usage: node scripts/backfill-unsub-token.mjs [--dry]
 */

import { createHmac } from 'crypto'
import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(process.cwd(), '.env.local') })

const BREVO_API = 'https://api.brevo.com/v3'
const API_KEY = process.env.BREVO_API_KEY
const SECRET = process.env.UNSUBSCRIBE_SECRET
const DRY = process.argv.includes('--dry')

if (!API_KEY || !SECRET) {
  console.error('BREVO_API_KEY ou UNSUBSCRIBE_SECRET manquant dans .env.local')
  process.exit(1)
}

// Doit rester identique à lib/unsubscribe-token.ts
function createToken(email) {
  const normalized = email.trim().toLowerCase()
  const payload = Buffer.from(normalized, 'utf-8').toString('base64url')
  const sig = createHmac('sha256', SECRET).update(normalized).digest('base64url').slice(0, 27)
  return `${payload}.${sig}`
}

const headers = { 'api-key': API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' }

async function* allContacts() {
  const limit = 1000
  let offset = 0
  while (true) {
    const res = await fetch(`${BREVO_API}/contacts?limit=${limit}&offset=${offset}`, { headers })
    if (!res.ok) throw new Error(`Brevo list contacts: ${await res.text()}`)
    const { contacts = [] } = await res.json()
    for (const c of contacts) yield c
    if (contacts.length < limit) return
    offset += limit
  }
}

let updated = 0
let skipped = 0
let failed = 0

for await (const contact of allContacts()) {
  const email = contact.email
  if (!email) continue

  const token = createToken(email)
  if (contact.attributes?.UNSUB_TOKEN === token) {
    skipped++
    continue
  }

  if (DRY) {
    console.log(`[dry] ${email} → ${token}`)
    updated++
    continue
  }

  const res = await fetch(`${BREVO_API}/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ attributes: { UNSUB_TOKEN: token } }),
  })

  if (res.ok) {
    updated++
  } else {
    failed++
    console.error(`✗ ${email}: ${await res.text().catch(() => res.status)}`)
  }

  // Brevo limite à ~10 req/s sur /contacts
  await new Promise(r => setTimeout(r, 120))
}

console.log(`\nTerminé — ${updated} mis à jour, ${skipped} déjà à jour, ${failed} en erreur.`)
