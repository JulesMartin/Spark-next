const MANYCHAT_API = 'https://api.manychat.com'

function getApiKey() {
  const key = process.env.MANYCHAT_API_KEY
  if (!key) console.error('MANYCHAT_API_KEY is not set')
  return key
}

// Déclenche le flow ManyChat "Wait + Condition" pour ce subscriber.
// À appeler uniquement quand le clic sur le lien est confirmé (chargement de /capture),
// pas au moment de l'envoi du message — sinon le Wait démarre avant que l'utilisateur clique.
export async function triggerManyChatWaitFlow(subscriberId: string) {
  const apiKey = getApiKey()
  const flowNs = process.env.MANYCHAT_WAIT_FLOW_NS
  if (!apiKey || !flowNs) return

  const res = await fetch(`${MANYCHAT_API}/fb/sending/sendFlow`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ subscriber_id: subscriberId, flow_ns: flowNs }),
  })

  if (!res.ok) {
    console.error('ManyChat sendFlow error:', await res.text().catch(() => ''))
  }
}

export async function markManyChatFormCompleted(subscriberId: string) {
  const apiKey = getApiKey()
  const fieldId = process.env.MANYCHAT_FORM_COMPLETED_FIELD_ID
  if (!apiKey || !fieldId) return

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

  if (!res.ok) {
    console.error('ManyChat setCustomField error:', await res.text().catch(() => ''))
  }
}
