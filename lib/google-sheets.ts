import { createSign } from 'crypto'

// Onglet et schéma du Google Sheet (backup de email_subscribers).
// Colonnes : A email | B campaigns | C social_handle | D first_seen | E last_updated | F unsubscribed | G phone | H first_name
export const SHEET_TAB = 'Liste mails - page de capture'
export const SHEET_RANGE = `${SHEET_TAB}!A:H`

function base64url(data: string | Buffer): string {
  const buf = typeof data === 'string' ? Buffer.from(data) : data
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function getSheetAccessToken(): Promise<string | null> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return null
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY) as {
    client_email: string
    private_key: string
  }

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
  const data = (await res.json()) as { access_token?: string }
  return data.access_token ?? null
}

function sheetId() {
  return process.env.GOOGLE_SHEETS_ID
}

export async function readSheet(token: string, range = SHEET_RANGE): Promise<string[][]> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId()}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!res.ok) throw new Error(`readSheet ${res.status}: ${await res.text()}`)
  const { values } = (await res.json()) as { values?: string[][] }
  return values ?? []
}

// Ajoute des lignes en fin de feuille — ne touche jamais l'existant.
export async function appendRows(token: string, rows: string[][]): Promise<void> {
  if (rows.length === 0) return
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId()}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: rows }),
    },
  )
  if (!res.ok) throw new Error(`appendRows ${res.status}: ${await res.text()}`)
}

// Met à jour des cellules ciblées en un seul appel (ex. colonne unsubscribed).
export async function batchUpdateCells(
  token: string,
  data: { range: string; values: string[][] }[],
): Promise<void> {
  if (data.length === 0) return
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId()}/values:batchUpdate`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ valueInputOption: 'RAW', data }),
    },
  )
  if (!res.ok) throw new Error(`batchUpdateCells ${res.status}: ${await res.text()}`)
}
