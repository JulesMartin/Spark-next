import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-bg">
      <Header />

      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted hover:text-cream transition-colors mb-12 group"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Blog
        </Link>

        <header className="mb-12 pb-12 border-b border-edge">
          <span className="font-body text-xs font-medium tracking-[0.25em] uppercase text-accent block mb-4">
            Blog
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-cream leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="font-body text-cream/60 text-lg leading-relaxed mt-4">
              {post.excerpt}
            </p>
          )}
          {post.publishedAt && (
            <p className="font-body text-muted text-sm mt-6">{formatDate(post.publishedAt)}</p>
          )}
        </header>

        {post.body && (
          <div className="font-body text-cream/80 leading-relaxed space-y-5">
            {post.body.split('\n').map((para, i) => {
              if (para.startsWith('## '))
                return (
                  <h2 key={i} className="font-display text-2xl font-bold text-cream mt-10 mb-4">
                    {para.replace('## ', '')}
                  </h2>
                )
              if (para.startsWith('# '))
                return (
                  <h2 key={i} className="font-display text-2xl font-bold text-cream mt-10 mb-4">
                    {para.replace('# ', '')}
                  </h2>
                )
              if (para.trim())
                return (
                  <p key={i} className="text-base leading-7">
                    {para}
                  </p>
                )
              return null
            })}
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-12 border-t border-edge">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-body text-xs font-medium tracking-wider uppercase text-muted border border-edge px-2 py-1 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
      <Footer />
    </main>
  )
}
