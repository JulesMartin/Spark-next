import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import SiteShell from '@/components/public/SiteShell'
import ServicesOffers from '@/components/public/ServicesOffers'
import { CALENDLY_URL } from '@/components/public/site-ui'

export const metadata: Metadata = {
  title: 'Mes services — Spark',
  description: "Coaching et mise en place d'automatisation IA par Jules Martin. Pour les indépendants comme pour les entreprises.",
}

const d = (ms: number) => ({ '--d': ms }) as CSSProperties

export default function ServicesPage() {
  return (
    <SiteShell>
      <section className="intro">
        <span className="eyebrow in0" style={d(60)}>Mes services</span>
        <h1 className="in0" style={d(140)}>Passe à l&apos;action avec l&apos;automatisation</h1>
        <p className="lead in0" style={d(260)}>
          L&apos;IA transforme déjà la façon dont les professionnels travaillent et dont les entreprises opèrent.
          La question n&apos;est plus de savoir si tu dois l&apos;intégrer, mais comment le faire efficacement.
        </p>
        <p className="lead in0" style={d(340)}>
          Trois façons d&apos;avancer ensemble : je te forme à l&apos;automatisation, je la mets en place
          pour toi, ou je crée ton site web et tes MVP. Que tu travailles seul ou avec une équipe.
        </p>
      </section>

      <ServicesOffers />

      <div className="band rvb">
        <p>
          Pas sûr de l&apos;offre qui te correspond ?{' '}
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Réserve un appel</a>{' '}
          et on en discute ensemble.
        </p>
      </div>
    </SiteShell>
  )
}
