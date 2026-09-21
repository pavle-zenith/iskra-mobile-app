-- IANA zone the quit date was chosen in, e.g. 'Europe/Belgrade'.
--
-- The day counter counts whole calendar days in this zone (src/lib/time/dayCount.ts), so a
-- flight to another timezone never moves the count forward or backwards. Nullable: when it is
-- missing the app falls back to the device's current zone.
alter table public.profiles add column quit_time_zone text;

alter table public.profiles add constraint profiles_quit_time_zone_length
  check (quit_time_zone is null or char_length(quit_time_zone) between 1 and 64);

comment on column public.profiles.quit_time_zone is
  'IANA time zone in which quit_date was chosen. Anchors the day counter against travel and DST.';
