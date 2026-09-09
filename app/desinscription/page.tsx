import type { Metadata } from 'next'
import UnsubscribeForm from '@/components/desinscription/UnsubscribeForm'
import Footer from '@/components/public/Footer'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe-token'

export const metadata: Metadata = {
  title: 'Se désinscrire — Spark',
  description: 'Gère tes préférences de réception des emails Spark.',
  robots: { index: false },
}

export default async function DesinscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>
}) {
  const params = await searchParams
  const token = params.t ?? ''
  const email = verifyUnsubscribeToken(token)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FCFCD0' }}>
      {/* Nav */}
      <nav className="px-6 py-4 border-b-2 border-black flex items-center justify-between">
        <a
          href="/"
          className="text-sm font-black uppercase tracking-[0.2em] text-black"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          SPARK
        </a>
        <a
          href="/"
          className="text-xs text-black/50 hover:text-black transition-colors"
          style={{ fontFamily: 'var(--font-assistant)' }}
        >
          Accéder au site
        </a>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-16 min-h-0">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              className="text-xs font-black uppercase tracking-[0.2em] text-black px-3 py-1 border-2 border-black"
              style={{ background: '#FEE04F', fontFamily: 'var(--font-raleway)' }}
            >
              ✦ Désinscription
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black mb-4"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Ne plus recevoir mes emails
          </h1>

          <p
            className="text-base text-black/60 mb-8"
            style={{ fontFamily: 'var(--font-assistant)' }}
          >
            {email
              ? 'Confirme ci-dessous et tu es retiré de la séquence immédiatement. Aucune justification à donner.'
              : 'Ce lien de désinscription est invalide ou incomplet.'}
          </p>

          {/* Form card */}
          <div
            className="bg-white border-2 border-black p-6"
            style={{ boxShadow: '6px 6px 0 #1A1A1A' }}
          >
            {email ? (
              <UnsubscribeForm email={email} token={token} />
            ) : (
              <div style={{ fontFamily: 'var(--font-assistant)' }}>
                <p className="text-sm text-black mb-4">
                  Utilise le lien « Se désinscrire » présent en bas de n&apos;importe lequel de mes
                  emails. S&apos;il ne fonctionne toujours pas, écris-moi et je te retire à la main.
                </p>
                <a
                  href="mailto:contact@jules-api.xyz?subject=Désinscription"
                  className="inline-block border-2 border-black px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  style={{
                    background: '#FEE04F',
                    boxShadow: '3px 3px 0 #1A1A1A',
                    fontFamily: 'var(--font-raleway)',
                  }}
                >
                  Écrire à Jules
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
