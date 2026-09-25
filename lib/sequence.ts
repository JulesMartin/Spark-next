import { sendSequenceEmail, getBlacklistedEmails } from './brevo'
import { createServiceClient } from './supabase/service'

// Séquence de bienvenue — remplace le workflow Brevo « Automatisation #2 ».
// `gapDays` = jours d'attente depuis l'étape précédente (depuis la capture pour la
// première). Écarts mesurés d'étape à étape et non depuis la capture : le cron étant
// quotidien, la première étape part le lendemain matin, et tout le reste suit sans
// se tasser. Reproduit le calendrier du workflow : J+0, J+2, J+4, J+5, J+7.
export const SEQUENCE: { gapDays: number; templateId: number; label: string }[] = [
  { gapDays: 0, templateId: 25, label: "Ce que personne ne te dit sur l'IA" },
  { gapDays: 2, templateId: 26, label: 'Tu prompts Claude comme 95% des gens' },
  { gapDays: 2, templateId: 27, label: 'Tu perds entre 2 400 et 25 000€ par an' },
  { gapDays: 1, templateId: 28, label: 'À quoi ressemble un audit gratuit' },
  { gapDays: 2, templateId: 29, label: "Tu as déjà perdu de l'argent" },
]

// Garde-fou : l'offre gratuite Brevo plafonne à 300 emails/jour, dont ~215 déjà
// consommés par les ressources de capture. Au-delà du plafond, les contacts
// restent dus et partent au prochain passage — rien n'est perdu, seulement décalé.
function getDailyCap() {
  return Number(process.env.SEQUENCE_DAILY_CAP ?? '120')
}

const DAY_MS = 86_400_000

// Différence en jours calendaires (UTC), pas en millisecondes : une capture à 23h
// et une capture à 1h le même jour reçoivent leur étape J+2 le même matin.
function daysSince(startedAt: string, now: Date): number {
  const start = Date.parse(`${startedAt.slice(0, 10)}T00:00:00Z`)
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`)
  return Math.round((today - start) / DAY_MS)
}

type Due = { email: string; step: number; templateId: number }

export type SequenceResult = {
  due: number
  sent: number
  failed: number
  capped: number
  skippedUnsubscribed: number
}

// Envoie au plus UNE étape par contact et par passage : un contact en retard
// rattrape ses étapes une par jour plutôt que de recevoir 3 emails d'un coup.
export async function runSequence(blacklist?: Set<string>): Promise<SequenceResult> {
  const supabase = createServiceClient()
  const now = new Date()

  const { data, error } = await supabase
    .from('email_subscribers')
    .select('email, sequence_started_at, sequence_step, sequence_last_sent_at')
    .not('sequence_started_at', 'is', null)
    .eq('unsubscribed', false)
    .lt('sequence_step', SEQUENCE.length)
    .order('sequence_started_at', { ascending: true })
    .limit(2000)

  if (error) throw new Error(`Supabase select sequence: ${error.message}`)

  const blocked = blacklist ?? (await getBlacklistedEmails())
  let skippedUnsubscribed = 0
  const due: Due[] = []

  for (const row of data ?? []) {
    const step = row.sequence_step as number
    const next = SEQUENCE[step]
    if (!next) continue
    const anchor = (row.sequence_last_sent_at as string | null) ?? (row.sequence_started_at as string)
    if (daysSince(anchor, now) < next.gapDays) continue
    if (blocked.has((row.email as string).toLowerCase())) {
      skippedUnsubscribed++
      continue
    }
    due.push({ email: row.email as string, step, templateId: next.templateId })
  }

  const cap = getDailyCap()
  const batch = due.slice(0, cap)
  let sent = 0
  let failed = 0

  for (const item of batch) {
    const ok = await sendSequenceEmail(item.email, item.templateId)
    if (!ok) {
      failed++
      continue
    }
    const { error: updateError } = await supabase
      .from('email_subscribers')
      .update({ sequence_step: item.step + 1, sequence_last_sent_at: new Date().toISOString() })
      .eq('email', item.email)
    if (updateError) {
      // L'email est parti : on log sans relancer, le prochain passage le renverrait.
      console.error('Sequence step update error:', item.email, updateError.message)
    }
    sent++
  }

  return {
    due: due.length,
    sent,
    failed,
    capped: Math.max(0, due.length - batch.length),
    skippedUnsubscribed,
  }
}
