import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'
import SiteShell from '@/components/public/SiteShell'
import Prose from '@/components/public/Prose'
import { formatDate } from '@/components/public/site-ui'
import { postTags, readTime } from '@/lib/blog'
import { sanityClient } from '@/lib/sanity/client'

export const revalidate = 60

interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  body?: string
  tags?: string[]
  publishedAt?: string
  youtubeUrl?: string
}

async function getBlogPost(slug: string): Promise<SanityPost | null> {
  return sanityClient.fetch(
    `*[_type == "post" && status == "published" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function generateStaticParams() {
  const posts: SanityPost[] = await sanityClient.fetch(
    `*[_type == "post" && status == "published"] { slug }`
  )
  return posts.map((p) => ({ slug: p.slug.current }))
}

const d = (ms: number) => ({ '--d': ms }) as CSSProperties

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  const tags = postTags(post.tags)

  return (
    <SiteShell>
      <article className="doc">
        <Link className="btn i-back in0" href="/blog">Blog</Link>

        <header className="doc-head in0" style={d(120)}>
          <span className="eyebrow">Blog</span>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="lead">{post.excerpt}</p>}
          {post.publishedAt && (
            <p className="meta">{formatDate(post.publishedAt)} · {readTime(post.body)} de lecture</p>
          )}
        </header>

        {post.body && <Prose body={post.body} />}

        {tags.length > 0 && (
          <div className="tags">
            {tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </article>
    </SiteShell>
  )
}
