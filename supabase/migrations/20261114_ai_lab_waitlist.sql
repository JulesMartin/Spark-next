-- Liste d'attente d'Claude to Client (page /skool).
-- À exécuter dans Supabase Dashboard > SQL Editor AVANT de tester ou de déployer.

create table if not exists ai_lab_waitlist (
  id              uuid        primary key default gen_random_uuid(),
  email           text        not null unique check (email = lower(email)),
  position        integer     not null unique,
  created_at      timestamptz not null default now(),
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  referrer        text,
  unsubscribed_at timestamptz
);

-- RLS sans policy : seule la service role (route /api/waitlist) y accède.
alter table ai_lab_waitlist enable row level security;

-- Inscription atomique. Le verrou sérialise les inscriptions simultanées : deux personnes
-- ne peuvent pas obtenir le même numéro, et les numéros se suivent sans trou
-- (une séquence en laisserait à chaque e-mail déjà inscrit).
create or replace function join_ai_lab_waitlist(
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
  perform pg_advisory_xact_lock(hashtext('ai_lab_waitlist'));

  select w.position into v_position from ai_lab_waitlist w where w.email = p_email;
  if found then
    return query select v_position, true;
    return;
  end if;

  select coalesce(max(w.position), 0) + 1 into v_position from ai_lab_waitlist w;

  insert into ai_lab_waitlist (email, position, utm_source, utm_medium, utm_campaign, referrer)
  values (p_email, v_position, p_utm_source, p_utm_medium, p_utm_campaign, p_referrer);

  return query select v_position, false;
end;
$$;

revoke all on function join_ai_lab_waitlist(text, text, text, text, text) from public, anon, authenticated;
grant execute on function join_ai_lab_waitlist(text, text, text, text, text) to service_role;
