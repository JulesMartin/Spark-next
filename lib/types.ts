export type ContentType = 'interview' | 'blog' | 'post'

export interface Content {
  id: string
  type: ContentType
  title: string
  slug: string
  description?: string
  body?: string
  youtube_url?: string
  thumbnail_url?: string
  guest_name?: string
  guest_title?: string
  tags?: string[]
  published: boolean
  featured: boolean
  published_at?: string
  created_at: string
  updated_at: string
}
