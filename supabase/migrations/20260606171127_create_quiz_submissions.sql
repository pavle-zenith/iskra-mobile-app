create table quiz_submissions (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  smoking_profile text,
  fagerstrom_score integer,
  fagerstrom_level text,
  annual_cost_rsd integer,
  five_year_cost_rsd integer,
  cigarettes_per_day integer,
  readiness_score integer,
  committed boolean,
  answers jsonb,
  created_at timestamptz default now()
);

create index on quiz_submissions (email);

alter table quiz_submissions enable row level security;

create policy "Allow server inserts" on quiz_submissions
  for insert with check (true);
