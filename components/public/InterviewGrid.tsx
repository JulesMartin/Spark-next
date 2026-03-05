import Image from 'next/image'
import Link from 'next/link'
import { Content } from '@/lib/types'
import { getYouTubeThumbnail } from '@/lib/youtube'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function InterviewCard({ interview }: { interview: Content }) {
  const thumbnail =
    interview.thumbnail_url ||
    (interview.youtube_url ? getYouTubeThumbnail(interview.youtube_url) : '/placeholder.jpg')

  return (
    <Link href={`/interviews/${interview.slug}`} className="group block">
      <article className="flex flex-col gap-4">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden border border-edge transition-all duration-300 group-hover:border-accent/60 group-hover:-translate-y-0.5">
          <Image
            src={thumbnail}
            alt={`${interview.guest_name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-xl font-bold text-cream leading-snug group-hover:text-accent transition-colors duration-200">
            {interview.guest_name}
          </h3>
          {interview.guest_title && (
            <p className="font-body text-muted text-sm">{interview.guest_title}</p>
          )}
          {interview.description && (
            <p className="font-body text-cream/50 text-sm leading-relaxed line-clamp-2 mt-1">
              {interview.description}
            </p>
          )}
          {interview.published_at && (
            <p className="font-body text-muted text-xs mt-2 tracking-wide">
              {formatDate(interview.published_at)}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}

export default function InterviewGrid({ interviews }: { interviews: Content[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-12">
        <span className="font-body text-xs font-medium tracking-[0.25em] uppercase text-muted">
          Toutes les interviews
        </span>
        <div className="flex-1 h-px bg-edge" />
        <span className="font-body text-xs text-muted">{interviews.length}</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>
    </section>
  )
}
