import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { unsubscribeBrevoContact } from '@/lib/brevo'
import { getPostHogClient } from '@/lib/posthog-server'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe-token'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const email = verifyUnsubscribeToken(body.token)
    if (!email) {
      return NextResponse.json({ error: 'Lien de désinscription invalide.' }, { status: 400 })
    }
    if (body.confirm !== true) {
      return NextResponse.json({ error: 'Coche la case pour confirmer.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Le contact reste en base : on vide seulement ses tags et on le marque désinscrit
    const { error: updateError } = await supabase
      .from('email_subscribers')
      .update({
        campaigns: [],
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email)

    if (updateError) {
      console.error('Supabase unsubscribe error:', updateError)
      return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
    }

    await unsubscribeBrevoContact(email)

    const posthog = getPostHogClient()
    posthog.capture({ distinctId: email, event: 'email_unsubscribed' })
    await posthog.shutdown()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unsubscribe route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
  }
}
