-- Ajoute la capture du numéro de téléphone sur les pages de capture email (champ requis).
-- À exécuter dans Supabase Dashboard > SQL Editor avant de déployer.

alter table email_subscribers
  add column if not exists phone text;
