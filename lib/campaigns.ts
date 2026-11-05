// Campagnes de capture qui ont leur propre page : marque, champs, redirection, séquence.
// Une campagne absente d'ici garde le comportement standard de /capture (Spark, téléphone
// obligatoire, panneau de succès, séquence de bienvenue).
//
// L'adresse de redirection vit ici, jamais dans l'URL de la page : un `?next=` permettrait
// à n'importe qui de renvoyer tes visiteurs vers un autre site.

export type CampaignConfig = {
  brand: string
  brandHref: string
  badge: string | null
  title: string
  lead: string | null
  button: string
  consent: string | null
  redirectTo: string
  // Suite de mails propre à la campagne (`campaign_sequences`) ; null = la séquence de bienvenue habituelle.
  sequence: string | null
}

export const CAMPAIGN_CONFIGS: Record<string, CampaignConfig> = {
  'auto-post-guide': {
    brand: 'Auto-Post',
    brandHref: 'https://auto-post.jules-api.com/',
    badge: null,
    title: 'Reçois ta ressource dans ta boîte mail',
    lead: "Pense bien à regarder dans l'onglet Promotions, Spam ou Courrier indésirable pour trouver le mail.",
    button: 'Recevoir le guide',
    consent: null,
    redirectTo:
      'https://auto-post.jules-api.com/?guide=1&utm_source=instagram&utm_medium=capture&utm_campaign=auto-post-guide',
    sequence: 'auto-post',
  },
}

// Les guides créés depuis le studio Auto-Post : n8n ajoute leur slug dans CAMPAIGN_TEMPLATES (lib/brevo.ts).
// Le suffixe suffit à donner la page Auto-Post ; une page dont le slug n'a pas de modèle Brevo répond 404 (app/capture/page.tsx).
const AUTO_POST_SUFFIX = '-ap'

export function isAutoPostGuide(campaign: string | null | undefined): boolean {
  return !!campaign && campaign.endsWith(AUTO_POST_SUFFIX) && campaign.length > AUTO_POST_SUFFIX.length
}

function autoPostGuideConfig(campaign: string): CampaignConfig {
  return {
    ...CAMPAIGN_CONFIGS['auto-post-guide'],
    consent: null,
    redirectTo: `https://auto-post.jules-api.com/?guide=1&utm_source=instagram&utm_medium=capture&utm_campaign=${encodeURIComponent(campaign)}`,
    sequence: null,
  }
}

export function getCampaignConfig(campaign: string | null | undefined): CampaignConfig | null {
  if (!campaign) return null
  if (Object.hasOwn(CAMPAIGN_CONFIGS, campaign)) return CAMPAIGN_CONFIGS[campaign]
  return isAutoPostGuide(campaign) ? autoPostGuideConfig(campaign) : null
}

// Adresse finale : `guide=retard` si le mail n'a pas pu partir (le cron le renverra).
export function redirectUrl(config: CampaignConfig, emailSent: boolean): string {
  const url = new URL(config.redirectTo)
  if (!emailSent) url.searchParams.set('guide', 'retard')
  return url.toString()
}
