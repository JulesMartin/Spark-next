import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ServicesOffers from '@/components/public/ServicesOffers'

export const metadata: Metadata = {
  title: 'Mes services — Spark',
  description: "Coaching et mise en place d'automatisation IA par Jules Martin. Pour les indépendants comme pour les entreprises.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />

      {/* Hero */}
      <section
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingTop: 'clamp(52px,7vw,100px)',
          paddingBottom: 'clamp(40px,5vw,64px)',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '.08em',
            textTransform: 'uppercase' as const,
            color: '#EAAF48',
          }}
        >
          Mes services
        </span>
        <h1
          style={{
            fontSize: 'clamp(36px,5vw,60px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: '#1C1C1C',
            marginTop: 14,
            maxWidth: 680,
          }}
          className="font-display"
        >
          Passez à l&apos;action avec l&apos;automatisation
        </h1>
        <p
          style={{
            fontSize: 19,
            color: '#474747',
            marginTop: 20,
            lineHeight: 1.6,
          }}
        >
          L&apos;IA transforme déjà la façon dont les professionnels travaillent et dont les entreprises opèrent.
          La question n&apos;est plus de savoir si vous devez l&apos;intégrer, mais comment le faire efficacement.
          <br /><br />
          Trois façons d&apos;avancer ensemble : je vous forme à l&apos;automatisation, je la mets en place
          pour vous, ou je crée votre site web et vos MVP. Que vous travailliez seul ou avec une équipe.
        </p>
      </section>

      {/* Two offers */}
      <ServicesOffers />

      {/* Bottom CTA band */}
      <section
        style={{
          background: '#FBF2DC',
          borderTop: '1px solid #E9E9E9',
          padding: 'clamp(40px,5vw,64px) clamp(20px,5vw,56px)',
          textAlign: 'center' as const,
        }}
      >
        <p
          style={{
            fontSize: 15,
            color: '#6E6E6E',
            maxWidth: 480,
            marginInline: 'auto',
            lineHeight: 1.6,
          }}
        >
          Pas sûr de l&apos;offre qui vous correspond ?{' '}
          <Link
            href="/reserver"
            style={{ color: '#1C1C1C', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            Réservez un appel
          </Link>{' '}
          et on en discute ensemble.
        </p>
      </section>

      <Footer />
    </main>
  )
}
