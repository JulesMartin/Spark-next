import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import Link from 'next/link'
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
}

async function getBlogPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) {
      _id, title, slug, excerpt, body, tags, publishedAt
    }`
  )
}

function getPreview(body: string, maxChars = 200): string {
  const clean = body
    .replace(/^#{1,6}\s+.+$/gm, '')   // strip headings
    .replace(/\*\*(.+?)\*\*/g, '$1')  // strip bold
    .replace(/\*(.+?)\*/g, '$1')      // strip italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // strip links
    .replace(/\n{2,}/g, '\n')
    .trim()
  const first = clean.split('\n').find((l) => l.trim().length > 0) ?? ''
  return first.length > maxChars ? first.slice(0, maxChars).trimEnd() + '…' : first
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main className="min-h-screen bg-bg">
      <Header />

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <h1 className="font-display text-4xl md:text-5xl font-black text-cream mb-2">Blog</h1>
        <p className="font-body text-muted text-base mb-14">
          Réflexions, analyses et points de vue sur l'entrepreneuriat et la création.
        </p>

        {posts.length === 0 ? (
          <p className="font-body text-muted text-lg">Pas encore de blog disponible.</p>
        ) : (
          <div className="flex flex-col divide-y divide-edge">
            {posts.map((post) => (
              <article key={post._id} className="py-10 group">
                <Link href={`/blog/${post.slug.current}`}>
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      {post.publishedAt && (
                        <p className="font-body text-xs uppercase tracking-[0.15em] text-muted mb-3">
                          {formatDate(post.publishedAt)}
                        </p>
                      )}
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-cream group-hover:text-accent transition-colors leading-snug mb-3">
                        {post.title}
                      </h2>
                      {(post.body || post.excerpt) && (
                        <p className="font-body text-muted text-sm leading-relaxed">
                          {post.body ? getPreview(post.body) : post.excerpt}
                        </p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-body text-xs uppercase tracking-wider text-muted border border-edge px-2 py-0.5 rounded-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-body text-accent text-lg mt-1 group-hover:translate-x-1 transition-transform inline-block flex-shrink-0">
                      →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
