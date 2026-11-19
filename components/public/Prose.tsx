import type { ReactNode } from 'react'

// Rendu du markdown simple des articles Sanity : titres #/##/###, listes 1. et -, paragraphes,
// **gras**, `code` et [liens](https://…). Construit des éléments React (jamais de HTML brut).

function inline(s: string, k: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g
  let last = 0, i = 0, m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index))
    if (m[1]) out.push(<strong key={`${k}-${i++}`}>{m[1]}</strong>)
    else if (m[2]) out.push(<code key={`${k}-${i++}`}>{m[2]}</code>)
    else out.push(<a key={`${k}-${i++}`} href={m[4]} target="_blank" rel="noopener noreferrer">{m[3]}</a>)
    last = re.lastIndex
  }
  if (last < s.length) out.push(s.slice(last))
  return out
}

export default function Prose({ body }: { body: string }) {
  const out: ReactNode[] = []
  let list: { type: 'ol' | 'ul'; start: number; items: string[] } | null = null
  const flush = () => {
    if (!list) return
    const k = `l${out.length}`
    const items = list.items.map((t, i) => <li key={i}>{inline(t, `${k}-${i}`)}</li>)
    out.push(list.type === 'ol' ? <ol key={k} start={list.start}>{items}</ol> : <ul key={k}>{items}</ul>)
    list = null
  }

  body.split('\n').forEach((raw, i) => {
    const l = raw.trim()
    if (!l) return
    let m: RegExpMatchArray | null
    if ((m = l.match(/^(#{1,3})\s+(.*)$/))) {
      flush()
      out.push(m[1].length === 3 ? <h3 key={i}>{inline(m[2], `h${i}`)}</h3> : <h2 key={i}>{inline(m[2], `h${i}`)}</h2>)
    } else if ((m = l.match(/^(\d+)[.)]\s+(.*)$/))) {
      if (list?.type !== 'ol') { flush(); list = { type: 'ol', start: Number(m[1]), items: [] } }
      list!.items.push(m[2])
    } else if ((m = l.match(/^[-*•]\s+(.*)$/))) {
      if (list?.type !== 'ul') { flush(); list = { type: 'ul', start: 1, items: [] } }
      list!.items.push(m[1])
    } else {
      flush()
      out.push(<p key={i}>{inline(l, `p${i}`)}</p>)
    }
  })
  flush()

  return <div className="prose">{out}</div>
}
