const BREVO_API = 'https://api.brevo.com/v3'

function getApiKey() {
  const key = process.env.BREVO_API_KEY
  if (!key) console.error('BREVO_API_KEY is not set')
  return key
}

// Map campaign slug → Brevo template ID
// Add one line here for each new campaign
const CAMPAIGN_TEMPLATES: Record<string, number> = {
  'cowork-dm': 3,
  'prompts-ia': Number(process.env.BREVO_TEMPLATE_PROMPTS_IA ?? '0'),
  'contenu-dm': 7,
  'audit-dm': 8,
  'fable-dm': 9,
  'photo-dm': 10,
  'codex-dm': 11,
  'stack-dm': 12,
}

type BrevoContactPayload = {
  email: string
  campaigns: string[]
  socialHandle?: string | null
}

export async function upsertBrevoContact({ email, campaigns, socialHandle }: BrevoContactPayload) {
  const apiKey = getApiKey()
  if (!apiKey) return

  const listId = Number(process.env.BREVO_LIST_ID)
  const attributes: Record<string, string> = {
    CAMPAIGNS: campaigns.join(','),
  }
  if (socialHandle) attributes.SOCIAL_HANDLE = socialHandle

  const body: Record<string, unknown> = {
    email,
    attributes,
    updateEnabled: true,
  }
  if (listId) body.listIds = [listId]

  const res = await fetch(`${BREVO_API}/contacts`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}))
    console.error('Brevo upsert error:', err)
  }
}

export async function sendCampaignEmail(email: string, campaign: string) {
  const apiKey = getApiKey()
  if (!apiKey) return

  const templateId = CAMPAIGN_TEMPLATES[campaign]
  if (!templateId) {
    console.error(`No Brevo template configured for campaign: ${campaign}`)
    return
  }

  const res = await fetch(`${BREVO_API}/smtp/email`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ to: [{ email }], templateId }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('Brevo send email error:', err)
  }
}
