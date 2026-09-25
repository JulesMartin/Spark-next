import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { upsertBrevoContact, sendCampaignEmail } from '@/lib/brevo'
import { getPostHogClient } from '@/lib/posthog-server'
import { sanitizeName, sanitizeEmail, sanitizePhone, sanitizeHandle, sanitizeCampaign } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const firstName = sanitizeName(body.first_name)
    const email = sanitizeEmail(body.email)
    const campaign = sanitizeCampaign(body.campaign, 'default')
    const socialHandle = sanitizeHandle(body.social_handle)
    const phone = sanitizePhone(body.phone)

    if (!firstName) {
      return NextResponse.json({ error: 'Prénom requis.' }, { status: 400 })
    }
    if (!email) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }
    if (!phone) {
      return NextResponse.json({ error: 'Numéro de téléphone requis.' }, { status: 400 })
    }
    if (!campaign) {
      return NextResponse.json({ error: 'Campagne invalide.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id, campaigns, unsubscribed')
      .eq('email', email)
      .maybeSingle()

    // Un désinscrit qui redemande une ressource la reçoit, mais ne repasse pas
    // par la séquence : on garde son statut pour que Brevo ne le remette pas en liste #5
    const unsubscribed = existing?.unsubscribed === true
    const isNewCampaign = !existing?.campaigns?.includes(campaign)
    const allCampaigns: string[] = existing
      ? isNewCampaign
        ? [...(existing.campaigns ?? []), campaign]
        : (existing.campaigns ?? [campaign])
      : [campaign]

    if (!existing) {
      // Démarre la séquence de bienvenue (cron quotidien, lib/sequence.ts).
      // Uniquement à la première capture : on ne rejoue jamais la séquence.
      const { error: insertError } = await supabase.from('email_subscribers').insert({
        sequence_started_at: new Date().toISOString(),
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
          ...(socialHandle ? { social_handle: socialHandle } : {}),
          ...(phone ? { phone } : {}),
          ...(firstName ? { first_name: firstName } : {}),
        })
        .eq('email', email)
    }

    await upsertBrevoContact({ email, campaigns: allCampaigns, socialHandle, firstName, unsubscribed })

    if (isNewCampaign) {
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Capture route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
  }
}
