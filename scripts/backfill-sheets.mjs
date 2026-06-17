/**
 * Backfills all email_subscribers from Supabase into Google Sheets.
 * Usage: node scripts/backfill-sheets.mjs
 */

import { createSign } from 'crypto'
import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SHEETS_ID = process.env.GOOGLE_SHEETS_ID
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !SHEETS_ID || !SERVICE_ACCOUNT_KEY) {
  console.error('Variables manquantes dans .env.local')
  process.exit(1)
}

function base64url(data) {
  const buf = typeof data === 'string' ? Buffer.from(data) : data
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))

  const sign = createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = base64url(sign.sign(credentials.private_key))
  const jwt = `${header}.${payload}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const data = await res.json()
  if (!data.access_token) {
    console.error('Erreur auth Google:', data)
    throw new Error('Impossible de récupérer le token Google')
  }
  return data.access_token
}

async function getSheetRows(token, sheetName) {
  const range = encodeURIComponent(`${sheetName}!A:E`)
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!res.ok) {
    const err = await res.text()
    console.error('Erreur lecture sheet:', err)
    throw new Error(`HTTP ${res.status} lors de la lecture`)
  }
  const { values } = await res.json()
  return values ?? []
}

async function writeAllRows(token, sheetName, rows) {
  const range = encodeURIComponent(`${sheetName}!A1`)
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${range}?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: rows }),
    },
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${res.status} lors de l'écriture: ${err}`)
  }
  return res.json()
}

async function fetchAllSubscribers() {
  let all = []
  let offset = 0
  const limit = 1000

  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/email_subscribers?select=email,campaigns,social_handle,created_at&order=created_at.asc&limit=${limit}&offset=${offset}`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      },
    )
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Supabase error ${res.status}: ${err}`)
    }
    const rows = await res.json()
    all = all.concat(rows)
    if (rows.length < limit) break
    offset += limit
  }
  return all
}

async function main() {
  console.log('Connexion à Supabase…')
  const subscribers = await fetchAllSubscribers()
  console.log(`${subscribers.length} abonnés trouvés dans Supabase`)

  const credentials = JSON.parse(SERVICE_ACCOUNT_KEY)
  console.log('Authentification Google…')
  const token = await getAccessToken(credentials)

  // Essayer les noms de feuille courants
  const sheetNames = ['Liste mails - page de capture', 'Feuille 1', 'Sheet1', 'Emails', 'Abonnés', 'Data']
  let sheetName = null
  let existingRows = []

  for (const name of sheetNames) {
    try {
      existingRows = await getSheetRows(token, name)
      sheetName = name
      console.log(`Feuille trouvée : "${name}" (${existingRows.length} lignes existantes)`)
      break
    } catch {
      // essaie le suivant
    }
  }

  if (!sheetName) {
    console.error('Aucune feuille trouvée avec les noms :', sheetNames.join(', '))
    console.error('Vérifie le nom de l\'onglet dans ton Google Sheet et mets à jour lib/google-sheets.ts')
    process.exit(1)
  }

  // Header
  const header = ['email', 'campaigns', 'social_handle', 'first_seen', 'last_updated']

  // Construire un map email → row existante pour conserver first_seen
  const existingMap = new Map()
  for (const row of existingRows) {
    if (row[0] && row[0] !== 'email') {
      existingMap.set(row[0].toLowerCase(), row)
    }
  }

  const now = new Date().toISOString()
  const newRows = subscribers.map(sub => {
    const email = sub.email
    const campaigns = Array.isArray(sub.campaigns) ? sub.campaigns.join(',') : (sub.campaigns ?? '')
    const handle = sub.social_handle ?? ''
    const existing = existingMap.get(email)
    const firstSeen = existing?.[3] ?? sub.created_at ?? now
    return [email, campaigns, handle, firstSeen, now]
  })

  const allRows = [header, ...newRows]
  console.log(`Écriture de ${newRows.length} lignes dans "${sheetName}"…`)
  await writeAllRows(token, sheetName, allRows)
  console.log('Terminé.')

  if (sheetName !== 'Feuille 1') {
    console.log(`\n⚠  Le nom de feuille dans le code est "Feuille 1" mais la vraie feuille s'appelle "${sheetName}".`)
    console.log(`   Met à jour lib/google-sheets.ts ligne ~48 : remplace 'Feuille 1' par '${sheetName}'`)
  } else {
    console.log('\nNom de feuille OK ("Feuille 1" correspond).')
  }
}

main().catch(err => {
  console.error('Erreur:', err.message)
  process.exit(1)
})
