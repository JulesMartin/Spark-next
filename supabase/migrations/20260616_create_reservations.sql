-- Table reservations — demandes de coaching et accompagnement B2B
-- À exécuter dans Supabase Dashboard > SQL Editor avant de mettre la feature en prod

create table if not exists reservations (
  id               uuid        default gen_random_uuid() primary key,
  type             text        not null check (type in ('coaching', 'b2b')),
  name             text        not null,
  email            text        not null,

  -- Coaching 1-to-1
  situation        text,
  besoin           text,
  niveau           text,
  outils_utilises  text,
  outils_apprendre text,
  temps_disponible text,
  aspirations      text,

  -- B2B
  company_name      text,
  secteur           text,
  taille_equipe     text,
  probleme_principal text,
  experience_ia     text,
  delai             text,
  budget            text,
  attentes          text,

  -- Meta
  ip               text,
  created_at       timestamptz default now()
);

alter table reservations enable row level security;
-- Accès uniquement via service role (API routes) — pas de policy publique nécessaire
