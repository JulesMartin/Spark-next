import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/service'

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

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Check for duplicate
    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ success: true })
    }

    // Save to Supabase
    const { error: insertError } = await supabase.from('email_subscribers').insert({
      email,
      source: body.source ?? 'prompts-ia',
    })

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Add to Resend Audience
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (audienceId) {
      const { error: resendError } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      })
      if (resendError) {
        console.error('Resend contact error:', resendError)
      }
    }

    const RESOURCES = [
      { label: 'Claude Cowork Setup',    url: 'https://drive.google.com/file/d/11FMAXQrZ0mVIechf4tHfAXZ5pgGSaZz-/view?usp=sharing' },
      { label: 'Connecter ses reseaux avec Claude',      url: 'https://drive.google.com/file/d/14U5ZlH9IfyROAISnZaaofYhj47vuHeAe/view?usp=sharing' },
      { label: 'Audit Instagram avec Claude',            url: 'https://drive.google.com/file/d/1ipYxCRwrBcXDgyruy8vuh5pFrRgwQyiJ/view?usp=sharing' },
      { label: '10 Skills Claude (zip)', url: 'https://drive.google.com/file/d/1_SwRlQzNaJyPHAuh19Psk_76iC0QY77U/view?usp=sharing' },
      { label: '233 Prompts (zip)', url: 'https://drive.google.com/file/d/14rNa3i-9LpHV-e-OUOG6HQofGyCZrOOj/view?usp=sharing' },
    ]

    const resourceRows = RESOURCES.map(({ label, url }) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #E9E9E9;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:13px;font-weight:600;color:#1C1C1C;vertical-align:middle;">
                <span style="color:#EAAF48;margin-right:10px;">—</span>${label}
              </td>
              <td align="right" style="vertical-align:middle;">
                <a href="${url}" style="display:inline-block;padding:7px 16px;background:#EAAF48;font-size:12px;font-weight:600;color:#1C1C1C;text-decoration:none;font-family:Helvetica,Arial,sans-serif;">
                  Télécharger →
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('')

    // Send welcome email
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Spark <onboarding@resend.dev>',
      to: email,
      subject: 'Tes ressources IA — 233 prompts + 10 skills Claude',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
        <body style="margin:0;padding:0;background:#F5F5F5;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:40px 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E9E9E9;max-width:600px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="padding:32px 40px 24px;border-bottom:1px solid #E9E9E9;">
                    <span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#1C1C1C;letter-spacing:-0.5px;">Spark</span>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 40px 8px;">
                    <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#1C1C1C;margin:0 0 16px;line-height:1.15;">
                      C'est dans ta boîte.
                    </h1>
                    <p style="font-size:15px;color:#6E6E6E;line-height:1.6;margin:0 0 32px;">
                      Voici tes 5 ressources. Clique sur chaque lien pour télécharger.
                    </p>

                    <!-- Resources table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E9E9E9;">
                      ${resourceRows}
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:28px 40px 24px;">
                    <p style="font-size:11px;color:#8A8A8A;margin:0;line-height:1.6;">
                      Tu reçois cet email parce que tu t'es inscrit sur spark.fr.
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })

    if (emailError) {
      console.error('Welcome email error:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe route error:', error)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 })
  }
}
