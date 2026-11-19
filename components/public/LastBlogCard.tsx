import Link from 'next/link'
import Image from 'next/image'
import { coverOf, postTags, type SanityPost } from '@/lib/blog'
import { SectionTitle, formatDate } from './site-ui'

export default function LastBlogCard({ post, num }: { post: SanityPost; num: string }) {
  const slug = post.slug?.current ?? ''
  const cover = coverOf(post)
  const tags = postTags(post.tags).slice(0, 3)

  return (
    <>
      <SectionTitle id="dernier-article" num={num}>Dernier article</SectionTitle>
      <Link className="feature light rvb" href={`/blog/${slug}`}>
        <div className="media">
          {cover && <Image src={cover} alt={post.title} fill sizes="(max-width: 960px) 100vw, 52vw" />}
        </div>
        <div className="body">
          {tags.length > 0 && (
            <div className="acts" style={{ marginTop: 0, marginBottom: 16, gap: 6 }}>
              {tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
          )}
          <h3>{post.title}</h3>
          {post.excerpt && <p className="txt">{post.excerpt}</p>}
          <div className="acts">
            <span className="btn solid big i-read">Lire l&apos;article</span>
            {post.publishedAt && <span className="meta">{formatDate(post.publishedAt)}</span>}
          </div>
        </div>
      </Link>
    </>
  )
}
