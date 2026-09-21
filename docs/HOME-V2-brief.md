# Home v2: the export's dashboard, made true

For the code agent. Read `PRODUCT.md`, `SCREENS.md` Part 4 and this file. Pavle's decision,
21.09.2026: **Home follows the design export's `HomeScreenV3_1`** (the dashboard), not the
minimal state-led Home built in M3. `SCREENS.md` Part 4 is superseded where it disagrees with
this file. Update it to say so.

The job is to keep the export's structure and look, and fix what in it is untrue, gendered,
duplicated or ahead of the data. Source: `ISKRA - mobile claude design export/screens/HomeScreenV3_1.jsx`
and `Iskra Home v3-1.html`.

---

## The layout, top to bottom

| # | Module | Data | Ships with |
|---|---|---|---|
| 0 | Lead slot, by state (see below) | profile, slips | now |
| 1 | Header: "Zdravo," + name, initial avatar, chip | profile, cravings | now |
| 2 | "Ova nedelja": 7 days + today's check-in | `checkins` | now (check-in pulled forward from M5) |
| 3 | Live timer card: dani / sati / minuta / sekunde | `quit_date` | now |
| 4 | Two stat cards: money saved, cigarettes not smoked | calc port | M4 |
| 5 | "Tvoji razlozi" card, where the quote card was | `reason_text`, `reasons[]` | now |
| 6 | "Moj napredak": today's article, next goal, six categories | Sanity, `milestones` | M5 |
| 7 | "Desila se cigareta" link, away from the button | `slips` | now |
| - | "Imam poriv" pinned above the nav | M3 | now |
| - | Bottom nav: Početna, Milestoni, Saznaj, Profil | | when each tab exists |

**No placeholders.** A module whose data does not exist yet is not rendered. It is not greyed
out, it has no zero, and it never says "uskoro". When M4 lands, 4 appears. When M5 lands, 6 appears
and the nav turns on. The screen reads as finished at every stage.

**The nav** appears only when at least two tabs lead somewhere real. Never a tab that goes
nowhere. Profil is needed before submission regardless: App Store rules require in-app account
and data deletion, and notification settings will live there. It becomes its own brief.

## What changes from the export, and why

**1. Header.**
- Avatar: the export ships a drawing of Pavle. Use the first letter of the name on an ember
  circle. Nobody uploads a photo in v1. It is not tappable until Profil exists.
- Chip: the export repeats the day count (flame "192"), which also sits in the timer and again in
  "Na putu si već". One number, once. The chip shows **cravings survived**, the flame being
  literally the product's name. It is hidden at 0.

**2. Ova nedelja.** Seven circles Mon to Sun, "n / 7" top right.
- Checked = a `checkins` row with `clean = true`
- Today with no row = the "?" circle, which opens the check-in sheet
- A day with a slip or `clean = false`: a filled, **neutral** circle, never red, never an X,
  never an empty "broken" look. The streak does not reset; nothing on this card punishes
- Future days: faint, untappable
- Days before the quit date: not shown as misses. Start the week's count from the quit day

**Check-in sheet** (from the export's `CheckInOverlay`), one question, two buttons:
- Closing it records **nothing**. The export says "if you close, we assume you're clean". That is
  a guess, and the app never guesses. Delete that line
- "Desila se cigareta" here goes through the same slip path as Poriv mod: a `slips` row, the
  absolution screen, no reset

**3. Timer.** The export's four-column counter, ticking every second.
- Eyebrow: the export says "SLOBODAN SI", which is gendered. Use **BEZ CIGARETE**
- Every unit label goes through `plural()`. The export is wrong at 51: it is "51 sekunda", not
  "sekunde". Forms: dan / dana / dana, sat / sata / sati, minut / minuta / minuta,
  sekunda / sekunde / sekundi. Uppercased for display
- It shows elapsed time since the quit moment (`smokeFreeMs`), and never resets on a slip
- This is the only day figure on Home. The export's "Na putu si već ... od kada si počeo/la"
  card is cut: it repeats the timer and carries a slash
- Pre-quit: the same card counts **down** to the quit date, eyebrow **DO TVOG DANA**

**4. Stat cards (M4).**
- Values from the ported `calc.ts`, never rounded up
- Spelling: the export writes "uštedeno". It is **ušteđeno**, with đ
- "cigareta odbijeno" with numeral agreement: 1 cigareta odbijena, 2 cigarete odbijene,
  5 cigareta odbijeno. The export colours it red. `negative` is never pointed at the user
  (PRODUCT.md), so use a calm tone from the palette
- Tapping opens the matching Napredak tab

**5. The quote card becomes "Tvoji razlozi".** Keep the card and the quote glyph, change the
content.
- The export's quote is attributed to Mark Twain, and that attribution is not reliably sourced.
  It is a joke about failing to quit, and its detail screen tells the user they beat a dead
  man's streak. It is cut
- In its place: `reason_text` in „…" (two lines, then truncated), and below it "Tvoji razlozi".
  If `reason_text` is empty, show the first two reason labels. Tap opens the Moji razlozi tool
  outside a craving (no `cravings` row is written, the same rule as the onboarding demo)

**6. Moj napredak (M5).** Keep the export's order: the "Dnevno znanje" article card (latest
Sanity post, which opens the web article), "Sledeći cilj" with its progress bar, and the six
category tiles. The export's article title contains an em dash: take titles from Sanity as
published, where the blog skill already bans em dashes.

**7. The slip link.** The export's slip link ("Zapalio/la sam" over "Beležimo sve", then a dash, then "bez osude")
is gendered and has an em dash. Use **Desila se cigareta** and **Beležimo bez osude.** It sits at the end of the
scroll, far from "Imam poriv".

## The lead slot (module 0)

The dashboard stays the same in every state. Only one slot above the header changes, and most of
the time it is empty:

| State | Slot |
|---|---|
| Pre-quit | Empty. The timer card counts down instead |
| Acute, day 0 to 3 | Empty. "Imam poriv" is already pinned |
| Post-slip, a slip in the last 48h | **Absolution card**: "Jedna cigareta ne briše dane pre nje." / "Ukupno vreme bez cigarete ostaje. Ne krećeš od nule." (M3 copy) |
| All others | Empty |

## Copy

New strings, approved by Pavle. Verbatim, and none of them gendered:

- Header: Zdravo, / [ime]
- Week: Ova nedelja · [n] / 7
- Check-in sheet: Kako je prošao dan? · Danas bez cigarete · Desila se cigareta
- Timer: BEZ CIGARETE · pre-quit: DO TVOG DANA · unit labels as above
- Stats: RSD ušteđeno · [n] cigareta odbijeno (agreement as above)
- Reasons card: Tvoji razlozi
- Section: Moj napredak · Dnevno znanje · Sledeći cilj · Čitaj
- Slip link: Desila se cigareta · Beležimo bez osude.

Anything else: `missingCopy()` and `docs/HOME-V2-copy-todo.md`.

## Sequencing

1. **Now:** modules 0, 1, 2 with the check-in, 3, 5, 7, and "Imam poriv". Pulling the check-in
   forward from M5 is fine: the schedule is five weeks ahead
2. **M4:** module 4 and the Napredak screens it opens
3. **M5:** module 6, Milestoni and Saznaj, and the nav

## Acceptance

- [ ] Matches the export's layout and look for the modules that exist, one texture per screen
- [ ] No module renders without real data; no zero, placeholder or "uskoro" anywhere
- [ ] One day figure on Home; the timer never resets on a slip
- [ ] Every unit label and count goes through `plural()`, including "51 sekunda"
- [ ] Closing the check-in writes nothing
- [ ] No red and no X pointed at the user, including slip days on the week card
- [ ] No quote, no Mark Twain, no avatar drawing
- [ ] Zero slashes, em dashes, English words
- [ ] Screenshots in `.impeccable/review/home-v2/` for day 0, day 5, day 40 with a slip, and
      Pre-quit; iPhone SE and Pro Max
