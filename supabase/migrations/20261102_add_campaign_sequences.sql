-- Séquences propres à une campagne (Auto-Post), séparées de la séquence de bienvenue :
-- `email_subscribers.sequence_*` reste « une par personne, à vie » et vend l'audit.
-- Une ligne par personne et par séquence. Un acheteur a `stopped_at` renseigné, même s'il
-- n'était pas encore inscrit : une capture ultérieure ne le relancera pas.
-- À exécuter dans Supabase Dashboard > SQL Editor AVANT de déployer.

create table if not exists campaign_sequences (
  email             text        not null,
  sequence_key      text        not null,
  started_at        timestamptz not null default now(),
  step              integer     not null default 0,
  last_sent_at      timestamptz,
  resource_campaign text,
  resource_sent_at  timestamptz,
  stopped_at        timestamptz,
  stopped_reason    text,
  primary key (email, sequence_key)
);

create index if not exists campaign_sequences_active_idx
  on campaign_sequences (started_at)
  where stopped_at is null;

-- RLS sans policy, comme email_subscribers : seule la service role (API, cron) y accède.
alter table campaign_sequences enable row level security;
