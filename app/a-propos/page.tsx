import Image from 'next/image'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import Newsletter from '@/components/public/Newsletter'
import SkoolSection from '@/components/public/SkoolSection'

export const revalidate = 60

const PRINCIPLES = [
  {
    title: 'Du contenu pratique avant tout',
    body: "Chaque vidéo montre comment utiliser un outil concret dans un contexte réel. Pas de théorie sans application.",
  },
  {
    title: 'Les vraies avancées, testées',
    body: "Je teste les dernières sorties — Claude, Hermes Agent, les nouveaux modèles — avant d'en parler.",
  },
  {
    title: 'Orienté résultats business',
    body: "L'IA ne sert que si elle génère des gains concrets. Mon contenu est calibré pour les professionnels et indépendants, pas pour les chercheurs.",
  },
]

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingTop: 'clamp(40px,6vw,80px)',
          paddingBottom: 'clamp(32px,4vw,56px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr .95fr',
            gap: 'clamp(28px,4vw,64px)',
            alignItems: 'center',
          }}
          className="apropos-hero"
        >
          {/* Left */}
          <div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '.08em',
                textTransform: 'uppercase' as const,
                color: '#EAAF48',
              }}
            >
              À propos de Jules-API
            </span>

            <h1
              style={{
                fontSize: 'clamp(34px,4.6vw,54px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#1C1C1C',
                marginTop: 16,
              }}
              className="font-display"
            >
              Créateur de contenu IA pour les professionnels
            </h1>

            <p
              style={{
                fontSize: 19,
                color: '#474747',
                marginTop: 20,
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              Je crée du contenu éducatif sur l&apos;intelligence artificielle — Claude,
              les agents IA, l&apos;automatisation — pour aider les TPE et professionnels
              à intégrer ces outils dans leur activité.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 14,
                marginTop: 28,
                flexWrap: 'wrap' as const,
              }}
            >
              <a
                href="https://www.youtube.com/@Z-Start-Web"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#1C1C1C',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  padding: '13px 24px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                <span>▷</span> Voir la chaîne YouTube
              </a>
            </div>
          </div>

          {/* Right — portrait */}
          <div
            style={{
              aspectRatio: '5/6',
              borderRadius: 32,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,.16), 0 8px 24px rgba(0,0,0,.08)',
              position: 'relative',
            }}
          >
            <Image
              src="/jules-hero.png"
              alt="Jules-API"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 860px) 100vw, 44vw"
            />
          </div>
        </div>
      </section>

      {/* ── Approach ── */}
      <section
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingBottom: 'clamp(44px,6vw,72px)',
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
          Mon approche
        </span>
        <h2
          style={{
            fontSize: 'clamp(24px,3vw,34px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1C1C1C',
            marginTop: 14,
            maxWidth: 560,
          }}
          className="font-display"
        >
          Trois principes, dans chaque vidéo
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 'clamp(20px,2.4vw,32px)',
            marginTop: 36,
          }}
          className="vals-grid"
        >
          {PRINCIPLES.map(({ title, body }) => (
            <div key={title}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#FBF2DC',
                  border: '1.5px solid #EAAF48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: '#B9871F',
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#1C1C1C',
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: '#6E6E6E',
                  lineHeight: 1.6,
                  marginTop: 8,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quote ── */}
      <section
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingBottom: 'clamp(48px,7vw,90px)',
        }}
      >
        <div
          style={{
            background: '#1C1C1C',
            borderRadius: 32,
            padding: 'clamp(34px,5vw,72px)',
            textAlign: 'center' as const,
          }}
        >
          <p
            style={{
              color: '#fff',
              fontSize: 'clamp(22px,3vw,32px)',
              lineHeight: 1.4,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              maxWidth: 760,
              margin: '0 auto',
            }}
            className="font-display"
          >
            «&nbsp;L&apos;IA n&apos;est pas réservée aux grandes entreprises. Avec les bons outils,
            un professionnel solo peut se doter de la puissance d&apos;une équipe
            entière.&nbsp;»
          </p>
        </div>
      </section>

      <SkoolSection />
      <Newsletter />
      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .apropos-hero { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .vals-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
