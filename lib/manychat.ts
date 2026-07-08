const MANYCHAT_API = 'https://api.manychat.com'

// Passe le custom field form_completed à true pour ce subscriber.
// La relance est gérée nativement dans l'automation ManyChat (Smart Delay + Condition
// sur form_completed) — le site n'a que ce marquage à faire à la soumission du formulaire.
export async function markManyChatFormCompleted(subscriberId: string) {
  const apiKey = process.env.MANYCHAT_API_KEY
  const fieldId = process.env.MANYCHAT_FORM_COMPLETED_FIELD_ID
  if (!apiKey) {
    console.error('ManyChat setCustomField skipped: MANYCHAT_API_KEY missing')
    return
  }
  if (!fieldId) {
    console.error('ManyChat setCustomField skipped: MANYCHAT_FORM_COMPLETED_FIELD_ID missing')
    return
  }

  const res = await fetch(`${MANYCHAT_API}/fb/subscriber/setCustomField`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      subscriber_id: subscriberId,
      field_id: Number(fieldId),
      field_value: true,
    }),
  })

  const responseBody = await res.text().catch(() => '')
  if (!res.ok) {
    console.error('ManyChat setCustomField error:', responseBody, { subscriberId, fieldId })
  } else {
    console.log('ManyChat setCustomField OK (true) for subscriber', subscriberId, responseBody)
  }
}
