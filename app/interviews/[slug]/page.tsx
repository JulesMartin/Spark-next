import Header from '@/components/public/Header'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mockFeatured, mockInterviews } from '@/lib/mock-data'
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube'
import { Content } from '@/lib/types'

export const revalidate = 60

async function getInterview(slug: string): Promise<Content | null> {
  // When Supabase is configured, replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('content').select('*')
  //   .eq('slug', slug).eq('published', true).single()
  // return data

  const all = [mockFeatured, ...mockInterviews]
  return all.find((i) => i.slug === slug) ?? null
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const interview = await getInterview(slug)

  if (!interview) notFound()

  const youtubeId = interview.youtube_url ? getYouTubeId(interview.youtube_url) : null
  const thumbnail =
    interview.thumbnail_url ||
    (interview.youtube_url ? getYouTubeThumbnail(interview.youtube_url) : null)

  return (
    <main className="min-h-screen bg-bg">
      <Header />

      <article className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted hover:text-cream transition-colors mb-12 group"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Toutes les interviews
        </Link>

        {/* Header */}
        <header className="mb-12 pb-12 border-b border-edge">
          <span className="font-body text-xs font-medium tracking-[0.25em] uppercase text-accent block mb-6">
            Interview
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-black text-cream leading-none tracking-tight mb-4">
            {interview.guest_name}
          </h1>
          {interview.guest_title && (
            <p className="font-body text-muted text-lg">{interview.guest_title}</p>
          )}
          {interview.published_at && (
            <p className="font-body text-muted text-sm mt-4">
              {formatDate(interview.published_at)}
            </p>
          )}
        </header>

        {/* Video embed */}
        {youtubeId ? (
          <div className="aspect-video w-full mb-12 border border-edge overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={interview.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : thumbnail ? (
          <div className="relative aspect-video w-full mb-12 border border-edge overflow-hidden">
            <Image
              src={thumbnail}
              alt={interview.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        ) : null}

        {/* Description */}
        {interview.description && (
          <div className="mb-12">
            <p className="font-body text-cream/80 text-xl leading-relaxed">
              {interview.description}
            </p>
          </div>
        )}

        {/* Body */}
        {interview.body && (
          <div className="font-body text-cream/70 leading-relaxed prose prose-invert max-w-none">
            {interview.body.split('\n').map((para, i) =>
              para.trim() ? (
                <p key={i} className="mb-4">
                  {para}
                </p>
              ) : null
            )}
          </div>
        )}

        {/* Tags */}
        {interview.tags && interview.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-12 border-t border-edge">
            {interview.tags.map((tag) => (
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
    </main>
  )
}
