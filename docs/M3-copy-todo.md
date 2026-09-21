# M3 copy: what Pavle owes

The M3 brief supplied final v1.0 copy for every screen, and all of it is in the code verbatim.
One string is missing, because the brief does not cover it and an agent may not invent Serbian.

In the app, missing copy renders as `«TODO(copy): …»`. The test in
`src/features/poriv/__tests__/copy.test.ts` pins the list below, so a second marker cannot
appear without failing the build.

---

## 1. One string. The X in Poriv mod.

Mode has a close button in the top left. It needs a screen-reader label: one or two words,
read aloud by VoiceOver, never shown on screen.

| Where | What it is | Current |
|---|---|---|
| `mode.close` in `src/features/poriv/copy.ts` | The X's accessibility label | `«TODO(copy): Mode, oznaka za X»` |

Worth deciding together with what the X means. It is not "back": it closes a craving without
saying how it ended, which leaves `outcome` null on purpose. A label that says "close" is
accurate; one that says "cancel" would not be, because the craving is not cancelled.

## 2. Decisions taken for you, worth a look

- **The slip link reads "Desila se cigareta"**, the brief's own words, and sits at the bottom
  right of the tools, opposite the footer line and well away from "Prošlo je". The export put
  its equivalent in the same place, so this follows both.
- **"Zabeleženo." is a line, not a toast.** The brief lists it as Beležim's confirmation "back
  in Mode". Nothing may pop up over a craving, so it appears beside IZABERI ALAT and stays
  there rather than appearing and vanishing.
- **Beležim's strength scale is ten tappable steps, not a drag slider.** The brief says
  "a slider 1 to 10 with a large thumb and a haptic tick per step". A shaking hand misses a
  thumb; ten 56pt targets cannot be missed, and each one still ticks. Same data, same ends
  ("Blag", "Nepodnošljiv"). Say the word if you want the drag.
- **Month names on Home come from onboarding's approved list**, lowercased in the sentence.
  No second Serbian list exists.

## 3. Not built, deliberately

- **The home-screen quick action** (long-press the app icon) is the brief's stretch goal. The
  only maintained library, `expo-quick-actions`, last shipped in May 2026 and declares no SDK
  57 support. Adding an unverified native config plugin to a working build for a stretch item
  is not worth it today. `iskra://poriv` works, so the plumbing it would need is already there.
- **The lock-screen widget**, as the brief says: v1.1, it needs a native extension on both
  platforms.
