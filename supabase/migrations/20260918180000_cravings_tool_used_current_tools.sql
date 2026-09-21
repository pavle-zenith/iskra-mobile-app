-- The six Poriv tools are Dišem, Pijem vodu, Moji razlozi, Šetam, Odlažem, Beležim
-- (PRODUCT.md, iskraclub.com). Posmatram and Igram se were cut (SCREENS.md Part 1.1), so the
-- old constraint rejected two live tools and accepted two dead ones.
--
-- Vocabulary source of truth: src/lib/vocab.ts (TOOL_KEYS) in the app repo. Change both together.
alter table public.cravings drop constraint cravings_tool_used_check;

alter table public.cravings add constraint cravings_tool_used_check
  check (tool_used = any (array['disem', 'voda', 'razlozi', 'setam', 'odlazem', 'belezim']));
