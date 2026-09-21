-- ── profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                    uuid references auth.users(id) primary key,
  name                  text,
  gender                text check (gender in ('muško', 'žensko', 'drugo')),
  product               text check (product in ('cigarete', 'iqos')) default 'cigarete',
  cigarettes_per_day    int default 20,
  cigarettes_per_pack   int default 20,
  pack_price_rsd        int default 0,
  quit_date             timestamptz,
  reasons               text[] default '{}',
  reason_text           text,
  fears                 text[] default '{}',
  triggers              text[] default '{}',
  timing                text check (timing in ('odmah', 'uskoro', 'vec_prestao')),
  onboarding_completed  boolean default false,
  is_premium            boolean default false,
  committed             boolean default false,
  signature_data        text,
  push_token            text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ── checkins ─────────────────────────────────────────────────────────────────
create table if not exists public.checkins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  date        date not null,
  clean       boolean not null,
  created_at  timestamptz default now(),
  unique(user_id, date)
);

-- ── cravings ─────────────────────────────────────────────────────────────────
create table if not exists public.cravings (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references public.profiles(id) on delete cascade,
  strength          int check (strength between 1 and 10),
  trigger           text,
  tool_used         text check (tool_used in ('disem', 'voda', 'razlozi', 'setam', 'posmatram', 'igram')),
  duration_seconds  int,
  outcome           text check (outcome in ('survived', 'slipped')),
  created_at        timestamptz default now()
);

-- ── slips ─────────────────────────────────────────────────────────────────────
create table if not exists public.slips (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  trigger     text,
  notes       text,
  created_at  timestamptz default now()
);

-- ── milestones ───────────────────────────────────────────────────────────────
create table if not exists public.milestones (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade,
  key           text not null,
  category      text not null,
  unlocked_at   timestamptz default now(),
  shared        boolean default false,
  unique(user_id, key)
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.profiles   enable row level security;
alter table public.checkins   enable row level security;
alter table public.cravings   enable row level security;
alter table public.slips      enable row level security;
alter table public.milestones enable row level security;

create policy "own profile"    on public.profiles   for all using (auth.uid() = id)        with check (auth.uid() = id);
create policy "own checkins"   on public.checkins   for all using (auth.uid() = user_id)   with check (auth.uid() = user_id);
create policy "own cravings"   on public.cravings   for all using (auth.uid() = user_id)   with check (auth.uid() = user_id);
create policy "own slips"      on public.slips      for all using (auth.uid() = user_id)   with check (auth.uid() = user_id);
create policy "own milestones" on public.milestones for all using (auth.uid() = user_id)   with check (auth.uid() = user_id);

-- ── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
