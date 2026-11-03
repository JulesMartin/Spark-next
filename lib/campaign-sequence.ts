import { sendCampaignEmail, sendSequenceEmail } from './brevo'
import { createServiceClient } from './supabase/service'
import { daysSince, dueStep, type CampaignSequenceRow, type CampaignStep, type DueStep } from './campaign-sequence-due'

// Séquences propres à une campagne (table `campaign_sequences`), séparées de la séquence
// de bienvenue de `lib/sequence.ts`, qui reste « une par personne, à vie » et vend l'audit.
// Voir DOCUMENTATION/CAPTURE_AUTO_POST.md.

function template(name: string): number {
  return Number(process.env[name] ?? '0') || 0
}

function campaignSequences(): Record<string, CampaignStep[]> {
  return {
    'auto-post': [
      { gapDays: 1, templateId: template('BREVO_TEMPLATE_AUTO_POST_SEQ_1'), label: 'Le guide, et ce qui vient après' },
      { gapDays: 2, templateId: template('BREVO_TEMPLATE_AUTO_POST_SEQ_2'), label: 'Comment ça marche' },
      { gapDays: 2, templateId: template('BREVO_TEMPLATE_AUTO_POST_SEQ_3'), label: 'Ce que coûte le montage' },
      { gapDays: 1, templateId: template('BREVO_TEMPLATE_AUTO_POST_SEQ_4'), label: 'Les questions avant de se lancer' },
      { gapDays: 2, templateId: template('BREVO_TEMPLATE_AUTO_POST_SEQ_5'), label: 'Dernier mail sur le sujet' },
    ],
  }
}

// Inscrit le contact et envoie le guide s'il ne l'a pas déjà reçu. Renvoie false si le mail
// n'est pas parti : le cron le renverra au prochain passage.
export async function enrollAndSendResource(email: string, campaign: string, sequenceKey: string): Promise<boolean> {
  const supabase = createServiceClient()

  // ignoreDuplicates : un contact déjà inscrit (ou un acheteur, stoppé) garde sa ligne.
  const { error: upsertError } = await supabase
    .from('campaign_sequences')
    .upsert(
      { email, sequence_key: sequenceKey, resource_campaign: campaign },
      { onConflict: 'email,sequence_key', ignoreDuplicates: true },
    )
  if (upsertError) {
    // Table absente ou base en panne : le visiteur a demandé le guide, on l'envoie quand même.
    console.error('campaign_sequences upsert error:', upsertError.message)
    return sendCampaignEmail(email, campaign)
  }

  const { data: row, error: selectError } = await supabase
    .from('campaign_sequences')
    .select('resource_sent_at')
    .eq('email', email)
    .eq('sequence_key', sequenceKey)
    .maybeSingle()
  if (selectError) {
    console.error('campaign_sequences select error:', selectError.message)
    return sendCampaignEmail(email, campaign)
  }
  if (row?.resource_sent_at) return true

  const sent = await sendCampaignEmail(email, campaign)
  if (sent) await markResourceSent(email, sequenceKey, campaign)
  return sent
}

async function markResourceSent(email: string, sequenceKey: string, campaign: string) {
  const { error } = await createServiceClient()
    .from('campaign_sequences')
    .update({ resource_sent_at: new Date().toISOString(), resource_campaign: campaign })
    .eq('email', email)
    .eq('sequence_key', sequenceKey)
  // Le mail est parti : on log sans relancer, sinon le cron le renverrait.
  if (error) console.error('campaign_sequences resource update error:', email, error.message)
}

// Coupe les relances (achat) : crée la ligne si la personne n'est pas encore inscrite, pour
// qu'une capture ultérieure ne relance pas un acheteur. Les autres colonnes ne bougent pas.
export async function stopCampaignSequence(email: string, sequenceKey: string, reason: string) {
  const { error } = await createServiceClient()
    .from('campaign_sequences')
    .upsert(
      { email, sequence_key: sequenceKey, stopped_at: new Date().toISOString(), stopped_reason: reason },
      { onConflict: 'email,sequence_key' },
    )
  if (error) throw new Error(`campaign_sequences stop: ${error.message}`)
}

export type CampaignSequenceResult = {
  resourcesRetried: number
  resourcesFailed: number
  due: number
  sent: number
  failed: number
  capped: number
  skippedUnsubscribed: number
  skippedSameDay: number
  notConfigured: number
}

const PAGE = 1000
const IN_CHUNK = 200

type Row = CampaignSequenceRow & { resource_campaign: string | null; resource_sent_at: string | null }

async function fetchActiveRows(): Promise<Row[]> {
  const supabase = createServiceClient()
  const all: Row[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('campaign_sequences')
      .select('email, sequence_key, started_at, step, last_sent_at, resource_campaign, resource_sent_at')
      .is('stopped_at', null)
      .order('started_at', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) throw new Error(`campaign_sequences select: ${error.message}`)
    all.push(...((data ?? []) as Row[]))
    if ((data ?? []).length < PAGE) return all
  }
}

async function fetchContacts(emails: string[]) {
  const supabase = createServiceClient()
  const contacts = new Map<string, { unsubscribed: boolean; welcomeLastSentAt: string | null }>()
  for (let i = 0; i < emails.length; i += IN_CHUNK) {
    const { data, error } = await supabase
      .from('email_subscribers')
      .select('email, unsubscribed, sequence_last_sent_at')
      .in('email', emails.slice(i, i + IN_CHUNK))
    if (error) throw new Error(`email_subscribers select: ${error.message}`)
    for (const c of data ?? []) {
      contacts.set(c.email as string, {
        unsubscribed: c.unsubscribed === true,
        welcomeLastSentAt: (c.sequence_last_sent_at as string | null) ?? null,
      })
    }
  }
  return contacts
}

// Une étape par contact et par passage, jamais deux mails de séquence le même jour.
// `budget` = ce qu'il reste du plafond quotidien : les guides en retard passent d'abord.
export async function runCampaignSequences(blacklist: Set<string>, budget: number): Promise<CampaignSequenceResult> {
  const result: CampaignSequenceResult = {
    resourcesRetried: 0,
    resourcesFailed: 0,
    due: 0,
    sent: 0,
    failed: 0,
    capped: 0,
    skippedUnsubscribed: 0,
    skippedSameDay: 0,
    notConfigured: 0,
  }
  const now = new Date()
  const sequences = campaignSequences()
  const rows = await fetchActiveRows()
  if (rows.length === 0) return result

  const contacts = await fetchContacts([...new Set(rows.map(r => r.email))])
  let remaining = Math.max(0, budget)

  // 1. Guides qui n'ont pas pu partir (quota Brevo, panne). Le visiteur les a demandés.
  for (const row of rows) {
    if (row.resource_sent_at || !row.resource_campaign) continue
    if (remaining <= 0) {
      result.capped++
      continue
    }
    remaining--
    if (await sendCampaignEmail(row.email, row.resource_campaign)) {
      await markResourceSent(row.email, row.sequence_key, row.resource_campaign)
      row.resource_sent_at = now.toISOString()
      result.resourcesRetried++
    } else {
      result.resourcesFailed++
    }
  }

  // 2. Relances : seulement après le guide, et hors désinscrits.
  const due: DueStep[] = []
  for (const row of rows) {
    if (!row.resource_sent_at) continue
    const contact = contacts.get(row.email)
    if (contact?.unsubscribed || blacklist.has(row.email.toLowerCase())) {
      result.skippedUnsubscribed++
      continue
    }
    if (daysSince(row.resource_sent_at, now) === 0) continue
    const step = dueStep(row, sequences[row.sequence_key] ?? [], now)
    if (!step) continue
    if (step === 'not-configured') {
      result.notConfigured++
      continue
    }
    if (contact?.welcomeLastSentAt && daysSince(contact.welcomeLastSentAt, now) === 0) {
      result.skippedSameDay++
      continue
    }
    due.push(step)
  }
  result.due = due.length

  const supabase = createServiceClient()
  for (const item of due) {
    if (remaining <= 0) {
      result.capped++
      continue
    }
    remaining--
    const ok = await sendSequenceEmail(item.email, item.templateId)
    if (!ok) {
      result.failed++
      continue
    }
    const { error } = await supabase
      .from('campaign_sequences')
      .update({ step: item.step + 1, last_sent_at: new Date().toISOString() })
      .eq('email', item.email)
      .eq('sequence_key', item.sequenceKey)
    if (error) console.error('Campaign step update error:', item.email, error.message)
    result.sent++
  }

  return result
}
