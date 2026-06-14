import Header from '@/components/public/Header'
import HeroSection from '@/components/public/HeroSection'
import FeaturedInterview from '@/components/public/FeaturedInterview'
import InterviewGrid from '@/components/public/InterviewGrid'
import Newsletter from '@/components/public/Newsletter'
import SkoolSection from '@/components/public/SkoolSection'
import LastBlogCard from '@/components/public/LastBlogCard'
import SocialLinks from '@/components/public/SocialLinks'
import Footer from '@/components/public/Footer'
import { fetchYouTubeVideos } from '@/lib/youtube-feed'
import { sanityClient } from '@/lib/sanity/client'
import { type SanityPost } from '@/components/public/BlogContent'

export const revalidate = 3600

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
  const rawGrid = videos.slice(1)
  const grid = rawGrid.slice(0, Math.floor(rawGrid.length / 3) * 3)

  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <HeroSection featured={featured} />
      <SocialLinks />
      <SkoolSection />
      <FeaturedInterview video={featured} />
      <Newsletter />
      {grid.length > 0 && <InterviewGrid videos={grid} />}
      {latestPost && <LastBlogCard post={latestPost} />}
      <Footer />
    </main>
  )
}
