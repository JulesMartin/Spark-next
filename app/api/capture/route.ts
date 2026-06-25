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

    const email = body.email?.trim().toLowerCase()
    const campaign = body.campaign?.trim() ?? 'default'
    const socialHandle = body.social_handle?.trim() || null

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id, campaigns')
      .eq('email', email)
      .maybeSingle()

    const isNewCampaign = !existing?.campaigns?.includes(campaign)
    const allCampaigns: string[] = existing
      ? isNewCampaign
        ? [...(existing.campaigns ?? []), campaign]
        : (existing.campaigns ?? [campaign])
      : [campaign]

    if (!existing) {
      const { error: insertError } = await supabase.from('email_subscribers').insert({
        email,
        source: campaign,
        campaigns: allCampaigns,
        social_handle: socialHandle,
      })
      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
      }
    } else if (isNewCampaign || socialHandle) {
      await supabase
        .from('email_subscribers')
        .update({
          campaigns: allCampaigns,
          ...(socialHandle ? { social_handle: socialHandle } : {}),
        })
        .eq('email', email)
    }

    await upsertBrevoContact({ email, campaigns: allCampaigns, socialHandle })

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
