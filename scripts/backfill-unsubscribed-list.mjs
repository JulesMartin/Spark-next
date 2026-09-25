// Ajoute tous les contacts blacklistés de Brevo à la liste « Désinscrits »
// et les retire de la liste séquence. Sans ça, un contact désinscrit avant la
// mise en place de la liste reste dans le workflow et continue de recevoir.
//
//   node scripts/backfill-unsubscribed-list.mjs --dry
//   node scripts/backfill-unsubscribed-list.mjs

import { readFileSync } from 'node:fs'

const DRY = process.argv.includes('--dry')
const BREVO_API = 'https://api.brevo.com/v3'

function env(key, fallback) {
  const line = readFileSync('.env.local', 'utf-8')
    .split('\n')
    .find(l => l.startsWith(`${key}=`))
  if (!line) return fallback
  return line.slice(key.length + 1).trim().replace(/^["']|["'].*$/g, '') || fallback
}

const API_KEY = env('BREVO_API_KEY')
const UNSUB_LIST = Number(env('BREVO_UNSUBSCRIBED_LIST_ID', '7'))
const SEQ_LIST = Number(env('BREVO_SEQUENCE_LIST_ID', '5'))
const headers = { 'api-key': API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' }

async function allBlacklisted() {
  const out = []
  let offset = 0
  while (true) {
    const res = await fetch(`${BREVO_API}/contacts?limit=1000&offset=${offset}`, { headers })
    if (!res.ok) throw new Error(`Brevo list contacts: ${res.status} ${await res.text()}`)
    const { contacts = [] } = await res.json()
    for (const c of contacts) {
      if (c.emailBlacklisted && c.email) out.push({ email: c.email, listIds: c.listIds ?? [] })
    }
    if (contacts.length < 1000) break
    offset += 1000
  }
  return out
}

async function listAction(listId, action, emails) {
  const res = await fetch(`${BREVO_API}/contacts/lists/${listId}/contacts/${action}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ emails }),
  })
  if (!res.ok && ![400, 404].includes(res.status)) {
    throw new Error(`Brevo ${action} list ${listId}: ${res.status} ${await res.text()}`)
  }
}

const blacklisted = await allBlacklisted()
const toAdd = blacklisted.filter(c => !c.listIds.includes(UNSUB_LIST)).map(c => c.email)
const toRemove = blacklisted.filter(c => c.listIds.includes(SEQ_LIST)).map(c => c.email)

console.log(`Blacklistés Brevo : ${blacklisted.length}`)
console.log(`À ajouter à la liste ${UNSUB_LIST} (Désinscrits) : ${toAdd.length}`)
console.log(`À retirer de la liste ${SEQ_LIST} (séquence)     : ${toRemove.length}`)
if (toRemove.length) console.log('  →', toRemove.join(', '))

if (DRY) {
  console.log('\n--dry : aucune écriture.')
  process.exit(0)
}

const chunk = (arr, n) => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : []
for (const batch of chunk(toAdd, 150)) await listAction(UNSUB_LIST, 'add', batch)
for (const batch of chunk(toRemove, 150)) await listAction(SEQ_LIST, 'remove', batch)

console.log('\nOK — désinscrits synchronisés.')
