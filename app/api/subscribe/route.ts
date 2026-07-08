import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { upsertBrevoContact, sendCampaignEmail } from '@/lib/brevo'
import { getPostHogClient } from '@/lib/posthog-server'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const firstName = body.first_name?.trim() || null
    const email = body.email?.trim().toLowerCase()
    const source = body.source ?? 'prompts-ia'
    const phone = body.phone?.trim() || null

    if (!firstName) {
      return NextResponse.json({ error: 'Prénom requis.' }, { status: 400 })
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }
    if (!phone) {
      return NextResponse.json({ error: 'Numéro de téléphone requis.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id, campaigns')
      .eq('email', email)
      .maybeSingle()

    const isNewCampaign = !existing?.campaigns?.includes(source)
    const allCampaigns: string[] = existing
      ? isNewCampaign
        ? [...(existing.campaigns ?? []), source]
        : (existing.campaigns ?? [source])
      : [source]

    if (!existing) {
      const { error: insertError } = await supabase.from('email_subscribers').insert({
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
          ...(phone ? { phone } : {}),
          ...(firstName ? { first_name: firstName } : {}),
        })
        .eq('email', email)
    }

    await upsertBrevoContact({ email, campaigns: allCampaigns, phone, firstName })

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
