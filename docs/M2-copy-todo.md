# M2 copy: what Pavle owes before onboarding ships

Everything an agent may not write. The flow is built and runs; these are the strings it cannot
render, plus the decisions only you can make. Nothing here is a bug.

In the app, missing copy renders as `«TODO(copy): …»`. It is deliberately ugly, it can never be
mistaken for Serbian, and it never falls back to a slash or to the masculine form.

Source of truth for everything below: `ISKRA - mobile claude design export/ONBOARDING_COPY_BRIEF.md`,
which wins over the export's screen files wherever they disagree (your call, 21.09.2026).

---

## 1. Twenty-four genderless rewrites. The one blocker.

Serbian inflects for the subject, and the user is the subject of nearly every onboarding
sentence. `muško` and `žensko` read correctly today. `drugo` and unset cannot render at all,
because the brief offers only the slash form, which PRODUCT.md forbids, and masculine-by-default
is forbidden too.

The brief already says what to do ("rephrase to avoid the gendered word") and does it twice, so
those two lines are clean: "Iskra ti pomaže da to i ostvariš." and "Idemo dalje". The rest are
owed. Each needs one genderless rewrite of the phrase it appears in, not a dictionary form.

Write them in `src/features/onboarding/gender.ts`, in the `x` field of each token.

| Token | m | f | Where it shows |
|---|---|---|---|
| `prestao` | prestao | prestala | Timing option 3, FearReflection card `neuspeh` |
| `pusio` | pušio | pušila | Cigarettes question (step 4) |
| `poceo` | počeo | počela | Reflection card `pritisak` |
| `spreman` | spreman | spremna | Panic body, Summary heading, FearReflection CTA |
| `siguran` | siguran | sigurna | not yet on screen |
| `slobodan` | slobodan | slobodna | Preview card 3 |
| `posvecen` | posvećen | posvećena | only in the optional commitment-level screen, not built |
| `izdrzao` | izdržao | izdržala | not yet on screen |
| `zapalio` | zapalio | zapalila | M3, the slip link |
| `odoleo` | odoleo | odolela | not yet on screen |
| `rekao` | rekao | rekla | Summary subtitle |
| `hteo` | hteo | htela | Splash line 2 (an `x` rewrite already exists) |
| `mogao` | mogao | mogla | not yet on screen |
| `zavrsio` | završio | završila | not yet on screen |
| `vratio` | vratio | vratila | not yet on screen |
| `preziveo` | preživeo | preživela | not yet on screen |
| `sam` | sam | sama | FearReflection card `kafana` |
| `mislio` | mislio | mislila | Reflection card `forma` |
| `iskren` | iskren | iskrena | Fears subtitle |
| `izabrao` | izabrao | izabrala | Date question |
| `strpljiv` | strpljiv | strpljiva | Commitment pledge 1 |
| `predao` | predao | predala | Commitment pledge 2 |
| `trosio` | trosio | trosila | Cost lead, for someone who already quit |
| `odlagao` | odlagao | odlagala | cost equivalent, band H alternate (currently not offered) |

Two spelling checks while you are in there: the brief writes `trosio` / `trosila` without
diacritics (presumably `trošio` / `trošila`), and pledge 2 reads "Neću se [g:predao] posle jednog
teškog dana", which does not agree grammatically in any gender.

## 2. Ten trigger labels to confirm

One vocabulary now covers `cravings.trigger`, `slips.trigger` and `profiles.triggers[]`, so what
someone answers in onboarding and what they log during a craving can finally be compared. The
keys are fixed and enforced by the database. The labels are proposals from the M2 planning
session, not approved copy. They live in `TRIGGERS` in `src/features/onboarding/copy.ts`.

| Key | Proposed label |
|---|---|
| `kafa` | Uz kafu |
| `budjenje` | Posle buđenja |
| `posao` | Pauza na poslu |
| `kafana` | Kafana |
| `okolina` | Kad drugi puše |
| `alkohol` | Uz piće |
| `stres` | Stres |
| `jelo` | Posle jela |
| `dosada` | Dosada i čekanje |
| `drugo` | Nešto drugo |

`kafana` deliberately overlaps `okolina` and `alkohol`: someone sitting in a kafana should not
have to decide which one it was.

## 3. Decisions taken for you, worth a look

- **The processing beat** reuses the website quiz's own copy ("Analiziramo tvoje odgovore…" and
  its four bar labels) because the brief names `LoadingStage` as the precedent but supplies no
  strings. Confirm the quiz's words may speak for the app.
- **The commitment fine print is omitted.** The export says "* Potpis se ne čuva. Samo za tebe.",
  but the signature IS stored, in `profiles.signature_data` (PRODUCT.md). Shipping that line
  would be untrue. It needs a replacement that says what actually happens.
- **The testimonial is cut** from Preview: "Marija, 34, verified" is not a real user, and
  PRODUCT.md forbids invented proof.
- **Em dashes survive** in four approved strings ("Iskra ti vraća taj novac — dan po dan.",
  "Pasivni dim utiče na sve oko tebe — najviše na decu.", the `stres` and `kilaza` fear cards,
  "Šaljemo samo ono što je važno — nikad spam."). PRODUCT.md's copy rules ban em dashes. Either
  the rule has an exception for existing copy, or these five need rewriting. I did not paraphrase
  them.
- **"Rizik od srčanog prepolovljen"** (Summary, 1 godina) reads as an incomplete phrase,
  presumably "srčanog udara". Transcribed as written.
- **Notification samples** ("Dan 8 — streak ide dalje", "Za 2 sata: novi milestone") are shown as
  examples on the permission screen. They contain the English loanwords `streak` and `milestone`,
  and the rule that a push reads state before it speaks is still open (ROADMAP Part 4). The app
  sends nothing, so nothing is at risk yet.
- **IQOS, accusative.** The brief supplies "štapića" (genitive) and nothing else, so the two
  sentences needing the accusative render a marker for IQOS users. v1 is cigarettes, so no one
  hits this in practice. One word fixes it.

## 4. Copy that exists nowhere

- The optional **commitment-level screen** (potpuno / veoma / donekle / nesiguran) has no display
  labels and no subtitles. It is not built: M2 takes the boolean and the signature instead.
- No message for a **fourth reason tap** when three are already chosen. Today the fourth pill
  simply disables, which needs no words.

---

When a rewrite lands, delete its row here and the marker disappears by itself. The test in
`src/features/onboarding/__tests__/copy.test.ts` asserts the count of missing rewrites, so it
will tell you the number is wrong the moment you fix one.
