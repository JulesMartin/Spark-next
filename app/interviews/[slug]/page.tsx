import type { CSSProperties } from 'react'
import SiteShell from '@/components/public/SiteShell'
import Prose from '@/components/public/Prose'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube'
import { Content } from '@/lib/types'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

async function getInterview(slug: string): Promise<Content | null> {
  // When Supabase is configured, replace with:
  const supabase = await createClient()
  const { data } = await supabase
    .from('content').select('*')
    .eq('slug', slug).eq('published', true).single()
  return data
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
    <SiteShell>
      <article className="doc" style={{ maxWidth: 900 }}>
        <Link className="btn i-back in0" href="/">Toutes les interviews</Link>

        <header className="doc-head in0" style={{ '--d': 120 } as CSSProperties}>
          <span className="eyebrow">Interview</span>
          <h1>{interview.guest_name}</h1>
          {interview.guest_title && <p className="lead">{interview.guest_title}</p>}
          {interview.published_at && <p className="meta">{formatDate(interview.published_at)}</p>}
        </header>

        {youtubeId ? (
          <div className="video-embed rvb">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={interview.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : thumbnail ? (
          <div className="video-embed rvb">
            <Image src={thumbnail} alt={interview.title} fill priority sizes="(max-width: 900px) 100vw, 900px" />
          </div>
        ) : null}

        {interview.description && (
          <p className="lead" style={{ marginTop: 'var(--g5)', fontSize: 'clamp(18px,1.6vw,22px)', color: 'var(--ink)' }}>
            {interview.description}
          </p>
        )}

        {interview.body && <Prose body={interview.body} />}

        {interview.tags && interview.tags.length > 0 && (
          <div className="tags">
            {interview.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </article>
    </SiteShell>
  )
}
