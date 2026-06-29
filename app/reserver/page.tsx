import type { Metadata } from 'next'
import Script from 'next/script'
import Footer from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Réserver un appel — Spark',
  description: 'Réserve un appel découverte pour démarrer ton accompagnement IA.',
  robots: { index: false },
}

const SERVICES = {
  coaching: {
    badge: '✦ Coaching automatisation',
    headline: 'Réservez votre appel découverte.',
    sub: `Veuillez remplir ce formulaire avant de réserver un appel de découverte d'une durée de 30min`,
    tallyId: 'WOgDLR',
  },
  automatisation: {
    badge: "✦ Mise en place d'automatisation",
    headline: 'Automatisons ensemble.',
    sub: `Veuillez remplir ce formulaire avant de réserver un appel de découverte d'une durée de 30min`,
    tallyId: 'BzgAK7',
  },
  'site-web': {
    badge: '✦ Création de site web / MVP',
    headline: 'Donnons vie à votre projet.',
    sub: `Remplissez ce formulaire pour que je comprenne bien votre projet de site ou de MVP`,
    tallyId: 'Xxg8Jj',
  },
  'automatisation-b2b': {
    badge: '✦ Automatisation Entreprise',
    headline: "Intégrons l'IA dans vos process.",
    sub: `Remplissez ce formulaire pour que j'aie le maximum de détails sur vos besoins`,
    tallyId: 'gDOVyl',
  },
  'site-web-solo': {
    badge: '✦ Création de site web automatisé',
    headline: 'Créons ton site web.',
    sub: `Remplis ce formulaire pour que je comprenne bien ton projet`,
    tallyId: 'VLqGqM',
  },
  'site-web-entreprise': {
    badge: '✦ Site web Entreprise',
    headline: 'Créons votre site web.',
    sub: `Remplissez ce formulaire pour que je comprenne bien votre projet`,
    tallyId: 'jagZXa',
  },
} as const

type ServiceType = keyof typeof SERVICES

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const type: ServiceType =
    params.type && params.type in SERVICES
      ? (params.type as ServiceType)
      : 'coaching'
  const service = SERVICES[type]

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
              {service.badge}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black mb-4"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {service.headline}
          </h1>

          <p
            className="text-lg text-black/60 mb-8"
            style={{ fontFamily: 'var(--font-assistant)', fontWeight: 400 }}
          >
            {service.sub}
          </p>

          {/* Form */}
          <div className="bg-white border-2 border-black" style={{ boxShadow: '6px 6px 0 #1A1A1A', padding: '32px' }}>
            <iframe
              src={`https://tally.so/embed/${service.tallyId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
              loading="lazy"
              width="100%"
              height="800"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
            />
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
