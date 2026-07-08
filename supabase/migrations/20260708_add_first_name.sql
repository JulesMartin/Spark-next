-- Ajoute la capture du prénom sur les pages de capture email et prompts-ia (champ requis).
-- À exécuter dans Supabase Dashboard > SQL Editor avant de déployer.

alter table email_subscribers
  add column if not exists first_name text;
