import Image from 'next/image'
import Link from 'next/link'
import { YouTubeVideo } from '@/lib/youtube-feed'

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diffMs / 86_400_000)
  if (days === 0) return "aujourd'hui"
  if (days === 1) return 'il y a 1 j'
  if (days < 7) return `il y a ${days} j`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return 'il y a 1 sem'
  if (weeks < 5) return `il y a ${weeks} sem`
  const months = Math.floor(days / 30)
  if (months === 1) return 'il y a 1 mois'
  return `il y a ${months} mois`
}

function NotificationToast({ publishedAt }: { publishedAt?: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,.9)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderRadius: 16,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: 260,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#ff0033',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="11" height="13" viewBox="0 0 11 13" fill="white">
          <path d="M0 0l11 6.5L0 13V0z" />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#8A8A8A', fontWeight: 500 }}>
          YouTube · {publishedAt ? timeAgo(publishedAt) : '—'}
        </div>
        <div style={{ fontSize: 13, color: '#1C1C1C', fontWeight: 600 }}>
          Nouvel épisode en ligne
        </div>
      </div>
    </div>
  )
}

function AvatarRow() {
  const avatars = [
    { initials: 'TB', color: '#E8C97A' },
    { initials: 'SL', color: '#A8C4D4' },
    { initials: 'MD', color: '#C4A8D4' },
    { initials: 'EM', color: '#A8D4B8' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex' }}>
        {avatars.map((a, i) => (
          <div
            key={a.initials}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: a.color,
              border: '2px solid #F5F5F5',
              marginLeft: i === 0 ? 0 : -10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#1C1C1C',
              zIndex: avatars.length - i,
              position: 'relative',
            }}
          >
            {a.initials}
          </div>
        ))}
      </div>
      <span style={{ fontSize: 14, color: '#6E6E6E', fontWeight: 500, maxWidth: 220 }}>
        +1000 personnes satisfaites
      </span>
    </div>
  )
}

interface Props {
  featured: YouTubeVideo | null
}

export default function HeroSection({ featured }: Props) {
  const portrait = featured?.thumbnail ?? null

  return (
    <section
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingTop: 'clamp(40px,6vw,84px)',
        paddingBottom: 'clamp(36px,5vw,64px)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr .95fr',
          gap: 'clamp(32px,5vw,72px)',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* Left — text */}
        <div>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: '.08em',
              textTransform: 'uppercase' as const,
              color: '#EAAF48',
            }}
          >
            Passez au niveau supérieur
          </span>

          <h1
            style={{
              fontSize: 'clamp(40px,5.2vw,62px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginTop: 18,
              color: '#1C1C1C',
            }}
            className="font-display"
          >
            Maîtrisez l&apos;IA pour votre business
          </h1>

          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: '#474747',
              marginTop: 20,
              maxWidth: 480,
            }}
          >
            Vidéos pratiques sur Claude, les agents IA et l&apos;automatisation — pour
            que vous puissiez intégrer ces outils dans votre activité, dès aujourd&apos;hui.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 30,
              flexWrap: 'wrap' as const,
            }}
          >
            <Link
              href="/#interviews"
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
              Voir les vidéos
            </Link>
            <a
              href="https://www.youtube.com/@Z-Start-Web"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                color: '#1C1C1C',
                fontSize: 15,
                fontWeight: 600,
                padding: '13px 24px',
                borderRadius: 12,
                textDecoration: 'none',
                border: '1.5px solid #E9E9E9',
                letterSpacing: '-0.01em',
              }}
            >
              <span>▷</span> Chaîne YouTube
            </a>
          </div>

          <div style={{ marginTop: 40 }}>
            <AvatarRow />
          </div>
        </div>

        {/* Right — portrait + toast */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              borderRadius: 32,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,.18), 0 8px 24px rgba(0,0,0,.10)',
            }}
          >
            {portrait ? (
              <Image
                src={portrait}
                alt={featured?.title ?? 'Dernière vidéo Spark'}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#E9E9E9',
                }}
              />
            )}

            {/* Bottom scrim + caption */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(28,28,28,0) 55%, rgba(28,28,28,.6) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 22,
                bottom: 20,
                color: '#fff',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '.07em',
                  textTransform: 'uppercase' as const,
                  color: '#EAAF48',
                }}
              >
                Dernière vidéo
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginTop: 3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                  maxWidth: 220,
                }}
              >
                {featured?.title ?? 'Spark'}
              </div>
            </div>
          </div>

          {/* Floating notification */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 30,
            }}
          >
            <NotificationToast publishedAt={featured?.publishedAt} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
