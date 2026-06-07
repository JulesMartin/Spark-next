import Image from 'next/image'
import { YouTubeVideo } from '@/lib/youtube-feed'

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        textDecoration: 'none',
        background: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
      }}
      className="interview-card"
    >
      {/* Thumbnail 16:9 */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
        {/* Play icon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0)',
            transition: 'background 180ms ease',
          }}
          className="card-overlay"
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 180ms ease',
              boxShadow: '0 2px 8px rgba(0,0,0,.2)',
            }}
            className="card-play"
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="#1C1C1C">
              <path d="M0 0l14 8L0 16V0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 18px 20px' }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1C1C1C',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}
          className="font-display"
        >
          {video.title}
        </div>
        {video.description && (
          <p
            style={{
              color: '#6E6E6E',
              fontSize: 14,
              marginTop: 8,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}
          >
            {video.description}
          </p>
        )}
        {video.publishedAt && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#AAAAAA', fontWeight: 500 }}>
            {formatDate(video.publishedAt)}
          </div>
        )}
      </div>
    </a>
  )
}

export default function InterviewGrid({ videos }: { videos: YouTubeVideo[] }) {
  return (
    <section
      id="interviews"
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingBottom: 'clamp(44px,6vw,80px)',
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28,
          flexWrap: 'wrap' as const,
          gap: 12,
        }}
      >
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
            Toutes les vidéos
          </span>
          <h2
            style={{
              fontSize: 'clamp(24px,3vw,32px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1C1C1C',
              marginTop: 10,
            }}
            className="font-display"
          >
            Le catalogue Spark
          </h2>
        </div>
        <a
          href={`https://www.youtube.com/channel/UCbfucDBGTg_qarA8qJpMe-A`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontWeight: 600,
            color: '#1C1C1C',
            fontSize: 15,
            display: 'inline-flex',
            gap: 7,
            textDecoration: 'none',
          }}
        >
          Voir la chaîne <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(18px,2.2vw,26px)',
        }}
        className="cards-grid"
      >
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      <style>{`
        .interview-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.06);
        }
        .interview-card:hover .card-overlay { background: rgba(0,0,0,.18) !important; }
        .interview-card:hover .card-play { opacity: 1 !important; }
        @media (max-width: 900px) {
          .cards-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 560px) {
          .cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
