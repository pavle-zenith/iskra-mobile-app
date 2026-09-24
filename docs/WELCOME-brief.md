# WELCOME brief: the intro before the questions

For the code agent. Pavle, 24.09.2026: the splash is too simple. It becomes a three-beat intro
with painted artwork, then the consent screen (`docs/LEGAL-brief.md`), then step 1 (name). The
17 counted steps do not change; the intro is uncounted, like the splash was.

The Refero pass is done (below). Copy it into `.impeccable/review/welcome/REFERENCES.md` and
add anything you find yourself.

---

## The three beats

Swipeable horizontally, with a primary button that advances, three dots, and **Preskoči** top
right on beats 1 and 2 (it jumps to beat 3, never past it: beat 3 carries the promise that keeps
people through a slip). No back button on beat 1.

| Beat | Art | What it says |
|---|---|---|
| 1. Dobrodošlica | `welcome-1-zora` : first light cresting the hills, a path starting | What Iskra is |
| 2. Poriv | `welcome-2-oluja` : a dark cloud passing, light returning | The craving moment, the core of the product |
| 3. Put | `welcome-3-put` : a long unbroken path, one small walker | A slip does not erase the days |

### Copy, approved by Pavle 24.09.2026

**Beat 1**

- Headline, two-tone (ink line, ember line): **Prestani da pušiš.** / **Ovaj put imaš plan.**
  (the site's hero, same words on purpose: the ad, the site and the app say one thing)
- Sub: Srpska aplikacija za prestanak pušenja. Prati svoje zdravlje, finansije i oslobodi se
  nikotinske zavisnosti.
- Button: **Dalje**
- Under the button, small text link: **Već imaš nalog? Prijavi se** (see `docs/ACCOUNT-brief.md`)

**Beat 2**

- Headline: **Poriv traje 3 do 5 minuta.** / **Iskra te provede kroz njega.**
- Sub: Jedan dodir na „Imam poriv" otvara alate koji pomažu da prođe. Radi i bez interneta.
- Button: **Dalje**

**Beat 3**

- Headline: **Jedna cigareta i sve propadne?** / **Ne propadne.**
- Sub: Ukupno vreme bez cigarete ostaje tvoje. Iskra pomaže da nastaviš, dan po dan.
- Button: **Počnimo**

All of it is genderless, so `g()` is not needed and `splash.line2` with its gender branch goes
away. Every claim is true of the build: "radi i bez interneta" (M1/M3), "ukupno vreme ostaje"
(`smokeFreeMs` ignores slips). If any of them stops being
true, the line changes, not the code.

## Layout

- Full-bleed painting behind everything, status bar light.
- The lower ~45% fades from transparent to `color.bg` (paper) with an SVG linear gradient
  (`react-native-svg` is installed; do not add a dependency for this). Text and button sit on
  the paper end of that fade in ink, so contrast never depends on the painting.
- Top left: the flame mark and wordmark, as today, in white over the sky.
- Headline in Host Grotesk, `display`, two lines: first ink, second ember. Sub in Manrope `body`,
  `textSoft`, max two to three lines on an iPhone SE.
- Dots above the button; the button is the existing primary `Button`, full width.
- **One texture per screen:** the painting is it. No texture panels, no cards.

## Motion

- The painting drifts very slowly (scale 1.00 → 1.06 over ~20s, Reanimated, UI thread). On a
  beat change the art cross-fades (~400ms) while the text slides.
- **Reduce Motion on:** no drift, instant art change, text fades only.
- Nothing autoplays forward. The person moves at their own pace.

## Artwork

Generated in Higgsfield on 24.09.2026 with the site's `bands/path-poriv-mobile.jpg` as the style
reference, so they sit in the same painted world as iskraclub.com. 1520 x 2688, 9:16.

**Already in the repo, approved by Pavle 24.09.2026:** `assets/welcome/welcome-1-zora.jpg`,
`welcome-2-oluja.jpg`, `welcome-3-put.jpg`. 1080 x 1910 JPEG, q82, 235 to 305 KB each. Do not
download or re-encode them. Bundle them with `require`, so the intro renders offline on first
launch.

Add three rows to `assets/PROVENANCE.md`: "Generated with Higgsfield (gpt_image_2_5), 24.09.2026,
style reference iskraclub.com/bands/path-poriv-mobile.jpg, approved by Pavle. Resized from 1520 x
2688." The full-size originals stay in Pavle's Higgsfield account for store screenshots and
social.

Composition notes, checked by eye:

- **Zora** and **Put** both have the footpath running into the bottom third, which is where the
  text sits. The fade to paper handles it; start the fade a little higher on these two if the
  sub-headline loses contrast on an iPhone SE
- **Put:** the walker is a few pixels high, around 55% from the top. Keep the crop so it stays
  visible (`resizeMode="cover"`, anchored centre); on a very tall screen do not let it slide
  under the headline
- **Oluja:** the rain streaks sit on the right; nothing to adjust

## Refero pass (24.09.2026)

| Reference | Taken | Not taken |
|---|---|---|
| [Breathwrk welcome](https://refero.design/screens/1d6637a7-f03e-49f6-bf95-5828d97a0ad5) and [problem statement](https://refero.design/screens/1220e013-892f-4b21-947a-12be3f315437), [flow 7724](https://refero.design/flows/7724) | A short sequence that states the problem and the payoff **before** any question; one big claim per screen | Its social-proof row ("1 Billion breaths", App of the Day): Iskra has no such numbers and never invents them. Emoji chips |
| [Calm intro](https://refero.design/screens/a375ea8b-a4fb-4e30-a905-20e939089928) | Three beats with dots, Next and Skip; the screen itself feels like the product (calm, slow) | Close button on the first screen: there is nowhere to close to |
| [Ada intro](https://refero.design/screens/d5481ab6-d3d4-4750-8fb6-7d9a979dcb90), [flow 4094](https://refero.design/flows/4094) | Art above, one headline and one line below, pagination, then **consent before account**: the same order as Iskra's consent screen | "Create account / Log in": Iskra has no accounts |
| [Waterllama splash](https://refero.design/screens/064893a3-657f-4b84-93a6-99b14ca29263) | One large piece of art carries the brand's warmth | Mascot and playful tone: wrong register for someone trying to quit |
| [Haptic welcome](https://refero.design/screens/6062d608-0546-4831-a711-2a089f6629de) | Plain statement of what the product is, in one sentence (beat 1's sub) | Text-only screen, which is exactly the "too simple" problem |

## Acceptance

- [ ] Three beats in this order, swipe and button both work, Preskoči lands on beat 3
- [ ] Beat 3's "Počnimo" opens the consent screen; nothing is written before consent
- [ ] Art bundled from `assets/welcome/`, renders in aeroplane mode on first launch
- [ ] Text readable on every beat on iPhone SE and Pro Max, and at the largest Dynamic Type size
- [ ] Reduce Motion respected
- [ ] Zero slashes, em dashes, English or invented numbers
- [ ] Screenshots of all three beats in `.impeccable/review/welcome/`
