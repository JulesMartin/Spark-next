import Header from '@/components/public/Header'
import HeroSection from '@/components/public/HeroSection'
import FeaturedInterview from '@/components/public/FeaturedInterview'
import InterviewGrid from '@/components/public/InterviewGrid'
import Newsletter from '@/components/public/Newsletter'
import Footer from '@/components/public/Footer'
import { fetchYouTubeVideos } from '@/lib/youtube-feed'

export const revalidate = 3600

export default async function HomePage() {
  const videos = await fetchYouTubeVideos()
  const featured = videos[0] ?? null
  const rest = videos.slice(1)

  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <HeroSection featured={featured} />
      <FeaturedInterview video={featured} />
      {rest.length > 0 && <InterviewGrid videos={rest} />}
      <Newsletter />
      <Footer />
    </main>
  )
}
