import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { upsertBrevoContact, sendCampaignEmail } from '@/lib/brevo'
import { upsertEmailToSheet } from '@/lib/google-sheets'

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
    const source = body.source ?? 'prompts-ia'

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
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
      })
      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
      }
    } else if (isNewCampaign) {
      await supabase
        .from('email_subscribers')
        .update({ campaigns: allCampaigns })
        .eq('email', email)
    }

    await upsertBrevoContact({ email, campaigns: allCampaigns })

    if (isNewCampaign) {
      await sendCampaignEmail(email, source)
    }

    upsertEmailToSheet(email, allCampaigns, null).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
  }
}
