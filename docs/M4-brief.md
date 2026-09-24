# M4 brief: Napredak (money, health, time)

For the code agent. Read `PRODUCT.md`, `docs/HOME-V2-brief.md` (module 4) and this file. Pavle,
24.09.2026: finish the core app before the Apple/Google account work. M4 and M5 are the rest of
the core. Do the Refero pass per `AGENTS.md`; the references found so far are listed at the end.

**Layout change, Pavle 24.09.2026: follow the export, not a segmented screen.** The first build put
money, health and time on one screen behind a segmented control. The design export gives each
its own full screen, and that is the layout to build. **Remove the segmented control.** Four
separate stack screens, each opened on its own:

| Screen | Export source | Opened from |
|---|---|---|
| Ušteđevina | `MoneyScreen.jsx` | Home "RSD ušteđeno" card |
| Odbijene cigarete | `CigarettesScreen.jsx` | Home "cigareta odbijeno" card; the link on Ušteđevina |
| Tvoje vreme | `TimeScreen.jsx` | Home timer card |
| Zdravlje | `CategoryScreen.jsx` | Home Zdravlje category card (M5) |

Match each export screen's structure and order: back button left, title centred, share button
right, icon over a large hero number, then its cards. Keep the Iskra tokens (the export's gold
coin colour maps to the nearest palette token, as before). What changes from the export is only
what the rules force, and every change is listed per screen below.

## Task 0: one progress engine

A single pure module, `src/lib/progress/`, fully unit-tested, used by Home, the Napredak tab (M5) and notifications (M5). Nothing on screen computes its own numbers.

Inputs: `quit_date`, anchor time zone, `cigarettes_per_day`, `pack_price_rsd`,
`cigarettes_per_pack` (20), the slips, now.

Outputs: smoke-free ms (`smokeFreeMs`, unchanged: slips never reset it), cigarettes not smoked,
RSD saved, time returned, projections, next money threshold, health timeline state.

**Port `iskra-website-final/src/lib/calc.ts`, do not rewrite it.** Keep its comments and sources:
`CIGS_PER_PACK = 20`, `MINUTES_PER_CIG = 6`, the everyday-price `CATALOG` with its sourced prices
and `equivalents()`. Use the app's existing `plural()` (it already handles fractions). Note the
file's "Last verified" date in a comment; prices are claims and go stale.

### Honest arithmetic after a slip

- `cigarettes not smoked = floor(smokeFreeDays × cigarettes_per_day) − cigarettes smoked in slips`
- A slip counts as the number of cigarettes recorded on it. Until the M5 slip flow adds that
  count, **each slip counts as 1**
- `RSD saved = cigarettes not smoked × pack_price / cigarettes_per_pack`, never negative
- Floor everything shown. Never round a saving up (PRODUCT.md: never invent a number)
- Changing habits in Profil recomputes from the current values; say so in a code comment

## Task 1: Ušteđevina (export `MoneyScreen`)

Top to bottom, as the export:

1. Header: back · **Ušteđevina** · share
2. Coin glyph, the RSD hero, the period line under it
3. **Rast ušteđevine:** a chart of cumulative savings by day since the quit date. **Truthful, not
   decorative:** the export draws a smooth wave, but the real line is straight with a step down on
   each slip day. Plot the real series, no smoothing, x-axis labels Dan 1 and today
4. **Ako nastaviš:** four rows, daily, weekly, monthly, yearly spend avoided, from the current
   habits (the export's four rows, kept)
5. **To je kao...:** the three `equivalents()` rows from the ported `calc.ts`, with its sourced
   prices. The export's ćevapi, "vikend u Beogradu" and Netflix have no price source in the code,
   so they are not used. Pavle can add items to the catalog later, each with a sourced price
6. **Sledeći cilj** card with progress (thresholds as before)
7. The cigarettes link card: count and chevron, opens Odbijene cigarete
8. **Podeli svoju pobedu:** the share card from M5 Task 1b, with this screen's number. Until M5
   ships it, hide the button
9. Fine print

Changes from the export: the chart is real data; the equivalents are sourced; "Odbio/la si i"
becomes a genderless line; the title is spelled **Ušteđevina** (the export's "Uštedine" is wrong).

## Task 2: Zdravlje

A vertical timeline (export `CategoryScreen` layout: filled dot for reached, ringed dot with a
progress bar for the current one, faint dot for upcoming, a thin line between).

**Only these items, each with its source in code.** WHO lines are the site's approved Serbian
(`HEALTH_MILESTONES` in the website's `content.ts`); the three NHS lines are new and approved here.

| At | Source | Text |
|---|---|---|
| 20 minuta | WHO | Puls i krvni pritisak se spuštaju. |
| 8 sati | NHS | Nivo kiseonika se oporavlja, a ugljen-monoksida u krvi je upola manje. |
| 12 sati | WHO | Nivo ugljen-monoksida u krvi se vraća na normalu. |
| 48 sati | NHS | Pluća počinju da izbacuju sluz, a ukus i miris se popravljaju. |
| 72 sata | NHS | Disanje postaje lakše jer se disajni putevi opuštaju. Energije je više. |
| od 2 do 12 nedelja | WHO | Cirkulacija se poboljšava, a pluća rade bolje. |
| od 1 do 9 meseci | WHO | Kašalj i nedostatak daha se smanjuju. |
| 1 godina | WHO | Rizik od koronarne bolesti srca je otprilike upola manji nego kod pušača. |
| od 5 do 15 godina | WHO | Rizik od moždanog udara pada na nivo nepušača. |
| 10 godina | WHO | Rizik od raka pluća je otprilike upola manji nego kod pušača. |
| 15 godina | WHO | Rizik od koronarne bolesti srca je kao kod nepušača. |

Sources, in a comment at the top of the data file:
WHO, "Tobacco: health benefits of smoking cessation",
https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation
NHS Better Health, "What could happen when you quit smoking",
https://www.nhs.uk/better-health/quit-smoking/ready-to-quit-smoking/what-could-happen-when-you-quit-smoking/

Rules:

- A range item counts as reached at the start of its range; its label still shows the range
- Measured from the quit date. Nothing else is added: no "lung function 30%", no "nicotine
  receptors reset", no "trees saved". The export's extras are unsourced and cut
- Each item shows a small source tag (WHO or NHS) in muted text
- Upcoming items show "za [vreme]" (forms below)

## Task 3: Odbijene cigarete (export `CigarettesScreen`)

1. Header: back · **Odbijene cigarete** · share
2. Hero: the count, label, period line
3. **Ukupno:** packs, and butts ("opušaka manje")
4. **Ako nastaviš:** monthly and yearly cigarettes at the current habit
5. Link card to Ušteđevina with the RSD figure
6. Share button (as above), fine print

Cut from the export: "470 g katrana" and "940 mg nikotina". Label yields are not what reaches the
lungs, so the figures would be invented. Every "nisi/uštedeo/la" line is rewritten genderless.

## Task 3b: Tvoje vreme (export `TimeScreen`)

1. Header: back · **Tvoje vreme** · share
2. Hero: the live days, hours, minutes since the quit date (the same engine as Home's timer),
   period line
3. **Vreme koje je ostalo tebi:** hours returned (cigarettes not smoked × 6 min), with the basis
   line
4. The time goals from the export's "Šta si sve preživeo/la" list, kept as a timeline with a
   "Ti si ovde" marker, **only with Iskra's own time thresholds** (M5 Ciljevi, Vreme category)
5. Share button, fine print

Cut from the export: the Artemis, ISS, flight and holiday comparisons (novelty, and they compare
with nothing the person did), "Prethodni pad" (the slip history belongs to the slip flow and must
never read as a verdict on this screen), "SLOBODAN/NA VEĆ" (gendered).

## Task 4: Home

Home module 4's two cards open **Ušteđevina** and **Odbijene cigarete**; the timer card opens
**Tvoje vreme**.

## Copy, approved by Pavle 24.09.2026

All genderless. Counts through `plural()`.

**Ušteđevina**

- Title: Ušteđevina
- Hero label: RSD · period: za [n] [dan] bez cigarete
- Chart title: Rast ušteđevine · axis: Dan 1 · Danas
- Section: Ako nastaviš · rows: [x] RSD dnevno · nedeljno · mesečno · godišnje
- Basis: Računica: [n] [cigareta] dnevno, pakla [cena] RSD. · link: Promeni
- Section: To je kao... · note: Poređenja se menjaju kako ušteđevina raste.
- Next: Sledeći cilj: [x] RSD · još [x] RSD
- Link card: Uz to, nije zapaljeno · [n] [cigareta]
- Button: Podeli svoju pobedu
- Fine print: Računica je okvirna i zavisi od broja cigareta i cene pakle. Svaki zabeležen
  posrtaj računamo kao zapaljene cigarete.

**Odbijene cigarete**

- Title: Odbijene cigarete
- Hero: [n] · label: [cigareta odbijeno] · period: za [n] [dan] bez cigarete
- Section: Ukupno · rows: [n] [pakla] · [n] [opušaka] manje
- Section: Ako nastaviš · rows: [n] [cigareta] mesečno · [n] [cigareta] godišnje
- Link card: Uz to, ušteđeno · [x] RSD
- Button: Podeli svoju pobedu

**Tvoje vreme**

- Title: Tvoje vreme
- Hero eyebrow: BEZ CIGARETE · units as Home's timer
- Section: Vreme koje je ostalo tebi · [n] [sati] · koje nije otišlo na pušenje · basis:
  Računamo 6 minuta po cigareti.
- Section: Ciljevi · marker: Ti si ovde · upcoming: za [vreme]
- Button: Podeli svoju pobedu

**Zdravlje**

- Heading: Šta se dešava u telu
- Sub: Opšti tok oporavka prema javnim smernicama. Kod svakog je malo drugačije.
- Upcoming: za [n] [vreme]
- Fine print: Izvori: Svetska zdravstvena organizacija (WHO) i NHS, javno dostupne smernice.
  Opšti podaci, ne medicinski savet.

**Plural forms**

- cigareta odbijeno: 1 cigareta odbijena · 2 cigarete odbijene · 5 cigareta odbijeno (as Home)
- cigareta (dnevno): cigareta · cigarete · cigareta
- pakla: pakla · pakle · pakli
- opušak: opušak · opuška · opušaka
- sat: sat · sata · sati
- "za" + time (accusative): za 1 sat · 2 sata · 5 sati; za 1 dan · 2 dana · 5 dana; za 1 nedelju
  · 2 nedelje · 5 nedelja; za 1 mesec · 2 meseca · 5 meseci; za 1 godinu · 2 godine · 5 godina.
  Hours under 2 days, days under 8 weeks, then months, then years

Anything else: `missingCopy()` and `docs/M4-copy-todo.md`.

## Refero (started; add your own per AGENTS.md)

| Reference | Taken | Not taken |
|---|---|---|
| [Unwind stats](https://refero.design/screens/c70edab7-00aa-4bad-97d5-bfeb918227b4) | One hero number per section, then supporting cards | Charts of derived data |
| [Alive history](https://refero.design/screens/c698d28e-2749-4a2f-a780-5572f27362d3) | Left-rail vertical timeline for Zdravlje | Dark mode |
| Export `CategoryScreen` | Reached / current with progress / upcoming states | Unsourced items |

## Acceptance

- [ ] One engine, unit-tested: slips subtract, nothing rounds up, habits edit recomputes
- [ ] Four separate screens in the export's layout (no segmented control), each offline with the approved copy
- [ ] Zdravlje shows exactly the 11 sourced items, each with WHO or NHS tag
- [ ] Home cards open Ušteđevina, Odbijene cigarete and Tvoje vreme; the savings chart is real data
- [ ] Every count through `plural()`; zero slashes, em dashes, English, invented numbers
- [ ] Screenshots in `.impeccable/review/m4/` at day 0, day 3, day 40 with one slip, day 400
