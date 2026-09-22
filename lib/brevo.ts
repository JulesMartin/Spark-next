import { createUnsubscribeToken } from './unsubscribe-token'

const BREVO_API = 'https://api.brevo.com/v3'

function getSequenceListId() {
  return Number(process.env.BREVO_SEQUENCE_LIST_ID ?? '5')
}

function getApiKey() {
  const key = process.env.BREVO_API_KEY
  if (!key) console.error('BREVO_API_KEY is not set')
  return key
}

// Map campaign slug → Brevo template ID
// Add one line here for each new campaign
const CAMPAIGN_TEMPLATES: Record<string, number> = {
  'jarvis-assistant-vocal-claude-code-kokoro-dm': 56,
  'laya-vs-jev-installation-1-dm': 55,
  'laya-vs-jev-installation-dm': 54,
  'agent-linkedin-11-skills-dm': 53,
  'prospecthalo-mcp-claude-prospection-linkedin-1-dm': 52,
  'installer-omniroute-avec-claude-code-dm': 51,
  'guide-acces-gpt6-astra-dm': 50,
  '5-plugins-claude-code-dm': 49,
  '15-outils-ia-google-gratuits-dm': 47,
  'lm-dm': 46,
  'guide-claude-cowork-dm': 45,
  'audit-instagram-avec-claude-fr-dm': 44,
  'graph-dm-dm': 37,
  'cowork-dm': 3,
  'prompts-ia': Number(process.env.BREVO_TEMPLATE_PROMPTS_IA ?? '0'),
  'contenu-dm': 7,
  'audit-dm': 8,
  'fable-dm': 9,
  'photo-dm': 10,
  'codex-dm': 11,
  'stack-dm': 12,
  'argent-dm': 13,
  'skill-dm': 14,
  'canva-dm': 15,
  'video-dm': 19,
  'setup-dm': 20,
  'design-dm': 21,
  'fable2-dm': 22,
  'video2-dm': 30,
}

type BrevoContactPayload = {
  email: string
  campaigns: string[]
  socialHandle?: string | null
  phone?: string | null
  firstName?: string | null
}

export async function upsertBrevoContact({ email, campaigns, socialHandle, phone, firstName }: BrevoContactPayload) {
  const apiKey = getApiKey()
  if (!apiKey) return

  // Liste #5 : déclenche l'automation "séquence commune" (#2) dans Brevo
  const listIds = [process.env.BREVO_LIST_ID, getSequenceListId()]
    .map(Number)
    .filter(Boolean)
  const attributes: Record<string, string> = {
    CAMPAIGNS: campaigns.join(','),
  }
  const unsubToken = createUnsubscribeToken(email)
  if (unsubToken) attributes.UNSUB_TOKEN = unsubToken
  if (socialHandle) attributes.SOCIAL_HANDLE = socialHandle
  if (phone) attributes.PHONE = phone
  if (firstName) attributes.FIRSTNAME = firstName

  const body: Record<string, unknown> = {
    email,
    attributes,
    updateEnabled: true,
  }
  if (listIds.length) body.listIds = listIds

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

// Récupère tous les emails désabonnés (emailBlacklisted) de Brevo, en minuscules.
// Source de vérité RGPD : Brevo gère le lien de désinscription légal dans les emails.
export async function getBlacklistedEmails(): Promise<Set<string>> {
  const apiKey = getApiKey()
  const result = new Set<string>()
  if (!apiKey) return result

  const limit = 1000
  let offset = 0

  while (true) {
    const res = await fetch(
      `${BREVO_API}/contacts?limit=${limit}&offset=${offset}`,
      { headers: { 'api-key': apiKey, Accept: 'application/json' } },
    )
    if (!res.ok) {
      console.error('Brevo list contacts error:', await res.text().catch(() => ''))
      break
    }
    const data = (await res.json()) as {
      contacts?: { email?: string; emailBlacklisted?: boolean }[]
    }
    const contacts = data.contacts ?? []
    for (const c of contacts) {
      if (c.emailBlacklisted && c.email) result.add(c.email.toLowerCase())
    }
    if (contacts.length < limit) break
    offset += limit
  }

  return result
}

// Désinscription : sortie de la liste séquence, tags vidés, blacklist Brevo.
// La blacklist est ce qui coupe réellement une automation déjà démarrée.
export async function unsubscribeBrevoContact(email: string) {
  const apiKey = getApiKey()
  if (!apiKey) return

  const headers = { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' }

  const removeRes = await fetch(`${BREVO_API}/contacts/lists/${getSequenceListId()}/contacts/remove`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ emails: [email] }),
  })
  // 400 = contact déjà hors de la liste, 404 = contact inconnu de Brevo : sans gravité
  if (!removeRes.ok && ![400, 404].includes(removeRes.status)) {
    console.error('Brevo list remove error:', await removeRes.text().catch(() => ''))
  }

  const updateRes = await fetch(`${BREVO_API}/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ attributes: { CAMPAIGNS: '' }, emailBlacklisted: true }),
  })
  if (!updateRes.ok && updateRes.status !== 404) {
    console.error('Brevo blacklist error:', await updateRes.text().catch(() => ''))
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
