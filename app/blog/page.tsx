import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import Newsletter from '@/components/public/Newsletter'
import SkoolSection from '@/components/public/SkoolSection'
import BlogContent, { type SanityPost } from '@/components/public/BlogContent'
import { sanityClient } from '@/lib/sanity/client'

export const revalidate = 60

async function getBlogPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) {
      _id, title, slug, excerpt, body, tags, publishedAt, coverImageUrl, youtubeUrl
    }`
  )
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <BlogContent posts={posts} />
      <SkoolSection />
      <Newsletter />
      <Footer />
    </main>
  )
}
