# Google Sheets — Backup emails

Chaque inscription via `/api/capture` et `/api/subscribe` est écrite en parallèle dans une Google Sheet (fire-and-forget — si Sheets plante, l'inscription Supabase + Brevo n'est pas bloquée).

## Structure de la Sheet

| A — email | B — source | C — created_at |
|---|---|---|
| test@test.com | cowork-dm | 2026-06-14T... |

Nom de l'onglet attendu : **`Feuille 1`**

## Variables d'environnement requises

```
GOOGLE_SHEETS_ID=<ID dans l'URL de la Sheet>
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'   ← JSON complet, guillemets simples obligatoires
```

## Service account Google Cloud

- **Projet** : celui créé sur console.cloud.google.com
- **Compte de service** : `spark-sheets-writer@<projet>.iam.gserviceaccount.com`
- **API activée** : Google Sheets API
- **Permission sur la Sheet** : compte de service ajouté en tant qu'Éditeur via "Partager"

## Fichiers modifiés

- `lib/google-sheets.ts` — helper JWT + appel REST Sheets API (zéro dépendance npm)
- `app/api/capture/route.ts` — appel `appendEmailToSheet` après Brevo
- `app/api/subscribe/route.ts` — idem

## Keep-alive Supabase

- `app/api/keepalive/route.ts` — ping Supabase (count `email_subscribers`)
- `vercel.json` — cron toutes les 72h (`0 9 */3 * *`) pour éviter la mise en pause du free tier
