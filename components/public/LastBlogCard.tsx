import Link from 'next/link'
import Image from 'next/image'
import { type SanityPost } from './BlogContent'

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function LastBlogCard({ post }: { post: SanityPost }) {
  const slug = post.slug?.current ?? ''
  const cover = post.coverImageUrl ?? (post.youtubeUrl
    ? `https://img.youtube.com/vi/${post.youtubeUrl.match(/(?:v=|youtu\.be\/)([^&?\s]+)/)?.[1]}/maxresdefault.jpg`
    : null)

  return (
    <section
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingBottom: 'clamp(36px,5vw,56px)',
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '.08em',
            textTransform: 'uppercase' as const,
            color: '#EAAF48',
          }}
        >
          Dernier article
        </span>
      </div>

      <Link
        href={`/blog/${slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
        className="last-blog-card"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 0,
            borderRadius: 20,
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,.06)',
            transition: 'box-shadow 200ms ease',
          }}
          className="last-blog-inner"
        >
          {/* Thumbnail */}
          {cover && (
            <div style={{ position: 'relative', minHeight: 240 }}>
              <Image
                src={cover}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 720px) 100vw, 40vw"
              />
            </div>
          )}

          {/* Content */}
          <div
            style={{
              padding: 'clamp(24px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column' as const,
              justifyContent: 'center',
              gap: 12,
            }}
          >
            {post.tags && post.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                {post.tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '.06em',
                      textTransform: 'uppercase' as const,
                      color: '#EAAF48',
                      background: 'rgba(234,175,72,.1)',
                      padding: '3px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h3
              style={{
                fontSize: 'clamp(18px,2.4vw,28px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#1C1C1C',
                lineHeight: 1.2,
                margin: 0,
              }}
              className="font-display"
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p
                style={{
                  fontSize: 15,
                  color: '#6E6E6E',
                  lineHeight: 1.6,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                }}
              >
                {post.excerpt}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1C1C1C',
                }}
              >
                Lire l&apos;article <span>→</span>
              </span>
              {post.publishedAt && (
                <span style={{ fontSize: 13, color: '#ADADAD' }}>
                  {formatDate(post.publishedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        .last-blog-inner:hover { box-shadow: 0 12px 40px rgba(0,0,0,.1); }
        @media (max-width: 640px) {
          .last-blog-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
