import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { upsertBrevoContact, sendCampaignEmail } from '@/lib/brevo'
import { getPostHogClient } from '@/lib/posthog-server'
import { sanitizeName, sanitizeEmail, sanitizePhone, sanitizeHandle, sanitizeCampaign } from '@/lib/sanitize'
import { getCampaignConfig } from '@/lib/campaigns'
import { enrollAndSendResource } from '@/lib/campaign-sequence'

// La landing Auto-Post affiche le formulaire en pop-up et l'envoie ici depuis un autre domaine.
const ALLOWED_ORIGINS = ['https://auto-post.jules-api.com', 'https://video-agent-landing.vercel.app']

function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin')
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

export async function POST(request: NextRequest) {
  const res = await capture(request)
  for (const [k, v] of Object.entries(corsHeaders(request))) res.headers.set(k, v)
  return res
}

async function capture(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const firstName = sanitizeName(body.first_name)
    const email = sanitizeEmail(body.email)
    const campaign = sanitizeCampaign(body.campaign, 'default')
    const socialHandle = sanitizeHandle(body.social_handle)
    const config = getCampaignConfig(campaign)
    // Les campagnes configurées ne demandent ni téléphone ni pseudo.
    const phone = config ? null : sanitizePhone(body.phone)

    if (!firstName) {
      return NextResponse.json({ error: 'Prénom requis.' }, { status: 400 })
    }
    if (!email) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }
    if (!phone && !config) {
      return NextResponse.json({ error: 'Numéro de téléphone requis.' }, { status: 400 })
    }
    if (!campaign) {
      return NextResponse.json({ error: 'Campagne invalide.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id, campaigns, unsubscribed, sequence_started_at')
      .eq('email', email)
      .maybeSingle()

    // Un désinscrit qui redemande une ressource la reçoit, mais ne repasse pas
    // par la séquence : on garde son statut pour que Brevo ne le remette pas en liste #5
    const unsubscribed = existing?.unsubscribed === true
    const isNewCampaign = !existing?.campaigns?.includes(campaign)
    // Une campagne avec sa propre suite de mails ne démarre pas la séquence de bienvenue.
    const ownSequence = config?.sequence ?? null
    // La séquence démarre à la première capture, et pour un contact déjà en base qui
    // revient sur une nouvelle campagne — c'est ce que faisait le workflow Brevo.
    // Jamais deux fois : `sequence_started_at` posé une fois ne bouge plus.
    const startSequence = !ownSequence && isNewCampaign && !unsubscribed && !existing?.sequence_started_at
    const allCampaigns: string[] = existing
      ? isNewCampaign
        ? [...(existing.campaigns ?? []), campaign]
        : (existing.campaigns ?? [campaign])
      : [campaign]

    if (!existing) {
      const { error: insertError } = await supabase.from('email_subscribers').insert({
        ...(ownSequence ? {} : { sequence_started_at: new Date().toISOString() }),
        email,
        source: campaign,
        campaigns: allCampaigns,
        social_handle: socialHandle,
        phone,
        first_name: firstName,
      })
      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
      }
    } else if (isNewCampaign || socialHandle || phone || firstName) {
      await supabase
        .from('email_subscribers')
        .update({
          campaigns: allCampaigns,
          ...(startSequence ? { sequence_started_at: new Date().toISOString() } : {}),
          ...(socialHandle ? { social_handle: socialHandle } : {}),
          ...(phone ? { phone } : {}),
          ...(firstName ? { first_name: firstName } : {}),
        })
        .eq('email', email)
    }

    await upsertBrevoContact({ email, campaigns: allCampaigns, socialHandle, firstName, unsubscribed })

    let emailSent = true
    if (ownSequence) {
      emailSent = await enrollAndSendResource(email, campaign, ownSequence)
    } else if (config) {
      // Pas de cron pour renvoyer ce guide : on le dit tout de suite, un nouvel essai le renvoie.
      emailSent = await sendCampaignEmail(email, campaign)
      if (!emailSent) {
        return NextResponse.json({ error: "Le mail n'a pas pu partir. Réessaie dans un instant." }, { status: 502 })
      }
    } else if (isNewCampaign) {
      await sendCampaignEmail(email, campaign)
    }

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: email,
      event: 'email_captured',
      properties: {
        campaign,
        is_new_subscriber: !existing,
        is_new_campaign: isNewCampaign,
      },
    })
    await posthog.shutdown()

    return NextResponse.json({ success: true, emailSent })
  } catch (error) {
    console.error('Capture route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
  }
}
