---
name: Iskra
description: The iskraclub.com world held in one hand. Paper ground, ember as the single voice of action, one colour per Poriv tool.
colors:
  ember: "#ec691c"
  ember-hover: "#df5f13"
  ember-tint: "#fdede2"
  ember-wash: "#f9dcc8"
  tool-disem: "#2e8b80"
  tool-disem-tint: "#e2f1ee"
  tool-voda: "#3f86c4"
  tool-voda-tint: "#e4eef8"
  tool-razlozi: "#ec691c"
  tool-razlozi-tint: "#fdede2"
  tool-setam: "#3f8d52"
  tool-setam-tint: "#e4f1e6"
  tool-odlazem: "#55559a"
  tool-odlazem-tint: "#e9e9f4"
  tool-belezim: "#7a5cc4"
  tool-belezim-tint: "#eee8f8"
  money: "#3a7a3a"
  money-deep: "#2f6630"
  money-tint: "#e6f0e6"
  health: "#c2446f"
  health-deep: "#a93a60"
  health-tint: "#fbe7ee"
  time: "#6b52a8"
  time-deep: "#58438f"
  time-tint: "#ece7f6"
  negative: "#c24a43"
  negative-tint: "#fde4e1"
  negative-ink: "#9f3129"
  paper: "#fdfcfa"
  surface: "#ffffff"
  well: "#f6f2ec"
  line: "#e8e1d8"
  ink: "#191512"
  ink-soft: "#3b3530"
  muted: "#6b6660"
  white: "#ffffff"
typography:
  display:
    fontFamily: "HostGrotesk-SemiBold"
    fontSize: "40px"
    lineHeight: "46px"
    letterSpacing: "-0.8px"
  title:
    fontFamily: "HostGrotesk-SemiBold"
    fontSize: "28px"
    lineHeight: "33px"
    letterSpacing: "-0.4px"
  heading:
    fontFamily: "HostGrotesk-SemiBold"
    fontSize: "24px"
    lineHeight: "29px"
    letterSpacing: "-0.3px"
  body-large:
    fontFamily: "Manrope-Medium"
    fontSize: "19px"
    lineHeight: "28px"
  body:
    fontFamily: "Manrope-Medium"
    fontSize: "17px"
    lineHeight: "25px"
  body-strong:
    fontFamily: "Manrope-SemiBold"
    fontSize: "17px"
    lineHeight: "25px"
  label:
    fontFamily: "Manrope-Bold"
    fontSize: "17px"
    lineHeight: "22px"
  action:
    fontFamily: "Manrope-Bold"
    fontSize: "19px"
    lineHeight: "24px"
  caption:
    fontFamily: "Manrope-Medium"
    fontSize: "14px"
    lineHeight: "19px"
rounded:
  tile: "10px"
  segment: "12px"
  control: "16px"
  card: "20px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  gutter: "20px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "60px"
  button-primary-pressed:
    backgroundColor: "{colors.ember-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "60px"
  button-secondary-pressed:
    backgroundColor: "{colors.well}"
  tool-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "6px"
  tool-card-panel:
    backgroundColor: "{colors.well}"
    rounded: "14px"
    height: "84px"
  tool-badge:
    rounded: "{rounded.tile}"
    size: "36px"
  brand-mark:
    backgroundColor: "{colors.ember}"
    rounded: "{rounded.tile}"
    size: "36px"
  segmented-track:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.control}"
    padding: "4px"
  segmented-segment:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.segment}"
    padding: "6px 4px"
    height: "52px"
  segmented-segment-money-selected:
    backgroundColor: "{colors.money}"
    textColor: "{colors.white}"
  segmented-segment-health-selected:
    backgroundColor: "{colors.health}"
    textColor: "{colors.white}"
  segmented-segment-time-selected:
    backgroundColor: "{colors.time}"
    textColor: "{colors.white}"
  action-footer:
    backgroundColor: "{colors.paper}"
    padding: "12px 20px"
---

# Design System: Iskra

Recorded on 18.09.2026 from the built code at commit `b88f41d` ("init"). The only screen is the M0 foundations specimen (`src/app/index.tsx`), rendered on the iPhone 17 simulator (`.impeccable/review/phone-ios*.png`). Product truth lives in `PRODUCT.md`; the screen inventory and the rulings on the design export live in `SCREENS.md`. The source of truth for every token is `src/theme`, and `src/theme/tokens.ts` is itself a verbatim port of the website's `globals.css`. If this file and `src/theme` disagree, the code wins and this file needs a refresh.

All sizes are logical units (iOS points, Android dp). The frontmatter writes them as `px` for portability, with 1px = 1pt = 1dp.

## Overview

**Creative North Star: "The World Held in One Hand"**

The app does not have an identity of its own. It is the iskraclub.com world at phone size, as the direction contract in `src/app/_layout.tsx` puts it: paper ground, ember as the single voice of action, one colour per Poriv tool. The palette is ported value for value from the site, the tool cards reuse the site's painted texture panels, the brand mark is the site's real flame on an ember tile, and the Napredak switch is the site's Novac, Zdravlje and Vreme control. Nothing here was invented for the app; when the site changes, the app follows.

The system is calm, large and flat. `PRODUCT.md` describes the moment of use as one hand, agitated, possibly at night, with an attention span of about one sentence, so the build is organised around targets that a shaking hand can hit (a 48pt floor, a 60pt primary action pinned in the thumb zone) and type that keeps its layout as the system text size grows. Surfaces are white cards with a 1pt warm line on paper; no rendered surface casts a shadow. Motion is small and quick: a 3% press scale on iOS, the Material ripple on Android, one sliding fill in the segmented control, and all of it steps down under Reduce Motion.

The direction contract refuses the category's dark dashboard of counters and rings, and `SCREENS.md` Part 4 rejects the design export's many-card home for the same reason. The scheme is light only (`userInterfaceStyle: light`). The platform stance is `adaptive`: one visual identity on both operating systems, with the interaction layer (press feedback, headline line breaking) following each platform's native behaviour.

**Key Characteristics:**
- Warm paper ground with warm near-black ink; never a dark default.
- Ember is the only colour that asks for a tap.
- Six tool colours and three progress colours identify things; they never prompt an action.
- Host Grotesk SemiBold for headlines only, Manrope for everything a person reads or taps, both bundled with latin-ext.
- Flat surfaces: white fill and a 1pt line on paper, a sunken well for tracks, no shadows.
- Every tap target is 48pt or larger; the primary action is 60pt tall and pinned above a hairline.
- Rows stack into columns as text grows, instead of truncating or breaking words.
- Platform-native feedback: scale on iOS, ripple on Android, haptics on touch-down.

## Colors

A warm paper-and-ink ground carries one loud colour for action, plus two categorical families (tools and progress) that label things rather than invite taps.

### Primary
- **Ember** (#ec691c): the single voice of action. Fills the primary button ("Imam poriv") and the brand-mark tile, and colours the second line of a two-tone heading at 24pt or larger. Semantic role `accent`. Measures 3.1:1 on paper.
- **Ember Pressed** (#df5f13): the primary button's finger-down fill, role `accentPressed` (the site's `--color-ember-hover`). Touch has no hover, so this is a pressed state only.
- **Ember Tint** (#fdede2): role `accentTint`. On screen today only as the Moji razlozi tool tint, which shares the value.
- **Ember Wash** (#f9dcc8): role `accentWash`. Defined and ported; not yet rendered on any screen.

### Secondary
The Poriv tool colours, one pair per tool in `PRODUCT.md` order, reached through `toolColor[key]`. The glyph sits in the tool colour on a tint square, always beside the tool's label.
- **Dišem teal** (#2e8b80) on its tint (#e2f1ee): glyph on tint 3.52:1.
- **Pijem vodu blue** (#3f86c4) on its tint (#e4eef8): 3.30:1.
- **Moji razlozi ember** (#ec691c) on ember tint (#fdede2): 2.78:1, the lowest pair. Shares ember with the primary action.
- **Šetam green** (#3f8d52) on its tint (#e4f1e6): 3.50:1.
- **Odlažem indigo** (#55559a) on its tint (#e9e9f4): 5.53:1, the highest pair.
- **Beležim violet** (#7a5cc4) on its tint (#eee8f8): 4.22:1.

### Tertiary
Data colours: the Napredak progress families (reached through `progressColor[key]`) and the comparison-verdict red.
- **Money green** (#3a7a3a), deep (#2f6630), tint (#e6f0e6): base is the selected Novac segment fill under a white label (5.22:1); deep colours the unselected Novac icon.
- **Health rose** (#c2446f), deep (#a93a60), tint (#fbe7ee): base is the selected Zdravlje fill (white 4.83:1); deep colours its unselected icon.
- **Time violet** (#6b52a8), deep (#58438f), tint (#ece7f6): base is the selected Vreme fill (white 6.18:1); deep colours its unselected icon.
- The three progress tints are defined but not yet rendered. The theme's contract for them: deep on tint is 5.1:1 or better and may carry text (measured 5.87, 5.13, 6.63).
- **Verdict red** (#c24a43), tint (#fde4e1), ink (#9f3129): the site's `negative` set, for comparison verdicts only. Defined in `tokens.ts`, mapped to no semantic role, and not rendered.

### Neutral
- **Paper** (#fdfcfa): role `bg`. Screen ground, the status-bar scrim, the pinned footer, and the native splash background (`app.json`).
- **Card White** (#ffffff): role `surface`. Tool cards and the secondary button.
- **Well** (#f6f2ec): role `well`. The sunken ground: segmented-control track, the texture panel's placeholder behind its image, the secondary button's pressed fill.
- **Warm Line** (#e8e1d8): role `line`. 1pt border on cards and the secondary button; hairline border on the segmented track; hairline rule above the pinned footer.
- **Ink** (#191512): role `text`, 17.7:1 on paper. Default text and default icon colour.
- **Soft Ink** (#3b3530): role `textSoft`, 11.8:1 on paper. The lede paragraph under the display question.
- **Muted** (#6b6660): role `textMuted`, 5.5:1 on paper. The lowest text role; defined, not yet rendered.
- **White** (#ffffff): role `onAccent`. Not a site token. Labels and icons on ember and on selected segment fills; at 20% alpha it is the Android ripple on coloured fills.

### Named Rules
**The Single Voice Rule.** Ember is the only colour that asks for a tap. Moji razlozi shares its hue, so its badge stays glyph on tint and never takes a solid ember fill next to "Imam poriv".

**The Large-Only Ember Rule.** White on ember measures 3.18:1 and ember on paper 3.1:1, so both pass only as WCAG large text. A label on ember is 19pt Manrope Bold or larger, or an icon; ember text on paper is a heading at 24pt or larger.

**The Verdict-Only Red Rule.** The `negative` colours mark a comparison verdict and nothing else. They never point at the user: no slip state, no streak, no warning.

## Typography

**Display Font:** Host Grotesk SemiBold (`HostGrotesk-SemiBold`), bundled, no fallback stack
**Body Font:** Manrope in three static files: Medium, SemiBold, Bold (`Manrope-Medium`, `Manrope-SemiBold`, `Manrope-Bold`), bundled

**Character:** Host Grotesk SemiBold, tracked tight, carries the questions and section headings; Manrope carries everything a person reads or taps, from the lede to button labels. Both are the site's faces. The `expo-font` config plugin embeds them in the binary, so they exist before the first frame and offline, and all four files carry latin-ext (š č ž ć đ and the „ “ quotes), verified against each cmap.

### Hierarchy
- **Display** (Host Grotesk SemiBold, 40/46, -0.8 tracking, cap 1.3x): the single question at the top of a screen; on the specimen, the M0 acceptance string "Šta te tačno vraća cigareti?". Line height stays near 1.15 or looser so caron capitals (Š, Č, Ž) have headroom.
- **Title** (Host Grotesk SemiBold, 28/33, -0.4 tracking, cap 1.4x): in the ramp, not yet rendered.
- **Heading** (Host Grotesk SemiBold, 24/29, -0.3 tracking, cap 1.5x): section headings. The smallest size at which ember text on paper passes as large text, so it is where two-tone headings live.
- **Body Large** (Manrope Medium, 19/28, cap 2.0x): the lede paragraph, in Soft Ink.
- **Body** (Manrope Medium, 17/25, cap 2.0x): the `Text` primitive's default variant; not yet rendered on a screen.
- **Body Strong** (Manrope SemiBold, 17/25, cap 2.0x): in the ramp, not yet rendered.
- **Label** (Manrope Bold, 17/22, cap 1.6x): icon-plus-one-word labels on tool cards and segments. Read at a glance, not studied.
- **Action** (Manrope Bold, 19/24, cap 1.5x): button labels. 19pt bold is WCAG large text, which is what lets white sit on ember.
- **Caption** (Manrope Medium, 14/19, cap 2.0x): in the ramp, not yet rendered.

The `ISKRA` wordmark in the brand lockup is Host Grotesk at 20/24 with +0.6 tracking, a lockup-only override of the heading variant and not a ramp step. Display, title and heading announce themselves as headers to VoiceOver and TalkBack, and avoid a lone last word (push-out line breaking on iOS, balanced on Android).

### Named Rules
**The Weight Lives in the File Rule.** `fontFamily` is the PostScript name and is never paired with `fontWeight`. The files are named after their PostScript names, so one string resolves on iOS (by PostScript name) and Android (by file name); a `fontWeight` on top would make Android synthesise a fake bold.

**The Headlines-Only Grotesk Rule.** Host Grotesk sets display, title, heading and the wordmark. Anything a person must read to act, or tap, is Manrope.

**The Grow Without Breaking Rule.** Every variant caps the system text size: display 1.3x, title 1.4x, heading and action 1.5x, label 1.6x, body, body large, body strong and caption 2.0x. Body text may double; display type may not.

## Layout

Portrait only, phone only (`supportsTablet: false`), one column. Every full-width screen uses a 20pt side gutter.

Spacing runs on a 4pt base (4, 8, 12, 16, 24, 32, 48), tight inside a group and generous between groups. The specimen's rhythm: 40 from the brand lockup to the display question (32 + 8), 16 from the question to its lede, 48 above each section heading, 16 from a heading to its content, 12 between tool cards. Two half-steps recur inside components: 10 between an icon and its label (button, tool card, lockup) and 6 for tight insets (card padding, segment gap and vertical padding).

The tool grid is two columns at every phone width (flex basis 40%, flex grow, 12 gap). Cards in a row share its height, and the label row grows to fill the card, so a card stretched by its neighbour's two-line label keeps the same label centre line.

Scrolling chrome is fixed in place. Content scrolls under a paper scrim the height of the top safe area, so text never runs under the clock, and begins at the top inset plus 12. The primary action is pinned in a footer at the bottom: paper fill, hairline top rule in Warm Line, 12 top padding, 20 gutters, and bottom padding of max(bottom safe area, 12). The scroll content reserves the footer's height (60 + 2 x 12) plus that inset plus 32, so the last item clears it.

Large text is handled by stacking, checked at iOS XXXL and AX3 (`phone-ios-xxxl-text*.png`, `phone-ios-ax3-text-lower.png`). Above a system font scale of 1.05 the segmented control stacks icon over label in every segment at once (side by side, "Zdravlje" needs 102pt of a 109pt segment on a 375pt phone at 1.0). Above 1.2 each tool card stacks its badge over its label (side by side, the label gets about 91pt, and "Odlažem" outgrows that at 1.26x).

### Named Rules
**The Thumb Zone Rule.** The primary action is pinned at the bottom of the screen over paper, above a hairline rule, and never scrolls away.

**The 48 Floor Rule.** Every tappable element is at least 48 x 48pt whatever its visual size, one rule for both platforms. The `Pressable` primitive enforces it and ESLint blocks the raw React Native `Text`, `Pressable`, `TouchableOpacity` and `TouchableHighlight`.

**The Stack, Don't Truncate Rule.** When text grows past a component's threshold, its rows become columns; segments switch together so they keep one shared layout.

## Elevation & Depth

The system is flat. No rendered surface casts a shadow. Depth comes from three tonal steps and a line: the paper ground, white cards raised by fill alone, the sunken well for tracks and placeholders, and a 1pt Warm Line around each card (a hairline around the segmented track and above the footer). The theme defines one shadow, `elevation.raised` (iOS: ink at 8% opacity, 16 blur, 6 down; Android: elevation 3), commented "Depth only, never a coloured halo", but no surface uses it. It is therefore not part of the recorded system; whether and how shadows enter is an open decision (see Export Reference and Open Decisions).

### Named Rules
**The Line, Not Shadow Rule.** A card separates from paper by its white fill and a 1pt line border, not by a shadow.

## Shapes

Soft rounded rectangles throughout, with radius scaled to the element: the 36pt tiles (brand mark, tool badges) at 10, segments and the sliding segment fill at 12, controls (buttons, segmented track) at 16, cards at 20. Buttons are rounded rectangles, never pills; the theme's own comment on its radius scale reads "soft cards, rounded-square badges, pill buttons never". Borders are 1pt Warm Line on cards and the secondary button, and a hairline (one device pixel) on the segmented track and the footer rule. The painted texture panel inside each tool card is clipped to its own radius.

Two scale entries are recorded here without a theme key. The `tile` radius of 10 is hard-coded in both 36pt tiles, while the theme's `radius.badge` is 12 and unused. The `segment` radius of 12 is computed as the control radius minus the track padding. The theme also defines `radius.sheet` (28), which nothing uses because no sheet exists yet.

### Named Rules
**The Concentric Corner Rule.** A nested corner is the outer radius minus the inset: the 20pt card with 6 padding holds a 14pt texture panel, and the 16pt track with 4 padding holds 12pt segments.

## Components

Every component is built from four primitives in `src/components/primitives` (Text, Pressable, Button, Icon), which ESLint makes the only route for text and taps.

### Pressable (every tap)
- **Target:** never smaller than 48 x 48pt; announces itself as a button, and as disabled when it is.
- **iOS feedback:** scales to 0.97 on touch-down (90ms, ease-out quad) and back on release (220ms, ease-out expo). With Reduce Motion it dims to 70% opacity instead. List-row style controls (segments) opt out of the scale.
- **Android feedback:** the Material ripple, drawn in the foreground and clipped: ink at 12% on light fills, white at 20% on coloured fills.
- **Haptics:** on touch-down when opted in. Light for buttons and tool cards, medium for "Imam poriv", a selection tick when a segment changes.
- **Disabled:** 45% opacity.
- **Focus:** no custom focus treatment is built; platform defaults apply.

### Buttons
- **Shape:** gently rounded rectangle (16), full width, at least 60 tall, 24 horizontal padding.
- **Primary:** ember fill, white Action label (19pt Manrope Bold), optional 22pt Lucide icon leading the label with a 10 gap. Pressed: Ember Pressed fill plus the platform feedback above. On the specimen it is "Imam poriv" with the flame glyph and a medium haptic.
- **Secondary:** Card White fill, 1pt Warm Line border, ink label; pressed fill is the well. Built in `Button`, not yet rendered on a screen.
- **Hover:** none; touch only.

### Tool Card (signature)
- **Structure:** white card (20 radius, 1pt Warm Line, 6 padding). On top, the tool's painted texture panel from iskraclub.com, 84 tall, 14 radius, cover-fit over a well placeholder. Below, a 36pt badge (tool tint fill, 10 radius, 20pt Lucide glyph in the tool colour) beside the tool's one-word Label, at most two lines.
- **Glyphs:** Dišem Wind, Pijem vodu GlassWater, Moji razlozi Heart, Šetam Footprints, Odlažem Hourglass, Beležim SquarePen (`src/features/poriv/tools.ts`).
- **Large text:** above font scale 1.2 the badge stacks over the label.
- **Behaviour:** the whole card is one Pressable with a light haptic; its accessibility label is the tool's label and the glyph is decorative.

**The Label Carries the Meaning Rule.** A tool glyph sits in the tool colour on its tint only beside its text label, because glyph-on-tint contrast runs from 2.78:1 (Moji razlozi) to 5.53:1 (Odlažem). A glyph standing alone, with no label, goes white on the solid tool colour (3.18:1 or better).

### Segmented Control (the Napredak switch)
- **Track:** well fill, 16 radius, hairline Warm Line border, 4 padding.
- **Segments:** equal width, at least 52 tall, 12 radius, a 20pt icon and a Label; 6 gap inline, 4 gap stacked. Unselected: ink label, icon in the segment's deep colour.
- **Selected:** a fill in the segment's own colour slides under it (260ms, ease-out expo, on the UI thread) and its label and icon turn white. With Reduce Motion the fill jumps. Any colour passed as a selected fill must carry a white label at 4.5:1 or better.
- **Behaviour:** tablist and tab roles with selected state; a selection haptic on change; tapping the selected segment does nothing.

### Brand Lockup
- **Structure:** a 36pt ember tile (10 radius) holding the real white flame from iskraclub.com at 12 x 22, then a 10 gap and the `ISKRA` wordmark in ink (Host Grotesk 20/24, +0.6 tracking). At least 48 tall, top-left of the screen.
- **Accessibility:** announced as a single image labelled "Iskra".

### Pinned Action Footer
- **Style:** paper fill, hairline Warm Line top rule, 12 top padding, 20 gutters, bottom padding of max(bottom safe area, 12). Holds the primary button (see Layout).

### Icons
- **Set:** Lucide (`lucide-react-native`) at stroke 1.9 with round joins. Rendered at 20 (badges, segments) and 22 (buttons); the primitive defaults to 24 in ink.
- **Accessibility:** decorative by default and hidden from screen readers; the control around the icon carries the Serbian label. Never an icon font, never an emoji.

### Imagery
- Every shipping raster is a copy of an iskraclub.com asset logged in `assets/PROVENANCE.md`: the six painted tool textures (resized to 720px wide) and the white flame (unmodified). Re-export from the site; never edit the copies.

## Do's and Don'ts

### Do:
- **Do** take every colour from `@/theme`: semantic roles (`color.text`, `color.accent`, `color.line`) for UI, `toolColor[key]` and `progressColor[key]` for the categorical families. Never a hex value in a screen.
- **Do** render all text through the `Text` primitive with a ramp variant, and every tap through `Pressable` or `Button`.
- **Do** set any label on an ember fill at 19pt Manrope Bold (the Action variant) or larger, or use an icon alone.
- **Do** keep ember text on paper to headings of 24pt or larger; the two-tone heading sets its first line in ink and its second in ember.
- **Do** pair every tool glyph (tool colour on its tint, 36pt badge, 10 radius) with the tool's label.
- **Do** keep tap targets at 48pt or larger and the primary action 60pt tall, pinned at the bottom above a hairline.
- **Do** give any side-by-side row that would break a word at large text a font-scale stacking threshold, and check it at iOS XXXL and AX3.
- **Do** nest corners concentrically (outer radius minus inset).
- **Do** rebuild design-export screens by remapping them onto these tokens, as `SCREENS.md` rules.

### Don't:
- **Don't** pair `fontFamily` with `fontWeight`; the weight lives in the font file.
- **Don't** give Moji razlozi a solid ember fill next to "Imam poriv"; ember is the single voice of action.
- **Don't** point the `negative` colours at the user: no slip state, no streak, no warning.
- **Don't** port `colors_and_type.css` from the design export, or take any colour or type value from it; its ember (#E8621A) and Manrope-only type are superseded by the tokens above.
- **Don't** make a button a pill.
- **Don't** add a shadow to a surface while the elevation decision below is open; today the system is flat.
- **Don't** build a dark ground or a dark scheme ad hoc; no role for one exists yet.
- **Don't** use an icon font or emoji; icons are Lucide at 1.9 stroke.

## Export Reference and Open Decisions

### The design export
`ISKRA - mobile claude design export/` is a high-fidelity layout and interaction reference for the screens of M2 to M5 (onboarding, the home states, detail screens, the Poriv flow, the slip flow). It is reference, not instruction, and it is not a token source. `SCREENS.md` arbitrates which parts of it are still true. The rulings that touch this system:
- The export's `colors_and_type.css` is not ported. Its ember and its Manrope-only type are superseded by the site tokens already in `src/theme` (SCREENS.md, conflict 6). Export screens are rebuilt by remapping onto the current tokens.
- The six Poriv tools are those in `src/features/poriv/tools.ts`. The export's Posmatram and Igram se are cut (SCREENS.md, conflict 1).
- The export's signature photo-texture move, a photo in soft-light blend on an ember surface, is kept as a rule and limited to one per screen (SCREENS.md, Part 4). It is not built yet, and the system above records nothing about how it renders.

### Open for M2 and M3 (not resolved here)
- **Radius steps.** The export's scale is 12 input, 14 chip, 16 button, 18 card, 20 large card, 26 hero, 999 pill. Its 12, 16 and 20 match values in the built scale. Its 14, 18 and 26 have no built counterpart. The export sizes sheets at 20; the theme's unused `radius.sheet` is 28. Separately, the built tiles hard-code 10 while the theme's unused `radius.badge` is 12.
- **Pill shapes.** Built buttons are never pills. The export uses its pill radius for option and countdown pills; whether a pill step exists for anything other than buttons is undecided.
- **Shadows.** The export has a soft card-shadow set (shadow-sm, shadow-card, shadow-soft) and two coloured shadows (shadow-ember, shadow-hero). The app has one shadow, `elevation.raised`, unused, whose comment rules out a coloured halo. Whether cards get any shadow, and which, is undecided.
- **`[DARK]` screens.** SCREENS.md's reworked onboarding marks Cost, Reflection, FearReflection, Preview, Commitment and Summary as `[DARK]`; in the export these sit on a full ember or dark ground with white titles, white cards and a white status bar. None is built. The app is light only, and `src/theme` has no role for an ember or dark screen ground, so they are a future need. Any ember-ground screen stays bound by the Large-Only Ember Rule. The export's Poriv mode hub is also on a dark ground; SCREENS.md keeps the screen without ruling on its ground.
- **Photo-texture scope.** SCREENS.md limits the soft-light photo on ember to one per screen. It does not say whether the tool cards' painted panels count toward that limit; the specimen shows six of them on one screen, as the site's tools section does.

### Not yet verified
- The Android rendition has not been captured: this machine has no Android SDK and the EAS Android build is pending. Ripple, balanced line breaking, font resolution by file name and elevation on Android are built but unseen.
- The app icon and the Android adaptive-icon foreground are Expo template placeholders (`assets/PROVENANCE.md`).
- Defined but not yet rendered: the Title, Body, Body Strong and Caption variants; Muted; Ember Wash; the three progress tints; the verdict reds; the secondary button. Check each at its first real use.
