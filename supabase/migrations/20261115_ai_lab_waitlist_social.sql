-- Réseau principal et nom d'utilisateur demandés à l'inscription (page /skool).
-- À exécuter dans Supabase Dashboard > SQL Editor. Sans cette migration l'inscription fonctionne,
-- mais le réseau et le nom d'utilisateur ne sont pas enregistrés.

alter table ai_lab_waitlist
  add column if not exists social_platform text check (social_platform in ('instagram', 'tiktok', 'youtube')),
  add column if not exists social_handle   text;
