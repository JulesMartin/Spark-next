import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/service'

const resend = new Resend(process.env.RESEND_API_KEY)

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Basic disposable email domain blocklist
const BLOCKED_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net',
  'guerrillamail.org', 'spam4.me', 'trashmail.com', 'trashmail.me',
]

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return BLOCKED_DOMAINS.includes(domain)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot — bots fill this hidden field; real users don't
    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const { name, email, businessType, monthlyRevenue, monthlyClients, motivation } = body

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !businessType || !monthlyRevenue || !monthlyClients) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être remplis.' }, { status: 400 })
    }

    // Validate field lengths
    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Nom invalide.' }, { status: 400 })
    }

    if (motivation && motivation.length > 2000) {
      return NextResponse.json({ error: 'Le message est trop long (max 2000 caractères).' }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmail(email.trim())) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }

    // Block disposable emails
    if (isDisposableEmail(email.trim())) {
      return NextResponse.json({ error: 'Veuillez utiliser une adresse email professionnelle.' }, { status: 400 })
    }

    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    const supabase = createServiceClient()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // Rate limit by email: 1 submission per 24h
    const { data: recentByEmail } = await supabase
      .from('candidatures')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .gte('created_at', oneDayAgo)
      .limit(1)

    if (recentByEmail && recentByEmail.length > 0) {
      return NextResponse.json(
        { error: 'Une candidature avec cette adresse a déjà été soumise. Réessayez dans 24h.' },
        { status: 429 }
      )
    }

    // Rate limit by IP: 3 submissions per hour
    const { data: recentByIp } = await supabase
      .from('candidatures')
      .select('id')
      .eq('ip', ip)
      .gte('created_at', oneHourAgo)

    if (recentByIp && recentByIp.length >= 3) {
      return NextResponse.json(
        { error: 'Trop de tentatives depuis votre adresse. Réessayez dans 1h.' },
        { status: 429 }
      )
    }

    // Store the candidature
    const { error: insertError } = await supabase.from('candidatures').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      business_type: businessType,
      monthly_revenue: monthlyRevenue,
      monthly_clients: monthlyClients,
      motivation: motivation?.trim() ?? null,
      ip,
    })

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
    }

    // Send notification email
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Spark <candidatures@spark.fr>',
      to: process.env.CONTACT_EMAIL!,
      subject: `Nouvelle candidature invité — ${name.trim()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="font-size: 20px; margin-bottom: 24px; border-bottom: 2px solid #E8A320; padding-bottom: 12px;">
            Nouvelle candidature invité
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; width: 40%; color: #555;">Nom</td>
              <td style="padding: 10px 0;">${name.trim()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email</td>
              <td style="padding: 10px 0;"><a href="mailto:${email.trim()}">${email.trim()}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Type de business</td>
              <td style="padding: 10px 0;">${businessType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Revenu mensuel</td>
              <td style="padding: 10px 0;">${monthlyRevenue}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Clients / mois</td>
              <td style="padding: 10px 0;">${monthlyClients}</td>
            </tr>
            ${motivation ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">Motivation</td>
              <td style="padding: 10px 0; white-space: pre-wrap;">${motivation.trim()}</td>
            </tr>` : ''}
          </table>
        </div>
      `,
    })

    if (emailError) {
      // Email failed but candidature is saved — log and continue
      console.error('Resend email error:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Candidature route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
  }
}
