import type { Metadata } from 'next'
import Script from 'next/script'
import type { CSSProperties } from 'react'
import SiteShell from '@/components/public/SiteShell'

export const metadata: Metadata = {
  title: 'Réserver un appel — Spark',
  description: 'Réserve un appel découverte pour démarrer ton accompagnement IA.',
  robots: { index: false },
}

const SERVICES = {
  coaching: {
    badge: 'Coaching automatisation',
    headline: 'Réserve ton appel découverte.',
    sub: `Remplis ce formulaire avant de réserver un appel de découverte d'une durée de 30min`,
    tallyId: 'WOgDLR',
  },
  automatisation: {
    badge: "Mise en place d'automatisation",
    headline: 'Automatisons ensemble.',
    sub: `Remplis ce formulaire avant de réserver un appel de découverte d'une durée de 30min`,
    tallyId: 'BzgAK7',
  },
  'site-web': {
    badge: 'Création de site web / MVP',
    headline: 'Donnons vie à ton projet.',
    sub: `Remplis ce formulaire pour que je comprenne bien ton projet de site ou de MVP`,
    tallyId: 'Xxg8Jj',
  },
  'automatisation-b2b': {
    badge: 'Automatisation Entreprise',
    headline: "Intégrons l'IA dans tes process.",
    sub: `Remplis ce formulaire pour que j'aie le maximum de détails sur tes besoins`,
    tallyId: 'gDOVyl',
  },
  'site-web-solo': {
    badge: 'Création de site web automatisé',
    headline: 'Créons ton site web.',
    sub: `Remplis ce formulaire pour que je comprenne bien ton projet`,
    tallyId: 'VLqGqM',
  },
  'site-web-entreprise': {
    badge: 'Site web Entreprise',
    headline: 'Créons ton site web.',
    sub: `Remplis ce formulaire pour que je comprenne bien ton projet`,
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
    <SiteShell nav={false} back={{ href: '/services', label: 'Retour aux services' }} clearing={false}>
      <section className="formpage">
        <span className="badge in0">{service.badge}</span>
        <h1 className="in0" style={{ '--d': 100 } as CSSProperties}>{service.headline}</h1>
        <p className="lead in0" style={{ '--d': 200 } as CSSProperties}>{service.sub}</p>

        <div className="formcard in0" style={{ '--d': 320 } as CSSProperties}>
          <iframe
            className="tally"
            src={`https://tally.so/embed/${service.tallyId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
            loading="lazy"
            width="100%"
            height="800"
            title={service.badge}
          />
        </div>

        <p className="fine">Tes informations restent confidentielles et ne sont jamais revendues.</p>
      </section>

      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
    </SiteShell>
  )
}
