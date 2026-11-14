import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { addContactToList } from '@/lib/brevo'
import { getPostHogClient } from '@/lib/posthog-server'
import { sanitizeEmail, sanitizeHandle } from '@/lib/sanitize'
import { isWaitlistClosed, tierOf } from '@/lib/waitlist'
import { sendWaitlistEmail } from '@/lib/waitlist-email'

const field = (v: unknown) => sanitizeHandle(v)
const PLATFORMS = ['instagram', 'tiktok', 'youtube']
const cleanUrl = (v: unknown) =>
  typeof v === 'string' && /^https?:\/\//.test(v) ? v.replace(/[<>\s]/g, '').slice(0, 500) : null

export async function POST(request: NextRequest) {
  try {
    if (isWaitlistClosed()) {
      return NextResponse.json({ error: "La liste d'attente est fermée." }, { status: 410 })
    }

    const body = await request.json()

    if (body.website) {
      return NextResponse.json({ position: 0, tier: 'late', already: false })
    }

    const email = sanitizeEmail(body.email)
    if (!email) {
      return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 })
    }

    const utm = {
      utm_source: field(body.utm_source),
      utm_medium: field(body.utm_medium),
      utm_campaign: field(body.utm_campaign),
    }
    const referrer = cleanUrl(body.referrer)

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .rpc('join_ai_lab_waitlist', {
        p_email: email,
        p_utm_source: utm.utm_source,
        p_utm_medium: utm.utm_medium,
        p_utm_campaign: utm.utm_campaign,
        p_referrer: referrer,
      })
      .single<{ out_position: number; out_already: boolean }>()

    if (error || !data) {
      console.error('Waitlist insert error:', error)
      return NextResponse.json({ error: 'Une erreur est survenue. Réessaie.' }, { status: 500 })
    }

    const position = data.out_position
    const already = data.out_already
    const tier = tierOf(position)

    if (!already) {
      const handle = field(body.handle)?.replace(/^@+/, '') || null
      const platform = PLATFORMS.includes(body.platform) ? body.platform : null
      if (handle && platform) {
        const { error: socialError } = await supabase
          .from('ai_lab_waitlist')
          .update({ social_platform: platform, social_handle: handle })
          .eq('email', email)
        if (socialError) console.error('Waitlist social update error:', socialError)
      }

      await Promise.all([
        addContactToList(email, Number(process.env.BREVO_WAITLIST_LIST_ID)),
        sendWaitlistEmail(email, position, tier),
      ])

      const posthog = getPostHogClient()
      posthog.capture({
        distinctId: email,
        event: 'waitlist_signup',
        properties: { position, founder: tier === 'founder', tier, social_platform: platform, ...utm, referrer },
      })
      await posthog.shutdown()
    }

    return NextResponse.json({ position, tier, already, founder: tier === 'founder' })
  } catch (error) {
    console.error('Waitlist route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessaie.' }, { status: 500 })
  }
}
