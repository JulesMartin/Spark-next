import type { Metadata } from 'next'
import CaptureForm from '@/components/capture/CaptureForm'
import Footer from '@/components/public/Footer'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCampaignConfig, isAutoPostGuide } from '@/lib/campaigns'
import { hasCampaignTemplate } from '@/lib/brevo'

type Props = { searchParams: Promise<{ c?: string; classic?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { c } = await searchParams
  const config = getCampaignConfig(c)
  return {
    title: config ? `${config.title} — ${config.brand}` : 'Ressource gratuite — Spark',
    description: config?.lead ?? (config ? config.title : 'Reçois ta ressource gratuite directement dans ta boîte mail.'),
    robots: { index: false },
  }
}

export default async function CapturePage({ searchParams }: Props) {
  const params = await searchParams
  const campaign = params.c ?? 'default'
  const config = getCampaignConfig(campaign)
  // Une page Auto-Post sans mail à envoyer n'existe pas (site pas encore redéployé, modèle absent, adresse inventée).
  if (config && !hasCampaignTemplate(campaign)) notFound()

  // Les guides Auto-Post s'ouvrent en pop-up par-dessus la landing (moins de visiteurs perdus entre les deux sites).
  // `?classic=1` garde cette page ; CAPTURE_POPUP=0 la remet pour tout le monde.
  if (config && isAutoPostGuide(campaign) && params.classic !== '1' && process.env.CAPTURE_POPUP !== '0') {
    redirect(
      `https://auto-post.jules-api.com/?c=${encodeURIComponent(campaign)}&utm_source=instagram&utm_medium=capture&utm_campaign=${encodeURIComponent(campaign)}`
    )
  }

  if (config) {
    // Pages Auto-Post : mêmes couleurs, polices et formes que la landing (auto-post.jules-api.com).
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#00223e', color: '#f2ebdd', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        <nav className="px-6 sm:px-10 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(242,235,221,0.16)' }}>
          <a
            href={config.brandHref}
            className="uppercase tracking-[0.04em] text-xl"
            style={{ fontFamily: 'var(--font-anton), Impact, sans-serif', color: '#f2ebdd' }}
          >
            Auto-<span style={{ color: '#ffa17f' }}>Post</span>
          </a>
        </nav>

        <main className="flex-1 flex items-center justify-center px-5 sm:px-10 py-14 sm:py-20">
          <div className="w-full max-w-lg">
            <h1
              className="uppercase leading-[1.2] mb-5 text-[clamp(2rem,7.5vw,3rem)]"
              style={{ fontFamily: 'var(--font-anton), Impact, sans-serif', fontWeight: 400, color: '#f2ebdd' }}
            >
              {config.title}
            </h1>
            {config.lead && (
              <p className="text-base sm:text-lg mb-8" style={{ color: 'rgba(242,235,221,0.74)' }}>
                {config.lead}
              </p>
            )}
            <div
              className="w-full p-6 sm:p-8"
              style={{ background: 'rgba(242,235,221,0.06)', border: '1px solid rgba(242,235,221,0.16)', borderRadius: 20 }}
            >
              <CaptureForm campaign={campaign} />
            </div>
          </div>
        </main>

        <footer
          className="px-6 py-6 flex justify-center gap-6 text-xs"
          style={{ borderTop: '1px solid rgba(242,235,221,0.16)', color: 'rgba(242,235,221,0.6)' }}
        >
          <a href="/mentions-legales" className="underline">Mentions légales</a>
          <a href="/confidentialite" className="underline">Confidentialité</a>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FCFCD0' }}>
      {/* Nav */}
      <nav className="px-6 py-4 border-b-2 border-black flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-black uppercase tracking-[0.2em] text-black"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          SPARK
        </Link>
        {(
          <Link
            href="/"
            className="text-xs text-black/50 hover:text-black transition-colors"
            style={{ fontFamily: 'var(--font-assistant)' }}
          >
            Accéder au site
          </Link>
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
              ✦ Ressource gratuite
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black mb-4"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Reçois ta ressource dans ta boîte mail
          </h1>

          <p
            className="text-base text-black/60 mb-8"
            style={{ fontFamily: 'var(--font-assistant)' }}
          >
                          <>
                Pense bien à regarder dans l&apos;onglet <strong>Promotions</strong>, <strong>Spam</strong> ou <strong>Courrier indésirable</strong> pour trouver le mail.
              </>

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

      <Footer />
    </div>
  )
}
