# Iskra mobile app

Read these before writing anything:

- `PRODUCT.md`: why, for whom, and what must never happen. Decides anything the roadmap leaves open
- `ROADMAP.md`: what to build and when. Milestones M0 to M9
- Expo HAS CHANGED. Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/
  before writing any Expo code. This project is on SDK 57 (React Native 0.86, React 19.2)

## Stack

Expo managed workflow, Expo Router (`src/app`), TypeScript strict, development builds via EAS
(`expo-dev-client`). Not Expo Go: fonts are embedded natively by the `expo-font` config plugin.

```
npm run ios          # prebuild + run on the iOS simulator (needs Xcode)
npm run android      # prebuild + run on an Android emulator (needs the Android SDK)
npm start            # Metro for an already-installed dev build
npm run check        # typecheck + lint + tests
```

## Rules the code enforces, and why

- **Text and taps go through `@/components/primitives`.** ESLint blocks raw `Text`, `Pressable`
  and `Touchable*` from `react-native` in `src/`. The primitive `Text` applies the bundled face
  and Dynamic Type caps; the primitive `Pressable` guarantees a 48x48 target and native feedback
- **Colours come from `@/theme`, never hex in a screen.** `src/theme/tokens.ts` is a verbatim port
  of the website's `globals.css`; edit the site first, then port. Screens use the semantic roles
  in `src/theme/index.ts` so a dark scheme can be added by remapping roles later
- **`fontFamily` is a PostScript name and never pairs with `fontWeight`.** Files in
  `assets/fonts` are named after their PostScript names so one string works on iOS and Android
- **White on ember is 3.18:1.** Only large text (19pt bold, or 24pt) or icons sit on ember. Ember
  text on paper is 3.1:1: headings at 24pt or larger only
- **Tool glyphs sit in the tool colour on its tint, beside a text label**, as on the site. A
  glyph with no label goes white on the solid tool colour instead (razlozi on tint is 2.78:1).
  Never a solid ember razlozi badge next to "Imam poriv": ember is the single voice of action
- **Rasters come from the website and are logged in `assets/PROVENANCE.md`.** Tool textures and
  the flame are copies of `iskraclub.com` assets; re-export from the site, never edit the copies
- **`negative` is for comparison verdicts only.** Never pointed at the user
- **Counts go through `plural()`** in `src/lib/i18n/plural.ts`. Never `n > 1`
- **Serbian copy is final. Never write or paraphrase a Serbian string.** Need one that does not
  exist? Leave a `TODO(copy)` and flag it for Pavle

## Layout

```
src/app/                 routes (Expo Router)
src/components/primitives Text, Pressable, Button, Icon
src/features/<name>/     feature code (poriv, napredak, ...)
src/lib/                 pure logic, unit-tested
src/theme/               tokens.ts (site port), typography.ts, index.ts (roles)
```
