# M2 — Onboarding copy & screen structure (transcription)

Source of truth for this document (read-only, never modified):

- `ISKRA - mobile claude design export/screens/Onboarding*.jsx` (20 files)
- `ISKRA - mobile claude design export/ONBOARDING_COPY_BRIEF.md`
- Cross-checked against `ISKRA - mobile claude design export/HANDOFF.md`, `README.md`, `CLAUDE.md`
  (flow order, "rough sketch" flags) — those are cited, not transcribed.

**This is a transcription, not a rewrite.** Every Serbian string below is copied character for
character from the export, including diacritics (š č ž ć đ), typographic quotes („ ”), en dashes (–),
em dashes (—) and slash gender forms. Nothing has been corrected, normalised, shortened or
translated. Structural commentary is in English.

## How to read this document

| Marker | Meaning |
|---|---|
| **NEEDS-REWRITE** | The string contains a slash gender form (`pušio/la`, `spreman/na`, …). The app forbids slashes, so Pavle must supply a real rewrite or the string must route through a `g()` token. The slash form is still transcribed verbatim so nothing is lost. |
| *(unsure — included)* | I could not tell from the code whether the string is user-visible; included per the "when unsure, include it" rule. |
| *(prototype sample data)* | The export hardcodes a value that the real app must compute from the profile (e.g. `146.000`, `Pavle`, `31. maj`). Not copy to ship as-is. |

Two spellings of the export's quote marks, exactly as they appear in the file: the opening mark is
`„` (U+201E) and the closing mark is `”` (U+201D). Serbian typography normally closes with `“`
(U+201C); the export does not. **Transcribed as written — do not silently "fix" this.**

## Flow order (from `Iskra Prototype.html` STEPS, per `CLAUDE.md` / `HANDOFF.md`)

Splash → Name → Gender → Product → Cigarettes → Price → **Cost** → Reasons → ReasonText →
**Reflection** → Fears → **FearReflection** → Triggers → Timing → Date → **Preview** → Panic →
**Commitment** → **Summary** → Notifications → Review → Paywall → Home.
Bold = ember/dark screens (`<IOSDevice dark>`).

`OnboardingInsight` is **not** in the linear flow (see its section).

## Screens the export itself flags as rough / not canonical

- `README.md` (Sources / provenance): *"Not yet canonical (rough sketches — do NOT treat as final): …
  The **Welcome/Splash** screen and a few early onboarding screens — copy/layout still in flux."*
  It does not name which early onboarding screens.
- `HANDOFF.md`: *"The one explicitly-rough area: the craving 'games' (`IgramScreen`, `WaterScreen`,
  etc.) and the **Welcome/Splash** are concept sketches — everything else is near-production."*
  `SplashScreen` is also annotated in the screen list: *"(Concept-level polish — flagged rough.)"*
- `HANDOFF.md` on `OnboardingInsight`: *"an earlier standalone insight interstitial … Kept for
  reference; not in the current linear flow."*
- `CLAUDE.md`: the progress fractions are *"not yet normalized"* (early screens `/11`, later `/18`).

No individual `Onboarding*.jsx` file carries an in-file TODO, FIXME or "rough" comment. The only
`// TODO`-adjacent comments are implementation notes in `OnboardingCommitment.jsx` about the
pre-drawn sample signature.

---

# 1. `OnboardingName.jsx`

**Component:** `OnboardingName` · White screen · Progress `2 / 11`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading (h1, 28px/600) | `Kako da te zovemo?` |
| Subtitle (16px/400) | `Koristićemo ovo ime kroz celu aplikaciju.` |
| Input placeholder | `Tvoje ime` |
| Primary button | `Nastavi` |

### Structure & interaction

- Asks for the user's display name.
- Input type: single-line free text. No max length in code.
- Validation: `ready = name.trim().length > 0`. `Nastavi` is disabled (pale `#F0D6C6`) until
  non-empty; pressing it when not ready is a no-op.
- No auto-advance. Back arrow present.
- Profile field: `name` (per the copy brief's data model; the JSX does not name the field — it only
  holds local state).

### Conditional logic / TODOs

None.

---

# 2. `OnboardingGender.jsx`

**Component:** `OnboardingGender` · White screen · Progress `3 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Kako da te oslovljavamo?` |
| Subtitle (15px/400) | `Personalizujemo tvoj zdravstveni napredak na osnovu ovoga.` |
| Card label (left) | `Muško` |
| Card label (right) | `Žensko` |
| Tertiary underlined text button | `Preferiram da ne kažem` |
| Primary button | `Nastavi` |
| Image-slot placeholder ×2 | `Dodaj fotografiju` — *(unsure — included)*. This is the `placeholder` attribute of the `<image-slot>` custom element (`slotId="iskra-gender-male"` / `"iskra-gender-female"`), i.e. authoring-tool chrome for dropping a photo into the prototype, almost certainly **not** shipped UI. |

### Key → label

| key (in code) | label |
|---|---|
| `'male'` | `Muško` |
| `'female'` | `Žensko` |
| `'na'` | `Preferiram da ne kažem` |

### Structure & interaction

- Single-select. Two tall (248px) photo cards side by side, each with a white label pill + chevron;
  selected = 2.5px ember border + ember shadow, label and chevron turn ember. Below them, a centred
  underlined text button for the third option, which turns ember when active.
- Does **not** auto-advance — `Nastavi` is required. Disabled until `sel !== null`.
- Profile field: `gender`. **Note the key mismatch:** the JSX stores `'male' / 'female' / 'na'`,
  while the copy brief's data model specifies `m / f / x`. Pick one and map.

### Conditional logic / TODOs

- The brief (§4 screen 3) gives a different subtitle for this screen:
  `Da bismo ti se obraćali kako treba i prilagodili zdravstveni napredak.`
  The JSX ships `Personalizujemo tvoj zdravstveni napredak na osnovu ovoga.` **Two competing
  approved strings — Pavle to pick.** Both transcribed verbatim.
- The brief also frames this screen as "This is WHY we ask — say so", which the shipped subtitle only
  half does (it drops the grammar reason).

---

# 3. `OnboardingProduct.jsx`

**Component:** `OnboardingProduct` · Warm grey screen `#F7F6F3` · Progress `4 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Šta koristiš?` |
| Subtitle (16px/400) | `Prilagodićemo Iskru tebi.` |
| Card 1 title | `Cigarete` |
| Card 1 subtitle | `Klasično pušenje` |
| Card 2 title | `IQOS` |
| Card 2 subtitle | `Zagrevani duvan` |
| Primary button | `Nastavljam` |

### Key → label

| key | title | subtitle |
|---|---|---|
| `cigarete` | `Cigarete` | `Klasično pušenje` |
| `iqos` | `IQOS` | `Zagrevani duvan` |

### Structure & interaction

- Single-select, two stacked full-width cards (icon chip + title + subtitle + radio circle).
  Selected = inverted ember fill, white text, white chip with ember icon, white tick in the radio.
- **Default value: `'cigarete'` is pre-selected** (`useState('cigarete')`), so `Nastavljam` is
  enabled on arrival.
- No auto-advance.
- Profile field: `product`. Keys match the copy brief.
- Note: this is the only onboarding CTA that reads `Nastavljam` rather than `Nastavi`. The brief
  specifies `Nastavljam` here too, so it is intentional.

### Conditional logic / TODOs

- Downstream consequence documented in the brief (§1 `productNoun`, §7.7): when `product = iqos`,
  cigarette-specific nouns in later copy must swap to štapići / zagrevanje duvana, and no card an
  IQOS user can see may hardcode "cigareta". **The shipped screens do not implement this yet** —
  Cost, Preview, Summary, Cigarettes and Notifications all hardcode "cigarete/cigareta" (flagged per
  screen below).

---

# 4. `OnboardingCigarettes.jsx`

**Component:** `OnboardingCigarettes` · White screen · Progress `3 / 17` (note: a third denominator)

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Koliko cigareta dnevno si pušio/la?` **NEEDS-REWRITE** (`pušio/la`) |
| Subtitle (15px/400) | `Koristimo ovo da izračunamo tvoje uštedine.` |
| Stepper unit label | `cigareta dnevno` |
| Helper note (13px, `#BBB`) | `Prosek u Srbiji je oko 15 cigareta dnevno.` |
| Second field label | `Cigara u pakli` |
| Second field sub-label | `Najčešće 20` |
| Second field placeholder | `20` |
| Primary button | `Nastavi` |

### Structure & interaction

- **Field 1 — stepper.** Minus (outline circle) / big number (52px) / plus (ember circle).
  Default `20`. Min `1`, max `80` (`Math.max(1, c-1)` / `Math.min(80, c+1)`). The minus button dims
  to 0.45 opacity at the minimum.
- **Field 2 — numeric input** below a hairline divider. Default `20`; input is digit-filtered and
  capped at 2 characters (`replace(/\D/g,'').slice(0,2)`); `inputMode="numeric"`; border turns ember
  on focus.
- No validation gate: `Nastavi` is always enabled.
- Profile fields: `cigsPerDay` (stepper) and `cigsPerPack` (input).

### Conditional logic / TODOs

- Progress bar is `3 / 17` while its neighbours are `/18` and `/11`. One of the export's known
  un-normalised fractions.
- Both the heading and the helper note hardcode "cigareta" — breaks for `product = iqos`
  (brief §7.7). The brief's version parameterises it: `Koliko [productNoun] dnevno si [g:pušio]?`
- Brief's helper note differs slightly: `Prosek u Srbiji je oko 15 dnevno.` (no "cigareta").
  **Two competing strings — Pavle to pick.**

---

# 5. `OnboardingPrice.jsx`

**Component:** `OnboardingPrice` · White screen · Progress `5 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Koliko košta tvoja kutija?` |
| Subtitle (15px/400) | `Koristimo ovo da izračunamo koliko ćeš uštedeti.` |
| Input placeholder | `400` |
| Currency toggle option 1 | `RSD` |
| Currency toggle option 2 | `EUR` |
| Helper note (13px, `#BBB`) | `Marlboro u Srbiji košta oko 400–500 RSD.` (en dash U+2013 between 400 and 500) |
| Primary button | `Nastavi` |

### Key → label

| key | label |
|---|---|
| `'RSD'` | `RSD` |
| `'EUR'` | `EUR` |

### Structure & interaction

- Free numeric input (digit-filtered, `inputMode="numeric"`, no max) paired with a 2-segment
  currency toggle. Input default `'400'`; currency default `'RSD'`.
- Validation: `ready = amount.trim() !== '' && Number(amount) > 0`. `Nastavi` disabled otherwise.
- No auto-advance.
- Profile fields: `packPrice`, `currency`.

### Conditional logic / TODOs

- The helper note names a specific brand and a RSD price. It is static — it does **not** change when
  the user switches the toggle to EUR. Worth a product decision.

---

# 6. `OnboardingCost.jsx` — AHA `[DARK]`

**Component:** `OnboardingCost` · Full ember background `#E8621A`, white text, white card,
white button with ember label · Progress `6 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Eyebrow (11px/700, 2px tracking, uppercase as written) | `TVOJI PODACI` |
| Lead line (18px/400) | `Godišnje trošiš na cigarete` |
| Big number in white card (80px/700, ember) | `146.000` *(prototype sample data)* |
| Currency under the number (24px/600, ember) | `RSD` *(prototype sample data)* |
| Equivalent line under divider (14px/500, grey) | `= 10 dana odmora na moru` *(prototype sample data)* |
| Closing line (16px/500, white) | `Iskra ti vraća taj novac — dan po dan.` (em dash U+2014) |
| Primary button (white bg, ember text) | `Nastavi` |

### Structure & interaction

- Pure reveal screen. No input, no validation, no auto-advance. Back arrow is a translucent white
  chip.
- The number, the currency and the equivalent line are all computed at runtime in the real app:
  `annualCost = (cigsPerDay / cigsPerPack) * packPrice * 365`, rounded, and
  `costEquivalent` picked from the band table (brief §6, reproduced in §22 of this document only by
  reference — the full band table lives in the brief).

### Conditional logic / TODOs

- **Tense shift (brief §7.6):** if `timing = vec_prestao`, the lead line must go past tense —
  brief's variant: `Godišnje si [g:trosio] na [productNoun]` with new tokens `trosio` / `trosila`.
  The shipped screen has only the present-tense line.
- **Product noun:** the shipped lead hardcodes `cigarete`; the brief parameterises it as
  `Godišnje trošiš na [productNoun]`.

---

# 7. `OnboardingReasons.jsx`

**Component:** `OnboardingReasons` · White screen · Progress `7 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Zašto hoćeš da prestaneš?` |
| Subtitle (15px/400) | `Izaberi do 3 razloga. Koristićemo ih tokom tvog putovanja.` |
| Primary button | `Nastavi` |

### Key → label (the `REASONS` array, in code order)

| key | label | icon colour |
|---|---|---|
| `zdravlje` | `Zdravlje` | `#D4547E` |
| `porodica` | `Porodica` | `#4A6080` |
| `pare` | `Pare` | `#2E8B80` |
| `forma` | `Fizička forma` | `#3A7A3A` |
| `sloboda` | `Sloboda` | `#6B52A8` |
| `pritisak` | `Pritisak doktora ili partnera` | `#BA7517` |

### Structure & interaction

- Multi-select, 2-column grid of 6 pills (icon above label, min height 104px).
  Selected = inverted ember fill, white icon, white label.
- **Max 3** — enforced in `toggle()`: once 3 are selected, tapping an unselected pill is a silent
  no-op (no toast, no message). Min 1 to continue.
- Validation: `ready = sel.length >= 1`. No auto-advance.
- Selection order is preserved in the state array (`[...cur, key]`), which is what the brief's §7.2
  mirroring rule depends on.
- Profile field: `reasons` (string[], ≤3).

### Conditional logic / TODOs

- **`pritisak` label mismatch.** Code: `Pritisak doktora ili partnera`. Copy brief (§3a, §7.3):
  `Pritisak okoline`, with `listLabel` = `pritisak okoline`. **Two competing approved strings —
  Pavle to pick**, and the `listLabel` must follow.
- **Subtitle mismatch.** Code: `Izaberi do 3 razloga. Koristićemo ih tokom tvog putovanja.`
  Brief (§4 screen 8): `Izaberi do 3 razloga. Vraćaćemo ti ih kad bude teško.` **Pavle to pick.**
- The screen gives no visible feedback when the 3-selection cap is hit. Flagged as a UX gap, not a
  copy gap — but if a message is wanted, it is a new Serbian string and needs Pavle.

---

# 8. `OnboardingReasonText.jsx`

**Component:** `OnboardingReasonText` · White screen · Progress `8 / 19` (a fourth denominator)

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Zapiši to svojim rečima.` |
| Subtitle (15px/400) | `Pokazaćemo ti ovo svaki put kad bude najteže.` |
| Textarea placeholder | `Hoću da uštedim za letovanje` |
| Character counter | rendered as `{val.length} / {MAX}` → e.g. `0 / 120` (digits + ` / `, no Serbian words) |
| Privacy note (13px, italic, centred) | `Samo ti ovo vidiš. Nikad ne delimo.` |
| Primary button | `Nastavi` |

### Key → label (the `CHIPS` array — these are plain strings, there are no keys)

| index | chip label |
|---|---|
| 0 | `Zbog zdravlja` |
| 1 | `Zbog dece` |
| 2 | `Zbog para` |
| 3 | `Zbog sebe` |
| 4 | `Zbog partnera` |

### Structure & interaction

- Free-text `<textarea>`, 4 rows, min box height 160px, **hard cap `MAX = 120` characters**
  (`e.target.value.slice(0, MAX)`), live counter bottom-right of the box.
- The chips are **fill-the-field** shortcuts, not multi-select tags: tapping one calls
  `setChip(c)` which **replaces** the whole field with that chip's text (`setVal(c.slice(0, MAX))`).
  They do not append, and they do not stay visually selected.
- Validation: `ready = val.trim().length > 0` — `Nastavi` is **disabled while empty**.
- No auto-advance.
- Profile field: `reasonText`.

### Conditional logic / TODOs

- **Contradiction with the brief.** Brief §7.5 states: *"`reasonText` is **optional** (the screen's
  'Nastavi' works with an empty field)"* and specifies a fallback for every downstream surface that
  shows "your own words". The shipped JSX makes the field **required**. Pick one; if the field stays
  required, the §7.5 fallback copy is dead code, and if it becomes optional, the fallback string
  `Tvoji razlozi: [header-join].` is needed.
- The brief marks the placeholder as italic; the JSX renders the textarea in normal weight 500 (the
  placeholder inherits, so it is not italic). Cosmetic, flagged for completeness.

---

# 9. `OnboardingReflection.jsx` — reasons reflection `[DARK]`

**Component:** `OnboardingReflection` · Full ember background, white heading, 3 white cards ·
Progress `8 / 18` (collides with ReasonText's `8 / 19`)

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading (26px/600, white) | `Znamo da prestanak nije lako.` |
| Subtitle (15px/400, white 85%) | `Ali tvoji razlozi su jači od navike.` |
| Primary button (white bg, ember text) | `Razumem` |

### Cards (the `CARDS` array — **static in the export, 3 fixed cards, NOT yet mirrored**)

Each card = colour icon, label, body, bold ember takeaway.

| # | label | body | ember takeaway | icon colour |
|---|---|---|---|---|
| 1 | `Zdravlje` | `Već 20 minuta nakon poslednje cigarete, krvni pritisak počinje da se normalizuje.` | `Tvoje telo je već spremno da počne.` | `#D4547E` |
| 2 | `Porodica` | `Pasivno pušenje utiče na ljude oko tebe — posebno decu.` (em dash) | `Oni su tvoj razlog broj jedan.` | `#4A6080` |
| 3 | `Sloboda` | `Nikotin stvara iluziju opuštanja. Bez njega, stres se zapravo lakše podnosi.` | `Sloboda počinje prvim danom.` | `#6B52A8` |

### Structure & interaction

- Scrollable (`overflowY: auto`) card list. No input. No auto-advance.
- The card array is a hardcoded constant — **the export always shows exactly Zdravlje / Porodica /
  Sloboda regardless of what the user picked on Reasons.** The brief requires this screen to be a
  true mirror.

### Conditional logic — the brief's per-reason card set (verbatim from `ONBOARDING_COPY_BRIEF.md` §3a)

This is the copy that must render, one card per selected `reason`, in selection order. All six are
written; only the selected ones render.

| reason | title | body | ember takeaway |
|---|---|---|---|
| `zdravlje` | `Zdravlje` | `Već 20 minuta nakon poslednje cigarete krvni pritisak počinje da se vraća u normalu.` | `Tvoje telo počinje da se oporavlja odmah.` |
| `porodica` | `Porodica` | `Pasivni dim utiče na sve oko tebe — najviše na decu.` | `Oni su razlog koji se ne dovodi u pitanje.` |
| `pare` | `Pare` | `Trošiš **[annualCost]** godišnje na [productNoun]. Taj novac može biti tvoj.` | `Svaki dan bez pušenja je novac u tvom džepu.` |
| `forma` | `Fizička forma` | `Već posle nedelju dana pluća rade lakše, a izdržljivost raste.` | `Vratićeš dah koji si mislio da je nestao.` → brief marks this `[g:mislio]` |
| `sloboda` | `Sloboda` | `Nikotin stvara iluziju kontrole. Bez njega, ti odlučuješ.` | `Sloboda počinje prvog dana.` |
| `pritisak` | `Pritisak okoline` | `Možda si počeo zbog drugih. Ali prestaješ zbog sebe.` → brief marks `[g:počeo]` | `Ovo je tvoja odluka, ni za koga drugog.` |

**The three cards shipped in the JSX and the brief's three same-named cards are different strings.**
Zdravlje, Porodica and Sloboda each exist in two versions. Pavle must pick, per card.

Brief's header treatment for this screen also differs from the shipped one: eyebrow `ČUJEMO TE`,
header = the user's reasons joined into a Serbian list (`Zdravlje, porodica i sloboda.`), subtitle
`To su tvoji razlozi. Iskra će ti ih uvek vraćati.`, CTA `Tačno tako`. The shipped screen has no
eyebrow, a static header, and the CTA `Razumem`. **Whole screen is two competing versions.**

### List-join rules for the header (brief §7.3, verbatim)

- 1 item: `Zdravlje.`
- 2 items: `Zdravlje i porodica.`
- 3 items: `Zdravlje, porodica i sloboda.`
- N>3: `A, B, C i D` — no Oxford comma in Serbian; `i` only before the last.
- Only the first word is capitalised; every other label uses the lowercase `listLabel` form.

### `listLabel` table (brief §7.3, verbatim — pill label vs in-sentence form)

| option | pill label | `listLabel` |
|---|---|---|
| `zdravlje` | `Zdravlje` | `zdravlje` |
| `porodica` | `Porodica` | `porodica` |
| `pare` | `Pare` | `pare` |
| `forma` | `Fizička forma` | `fizička forma` |
| `sloboda` | `Sloboda` | `sloboda` |
| `pritisak` | `Pritisak okoline` | `pritisak okoline` |
| `porivi` | `Jaki porivi` | `jaki porivi` |
| `stres` | `Stres bez cigarete` | `stres` |
| `kafana` | `Kafana i društvo` | `kafana i društvo` |
| `neuspeh` | `Strah od neuspeha` | `strah od neuspeha` |
| `razdrazljivost` | `Razdražljivost` | `razdražljivost` |
| `kilaza` | `Dobitak na kilaži` | `kilaža` |

---

# 10. `OnboardingFears.jsx`

**Component:** `OnboardingFears` · White screen · Progress `9 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Šta te brine kod prestanka?` |
| Subtitle (15px/400) | `Budi iskren/a. Tu smo da pomognemo.` **NEEDS-REWRITE** (`iskren/a`) |
| Primary button | `Nastavi` |

### Key → label (the `FEARS` array, in code order)

| key | label | icon colour |
|---|---|---|
| `porivi` | `Jaki porivi` | `#E8621A` |
| `stres` | `Stres bez cigarete` | `#4A6080` |
| `kafana` | `Kafana i društvo` | `#6B52A8` |
| `neuspeh` | `Strah od neuspeha` | `#BA7517` |
| `razdraz` | `Razdražljivost` | `#D4547E` |
| `kilaza` | `Dobitak na kilaži` | `#3A7A3A` |

### Structure & interaction

- Multi-select, 2-column grid of 6 pills, identical styling to Reasons.
- **No maximum** — `toggle()` has no cap, all 6 can be selected. Min 1 to continue
  (`ready = sel.length >= 1`). No auto-advance.
- Selection order preserved.
- Profile field: `fears` (string[]).

### Conditional logic / TODOs

- **Key mismatch:** code uses `razdraz`; the copy brief's data model and its §3b / §7.3 tables use
  `razdrazljivost`. Pick one.
- `iskren/a` is a slash form and needs a rewrite. The brief already flags it: *"add `iskren/iskrena`
  to token table"* — so the `x` form is still owed.
- Brief §7.4 leaves an open product decision on this screen's downstream reflection: show a card for
  every selected fear (screen scrolls), or hard-cap at 3 using the priority order
  `porivi → kafana → stres → neuspeh → razdrazljivost → kilaza` and append nothing (explicitly
  **not** a "+N more" affordance). *"Pick one behavior and document it in code."*

---

# 11. `OnboardingFearReflection.jsx` — fear reflection `[DARK]`

**Component:** `OnboardingFearReflection` · Full ember background, 3 white cards · Progress `10 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading (26px/600, white) | `Ove brige su normalne. Svi ih imaju.` |
| Subtitle (15px/400, white 85%) | `Iskra je napravljena tačno za ove trenutke.` |
| Primary button (white bg, ember text) | `Spreman/na sam` **NEEDS-REWRITE** (`Spreman/na`) |

### Cards (the `CARDS` array — **static in the export, 3 fixed cards, NOT yet mirrored**)

| # | label | body | ember takeaway | icon colour |
|---|---|---|---|---|
| 1 | `Jaki porivi` | `Svaki poriv traje između 3 i 5 minuta. Posle toga prolazi sam — uvek.` (em dash) | `Iskra ima alat tačno za taj trenutak.` | `#E8621A` |
| 2 | `Stres bez cigarete` | `Nikotin ne smanjuje stres — samo privremeno gasi apstinencijalni sindrom koji je on sam izazvao.` (em dash) | `Pravi oprez dolazi posle 3 nedelje.` | `#4A6080` |
| 3 | `Kafana i društvo` | `Društveni pritisak je jedan od glavnih razloga pada. Imaćeš skriptu za svaki takav trenutak.` | `Nisi sam/a u tome.` **NEEDS-REWRITE** (`sam/a`) | `#6B52A8` |

### Structure & interaction

- Scrollable card list, no input, no auto-advance. Same shell as `OnboardingReflection`.
- Hardcoded 3 cards — always porivi / stres / kafana regardless of selection.

### Conditional logic — the brief's per-fear card set (verbatim from §3b)

One card per selected `fear`, in selection order. All six written:

| fear | title | body | ember takeaway |
|---|---|---|---|
| `porivi` | `Jaki porivi` | `Svaki poriv traje između 3 i 5 minuta, pa prolazi sam — uvek.` | `Iskra ima alat za tačno taj trenutak.` |
| `stres` | `Stres bez cigarete` | `Nikotin ne smanjuje stres — samo nakratko gasi apstinenciju koju je sam izazvao.` | `Pravo olakšanje dolazi posle 3 nedelje.` |
| `kafana` | `Kafana i društvo` | `Društvene situacije su čest okidač. Imaćeš plan za svaku od njih.` | `Nećeš biti [g:sam] u tome.` |
| `neuspeh` | `Strah od neuspeha` | `Prosečna osoba pokuša više puta pre nego što [g:prestao] zauvek. Pokušaj nije neuspeh.` | `Ovaj put imaš pomoć uz sebe.` |
| `razdrazljivost` | `Razdražljivost` | `Prvih par dana mozak traži naviku. To je privremeno i predvidivo.` | `Za 2 nedelje vraća se mir.` |
| `kilaza` | `Dobitak na kilaži` | `Apetit se može vratiti — ali to se kontroliše malim navikama, ne nikotinom.` | `Brinemo i o tome, korak po korak.` |

**All three shipped cards differ from the brief's same-named cards** (e.g. shipped
`Pravi oprez dolazi posle 3 nedelje.` vs brief `Pravo olakšanje dolazi posle 3 nedelje.` — note these
are different words, not a typo I am allowed to reconcile). Pavle to pick, per card.

Brief header/subtitle for this screen match the shipped ones. Brief CTA: `[g:spreman] sam`, with the
explicit `x` instruction: *"for `x`: 'Spremni smo' or 'Idemo dalje'."* The shipped CTA is the slash
form `Spreman/na sam`.

Brief §7.4 also notes the header here is static and does **not** list the fears, so any number of
selected fears is safe for the header; only the card list scales.

---

# 12. `OnboardingTriggers.jsx`

**Component:** `OnboardingTriggers` · White screen · Progress `10 / 18` (collides with FearReflection)

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Kada ti se najviše puši?` |
| Subtitle (15px/400) | `Koristićemo ovo da ti pomognemo u tim konkretnim momentima.` |
| Primary button | `Nastavi` |

### Key → label (the `TRIGGERS` array, in code order)

| key | label | icon colour |
|---|---|---|
| `kafa` | `Jutarnja kafa` | `#BA7517` |
| `jelo` | `Posle jela` | `#3A7A3A` |
| `alkohol` | `Kafana i alkohol` | `#6B52A8` |
| `stres` | `Stres na poslu` | `#4A6080` |
| `kolege` | `Pauza sa kolegama` | `#D4547E` |
| `komp` | `Sedenje za kompom` | `#2E8B80` |
| `dosada` | `Čekanje i dosada` | `#999999` |

### Structure & interaction

- Multi-select, 2-column grid. The **last** item (`dosada`) spans full width
  (`full={i === TRIGGERS.length - 1}` → `gridColumn: '1 / -1'`). Label font here is 13px, one step
  down from Reasons/Fears (14px), to fit the longer labels.
- **No maximum.** Min 1 (`ready = sel.length >= 1`). No auto-advance.
- Profile field: `triggers` (string[]).

### Conditional logic / TODOs

- **Key mismatches vs the copy brief's data model:** code `jelo` / `alkohol` vs brief `posle_jela` /
  `kafana`. Note the brief reuses `kafana` for both a *fear* and a *trigger*; the code deliberately
  calls the trigger `alkohol`. Pick one naming scheme.
- Brief subtitle differs: `Koristićemo ovo da ti pomognemo baš u tim trenucima.` vs shipped
  `Koristićemo ovo da ti pomognemo u tim konkretnim momentima.` **Pavle to pick.**

---

# 13. `OnboardingTiming.jsx`

**Component:** `OnboardingTiming` · White screen · Progress `11 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Kada hoćeš da prestaneš?` |
| Subtitle (15px/400) | `Nema pogrešnog odgovora.` |
| — | *No button on this screen.* |

### Key → label (the `OPTIONS` array)

| key | title | subtitle | icon colour |
|---|---|---|---|
| `odmah` | `Odmah` | `Počinjemo danas` | `#E8621A` |
| `uskoro` | `Uskoro` | `Izaberi datum` | `#4A6080` |
| `vec` | `Već sam prestao/la` **NEEDS-REWRITE** (`prestao/la`) | `Nastavljam streak` | `#3A7A3A` |

### Structure & interaction

- Single-select, 3 stacked full-width cards (white icon chip + title + subtitle + chevron).
  Selected = ember fill, white text, chip stays white with the icon turning ember.
- **Auto-advances.** `choose(key)` sets the selection then `setTimeout(() => onNext(key), 300)` —
  a 300 ms delay so the selected state is visible. There is no continue button at all.
- Profile field: `timing`.

### Conditional logic / TODOs

- **Key mismatch:** code `vec`; brief `vec_prestao`.
- **`Nastavljam streak` is an English loanword in otherwise-Serbian copy.** The brief's version of
  this subtitle is `Nastavljam niz`. **Two competing strings — Pavle to pick.** (Flagging, not
  fixing; "streak" also appears in `OnboardingNotifications`.)
- **Downstream branch (brief §4 screen 14 and §7.6):** if `vec_prestao` is chosen, later copy shifts
  to present-progress / past tense — specifically the Cost AHA lead line. The brief notes
  Preview/Summary future framing stays valid unchanged, and Reflection/FearReflection are unaffected.
- The `uskoro` subtitle `Izaberi datum` implies the Date screen is conditional on this branch, but
  the shipped flow shows Date unconditionally after Timing. Product decision, not a copy gap.

---

# 14. `OnboardingDate.jsx`

**Component:** `OnboardingDate` · White screen · Progress `12 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading | `Koji datum si izabrao/la?` **NEEDS-REWRITE** (`izabrao/la`) |
| Subtitle (15px/400) | `Možeš ga promeniti kasnije.` |
| Month header | `{MONTHS[m]} {year}` → e.g. `Jun 2026` *(prototype sample data)* |
| Footnote line 1 (13px, `#BBB`, centred) | `Istraživanja pokazuju da postavljanje konkretnog datuma povećava šanse uspeha.` followed by a superscript `1` |
| Footnote line 2 (italic) | `West & Sohal, BMJ 2006` (written in the JSX as `West &amp; Sohal, BMJ 2006`) |
| Primary button | `Potvrdi datum` |

### Month names (the `MONTHS` array, verbatim, index 0–11)

`Januar` · `Februar` · `Mart` · `April` · `Maj` · `Jun` · `Jul` · `Avgust` · `Septembar` ·
`Oktobar` · `Novembar` · `Decembar`

### Day-of-week headers (the `DOW` array, verbatim, Monday-first)

`Pon` · `Uto` · `Sre` · `Čet` · `Pet` · `Sub` · `Ned`

### Structure & interaction

- Custom in-app month calendar (not a native date picker): month title with prev/next arrows, a
  Monday-first 7-column day grid, selected day = ember filled circle with white bold digit, today =
  inset hairline ring, past days = `#CCCCCC` and `disabled`.
- **Hardcoded prototype dates:** `TODAY = new Date(2026, 4, 31)` (31 May 2026); initial view
  `{ y: 2026, m: 5 }` (June 2026); initial selection `new Date(2026, 5, 15)` (15 June 2026).
  All three must become "real today" in the app.
- Min bound: the back arrow disables (`atMin`) once the view reaches the current month; no forward
  bound. Past days within the current month are not selectable.
- `Potvrdi datum` is always enabled and calls `onNext(sel)` with the chosen `Date`.
- Profile field: `quitDate`.

### Conditional logic / TODOs

- Brief's footnote is shorter: `Postavljanje konkretnog datuma povećava šanse za uspeh.¹` The
  shipped one adds `Istraživanja pokazuju da` and reads `šanse uspeha` rather than `šanse za uspeh`.
  **Two competing strings — Pavle to pick.** The citation line `West & Sohal, BMJ 2006` exists only
  in the JSX.
- `izabrao/la` needs the token pair the brief calls for: *"add `izabrao/izabrala`"* — still owed an
  `x` rewrite.

---

# 15. `OnboardingPreview.jsx` — 3-month projection `[DARK]`

**Component:** `OnboardingPreview` · Full ember background, 3 white benefit cards + testimonial card ·
Progress `13 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading (26px/600, white) | `Za 3 meseca, ovo te čeka.` |
| Subtitle (15px/400, white 85%) | `Na osnovu tvojih podataka.` |
| Primary button (white bg, ember text) | `Jedva čekam` |

### Benefit cards (the `BENEFITS` array)

| # | title | subtitle | colour |
|---|---|---|---|
| 1 | `146.000 RSD` *(prototype sample data)* | `uštedeno za godinu dana` | green `#3A7A3A` |
| 2 | `Plućna funkcija +30%` | `u prvih 90 dana bez cigarete` | teal `#2E8B80` |
| 3 | `Slobodan/na od nikotina` **NEEDS-REWRITE** (`Slobodan/na`) | `mozak se vraća u prirodno stanje` | purple `#6B52A8` |

### Testimonial card

| Slot | String |
|---|---|
| Avatar initial | `M` |
| Name + age | `Marija, 34` |
| Quote (14px, italic, `#555`) | `„Nisam verovala da mogu. Ali posle prvog meseca, cigareta mi više nije ni na umu. Iskra me drži.”` — opening `„` U+201E, closing `”` U+201D, exactly as in the file |
| Caption (11px, `#BBB`) | `Verified Iskra korisnik` |
| — | 5 ember stars (all filled) and an ember verified tick, both icon-only, no text |

### Structure & interaction

- Scrollable. No input, no auto-advance, no validation.
- Per brief §7.1, this screen is explicitly **not a mirror**: the three cards are a fixed
  money / health / freedom projection shown to everyone, and must **not** be gated on `reasons`.
  The brief says so in the file so nobody "fixes" it later.

### Conditional logic / TODOs

- Card 1's number is computed (`annualCost`); brief §3c adds a sub-equivalent line
  (`[costEquivalent]`) that the shipped card does not have.
- Card 2 hardcodes `bez cigarete` — brief §3c parameterises it as `u prvih 90 dana bez [productNoun]`.
  Breaks for IQOS users (§7.7).
- Card 3's `Slobodan/na` is the brief's `[g:slobodan]` token; slash form needs a rewrite.
- `Verified Iskra korisnik` mixes English `Verified` into Serbian copy, and `korisnik` is the
  masculine noun form shown under a female testimonial (`Marija`). Flagged; I am not rewording it.
  The brief only says "Testimonial (static): Marija, 34, verified ✓, 5 stars. (Keep a real-sounding,
  non-medical quote.)" — it does not supply the caption string.
- The quote is a marketing testimonial attributed to a named person. If Marija is not a real,
  consenting user, this needs product/legal sign-off before ship, independent of the copy question.

---

# 16. `OnboardingPanic.jsx`

**Component:** `OnboardingPanic` · White screen · Progress `14 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Eyebrow (11px/700, ember, 2px tracking) | `PROBA` |
| Heading (26px/600) | `Hajde da vežbamo jedan trenutak.` |
| Body (15px/400, `#888`) | `Zatvori oči. Zamisli da ti se sada puši. Oseti taj osećaj. Kad budeš spreman/na — pritisni.` **NEEDS-REWRITE** (`spreman/na`); em dash before `pritisni` |
| Button label (16px/500, ember, **below** the circle — not inside it) | `Imam poriv` |
| Footer note (13px, `#BBB`, centred) | `Svaki poriv traje 3 do 5 minuta. Iskra će te provesti kroz njega.` |

### Structure & interaction

- Teaches the core feature by doing it. A 160px circular ember button with a white lightning glyph,
  two expanding pulse rings (`iskraPulse`, 2.4s, second delayed 1.2s) and a 188px dashed ring; the
  button itself breathes (`iskraBreathe`, 3.4s) unless pressed.
- **The big circle is the only way forward** — `onClick={onNext}`. There is no `Nastavi` button.
- No input, no validation.
- `Imam poriv` is a *label under* the button, not text inside it. This matters for the project rule
  about ember and the razlozi glyph: the glyph inside the circle is white-on-ember and unlabelled;
  the ember text sits on paper below.

### Conditional logic / TODOs

- Brief's body is one sentence shorter: `Zatvori oči. Zamisli da ti se sada puši. Kad budeš
  [g:spreman] — pritisni.` The shipped version inserts `Oseti taj osećaj.` **Pavle to pick.**
- Brief's footer: `Svaki poriv traje 3 do 5 minuta. Iskra te provede kroz njega.` vs shipped
  `Iskra će te provesti kroz njega.` **Pavle to pick.**

---

# 17. `OnboardingCommitment.jsx` — contract `[DARK]`

**Component:** `OnboardingCommitment` · Full ember background · **No progress bar** (deliberate —
the ceremony is outside the counter)

### Copy (verbatim)

| Slot | String |
|---|---|
| Wordmark (14px/700, 3px tracking) | `ISKRA` |
| Heading (30px/600, white) | `Pavle, sklapamo dogovor.` — `Pavle` is *(prototype sample data)*, must be `[name]` |
| Section label (16px/500, white) | `Od danas, obavezujem se da:` |
| Belief line (15px, italic, white 80%) | `I verujem da će me Iskra voditi svakog koraka.` |
| Signature-pad empty-state hint (14px, italic, white 40%) | `Potpiši se ovde` |
| Fine print under the pad (12px, white 60%, centred) | `* Potpis se ne čuva. Samo za tebe.` |
| Primary button (white bg, ember text) | `Potpisujem` |

### Pledges (the `PLEDGES` array, verbatim, in code order)

These read as a continuation of `Od danas, obavezujem se da:` —

| # | pledge |
|---|---|
| 1 | `Prestane da pušim, dan po dan` |
| 2 | `Otvori Iskru kad bude teško` |
| 3 | `Ne odustajem posle pada` |
| 4 | `Biram zdravlje, porodicu i slobodu` |

**Flagged, not fixed:** pledges 1 and 2 are in a different verb form (`Prestane`, `Otvori`) from
pledges 3 and 4 (`Ne odustajem`, `Biram`), so the four do not agree grammatically with each other
after `obavezujem se da:`. This is a Serbian copy question for Pavle, and I have transcribed all
four exactly as written rather than harmonising them.

### Structure & interaction

- Scrollable ceremony screen. Each pledge has a white-circle + ember-tick checkmark (decorative —
  they are **not** interactive checkboxes; there is no state, all four are always ticked).
- **Signature canvas** (`<canvas width=300 height=160>`, rendered full-width in a translucent white
  box). Draws with a 2.5px white round stroke; supports mouse and touch.
  - `signed` initialises to **`true`** and a **sample cursive signature is pre-drawn** by
    `drawSample()` so the box looks already signed in the prototype.
  - Drawing a new stroke first clears the sample.
  - A small `×` button top-right clears the pad and sets `signed = false`, which reveals the
    `Potpiši se ovde` hint.
- Validation: `Potpisujem` is disabled (55% opacity) while `signed === false`.

### Conditional logic / TODOs

- The pre-filled signature is explicitly a prototype convenience
  (`// Pre-draw a sample cursive signature so the box looks already signed.`). The real app should
  start **unsigned**, so `Potpiši se ovde` is the first thing the user sees.
- Brief §4 screen 18 proposes a **different, gendered set of four pledges**, none of which is in the
  shipped array — verbatim: `Biću [g:strpljiv] prema sebi.` / `Neću se [g:predao] posle jednog
  teškog dana.` / `Vraćaću se svojim razlozima.` / `Dajem sebi pravo na novi početak.`
  with new tokens owed: `strpljiv/strpljiva`, `predao/predala`. **Two competing pledge sets —
  Pavle to pick.**
- Brief also describes an **optional separate commitment-level screen** that the export does not
  contain: Q `Koliko si [g:posvećen] ovoj promeni?` with 4 auto-advancing options
  `potpuno` / `veoma` / `donekle` / `nesiguran`, each needing *"a one-line subtitle each"*.
  **Those four subtitles do not exist anywhere — missing copy, owed by Pavle**, and the four option
  labels themselves are only given as lowercase enum values, not as display strings.

---

# 18. `OnboardingSummary.jsx` — plan recap `[DARK]`

**Component:** `OnboardingSummary` · Full ember background, scrollable white cards ·
Progress `16 / 18`

### Copy (verbatim)

| Slot | String |
|---|---|
| Eyebrow (11px/700, white 85%, 2px tracking) | `TVOJ PLAN` |
| Heading (28px/600, white) | `Pavle, spreman/na si.` **NEEDS-REWRITE** (`spreman/na`); `Pavle` *(prototype sample data)* |
| Subtitle (15px/400, white 85%) | `Na osnovu svega što si nam rekao/la, ovo je tvoje putovanje.` **NEEDS-REWRITE** (`rekao/la`) |
| Savings card title (14px/500) | `Uštedine tokom godine` |
| Savings card figure (18px/600, green) | `146.000 RSD` *(prototype sample data)* |
| Savings chart end-tooltip (10.5px/700, ember pill) | `146.000 RSD` *(prototype sample data)* |
| Savings card footnote (12px, `#BBB`) | `= 10 dana odmora na moru` *(prototype sample data)* |
| Milestones card title | `Šta te čeka` |
| Reasons card title | `Tvoji razlozi` |
| Closing line (16px/500, white, centred) | `Iskra je tu svaki put kad bude teško.` |
| Primary button (white bg, ember text) | `Počinjemo` |
| Fine print under the button (11.5px, white 70%) | `Možeš promeniti sve podatke u podešavanjima.` |

### Chart month labels (the `months` array in `SavingsChart`, verbatim)

`Jan` · `Feb` · `Mar` · `Apr` · `Maj` · `Jun` · `Jul` · `Avg` · `Sep` · `Okt` · `Nov` · `Dec`

### 2×2 stat grid (the `STATS` array — values are *(prototype sample data)*, labels are copy)

| value (sample) | label | colour |
|---|---|---|
| `31. maj` | `Datum prestanka` | ember `#E8621A` |
| `20` | `Cigareta dnevno` | `#4A6080` |
| `400 RSD` | `Cena kutije` | `#3A7A3A` |
| `7.300` | `Cigareta godišnje` | ember `#E8621A` |

Note the `.` thousands separator in `7.300` and `146.000`, per the brief's formatting rule.

### Health timeline (the `MILESTONES` array — static, same for every user)

| time label | text | dot colour |
|---|---|---|
| `20 min` | `Krvni pritisak se normalizuje` | `#3A7A3A` |
| `8 sati` | `Kiseonik u krvi se vraća` | `#3A7A3A` |
| `48 sati` | `Ukus i miris se vraćaju` | `#2E8B80` |
| `1 nedelja` | `Disanje postaje lakše` | `#2E8B80` |
| `1 mesec` | `Pluća rade bolje` | `#6B52A8` |
| `1 godina` | `Rizik od srčanog prepolovljen` | ember `#E8621A` |

**Flagged:** `Rizik od srčanog prepolovljen` reads as an incomplete noun phrase (`srčanog` with no
noun — presumably `srčanog udara`). Transcribed exactly as written. Pavle to confirm whether the
noun is missing.

### Reasons block (the `REASONS` array — **static in the export, NOT yet mirrored**)

| label | icon colour |
|---|---|
| `Zdravlje` | `#D4547E` |
| `Porodica` | `#4A6080` |
| `Sloboda` | `#6B52A8` |

### Structure & interaction

- Long scrollable recap: header → savings area chart card → 2×2 stat grid → health timeline card →
  reasons card → closing line → CTA + fine print.
- The savings chart is a synthetic smooth curve (a linear ramp through 12 months, bezier-smoothed) —
  it is **not** plotted from real data in the export.
- No input, no validation, no auto-advance.

### Conditional logic / TODOs

- The `Tvoji razlozi` block must become a mirror of the user's chosen reasons, under the same §7.2
  selection-order rule and the same `listLabel` table as `OnboardingReflection` (brief §7.1).
- Every number on this screen is sample data and must come from `profile`.
- Brief §4 screen 19 matches the shipped copy on eyebrow, closing line, CTA and fine print. Its
  header/subtitle are the same sentences in token form: `[name], [g:spreman] si.` and
  `Na osnovu svega što si nam [g:rekao], ovo je tvoje putovanje.` So here the brief and the code
  agree — only the slash forms need replacing.

---

# 19. `OnboardingNotifications.jsx`

**Component:** `OnboardingNotifications` · White screen · Progress `17 / 18` ·
Callbacks are `onNext` / `onSkip` (not `onBack`) — this screen has **no back arrow**

### Copy (verbatim)

| Slot | String |
|---|---|
| Heading (26px/600, centred) | `Iskra je najkorisnija kad si tu.` |
| Subtitle (15px/400, `#888`, centred) | `Šaljemo ti samo ono što je važno — nikad spam.` (em dash) |
| Primary button | `Dozvoli obaveštenja` |
| Secondary text button (13px/500, `#999`) | `Možda kasnije` |

### Sample notification cards (the `NOTIFS` array)

| # | title | body |
|---|---|---|
| 1 | `Dan 8 — streak ide dalje` (em dash) | `Već 8 dana bez cigarete. Pluća ti se zahvaljuju.` |
| 2 | `Za 2 sata: novi milestone` | `Cirkulacija se poboljšava. Oseti razliku.` |
| 3 | `Vuče te? Otvori Iskru.` | `Poriv prolazi za 5 minuta. Klikni i prođi kroz njega.` |

### Structure & interaction

- Permission ask. Ember bell in a 100px tint circle, heading, subtitle, then three mock notification
  cards (ember flame chip + title + body) as a preview of what will be sent.
- Two actions: primary `Dozvoli obaveštenja` (→ `onNext`, triggers the OS permission prompt) and a
  plain-text `Možda kasnije` (→ `onSkip`). No validation.

### Conditional logic / TODOs

- These three notification strings are sample content — they are shown as examples in the UI, but the
  real notification catalogue is a separate copy deliverable that does not exist yet.
- Two English loanwords in shipped Serbian copy: **`streak`** (card 1) and **`milestone`** (card 2).
  Flagged for Pavle, not reworded. (`milestone` also appears as a screen name `Milestoni` elsewhere
  in the app, so it may be an accepted term.)
- Brief's subtitle drops the `ti`: `Šaljemo samo ono što je važno — nikad spam.` vs shipped
  `Šaljemo ti samo ono što je važno — nikad spam.` **Pavle to pick.**
- Card 1 hardcodes `bez cigarete` — breaks for IQOS users.

---

# 20. `OnboardingInsight.jsx` — **not in the current flow**

**Component:** `OnboardingInsight` · Warm interstitial background `#FEF6F0` · Progress `3 / 11`

`HANDOFF.md` flags this one explicitly: *"an earlier standalone insight interstitial … Kept for
reference; not in the current linear flow."* Its own header comment says *"step 3/11"*, from the
older 11-step numbering. Transcribed in full because the copy may be wanted elsewhere.

### Copy (verbatim)

| Slot | String |
|---|---|
| Eyebrow (11px/700, ember, 2px tracking) | `ZNAJ OVO` |
| Heading (32px/600, centred) | `Svaka osoba koja je prestala je jednom počela.` |
| Body (16px/400, `#888`, centred) | `Nije važno koliko si puta pokušao/la. Važno je da si ovde.` **NEEDS-REWRITE** (`pokušao/la`) |
| Fine print line 1 (12px, `#BBB`, centred) | `Istraživanja pokazuju da prosečna osoba pokuša 8–10 puta pre nego što trajno prestane.` followed by a superscript `1` (en dash in `8–10`) |
| Fine print line 2 (italic) | `Hughes et al., Tobacco Control Journal` |
| Primary button | `Razumem` |

### Structure & interaction

- Pure interstitial: eyebrow, centred statement, supporting line, citation, single CTA. No input, no
  validation, no auto-advance. Back arrow present.

### Conditional logic / TODOs

- Not wired into `STEPS`. If it is revived, its `3 / 11` progress fraction is from the abandoned
  numbering and will need renumbering.
- The citation has no year or volume, unlike the Date screen's `West & Sohal, BMJ 2006`.

---

# 21. Adjacent flow screens (not `Onboarding*.jsx`, transcribed for completeness)

These two are part of the onboarding flow per `CLAUDE.md`'s `STEPS` array and the copy brief
(items 1 and 21), but they do not match the `Onboarding*.jsx` filename pattern, so they were outside
the strict brief. Included because leaving the first and last screens of the flow undocumented would
make this reference unusable on its own. `Paywall.jsx` is explicitly out of scope per brief §4
item 22 (*"separate brief … Out of scope here"*) and is **not** transcribed.

## 21a. `SplashScreen.jsx` — **flagged as a concept sketch**

`HANDOFF.md`: *"(Concept-level polish — flagged rough.)"* · `README.md`: *"The Welcome/Splash screen
… copy/layout still in flux."*

| Slot | String |
|---|---|
| Wordmark (30px/500, 4px tracking) | `ISKRA` |
| Tagline line 1 (22px/600, centred) | `Znaš da treba.` |
| Tagline line 2 (same block, after a `<br />`) | `Iskra ti pomaže da konačno i hoćeš.` |
| Primary button | `Počni` |
| Secondary text button (14.5px/500, `#999`) | `Već imam nalog` |

Structure: wordmark + 30×2px ember rule in the top third, centred two-line tagline, two actions at
the bottom. `onStart` / `onLogin`. No progress bar, no input.

Brief §4 screen 1 gives the same tagline but in token form — `Iskra ti pomaže da i [g:hteo].` — with
the explicit `x` instruction: *"for `x`, rephrase to '…da to i ostvariš.' (avoids the slash)"*. The
shipped line `Iskra ti pomaže da konačno i hoćeš.` is already gender-free and needs no rewrite.

## 21b. `ReviewModal.jsx`

| Slot | String |
|---|---|
| Heading (21px/600, centred) | `Uživaš u aplikaciji Iskra?` |
| Body (14.5px/400, `#888`) | `Tvoja ocena pomaže drugima u Srbiji da krenu istim putem.` |
| Primary button | `Oceni Iskru` |
| Secondary text button (13.5px/500) | `Ne sada` |

Structure: iOS-style centred modal card over a warm backdrop. Ember app glyph, heading, body, a row
of 5 tappable stars (`rating` defaults to **5**, all pre-filled ember), then the two actions.
**Both buttons call `onNext`** — the prototype does not branch on the rating. No progress bar.

---

# 22. Gender token system (from `ONBOARDING_COPY_BRIEF.md` §2, transcribed in full)

## How `g(token)` is meant to work

Verbatim from the brief:

> Serbian past-tense verbs (l-participle) and many adjectives inflect by the **subject's** gender.
> The user is the subject throughout onboarding, so every such word needs an `m`/`f` form. For `x`
> (unspecified) we **rephrase to avoid the gendered word** wherever possible; only fall back to the
> slash form (`prestao/la`) when a rewrite would be clumsy.
>
> **Implement as a helper**, e.g. `g('prestao')` → returns the right form for `profile.gender`.

Rules, verbatim:

> - Prefer **gender-free phrasing** when it's natural and just as warm — it's better than slashes.
>   e.g. instead of "Spreman/na si." → "Vreme je." or "Tu si." Use the table when the gendered word
>   genuinely carries the warmth.
> - `name` is shown verbatim; never inflect it.
> - A `[g:token]` placeholder convention in the copy below = "insert the gender-correct form."
>   A `[var]` placeholder = insert profile data.
> - **QA pass:** every screen must be read end-to-end in all three of `m` / `f` / `x` before
>   sign-off. List below flags screens with the most gendered surface area: Cost, Reflection,
>   FearReflection, Summary, Commitment.

`gender` is `m` / `f` / `x` (unspecified) in the brief's data model. **The shipped
`OnboardingGender.jsx` stores `'male'` / `'female'` / `'na'` instead** — reconcile before wiring
`g()`.

## The token table (brief §2, verbatim, all 17 rows)

Every `x` column in this table is a slash form, so **every single token below is flagged: Pavle owes
a real rewrite for all 17**, per the brief's own rule that slashes are a last resort and the app's
rule that slashes are forbidden.

| # | Token (meaning) | `m` | `f` | `x` fallback (as written in the brief) | `x` is a slash? |
|---|---|---|---|---|---|
| 1 | quit (did) | `prestao` | `prestala` | `prestao/la` | **YES — needs rewrite** |
| 2 | smoked | `pušio` | `pušila` | `pušio/la` | **YES — needs rewrite** |
| 3 | started | `počeo` | `počela` | `počeo/la` | **YES — needs rewrite** |
| 4 | ready (adj) | `spreman` | `spremna` | `spreman/na` | **YES — needs rewrite** |
| 5 | sure (adj) | `siguran` | `sigurna` | `siguran/na` | **YES — needs rewrite** |
| 6 | free (adj) | `slobodan` | `slobodna` | `slobodan/na` | **YES — needs rewrite** |
| 7 | committed (adj) | `posvećen` | `posvećena` | `posvećen/na` | **YES — needs rewrite** |
| 8 | endured | `izdržao` | `izdržala` | `izdržao/la` | **YES — needs rewrite** |
| 9 | lit up (relapsed) | `zapalio` | `zapalila` | `zapalio/la` | **YES — needs rewrite** |
| 10 | resisted | `odoleo` | `odolela` | `odoleo/la` | **YES — needs rewrite** |
| 11 | said/told | `rekao` | `rekla` | `rekao/la` | **YES — needs rewrite** |
| 12 | wanted | `hteo` | `htela` | `hteo/la` | **YES — needs rewrite** |
| 13 | could | `mogao` | `mogla` | `mogao/la` | **YES — needs rewrite** |
| 14 | finished | `završio` | `završila` | `završio/la` | **YES — needs rewrite** |
| 15 | got back (reclaimed) | `vratio` | `vratila` | `vratio/la` | **YES — needs rewrite** |
| 16 | survived/got through | `preživeo` | `preživela` | `preživeo/la` | **YES — needs rewrite** |
| 17 | alone/by myself | `sam` | `sama` | `sam(a)` | **YES — parenthesised, not a slash, but still not a rewrite** |

Row 17 is the one variation: the brief writes `sam(a)` with parentheses rather than a slash. It is
still a visible grammatical hedge rather than a real rewrite, so it is flagged the same way.

## Tokens the brief says are still owed (mentioned in footnotes, absent from the table)

These appear only as inline asterisked notes ("*add to token table*"). **None has an `x` form at
all** — Pavle owes `m`, `f` and a rewrite for each:

| Token | Where it is introduced | `m` / `f` as written in the brief |
|---|---|---|
| `mislio` | §3a `forma` card — *"add to token table if you keep this line"* | `mislio/mislila/mislio-la` (written as a single string, so the `f` form is `mislila`) |
| `iskren` | §4 screen 11 (Fears subtitle) | `iskren/iskrena` |
| `izabrao` | §4 screen 15 (Date heading) | `izabrao/izabrala` |
| `strpljiv` | §4 screen 18 (Commitment pledge 1) | `strpljiv/strpljiva` |
| `predao` | §4 screen 18 (Commitment pledge 2) | `predao/predala` |
| `trosio` | §7.6 (Cost AHA past tense for already-quit users) | `trosio/trosila` — note the brief writes these **without diacritics**; presumably `trošio` / `trošila`. **Transcribed as written; Pavle to confirm the spelling.** |
| `odlagao` | §6 band H alternative | `odlagao/odlagala` |

That is **17 table tokens + 7 footnote tokens = 24 tokens**, all of which need an `x` rewrite before
any of them can ship.

## Every slash form currently live in the shipped screens

The strings below are what a user would actually see today. Each must be replaced by a `g()` call or
a gender-free rewrite.

| Screen | String | Slash form |
|---|---|---|
| `OnboardingCigarettes` | `Koliko cigareta dnevno si pušio/la?` | `pušio/la` |
| `OnboardingFears` | `Budi iskren/a. Tu smo da pomognemo.` | `iskren/a` |
| `OnboardingFearReflection` | `Nisi sam/a u tome.` | `sam/a` |
| `OnboardingFearReflection` | `Spreman/na sam` (CTA) | `Spreman/na` |
| `OnboardingTriggers` | — | *(none)* |
| `OnboardingTiming` | `Već sam prestao/la` (option title) | `prestao/la` |
| `OnboardingDate` | `Koji datum si izabrao/la?` | `izabrao/la` |
| `OnboardingPreview` | `Slobodan/na od nikotina` | `Slobodan/na` |
| `OnboardingPanic` | `Kad budeš spreman/na — pritisni.` | `spreman/na` |
| `OnboardingSummary` | `Pavle, spreman/na si.` | `spreman/na` |
| `OnboardingSummary` | `Na osnovu svega što si nam rekao/la, ovo je tvoje putovanje.` | `rekao/la` |
| `OnboardingInsight` *(not in flow)* | `Nije važno koliko si puta pokušao/la. Važno je da si ovde.` | `pokušao/la` |

11 live slash strings across 8 in-flow screens, plus 1 in the out-of-flow Insight screen.

Note that `README.md` of the export states the opposite convention as a content rule:
*"Gendered forms are written inclusively with a slash: 'Slobodan/na', 'prestao/la', 'Spreman/na si.'"*
That is the **design export's** rule and is superseded by this app's rule (no slashes). Recorded here
so the contradiction is visible rather than silently resolved.

---

# 23. Progress-bar fractions as shipped (all four denominators)

`CLAUDE.md` notes these are *"not yet normalized"*. The brief §4 recommends picking one denominator —
*"recommend /16, counting question + reflection steps; exclude Splash/Review/Paywall"*.

| Screen | Fraction in code |
|---|---|
| `OnboardingName` | `2 / 11` |
| `OnboardingInsight` *(not in flow)* | `3 / 11` |
| `OnboardingCigarettes` | `3 / 17` |
| `OnboardingGender` | `3 / 18` |
| `OnboardingProduct` | `4 / 18` |
| `OnboardingPrice` | `5 / 18` |
| `OnboardingCost` | `6 / 18` |
| `OnboardingReasons` | `7 / 18` |
| `OnboardingReasonText` | `8 / 19` |
| `OnboardingReflection` | `8 / 18` |
| `OnboardingFears` | `9 / 18` |
| `OnboardingFearReflection` | `10 / 18` |
| `OnboardingTriggers` | `10 / 18` |
| `OnboardingTiming` | `11 / 18` |
| `OnboardingDate` | `12 / 18` |
| `OnboardingPreview` | `13 / 18` |
| `OnboardingPanic` | `14 / 18` |
| `OnboardingCommitment` | *(no progress bar — deliberate)* |
| `OnboardingSummary` | `16 / 18` |
| `OnboardingNotifications` | `17 / 18` |
| `SplashScreen` / `ReviewModal` | *(no progress bar)* |

Collisions: `8/…` is used by both ReasonText and Reflection (different denominators), and `10/18` by
both FearReflection and Triggers. `15/18` is skipped entirely (Commitment has no bar). No screen ever
shows `18/18`.

No progress bar in the export carries a **text** label ("Korak 3 od 18" or similar) — the fractions
exist only as a filled-width percentage. If a text progress label is wanted, it is new Serbian copy
and it must go through `plural()`.

---

# 24. Open copy questions for Pavle

Consolidated. Nothing in this list has been resolved or guessed.

## A. Missing copy — does not exist anywhere

1. **Commitment-level screen:** the four option subtitles for
   `Koliko si [g:posvećen] ovoj promeni?` (`potpuno` / `veoma` / `donekle` / `nesiguran`). The brief
   asks for *"a one-line subtitle each"* and supplies none. The four option **labels** are also only
   given as lowercase enum values, never as display strings.
2. **Reasons max-3 feedback:** no message exists for the silently-ignored 4th tap.
3. **Text progress label:** none exists, if one is wanted.
4. **`reasonText` empty-state fallback:** the brief §7.5 specifies the shape
   (`Tvoji razlozi: [header-join].`) but the shipped screen makes the field required, so it is
   unclear whether this string is needed at all.
5. **`costEquivalent` band table:** fully written in brief §6 (8 bands, headline + 2 alternatives
   each, plus a very-low-spend edge line `= mali korak koji se brzo skuplja.`). Not duplicated here —
   read §6 of the brief directly when implementing, so there is one copy of those strings.

## B. Two competing approved versions — pick one

| Screen | Shipped in JSX | In the copy brief |
|---|---|---|
| Gender subtitle | `Personalizujemo tvoj zdravstveni napredak na osnovu ovoga.` | `Da bismo ti se obraćali kako treba i prilagodili zdravstveni napredak.` |
| Cigarettes note | `Prosek u Srbiji je oko 15 cigareta dnevno.` | `Prosek u Srbiji je oko 15 dnevno.` |
| Reasons subtitle | `Izaberi do 3 razloga. Koristićemo ih tokom tvog putovanja.` | `Izaberi do 3 razloga. Vraćaćemo ti ih kad bude teško.` |
| Reasons `pritisak` label | `Pritisak doktora ili partnera` | `Pritisak okoline` |
| Reflection — whole screen | static header `Znamo da prestanak nije lako.` + `Ali tvoji razlozi su jači od navike.` + CTA `Razumem`, 3 fixed cards | eyebrow `ČUJEMO TE` + reasons list header + `To su tvoji razlozi. Iskra će ti ih uvek vraćati.` + CTA `Tačno tako`, 6 per-reason cards |
| Reflection `Zdravlje` body | `Već 20 minuta nakon poslednje cigarete, krvni pritisak počinje da se normalizuje.` | `Već 20 minuta nakon poslednje cigarete krvni pritisak počinje da se vraća u normalu.` |
| Reflection `Zdravlje` takeaway | `Tvoje telo je već spremno da počne.` | `Tvoje telo počinje da se oporavlja odmah.` |
| Reflection `Porodica` body | `Pasivno pušenje utiče na ljude oko tebe — posebno decu.` | `Pasivni dim utiče na sve oko tebe — najviše na decu.` |
| Reflection `Porodica` takeaway | `Oni su tvoj razlog broj jedan.` | `Oni su razlog koji se ne dovodi u pitanje.` |
| Reflection `Sloboda` body | `Nikotin stvara iluziju opuštanja. Bez njega, stres se zapravo lakše podnosi.` | `Nikotin stvara iluziju kontrole. Bez njega, ti odlučuješ.` |
| Reflection `Sloboda` takeaway | `Sloboda počinje prvim danom.` | `Sloboda počinje prvog dana.` |
| FearReflection `porivi` body | `Svaki poriv traje između 3 i 5 minuta. Posle toga prolazi sam — uvek.` | `Svaki poriv traje između 3 i 5 minuta, pa prolazi sam — uvek.` |
| FearReflection `porivi` takeaway | `Iskra ima alat tačno za taj trenutak.` | `Iskra ima alat za tačno taj trenutak.` |
| FearReflection `stres` body | `Nikotin ne smanjuje stres — samo privremeno gasi apstinencijalni sindrom koji je on sam izazvao.` | `Nikotin ne smanjuje stres — samo nakratko gasi apstinenciju koju je sam izazvao.` |
| FearReflection `stres` takeaway | `Pravi oprez dolazi posle 3 nedelje.` | `Pravo olakšanje dolazi posle 3 nedelje.` |
| FearReflection `kafana` body | `Društveni pritisak je jedan od glavnih razloga pada. Imaćeš skriptu za svaki takav trenutak.` | `Društvene situacije su čest okidač. Imaćeš plan za svaku od njih.` |
| Triggers subtitle | `Koristićemo ovo da ti pomognemo u tim konkretnim momentima.` | `Koristićemo ovo da ti pomognemo baš u tim trenucima.` |
| Timing `vec` subtitle | `Nastavljam streak` | `Nastavljam niz` |
| Date footnote | `Istraživanja pokazuju da postavljanje konkretnog datuma povećava šanse uspeha.` | `Postavljanje konkretnog datuma povećava šanse za uspeh.` |
| Panic body | `Zatvori oči. Zamisli da ti se sada puši. Oseti taj osećaj. Kad budeš spreman/na — pritisni.` | `Zatvori oči. Zamisli da ti se sada puši. Kad budeš [g:spreman] — pritisni.` |
| Panic footer | `Svaki poriv traje 3 do 5 minuta. Iskra će te provesti kroz njega.` | `Svaki poriv traje 3 do 5 minuta. Iskra te provede kroz njega.` |
| Commitment pledges | `Prestane da pušim, dan po dan` / `Otvori Iskru kad bude teško` / `Ne odustajem posle pada` / `Biram zdravlje, porodicu i slobodu` | `Biću [g:strpljiv] prema sebi.` / `Neću se [g:predao] posle jednog teškog dana.` / `Vraćaću se svojim razlozima.` / `Dajem sebi pravo na novi početak.` |
| Notifications subtitle | `Šaljemo ti samo ono što je važno — nikad spam.` | `Šaljemo samo ono što je važno — nikad spam.` |

## C. Strings flagged for a language question (transcribed, not touched)

1. `Commitment` pledges 1–2 (`Prestane`, `Otvori`) do not agree grammatically with pledges 3–4
   (`Ne odustajem`, `Biram`) after `Od danas, obavezujem se da:`.
2. `Summary` milestone `Rizik od srčanog prepolovljen` appears to be missing a noun after `srčanog`.
3. English loanwords inside Serbian copy: `Nastavljam streak` (Timing), `Dan 8 — streak ide dalje`
   and `Za 2 sata: novi milestone` (Notifications), `Verified Iskra korisnik` (Preview).
4. `Verified Iskra korisnik` uses the masculine `korisnik` under a female testimonial (`Marija, 34`).
5. Closing quote mark in the Preview testimonial is `”` (U+201D) where Serbian typography would pair
   `„` with `“` (U+201C).
6. Brief token `trosio/trosila` is written without diacritics; presumably `trošio` / `trošila`.

## D. Non-copy items surfaced while transcribing

1. Key mismatches between code and the brief's data model: `male/female/na` vs `m/f/x`;
   `razdraz` vs `razdrazljivost`; `jelo`/`alkohol` vs `posle_jela`/`kafana`; `vec` vs `vec_prestao`.
2. Three reflection surfaces are hardcoded and must become mirrors: `OnboardingReflection` cards,
   `OnboardingFearReflection` cards, `OnboardingSummary` reasons block.
3. `product = iqos` noun leaks in shipped copy: Cigarettes heading and note, Cost lead,
   Preview card 2, Summary stat labels (`Cigareta dnevno`, `Cigareta godišnje`), Notifications card 1.
4. Prototype sample data to replace with profile values: `Pavle`, `146.000`, `RSD`,
   `= 10 dana odmora na moru`, `31. maj`, `20`, `400 RSD`, `7.300`, the June-2026 calendar dates, and
   the pre-drawn signature.
5. `OnboardingReasonText` makes `reasonText` required; brief §7.5 says it is optional.
6. Progress fractions need normalising to one denominator (see §23).
7. Every count that reaches a Serbian string (`8 dana`, `2 sata`, `3 razloga`, `5 minuta`,
   `10 dana`, `3 nedelje`, `2 nedelje`) must go through `plural()` per the project rules — none of
   the export's counts do, because they are all hardcoded.
