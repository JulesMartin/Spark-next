import Image from 'next/image'
import Link from 'next/link'
import { Content } from '@/lib/types'
import { getYouTubeThumbnail } from '@/lib/youtube'

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InterviewCard({ interview }: { interview: Content }) {
  const thumbnail =
    interview.thumbnail_url ||
    (interview.youtube_url ? getYouTubeThumbnail(interview.youtube_url) : '/placeholder.jpg')

  return (
    <div className="group flex flex-col gap-3">
      {/* Episode number */}
      {interview.episode_number && (
        <span className="font-body text-sm font-bold text-cream/90 tracking-tight">
          #{interview.episode_number}
        </span>
      )}

      {/* Square image */}
      <Link href={`/interviews/${interview.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden border border-edge transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/40">
          <Image
            src={thumbnail}
            alt={interview.guest_name ?? ''}
            fill
            className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        <Link href={`/interviews/${interview.slug}`}>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-cream group-hover:text-accent transition-colors duration-200">
            {interview.guest_name}
          </h3>
        </Link>
        {interview.guest_title && (
          <p className="font-body text-xs text-muted">{interview.guest_title}</p>
        )}
      </div>

      {/* YouTube button */}
      {interview.youtube_url && (
        <a
          href={interview.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center border border-edge text-muted hover:text-accent hover:border-accent transition-colors duration-200"
          aria-label="Voir sur YouTube"
        >
          <YoutubeIcon />
        </a>
      )}
    </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>
    </section>
  )
}
