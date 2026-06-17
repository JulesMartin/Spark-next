import type { Metadata } from 'next'
import Script from 'next/script'
import Footer from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Réserver un appel — Spark',
  description: 'Réserve un appel découverte pour démarrer ton accompagnement IA.',
  robots: { index: false },
}

const META = {
  coaching: {
    badge: '✦ Coaching individuel',
    headline: 'Réserve ton appel découverte.',
    sub: "Remplis ce formulaire afin que j'ai le maximum de détails sur tes besoins",
  },
  b2b: {
    badge: '✦ Accompagnement Entreprise',
    headline: 'Parlons de votre projet.',
    sub: "Remplissez ce formulaire afin que j'ai le maximum de détails sur vos besoins",
  },
}

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const type = params.type === 'b2b' ? 'b2b' : 'coaching'
  const meta = META[type]

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
          href="/services"
          className="text-xs text-black/50 hover:text-black transition-colors"
          style={{ fontFamily: 'var(--font-assistant)' }}
        >
          Retour aux services
        </a>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-12 min-h-0">
        <div className="w-full max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              className="text-xs font-black uppercase tracking-[0.2em] text-black px-3 py-1 border-2 border-black"
              style={{ background: '#FEE04F', fontFamily: 'var(--font-raleway)' }}
            >
              {meta.badge}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black mb-4"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {meta.headline}
          </h1>

          <p
            className="text-base text-black/60 mb-8"
            style={{ fontFamily: 'var(--font-assistant)' }}
          >
            {meta.sub}
          </p>

          {/* Type switcher */}
          <div className="flex gap-2 mb-8">
            <a
              href="/reserver?type=coaching"
              style={{
                border: '2px solid black',
                padding: '6px 16px',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'black',
                background: type === 'coaching' ? '#FEE04F' : 'transparent',
                textDecoration: 'none',
                fontFamily: 'var(--font-raleway)',
              }}
            >
              Coaching individuel
            </a>
            <a
              href="/reserver?type=b2b"
              style={{
                border: '2px solid black',
                padding: '6px 16px',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'black',
                background: type === 'b2b' ? '#FEE04F' : 'transparent',
                textDecoration: 'none',
                fontFamily: 'var(--font-raleway)',
              }}
            >
              Accompagnement Entreprise
            </a>
          </div>

          {/* Form */}
          <div className="bg-white border-2 border-black" style={{ boxShadow: '6px 6px 0 #1A1A1A', padding: '32px' }}>
            {type === 'coaching' ? (
              <iframe
                data-tally-src="https://tally.so/embed/xX675d?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="800"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                title="Coaching 1 to 1 avec Jules"
              />
            ) : (
              <iframe
                data-tally-src="https://tally.so/embed/gDOVyl?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="800"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                title="Intervention en entreprise de Jules"
              />
            )}
          </div>

          <p
            className="mt-4 text-xs text-black/40 text-center"
            style={{ fontFamily: 'var(--font-assistant)' }}
          >
            Vos informations restent confidentielles et ne sont jamais revendues.
          </p>
        </div>
      </main>

      <Footer />

      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
    </div>
  )
}
