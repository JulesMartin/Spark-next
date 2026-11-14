import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Resend } from 'resend'
import { createUnsubscribeToken } from './unsubscribe-token'
import { LAUNCH_PRICE, type WaitlistTier } from './waitlist'

const ATTACHMENTS = ['opportunites-business-ia.md', 'creation-offre.md']

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jules-api.com'

function content(position: number, tier: WaitlistTier) {
  if (tier === 'founder') {
    return {
      subject: `Tu es dans les 50 premiers (n° ${position})`,
      lines: [
        `Bravo, tu es n° ${position} sur la liste d'attente de Claude to Client : tu fais partie des 50 premiers.`,
        `Ce qui est réservé pour toi :`,
        `• le prix de ${LAUNCH_PRICE} €/mois à vie ;`,
        `• le skill « création d'offre », en pièce jointe : tu le colles dans un projet Claude et il t'aide à définir ton offre en 45 minutes ;`,
        `• une sélection de 35 opportunités de business IA qui peuvent devenir des prestations, en pièce jointe ;`,
        `• un call 1-1 avec moi de 20 à 30 min pour choisir ta première prestation et ta cible. Il est optionnel : tu le demandes seulement si tu en as envie.`,
        `L'ouverture de la communauté Skool Claude to Client, c'est très prochainement. Ce jour-là, tu reçois ton lien d'accès au prix réservé.`,
      ],
    }
  }
  if (tier === 'early') {
    return {
      subject: `Tu es dans les 100 premiers (n° ${position})`,
      lines: [
        `Bravo, tu es n° ${position} sur la liste d'attente de Claude to Client : tu fais partie des 100 premiers.`,
        `Ton prix de ${LAUNCH_PRICE} €/mois à vie est réservé.`,
        `Je t'ai joint deux ressources : une sélection de 35 opportunités de business IA qui peuvent devenir des prestations, et un skill « création d'offre » à coller dans un projet Claude pour définir ton offre en 45 minutes.`,
        `L'ouverture de la communauté Skool Claude to Client, c'est très prochainement. Ce jour-là, tu reçois ton lien d'accès au prix réservé.`,
      ],
    }
  }
  return {
    subject: `Tu es sur la liste de Claude to Client (n° ${position})`,
    lines: [
      `Tu es n° ${position} sur la liste d'attente de Claude to Client.`,
      `Mince, tu y étais presque : les 100 premières places sont parties. Mais je t'ai quand même joint deux ressources : une sélection de 35 opportunités de business IA qui peuvent devenir des prestations, et un skill « création d'offre » à coller dans un projet Claude pour définir ton offre en 45 minutes.`,
      `L'ouverture de la communauté Skool Claude to Client, c'est très prochainement, et tu seras prévenu.`,
    ],
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function sendWaitlistEmail(email: string, position: number, tier: WaitlistTier) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    console.warn('Waitlist email skipped: RESEND_API_KEY or RESEND_FROM_EMAIL missing')
    return
  }

  const { subject, lines } = content(position, tier)
  const token = createUnsubscribeToken(email)
  const unsubUrl = token ? `${SITE}/desinscription?t=${token}` : `${SITE}/desinscription`

  const text = [...lines, '', 'À très vite,', 'Jules', '', `Se désinscrire : ${unsubUrl}`].join('\n\n')
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#15110E;max-width:560px">
${lines.map((l) => `<p style="margin:0 0 14px">${esc(l)}</p>`).join('\n')}
<p style="margin:22px 0 0">À très vite,<br>Jules</p>
<p style="margin:32px 0 0;font-size:12px;color:#5a4d63">Tu reçois cet e-mail parce que tu t'es inscrit sur la liste d'attente de Claude to Client. <a href="${unsubUrl}" style="color:#5a4d63">Se désinscrire</a></p>
</div>`

  const attachments = await Promise.all(
    ATTACHMENTS.map(async (filename) => ({
      filename,
      content: await readFile(path.join(process.cwd(), 'content', 'waitlist', filename)),
    })),
  )

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject,
    text,
    html,
    attachments,
    headers: { 'List-Unsubscribe': `<${unsubUrl}>` },
  })
  if (error) console.error('Waitlist email error:', error)
}
