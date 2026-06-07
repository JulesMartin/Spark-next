'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  body?: string
  tags?: string[]
  publishedAt?: string
  coverImageUrl?: string
  youtubeUrl?: string
}

function readTime(body?: string): string {
  if (!body) return '3 min'
  const words = body.trim().split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} min`
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function kicker(post: SanityPost): string {
  return post.tags?.[0] ?? 'Article'
}

function FeaturedPost({ post }: { post: SanityPost }) {
  const img = post.coverImageUrl ?? null
  const slug = post.slug.current

  return (
    <section
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingBottom: 'clamp(36px,5vw,60px)',
      }}
    >
      <Link
        href={`/blog/${slug}`}
        style={{ display: 'block', textDecoration: 'none' }}
      >
        <div
          style={{
            overflow: 'hidden',
            borderRadius: 32,
            background: '#FFFFFF',
            boxShadow: '0 2px 12px rgba(0,0,0,.06)',
            display: 'grid',
            gridTemplateColumns: '1.1fr .9fr',
            alignItems: 'stretch',
            transition: 'transform 180ms ease, box-shadow 180ms ease',
          }}
          className="feat-card"
        >
          {/* Image */}
          <div
            style={{
              position: 'relative',
              minHeight: 340,
              background: img ? undefined : '#E9E9E9',
            }}
          >
            {img && (
              <Image
                src={img}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 860px) 100vw, 55vw"
              />
            )}
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
                color: '#6E6E6E',
                background: '#F1F1F1',
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid #E9E9E9',
              }}
            >
              {kicker(post)}
            </span>

            <h2
              style={{
                fontSize: 'clamp(24px,2.8vw,34px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: '#1C1C1C',
                marginTop: 16,
                maxWidth: 440,
              }}
              className="font-display"
            >
              {post.title}
            </h2>

            {post.excerpt && (
              <p
                style={{
                  color: '#474747',
                  fontSize: 16,
                  lineHeight: 1.6,
                  marginTop: 16,
                  maxWidth: 460,
                }}
              >
                {post.excerpt}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
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
                Lire l&apos;article <span>→</span>
              </span>
              <span style={{ color: '#8A8A8A', fontSize: 14 }}>
                {readTime(post.body)} de lecture
                {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        .feat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,.1);
        }
        @media (max-width: 860px) {
          .feat-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function PostCard({ post }: { post: SanityPost }) {
  const img = post.coverImageUrl ?? null
  const slug = post.slug.current

  return (
    <Link
      href={`/blog/${slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
      }}
      className="post-card"
    >
      {/* Cover 16:10 */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16/10',
          overflow: 'hidden',
          background: '#F1F1F1',
        }}
      >
        {img && (
          <Image
            src={img}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        )}
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            background: '#1C1C1C',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: 999,
          }}
        >
          {kicker(post)}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 22px' }}>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.22,
            color: '#1C1C1C',
          }}
          className="font-display"
        >
          {post.title}
        </h3>
        <div
          style={{ marginTop: 14, fontSize: 13.5, color: '#8A8A8A' }}
        >
          {readTime(post.body)} de lecture
          {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
        </div>
      </div>
    </Link>
  )
}

export default function BlogContent({ posts }: { posts: SanityPost[] }) {
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags ?? []))
  ).filter(Boolean)
  const filters = ['Tout', ...allTags]

  const [active, setActive] = useState('Tout')

  const filtered =
    active === 'Tout'
      ? posts
      : posts.filter((p) => p.tags?.includes(active))

  const [featured, ...rest] = filtered

  return (
    <>
      {/* Page header */}
      <section
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingTop: 'clamp(40px,6vw,80px)',
          paddingBottom: 30,
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
          Le journal
        </span>

        <h1
          style={{
            fontSize: 'clamp(36px,5vw,56px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#1C1C1C',
            marginTop: 16,
            maxWidth: 760,
          }}
          className="font-display"
        >
          Coulisses, décryptages &amp; méthode
        </h1>

        <p
          style={{
            fontSize: 19,
            color: '#474747',
            marginTop: 18,
            maxWidth: 560,
            lineHeight: 1.55,
          }}
        >
          Ce que nous apprenons en filmant celles et ceux qui construisent — et
          la façon dont nous fabriquons chaque épisode de Spark.
        </p>

        {/* Filter pills */}
        <div
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginTop: 30 }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              style={{
                height: 38,
                padding: '0 16px',
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                border: `1px solid ${active === f ? '#1C1C1C' : '#E9E9E9'}`,
                background: active === f ? '#1C1C1C' : '#fff',
                color: active === f ? '#fff' : '#474747',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      {filtered.length === 0 ? (
        <div
          style={{
            maxWidth: 1200,
            marginInline: 'auto',
            paddingInline: 'clamp(20px,5vw,56px)',
            paddingBottom: 80,
          }}
        >
          <p style={{ color: '#8A8A8A', fontSize: 17 }}>
            Pas encore d&apos;article dans cette catégorie.
          </p>
        </div>
      ) : (
        <>
          {featured && <FeaturedPost post={featured} />}

          {rest.length > 0 && (
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
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  marginBottom: 26,
                }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(22px,2.4vw,28px)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#1C1C1C',
                  }}
                  className="font-display"
                >
                  Derniers articles
                </h2>
                <span
                  style={{
                    fontWeight: 600,
                    color: '#1C1C1C',
                    fontSize: 15,
                  }}
                >
                  Tous les articles →
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'clamp(18px,2.2vw,26px)',
                }}
                className="blog-grid"
              >
                {rest.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <style>{`
        .post-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,.1);
        }
        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 560px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
