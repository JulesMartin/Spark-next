-- Renomme ai_lab_waitlist en claude_to_client_waitlist (et la fonction d'inscription).
-- À exécuter dans Supabase Dashboard > SQL Editor, puis déployer le code tout de suite :
-- entre les deux, le site cherche encore l'ancien nom et l'inscription échoue.
-- Les données, les numéros d'ordre, les contraintes et la RLS sont conservés.

alter table ai_lab_waitlist rename to claude_to_client_waitlist;

drop function if exists join_ai_lab_waitlist(text, text, text, text, text);

create or replace function join_claude_to_client_waitlist(
  p_email text,
  p_utm_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_referrer text
)
returns table (out_position integer, out_already boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_position integer;
begin
  perform pg_advisory_xact_lock(hashtext('claude_to_client_waitlist'));

  select w.position into v_position from claude_to_client_waitlist w where w.email = p_email;
  if found then
    return query select v_position, true;
    return;
  end if;

  select coalesce(max(w.position), 0) + 1 into v_position from claude_to_client_waitlist w;

  insert into claude_to_client_waitlist (email, position, utm_source, utm_medium, utm_campaign, referrer)
  values (p_email, v_position, p_utm_source, p_utm_medium, p_utm_campaign, p_referrer);

  return query select v_position, false;
end;
$$;

revoke all on function join_claude_to_client_waitlist(text, text, text, text, text) from public, anon, authenticated;
grant execute on function join_claude_to_client_waitlist(text, text, text, text, text) to service_role;
