# Media Website — Claude Code Build Script

## Project Overview

Build a full-stack media website + admin dashboard for publishing interviews, blog posts, and short-form content. The frontend is a minimal, editorial-style public site. The backend is a private dashboard for content management.

**Stack:** TypeScript, React, Next.js (App Router), Tailwind CSS, Supabase (database + auth + storage), Vercel (deployment).

---

## Architecture

```
/
├── app/
│   ├── (public)/
│   │   └── page.tsx              ← Homepage (interview list)
│   │   └── interviews/[slug]/    ← Single interview page
│   │   └── blog/[slug]/          ← Single blog post page
│   ├── dashboard/
│   │   ├── layout.tsx            ← Protected layout (auth guard)
│   │   ├── page.tsx              ← Dashboard home (content list)
│   │   ├── new/page.tsx          ← Create new content
│   │   └── edit/[id]/page.tsx    ← Edit existing content
│   └── api/
│       └── revalidate/route.ts   ← On-demand ISR revalidation
├── components/
│   ├── public/
│   │   ├── Header.tsx
│   │   ├── FeaturedInterview.tsx
│   │   └── InterviewGrid.tsx
│   └── dashboard/
│       ├── ContentForm.tsx
│       └── ContentTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── types.ts
└── middleware.ts                  ← Auth protection for /dashboard
```

---

## Step-by-Step Build Instructions

### STEP 1 — Init the project

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
npm install @supabase/supabase-js @supabase/ssr
```

---

### STEP 2 — Supabase Setup

**Create a Supabase project at supabase.com, then run this SQL in the SQL editor:**

```sql
-- Content table (interviews, blog posts, short posts)
create table content (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('interview', 'blog', 'post')),
  title text not null,
  slug text not null unique,
  description text,
  body text,                        -- markdown or rich text for blog/post
  youtube_url text,                 -- for interviews
  thumbnail_url text,               -- auto-extracted or uploaded
  guest_name text,                  -- for interviews
  guest_title text,                 -- for interviews
  tags text[],
  published boolean default false,
  featured boolean default false,   -- pins to top as "latest interview"
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger content_updated_at
  before update on content
  for each row execute function update_updated_at();

-- RLS policies
alter table content enable row level security;

-- Public can read published content
create policy "Public can read published content"
  on content for select
  using (published = true);

-- Only authenticated users (you) can do everything
create policy "Authenticated can manage content"
  on content for all
  using (auth.role() = 'authenticated');
```

**Add env variables to `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

### STEP 3 — Types (`lib/types.ts`)

```typescript
export type ContentType = 'interview' | 'blog' | 'post'

export interface Content {
  id: string
  type: ContentType
  title: string
  slug: string
  description?: string
  body?: string
  youtube_url?: string
  thumbnail_url?: string
  guest_name?: string
  guest_title?: string
  tags?: string[]
  published: boolean
  featured: boolean
  published_at?: string
  created_at: string
  updated_at: string
}
```

---

### STEP 4 — Supabase clients

**`lib/supabase/client.ts`** (browser)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/server.ts`** (server components)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

---

### STEP 5 — Middleware (auth guard for dashboard)

**`middleware.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

---

### STEP 6 — Public Homepage (`app/page.tsx`)

Design specs:
- **Header**: Logo/name left, minimal nav right (no hamburger menu on desktop)
- **Featured interview**: Full-width or large card — YouTube thumbnail, guest name + title, description. Bold, editorial feel.
- **Interview grid**: Below the featured one, a clean grid (2 or 3 cols) of past interviews. Each card: thumbnail, guest name, title, short description, date.
- **Style**: Dark editorial (near-black background `#0D0D0D`, off-white text `#F0EDE8`, accent color one bold tone — e.g. warm amber `#E8A320` or electric green). Typography: a strong serif or display font for titles (e.g. Playfair Display, Fraunces, or DM Serif Display from Google Fonts) paired with a clean sans for body (e.g. DM Sans, Outfit).

```typescript
// app/page.tsx
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import FeaturedInterview from '@/components/public/FeaturedInterview'
import InterviewGrid from '@/components/public/InterviewGrid'

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const supabase = createClient()

  // Get the featured interview
  const { data: featured } = await supabase
    .from('content')
    .select('*')
    .eq('type', 'interview')
    .eq('published', true)
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  // Get other published interviews (exclude featured)
  const { data: interviews } = await supabase
    .from('content')
    .select('*')
    .eq('type', 'interview')
    .eq('published', true)
    .eq('featured', false)
    .order('published_at', { ascending: false })
    .limit(20)

  return (
    <main>
      <Header />
      {featured && <FeaturedInterview interview={featured} />}
      {interviews && interviews.length > 0 && (
        <InterviewGrid interviews={interviews} />
      )}
    </main>
  )
}
```

---

### STEP 7 — Public Components

#### `components/public/Header.tsx`
- Left: brand name (large, styled with display font)
- Right: simple nav links — "Interviews", "Blog", maybe "À propos"
- Sticky on scroll, with a subtle backdrop blur
- No border by default, thin accent line on scroll

#### `components/public/FeaturedInterview.tsx`
Props: `{ interview: Content }`

- Extract YouTube video ID from `youtube_url` and generate thumbnail: `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`
- Large image left (or full-width hero with overlay text)
- Text right: label "DERNIÈRE INTERVIEW", guest name (huge display font), guest title, short description, "Regarder →" link
- Link to `/interviews/[slug]`

#### `components/public/InterviewGrid.tsx`
Props: `{ interviews: Content[] }`

- Section title: "TOUTES LES INTERVIEWS"
- Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
- Each card: YouTube thumbnail (16:9), guest name, guest title, date, hover effect (slight scale + accent underline)

**Utility — extract YouTube ID:**
```typescript
// lib/youtube.ts
export function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '/placeholder.jpg'
}
```

---

### STEP 8 — Interview Detail Page (`app/interviews/[slug]/page.tsx`)

- Embed the YouTube video (responsive iframe, aspect-ratio-video Tailwind class)
- Guest name, title below
- Description / body below that
- Back link to homepage

---

### STEP 9 — Dashboard Layout + Auth

#### `app/login/page.tsx`
Simple email/password login form using Supabase auth. After login → redirect to `/dashboard`.

#### `app/dashboard/layout.tsx`
- Sidebar navigation: Dashboard, Nouveau contenu, Se déconnecter
- Protected: if no user, middleware already redirects to /login
- Clean, dark sidebar with accent color, very different from public site

#### `app/dashboard/page.tsx`
- Table of all content (all types, all statuses)
- Columns: Type, Title, Status (published/draft), Featured, Date, Actions (Edit, Delete, Toggle published)
- Filter tabs: All | Interviews | Blog | Posts
- Button: "+ Nouveau contenu"

---

### STEP 10 — Content Form (`app/dashboard/new/page.tsx` + `app/dashboard/edit/[id]/page.tsx`)

**`components/dashboard/ContentForm.tsx`** — unified create/edit form:

Fields:
- `type`: select — Interview / Blog / Post
- `title`: text input
- `slug`: auto-generated from title, editable
- `description`: textarea
- `body`: textarea (markdown, for blog/post)
- `youtube_url`: text input (for interviews — show thumbnail preview on paste)
- `thumbnail_url`: text input or file upload (optional override)
- `guest_name`: text input (shown only when type = interview)
- `guest_title`: text input (shown only when type = interview)
- `tags`: tag input (comma-separated)
- `published`: toggle switch
- `featured`: toggle switch (only one interview should be featured at a time — warn if another is already featured)
- `published_at`: date picker (defaults to now)

**Auto-slug generation:**
```typescript
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
```

**On save:**
1. Upsert to Supabase
2. Call `/api/revalidate` to trigger ISR revalidation of homepage and content page
3. Redirect to `/dashboard`

---

### STEP 11 — ISR Revalidation (`app/api/revalidate/route.ts`)

```typescript
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  revalidatePath('/')
  revalidatePath('/interviews/[slug]', 'page')
  revalidatePath('/blog/[slug]', 'page')
  return NextResponse.json({ revalidated: true })
}
```

---

## Visual Design Directives

Apply these strictly across all public-facing components:

```css
/* Design tokens */
--bg: #0D0D0D;
--surface: #161616;
--border: #222222;
--text-primary: #F0EDE8;
--text-secondary: #888888;
--accent: #E8A320;        /* warm amber — adjust to match screenshot */
--accent-hover: #F5B830;

/* Typography */
--font-display: 'Fraunces', 'Playfair Display', Georgia, serif;  /* titles */
--font-body: 'DM Sans', 'Outfit', system-ui, sans-serif;          /* body */
```

Google Fonts import (add to `app/layout.tsx`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
```

**Hover interactions:** cards should have a subtle `translateY(-2px)` + accent border reveal on hover. No heavy shadows — use borders and color instead.

**No rounded corners** on main structural elements (cards, containers). Use sharp edges for an editorial feel. Small radius (2–4px) only for tags and badges.

---

## Global Tailwind Config (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D0D',
        surface: '#161616',
        border: '#222222',
        accent: '#E8A320',
        'text-primary': '#F0EDE8',
        'text-secondary': '#888888',
      },
      fontFamily: {
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Deployment

```bash
# Push to GitHub
git init && git add . && git commit -m "init"
gh repo create my-media-site --public --push

# Deploy to Vercel
npx vercel --prod
# Set env vars in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
```

---

## What to Build — Priority Order

1. Supabase schema (SQL above)
2. Next.js project init + Tailwind + Supabase clients
3. Middleware (auth)
4. Types + utilities (slugify, YouTube helpers)
5. Public homepage (Header + FeaturedInterview + InterviewGrid)
6. Interview detail page
7. Login page
8. Dashboard layout + content table
9. Content form (create + edit)
10. ISR revalidation endpoint
11. Deploy to Vercel

---

## Notes for Claude Code

- Use **Server Components** by default. Only add `'use client'` when needed (forms, interactive elements, auth state).
- Use **`next/image`** for all images with proper `width`/`height` or `fill` props.
- The dashboard does **not** need to be beautiful — clean, functional, dark UI is fine.
- The **public site** must be exceptional visually — editorial, sharp, memorable.
- If a screenshot is provided by the user, extract exact colors, font weights, spacing ratios, and component layouts from it. Override the design tokens above accordingly.
- Generate **realistic placeholder content** (3–5 interviews, 2 blog posts) via a seed script at `scripts/seed.ts` so the site looks complete from day one.
