import Image from 'next/image'
import Link from 'next/link'
import { Content } from '@/lib/types'
import { getYouTubeThumbnail } from '@/lib/youtube'

export default function FeaturedInterview({ interview }: { interview: Content }) {
  const thumbnail =
    interview.thumbnail_url ||
    (interview.youtube_url ? getYouTubeThumbnail(interview.youtube_url) : '/placeholder.jpg')

  return (
    <section className="border-b border-edge">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Thumbnail */}
          <Link href={`/interviews/${interview.slug}`} className="group block relative">
            <div className="relative aspect-video overflow-hidden border border-edge group-hover:border-accent/50 transition-colors duration-300">
              <Image
                src={thumbnail}
                alt={`${interview.guest_name} — ${interview.title}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Dark overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-bg ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Text content */}
          <div className="flex flex-col gap-6">
            <span className="font-body text-xs font-medium tracking-[0.25em] uppercase text-accent">
              Dernière interview
            </span>

            <div>
              <h2 className="font-display text-5xl md:text-6xl xl:text-7xl font-black text-cream leading-none tracking-tight">
                {interview.guest_name}
              </h2>
              {interview.guest_title && (
                <p className="font-body text-muted text-base mt-3">
                  {interview.guest_title}
                </p>
              )}
            </div>

            {interview.description && (
              <p className="font-body text-cream/70 text-base leading-relaxed max-w-md">
                {interview.description}
              </p>
            )}

            {interview.tags && interview.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
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

            <div className="pt-2">
              <Link
                href={`/interviews/${interview.slug}`}
                className="inline-flex items-center gap-3 font-body text-sm font-medium uppercase tracking-[0.15em] text-accent hover:text-accent-light transition-colors group"
              >
                Regarder
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
