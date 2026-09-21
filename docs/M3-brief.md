# M3 brief: Poriv mod and the first real home

For the code agent. Read `AGENTS.md`, `PRODUCT.md`, `SCREENS.md` (Part 1 item 1, the Poriv
and Slip flows, Part 4) and `ROADMAP.md` M3 first. Target: 30.10.

This is the reason the app exists. Someone is mid-craving, agitated, holding the phone in one
hand. Every decision below is judged by one question from `PRODUCT.md`: does it help at minute
two of a craving?

Four tasks. Task 1 is the core; do it first and make it bulletproof before the rest.

---

## Task 0: the home screen, v1

`src/app/index.tsx` still renders the M0 `FoundationsScreen` specimen once onboarding is done.
M3 cannot be "one tap from the first screen" without a first screen, so Home is built here.

Build it state by state from `deriveUserState()` and the table in `SCREENS.md` Part 4, but
**only with data that exists today.** Money is M4, milestones and check-ins are M5. A state
whose supporting card needs M4/M5 data simply shows fewer cards until then. No placeholders,
no "uskoro", no empty cards.

| State | Leads with (M3) | Supporting (M3) |
|---|---|---|
| Pre-quit | The quit date and the days until it | Their reasons |
| Acute, day 0 to 3 | "Imam poriv", full width | Day count |
| First week, 4 to 7 | "Imam poriv", day count | Cravings survived |
| Consolidating, 8 to 27 | Day count | Cravings survived |
| Established, 28+ | Day count | Cravings survived |
| Post-slip, slip in last 48h | Absolution and the unbroken total | Their reasons |

Fixed in every state: the **"Imam poriv"** button in the thumb zone. No bottom nav yet: tabs
arrive when Napredak (M4) and Saznaj (M5) exist. Never show a tab that leads nowhere.

Keep `FoundationsScreen` reachable from `dev.tsx` only.

## Task 1: Poriv mod

### The flow

```
Imam poriv  ->  Mode (timer + six tools)  ->  tool  ->  back to Mode
                     |                                        |
                     +-- "Prošlo je" -> Success               |
                     +-- "Desila se cigareta" -> Slip screen  |
```

**No entry screen.** The export's `PorivEntry` asks strength and trigger *before* helping.
That is the thirty seconds of navigation the roadmap says has already lost. Cut it as a gate.
Strength and trigger are still collected, just not first:

- inside **Beležim**, which is exactly the tool for it, or
- one optional tap on Success or the Slip screen, if Beležim was not used

### The `cravings` row

- **Created the instant "Imam poriv" is tapped**, via `logCraving()`, before any animation.
  Local first, as everything since M1
- `tool_used`: the **last** tool opened before the outcome. The column holds one value; the
  last tool is the one that got them through. Document this in a comment on the write
- `duration_seconds`: wall clock from `created_at` to the outcome tap, backgrounding included
- `outcome`: `survived` on "Prošlo je", `slipped` on "Desila se cigareta"
- `strength`, `trigger`: from Beležim or the post-craving tap. Null if never given

**Never guess.** Closing Mode with the X leaves `outcome` null. That is an honest row: the
craving happened, we do not know how it ended. Do not ask on exit, do not assume survived.

### Resume

A craving is not interrupted by a phone call. If the app is killed or backgrounded and
reopened while a craving row is open (`outcome` null, `created_at` under 15 minutes ago), the
app opens **straight into Mode**, timer continuing from `created_at`. Older open rows stay
null and are ignored.

### Mode screen

- Ember top half, paper bottom half, as the export's `PorivMode`. Colours from tokens
- A 5:00 countdown ring from `created_at`. At 0:00 the ring stays full and the line under it
  changes (copy below). Nothing else happens: no sound, no modal
- The six tools in a 2 x 3 grid, from `porivTools` in `src/features/poriv/tools.ts`, each with
  its texture panel and glyph. Every target at least 64pt tall
- "Prošlo je" as the primary button, always visible, not only after five minutes
- "Desila se cigareta" as a quiet text link, far from the primary button
- Screen kept awake for the whole craving (`expo-keep-awake`)
- **Nothing interrupts it.** No prompt, toast, sync banner or navigation while Mode or a tool
  is open. PRODUCT.md, "What the app must never do"

### The six tools

All six run fully offline. Each ends with "Gotovo", which returns to Mode.

| Tool | Build |
|---|---|
| **Dišem** | 4 rounds of udah 4s, zadrži 4s, izdah 6s, about a minute. The longer exhale is deliberate. Animation on the UI thread (Reanimated). A light haptic on every phase change. With Reduce Motion on, the circle stays still and the phase word and haptic carry it |
| **Pijem vodu** | A glass that fills in 8 taps, one per gulp. Something for the hand to do |
| **Moji razlozi** | `profiles.reason_text` large, in „…", then the `reasons[]` labels from onboarding, then the signature drawn from `signature_data`. If `reason_text` is empty, the reasons alone. No health statistic on this screen |
| **Šetam** | Text only. No pedometer: it needs a motion permission, and a permission prompt mid-craving is an interruption |
| **Odlažem** | Its own 5:00 countdown on screen. "Not forever, five minutes." When it ends, the end line, then "Gotovo". No notification (see Decisions) |
| **Beležim** | Trigger: the ten chips from `TRIGGERS`, one tap. Strength: a slider 1 to 10 with a large thumb and a haptic tick per step, labelled at both ends. "Sačuvaj" writes both to the open craving row and returns to Mode |

### Success

Header, the line about craving length, today's count of survived cravings, the learning line,
then, **only if no trigger was logged**, the trigger chips as one optional tap. "Nazad na
početnu". No rating prompt, no milestone card (milestones are M5), no share.

### "Desila se cigareta"

M5 builds the full slip flow (`SlipScreen`, reflect, recap). M3 builds the minimum so the link
never leads nowhere:

1. Write `outcome = slipped` on the craving
2. Write a `slips` row through `logSlip()`, carrying the craving's trigger if there is one
3. Show one absolution screen (copy below) with the trigger chips as an optional tap if none
   was logged yet, which updates both rows
4. Home, which is now in Post-slip

The day count does not change. Ever. `smokeFreeMs()` already ignores slips; keep it that way.

## Task 2: a way in without opening the app

- Deep link `iskra://poriv` opens Mode directly and starts a craving (the scheme is already
  `iskra`)
- **Stretch:** a home-screen quick action "Imam poriv" (long-press on the app icon) routed to
  the same link. Use a maintained library only if it supports SDK 57; otherwise skip it and
  say so
- **Not in v1:** the lock-screen widget. It needs a native extension on both platforms. v1.1

## Task 3: tests

- Tapping "Imam poriv" writes a row before the first frame of Mode, offline
- Each outcome path writes the right `outcome`, `duration_seconds` and `tool_used`
- X leaves `outcome` null
- Resume: an open row under 15 minutes reopens Mode with the correct remaining time; an
  older one does not
- A slip writes both rows and does not change the day count
- Every string below renders identically for `muško`, `žensko` and unset: none of them is
  gendered, by design

---

## Copy

Final v1.0 copy, approved by Pavle. Use it verbatim. Every line here is genderless, so no
`g()` call is needed anywhere in M3. The export's own Poriv strings are **not** approved: they
carry slashes, em dashes, English ("PORIV MODE", "milestone") and an unsourced health figure.

Counts go through `plural()`: `dan` / `dana` / `dana`, `poriv` / `poriva` / `poriva`.

**Home**

- Button: Imam poriv
- Day 0: Prvi dan bez cigarete.
- Day 1+: the number [n] large, and under it: [dan] bez cigarete
- Pre-quit: Tvoj dan: [datum] and Još [n] [dan]. On the day itself: Danas je tvoj dan.
- Reasons card title: Tvoji razlozi
- Survived cravings: [n] [poriv] iza tebe
- Post-slip lead: Jedna cigareta ne briše dane pre nje.
- Post-slip sub: Ukupno vreme bez cigarete ostaje. Ne krećeš od nule.

**Mode**

- Eyebrow: PORIV
- Under the timer: minuta
- Breathing hint: Udahni.
- At 0:00, under the timer: Pet minuta je iza tebe.
- Section: IZABERI ALAT
- Footer: Porivi traju 3 do 5 minuta.
- Primary: Prošlo je
- Link: Desila se cigareta

**Tools** (eyebrow, then lines, then button; the · only separates lines here, it is not copy)

- Dišem: DIŠEM · 4 runde, oko jednog minuta · phases Udahni, Zadrži, Izdahni · Gotovo
- Pijem vodu: PIJEM VODU · Popij čašu. Polako. · Gutljaj po gutljaj, do dna. · tap target
  Gutljaj · Gotovo
- Moji razlozi: MOJI RAZLOZI · Ovo su tvoje reči. · Ostajem na putu
- Šetam: ŠETAM · Izađi napolje. · Svaki korak je korak dalje od cigarete. · Ako ne možeš
  napolje, promeni sobu. · Ostavi telefon na par minuta. · Gotovo
- Odlažem: ODLAŽEM · Samo pet minuta. · Ne zauvek. Samo ovih pet minuta. Posle toga
  odlučuješ ponovo. · at the end: Pet minuta je prošlo. · Gotovo
- Beležim: BELEŽIM · Šta te navelo? · Koliko jak je poriv? · ends Blag and Nepodnošljiv /
  Sačuvaj · confirmation back in Mode: Zabeleženo.

**Success**

- Prošlo je.
- Porivi traju 3 do 5 minuta. Tvoj je upravo prošao.
- Danas: [n] [poriv] iza tebe.
- Svaki put kad odolevaš, mozak uči da porivi prolaze.
- Optional: Šta te navelo?
- Nazad na početnu

**Slip**

- Desilo se. U redu je.
- Jedna cigareta ne briše dane pre nje. Ukupno vreme bez cigarete ostaje.
- Optional: Šta te navelo?
- Nazad na početnu

Anything else that needs words: render the M2 `missingCopy()` marker and list it in
`docs/M3-copy-todo.md`. Do not write Serbian.

---

## Decisions already taken

- **No entry screen**, strength and trigger collected after or inside Beležim. Reason above
- **One `tool_used` value, the last tool.** No schema change for M3. If beta shows people
  chain three tools, revisit with a `tools_used text[]` column then, not now
- **Odlažem sends no notification.** A reminder in five minutes is useful, but the app's rule
  for when it may speak is still Pavle's open decision (ROADMAP Part 4). Until then the timer
  lives on screen only
- **No rating prompt** anywhere in M3. SCREENS.md gates it to after a survived craving, day 3+,
  once ever, and post-launch
- **The dark takeover from the export is not used.** Ember top, paper bottom, per the
  direction contract in `_layout.tsx`

## Acceptance

- [ ] Home replaces the specimen and leads by state, with no placeholder cards
- [ ] "Imam poriv" is one tap from Home in every state, and from `iskra://poriv`
- [ ] The craving row exists locally before Mode's first frame, in aeroplane mode
- [ ] All six tools run end to end offline and return to Mode
- [ ] Every path writes a complete row: `strength` and `trigger` when given, `tool_used`,
      `duration_seconds`, `outcome`. X leaves `outcome` null
- [ ] Killed mid-craving, the app reopens into Mode with the right time left
- [ ] A slip writes `cravings` and `slips`, the day count does not move, Home shows Post-slip
- [ ] Nothing interrupts Mode or a tool; the screen stays awake
- [ ] Reduce Motion respected in Dišem; every target 64pt or more in Mode
- [ ] Zero slashes, zero em dashes, zero English in any M3 string
- [ ] Screenshots of every screen in `.impeccable/review/m3/`

## Not in M3

Napredak and money (M4). Full slip flow, check-in, milestones, Saznaj, bottom nav tabs (M4 and
M5). Notifications of any kind. The lock-screen widget. Rating prompt. Analytics (M6).
