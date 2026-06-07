import Image from 'next/image'
import { YouTubeVideo } from '@/lib/youtube-feed'

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function FeaturedInterview({ video }: { video: YouTubeVideo | null }) {
  if (!video) return null

  return (
    <section
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingBottom: 'clamp(36px,5vw,64px)',
      }}
    >
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          style={{
            overflow: 'hidden',
            borderRadius: 32,
            background: '#FFFFFF',
            boxShadow: '0 2px 12px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.04)',
            display: 'grid',
            gridTemplateColumns: '.92fr 1.08fr',
            alignItems: 'stretch',
            transition: 'box-shadow 200ms ease',
          }}
          className="feat-card"
        >
          {/* Thumbnail */}
          <div style={{ position: 'relative', minHeight: 360 }}>
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 860px) 100vw, 46vw"
            />
            {/* Play button overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,.15)',
                transition: 'background 200ms ease',
              }}
              className="feat-overlay"
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,.92)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,.2)',
                }}
              >
                <svg width="20" height="22" viewBox="0 0 20 22" fill="#1C1C1C">
                  <path d="M0 0l20 11L0 22V0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              padding:
                'clamp(26px,3vw,44px) clamp(24px,3vw,48px) clamp(26px,3vw,44px) clamp(24px,3vw,48px)',
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
              Dernière vidéo
            </span>

            <h2
              style={{
                fontSize: 'clamp(22px,2.8vw,34px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: '#1C1C1C',
                marginTop: 14,
                maxWidth: 460,
              }}
              className="font-display"
            >
              {video.title}
            </h2>

            {video.description && (
              <p
                style={{
                  color: '#474747',
                  fontSize: 16,
                  lineHeight: 1.6,
                  marginTop: 18,
                  maxWidth: 480,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                }}
              >
                {video.description}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                marginTop: 26,
                flexWrap: 'wrap' as const,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#1C1C1C',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '11px 22px',
                  borderRadius: 10,
                  letterSpacing: '-0.01em',
                }}
              >
                Regarder sur YouTube <span>→</span>
              </span>
              {video.publishedAt && (
                <span style={{ color: '#8A8A8A', fontSize: 14 }}>
                  {formatDate(video.publishedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </a>

      <style>{`
        .feat-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.06); }
        @media (max-width: 860px) {
          .feat-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
