# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Spark. Here is a summary of every change made.

**New files created:**

- `instrumentation-client.ts` — Client-side PostHog initialization using the Next.js 15+ instrumentation hook. Routes events through a Next.js reverse proxy at `/ingest` (EU region).
- `lib/posthog-server.ts` — Server-side PostHog client factory using `posthog-node`, with `flushAt: 1` / `flushInterval: 0` to ensure immediate event flushing from serverless API routes.

**Existing files modified:**

- `next.config.ts` — Added EU reverse proxy rewrites (`/ingest/*` → `eu.i.posthog.com`) and `skipTrailingSlashRedirect: true`.
- `components/capture/CaptureForm.tsx` — Identifies the user by email and fires `capture_form_submitted` on success.
- `components/public/SubscribeForm.tsx` — Identifies the user by email and fires `lead_magnet_subscribed` on success.
- `components/public/GuestForm.tsx` — Identifies the user by email and fires `guest_candidature_submitted` on success with business qualifier properties.
- `app/api/capture/route.ts` — Fires server-side `email_captured` with `campaign`, `is_new_subscriber`, and `is_new_campaign` properties.
- `app/api/subscribe/route.ts` — Fires server-side `email_subscribed` with `source` and `is_new_subscriber` properties.
- `app/login/page.tsx` — Calls `posthog.identify(email, { email, role: 'admin' })` after a successful admin login.

**Environment variables added to `.env.local`:**

- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- `NEXT_PUBLIC_POSTHOG_HOST`

---

## Events

| Event | Description | File |
|---|---|---|
| `capture_form_submitted` | User successfully submits the email capture form on a campaign landing page. Properties: `campaign`, `has_social_handle`. | `components/capture/CaptureForm.tsx` |
| `lead_magnet_subscribed` | User successfully subscribes via the /prompts-ia lead magnet form. Properties: `source`. | `components/public/SubscribeForm.tsx` |
| `guest_candidature_submitted` | User successfully submits a guest candidature. Properties: `business_type`, `monthly_revenue`, `monthly_clients`. | `components/public/GuestForm.tsx` |
| `email_captured` | Server confirms a campaign email was saved in Supabase. Properties: `campaign`, `is_new_subscriber`, `is_new_campaign`. | `app/api/capture/route.ts` |
| `email_subscribed` | Server confirms a lead magnet subscriber was saved in Supabase. Properties: `source`, `is_new_subscriber`. | `app/api/subscribe/route.ts` |

---

## Next steps

We've built a dashboard and 5 insights to track user behavior from day one:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/204385/dashboard/756182)
- [Email captures over time](https://eu.posthog.com/project/204385/insights/LzqZPFgS)
- [Lead magnet subscriptions over time](https://eu.posthog.com/project/204385/insights/8uq7MWfc)
- [Email captures by campaign](https://eu.posthog.com/project/204385/insights/5aYCix55)
- [Guest candidatures submitted](https://eu.posthog.com/project/204385/insights/9olNdaKj)
- [Lead magnet conversion funnel](https://eu.posthog.com/project/204385/insights/GM19aQ9l)

---

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and Vercel environment variable settings so deployments pick them up.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or a bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the admin login page only identifies on fresh login, so returning sessions that skip the login form will remain on anonymous distinct IDs until they log in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
