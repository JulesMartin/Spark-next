import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { upsertBrevoContact, sendCampaignEmail } from '@/lib/brevo'
import { getPostHogClient } from '@/lib/posthog-server'
import { sanitizeName, sanitizeEmail, sanitizePhone, sanitizeCampaign } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const firstName = sanitizeName(body.first_name)
    const email = sanitizeEmail(body.email)
    const source = sanitizeCampaign(body.source, 'prompts-ia')
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
    if (!source) {
      return NextResponse.json({ error: 'Source invalide.' }, { status: 400 })
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
    const isNewCampaign = !existing?.campaigns?.includes(source)
    // La séquence démarre à la première capture, et pour un contact déjà en base qui
    // revient sur une nouvelle campagne — c'est ce que faisait le workflow Brevo.
    // Jamais deux fois : `sequence_started_at` posé une fois ne bouge plus.
    const startSequence = isNewCampaign && !unsubscribed && !existing?.sequence_started_at
    const allCampaigns: string[] = existing
      ? isNewCampaign
        ? [...(existing.campaigns ?? []), source]
        : (existing.campaigns ?? [source])
      : [source]

    if (!existing) {
      const { error: insertError } = await supabase.from('email_subscribers').insert({
        sequence_started_at: new Date().toISOString(),
        email,
        source,
        campaigns: allCampaigns,
        phone,
        first_name: firstName,
      })
      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
      }
    } else if (isNewCampaign || phone || firstName) {
      await supabase
        .from('email_subscribers')
        .update({
          campaigns: allCampaigns,
          ...(startSequence ? { sequence_started_at: new Date().toISOString() } : {}),
          ...(phone ? { phone } : {}),
          ...(firstName ? { first_name: firstName } : {}),
        })
        .eq('email', email)
    }

    await upsertBrevoContact({ email, campaigns: allCampaigns, firstName, unsubscribed })

    if (isNewCampaign) {
      await sendCampaignEmail(email, source)
    }

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: email,
      event: 'email_subscribed',
      properties: {
        source,
        is_new_subscriber: !existing,
      },
    })
    await posthog.shutdown()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
  }
}
