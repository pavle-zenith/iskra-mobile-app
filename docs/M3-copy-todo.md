# M3 copy: closed

Nothing is owed. Every M3 string came from the brief and is in the code verbatim; the one
missing label, the X in Poriv mod, was approved as **"Zatvori"** on 21.09.2026 and is in place.
The test in `src/features/poriv/__tests__/copy.test.ts` now asserts zero markers, so a new one
cannot appear unnoticed.

Kept here because they are decisions, not copy:

- **The slip link reads "Desila se cigareta"**, the brief's own words, at the bottom right of
  the tools, opposite the footer line and away from "Prošlo je". The export puts its equivalent
  in the same place.
- **"Zabeleženo." is a line, not a toast.** Nothing may pop up over a craving, so Beležim's
  confirmation sits beside IZABERI ALAT and stays there.
- **Beležim's strength is ten tappable steps, not a drag slider.** Confirmed 21.09.2026: a
  shaking hand misses a thumb, and each step still ticks.
- **Month names on Home come from onboarding's approved list**, lowercased in the sentence.
  There is no second Serbian list anywhere.
- **"Zatvori", not "otkaži".** The X closes Mode without saying how the craving ended; it does
  not cancel it, and the craving row stays with a null outcome on purpose.

Not built, deliberately:

- **The home-screen quick action.** `expo-quick-actions` last shipped in May 2026 and declares
  no SDK 57 support, so it goes to v1.1 with the widget. `iskra://poriv` already works, which
  is the plumbing it would need.
