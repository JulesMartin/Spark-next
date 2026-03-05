'use client'

import Link from 'next/link'
import { Content } from '@/lib/types'

type Filter = 'all' | 'interview' | 'blog' | 'post'

interface Props {
  contents: Content[]
  filter: Filter
  onFilterChange: (f: Filter) => void
  onDelete: (id: string) => void
  onTogglePublish: (id: string, published: boolean) => void
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'interview', label: 'Interviews' },
  { value: 'blog', label: 'Blog' },
  { value: 'post', label: 'Posts' },
]

const TYPE_LABELS: Record<string, string> = {
  interview: 'Interview',
  blog: 'Blog',
  post: 'Post',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ContentTable({
  contents,
  filter,
  onFilterChange,
  onDelete,
  onTogglePublish,
}: Props) {
  const filtered = filter === 'all' ? contents : contents.filter((c) => c.type === filter)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-edge">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`font-body text-xs uppercase tracking-wider px-4 py-2.5 transition-colors border-b-2 -mb-px ${
              filter === f.value
                ? 'text-accent border-accent'
                : 'text-muted border-transparent hover:text-cream'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted font-body text-sm">
          Aucun contenu dans cette catégorie.
        </div>
      ) : (
        <div className="border border-edge overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-edge bg-surface">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted font-medium">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted font-medium">
                  Titre
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted font-medium">
                  Statut
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted font-medium">
                  Mis en avant
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted font-medium">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((content, i) => (
                <tr
                  key={content.id}
                  className={`border-b border-edge last:border-0 hover:bg-surface/50 transition-colors ${
                    i % 2 === 0 ? 'bg-bg' : 'bg-surface/30'
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs uppercase tracking-wider text-muted border border-edge px-1.5 py-0.5 rounded-sm">
                      {TYPE_LABELS[content.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-cream font-medium">{content.title}</span>
                      {content.guest_name && (
                        <span className="text-muted ml-2 text-xs">— {content.guest_name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        content.published
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                          : 'bg-muted/10 text-muted border border-edge'
                      }`}
                    >
                      {content.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {content.featured ? (
                      <span className="text-xs text-accent">★ Oui</span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {content.published_at ? formatDate(content.published_at) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onTogglePublish(content.id, content.published)}
                        className="text-xs text-muted hover:text-cream transition-colors"
                      >
                        {content.published ? 'Dépublier' : 'Publier'}
                      </button>
                      <Link
                        href={`/dashboard/edit/${content.id}`}
                        className="text-xs text-accent hover:text-accent-light transition-colors"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer "${content.title}" ?`)) {
                            onDelete(content.id)
                          }
                        }}
                        className="text-xs text-muted hover:text-red-400 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
