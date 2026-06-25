-- SÉCURITÉ (RGPD) : verrouille email_subscribers.
-- Constat : la clé anon (publique, présente dans le navigateur) pouvait LIRE tous
-- les emails et INSÉRER des lignes arbitraires. Toutes les écritures/lectures
-- applicatives passent par la service role (API routes + dashboard server-side),
-- qui bypass RLS — anon n'a donc besoin d'AUCUN accès à cette table.
-- À exécuter dans Supabase Dashboard > SQL Editor.

-- 1. Active RLS
alter table email_subscribers enable row level security;

-- 2. Supprime toutes les policies existantes (aucun accès anon/public)
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'email_subscribers'
  loop
    execute format('drop policy %I on public.email_subscribers', pol.policyname);
  end loop;
end $$;

-- Après ça : anon = 0 accès (lecture/écriture bloquées). La service role continue
-- de fonctionner (elle ignore RLS). Vérifier le dashboard /dashboard/leads après.
