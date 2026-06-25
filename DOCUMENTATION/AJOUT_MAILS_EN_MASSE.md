# Ajout de mails en masse (Sheet + Supabase)

Workflow pour importer une liste brute d'emails (ex. export d'une page de capture externe) **à la fois** dans le Google Sheet et dans la table Supabase `email_subscribers`, **sans jamais écraser ni supprimer les données existantes**.

> Règle d'or : on **ajoute** uniquement les nouveaux emails. Aucune ligne existante n'est modifiée ou supprimée. Les doublons sont détectés et ignorés.

---

## 1. Préparer la liste

Coller la liste brute des emails dans `.claude/new_mails.md`. Le format est libre : les emails peuvent être séparés par des espaces, retours à la ligne, etc. Le parsing extrait tout ce qui ressemble à une adresse via regex, met en minuscules et déduplique.

```
mail1@exemple.com  mail2@gmail.com
Mail3@Hotmail.fr ...
```

---

## 2. Ce qu'on écrit (et ce qu'on n'écrit PAS)

Pour un ajout en masse « brut », on ne renseigne **que l'email**. On laisse volontairement vides :

- `campaigns` (pas de campagne associée)
- `social_handle` (pas de handle réseau social)
- `source` (Supabase, pas de source)

Côté Sheet, la ligne ajoutée suit le schéma `email | campaigns | social_handle | first_seen | last_updated` avec `campaigns` et `social_handle` vides et les deux dates à `now`.

---

## 3. Google Sheet

Cible : onglet **`Liste mails - page de capture`**, colonnes `A:F`.
Schéma : `email | campaigns | social_handle | first_seen | last_updated | unsubscribed`.

Logique du script :
1. Charge `.env.local` (`GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`).
2. Récupère un token Google (JWT signé RS256, scope `spreadsheets`).
3. **Lit** toutes les lignes existantes → construit un `Set` des emails déjà présents.
4. Filtre la liste pour ne garder que les **nouveaux** emails.
5. `append` (endpoint `:append` avec `insertDataOption=INSERT_ROWS`) → ajoute uniquement les nouvelles lignes. **Aucune ligne existante n'est touchée.**

> ⚠️ Ne jamais utiliser un `PUT` sur `A1` (comme `scripts/backfill-sheets.mjs`) pour un simple ajout : ça réécrit toute la feuille. Toujours `:append`.

Voir aussi les helpers de `lib/google-sheets.ts` (`appendRows`, `batchUpdateCells`) utilisés par le cron, et `documentation/GOOGLE-SHEETS.md` pour la config du service account.

---

## 4. Supabase

Cible : table **`email_subscribers`**.
Schéma : `id | email | source | created_at | campaigns | social_handle`.

Logique du script :
1. Charge `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
2. **Lit** tous les emails existants (pagination par 1000) → `Set` de dédup en minuscules.
3. Filtre la liste pour ne garder que les **nouveaux** emails.
4. `POST` par lots de 500 sur `/rest/v1/email_subscribers` avec `Prefer: return=minimal`, en n'envoyant **que** `{ email }`. `source`, `campaigns` et `social_handle` restent `null`. **Aucune ligne existante n'est touchée** (pas d'`upsert`, pas de `DELETE`).

> Utiliser la **service role key** (RLS bypass), pas l'anon key.
> Ne jamais utiliser `Prefer: resolution=merge-duplicates` avec une réécriture : ici on insère uniquement les emails absents, repérés à l'étape 2.

---

## 5. Ordre d'exécution

1. Remplir `.claude/new_mails.md`.
2. Lancer l'ajout Sheet (`:append`).
3. Lancer l'insert Supabase.
4. Les deux scripts sont **idempotents** : relancer ne crée pas de doublon (les emails déjà présents sont ignorés).

Les scripts d'ajout en masse sont des one-off (dossier scratchpad de session). La logique réutilisable de référence vit dans `lib/google-sheets.ts` (Sheet) et `app/api/capture/route.ts` (Supabase) pour le flux unitaire `/api/capture`.

### Dernier import

- **408** emails uniques parsés depuis `.claude/new_mails.md`.
- Google Sheet : **406** ajoutés, 2 déjà présents.
- Supabase : **396** insérés, 12 déjà présents.

---

## 6. Synchronisation automatique (cron) — le Sheet comme backup

> Le manuel ci-dessus reste utile pour un import ponctuel d'une liste externe. Au quotidien, c'est le **cron qui maintient le Sheet à jour**.

**Rôle du Sheet** : filet de sécurité contre une perte de données Supabase (bug, suppression accidentelle). Le Sheet ne fait donc que **grossir** — il ne réplique jamais une suppression. Supabase = source de vérité pour les ajouts ; **Brevo** = source de vérité pour les désabonnements (lien de désinscription légal RGPD).

**Route** : `app/api/cron/sync-sheet/route.ts` (`GET`), planifiée **1×/jour à 09:00 UTC** (`0 9 * * *`) dans `vercel.json` — le plan Vercel Hobby limite les crons à un déclenchement quotidien.

À chaque exécution :

1. **Étape A — Brevo → Supabase (désabos)** : `getBlacklistedEmails()` récupère les contacts `emailBlacklisted` de Brevo ; ceux pas encore marqués passent `unsubscribed = true` + `unsubscribed_at = now()` dans Supabase (par lots de 200).
2. **Étape B — Supabase → Sheet (append-only)** :
   - lit Supabase (paginé) + lit le Sheet,
   - **append** des emails absents du Sheet (1 appel),
   - **met à jour** la colonne `unsubscribed` (→ `TRUE`) des lignes existantes dont le flag a changé, en **un seul** `values:batchUpdate`.
   - **Aucune ligne n'est jamais supprimée ni réécrite.**

**Pourquoi c'est safe & sans rate limit** : batch (≈ quelques appels par run, indépendant du volume de captures), découplé des bursts de DM, immunisé au gel serverless. Les routes `/api/capture` et `/api/subscribe` **n'écrivent plus** dans le Sheet (l'ancien `upsertEmailToSheet` fire-and-forget perdait ~1/3 des écritures).

### Mise en place (à faire une fois)

1. **Migration Supabase** : exécuter `supabase/migrations/20260626_add_unsubscribed.sql` dans le SQL Editor (ajoute `unsubscribed` + `unsubscribed_at`).
2. **En-tête Sheet** : colonne `F1` = `unsubscribed` (déjà posée).
3. **Env var** : définir `CRON_SECRET` dans Vercel (Project Settings > Environment Variables). Vercel l'envoie en `Authorization: Bearer <CRON_SECRET>` ; la route rejette tout appel non authentifié si la var est présente.
4. **Plan Vercel** : en Hobby, les crons sont limités à **1×/jour** — d'où `0 9 * * *`. Le plan Pro permettrait une fréquence plus fine (ex. `*/15 * * * *`).

### Désabonnement (RGPD)

- Le désabonnement se fait via le **lien Brevo** dans les emails. Aucune UI à maintenir côté Spark.
- Le cron propage `emailBlacklisted` (Brevo) → `unsubscribed` (Supabase + Sheet) au prochain run quotidien.
- La ligne n'est **pas supprimée** : on conserve la trace (avec `unsubscribed_at`) pour ne pas ré-emailer en cas de restauration depuis le backup. Une suppression définitive (droit à l'effacement) reste une action manuelle explicite.
