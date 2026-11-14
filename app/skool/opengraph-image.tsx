import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'Claude to Client · Décroche ton premier client grâce à Claude'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const font = await readFile(join(process.cwd(), 'app/fonts/montserrat-500-latin.woff'))
  const seeds: [number, number, number, string][] = [
    [930, 150, 34, '#8752B8'], [1040, 230, 22, '#4B1369'], [860, 260, 16, '#A57CD9'],
    [1100, 120, 12, '#B89BE6'], [990, 330, 10, '#8752B8'], [1130, 300, 26, '#D6C2F5'],
  ]
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '64px 72px', fontFamily: 'Montserrat', color: '#15110E',
          background: 'linear-gradient(180deg, #EBDDFB 0%, #FDF6FF 70%)', position: 'relative',
        }}
      >
        {seeds.map(([x, y, r, c], i) => (
          <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: c }} />
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, letterSpacing: '-0.02em' }}>
          <svg width="34" height="44" viewBox="0 0 28 36">
            <path d="M14 35V15M14 24L7.5 14.5M14 19.5l7-8.5M14 15V7" stroke="#4B1369" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="14" cy="5.2" r="3.7" fill="#8752B8" />
            <circle cx="6.4" cy="12.6" r="3.1" fill="#4B1369" />
            <circle cx="22" cy="9.4" r="3.3" fill="#A57CD9" />
          </svg>
          Claude to Client
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: '-0.045em', maxWidth: 900 }}>
            Décroche ton premier client grâce à Claude
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 28, color: '#4B1369' }}>
            <span style={{ color: '#8752B8', fontSize: 40, letterSpacing: '-0.05em' }}>9 €/mois à vie</span>
            pour les 100 premiers · liste d’attente
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Montserrat', data: font, weight: 500, style: 'normal' }] },
  )
}
