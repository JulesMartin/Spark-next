-- Ajoute le suivi des désabonnements à email_subscribers (RGPD).
-- Source de vérité du désabonnement : Brevo (statut emailBlacklisted), synchronisé
-- toutes les 15 min par le cron /api/cron/sync-sheet.
-- À exécuter dans Supabase Dashboard > SQL Editor avant de déployer le cron.

alter table email_subscribers
  add column if not exists unsubscribed     boolean     not null default false,
  add column if not exists unsubscribed_at  timestamptz;
