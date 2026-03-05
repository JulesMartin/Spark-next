# Spark Website — Memory

## Project
- Location: `/Users/julesmartin/Desktop/spark-next`
- Stack: Next.js 16 (App Router), Tailwind v4, Supabase, TypeScript
- Site name: **Spark**

## Design tokens (dark editorial)
- bg: `#0D0D0D`, surface: `#161616`, edge: `#222222`
- accent: `#E8A320` (amber), accent-light: `#F5B830`
- cream: `#F0EDE8`, muted: `#888888`
- font-display: Fraunces, font-body: DM Sans

## Key architectural notes
- Tailwind v4: config is in `app/globals.css` `@theme {}` block (no tailwind.config.ts)
- Next.js 16: `middleware.ts` → renamed to `proxy.ts`, export `proxy` (not `middleware`)
- Next.js 15+: `cookies()` from `next/headers` must be awaited
- Route params are `Promise<{slug}>` in Next.js 15+: `const { slug } = await params`
- Mock data in `lib/mock-data.ts` — replace with Supabase queries when configured
- Supabase not yet configured — env vars empty in `.env.local`

## Status
- [x] Full build compiles cleanly
- [ ] Supabase credentials not yet added
- [ ] Not deployed to Vercel yet

## File map
- Design: `app/globals.css` (@theme tokens)
- Layout: `app/layout.tsx` (Fraunces + DM Sans fonts)
- Config: `next.config.ts` (remote image domains: youtube, unsplash, supabase)
- Auth proxy: `proxy.ts`
- Types: `lib/types.ts`
- Mock data: `lib/mock-data.ts`
- Public: `components/public/` Header, FeaturedInterview, InterviewGrid
- Dashboard: `components/dashboard/` ContentTable, ContentForm
