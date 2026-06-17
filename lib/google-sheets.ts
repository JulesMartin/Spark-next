import { createSign } from 'crypto'

function base64url(data: string | Buffer): string {
  const buf = typeof data === 'string' ? Buffer.from(data) : data
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function getAccessToken(credentials: { client_email: string; private_key: string }): Promise<string> {
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

  const data = await res.json() as { access_token: string }
  return data.access_token
}

// Schema: email | campaigns (comma-sep) | social_handle | first_seen | last_updated
export async function upsertEmailToSheet(
  email: string,
  campaigns: string[],
  socialHandle: string | null,
) {
  if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
  const token = await getAccessToken(credentials)
  const sheetId = process.env.GOOGLE_SHEETS_ID
  const range = encodeURIComponent('Liste mails - page de capture!A:E')
  const campaignsStr = campaigns.join(',')
  const now = new Date().toISOString()

  const getRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )

  if (getRes.ok) {
    const { values } = await getRes.json() as { values?: string[][] }
    const rows = values ?? []
    const rowIndex = rows.findIndex(row => row[0]?.toLowerCase() === email)

    if (rowIndex > -1) {
      const firstSeen = rows[rowIndex][3] ?? now
      const updateRange = encodeURIComponent(`Liste mails - page de capture!A${rowIndex + 1}:E${rowIndex + 1}`)
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${updateRange}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [[email, campaignsStr, socialHandle ?? '', firstSeen, now]] }),
        },
      )
      return
    }
  }

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [[email, campaignsStr, socialHandle ?? '', now, now]] }),
    },
  )
}
