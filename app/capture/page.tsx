import type { Metadata } from 'next'
import CaptureForm from '@/components/capture/CaptureForm'
import Footer from '@/components/public/Footer'
import { notFound } from 'next/navigation'
import { getCampaignConfig } from '@/lib/campaigns'
import { hasCampaignTemplate } from '@/lib/brevo'

type Props = { searchParams: Promise<{ c?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { c } = await searchParams
  const config = getCampaignConfig(c)
  return {
    title: config ? `${config.badge.replace(/^✦\s*/, '')} — ${config.brand}` : 'Ressource gratuite — Spark',
    description: config?.lead ?? 'Reçois ta ressource gratuite directement dans ta boîte mail.',
    robots: { index: false },
  }
}

export default async function CapturePage({ searchParams }: Props) {
  const params = await searchParams
  const campaign = params.c ?? 'default'
  const config = getCampaignConfig(campaign)
  // Une page Auto-Post sans mail à envoyer n'existe pas (site pas encore redéployé, modèle absent, adresse inventée).
  if (config && !hasCampaignTemplate(campaign)) notFound()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FCFCD0' }}>
      {/* Nav */}
      <nav className="px-6 py-4 border-b-2 border-black flex items-center justify-between">
        <a
          href={config?.brandHref ?? '/'}
          className="text-sm font-black uppercase tracking-[0.2em] text-black"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {config?.brand ?? 'SPARK'}
        </a>
        {!config && (
          <a
            href="/"
            className="text-xs text-black/50 hover:text-black transition-colors"
            style={{ fontFamily: 'var(--font-assistant)' }}
          >
            Accéder au site
          </a>
        )}
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
              {config?.badge ?? '✦ Ressource gratuite'}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black mb-4"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {config?.title ?? 'Reçois ta ressource dans ta boîte mail'}
          </h1>

          <p
            className="text-base text-black/60 mb-8"
            style={{ fontFamily: 'var(--font-assistant)' }}
          >
            {config?.lead ?? (
              <>
                Pense bien à regarder dans l&apos;onglet <strong>Promotions</strong>, <strong>Spam</strong> ou <strong>Courrier indésirable</strong> pour trouver le mail.
              </>
            )}
          </p>

          {/* Form card */}
          <div
            className="bg-white border-2 border-black p-6"
            style={{ boxShadow: '6px 6px 0 #1A1A1A' }}
          >
            <CaptureForm campaign={campaign} />
          </div>
        </div>
      </main>

      {config ? (
        <footer
          className="px-6 py-6 border-t-2 border-black flex justify-center gap-6 text-xs text-black/60"
          style={{ fontFamily: 'var(--font-assistant)' }}
        >
          <a href="/mentions-legales" className="underline">Mentions légales</a>
          <a href="/confidentialite" className="underline">Confidentialité</a>
        </footer>
      ) : (
        <Footer />
      )}
    </div>
  )
}
