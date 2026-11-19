import SiteShell from '@/components/public/SiteShell'
import HeroSection from '@/components/public/HeroSection'
import SocialLinks from '@/components/public/SocialLinks'
import SkoolSection from '@/components/public/SkoolSection'
import FeaturedInterview from '@/components/public/FeaturedInterview'
import InterviewGrid from '@/components/public/InterviewGrid'
import LastBlogCard from '@/components/public/LastBlogCard'
import { fetchYouTubeVideos } from '@/lib/youtube-feed'
import { sanityClient } from '@/lib/sanity/client'
import { type SanityPost } from '@/lib/blog'

export const revalidate = 3600

// Vidéos du catalogue sous « Dernière vidéo » : deux rangées de trois.
const CATALOGUE_SIZE = 6

async function getLatestPost(): Promise<SanityPost | null> {
  const posts = await sanityClient.fetch<SanityPost[]>(
    `*[_type == "post" && status == "published"] | order(publishedAt desc)[0..0] {
      _id, title, slug, excerpt, tags, publishedAt, coverImageUrl, youtubeUrl
    }`
  )
  return posts?.[0] ?? null
}

export default async function HomePage() {
  const [videos, latestPost] = await Promise.all([
    fetchYouTubeVideos(),
    getLatestPost(),
  ])

  const featured = videos[0] ?? null
  const grid = videos.slice(1, 1 + CATALOGUE_SIZE)

  // Sections numérotées dans l'ordre où elles apparaissent.
  const sections = [
    { id: 'communaute', label: 'Communauté' },
    ...(featured ? [{ id: 'derniere-video', label: 'Dernière vidéo' }] : []),
    ...(grid.length > 0 ? [{ id: 'interviews', label: 'Catalogue' }] : []),
    ...(latestPost ? [{ id: 'dernier-article', label: 'Dernier article' }] : []),
  ]
  const num = (id: string) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0')

  return (
    <SiteShell tree="soft">
      <HeroSection featured={featured} />
      <SocialLinks />
      <SkoolSection num={num('communaute')} />
      <FeaturedInterview video={featured} num={num('derniere-video')} />
      {grid.length > 0 && <InterviewGrid videos={grid} num={num('interviews')} />}
      {latestPost && <LastBlogCard post={latestPost} num={num('dernier-article')} />}
    </SiteShell>
  )
}
