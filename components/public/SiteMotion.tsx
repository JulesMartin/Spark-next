'use client'

import { useEffect, useRef } from 'react'
import {
  TAU, bbox, blobCtx, clamp, eio, eo, layout, lerp, makeTree, onBranch, rng, shapeOf, type Branch,
} from '@/lib/skool-art'

// Animations des pages publiques, reprises du hub de la section : apparition des blocs au scroll,
// arbre de points de l'accueil (canvas, il éclate dès qu'on scrolle), clairière et signature du pied de page.
export default function SiteMotion({ tree = false }: { tree?: boolean | 'soft' }) {
  const cvRef = useRef<HTMLCanvasElement>(null)
  const anchorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = (cvRef.current ?? anchorRef.current)?.closest('.site') as HTMLElement | null
    if (!root) return
    const RM = matchMedia('(prefers-reduced-motion:reduce)').matches
    const cleanups: (() => void)[] = []

    /* ── apparition au scroll (l'ouverture .in0 s'anime en CSS, sans attendre le JavaScript) ── */
    if (!RM && 'IntersectionObserver' in window) {
      const page = root.querySelector('#page')
      const SEL = 'h2,h3,p,li,.card,.rvb'
      const list = page
        ? [...page.querySelectorAll<HTMLElement>(SEL)].filter(
            (el) => !el.closest('.in0') && !(el.parentElement && el.parentElement.closest(SEL)),
          )
        : []
      list.forEach((el) => el.classList.add('rv'))
      const timers: number[] = []
      // Décalage seulement entre les blocs qui entrent ensemble (une grille, une rangée) ; un paragraphe
      // qui arrive seul en lisant apparaît sans attendre.
      const io = new IntersectionObserver((es) => {
        let k = 0
        es.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          io.unobserve(el)
          el.style.setProperty('--d', el.dataset.d ?? String(Math.min(k++, 6) * 90))
          el.classList.add('in')
          timers.push(window.setTimeout(() => { el.classList.remove('rv', 'in'); el.style.removeProperty('--d') }, 2600))
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
      list.forEach((el) => io.observe(el))
      cleanups.push(() => { io.disconnect(); timers.forEach(clearTimeout); list.forEach((el) => el.classList.remove('rv', 'in')) })
    }
    root.classList.add('ready')

    /* ── clairière : l'arbre se dessine à l'arrivée, ses graines fuient le pointeur ── */
    const cl = root.querySelector<HTMLElement>('.clearing')
    if (cl) {
      const svg = cl.querySelector('svg')
      const seeds = [...cl.querySelectorAll<SVGGraphicsElement>('.sd')].map((el) => {
        const b = el.getBBox()
        return { el, x: b.x + b.width / 2, y: b.y + b.height / 2 }
      })
      let px = 0, py = 0, pf = 0
      const apply = () => {
        pf = 0
        const m = svg?.getScreenCTM()
        if (!m) return
        for (const s of seeds) {
          const p = new DOMPoint(s.x, s.y).matrixTransform(m), dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy)
          if (d < 110 && d > 0.1) { const q = (1 - d / 110) ** 1.3 * 38; s.el.style.translate = `${(dx / d) * q}px ${(dy / d) * q}px` }
          else if (s.el.style.translate) s.el.style.translate = ''
        }
      }
      const push = (e: PointerEvent) => {
        if (!cl.classList.contains('live')) return
        px = e.clientX; py = e.clientY
        if (!pf) pf = requestAnimationFrame(apply)
      }
      cleanups.push(() => cancelAnimationFrame(pf))
      if (!RM) { addEventListener('pointermove', push, { passive: true }); cleanups.push(() => removeEventListener('pointermove', push)) }
      let liveT = 0
      const grow = () => { cl.classList.add('on'); liveT = window.setTimeout(() => cl.classList.add('live'), 2400) }
      cleanups.push(() => clearTimeout(liveT))
      if (RM || !('IntersectionObserver' in window)) grow()
      else {
        const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { grow(); io.disconnect() } }, { threshold: 0.45 })
        io.observe(cl)
        cleanups.push(() => io.disconnect())
      }
    }

    /* ── signature du bas : toute la largeur ── */
    const mk = root.querySelector<HTMLElement>('.mark span')
    const fitMark = () => {
      if (!mk) return
      mk.style.fontSize = '100px'
      const w = mk.getBoundingClientRect().width, Wp = mk.parentElement!.clientWidth
      if (w) mk.style.fontSize = ((100 * Wp) / w * 0.985).toFixed(2) + 'px'
    }

    /* ── arbre de points : posé dans .treebox, son pied caché derrière [data-tree-foot] ── */
    const cv = cvRef.current
    const ctx = cv?.getContext('2d') ?? null
    const hero = root.querySelector<HTMLElement>('.hero-tree')
    const h1 = hero?.querySelector<HTMLElement>('h1') ?? null
    const mast = root.querySelector<HTMLElement>('.mast')
    const box = root.querySelector<HTMLElement>('.treebox')
    // 'soft' : l'arbre pousse derrière le texte, en transparence ; ses points reprennent leur couleur en se détachant.
    const softA = tree === 'soft' ? 0.34 : 1
    const foot = hero?.querySelector<HTMLElement>('[data-tree-foot]') ?? null
    type Dot = {
      sx: number; sy: number; a0: number; f1: number; f2: number; p1: number; p2: number; amp: number; curv: number
      sh: number[]; rot: number; rsp: number; ox: number; oy: number; m: number; al: number; x: number; y: number
      b?: Branch; u?: number; off?: number; r: number; col: string; del?: number; dur?: number; dust?: 1; free?: 1; fx?: number; fy?: number
    }
    let W = 0, H = 0, dpr = 1, S = 1, ox = 0, oy = 0, lwF = 1, mastB = 0, small = false
    let treeB: Branch[] = [], dots: Dot[] = [], avoid: { x0: number; y0: number; x1: number; y1: number }[] = []
    const mouse = { x: -1e4, y: -1e4 }
    const offs = (el: HTMLElement) => {
      let x = 0, y = 0, n: HTMLElement | null = el
      while (n) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight }
    }
    const rel = (el: HTMLElement) => { const a = offs(el), r = offs(root); return { ...a, x: a.x - r.x, y: a.y - r.y } }

    // L'arbre remplit .treebox (centré dessus) ; avec [data-tree-foot], son pied se cache derrière cet élément.
    function measure() {
      dpr = Math.min(2, devicePixelRatio || 1)
      W = root!.clientWidth
      const tb = rel(box!), hd = rel(h1!), ms = rel(mast!)
      const bottom = foot ? rel(foot).y + 48 : tb.y + tb.h - 6
      const top = tb.y + 6, bh = bottom - top
      H = Math.round(Math.max(hd.y + hd.h + 24, bottom))
      cv!.style.height = H + 'px'
      cv!.width = (W * dpr) | 0; cv!.height = (H * dpr) | 0
      mastB = ms.y + ms.h + 12
      const bb = bbox(treeB)
      const bw = Math.min(tb.w * 0.95, W * 0.94, bh * 1.7)
      S = Math.min(bh / bb.h, bw / bb.w)
      ox = tb.x + tb.w / 2 - ((bb.x0 + bb.x1) / 2) * S
      oy = top - bb.y0 * S
      lwF = clamp(S / 120, 0.65, 1.4)
      avoid = [{ x0: ox + bb.x0 * S - 24, y0: oy + bb.y0 * S - 24, x1: ox + bb.x1 * S + 24, y1: oy + bb.y1 * S + 12 }]
      hero!.querySelectorAll<HTMLElement>('h1,[data-avoid]').forEach((el) => {
        const r = rel(el)
        avoid.push({ x0: r.x - 26, y0: r.y - 26, x1: r.x + r.w + 26, y1: r.y + r.h + 18 })
      })
      const R = rng(11)
      const hit = (x: number, y: number, r: number) => avoid.some((a) => x > a.x0 - r && x < a.x1 + r && y > a.y0 - r && y < a.y1 + r)
      const yMax = Math.min(innerHeight + 80, oy + bb.y1 * S + 30, H - 30)
      // Une bande verticale par point libre : ils se répartissent sur toute la largeur au lieu de s'agglutiner.
      const free = dots.filter((d) => d.free)
      // Pas de place dans sa bande : le point n'est pas dessiné (plutôt que de s'entasser ailleurs).
      free.forEach((d, i) => {
        d.fx = d.fy = -999
        for (let k = 0; k < 120; k++) {
          const x = ((i + 0.15 + R() * 0.7) / free.length) * W, y = mastB + d.r + R() * (yMax - mastB - d.r)
          if (!hit(x, y, d.r + 16)) {
            d.fx = x; d.fy = y
            avoid.push({ x0: x - d.r - 14, y0: y - d.r - 14, x1: x + d.r + 14, y1: y + d.r + 14 })
            break
          }
        }
      })
    }

    function build() {
      small = innerWidth < 700
      const DM = small ? 5 : 6
      treeB = makeTree(58, DM); layout(treeB, 0, 0)
      const R = rng(131), tips = treeB.filter((b) => !b.kids.length)
      const wt = treeB.map((b) => (b.d < 2 ? 0.25 : b.d + 1)), tw = wt.reduce((a, b) => a + b, 0)
      const pick = () => { let r = R() * tw; for (let i = 0; i < treeB.length; i++) { r -= wt[i]; if (r <= 0) return treeB[i] } return treeB[treeB.length - 1] }
      dots = []
      const add = (o: Partial<Dot> & { r: number; col: string }) => dots.push(Object.assign({
        sx: R(), sy: R(), a0: R() * 0.5, f1: 0.3 + R() * 0.5, f2: 0.3 + R() * 0.5, p1: R() * TAU, p2: R() * TAU, amp: 5 + R() * 10,
        curv: (R() - 0.5) * 160, sh: shapeOf(R), rot: R() * TAU, rsp: (R() - 0.5) * 0.4, ox: 0, oy: 0, m: 0, al: 0, x: 0, y: 0,
      }, o))
      tips.forEach((b) => add({ b, u: 1, off: 0, r: 4 + R() * 5.5, col: ['#8752B8', '#4B1369', '#A57CD9'][(R() * 3) | 0], del: 0.9 + (b.d / DM) * 0.7 + R() * 0.7, dur: 1.3 + R() * 0.7 }))
      for (let i = 0, n = small ? 95 : 170; i < n; i++) {
        const b = pick()
        add({ b, u: 0.2 + R() * 0.8, off: (R() - 0.5) * 2, r: 1 + R() * 1.8, col: ['#8752B8', '#A57CD9', '#4B1369', '#B89BE6'][(R() * 4) | 0], del: 0.9 + (b.d / DM) * 0.7 + R() * 0.9, dur: 1.2 + R() * 0.9, dust: 1 })
      }
      for (let i = 0, n = small ? 5 : 9; i < n; i++) add({ free: 1, r: (small ? 6 : 8) + R() * (small ? 14 : 24), col: i === 2 ? '#4B1369' : i === 5 ? '#D6C2F5' : '#8752B8' })
      measure()
    }

    function draw(T: number) {
      if (!ctx) return
      const s = RM ? 0 : clamp(scrollY / (innerHeight * 0.3), 0, 1), b = 1 - (1 - s) * (1 - s), amp = RM ? 0 : clamp((T - 2.2) / 2, 0, 1)
      layout(treeB, T, amp)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H)
      let loose = 0
      for (const d of dots) {
        d.al = RM ? 1 : clamp((T - d.a0) / 0.6, 0, 1)
        const fx = RM ? 0 : Math.sin(T * d.f1 + d.p1) * d.amp, fy = RM ? 0 : Math.cos(T * d.f2 + d.p2) * d.amp
        let x: number, y: number
        if (d.free) { x = d.fx! + fx * 1.3; y = d.fy! + fy * 1.3 }
        else {
          const m = (RM ? 1 : eio(clamp((T - d.del!) / d.dur!, 0, 1))) * (1 - b)
          const q = onBranch(d.b!, d.u!), off = d.off! * 9 * lwF, tx = ox + q[0] * S + q[2] * off, ty = oy + q[1] * S + q[3] * off
          const px = d.sx * W + fx, py = 12 + d.sy * (H - 40) + fy, dx = tx - px, dy = ty - py, l = Math.hypot(dx, dy) || 1, arc = Math.sin(m * Math.PI) * d.curv
          x = lerp(px, tx, m) - (dy / l) * arc; y = lerp(py, ty, m) + (dx / l) * arc; d.m = m; loose = Math.max(loose, 1 - m)
        }
        const mx = x - mouse.x, my = y - mouse.y, md = Math.hypot(mx, my)
        let gx = 0, gy = 0
        if (md < 90 && md > 0.1) { const q = (1 - md / 90) ** 2 * 28; gx = (mx / md) * q; gy = (my / md) * q }
        d.ox += (gx - d.ox) * 0.12; d.oy += (gy - d.oy) * 0.12; d.x = x + d.ox; d.y = y + d.oy
      }
      if (loose > 0.02) {
        ctx.lineWidth = 0.8; ctx.strokeStyle = '#8752B8'
        const L = dots.filter((d) => d.dust || d.free), D = 95
        for (let i = 0; i < L.length; i++) {
          const a = L[i], wa = (1 - a.m) * a.al
          if (wa < 0.02) continue
          for (let j = i + 1; j < L.length; j++) {
            const c = L[j], dx = a.x - c.x
            if (dx > D || dx < -D) continue
            const dy = a.y - c.y
            if (dy > D || dy < -D) continue
            const dd = Math.hypot(dx, dy)
            if (dd > D) continue
            const al = 0.28 * wa * (1 - c.m) * c.al * (1 - dd / D)
            if (al < 0.01) continue
            ctx.globalAlpha = al; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke()
          }
        }
      }
      const la = RM ? 1 : clamp(1 - b * 1.5, 0, 1)
      if (la > 0) {
        ctx.lineCap = 'round'; ctx.strokeStyle = '#4B1369'
        for (const br of treeB) {
          const g = RM ? 1 : eo(clamp((T - (0.75 + br.d * 0.2)) / 0.55, 0, 1))
          if (g <= 0) continue
          const x0 = ox + br.X1 * S, y0 = oy + br.Y1 * S, cx = ox + br.CX * S, cy = oy + br.CY * S, x2 = ox + br.X2 * S, y2 = oy + br.Y2 * S
          const qx = lerp(x0, cx, g), qy = lerp(y0, cy, g), rx = lerp(qx, lerp(cx, x2, g), g), ry = lerp(qy, lerp(cy, y2, g), g)
          ctx.globalAlpha = la * softA * (0.55 + 0.4 * (1 - br.d / 7)); ctx.lineWidth = Math.max(0.8, 3.2 - br.d * 0.42) * lwF
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(qx, qy, rx, ry); ctx.stroke()
        }
      }
      for (const d of dots) {
        if (d.al <= 0 || d.fx === -999) continue
        ctx.globalAlpha = d.al * (d.free ? 0.92 : lerp(1, softA, d.m)); ctx.fillStyle = d.col
        blobCtx(ctx, d.x, d.y, d.r * (d.free ? 1 : lwF * 0.9 + 0.1) * (0.4 + 0.6 * eo(d.al)), d.sh, d.rot + (RM ? 0 : T * d.rsp))
      }
      ctx.globalAlpha = 1
    }

    let raf = 0, t0 = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!t0) t0 = now
      const T = (now - t0) / 1000
      if (scrollY > H + 40 && T > 5) return
      draw(T)
    }
    const ok = !!(tree && cv && ctx && hero && h1 && mast && box)
    if (ok) {
      build()
      if (RM) draw(99); else raf = requestAnimationFrame(frame)
    }
    const onMove = (e: PointerEvent) => { if (!cv) return; const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    const onLeave = () => { mouse.x = mouse.y = -1e4 }
    let rz = 0
    const onResize = () => {
      cancelAnimationFrame(rz)
      rz = requestAnimationFrame(() => {
        fitMark()
        if (ok) { if ((innerWidth < 700) !== small) build(); else measure(); if (RM) draw(99) }
      })
    }
    if (ok) {
      addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
    addEventListener('resize', onResize)
    fitMark()
    const late = window.setTimeout(() => { fitMark(); if (ok) measure() }, 2600)
    document.fonts?.ready.then(() => { fitMark(); if (ok) { measure(); if (RM) draw(99) } })

    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(rz); clearTimeout(late)
      removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      removeEventListener('resize', onResize)
      cleanups.forEach((f) => f())
      root.classList.remove('ready')
    }
  }, [tree])

  return tree
    ? <canvas id="seeds" ref={cvRef} aria-hidden="true" />
    : <span ref={anchorRef} hidden />
}
