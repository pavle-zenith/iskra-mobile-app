# M4 copy still owed

**Answered 24.09.2026 in `docs/M4-copy-answers.md`, and applied.** Kept as the record of what was asked.

Lines the four progress screens need that neither docs/M4-brief.md nor docs/M5-brief.md gives.
Each renders as `«TODO(copy): …»` until it exists (`src/features/napredak/copy.ts`). Pavle writes
them; the agent never does.

| Where | Marker | What it is |
|---|---|---|
| All four screens, top left | `nazad` | Accessibility label of the back button (VoiceOver reads it). Profil has the same gap (`docs/LEGAL-copy-todo.md`); one word could serve both |
| Tvoje vreme, under the ember counter | `red ispod brojača` | The export's "od poslednje cigarete" line. Brief item 2 asks for a period line; the Copy section gives none |
| Odbijene cigarete, bottom | `sitna slova` | Brief item 6 asks for fine print; the Copy section gives none. Ušteđevina's line mentions the pack price, so it does not fit here as is |
| Tvoje vreme, bottom | `sitna slova` | Same: brief item 5 asks for fine print. "Računamo 6 minuta po cigareti." already sits in the hours card |

## Used from elsewhere, please confirm

- **"[n] / [m] dostignuto"** on Zdravlje's count line comes from docs/M5-brief.md, Export
  alignment 2, which writes it that way. The export said "postignuto"
- **The Vreme goal titles** on Tvoje vreme (Prvi dan · 3 dana · Prva nedelja · 2 nedelje · Prvi mesec
  · 2 meseca · 3 meseca · Pola godine · Godina dana · [n] godine) and their sub "bez cigarete" are
  M5's approved Ciljevi copy, which M4 Task 3b points to
- **"TI SI OVDE"** is the approved "Ti si ovde" in capitals, as the export sets its badge
- **Reached dates** on Zdravlje ("15. avgust 2026., 07:05") are built from onboarding's approved
  month names, in lower case
