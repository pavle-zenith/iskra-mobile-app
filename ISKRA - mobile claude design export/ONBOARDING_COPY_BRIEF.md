# Iskra — Onboarding Copy Brief

A build-ready content spec for writing the real onboarding copy. Covers: the **data the funnel collects**, the **Serbian male/female gender system** (with a token table), the **conditional logic** for reflection screens, and a **screen-by-screen** copy brief where every reflection answer adapts to prior answers.

Audience voice: warm, calm, **never clinical, never preachy, never shaming**. Informal second person ("ti"). Sentence case. No emoji. Short sentences. We are a supportive friend who happens to know the science — not a doctor and not a coach who yells.

---

## 1. The data model (what onboarding collects)

Everything the reflection/AHA/summary screens personalize from. Store as a single `profile` object.

| Key | Type | Source screen | Values |
|---|---|---|---|
| `name` | string | Name | free text |
| `gender` | enum | Gender | `m` / `f` / `x` (unspecified) |
| `product` | enum | Product | `cigarete` / `iqos` |
| `cigsPerDay` | int | Cigarettes | default 20 |
| `cigsPerPack` | int | Cigarettes | default 20 |
| `packPrice` | number | Price | free input |
| `currency` | enum | Price | `RSD` / `EUR` (default RSD) |
| `reasons` | string[] (≤3) | Reasons | `zdravlje` `porodica` `pare` `forma` `sloboda` `pritisak` |
| `reasonText` | string | ReasonText | free text (the user's own words) |
| `fears` | string[] | Fears | `porivi` `stres` `kafana` `neuspeh` `razdrazljivost` `kilaza` |
| `triggers` | string[] | Triggers | `kafa` `posle_jela` `kafana` `stres` `kolege` `komp` `dosada` |
| `timing` | enum | Timing | `odmah` / `uskoro` / `vec_prestao` |
| `quitDate` | date | Date | chosen day |
| `commitment` | enum | Commitment | `potpuno` / `veoma` / `donekle` / `nesiguran` |

**Derived (compute, don't ask):**
- `annualCigs = cigsPerDay * 365`
- `annualCost = (cigsPerDay / cigsPerPack) * packPrice * 365` → round to nearest 100, format with `.` thousands sep + currency.
- `costEquivalent` — map `annualCost` to a tangible ("= 10 dana odmora na moru", "= nov telefon", "= 3 meseca kirije"). Keep a small lookup table by RSD band.
- `productNoun` — when `product = iqos`, swap "cigareta/cigarete" copy for "štapića/grejanja duvana" where it reads naturally; keep "pušenje/dim" generic. Default everything to cigarettes.

---

## 2. Serbian gender grammar — the token system

Serbian past-tense verbs (l-participle) and many adjectives inflect by the **subject's** gender. The user is the subject throughout onboarding, so every such word needs an `m`/`f` form. For `x` (unspecified) we **rephrase to avoid the gendered word** wherever possible; only fall back to the slash form (`prestao/la`) when a rewrite would be clumsy.

**Implement as a helper**, e.g. `g('prestao')` → returns the right form for `profile.gender`. Token table:

| Token (meaning) | `m` | `f` | `x` fallback |
|---|---|---|---|
| quit (did) | prestao | prestala | prestao/la |
| smoked | pušio | pušila | pušio/la |
| started | počeo | počela | počeo/la |
| ready (adj) | spreman | spremna | spreman/na |
| sure (adj) | siguran | sigurna | siguran/na |
| free (adj) | slobodan | slobodna | slobodan/na |
| committed (adj) | posvećen | posvećena | posvećen/na |
| endured | izdržao | izdržala | izdržao/la |
| lit up (relapsed) | zapalio | zapalila | zapalio/la |
| resisted | odoleo | odolela | odoleo/la |
| said/told | rekao | rekla | rekao/la |
| wanted | hteo | htela | hteo/la |
| could | mogao | mogla | mogao/la |
| finished | završio | završila | završio/la |
| got back (reclaimed) | vratio | vratila | vratio/la |
| survived/got through | preživeo | preživela | preživeo/la |
| alone/by myself | sam | sama | sam(a) |

**Rules**
- Prefer **gender-free phrasing** when it's natural and just as warm — it's better than slashes. e.g. instead of "Spreman/na si." → "Vreme je." or "Tu si." Use the table when the gendered word genuinely carries the warmth.
- `name` is shown verbatim; never inflect it.
- A `[g:token]` placeholder convention in the copy below = "insert the gender-correct form." A `[var]` placeholder = insert profile data.
- **QA pass:** every screen must be read end-to-end in all three of `m` / `f` / `x` before sign-off. List below flags screens with the most gendered surface area: Cost, Reflection, FearReflection, Summary, Commitment.

---

## 3. Conditional content — reflection screens

Three screens **mirror the user's own selections back** as individual cards. Author **one block of copy per option**, then render only the selected ones (in selection order). Each card = small colored icon + title + 1–2 line body + one bold ember "takeaway" line.

### 3a. `OnboardingReflection` (after Reasons) — title/subtitle dynamic, cards per chosen reason
- **Header** lists the user's chosen reasons in a natural Serbian list ("Zdravlje, porodica i sloboda." — note the "i" before the last). If 1 reason: just that word. If 2: "X i Y". If 3: "X, Y i Z".
- Then one white card per chosen `reason`. Write all six:

| reason | title | body (warm, factual) | ember takeaway |
|---|---|---|---|
| `zdravlje` | Zdravlje | "Već 20 minuta nakon poslednje cigarete krvni pritisak počinje da se vraća u normalu." | "Tvoje telo počinje da se oporavlja odmah." |
| `porodica` | Porodica | "Pasivni dim utiče na sve oko tebe — najviše na decu." | "Oni su razlog koji se ne dovodi u pitanje." |
| `pare` | Pare | "Trošiš **[annualCost]** godišnje na [productNoun]. Taj novac može biti tvoj." | "Svaki dan bez pušenja je novac u tvom džepu." |
| `forma` | Fizička forma | "Već posle nedelju dana pluća rade lakše, a izdržljivost raste." | "Vratićeš dah koji si mislio da je nestao." → use `[g:mislio]`* |
| `sloboda` | Sloboda | "Nikotin stvara iluziju kontrole. Bez njega, ti odlučuješ." | "Sloboda počinje prvog dana." |
| `pritisak` | Pritisak okoline | "Možda si počeo zbog drugih. Ali prestaješ zbog sebe." → `[g:počeo]` | "Ovo je tvoja odluka, ni za koga drugog." |

\*`mislio/mislila/mislio-la` — add to token table if you keep this line.

### 3b. `OnboardingFearReflection` (after Fears) — same structure, one card per chosen `fear`

| fear | title | body | ember takeaway |
|---|---|---|---|
| `porivi` | Jaki porivi | "Svaki poriv traje između 3 i 5 minuta, pa prolazi sam — uvek." | "Iskra ima alat za tačno taj trenutak." |
| `stres` | Stres bez cigarete | "Nikotin ne smanjuje stres — samo nakratko gasi apstinenciju koju je sam izazvao." | "Pravo olakšanje dolazi posle 3 nedelje." |
| `kafana` | Kafana i društvo | "Društvene situacije su čest okidač. Imaćeš plan za svaku od njih." | "Nećeš biti [g:sam] u tome." |
| `neuspeh` | Strah od neuspeha | "Prosečna osoba pokuša više puta pre nego što [g:prestao] zauvek. Pokušaj nije neuspeh." | "Ovaj put imaš pomoć uz sebe." |
| `razdrazljivost` | Razdražljivost | "Prvih par dana mozak traži naviku. To je privremeno i predvidivo." | "Za 2 nedelje vraća se mir." |
| `kilaza` | Dobitak na kilaži | "Apetit se može vratiti — ali to se kontroliše malim navikama, ne nikotinom." | "Brinemo i o tome, korak po korak." |

### 3c. `OnboardingPreview` (3-month projection) — 3 cards computed from data
- Card 1 **Finansije** (green): "**[annualCost]**" / "ušteđeno za godinu dana". Sub-equivalent `[costEquivalent]`.
- Card 2 **Zdravlje** (teal): "Plućna funkcija +30%" / "u prvih 90 dana bez [productNoun]".
- Card 3 **Sloboda** (purple): "[g:slobodan] od nikotina" / "mozak se vraća u prirodno stanje".
- Testimonial (static): Marija, 34, verified ✓, 5 stars. (Keep a real-sounding, non-medical quote.)

---

## 4. Screen-by-screen copy brief

For each: **purpose**, the **copy to write** (with `[var]` / `[g:token]` slots), and **notes**. Question screens are white; reflection/AHA are warm/`[DARK]`. Progress fractions need normalizing — pick one denominator (recommend /16, counting question + reflection steps; exclude Splash/Review/Paywall) and apply consistently.

**1. Splash** — *Purpose: one emotional promise + start.*
- Wordmark: ISKRA. Tagline (write 2 lines, ≤6 words each): line 1 a truth, line 2 the promise. Current direction: "Znaš da treba." / "Iskra ti pomaže da i [g:hteo]." → for `x`, rephrase to "…da to i ostvariš." (avoids the slash). CTA: "Počni". Secondary: "Već imam nalog".

**2. Name** — *Purpose: make it personal immediately.*
- Q: "Kako da te zovemo?" Sub: "Koristićemo ovo ime kroz celu aplikaciju." Placeholder: "Tvoje ime". CTA: "Nastavi" (disabled until typed).

**3. Gender** — *Purpose: unlock correct grammar + health model. This is WHY we ask — say so.*
- Q: "Kako da te oslovljavamo?" Sub: "Da bismo ti se obraćali kako treba i prilagodili zdravstveni napredak." Cards: "Muško" / "Žensko". Tertiary: "Preferiram da ne kažem" (sets `gender = x`).

**4. Product** — *Purpose: tailor nouns + savings.*
- Q: "Šta koristiš?" Sub: "Prilagodićemo Iskru tebi." Cards: "Cigarete" / "Klasično pušenje"; "IQOS" / "Zagrevani duvan". CTA: "Nastavljam".

**5. Cigarettes** — *Purpose: savings + health math inputs.*
- Q: "Koliko [productNoun] dnevno si [g:pušio]?" Sub: "Koristimo ovo da izračunamo tvoje uštedine." Stepper unit: "[productNoun] dnevno". Note: "Prosek u Srbiji je oko 15 dnevno." Second field label: "Cigara u pakli" / sub "Najčešće 20".

**6. Price** — *Purpose: money math.*
- Q: "Koliko košta tvoja kutija?" Sub: "Koristimo ovo da izračunamo koliko ćeš uštedeti." Unit toggle RSD/EUR. Note: "Marlboro u Srbiji košta oko 400–500 RSD."

**7. Cost (AHA)** `[DARK]` — *Purpose: the gut-punch number.*
- Eyebrow: "TVOJI PODACI". Lead: "Godišnje trošiš na [productNoun]". Card: big "**[annualCost]**" + "[currency]" + muted "[costEquivalent]". Closing line: "Iskra ti vraća taj novac — dan po dan." CTA: "Nastavi".

**8. Reasons** — *Purpose: capture motivation (used everywhere later).*
- Q: "Zašto hoćeš da prestaneš?" Sub: "Izaberi do 3 razloga. Vraćaćemo ti ih kad bude teško." 6 pills (see 3a labels). CTA: "Nastavi" (≥1).

**9. ReasonText** — *Purpose: their own words = strongest future anchor.*
- Q: "Zapiši to svojim rečima." Sub: "Pokazaćemo ti ovo svaki put kad bude najteže." Placeholder: "Hoću da uštedim za letovanje" (italic). Chips (fill field): "Zbog zdravlja" "Zbog dece" "Zbog para" "Zbog sebe" "Zbog partnera". Privacy note: "Samo ti ovo vidiš. Nikad ne delimo." CTA: "Nastavi".

**10. Reflection** `[DARK]` — *Purpose: validate the reasons.* → see §3a. Eyebrow: "ČUJEMO TE". Header = listed reasons. Sub: "To su tvoji razlozi. Iskra će ti ih uvek vraćati." CTA: "Tačno tako".

**11. Fears** — *Purpose: surface objections to pre-empt.*
- Q: "Šta te brine kod prestanka?" Sub: "Budi [g:iskren]*. Tu smo da pomognemo." 6 pills (see 3b). CTA: "Nastavi" (≥1). *add `iskren/iskrena` to token table.

**12. FearReflection** `[DARK]` — *Purpose: defuse each fear.* → see §3b. Header: "Ove brige su normalne. Svi ih imaju." Sub: "Iskra je napravljena baš za ove trenutke." CTA: "[g:spreman] sam" → for `x`: "Spremni smo" or "Idemo dalje".

**13. Triggers** — *Purpose: personalize craving help.*
- Q: "Kada ti se najviše puši?" Sub: "Koristićemo ovo da ti pomognemo baš u tim trenucima." 7 options: "Jutarnja kafa" "Posle jela" "Kafana i alkohol" "Stres na poslu" "Pauza sa kolegama" "Sedenje za kompom" + full-width "Čekanje i dosada". CTA: "Nastavi".

**14. Timing** — *Purpose: set the quit moment.*
- Q: "Kada hoćeš da prestaneš?" Sub: "Nema pogrešnog odgovora." Cards: "Odmah" / "Počinjemo danas"; "Uskoro" / "Izaberi datum"; "Već sam [g:prestao]" / "Nastavljam niz". Auto-advance. (If `vec_prestao`, later copy shifts to present-progress tense — note for Date/Summary.)

**15. Date** — *Purpose: concrete commitment date.*
- Q: "Koji datum si [g:izabrao]?"* Sub: "Možeš ga promeniti kasnije." Footnote: "Postavljanje konkretnog datuma povećava šanse za uspeh.¹" CTA: "Potvrdi datum". *add `izabrao/izabrala`.

**16. Preview** `[DARK]` — *Purpose: future pull + social proof.* → see §3c. Header: "Za 3 meseca, ovo te čeka." Sub: "Na osnovu tvojih podataka." CTA: "Jedva čekam".

**17. Panic** — *Purpose: teach the core feature by doing.*
- Eyebrow: "PROBA". Header: "Hajde da vežbamo jedan trenutak." Body: "Zatvori oči. Zamisli da ti se sada puši. Kad budeš [g:spreman] — pritisni." Button label: "Imam poriv". Footer: "Svaki poriv traje 3 do 5 minuta. Iskra te provede kroz njega."

**18. Commitment (contract)** `[DARK]` — *Purpose: ceremony = ownership.*
- Header: "[name], sklapamo dogovor." 4 pledges (first person, gendered): e.g. "Biću [g:strpljiv]* prema sebi." / "Neću se [g:predao]** posle jednog teškog dana." / "Vraćaću se svojim razlozima." / "Dajem sebi pravo na novi početak." CTA: "Potpisujem". *`strpljiv/strpljiva` **`predao/predala` — add to table.
- (If `commitment` level screen is used: Q "Koliko si [g:posvećen] ovoj promeni?" with 4 options potpuno/veoma/donekle/nesiguran — write a one-line subtitle each; auto-advance.)

**19. Summary** `[DARK]` — *Purpose: full recap = confidence.* → pulls everything.
- Eyebrow: "TVOJ PLAN". Header: "[name], [g:spreman] si." Sub: "Na osnovu svega što si nam [g:rekao], ovo je tvoje putovanje." Sections: savings chart (→ [annualCost]), 2×2 stats (quit date / cigsPerDay / packPrice / annualCigs), health timeline (static milestones), razlozi cards (chosen reasons). Closing: "Iskra je tu svaki put kad bude teško." CTA: "Počinjemo". Fine print: "Možeš promeniti sve podatke u podešavanjima."

**20. Notifications** — *Purpose: opt-in, framed as help not spam.*
- Header: "Iskra je najkorisnija kad si tu." Sub: "Šaljemo samo ono što je važno — nikad spam." 3 sample notif cards (write friendly, specific copy). CTA: "Dozvoli obaveštenja". Secondary: "Možda kasnije".

**21. Review** — iOS rate prompt: "Oceni Iskru" / "Ne sada".

**22. Paywall** — separate brief (pricing, tiers, FAQ). Out of scope here; keep tone consistent: confident, not pushy; lead with the transformation, not features.

---

## 5. Writer's checklist (per screen)
- [ ] Reads naturally in `m`, `f`, and `x`.
- [ ] No clinical/medical phrasing; no shame; no fear-mongering.
- [ ] Numbers come from `profile`, formatted (`.` thousands, currency suffix).
- [ ] Reflection cards render only for selected options, in selection order.
- [ ] Sentence case, no emoji, ≤2 short lines per block where possible.
- [ ] Every `[var]` and `[g:token]` resolved; list any new tokens you introduce so dev adds them to the helper.

---

## 6. `costEquivalent` lookup table

The "= …" line under the big annual number (Cost AHA, and the Preview/Summary savings cards). Its whole job is to make an abstract number **feel like a real thing you lost**. So it must always read as a clean, relatable comparison — never "0.4 of X" and never "843 coffees".

### How it works
1. **Always look up in RSD.** Equivalents are Serbian-market priced in RSD. If `currency = EUR`, convert for the lookup only: `annualCostRSD = annualCostEUR × 117` (keep the EUR figure for *display*, use RSD for *picking the equivalent*). Update the rate at build time.
2. **Pick the band** that `annualCostRSD` falls into and show that band's **headline** equivalent. Rotate among the listed alternatives (e.g. by user id hash) so it doesn't feel canned, but never show a comparison whose implied count is silly.
3. **Phrasing is approximate on purpose** — every line is framed with "=", "skoro", "otprilike" or "preko", so we never claim exactness. Do **not** print the unit math; just the human line.
4. Round `annualCost` for display to the nearest 1.000.

### Reference unit prices (RSD, Serbia ~2026 — update at build time)
Use these to compute "X puta …" framings elsewhere (e.g. Money detail "To je kao…").

| Item | ~RSD |
|---|---|
| kafa u kafiću | 250 |
| ćevapi (obrok) | 650 |
| bioskop karta | 600 |
| Netflix (mesečno) | 1.300 |
| teretana (mesečno) | 3.500 |
| večera za dvoje | 6.500 |
| dobre patike | 13.000 |
| vikend u planini (2 noći) | 22.000 |
| nov telefon (solidan) | 48.000 |
| mesečna kirija (garsonjera, BG) | 48.000 |
| 10 dana na moru (po osobi) | 150.000 |
| najnoviji telefon (flagship) | 165.000 |
| polovni auto (pristojan) | 380.000 |

### Bands (annualCostRSD → headline + alternatives)
Most smokers land in bands C–E (10–30/day at 400–500 RSD/pak). Cover the edges anyway.

| Band | annualCostRSD | Headline equivalent | Alternatives (rotate) |
|---|---|---|---|
| **A** | < 30.000 | "= godinu dana Netflixa i još ostane" | "= 40 večera u gradu" · "= dobre patike i još para za izlaske" |
| **B** | 30.000–59.999 | "= godinu dana u teretani" | "= produžen vikend u planini" · "= nov telefon na rate, bez rata" |
| **C** | 60.000–99.999 | "= nov telefon svake godine" | "= dva meseca kirije" · "= 12 večera za dvoje" |
| **D** | 100.000–139.999 | "= produžen vikend u inostranstvu" | "= skoro tri meseca kirije" · "= najnoviji telefon i još ostane" |
| **E** | 140.000–199.999 | "= 10 dana odmora na moru" | "= najnoviji telefon, svake godine" · "= četiri meseca kirije" |
| **F** | 200.000–299.999 | "= letovanje za celu porodicu" | "= pola godine kirije" · "= mali polovni auto za par godina" |
| **G** | 300.000–449.999 | "= pristojan polovni auto" | "= godinu dana kirije" · "= dva letovanja godišnje" |
| **H** | ≥ 450.000 | "= polovni auto, svake godine" | "= više od godinu dana kirije" · "= nešto što si dugo odlagao" → `[g:odlagao]`* |

\*`odlagao/odlagala` — add to gender token helper if you keep the H alternative.

### Edge rules
- **Very low (< ~12.000):** the savings story is weak — switch the framing from "what you'd buy" to time/health: e.g. "= mali korak koji se brzo skuplja." Don't force a product comparison.
- **Family-aware:** band F's "za celu porodicu" assumes nothing about household; keep alternatives that work for a single person too (kirija, auto).
- **Keep it aspirational, never guilt-trippy.** It's "this is what's now possible," not "look what you wasted." The Cost AHA closing line ("Iskra ti vraća taj novac — dan po dan.") already carries the reframe.
- **Currency display:** show the headline number in the user's chosen currency; the equivalent line stays in plain Serbian (no currency in it), so it works for both RSD and EUR users unchanged.

### Dev shape
```
pickEquivalent(annualCostRSD) -> { band: 'E', headline: '…', alts: ['…','…'] }
// choose alt = alts[ hash(userId) % alts.length ] for stable variety
```

---

## 7. Reflection mirroring — rules & edge cases

The reflection screens must show **exactly what the user selected on the previous screen — and only that.** This section closes every edge case so the copy never breaks.

### 7.1 Which screens mirror, and how
- **`Reflection`** (after Reasons) and **`FearReflection`** (after Fears) are **true mirrors**: render one card per selected option, nothing for unselected options. Header may also list the selections.
- **`Preview`** is **NOT a mirror** — it's a fixed 3-card projection (money / health / freedom) computed from data, shown to everyone regardless of which reasons they picked. Do **not** gate its cards on `reasons`. (Stated here so no one "fixes" it later.)
- **`Summary`** re-lists the chosen reasons (same rules as Reflection) plus data — treat its razlozi block with the §7 rules below.

### 7.2 Order (one rule, used everywhere)
Render cards **and** header list in **selection order** (the order the user tapped) — that order encodes their priority, so it's the most faithful mirror. The same array drives the header join, the cards, the Summary razlozi block, and the "Moji razlozi" craving tool, so they always match. (If product prefers a fixed reading order instead, define ONE canonical order and use it for all of the above — never mix.)

### 7.3 Header list-join (Serbian)
- 1 item: `A` → "Zdravlje."
- 2 items: `A i B` → "Zdravlje i porodica."
- 3 items: `A, B i C` → "Zdravlje, porodica i sloboda."
- N>3 (fears): `A, B, C i D` — Oxford-style comma is **not** used in Serbian; "i" only before the last.
- **Casing:** capitalize only the first word of the sentence; every other label is **lowercase** in the list. Use the `listLabel` (short, lowercase) form below, not the Title-Case pill label.
- **Sentence-start** label gets its first letter capitalized by the join function, not stored capitalized.

**`listLabel` (use in header sentences) vs pill label:**

| option | pill label | `listLabel` (lowercase, in-sentence) |
|---|---|---|
| `zdravlje` | Zdravlje | zdravlje |
| `porodica` | Porodica | porodica |
| `pare` | Pare | pare |
| `forma` | Fizička forma | fizička forma |
| `sloboda` | Sloboda | sloboda |
| `pritisak` | Pritisak okoline | pritisak okoline |
| `porivi` | Jaki porivi | jaki porivi |
| `stres` | Stres bez cigarete | stres |
| `kafana` | Kafana i društvo | kafana i društvo |
| `neuspeh` | Strah od neuspeha | strah od neuspeha |
| `razdrazljivost` | Razdražljivost | razdražljivost |
| `kilaza` | Dobitak na kilaži | kilaža |

### 7.4 Count edge cases
- **Reasons:** min 1, max 3 (enforced on the Reasons screen) → Reflection always shows 1–3 cards. No empty state possible.
- **Fears:** min 1, **no max** on the Fears screen. Decision: **FearReflection shows a card for every selected fear** (the screen scrolls — no cap). If design wants a hard cap of 3 for length, cap by this **priority order** and append nothing (don't show "+N more"): `porivi → kafana → stres → neuspeh → razdrazljivost → kilaza`. Pick one behavior and document it in code.
- **Header with many fears:** the static header ("Ove brige su normalne. Svi ih imaju.") does **not** list fears, so N has no effect there — only the cards scale. (Reasons header *does* list, but max is 3, so it's always clean.)

### 7.5 Free-text `reasonText` — empty/fallback
`reasonText` is **optional** (the screen's "Nastavi" works with an empty field). Anywhere we later show "your own words" — the **Moji razlozi** craving tool, **SlipRecap**, and any "zašto si počeo" surface — must have a fallback:
- If `reasonText` is non-empty → show it verbatim, in quotes, never inflected.
- If empty → fall back to the chosen reasons phrase: "Tvoji razlozi: [header-join]." and hide the signature/quote-mark treatment. Never show an empty quote card.

### 7.6 `timing = već prestao` — tense shifts
For users who already quit, present-tense "you spend / you smoke" reads wrong. Provide past-tense variants on the data screens:
- **Cost AHA** lead: present "Godišnje trošiš na [productNoun]" → already-quit "Godišnje si [g:trosio] na [productNoun]" (add tokens `trosio/trosila`). The big number + equivalent stay identical.
- **Preview / Summary:** future framing ("Za 3 meseca te čeka…", "ovo je tvoje putovanje") stays valid from the quit date — no change needed.
- **Reflection / FearReflection:** about reasons/fears, not timing — unaffected.

### 7.7 `product = iqos` — noun safety
Every cigarette-specific noun in reflection/AHA copy must route through `[productNoun]` or a product-neutral word ("nikotin", "dim", "pušenje"). Audited fixes already applied: the `kilaza` fear card now says "ne nikotinom" (was "cigaretom"). When writing new lines, never hardcode "cigareta" in a card that an IQOS user can see.

### 7.8 Gender in reflection cards
Tokens already marked in §3a/§3b (`mislio`, `počeo`, `sam`, `prestao`). Two cards have lines that *imply* the subject without a verb — re-read all reflection cards in `f` and `x` and confirm none silently assume `m`. New gendered words introduced anywhere → add to the §2 token table and the helper.

### 7.9 Mirror QA matrix (run before sign-off)
For **Reflection** and **FearReflection**, verify the rendered cards exactly equal the selected set for these cases, in `m`/`f`/`x`:
- exactly 1 selected · exactly 2 · exactly 3 · (fears) 4–6 selected
- selection order A,B,C vs C,B,A → header + cards reorder together
- a reason/fear with a multi-word label appears correctly lowercased in the header
- IQOS user → no "cigareta" leaks into any visible card
- already-quit user → Cost AHA reads in past tense
- empty `reasonText` → downstream "your words" surfaces use the fallback, no empty quote
