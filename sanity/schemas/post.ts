import { defineField, defineType } from 'sanity'

export const postSchema = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: 'Brouillon', value: 'draft' },
          { title: 'Publié', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait',
      description: 'Résumé affiché dans les listes (max 160 caractères)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Corps de l\'article (Markdown)',
      type: 'text',
      rows: 25,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'URL YouTube',
      type: 'url',
    }),
    defineField({
      name: 'coverImageUrl',
      title: 'Image de couverture (URL)',
      description: 'Auto-remplie depuis la miniature YouTube',
      type: 'url',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      options: { dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm' },
    }),
  ],
  preview: {
    select: { title: 'title', status: 'status', date: 'publishedAt' },
    prepare({ title, status, date }) {
      const statusLabel = status === 'published' ? '✓' : '✎'
      const dateStr = date ? new Date(date).toLocaleDateString('fr-FR') : ''
      return { title: `${statusLabel} ${title}`, subtitle: dateStr }
    },
  },
})
