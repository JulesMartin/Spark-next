import SiteShell from '@/components/public/SiteShell'
import SkoolSection from '@/components/public/SkoolSection'
import BlogContent from '@/components/public/BlogContent'
import { sanityClient } from '@/lib/sanity/client'
import { type SanityPost } from '@/lib/blog'

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
    <SiteShell>
      <BlogContent posts={posts} />
      <SkoolSection num={posts.length > 1 ? '02' : '01'} compact />
    </SiteShell>
  )
}
