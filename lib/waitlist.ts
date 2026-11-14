// Liste d'attente d'Claude to Client (page /skool).

// Fermeture : mercredi 18 novembre 2026 à 23 h 59, heure de Paris (UTC+1 en novembre).
export const WAITLIST_DEADLINE = '2026-11-18T23:59:59+01:00'
export const WAITLIST_DEADLINE_LABEL = 'mercredi 18 novembre à 23 h 59'

// Les 100 premiers : 9 €/mois à vie + sélection d'opportunités IA et skill de création d'offre (pièces jointes du mail). Les 50 premiers : en plus, le call 1-1 (optionnel).
export const EARLY_SPOTS = 100
export const FOUNDER_SPOTS = 50
export const LAUNCH_PRICE = 9

// Vidéo de vente sous le titre. Renseigner l'un des deux ; vide = cadre « la vidéo arrive ».
export const VSL_YOUTUBE_ID = ''
export const VSL_MP4_URL = ''

export type WaitlistTier = 'founder' | 'early' | 'late'

export function tierOf(position: number): WaitlistTier {
  if (position <= FOUNDER_SPOTS) return 'founder'
  if (position <= EARLY_SPOTS) return 'early'
  return 'late'
}

export function isWaitlistClosed(now = Date.now()): boolean {
  return now >= new Date(WAITLIST_DEADLINE).getTime()
}
