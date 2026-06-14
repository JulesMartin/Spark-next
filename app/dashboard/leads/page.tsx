import { createServiceClient } from '@/lib/supabase/service'

type Lead = {
  id: string
  email: string
  source: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function LeadsPage() {
  const supabase = createServiceClient()

  const { data: leads, error } = await supabase
    .from('email_subscribers')
    .select('id, email, source, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-8">
        <p className="font-body text-red-400 text-sm">Erreur lors du chargement des leads.</p>
      </div>
    )
  }

  const bySource = (leads ?? []).reduce<Record<string, number>>((acc, l) => {
    const key = l.source ?? 'default'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-cream">Leads</h1>
        <p className="font-body text-muted text-sm mt-1">
          {(leads ?? []).length} inscrits au total
        </p>
      </div>

      {/* Stats by campaign */}
      {Object.keys(bySource).length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(bySource)
            .sort((a, b) => b[1] - a[1])
            .map(([source, count]) => (
              <div key={source} className="bg-surface border border-edge px-4 py-2">
                <p className="font-body text-xs text-muted uppercase tracking-wider">{source}</p>
                <p className="font-display text-xl font-bold text-cream mt-0.5">{count}</p>
              </div>
            ))}
        </div>
      )}

      {/* Table */}
      {(leads ?? []).length === 0 ? (
        <p className="font-body text-muted text-sm">Aucun lead pour l&apos;instant.</p>
      ) : (
        <div className="border border-edge overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge bg-surface">
                <th className="text-left font-body font-medium text-muted uppercase tracking-wider text-xs px-4 py-3">
                  Email
                </th>
                <th className="text-left font-body font-medium text-muted uppercase tracking-wider text-xs px-4 py-3">
                  Campagne
                </th>
                <th className="text-left font-body font-medium text-muted uppercase tracking-wider text-xs px-4 py-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {(leads as Lead[]).map((lead, i) => (
                <tr
                  key={lead.id}
                  className={`border-b border-edge hover:bg-surface/50 transition-colors ${
                    i % 2 === 0 ? 'bg-bg' : 'bg-surface/20'
                  }`}
                >
                  <td className="font-body text-cream px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">
                    <span className="font-body text-xs text-accent border border-accent/30 px-2 py-0.5">
                      {lead.source ?? 'default'}
                    </span>
                  </td>
                  <td className="font-body text-muted text-xs px-4 py-3">
                    {formatDate(lead.created_at)}
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
