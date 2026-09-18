# Asset provenance

Every raster that ships in the app, and where it came from.

| File | Origin | Notes |
|---|---|---|
| `tools/disem.jpg` | https://www.iskraclub.com/tools/disem.jpg | Downloaded 18.09.2026. Resized 1024 → 720px wide, JPEG q82 |
| `tools/voda.jpg` | https://www.iskraclub.com/tools/voda.jpg | Same |
| `tools/razlozi.jpg` | https://www.iskraclub.com/tools/razlozi.jpg | Same |
| `tools/setam.jpg` | https://www.iskraclub.com/tools/setam.jpg | Same |
| `tools/odlazem.jpg` | https://www.iskraclub.com/tools/odlazem.jpg | Same |
| `tools/belezim.jpg` | https://www.iskraclub.com/tools/belezim.jpg | Same |
| `brand/iskra-flame-white.png` | https://www.iskraclub.com/brand/iskra-flame-white-trim.png | Downloaded 18.09.2026, unmodified. 140x275, the real brand mark |
| `fonts/*.ttf` | Google Fonts static builds via `@expo-google-fonts/host-grotesk@0.4.1` and `@expo-google-fonts/manrope@0.4.2` | SIL OFL 1.1, licences alongside |
| `icon.png`, `android-icon-*.png` | Expo `blank-typescript` template | **Placeholders.** Replace with the Iskra app icon before any build leaves the team |

The website repo (`iskra-website-final/public/`) is the source of truth for the tool textures
and the flame. If the site changes them, re-export from there rather than editing these copies.
