import ContentForm from '@/components/dashboard/ContentForm'

export default function NewContentPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-cream">Nouveau contenu</h1>
        <p className="font-body text-muted text-sm mt-1">
          Interview, article de blog ou post court
        </p>
      </div>
      <ContentForm mode="create" />
    </div>
  )
}
