# M4 and LEGAL: copy answers and decisions (24.09.2026)

Answers to `docs/M4-copy-todo.md` and `docs/LEGAL-copy-todo.md`. Use the lines verbatim; they
replace the `missingCopy()` markers, and the marker-count tests change with them.

## M4: the four progress screens (`src/features/napredak/copy.ts`)

| Key | Line |
|---|---|
| `back` | Nazad |
| `time.period` (under the ember counter) | od [datum] u [vreme], e.g. "od 15. septembra 2026. u 07:05" (the quit date and time, lower case, as the export's "od poslednje cigarete") |
| `cigarettes.finePrint` | Računica je okvirna i zavisi od broja cigareta dnevno. Pakla se računa kao 20 cigareta. Svaki zabeležen posrtaj računamo kao zapaljene cigarete. |
| `time.finePrint` | Šest minuta je okvirno trajanje jedne cigarete. Ovo je vreme koje nije otišlo na pušenje, a ne procena dužine života. Svaki zabeležen posrtaj računamo kao zapaljene cigarete. |

### Borrowed lines: confirmed, with one fix

- "[n] / [m] dostignuto": confirmed
- The Vreme goal titles and "bez cigarete": confirmed
- "TI SI OVDE": confirmed
- **Dates: fix.** A date needs the month in the genitive, not the nominative: "15. avgusta 2026.",
  not "15. avgust 2026.". Genitive months: januara, februara, marta, aprila, maja, juna, jula,
  avgusta, septembra, oktobra, novembra, decembra. Date and time join with "u", not a comma:
  "15. avgusta 2026. u 07:05". Use one `formatDateTime()` for Zdravlje's reached dates and
  `time.period` above, and add a test for it. Onboarding's nominative month names stay where
  they are used as names (a month picker), not in dates

## LEGAL: Profil (`src/features/legal/copy.ts`)

| Key | Line |
|---|---|
| `back` | Nazad (same word as M4; one shared string is fine) |
| `accountIdHint` | Ako nam pišeš u vezi sa svojim podacima, navedi ovu oznaku. |
| `analyticsHint` | Kad je isključena, ne šaljemo podatke o tome kako se aplikacija koristi. Sve ostalo radi isto. |
| `marketingHint` | Povremeni saveti i novosti o Iskri. Odjava je moguća u svakom trenutku, ovde ili iz samog emaila. |
| `deleteTitle` | Obrisati sve podatke? |
| `deleteBody` | Brišemo nalog i sve što je uneto, sa telefona i sa servera. Ovo ne može da se poništi. Bez interneta, deo na serveru se briše čim se telefon ponovo poveže. |
| `deleteConfirm` | Obriši sve |
| `deleteCancel` | Odustani |

`deleteBody` also covers the offline case from LEGAL-copy-todo section 2, so no separate line or
screen is needed for it.

## Decisions

1. **Onboarding Summary: switch it to the progress engine.** One rule everywhere: never round a
   saving up. Update its test to expect the floored figure.
2. **Reinstall with a leftover Keychain session: start fresh.** On launch with no local database
   but a stored session, sign that session out before the welcome intro, so a reinstall never
   silently reattaches to old server data. Returning people get their data back by signing in
   once `docs/ACCOUNT-brief.md` is built. The orphaned anonymous rows fall under the 24-month
   inactivity deletion (to be built before the policy line goes live).
3. **Add the `profiles` → `auth.users` foreign key** (on delete cascade), so a deletion made in
   the Supabase dashboard also takes the data.
4. **Drop the empty `push_token` column** in the same migration.
5. **"Obriši sve podatke" in ink, not red, and the native alert without the destructive style:**
   agreed.
6. **Policy draft** (`docs/legal/PRIVATNOST-draft.md`): "na prvom ekranu" is corrected to "posle
   kratkog uvoda" (section 3) and "pre prvog unosa" (section 9). Done in the draft.
7. **The two test slips on the server:** delete those two `slips` rows by id, nothing else.
8. **The unused segmented control:** delete it and its design-system sample screen, if that
   screen is not reachable in the app.
9. **Commits:** yes. Four, in this order: my docs (`docs/`, `AGENTS.md`, `ROADMAP.md`,
   `.gitignore`), then LEGAL, then WELCOME, then M4. Then continue with M5.
