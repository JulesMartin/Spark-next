# Spark — Claude Code Context

## Qui / Quoi

**Spark** est le site média de Jules Martin, créateur de contenu IA pour les entrepreneurs et TPE. La chaîne YouTube s'appelle **Z-Start-Web** (ID canal : `UCbfucDBGTg_qarA8qJpMe-A`). Le site est à la fois un site éditorial public et un système de capture d'emails + candidatures.

---

## Stack technique

| Couche | Outil |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Style | Tailwind CSS + inline styles (design tokens custom) |
| Base de données + Auth | Supabase (project `emixscupfsvvehjzjykx`) |
| CMS blog | Sanity (project `u7ptqvl2`, dataset `production`) |
| Email automation | Brevo (contacts + envois transactionnels) |
| Email notif candidatures | Resend (domaine vérifié `jules-api.com`) |
| Déploiement | Vercel |

---

## Architecture des pages publiques

```
/                        → Homepage (RSS YouTube + Hero + Interviews)
/interviews/[slug]       → Détail interview (Supabase table content)
/blog                    → Liste articles (Sanity)
/blog/[slug]             → Détail article (Sanity)
/a-propos                → Page À propos de Jules Martin
/devenir-invite          → Formulaire candidature invité
/prompts-ia              → Lead magnet (233 prompts + 10 skills Claude)
/capture?c=[slug]        → Page de capture générique par campagne
/studio                  → Sanity Studio embarqué (Next.js route)
```

---

## Sources de données par page

**Homepage (`/`)** — lit le flux RSS YouTube via `lib/youtube-feed.ts`. `revalidate: 3600`. La première vidéo est "featured", les suivantes vont dans la grille.

**Interviews (`/interviews/[slug]`)** — Supabase table `content`, filtre `type = 'interview'` + `published = true`. Les interviews sont créées depuis le dashboard.

**Blog (`/blog` et `/blog/[slug]`)** — Sanity, type `post`, filtre `status == "published"`. Les drafts sont créés par le workflow "publie [url]".

**Capture (`/capture?c=[slug]`)** — formulaire générique. Le paramètre `c` définit la campagne. Appelle `/api/capture`.

**Prompts IA (`/prompts-ia`)** — lead magnet fixe. Appelle `/api/subscribe` (source `prompts-ia`).

**Devenir invité (`/devenir-invite`)** — formulaire candidature. Appelle `/api/candidature`.

---

## Supabase — tables

### `content`
Interviews gérées depuis le dashboard.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `type` | text | `interview` / `blog` / `post` |
| `title` | text | |
| `slug` | text | unique |
| `description` | text | |
| `body` | text | markdown |
| `youtube_url` | text | |
| `thumbnail_url` | text | |
| `guest_name` | text | |
| `guest_title` | text | |
| `episode_number` | int | |
| `tags` | text[] | |
| `published` | bool | RLS : public lit seulement si true |
| `featured` | bool | épingle en hero |
| `published_at` | timestamptz | |

### `email_subscribers`
Capturés depuis `/capture` et `/prompts-ia`.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `email` | text | lowercase, dédupliqué |
| `source` | text | slug campagne (ex: `cowork-dm`, `prompts-ia`) |
| `created_at` | timestamptz | |

### `candidatures`
Soumissions depuis `/devenir-invite`.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | |
| `email` | text | |
| `business_type` | text | |
| `monthly_revenue` | text | |
| `monthly_clients` | text | |
| `motivation` | text | optionnel |
| `ip` | text | rate limiting |
| `created_at` | timestamptz | |

Lien dashboard Supabase : https://supabase.com/dashboard/project/emixscupfsvvehjzjykx

---

## API Routes

| Route | Méthode | Rôle |
|---|---|---|
| `/api/capture` | POST | Capture email campagne → Supabase + Brevo upsert + envoi template |
| `/api/subscribe` | POST | Lead magnet → Supabase + Brevo upsert (sans template) |
| `/api/candidature` | POST | Candidature invité → Supabase + notif email Resend |
| `/api/revalidate` | POST | ISR revalidation manuelle (`/` + `/interviews/[slug]` + `/blog/[slug]`) |
| `/api/auth/signout` | POST | Déconnexion Supabase |

---

## Brevo — email automation

Config dans `lib/brevo.ts`.

**`CAMPAIGN_TEMPLATES`** : mappe un slug de campagne → ID template Brevo. Ajouter une ligne ici pour chaque nouvelle campagne.

```ts
const CAMPAIGN_TEMPLATES: Record<string, number> = {
  'cowork-dm': 3,   // template "Ressource Cowork DM"
}
```

**Flux `/api/capture`** :
1. Insert dans Supabase `email_subscribers` (si email nouveau)
2. `upsertBrevoContact` → crée/met à jour le contact avec attribut `CAMPAIGN = slug`
3. `sendCampaignEmail` → envoie le template Brevo correspondant au slug

**Flux `/api/subscribe`** (`/prompts-ia`) :
1. Insert dans Supabase `email_subscribers`
2. `upsertBrevoContact` seulement — pas d'envoi de template (l'automation Brevo prend le relais via l'attribut CAMPAIGN)

**Env vars Brevo** :
- `BREVO_API_KEY` — clé API
- `BREVO_LIST_ID` — ID liste Brevo (optionnel)

Voir `LISTE_MAILS.md` pour le guide complet d'ajout d'une nouvelle campagne.

---

## Resend — notifications candidatures

Utilisé uniquement pour `/api/candidature`. Envoie un email de notification à `CONTACT_EMAIL` (actuellement `julesmartinlouisappledev@hotmail.com`) à chaque nouvelle candidature.

**Env vars** :
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` — ex: `Spark <contact@jules-api.com>`
- `CONTACT_EMAIL` — destinataire des notifs

---

## Sanity CMS

- **Project ID** : `u7ptqvl2`
- **Dataset** : `production`
- **Studio local** : `http://localhost:3000/studio`
- **Studio prod** : `https://spark-studio.sanity.studio`
- **Client** : `lib/sanity/client.ts`

**Schema document `post`** : `_type`, `title`, `slug` (object), `excerpt`, `body` (markdown texte), `tags`, `youtubeUrl`, `coverImageUrl` (calculée auto depuis youtubeUrl), `publishedAt`, `status` (`draft` | `published`).

Les drafts sont créés par le script `scripts/create-sanity-post.mjs` via le workflow "publie [url]". L'utilisateur publie manuellement depuis Sanity Studio. Ne jamais créer de doublon de slug.

---

## Workflow "publie [url youtube]"

Déclenché quand l'utilisateur dit **"publie [url]"**. Voir `WORKFLOW_ARTICLE.md` pour le détail complet.

**Résumé** :
1. `yt-dlp` → extrait les sous-titres automatiques (préférer `.fr`, sinon `.en`) → nettoie le VTT en texte brut
2. Lire `BLOG_PROMPT.md` (style éditorial) ET `SEO-optimization.md` (SEO) → générer l'article en JSON `{ title, slug, excerpt, body, tags, youtubeUrl }`
3. `echo '<json>' | node scripts/create-sanity-post.mjs` → crée le draft dans Sanity
4. Afficher titre + slug + lien Studio prod à l'utilisateur

---

## Design system

### Palette (site public sombre)
```
bg          #0D0D0D      (Tailwind: bg-bg)
surface     #161616      (bg-surface)
border      #222222      (border-border / border-edge)
text        #F0EDE8      (text-cream)
muted       #888888      (text-muted)
accent      #EAAF48      (text-accent / bg-accent)
```

### Palette (pages capture — fond clair)
```
bg          #FCFCD0      (jaune paille)
highlight   #FEE04F      (jaune vif — boutons, badges)
text        #000000
```

### Typographie
- **Display / titres** : Fraunces (variable `--font-fraunces`) → classe Tailwind `font-display`
- **Body** : DM Sans (variable `--font-dm-sans`) → classe Tailwind `font-body`
- **Pages capture uniquement** : Raleway (`--font-raleway`) + Assistant (`--font-assistant`) — chargés dans `app/capture/layout.tsx`

### Règles visuelles site public
- Pas de border-radius sur les éléments structurels (cards, containers) — editorial sharp
- Border-radius 2–4px uniquement sur tags et badges
- Hover cards : `translateY(-2px)` + accent border reveal, pas de shadow lourde
- Pages capture : style différent (fond jaune, Raleway, coins nets, shadow néo-brutaliste `6px 6px 0 #1A1A1A`)

---

## Composants publics

```
components/public/
  Header.tsx           ← sticky, blur, nav 3 liens (Interviews / Blog / À propos), logo Spark réduit (17px), sans bouton CTA
  HeroSection.tsx      ← hero homepage avec vidéo featured
  FeaturedInterview.tsx← grande card vidéo featured
  InterviewGrid.tsx    ← grille 3 cols des autres vidéos
  Newsletter.tsx       ← section abonnement newsletter
  Footer.tsx           ← footer sombre 3 colonnes (Brand / Explorer / Spark)
  BlogContent.tsx      ← liste articles blog
  GuestCTA.tsx         ← CTA "Devenir invité"
  GuestForm.tsx        ← formulaire candidature invité
  SubscribeForm.tsx    ← formulaire lead magnet /prompts-ia
  ParallaxBackground.tsx
components/capture/
  CaptureForm.tsx      ← formulaire générique pages capture (honeypot inclus)
components/dashboard/
  ContentForm.tsx      ← create/edit content
  ContentTable.tsx     ← table avec filtres
```

---

## État actuel du dashboard

Le dashboard (`/dashboard`) est **partiellement connecté**. Il utilise encore `lib/mock-data.ts` pour afficher du contenu. Les pages `/dashboard/new` et `/dashboard/edit/[id]` utilisent `ContentForm.tsx` mais leur connexion Supabase est à vérifier. Le middleware protège toutes les routes `/dashboard/*` (redirect vers `/login` si non authentifié).

---

## Variables d'environnement (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
BREVO_API_KEY
BREVO_LIST_ID                    # optionnel
RESEND_API_KEY
RESEND_FROM_EMAIL                # ex: Spark <contact@jules-api.com>
CONTACT_EMAIL                    # destinataire notifs candidatures
RESEND_AUDIENCE_ID               # Resend audience (non utilisé activement)
NEXT_PUBLIC_SANITY_PROJECT_ID    # u7ptqvl2
NEXT_PUBLIC_SANITY_DATASET       # production
SANITY_API_TOKEN
```

---

## Règles de développement

- **Server Components par défaut.** `'use client'` uniquement pour les formulaires, état interactif, hooks browser.
- **`next/image`** pour toutes les images avec `fill` ou `width`/`height` explicites.
- Le dashboard n'a pas besoin d'être beau — clean et fonctionnel suffit.
- Le site public doit être exceptionnel visuellement — éditorial, sharp, mémorable.
- Pas de commentaires sauf si le WHY est non-obvious.
- Pas de gestion d'erreur pour des cas impossibles — faire confiance aux garanties framework.
- Ne jamais publier directement dans Sanity — toujours `status: "draft"`.
- Ne jamais créer de doublon de slug Sanity.
