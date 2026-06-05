import { Content } from './types'

export const mockFeatured: Content = {
  id: '1',
  type: 'interview',
  title: 'Révolutionner la fintech en France depuis zéro',
  slug: 'thomas-berthier-fintech-france',
  description:
    'Thomas Berthier a quitté Goldman Sachs à 31 ans pour fonder une néobanque dédiée aux indépendants. Trois ans plus tard : 200 000 clients, 40M€ levés, et une vision radicale du futur du travail.',
  youtube_url: '',
  thumbnail_url: '/mock-interview.jpg',
  guest_name: 'Thomas Berthier',
  guest_title: 'CEO & Fondateur — Volt Banking',
  tags: ['fintech', 'entrepreneuriat', 'startups'],
  published: true,
  featured: true,
  published_at: '2024-01-20T10:00:00Z',
  created_at: '2024-01-20T10:00:00Z',
  updated_at: '2024-01-20T10:00:00Z',
}

export const mockInterviews: Content[] = [
  {
    id: '2',
    type: 'interview',
    title: "De l'atelier parisien aux podiums internationaux",
    slug: 'sarah-leclaire-mode-ethique',
    description:
      "Comment Sarah a transformé une marque locale en référence mondiale de la mode éthique, sans jamais compromettre ses valeurs.",
    youtube_url: '',
    thumbnail_url: '/mock-interview.jpg',
    guest_name: 'Sarah Leclaire',
    guest_title: 'Éclat Studio',
    episode_number: 524,
    tags: ['mode', 'design', 'durabilité'],
    published: true,
    featured: false,
    published_at: '2024-01-12T10:00:00Z',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
  {
    id: '3',
    type: 'interview',
    title: 'Construire un media indépendant à l\'ère des algorithmes',
    slug: 'marc-dubois-media-independant',
    description:
      'Marc a fondé un pure player d\'investigation qui touche 3M de lecteurs mensuels sans une seule pub programmatique. Son modèle : le journalisme comme service.',
    youtube_url: '',
    thumbnail_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    guest_name: 'Marc Dubois',
    guest_title: 'Le Fil',
    episode_number: 523,
    tags: ['médias', 'journalisme', 'indépendance'],
    published: true,
    featured: false,
    published_at: '2024-01-05T10:00:00Z',
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
  },
  {
    id: '4',
    type: 'interview',
    title: 'L\'IA au service de la création artistique',
    slug: 'elena-morin-ia-art',
    description:
      "Elena explore les frontières entre l'art génératif et la création humaine. Pionnière de l'art computationnel, elle expose dans les plus grands musées du monde.",
    youtube_url: '',
    thumbnail_url:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop',
    guest_name: 'Elena Morin',
    guest_title: 'Lab Lumière',
    episode_number: 522,
    tags: ['art', 'IA', 'création'],
    published: true,
    featured: false,
    published_at: '2023-12-18T10:00:00Z',
    created_at: '2023-12-18T10:00:00Z',
    updated_at: '2023-12-18T10:00:00Z',
  },
  {
    id: '5',
    type: 'interview',
    title: 'Réparer le monde, une entreprise à la fois',
    slug: 'karim-hadj-impact-entrepreneuriat',
    description:
      "Karim Hadj dirige un fonds d'impact qui a investi dans 40 startups à mission en 5 ans. Sa conviction : le capitalisme peut être réparé de l'intérieur.",
    youtube_url: '',
    thumbnail_url:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80&auto=format&fit=crop',
    guest_name: 'Karim Hadj',
    guest_title: 'Futurs Fonds',
    episode_number: 521,
    tags: ['impact', 'investissement', 'climat'],
    published: true,
    featured: false,
    published_at: '2023-12-08T10:00:00Z',
    created_at: '2023-12-08T10:00:00Z',
    updated_at: '2023-12-08T10:00:00Z',
  },
]

export const mockBlogPosts: Content[] = []
