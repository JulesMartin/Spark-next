import Header from '@/components/public/Header'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { mockBlogPosts } from '@/lib/mock-data'
import { Content } from '@/lib/types'

export const revalidate = 60

async function getBlogPosts(): Promise<Content[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('content')
    .select('*')
    .eq('type', 'blog')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return data && data.length > 0 ? data : mockBlogPosts
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
              <article key={post.id} className="py-10 group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      {post.published_at && (
                        <p className="font-body text-xs uppercase tracking-[0.15em] text-muted mb-3">
                          {formatDate(post.published_at)}
                        </p>
                      )}
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-cream group-hover:text-accent transition-colors leading-snug mb-3">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="font-body text-muted text-sm leading-relaxed">
                          {post.description}
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
    </main>
  )
}
