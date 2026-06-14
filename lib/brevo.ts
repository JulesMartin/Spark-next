type BrevoContactPayload = {
  email: string
  campaign: string
}

export async function upsertBrevoContact({ email, campaign }: BrevoContactPayload) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error('BREVO_API_KEY is not set')
    return
  }

  const listId = Number(process.env.BREVO_LIST_ID)

  const body: Record<string, unknown> = {
    email,
    attributes: { CAMPAIGN: campaign },
    updateEnabled: true,
  }

  if (listId) body.listIds = [listId]

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}))
    console.error('Brevo API error:', err)
  }
}
