import type { Metadata } from 'next'
import CaptureForm from '@/components/capture/CaptureForm'
import SiteShell from '@/components/public/SiteShell'
import type { CSSProperties } from 'react'
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
    <SiteShell nav={false} back={{ href: '/', label: 'Accéder au site' }} clearing={false} tree="soft">
      {/* L'arbre de points pousse en transparence derrière le titre ; son pied se cache derrière le formulaire. */}
      <section className="formpage hero-tree" style={{ maxWidth: 600 }}>
        <div className="treebox" aria-hidden="true" />
        <h1 className="in0" style={{ '--d': 100 } as CSSProperties}>Reçois ta ressource dans ta boîte mail</h1>
        <p className="lead in0" data-avoid style={{ '--d': 200 } as CSSProperties}>
          Pense bien à regarder dans l&apos;onglet <strong>Promotions</strong>, <strong>Spam</strong> ou{' '}
          <strong>Courrier indésirable</strong> pour trouver le mail.
        </p>

        <div className="formcard in0" data-avoid data-tree-foot style={{ '--d': 320 } as CSSProperties}>
          <CaptureForm campaign={campaign} />
        </div>
      </section>
    </SiteShell>
  )
}
