-- Espace membres /section : accès vérifié en base (mot de passe haché, sessions révocables, limite d'essais).
-- À exécuter dans Supabase Dashboard > SQL Editor AVANT de déployer le code correspondant.
-- RLS activée sans policy + droits retirés à anon / authenticated : seule la service role (routes /section et /api/section/*) y accède.

-- Une seule ligne : le mot de passe commun (haché avec scrypt, jamais en clair) et le sel qui anonymise les adresses IP.
create table if not exists section_settings (
  id            integer     primary key default 1 check (id = 1),
  password_hash text        not null,
  ip_salt       text        not null,
  updated_at    timestamptz not null default now()
);

-- Une ligne par connexion réussie. Le cookie du membre est un jeton aléatoire ; seule son empreinte SHA-256 est stockée.
-- Une session se révoque (revoked_at) sans toucher aux autres ; changer le mot de passe les révoque toutes.
create table if not exists section_sessions (
  id           uuid        primary key default gen_random_uuid(),
  token_hash   text        not null unique,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  last_seen_at timestamptz not null default now(),
  revoked_at   timestamptz,
  ip_hash      text,
  user_agent   text
);
create index if not exists section_sessions_expires_idx on section_sessions (expires_at);

-- Chaque essai de connexion (réussi ou non), pour limiter les essais en rafale par adresse IP.
create table if not exists section_login_attempts (
  id         bigint      generated always as identity primary key,
  ip_hash    text        not null,
  success    boolean     not null default false,
  created_at timestamptz not null default now()
);
create index if not exists section_login_attempts_ip_idx on section_login_attempts (ip_hash, created_at desc);

alter table section_settings       enable row level security;
alter table section_sessions       enable row level security;
alter table section_login_attempts enable row level security;

revoke all on section_settings, section_sessions, section_login_attempts from anon, authenticated;
