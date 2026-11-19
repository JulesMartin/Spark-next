'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionTitle, formatDate } from './site-ui'
import { coverOf, readTime, tagKey, tagLabel, type SanityPost } from '@/lib/blog'

export type { SanityPost }

// Nombre de catégories visibles avant « Voir tout ».
const TOP = 6

const kicker = (post: SanityPost) => (post.tags?.[0] ? tagLabel(post.tags[0]) : 'Article')
const meta = (post: SanityPost) => `${readTime(post.body)} de lecture${post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}`
const d = (ms: number) => ({ '--d': ms }) as CSSProperties

function FeaturedPost({ post }: { post: SanityPost }) {
  const img = coverOf(post)
  return (
    <Link className="feature light rvb" href={`/blog/${post.slug.current}`} style={{ marginTop: 'var(--g8)' }}>
      <div className="media">
        {img && <Image src={img} alt={post.title} fill sizes="(max-width: 960px) 100vw, 52vw" />}
      </div>
      <div className="body">
        <span className="eyebrow">{kicker(post)}</span>
        <h3>{post.title}</h3>
        {post.excerpt && <p className="txt">{post.excerpt}</p>}
        <div className="acts">
          <span className="btn solid big i-read">Lire l&apos;article</span>
          <span className="meta">{meta(post)}</span>
        </div>
      </div>
    </Link>
  )
}

function PostCard({ post }: { post: SanityPost }) {
  const img = coverOf(post)
  return (
    <Link className="vcard tall card" href={`/blog/${post.slug.current}`}>
      <div className="thumb">
        {img && <Image src={img} alt={post.title} fill sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 33vw" />}
        <span className="kicker">{kicker(post)}</span>
      </div>
      <h3>{post.title}</h3>
      <span className="date">{meta(post)}</span>
    </Link>
  )
}

export default function BlogContent({ posts }: { posts: SanityPost[] }) {
  // Catégories regroupées, de la plus fournie à la moins fournie.
  const cats = useMemo(() => {
    const n = new Map<string, number>()
    posts.forEach((p) => new Set((p.tags ?? []).filter(Boolean).map(tagKey)).forEach((k) => n.set(k, (n.get(k) ?? 0) + 1)))
    return [...n.entries()]
      .sort((a, b) => b[1] - a[1] || tagLabel(a[0]).localeCompare(tagLabel(b[0]), 'fr'))
      .map(([key, count]) => ({ key, count, label: tagLabel(key) }))
  }, [posts])

  const [active, setActive] = useState<string | null>(null)
  const [all, setAll] = useState(false)

  const filtered = active ? posts.filter((p) => p.tags?.some((t) => tagKey(t) === active)) : posts
  const [featured, ...rest] = filtered

  const shown = all ? cats : cats.filter((c, i) => i < TOP || c.key === active)

  return (
    <>
      <section className="intro">
        <span className="eyebrow in0" style={d(60)}>Le blog</span>
        <h1 className="in0" style={d(140)}>Guides pratiques &amp; ressources IA</h1>
        <p className="lead in0" style={d(260)}>
          Des articles concrets pour intégrer l&apos;IA dans ton activité — outils, prompts, automatisations et
          méthodes testées au quotidien.
        </p>

        <div className="pills in0" style={d(380)} role="group" aria-label="Catégories">
          <button type="button" className="pill" aria-pressed={active === null} onClick={() => setActive(null)}>Tout</button>
          {shown.map((c) => (
            <button type="button" className="pill" key={c.key} aria-pressed={active === c.key} onClick={() => setActive(c.key)}>
              {c.label}
            </button>
          ))}
          {cats.length > TOP && (
            <button type="button" className={all ? 'pill more open' : 'pill more'} aria-expanded={all} onClick={() => setAll((v) => !v)}>
              {all ? 'Voir moins' : 'Voir tout'}
              {!all && <small>{cats.length}</small>}
            </button>
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="empty">Pas encore d&apos;article dans cette catégorie.</p>
      ) : (
        <>
          {featured && <FeaturedPost key={featured._id} post={featured} />}

          {rest.length > 0 && (
            <>
              <SectionTitle num="01">Derniers articles</SectionTitle>
              <div className="vgrid">
                {rest.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
