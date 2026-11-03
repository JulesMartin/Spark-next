# Capture « guide » pour Auto-Post

Parcours : vidéo Instagram → `jules-api.com/capture?c=auto-post-guide` → prénom + mail → guide envoyé par Brevo → redirection vers `auto-post.jules-api.com` → 5 relances → arrêt à l'achat.

## Ce que fait le code

| Fichier | Rôle |
|---|---|
| `lib/campaigns.ts` | Réglages de la campagne : textes, marque, adresse de redirection, séquence. **Tous les textes de la page sont là.** |
| `lib/campaign-sequence.ts` | Inscription, envoi du guide, relances, renvoi des guides en retard, arrêt |
| `lib/campaign-sequence-due.ts` | Calendrier (logique pure) |
| `app/api/webhooks/stripe/route.ts` | Achat Auto-Post → arrêt des relances |
| `supabase/migrations/20261102_add_campaign_sequences.sql` | Table `campaign_sequences` |

Règles :
- Une campagne absente de `CAMPAIGN_CONFIGS` garde le comportement standard de `/capture`, sans aucun changement.
- La campagne Auto-Post ne démarre pas la séquence de bienvenue (celle qui vend l'audit).
- Une relance par contact et par passage, jamais le jour même du guide, jamais le jour d'un mail de la séquence de bienvenue.
- Modèle Brevo non renseigné : l'étape attend sans être consommée.
- Guide non parti (quota, panne) : le visiteur est redirigé avec `guide=retard` et le cron le renvoie au passage suivant.
- Le plafond `SEQUENCE_DAILY_CAP` est partagé : séquence de bienvenue d'abord, puis guides en retard, puis relances.
- Les relances passent par `/api/cron/sync-sheet` (9 h UTC), comme la séquence de bienvenue.

## Mise en route, dans l'ordre

1. **Supabase** : exécuter `supabase/migrations/20261102_add_campaign_sequences.sql` dans le SQL Editor.
2. **Brevo** : créer le modèle du guide et les 5 relances (brouillons : `DOCUMENTATION/mails-auto-post.md`), chacun avec le bouton de désinscription `https://jules-api.com/desinscription?t={{ contact.UNSUB_TOKEN }}`.
3. **Vercel**, variables du site :
   - `BREVO_TEMPLATE_AUTO_POST_GUIDE`
   - `BREVO_TEMPLATE_AUTO_POST_SEQ_1` à `BREVO_TEMPLATE_AUTO_POST_SEQ_5`
   - `STRIPE_WEBHOOK_SECRET` (étape 4)
4. **Stripe** → Développeurs → Webhooks → ajouter un endpoint : `https://jules-api.com/api/webhooks/stripe`, événements `checkout.session.completed` et `checkout.session.async_payment_succeeded`. Copier le secret de signature dans Vercel. Le webhook existant du serveur de livraison ne change pas.
5. **Acheteurs déjà existants** : les marquer pour qu'ils ne reçoivent pas de relances (liste : `va-admin list` sur le VPS) :
   ```sql
   insert into campaign_sequences (email, sequence_key, stopped_at, stopped_reason)
   values ('acheteur@exemple.fr', 'auto-post', now(), 'purchase')
   on conflict (email, sequence_key) do update set stopped_at = now(), stopped_reason = 'purchase';
   ```
6. **Brevo, quota** : vérifier la formule. Doc de septembre 2026 : 300 mails/jour, ~215 pris par les ressources. Au-delà, les guides partent en retard.
7. **Confidentialité** : la page `/confidentialite` ne cite que les « offres Spark ». Phrase proposée, à valider et à ajouter à la main : « L'envoi d'informations et d'offres sur Auto-Post, le kit de montage vidéo vendu par Jules Martin (consentement). »
8. **Polices** : la même branche contient `app/fonts/` (polices hébergées, voir `CLAUDE.md` › Design system). À commiter à part, avant la capture.
9. **Landing** : publier le bandeau (`assets/js/guide-banner.js`, dépôt `landing-cc-auto`).
10. **Déployer** le site, puis faire un essai réel avec ta propre adresse depuis le navigateur intégré d'Instagram.

## Vérifier

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://jules-api.com/api/cron/sequence
```

Le champ `campaignSequences` donne `resourcesRetried`, `due`, `sent`, `failed`, `capped`, `skippedUnsubscribed`, `skippedSameDay`, `notConfigured`.

**Attention : cet appel envoie réellement les mails dus.**

```sql
select stopped_reason, step, count(*) from campaign_sequences
where sequence_key = 'auto-post' group by 1, 2 order by 1, 2;
```

## Limites connues

- Un achat fait avec une autre adresse que celle du guide ne coupe pas les relances.
- Un remboursement ne relance pas la séquence.
- Les statistiques du site et de la landing sont dans deux projets PostHog distincts. Les `utm_*` de la redirection remontent quand même jusqu'à la licence (source de l'achat).
