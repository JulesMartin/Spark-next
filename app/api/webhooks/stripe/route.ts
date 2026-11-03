import { NextRequest, NextResponse } from 'next/server'
import { stopCampaignSequence } from '@/lib/campaign-sequence'
import { sanitizeEmail } from '@/lib/sanitize'
import { verifyStripeSignature } from '@/lib/stripe-signature'

export const dynamic = 'force-dynamic'

// Sessions créées par le serveur de livraison d'Auto-Post : les autres ventes du compte
// Stripe, s'il y en a un jour, ne coupent rien.
const AUTO_POST_SUCCESS_URL = 'https://livraison.jules-api.xyz/merci'

const PAID_EVENTS = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded'])

type CheckoutSession = {
  payment_status?: string
  success_url?: string | null
  customer_email?: string | null
  customer_details?: { email?: string | null } | null
}

// Un achat d'Auto-Post coupe les mails de vente envoyés à cette adresse.
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET manquant')
    return NextResponse.json({ error: 'Webhook non configuré.' }, { status: 503 })
  }

  const payload = await request.text()
  if (!verifyStripeSignature(payload, request.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 })
  }

  let event: { type?: string; data?: { object?: CheckoutSession } }
  try {
    event = JSON.parse(payload)
  } catch {
    return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 })
  }

  const session = event.data?.object
  const isPaidAutoPost =
    PAID_EVENTS.has(event.type ?? '') &&
    session?.payment_status === 'paid' &&
    session.success_url?.startsWith(AUTO_POST_SUCCESS_URL)
  if (!isPaidAutoPost) return NextResponse.json({ received: true, ignored: true })

  const email = sanitizeEmail(session.customer_details?.email ?? session.customer_email)
  if (!email) {
    console.error('Achat Auto-Post sans adresse exploitable')
    return NextResponse.json({ received: true, ignored: true })
  }

  try {
    await stopCampaignSequence(email, 'auto-post', 'purchase')
  } catch (error) {
    // 500 : Stripe renverra l'événement, l'acheteur ne restera pas dans les relances.
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Erreur temporaire.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
