-- One trigger vocabulary for cravings, slips and profiles.triggers[].
--
-- Ten keys in display order: kafa, budjenje, posao, kafana, okolina, alkohol, stres, jelo,
-- dosada, drugo. `posao` and `kafana` are new; they come from the website's own hero copy and
-- previously had no key. Source of truth: TRIGGER_KEYS in src/lib/vocab.ts. Change together.
--
-- `profiles.triggers[]` is a text[]; the constraint below checks every element.
alter table public.cravings add constraint cravings_trigger_check
  check (trigger is null or trigger = any (array[
    'kafa', 'budjenje', 'posao', 'kafana', 'okolina', 'alkohol', 'stres', 'jelo', 'dosada', 'drugo'
  ]));

alter table public.slips add constraint slips_trigger_check
  check (trigger is null or trigger = any (array[
    'kafa', 'budjenje', 'posao', 'kafana', 'okolina', 'alkohol', 'stres', 'jelo', 'dosada', 'drugo'
  ]));

alter table public.profiles add constraint profiles_triggers_check
  check (triggers is null or triggers <@ array[
    'kafa', 'budjenje', 'posao', 'kafana', 'okolina', 'alkohol', 'stres', 'jelo', 'dosada', 'drugo'
  ]::text[]);
