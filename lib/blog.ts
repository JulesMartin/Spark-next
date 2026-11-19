// Outils du blog partagés entre composants serveur et client (catégories, couverture, temps de lecture).

export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  body?: string
  tags?: string[]
  publishedAt?: string
  coverImageUrl?: string
  youtubeUrl?: string
}

export function coverOf(post: Pick<SanityPost, 'coverImageUrl' | 'youtubeUrl'>): string | null {
  if (post.coverImageUrl) return post.coverImageUrl
  const id = post.youtubeUrl?.match(/(?:v=|youtu\.be\/)([^&?\s]+)/)?.[1]
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null
}

// Les étiquettes Sanity existent en plusieurs écritures (« Claude Code », « claude-code »…) :
// on les regroupe sous une même catégorie, avec un nom propre à l'affichage.
const ALIAS: Record<string, string> = {
  'claude ai': 'claude', 'agent ia': 'agents ia', 'ia tools': 'outils ia', entrepreneur: 'entrepreneuriat',
}
const LABELS: Record<string, string> = {
  'claude code': 'Claude Code', ia: 'IA', anthropic: 'Anthropic', 'motion design': 'Motion design', productivite: 'Productivité',
  tutoriel: 'Tutoriel', automatisation: 'Automatisation', claude: 'Claude', 'outils ia': 'Outils IA', 'no code': 'No-code',
  saas: 'SaaS', 'premiers clients': 'Premiers clients', 'after effects': 'After Effects', deepseek: 'DeepSeek',
  elevenlabs: 'ElevenLabs', 'obs studio': 'OBS Studio', 'video marketing': 'Vidéo marketing', 'ia generative': 'IA générative',
  blender: 'Blender', mcp: 'MCP', '3d': '3D', 'montage video': 'Montage vidéo', tokens: 'Tokens', 'claude design': 'Claude Design',
  'design ia': 'Design IA', prospection: 'Prospection', entrepreneuriat: 'Entrepreneuriat', 'beta test': 'Bêta-test', llm: 'LLM',
  'agents ia': 'Agents IA', leak: 'Leak', solopreneur: 'Solopreneur', remotion: 'Remotion', video: 'Vidéo', freelance: 'Freelance',
  notion: 'Notion',
}

export function tagKey(tag: string): string {
  const k = tag.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  return ALIAS[k] ?? k
}

export function tagLabel(tag: string): string {
  const k = tagKey(tag)
  return LABELS[k] ?? k.charAt(0).toUpperCase() + k.slice(1)
}

// Étiquettes d'un article sans doublons d'écriture, dans leur ordre d'origine.
export function postTags(tags?: string[]): string[] {
  const seen = new Set<string>()
  return (tags ?? []).filter(Boolean).filter((t) => { const k = tagKey(t); if (seen.has(k)) return false; seen.add(k); return true }).map(tagLabel)
}

export function readTime(body?: string): string {
  if (!body) return '3 min'
  const words = body.trim().split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} min`
}
