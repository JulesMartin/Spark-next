-- Supprime la table candidatures : la page /devenir-invite et la route
-- /api/candidature n'existent plus, la table est vide, et elle conservait une
-- policy autorisant les INSERT anonymes — vérifié le 26/09/2026 avec la clé
-- publique du navigateur : insertion acceptée (HTTP 201).
-- Plus aucun code ne la lit ni ne l'écrit : surface d'attaque pure.
-- À exécuter dans Supabase Dashboard > SQL Editor.

drop table if exists public.candidatures;
