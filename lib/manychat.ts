const MANYCHAT_API = 'https://api.manychat.com'

function getApiKey() {
  const key = process.env.MANYCHAT_API_KEY
  if (!key) console.error('MANYCHAT_API_KEY is not set')
  return key
}

async function setFormCompleted(subscriberId: string, value: boolean) {
  const apiKey = getApiKey()
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
      field_value: value,
    }),
  })

  const responseBody = await res.text().catch(() => '')
  if (!res.ok) {
    console.error('ManyChat setCustomField error:', responseBody, { subscriberId, fieldId, value })
  } else {
    console.log(`ManyChat setCustomField OK (${value}) for subscriber`, subscriberId, responseBody)
  }
}

// Déclenche le flow ManyChat "Wait + Condition" pour ce subscriber.
// À appeler uniquement quand le clic sur le lien est confirmé (chargement de /capture),
// pas au moment de l'envoi du message — sinon le Wait démarre avant que l'utilisateur clique.
// Remet d'abord form_completed à false : sans ça, un contact ayant rempli le formulaire
// d'une campagne précédente garderait true et ne recevrait jamais la relance suivante.
export async function triggerManyChatWaitFlow(subscriberId: string) {
  const apiKey = getApiKey()
  const flowNs = process.env.MANYCHAT_WAIT_FLOW_NS
  if (!apiKey) {
    console.error('ManyChat sendFlow skipped: MANYCHAT_API_KEY missing')
    return
  }
  if (!flowNs) {
    console.error('ManyChat sendFlow skipped: MANYCHAT_WAIT_FLOW_NS missing')
    return
  }

  await setFormCompleted(subscriberId, false)

  const res = await fetch(`${MANYCHAT_API}/fb/sending/sendFlow`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ subscriber_id: subscriberId, flow_ns: flowNs }),
  })

  const responseBody = await res.text().catch(() => '')
  if (!res.ok) {
    console.error('ManyChat sendFlow error:', responseBody, { subscriberId, flowNs })
  } else {
    console.log('ManyChat sendFlow OK for subscriber', subscriberId, responseBody)
  }
}

export async function markManyChatFormCompleted(subscriberId: string) {
  await setFormCompleted(subscriberId, true)
}
