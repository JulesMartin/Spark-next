import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Mes services — Spark',
  description: "Coaching IA 1-to-1 et accompagnement B2B par Jules Martin. Passez à l'action avec l'automatisation.",
}

const COACHING_FEATURES = [
  'Sessions individuelles en visio, à ton rythme',
  'Programme 100% adapté à ton niveau et tes objectifs',
  'Claude, automatisations, agents IA, workflows',
  'Exercices pratiques et suivi entre chaque session',
]

const B2B_FEATURES = [
  "Audit de vos processus et identification des gains",
  "Intégration d'outils IA adaptés à votre secteur",
  "Respect des normes de sécurité, de vos données client, RGPD...",
  "Suivi, itérations et optimisation dans la durée",
]

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
          Que vous soyez un particulier ou un professionnel qui veut maîtriser les outils IA, ou une entreprise
          qui cherche à automatiser ses processus métier, je vous accompagne avec des méthodes concrètes, testées,
          directement applicables.
        </p>
      </section>

      {/* Offers grid */}
      <section
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingBottom: 'clamp(64px,9vw,120px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(20px,3vw,40px)',
          alignItems: 'stretch',
        }}
        className="services-grid"
      >
        {/* Coaching column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Unified block: yellow header + dark body */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div
              style={{
                background: '#EAAF48',
                padding: 'clamp(18px,2.5vw,28px) clamp(32px,4vw,56px)',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(22px,2.5vw,34px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#1C1C1C',
                  lineHeight: 1.1,
                  margin: 0,
                }}
                className="font-display"
              >
                Coaching de formation individuel
              </h2>
            </div>

          {/* Coaching card — dark */}
          <div
            style={{
              background: '#1C1C1C',
              padding: 'clamp(32px,4vw,56px)',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
          <h2
            style={{
              fontSize: 'clamp(14px,3vw,26px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginTop: 0,
              lineHeight: 1.15,
            }}
            className="font-display"
          >
            Apprends l&apos;automatisation IA à ton rythme
          </h2>

          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,.65)',
              marginTop: 18,
              lineHeight: 1.65,
            }}
          >
            Un accompagnement sur mesure pour passer de la curiosité à la maîtrise.
            On construit ta pratique de l&apos;IA et des automatisations adaptée à ta
            situation réelle — business, travail ou reconversion.
          </p>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '28px 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 13,
            }}
          >
            {COACHING_FEATURES.map(f => (
              <li
                key={f}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  fontSize: 15,
                  color: 'rgba(255,255,255,.8)',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: '#EAAF48', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                  →
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: 40 }}>
            <Link
              href="/reserver?type=coaching"
              style={{
                display: 'inline-block',
                background: '#EAAF48',
                color: '#1C1C1C',
                fontSize: 15,
                fontWeight: 700,
                padding: '14px 28px',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              Réserver un appel →
            </Link>
          </div>
          </div>
          </div>
        </div>

        {/* B2B column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Unified block: yellow header + white body */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div
              style={{
                background: '#EAAF48',
                padding: 'clamp(18px,2.5vw,28px) clamp(32px,4vw,56px)',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(22px,2.5vw,34px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#1C1C1C',
                  lineHeight: 1.1,
                  margin: 0,
                }}
                className="font-display"
              >
                Implémentation d&apos;automatisation
              </h2>
            </div>

          {/* B2B card — light */}
          <div
            style={{
              background: '#fff',
              border: '1.5px solid #E9E9E9',
              borderTop: 'none',
              padding: 'clamp(32px,4vw,56px)',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
          <h2
            style={{
              fontSize: 'clamp(14px,3vw,26px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1C1C1C',
              marginTop: 0,
              lineHeight: 1.15,
            }}
            className="font-display"
          >
            Intégrez l&apos;automatisation dans vos process
          </h2>

          <p
            style={{
              fontSize: 16,
              color: '#474747',
              marginTop: 18,
              lineHeight: 1.65,
            }}
          >
            Vous sentez que l&apos;IA peut transformer votre activité mais vous ne savez pas
            par où commencer. J&apos;interviens en audit, implémentation et formation
            pour des gains concrets et mesurables.
          </p>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '28px 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 13,
            }}
          >
            {B2B_FEATURES.map(f => (
              <li
                key={f}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  fontSize: 15,
                  color: '#474747',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: '#EAAF48', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                  →
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: 40 }}>
            <Link
              href="/reserver?type=b2b"
              style={{
                display: 'inline-block',
                background: '#1C1C1C',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                padding: '14px 28px',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              Réserver un appel →
            </Link>
          </div>
          </div>
          </div>
        </div>
      </section>

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

      <style>{`
        @media (max-width: 740px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
