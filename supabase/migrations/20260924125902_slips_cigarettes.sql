-- docs/M5-brief.md Task 6: how many cigarettes a slip was. The progress engine subtracts this
-- from cigarettes not smoked; until now every slip counted as one, which is what the default
-- keeps for existing rows.
alter table public.slips
  add column cigarettes int not null default 1 check (cigarettes between 1 and 40);
