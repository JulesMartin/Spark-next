-- Séquence de bienvenue pilotée par notre cron, à la place du workflow Brevo.
-- Motif : l'offre gratuite Brevo plafonne à 2 000 contacts uniques entrés en
-- automatisation, et ce compteur ne se vide pas quand un contact termine.
-- Les emails restent les mêmes (templates transactionnels Brevo 25 → 29).
-- À exécuter dans Supabase Dashboard > SQL Editor avant de déployer.

alter table email_subscribers
  add column if not exists sequence_started_at   timestamptz,
  add column if not exists sequence_step         integer     not null default 0,
  add column if not exists sequence_last_sent_at timestamptz;

-- Les contacts capturés avant la bascule restent à NULL : ils terminent leur
-- séquence dans le workflow Brevo, le cron ne les touche jamais.
create index if not exists email_subscribers_sequence_idx
  on email_subscribers (sequence_started_at, sequence_step)
  where sequence_started_at is not null;
