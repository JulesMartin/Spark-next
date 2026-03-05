import Image from 'next/image'
import Header from '@/components/public/Header'
import { createClient } from '@/lib/supabase/server'
import { getYouTubeThumbnail } from '@/lib/youtube'

export const revalidate = 60

export default async function AProposPage() {
  const supabase = await createClient()

  const { data: interview } = await supabase
    .from('content')
    .select('*')
    .eq('type', 'interview')
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  const thumbnail = interview
    ? interview.thumbnail_url || (interview.youtube_url ? getYouTubeThumbnail(interview.youtube_url) : '/placeholder.jpg')
    : '/hero-image.png'

  return (
    <main className="min-h-screen bg-bg">
      <Header />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image (non-cliquable) */}
          <div className="relative aspect-square overflow-hidden border border-edge">
            <Image
              src={thumbnail}
              alt={interview ? `${interview.guest_name} — ${interview.title}` : 'Interview'}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-6">
            <span className="font-body text-xs font-medium tracking-[0.25em] uppercase text-accent">
              Dernière interview
            </span>

            <div>
              <h2 className="font-display text-5xl md:text-6xl xl:text-7xl font-black text-cream leading-none tracking-tight">
                {interview?.guest_name ?? 'Pat Walls'}
              </h2>
              <p className="font-body text-muted text-base mt-3">
                {interview?.guest_title ?? 'Fondateur de Starter Story'}
              </p>
            </div>

            <p className="font-body text-cream/70 text-base leading-relaxed max-w-md">
              {interview?.description ?? 'Comment Pat Walls a construit un média générant plusieurs millions de dollars par an en interviewant des entrepreneurs bootstrappés du monde entier.'}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
