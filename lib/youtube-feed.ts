export interface YouTubeVideo {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  publishedAt: string
}

const CHANNEL_ID = 'UCbfucDBGTg_qarA8qJpMe-A'
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

function extractTagContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`)
  const match = xml.match(regex)
  if (!match) return ''
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\/n\/n\/n/g, ' ')
    .replace(/\/n/g, ' ')
}

function parseEntries(xml: string): YouTubeVideo[] {
  const entries: YouTubeVideo[] = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1]
    const videoId = extractTagContent(entry, 'yt:videoId')
    if (!videoId) continue

    const title = decodeEntities(extractTagContent(entry, 'title'))
    const published = extractTagContent(entry, 'published')

    const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)
    const rawDesc = descMatch
      ? descMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
      : ''
    const description = decodeEntities(rawDesc)

    entries.push({
      id: videoId,
      title,
      description,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      publishedAt: published,
    })
  }

  return entries
}

export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'application/atom+xml,application/xml,text/xml,*/*',
      },
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseEntries(xml)
  } catch {
    return []
  }
}
