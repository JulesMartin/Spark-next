// Calendrier des séquences de campagne : logique pure, sans base ni envoi.

export type CampaignStep = { gapDays: number; templateId: number; label: string }

export type CampaignSequenceRow = {
  email: string
  sequence_key: string
  started_at: string
  step: number
  last_sent_at: string | null
}

export type DueStep = { email: string; sequenceKey: string; step: number; templateId: number }

const DAY_MS = 86_400_000

// Différence en jours calendaires (UTC), pas en millisecondes.
export function daysSince(startedAt: string, now: Date): number {
  const start = Date.parse(`${new Date(startedAt).toISOString().slice(0, 10)}T00:00:00Z`)
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`)
  return Math.round((today - start) / DAY_MS)
}

// Étape due pour ce contact, ou null. Un modèle Brevo non renseigné (id 0) bloque l'étape
// sans la consommer : elle partira quand le modèle existera.
export function dueStep(
  row: CampaignSequenceRow,
  steps: CampaignStep[],
  now: Date,
): DueStep | 'not-configured' | null {
  const next = steps[row.step]
  if (!next) return null
  if (daysSince(row.last_sent_at ?? row.started_at, now) < next.gapDays) return null
  if (!next.templateId) return 'not-configured'
  return { email: row.email, sequenceKey: row.sequence_key, step: row.step, templateId: next.templateId }
}
