// Arbres et graines de la charte « hub » (repris de presentation-skool/videos/hub/index.html).
// Fonctions pures et déterministes (graine fixe) : les SVG des cartes sont générés côté serveur,
// le canvas de l'ouverture (SeedTree) réutilise makeTree / layout / onBranch.

export const TAU = Math.PI * 2
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const eo = (t: number) => 1 - Math.pow(1 - t, 3)

export function rng(s: number) {
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Branch = {
  a: number; len: number; d: number; parent: Branch | null; bend: number; ph: number; kids: Branch[]
  acc: number; X1: number; Y1: number; X2: number; Y2: number; CX: number; CY: number
}

export function makeTree(seed: number, depthMax: number): Branch[] {
  const R = rng(seed)
  const br: Branch[] = []
  ;(function grow(a: number, len: number, d: number, parent: Branch | null) {
    a = clamp(a, -Math.PI + 0.34, -0.34)
    const b: Branch = { a, len, d, parent, bend: (R() - 0.5) * 0.36, ph: R() * TAU, kids: [], acc: 0, X1: 0, Y1: 0, X2: 0, Y2: 0, CX: 0, CY: 0 }
    br.push(b)
    if (parent) parent.kids.push(b)
    if (d >= depthMax) return
    const n = d === 0 ? 2 : R() < 0.26 ? 3 : 2
    for (let i = 0; i < n; i++) {
      const sp = 0.26 + R() * 0.24
      const off = n === 2 ? (i ? sp : -sp) : (i - 1) * sp * 1.1
      grow(a + off + (R() - 0.5) * 0.16, len * (0.68 + R() * 0.12), d + 1, b)
    }
  })(-Math.PI / 2 + (R() - 0.5) * 0.08, 1.3, 0, null)
  return br
}

export function layout(br: Branch[], t: number, amp: number) {
  for (const b of br) {
    const p = b.parent
    b.acc = (p ? p.acc : 0) + (amp ? Math.sin(t * 0.8 + b.ph) * amp * (0.003 + b.d * 0.0045) : 0)
    const a = b.a + b.acc
    const k = b.bend * b.len
    b.X1 = p ? p.X2 : 0
    b.Y1 = p ? p.Y2 : 0
    b.X2 = b.X1 + Math.cos(a) * b.len
    b.Y2 = b.Y1 + Math.sin(a) * b.len
    b.CX = (b.X1 + b.X2) / 2 - Math.sin(a) * k
    b.CY = (b.Y1 + b.Y2) / 2 + Math.cos(a) * k
  }
}

export function bbox(br: Branch[]) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9
  for (const b of br)
    for (const [x, y] of [[b.X1, b.Y1], [b.X2, b.Y2], [b.CX, b.CY]]) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
    }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }
}

export function onBranch(b: Branch, u: number): [number, number, number, number] {
  const v = 1 - u
  const x = v * v * b.X1 + 2 * v * u * b.CX + u * u * b.X2
  const y = v * v * b.Y1 + 2 * v * u * b.CY + u * u * b.Y2
  const dx = 2 * v * (b.CX - b.X1) + 2 * u * (b.X2 - b.CX)
  const dy = 2 * v * (b.CY - b.Y1) + 2 * u * (b.Y2 - b.CY)
  const l = Math.hypot(dx, dy) || 1
  return [x, y, -dy / l, dx / l]
}

export const shapeOf = (R: () => number) => Array.from({ length: 7 }, () => 0.84 + R() * 0.26)

function blobPts(x: number, y: number, r: number, sh: number[], rot: number) {
  const n = sh.length
  return sh.map((f, i) => {
    const a = rot + (i / n) * TAU
    return [x + Math.cos(a) * r * f, y + Math.sin(a) * r * f]
  })
}

export function blobCtx(c: CanvasRenderingContext2D, x: number, y: number, r: number, sh: number[], rot: number) {
  if (r < 3.2) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); return }
  const p = blobPts(x, y, r, sh, rot), n = p.length
  c.beginPath()
  c.moveTo((p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2)
  for (let i = 1; i <= n; i++) {
    const a = p[i % n], b = p[(i + 1) % n]
    c.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
  }
  c.closePath()
  c.fill()
}

function blobD(x: number, y: number, r: number, sh: number[], rot: number) {
  const p = blobPts(x, y, r, sh, rot), n = p.length, f = (v: number) => v.toFixed(2)
  let d = `M${f((p[0][0] + p[1][0]) / 2)} ${f((p[0][1] + p[1][1]) / 2)}`
  for (let i = 1; i <= n; i++) {
    const a = p[i % n], b = p[(i + 1) % n]
    d += `Q${f(a[0])} ${f(a[1])} ${f((a[0] + b[0]) / 2)} ${f((a[1] + b[1]) / 2)}`
  }
  return d + 'Z'
}

// Emblème généré de la « clairière » (bas de page), qui se dessine à l'arrivée.
export function treeSVG(seed: number, depth: number, o: { line: string; dots: string[]; r: number; lw?: number }) {
  const R = rng(seed * 7 + 3), br = makeTree(seed, depth)
  layout(br, 0, 0)
  const bb = bbox(br), s = 200 / bb.h, pad = 16
  const X = (x: number) => ((x - bb.x0) * s + pad).toFixed(1)
  const Y = (y: number) => ((y - bb.y0) * s + pad).toFixed(1)
  let lines = '', dots = '', j = 0
  const col = () => o.dots[(R() * o.dots.length) | 0]
  for (const b of br) {
    const w = Math.max(0.9, 3.2 - b.d * 0.42) * (o.lw || 1)
    lines += `<path class="br" pathLength="1" style="--i:${(b.d * 2 + R() * 1.5) | 0}" d="M${X(b.X1)} ${Y(b.Y1)}Q${X(b.CX)} ${Y(b.CY)} ${X(b.X2)} ${Y(b.Y2)}" stroke="${o.line}" stroke-width="${w.toFixed(2)}"/>`
    if (!b.kids.length)
      dots += `<path class="sd" style="--i:${j++}" fill="${col()}" d="${blobD(+X(b.X2), +Y(b.Y2), o.r * (0.75 + R() * 0.6), shapeOf(R), R() * TAU)}"/>`
    else if (b.d > 1 && R() < 0.4) {
      const q = onBranch(b, 0.4 + R() * 0.5)
      dots += `<path class="sd" style="--i:${j++}" fill="${col()}" d="${blobD(+X(q[0]), +Y(q[1]), o.r * 0.42, shapeOf(R), R() * TAU)}"/>`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(bb.w * s + pad * 2).toFixed(0)} ${200 + pad * 2}" fill="none" stroke-linecap="round">${lines}${dots}</svg>`
}

function smooth(p: number[][]) {
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c
    d += `C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)} ${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0]} ${c[1]}`
  }
  return d
}

type Part = { w: number; rot?: string; pts: number[][]; seeds: number[][] }
type Shape = { lean: string; parts: Part[] }

export const SHAPES: Record<'one' | 'two' | 'side', Shape> = {
  one: { lean: '-8deg', parts: [
    { w: 3.2, pts: [[100, 252], [95, 214], [106, 176], [113, 138], [103, 100], [97, 64], [106, 34], [118, 14]],
      seeds: [[118, 12, 8], [107, 20, 4], [128, 22, 3.6], [112, 31, 3], [103, 9, 3]] }] },
  two: { lean: '6deg', parts: [
    { w: 3.2, pts: [[100, 252], [101, 214], [98, 178], [100, 150]], seeds: [] },
    { w: 2.6, rot: '-14deg', pts: [[100, 150], [88, 118], [70, 88], [56, 56], [50, 26]], seeds: [[50, 21, 7.5], [39, 31, 3.8], [61, 14, 3.4], [59, 33, 3], [42, 15, 2.6]] },
    { w: 2.6, rot: '16deg', pts: [[100, 150], [116, 124], [134, 98], [148, 66], [152, 34]], seeds: [[153, 29, 7], [164, 39, 3.6], [143, 22, 3.4], [161, 23, 2.8], [146, 40, 3]] }] },
  side: { lean: '-7deg', parts: [
    { w: 3.2, pts: [[100, 252], [97, 208], [104, 166], [120, 128], [134, 90], [138, 52], [130, 20]], seeds: [[130, 15, 7.5], [141, 24, 3.8], [120, 10, 3.4], [124, 28, 3], [139, 9, 2.6]] },
    { w: 2.4, rot: '-20deg', pts: [[103, 178], [86, 156], [66, 140], [48, 132], [34, 112]], seeds: [[31, 107, 6.5], [21, 116, 3.4], [40, 99, 3], [25, 99, 2.6], [41, 114, 2.6]] }] },
}

export const LIGHT = { line: '#4B1369', dots: ['#8752B8', '#4B1369', '#FDF6FF'] }
export const DARK = { line: '#D6C2F5', dots: ['#D6C2F5', '#A57CD9', '#FDF6FF'] }

// Arbre dessiné à la main d'une carte : au survol (CSS .deco), il plie, les branches s'ouvrent, les graines s'envolent.
export function decoSVG(sh: Shape, pal: { line: string; dots: string[] }, seed: number) {
  const R = rng(seed)
  let i = 0
  const seedEl = (x: number, y: number, r: number, po?: boolean) => {
    const a = Math.atan2(y - 150, x - 100) + (R() - 0.5) * 1.4
    const m = (po ? 24 : 12) + R() * (po ? 20 : 16)
    return `<path class="sd${po ? ' po' : ''}" fill="${pal.dots[(R() * pal.dots.length) | 0]}" d="${blobD(x, y, po ? r : r * 1.45, shapeOf(R), R() * TAU)}" style="--i:${i++};--dx:${(Math.cos(a) * m).toFixed(1)}px;--dy:${(Math.sin(a) * m * 0.5 + 6).toFixed(1)}px;--s:${(po ? 1.4 : 0.95 + R() * 0.4).toFixed(2)};--sr:${((R() - 0.5) * 160).toFixed(0)}deg;--fx:${((R() - 0.5) * 8).toFixed(1)}px;--fy:${((R() - 0.5) * 8).toFixed(1)}px"/>`
  }
  const part = (p: Part) =>
    `<path d="${smooth(p.pts)}" stroke="${pal.line}" stroke-width="${(p.w * 1.3).toFixed(2)}"/>` + p.seeds.map(([x, y, r]) => seedEl(x, y, r)).join('')
  const [stem, ...brs] = sh.parts
  let inner = part(stem)
  brs.forEach((b) => {
    inner += `<g class="bx" style="--ox:${b.pts[0][0]}px;--oy:${b.pts[0][1]}px;--rot:${b.rot}">${part(b)}</g>`
  })
  const tips = sh.parts.filter((p) => p.seeds.length).map((p) => p.seeds[0])
  for (let k = 0; k < 12; k++) {
    const t = tips[k % tips.length]
    inner += seedEl(t[0] + (R() - 0.5) * 20, t[1] + 6 + R() * 14, 1.2 + R() * 1.4, true)
  }
  return `<g class="tw" style="--lean:${sh.lean}">${inner}</g>`
}
