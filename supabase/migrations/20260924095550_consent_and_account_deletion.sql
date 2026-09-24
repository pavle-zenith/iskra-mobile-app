-- Consent before the first stored row, and in-app account deletion (docs/LEGAL-brief.md).

-- 1. Consent, stored with the profile.
--
-- `consented_at` is when the person ticked both required boxes on the consent screen: they are
-- 18 or older, and they agree to Iskra keeping their smoking and craving data. Nothing is
-- written to SQLite, and no anonymous sign-in happens, before it. Null only for rows created
-- before this migration.
--
-- `analytics_consent` is the optional third box, off unless ticked.
--
-- `marketing_consent` and its timestamp belong to docs/ACCOUNT-brief.md Task 3; they are added
-- here because Profil's "Emailovi sa savetima" toggle binds to them. An account email is never,
-- on its own, permission to send campaigns.
alter table public.profiles
  add column consented_at timestamptz,
  add column analytics_consent boolean not null default false,
  add column marketing_consent boolean not null default false,
  add column marketing_consent_at timestamptz;

-- 2. "Obriši sve podatke".
--
-- Apple requires in-app account deletion (App Review Guideline 5.1.1(v)). A signed-in user,
-- anonymous or not, deletes themselves and nobody else: the function acts only on auth.uid().
--
-- `profiles` has no foreign key to `auth.users`, so deleting the auth user alone would leave the
-- profile and everything under it behind. The profile goes first; cravings, slips, checkins and
-- milestones cascade from it. Then the auth user.
--
-- security definer, because an authenticated user cannot delete from auth.users directly.
-- search_path is empty so every name below is schema-qualified and cannot be shadowed.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'delete_my_account: not signed in' using errcode = '28000';
  end if;

  delete from public.profiles where id = uid;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

comment on function public.delete_my_account() is
  'Deletes the calling user: their profile (cascading to cravings, slips, checkins, milestones) and their auth.users row. In-app account deletion, docs/LEGAL-brief.md.';
