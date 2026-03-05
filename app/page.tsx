import Header from '@/components/public/Header'
import HeroSection from '@/components/public/HeroSection'
import FeaturedInterview from '@/components/public/FeaturedInterview'
import InterviewGrid from '@/components/public/InterviewGrid'
import { createClient } from '@/lib/supabase/server'
import { mockFeatured, mockInterviews } from '@/lib/mock-data'

export const revalidate = 60

async function getData() {
  const supabase = await createClient()

  const { data: featured } = await supabase
    .from('content')
    .select('*')
    .eq('type', 'interview')
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  const { data: interviews } = await supabase
    .from('content')
    .select('*')
    .eq('type', 'interview')
    .eq('published', true)
    .eq('featured', false)
    .order('published_at', { ascending: false })
    .limit(20)

  // Fall back to mock data while the database is empty
  return {
    featured: featured ?? mockFeatured,
    interviews: interviews && interviews.length > 0 ? interviews : mockInterviews,
  }
}

export default async function HomePage() {
  const { featured, interviews } = await getData()

  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <HeroSection />
      <div id="interviews">
        {featured && <FeaturedInterview interview={featured} />}
        {interviews.length > 0 && <InterviewGrid interviews={interviews} />}
      </div>
    </main>
  )
}
