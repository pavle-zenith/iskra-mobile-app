# M5 brief: Napredak tab (ciljevi), Saznaj, Misao dana, Profil, notifications, the full slip flow

For the code agent. Read `PRODUCT.md`, `docs/HOME-V2-brief.md` (module 6), `docs/M4-brief.md`
(the progress engine, which everything here reads) and `docs/LEGAL-brief.md` (Profil minimum).
Pavle, 24.09.2026. Do the Refero pass per `AGENTS.md`; references found so far are listed per
task. After M5 the bottom nav exists and the core app is complete, except accounts
(`docs/ACCOUNT-brief.md`, waiting on Pavle's Apple and Google setup).

## Task 0: bottom nav

Four tabs, turned on now that every one leads somewhere real:

**Početna · Napredak · Saznaj · Profil**

Lucide glyphs as in the export (home, flag, book, user), 1.9 stroke. "Imam poriv" stays pinned
above the nav on Home only. Update HOME-V2's module 6 as described in Task 1.

**Naming and layout, Pavle 24.09.2026:** the export's "Milestoni" tab is **Napredak**, and a
single milestone is a **cilj**. No segmented control anywhere (see M4). The tab is the export's
`MilestoniScreen` layout. **Read "Export alignment" at the end of this brief before building:
it overrides the layout details in Tasks 1, 2, 3, 4 and 6.**

## Task 1: Napredak tab (ciljevi)

### The set

Six categories, each threshold computed by the M4 engine. Unsourced export items (trees saved,
nicotine receptors, lung function 30%, skin) are cut.

| Category | Thresholds | Title | Sub |
|---|---|---|---|
| Vreme | 1, 3, 7, 14, 30, 60, 90, 182, 365 days, then yearly | Prvi dan · 3 dana · Prva nedelja · 2 nedelje · Prvi mesec · 2 meseca · 3 meseca · Pola godine · Godina dana · [n] godine | bez cigarete |
| Novac | 1.000, 5.000, 10.000, 25.000, 50.000, 100.000, 250.000 RSD | [x] RSD | ušteđeno |
| Cigarete | 100, 500, 1.000, 5.000, 10.000 | [n] cigareta | nije zapaljeno |
| Porivi | 1, 10, 25, 50, 100 survived | Prvi poriv · [n] poriva | iza tebe |
| Provere | 7, 30, 100 clean check-ins | [n] zabeleženih dana | bez cigarete |
| Zdravlje | the 11 items of M4 Task 2 | the time label | the item text |

### Unlocking

- Evaluated on launch, on foreground, and after every write that can move a number (craving
  outcome, check-in, slip, habit or quit-date edit)
- A crossing writes a `milestones` row via `unlockMilestone(key, category)`, idempotent on
  `unique(user_id, key)`. `unlocked_at` is the moment it was crossed where that is computable
  (time and health: quit date + threshold), otherwise now
- **Rows are history.** A later quit-date edit never deletes one; the "next" list is recomputed
- A slip never locks anything again

### The screen

Refero: [Ten Percent Happier milestones](https://refero.design/screens/1d7d433b-898b-48c3-94c4-7fc2d22550d6)
(unearned = the same glyph, faint, on the same ground; nothing looks "locked" or lost),
[Duolingo achievements](https://refero.design/screens/c13f71d5-9ab2-411a-918b-700d995a1f8d)
(one row per item, progress bar only on the next one), export `MilestoniScreen` (count line,
"Sledeće" block).

1. Title and count line
2. **Sledeće:** the three nearest across categories, each with a progress bar and "still to go"
3. Category chips (Sve plus the six), then the list: reached rows solid with the date, upcoming
   rows faint with "za [vreme]" / "još [x]"
4. Tap a reached row: a detail sheet with a **Podeli** button (Task 1b)

### Celebration

When a crossing happens while the app is open, a calm sheet shows it once. **Never** during Poriv
mod or a tool, and **never within 48 hours of a slip** (the row is written silently; PRODUCT.md,
"Never congratulate blindly").

### 1b. Share image

One clean card: the milestone title and sub, the Iskra flame and wordmark, iskraclub.com. Only
the person's own number, nothing invented, no name unless they add it. Render a view to an image
and open the system share sheet (check SDK 57 support for the libraries; prefer Expo's own).
Set `milestones.shared = true` on share.

### Home module 6

"Moj napredak" now renders: the newest article card (Task 2), **Sledeći cilj** (the nearest
milestone with its progress bar), the six category tiles (glyph, label, progress to the next),
and the Misao dana card (Task 3). Tiles open the Napredak tab filtered to that category; Zdravlje
opens the Zdravlje screen.

## Task 2: Saznaj

Per ROADMAP M5: a native index over the live Sanity blog, articles open in the in-app browser.

- Read the public dataset directly: project `dix3dmqg`, dataset `production`, perspective
  `published`, **no token** (the site's client uses none). Reuse the site's `LISTED` filter from
  `src/sanity/queries.ts` exactly, including `publishedAt <= now()`, or scheduled posts appear in
  the app before the site
- Categories: reuse `CATEGORIES_QUERY`, which lists only topics with at least one live post.
  Today that is three (Motivacija, Novac, Telo) with one post each. The screen must look finished
  at three posts: no counts, no empty chips, no "Popularno" (no data exists for it)
- Layout: the newest post as a large card (cover, category, title, excerpt, reading time), then
  category chips, then the list. Reading time computed from the text like the site
- Tap: `expo-web-browser` to `https://www.iskraclub.com/blog/{slug}?utm_source=app&utm_medium=saznaj`
- **Cache the index** (SQLite kv) with cover thumbnails, so the list renders offline; opening an
  article offline shows the offline line instead of a broken browser
- Pull to refresh; otherwise refresh on foreground at most every 6 hours

Refero: [Headspace library](https://refero.design/screens/09e6aa04-a569-4220-a328-5b366d4b2485)
(one featured item, then browse), [Alive help](https://refero.design/screens/dacd330b-416c-42f4-a61d-69534142a3ae)
(plain rows with a subtitle). Not taken: search (three posts do not need it).

## Task 3: Misao dana

- Lines: `docs/QUOTES-draft.md` once Pavle approves it, into `src/features/quote/misli.ts`.
  **No attribution line**; they are Iskra's own
- One line per calendar day in the anchor time zone, deterministic (day index mod list length),
  the same all day, fully offline
- Home card: small label, the line in „…". Tap opens a full screen with the line large and a
  **Podeli** button (same share-card style as Task 1b)
- No "swipe for the next one": it is a daily line, and a feed of them is noise

Refero: [Open, daily quote](https://refero.design/screens/0ef4bc3e-d16b-4892-82ae-1048bc2ff5f5)
(label, quote, a small share icon; nothing else). Not taken: the attributed famous-name quote.

## Task 4: Profil

Extends the LEGAL-brief minimum. Export `SettingsScreen` for structure; cut Premium, Obnovi
kupovinu, LinkedIn, and "Počni iznova" (a new quit date covers it without wiping anything).

Refero: [Patreon settings](https://refero.design/screens/f87f3879-8d6a-4be6-b568-32975bd24246)
(grouped white cards, values right-aligned),
[Kickstarter privacy](https://refero.design/screens/e3be1120-c853-4694-98a3-7501971382c5)
(toggles with explanations, destructive action last).

1. Header: the initial avatar, name, "[n] [dan] bez cigarete"
2. **Moj plan:** Ime · Pol · Datum prestanka · Cigarete dnevno · Cena pakle. Editing the quit date
   shows a confirmation (copy below); editing habits recomputes (M4)
3. **Obaveštenja** (Task 5): Dnevna provera with its time · Ciljevi · Rizični trenuci with a
   time per chosen trigger · the fixed quiet-hours line. If system permission is off, one row
   that opens system settings
4. **Privatnost:** Analitika toggle · Obriši sve podatke (LEGAL-brief)
5. **Nalog:** only once accounts exist (ACCOUNT-brief)
6. **O Iskri:** Politika privatnosti · Uslovi korišćenja · Izvori (to
   `https://www.iskraclub.com/uslovi#izvori`) · Instagram · Piši nam (mailto the site's
   `LEGAL.email`). "Oceni aplikaciju" appears only once a store listing exists
7. Footer: version and "Napravljeno u Srbiji" (no flag emoji)

## Task 5: notifications

Pavle's rule, 23.09.2026 (ROADMAP Part 4). All **local**, scheduled on the phone with
`expo-notifications`. No server push; finish LEGAL-brief Task 3 and stop storing `push_token`.

- **Three kinds:** daily check-in (evening, default 20:00, user-set), milestone reached (at the
  computed crossing time), risky-moment nudge (at the times of the triggers chosen in onboarding)
- **At most 3 a day.** **Quiet hours 22:00 to 08:00**, nothing is ever scheduled inside them
- **48 hours of silence after a slip:** logging a slip cancels everything scheduled in the next 48
  hours; rescheduling skips that window
- **Reads state before it speaks:** local notifications are fixed at schedule time, so reschedule
  the next 7 days on every launch, foreground and state change. No milestone is scheduled that a
  slip or a date edit has since made untrue
- Never presented while Poriv mod or a tool is open (foreground handler returns no alert)
- Tapping a check-in opens the check-in sheet; a milestone opens it in the Napredak tab; a nudge opens
  Home

Default nudge times, editable in Profil; triggers without a time of day get no nudge:

| Trigger | Default |
|---|---|
| budjenje | 07:30 |
| kafa | 08:30 |
| posao | 11:00 |
| jelo | 14:00 |
| kafana, alkohol | 20:00, Friday and Saturday only |
| okolina, stres, dosada, drugo | none |

## Task 6: the full slip flow

M3 built the minimum. M5 adds, in the same flow from "Desila se cigareta" and from the check-in:

1. **Koliko cigareta?** A stepper, default 1. Stored on the slip (migration: `slips.cigarettes int
   not null default 1 check (cigarettes between 1 and 40)`); the M4 engine subtracts it
2. The trigger chips (existing) and an optional note
3. The recap: the total that did not reset, and one next step

The export's `ProgressSheet` says "Dnevni streak resetovan na Dan 1". There is no streak to reset
in Iskra; that line is cut. The week card already shows the day as neutral.

## Copy, approved by Pavle 24.09.2026

All genderless; counts through `plural()`.

**Nav:** Početna · Napredak · Saznaj · Profil

**Napredak**

- Title: Napredak

- Ciljevi count: Dostignuto: [n]
- Section: Sledeće · still to go: još [x] RSD · još [n] [poriva] · još [n] [cigareta] · za [vreme]
- Chip: Sve · Vreme · Novac · Cigarete · Porivi · Provere · Zdravlje
- Reached date: [datum]
- Celebration sheet: Cilj dostignut · [title] · [sub] · button: Nastavi · link: Podeli
- Detail sheet button: Podeli

**Saznaj**

- Title: Saznaj · sub: Tekstovi sa iskraclub.com o prestanku pušenja.
- Chip: Sve
- Reading time: [n] min čitanja
- Offline: Nema interneta. Tekstovi se otvaraju kad se povežeš.

**Home module 6**

- Section: Moj napredak · Dnevno znanje · Čitaj · Sledeći cilj · Misao dana

**Misao dana:** label Misao dana · button Podeli

**Profil**

- Header line: [n] [dan] bez cigarete
- Sections: Moj plan · Obaveštenja · Privatnost · O Iskri
- Moj plan rows: Ime · Pol · Datum prestanka · Cigarete dnevno · Cena pakle
- Quit-date confirmation: Promeniti datum prestanka? · Brojač dana, novac i ciljevi računaju
  se od novog datuma. Posrtaji ostaju zabeleženi. · Promeni · Otkaži
- Obaveštenja rows: Dnevna provera · Ciljevi · Rizični trenuci · Ne šaljemo ništa između 22 i
  8 časova. · permission off: Obaveštenja su isključena u podešavanjima telefona. · Otvori
  podešavanja
- Privatnost rows: Analitika · Obriši sve podatke
- O Iskri rows: Politika privatnosti · Uslovi korišćenja · Izvori · Iskra na Instagramu · Piši nam
- Footer: Iskra [verzija] · Napravljeno u Srbiji

**Notifications** (no title; the app name shows)

- Check-in: Kako je prošao dan? Jedan dodir i dan je zabeležen.
- Milestone: title **Cilj dostignut**, body **[title] [sub].** (e.g. „Prva nedelja bez cigarete.",
  „10.000 RSD ušteđeno."). Zdravlje uses **[title]: [sub]** (e.g. „12 sati: Nivo ugljen-monoksida u
  krvi se vraća na normalu.")
- Nudge, budjenje: Jutarnji poriv prođe za par minuta. Ako se javi, Iskra je jedan dodir daleko.
- Nudge, kafa: Kafa ide i bez cigarete. Ako se javi poriv, otvori Iskru.
- Nudge, posao: Pauza može i bez cigarete. Prošetaj ili popij vodu.
- Nudge, jelo: Posle jela poriv zna da se javi. Traje 3 do 5 minuta.
- Nudge, kafana and alkohol: Večeras napolju? Kad se javi poriv, dodirni „Imam poriv".

**Slip flow**

- Count: Koliko cigareta? · Sačuvaj
- Note placeholder: Šta se desilo? Nije obavezno.
- Recap: Ukupno [n] [dan] bez cigarete. Ne krećeš od nule. · Nastavi

**Plural forms:** poriv · poriva · poriva; cigareta · cigarete ·
cigareta; dan · dana · dana; godina (Vreme titles): 2 godine · 5 godina

Anything else: `missingCopy()` and `docs/M5-copy-todo.md`. Do not write Serbian.

## Export alignment (24.09.2026): overrides the tasks above

A check of this brief against the export's `HANDOFF.md` and `screens/` found layouts I had
reinvented. Per AGENTS.md, the export's structure is the default. These replace the matching
parts of Tasks 1 to 6; the data rules, sources and copy rules above still hold.

1. **Napredak tab = export `MilestoniScreen`:** the rounded photo hero card holding the title
   (the recipe is in the export's `CLAUDE.md`), then the **2-column grid**: reached goals as
   coloured cards with a Podeli row, upcoming ones as white cards with a category pill and "još …".
   Not a chip-filtered list
2. **Category detail = export `CategoryScreen`, one per category** (Zdravlje, Vreme, Novac,
   Cigarete, Porivi, Provere), opened from Home's six category cards. Next-goal pill, "[n] / [m]
   dostignuto", vertical timeline. M4's Zdravlje screen is this template's Zdravlje instance
3. **Roadmap = export `GoalsRoadmapScreen`**, opened from Home's "Sledeći cilj" card: one
   chronological timeline across all categories, reached rows muted, one highlighted SLEDEĆE card
   with progress, upcoming rows with category colour and "za [vreme]"
4. **Share card = the export's `Iskra Share Card.html`** (9:16 stories format), not a new design.
   Replace its numbers with the person's own and remove anything invented
5. **Misao dana:** the Home card returns to **the export's quote-card slot** (after the stat
   cards, before "Moj napredak"), not inside module 6. The detail screen follows `QuoteScreen`:
   label, the line large, pagination dots over **the last 5 days' lines** (swipe back through
   days, never ahead), the Iskra fact card (only facts already in the app: 3 do 5 minuta, the
   M4 health items), and Podeli. No author row, no category pill, no heart
6. **Saznaj = export `KnowledgeScreen`:** featured card with the canyon texture, the 2-column
   **Kategorije** grid **with real post counts** from `CATEGORIES_QUERY` (counts are true, so they
   stay), then **Novo**. Popularno is cut (no data exists for it), and so are the export's invented
   categories: only Sanity's live categories show
7. **Profil = export `SettingsScreen` structure:** profile card, then **Moj profil** (Ime i pol ·
   Datum prestanka · Stare navike) · **Podešavanja** (Obaveštenja with the Task 5 rows) · **O Iskri**
   (Politika privatnosti · Uslovi korišćenja · Naučna osnova, linking to Izvori) · **Moje iskustvo**
   (Oceni aplikaciju once listed · Predloži funkciju · Problem? Piši nam, both mailto), then the
   danger zone (Obriši sve podatke; Odjava once accounts exist). Premium is cut (no payments).
   "Počni iznova" becomes **Novi datum prestanka** (it never wipes history). Jezik is cut (one
   language)
8. **Slip flow = export `SlipScreen` → `SlipReflectScreen` → `SlipRecapScreen`**:
   - Slip: the headline, the never-resetting total card, Nastavljam, Šta me je nateralo?
     Plus Task 6's cigarette count, placed on this screen
   - Reflect: the trigger list, with **one explanatory card per trigger** as in the export.
     The export's lines are gendered and unsourced; Pavle supplies them (listed in
     `docs/M5-copy-todo.md`, do not write them)
   - Recap: the total, the personal reason card with the signature (as the export). Cut: "plućna
     funkcija 30% bolja" (unsourced) and "Dan 1 počinje upravo sad" (there is no Dan 1 reset)
   - `ProgressSheet` is cut: it announces a streak reset that does not exist
9. **Poriv Success gets the export's "next goal" card** now that goals exist (M3 deferred it):
   the nearest goal and its distance, below the learning line
10. **Home:** the six category cards open the category screens (2), the "Sledeći cilj" card opens
    the roadmap (3)
11. **Craving tools: the export's visuals, M3's behaviour** (Pavle, 24.09). Only the drawing
    changes; timers, taps, outcome rows and copy stay exactly as M3 built them.
    - Pijem vodu: replace the glass with water rising from the bottom of the whole screen. Each
      gulp tap raises the level one step (same step count as M3); the surface has a slow, gentle
      wave. The text stays readable above the water (check contrast on both halves).
    - Šetam: add the export's dotted trail with a dot moving along it at walking pace, looping
      for the tool's duration. The text stays as it is.
    - Dišem: unchanged, 4-4-6 (not the export's 4-4-4).
    - Reduce Motion: water level still steps, no wave; the trail is static with the dot at the
      elapsed position.
    - Home keeps both the reasons card after the timer and Misao dana in the quote slot (task 5).
      The flame badge stays cravings survived.

New strings these need beyond the Copy section: render `missingCopy()` and list them in
`docs/M5-copy-todo.md` for Pavle.

## Acceptance

- [ ] Four tabs, each with real content; every screen in "Export alignment" follows its export layout, deviations listed in the report
- [ ] Milestones unlock idempotently, never re-lock, never celebrate within 48h of a slip or
      during Poriv mod
- [ ] Share card contains only the person's own number and the brand
- [ ] Saznaj uses the site's filter, renders offline from cache, looks finished at three posts
- [ ] Misao dana is the same all day, offline, no attribution
- [ ] Profil edits recompute everything; quit-date edit confirms and keeps history
- [ ] Notifications: max 3 a day, nothing 22 to 8, nothing for 48h after a slip, nothing during
      a craving, rescheduled on every launch; `push_token` no longer stored
- [ ] Slip count stored and subtracted by the engine
- [ ] Zero slashes, em dashes, English, emoji, invented numbers
- [ ] Pijem vodu and Šetam use the export visuals with M3 behaviour unchanged; Reduce Motion respected
- [ ] Screenshots in `.impeccable/review/m5/`
