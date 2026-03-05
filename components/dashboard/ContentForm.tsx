'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Content, ContentType } from '@/lib/types'
import { slugify } from '@/lib/slugify'
import { getYouTubeThumbnail, getYouTubeId } from '@/lib/youtube'

interface Props {
  initial?: Partial<Content>
  mode: 'create' | 'edit'
}

interface FormState {
  type: ContentType
  title: string
  slug: string
  description: string
  body: string
  youtube_url: string
  thumbnail_url: string
  guest_name: string
  guest_title: string
  tags: string
  published: boolean
  featured: boolean
  published_at: string
}

export default function ContentForm({ initial, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)

  const [form, setForm] = useState<FormState>({
    type: initial?.type ?? 'interview',
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    body: initial?.body ?? '',
    youtube_url: initial?.youtube_url ?? '',
    thumbnail_url: initial?.thumbnail_url ?? '',
    guest_name: initial?.guest_name ?? '',
    guest_title: initial?.guest_title ?? '',
    tags: initial?.tags?.join(', ') ?? '',
    published: initial?.published ?? false,
    featured: initial?.featured ?? false,
    published_at: initial?.published_at
      ? new Date(initial.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(form.title) }))
    }
  }, [form.title, slugEdited])

  const youtubeThumbnail =
    form.youtube_url && getYouTubeId(form.youtube_url)
      ? getYouTubeThumbnail(form.youtube_url)
      : null

  const displayThumbnail = form.thumbnail_url || youtubeThumbnail

  const set = (key: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
      ...(mode === 'edit' && initial?.id ? { id: initial.id } : {}),
    }

    // TODO: When Supabase is configured, upsert here:
    // const supabase = createClient()
    // const { error } = await supabase.from('content').upsert(payload)
    // if (error) { setError(error.message); setLoading(false); return }
    // await fetch('/api/revalidate', { method: 'POST' })

    console.log('Save payload:', payload)
    alert(
      mode === 'create'
        ? 'Contenu créé (mock — connectez Supabase pour persister).'
        : 'Contenu mis à jour (mock).'
    )

    router.push('/dashboard')
  }

  const inputClass =
    'w-full bg-[#0F0F0F] border border-edge focus:border-accent text-cream font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-muted/40'
  const labelClass = 'block font-body text-xs uppercase tracking-wider text-muted mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-7">
      {/* Type */}
      <div>
        <label className={labelClass}>Type</label>
        <select
          value={form.type}
          onChange={(e) => set('type', e.target.value as ContentType)}
          className={inputClass}
        >
          <option value="interview">Interview</option>
          <option value="blog">Blog</option>
          <option value="post">Post</option>
        </select>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Titre *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
          className={inputClass}
          placeholder="Ex: Thomas Berthier sur la fintech française"
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug *</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => {
            setSlugEdited(true)
            set('slug', e.target.value)
          }}
          required
          className={inputClass}
          placeholder="thomas-berthier-fintech"
        />
        <p className="font-body text-xs text-muted mt-1">
          Auto-généré depuis le titre. Modifiable.
        </p>
      </div>

      {/* Guest fields — interview only */}
      {form.type === 'interview' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom de l'invité</label>
            <input
              type="text"
              value={form.guest_name}
              onChange={(e) => set('guest_name', e.target.value)}
              className={inputClass}
              placeholder="Thomas Berthier"
            />
          </div>
          <div>
            <label className={labelClass}>Titre / poste</label>
            <input
              type="text"
              value={form.guest_title}
              onChange={(e) => set('guest_title', e.target.value)}
              className={inputClass}
              placeholder="CEO — Volt Banking"
            />
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Courte description affichée sur les cards..."
        />
      </div>

      {/* Body — blog/post only */}
      {(form.type === 'blog' || form.type === 'post') && (
        <div>
          <label className={labelClass}>Contenu (Markdown)</label>
          <textarea
            value={form.body}
            onChange={(e) => set('body', e.target.value)}
            rows={12}
            className={`${inputClass} font-mono`}
            placeholder="# Titre&#10;&#10;Contenu en Markdown..."
          />
        </div>
      )}

      {/* YouTube URL — interview only */}
      {form.type === 'interview' && (
        <div>
          <label className={labelClass}>URL YouTube</label>
          <input
            type="url"
            value={form.youtube_url}
            onChange={(e) => set('youtube_url', e.target.value)}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {youtubeThumbnail && !form.thumbnail_url && (
            <div className="mt-3 relative aspect-video w-48 border border-edge overflow-hidden">
              <Image
                src={youtubeThumbnail}
                alt="Thumbnail YouTube"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Thumbnail URL */}
      <div>
        <label className={labelClass}>URL Thumbnail (optionnel — remplace YouTube)</label>
        <input
          type="url"
          value={form.thumbnail_url}
          onChange={(e) => set('thumbnail_url', e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
        {displayThumbnail && (
          <div className="mt-3 relative aspect-video w-48 border border-accent/30 overflow-hidden">
            <Image src={displayThumbnail} alt="Aperçu" fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags (séparés par des virgules)</label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => set('tags', e.target.value)}
          className={inputClass}
          placeholder="fintech, startups, entrepreneuriat"
        />
      </div>

      {/* Published at */}
      <div>
        <label className={labelClass}>Date de publication</label>
        <input
          type="datetime-local"
          value={form.published_at}
          onChange={(e) => set('published_at', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-8">
        <Toggle
          label="Publié"
          checked={form.published}
          onChange={(v) => set('published', v)}
        />
        <Toggle
          label="Mis en avant"
          checked={form.featured}
          onChange={(v) => set('featured', v)}
          hint="Un seul contenu peut être mis en avant"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="font-body text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accent-light text-bg font-body font-medium text-sm uppercase tracking-wider px-6 py-2.5 transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="border border-edge hover:border-muted text-muted hover:text-cream font-body text-sm px-6 py-2.5 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  hint?: string
}) {
  return (
    <div>
      <label className="flex items-center gap-3 cursor-pointer">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative w-10 h-5 transition-colors ${
            checked ? 'bg-accent' : 'bg-edge'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-bg transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="font-body text-sm text-cream">{label}</span>
      </label>
      {hint && <p className="font-body text-xs text-muted mt-1 ml-13">{hint}</p>}
    </div>
  )
}
