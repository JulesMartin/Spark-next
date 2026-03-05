import ContentForm from '@/components/dashboard/ContentForm'
import { mockFeatured, mockInterviews, mockBlogPosts } from '@/lib/mock-data'

async function getContent(id: string) {
  // When Supabase is configured, replace with:
  // const supabase = await createClient()
  // const { data } = await supabase.from('content').select('*').eq('id', id).single()
  // return data

  const all = [mockFeatured, ...mockInterviews, ...mockBlogPosts]
  return all.find((c) => c.id === id) ?? null
}

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const content = await getContent(id)

  if (!content) {
    return (
      <div className="p-8">
        <p className="font-body text-muted">Contenu introuvable.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-cream">Modifier le contenu</h1>
        <p className="font-body text-muted text-sm mt-1 truncate max-w-md">{content.title}</p>
      </div>
      <ContentForm mode="edit" initial={content} />
    </div>
  )
}
