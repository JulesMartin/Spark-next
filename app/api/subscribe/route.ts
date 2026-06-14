import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { upsertBrevoContact, sendCampaignEmail } from '@/lib/brevo'
import { appendEmailToSheet } from '@/lib/google-sheets'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot
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
      .select('id')
      .eq('email', email)
      .limit(1)

    if (!existing || existing.length === 0) {
      const { error: insertError } = await supabase.from('email_subscribers').insert({
        email,
        source,
      })
      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
      }
    }

    await upsertBrevoContact({ email, campaign: source })
    await sendCampaignEmail(email, source)
    appendEmailToSheet(email, source).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
  }
}
