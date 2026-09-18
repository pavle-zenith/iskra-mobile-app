# M0 Android checklist

M0 is not done until the acceptance screen has been seen on a real Android phone. iOS was
verified on the iPhone 17 simulator on 18.09.2026 and passed its finish review; Android could
not be captured (no Android SDK on the build machine). Run this on the first EAS Android
development build.

```
eas init                                   # once, under the owner you want
eas build --profile development --platform android
# install the build, run `npm start`, open the app, then:
adb exec-out screencap -p > .impeccable/review/phone-android.png
```

Capture the screen at the top (`phone-android.png`) and scrolled to the bottom
(`phone-android-lower.png`), then check:

1. **Font resolution.** "Šta te tačno vraća cigareti?" is Host Grotesk, not Roboto. Compare
   the "g", "?" and "ć" with the iOS capture. No synthetic bold anywhere, including the ember
   line of "Gledaj kako napreduješ."
2. **Diacritics not clipped.** The caron on "Š" and the accent on "ć" are whole at the top of
   the line box: "Šta", "Šest", "Šetam", "Beležim", "Odlažem"
3. **Heading breaks.** The question sits on two lines with no lone last word. "Šest alata za
   trenutak / kad ti se najviše puši." keeps the site's break
4. **Edge-to-edge.** Dark status-bar icons on paper; the lockup starts below the status bar;
   the navigation-bar buttons are dark; "Imam poriv" clears both gesture and 3-button nav
5. **Press feedback.** The ripple is clipped to the rounded corners of cards and the button,
   and the ember button does not look double-pressed (ripple plus darker fill)
6. **Font scale.** `adb shell settings put system font_scale 1.3`, then 2.0 (restore 1.0):
   tool labels never break mid-word, the Novac / Zdravlje / Vreme segments stack together
7. **Config.** "Srpski (latinica)" appears in the app's per-app language list

Open decisions that affect Android:
- Android tablets can install the app today (iOS opts out of iPad). Restrict in the Play
  Console device catalogue, or decide to support them
- `predictiveBackGestureEnabled` is `false` from the Expo template; revisit when M3 adds stacks
