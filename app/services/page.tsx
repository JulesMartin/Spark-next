import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Services — Spark',
  description: "Coaching IA 1-to-1 et accompagnement B2B par Jules Martin. Passez à l'action avec l'intelligence artificielle.",
}

const COACHING_FEATURES = [
  'Sessions individuelles en visio, à votre rythme',
  'Programme 100% adapté à votre niveau et objectifs',
  'Claude, automatisations, agents IA, workflows',
  'Exercices pratiques et suivi entre chaque session',
]

const B2B_FEATURES = [
  "Audit de vos processus et identification des gains",
  "Intégration d'outils IA adaptés à votre secteur",
  "Formation et montée en compétences de l'équipe",
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
          Services
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
          Passez à l&apos;action avec l&apos;IA
        </h1>
        <p
          style={{
            fontSize: 19,
            color: '#474747',
            marginTop: 20,
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Solo ou en équipe, je vous accompagne pour passer de &laquo;&nbsp;j&apos;essaie des trucs&nbsp;&raquo;
          à &laquo;&nbsp;je maîtrise vraiment&nbsp;&raquo;.
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
        {/* Coaching card — dark */}
        <div
          style={{
            background: '#1C1C1C',
            padding: 'clamp(32px,4vw,56px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.08em',
              textTransform: 'uppercase' as const,
              color: '#EAAF48',
            }}
          >
            Coaching personnalisé
          </span>

          <h2
            style={{
              fontSize: 'clamp(26px,3vw,38px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginTop: 18,
              lineHeight: 1.15,
            }}
            className="font-display"
          >
            Apprends l&apos;IA à ton rythme
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

        {/* B2B card — light */}
        <div
          style={{
            background: '#fff',
            border: '1.5px solid #E9E9E9',
            padding: 'clamp(32px,4vw,56px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.08em',
              textTransform: 'uppercase' as const,
              color: '#EAAF48',
            }}
          >
            Entreprises &amp; TPE
          </span>

          <h2
            style={{
              fontSize: 'clamp(26px,3vw,38px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1C1C1C',
              marginTop: 18,
              lineHeight: 1.15,
            }}
            className="font-display"
          >
            Intégrez l&apos;IA dans vos process
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
