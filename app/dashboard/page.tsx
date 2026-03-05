'use client'

import { useState } from 'react'
import Link from 'next/link'
import ContentTable from '@/components/dashboard/ContentTable'
import { mockFeatured, mockInterviews, mockBlogPosts } from '@/lib/mock-data'
import { Content } from '@/lib/types'

type Filter = 'all' | 'interview' | 'blog' | 'post'

const initialContents: Content[] = [mockFeatured, ...mockInterviews, ...mockBlogPosts]

export default function DashboardPage() {
  const [contents, setContents] = useState<Content[]>(initialContents)
  const [filter, setFilter] = useState<Filter>('all')

  const handleDelete = (id: string) => {
    setContents((prev) => prev.filter((c) => c.id !== id))
  }

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: !currentStatus } : c))
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Contenus</h1>
          <p className="font-body text-muted text-sm mt-1">
            {contents.length} contenus au total
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-bg font-body font-medium text-sm uppercase tracking-wider px-5 py-2.5 transition-colors"
        >
          <span>+</span> Nouveau contenu
        </Link>
      </div>

      {/* Table */}
      <ContentTable
        contents={contents}
        filter={filter}
        onFilterChange={setFilter}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
      />
    </div>
  )
}
