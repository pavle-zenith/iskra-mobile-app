# Iskra — project notes

Quit-smoking app for the Serbian market (Latin script). iOS / iPhone 15 Pro mockups built in React + Babel inside `frames/ios-frame.jsx`, font **Manrope**.

## ⏩ OPEN HANDOFF TASKS (next chat — read first)
- **Clean hero phone recapture (pending):** the landing hero (`Iskra Landing.html`) right-half landscape panel shows a static framed iPhone via `.hero-visual .hero-phone` (img `mockups/home.png`) styled in `landing/styles.css`. It currently uses `object-fit:cover` + `transform:scale(1.07)` to hide the app's own off-white side padding. PROPER FIX: open `Iskra Home v3-1.html`, reset `#stage` transform to render 1:1 at design size **402×874**, capture + trim to the app screen ONLY (no device bezel, no surrounding canvas), save as e.g. `mockups/home-hero.png`, point `.hero-visual .hero-phone` at it, and drop the `transform:scale()` zoom (a true 402×874 frame fills the CSS bezel with no letterbox). Preview pane was flaky at end of last session — a fresh chat is cleaner.
- **Higgsfield hero video (in progress):** 9:16 SaaS phone explainer. Latest job `941f78ce-9e6b-4d0f-9c1c-6e15c7460861` (Cinema Studio Video 3.0) — check Higgsfield Generations. Start frame = `landing/hero-video-frame.jpg` (1080×1920 ember + framed home screen); imported Higgsfield image media_id = `47bb539e-0c06-4786-b5b1-755bdb46a2ec` (reuse as `medias[].value` to re-run). NOTE: Seedance 2.0 false-flagged warm "floating embers/bokeh" prompts as NSFW — use steady **product-shot** prompts ("no people/hands/faces", solid bg, slow zoom) on Cinema Studio 3.0 / Kling 3.0 instead. When a clip is approved, swap the hero's `.hero-visual-bg` to play the video file in that right-half panel.

## Landing page (marketing site)
`Iskra Landing.html` + `landing/styles.css` (offline build: `Iskra Landing (offline).html` via super_inline_html). Serbian pre-launch waitlist/Early-Access site. Sections: hero (2-col: left copy on light, right full-height **landscape panel** `landing/hero-bg.jpg` sliding behind the floating pill nav, rounded inner corners, framed phone centered) → trust bar (institutions + disclaimer) → empathy "RAZUMEMO" (orange mtn contour `landing/mtn-orange.png` faded bottom) → audience "ZA TEBE JE AKO" (editorial bento, 5 icon cards) → feature grid "TVOJ SAPUTNIK" (6 cards, phones peek ~50% via fixed-height `.featc`+object-fit) → how-it-works "KAKO RADI" (staggered bento, plan chips / savings bars / poriv ring / weekly tracker) → toolkit "PORIV MOD" (dark, full-bleed horizontal scroll rail, real photo textures `landing/tex-*.jpg`) → savings chart (selectable pills) → knowledge "SAZNAJ" (expanding slider + abstract gradient thumbs + Iskra Blog CTA) → stat band → joinflow "KADA SE PRIJAVIŠ" → reviews marquee (2 rows, illustrated avatars `landing/av-*.png`, 2.596+) → mechanism "ZAŠTO JE DRUGAČIJE" (**ember-inverted** bg, white cards) → comparison "UPOREDI PRISTUPE" (dark, beige mtn `landing/mtn-beige.png`) → Early Access offer (replaced pricing) → FAQ (8) → footer (dark, beige mtn). Mountain overlays: `.mtn-o` orange on warm sections, `.mtn-w` beige on dark sections.

## Design standards
- Brand accent (ember): **#E8621A** (deep gradient top `#F0701F`). Soft tint `#FEF0E8`. App bg warm off-white `#FDFCFA`/white; warm interstitial `#FEF6F0`.
- Primary text `#1A1A1A`, secondary `#999`, muted `#888`/`#BBB`.
- Bigger/primary text (headlines, big numbers, question titles) are **semibold (600)**. Buttons are **bold (700)**.

## Selected / active state pattern (IMPORTANT — reuse everywhere)
When an option card/pill is selected, use the **inverted** style:
- Card background → **ember** (gradient `#F0701F → #E8621A`), with a soft ember shadow.
- Label / title / subtitle text → **white**; chevrons → white.
- If the card has an **icon container chip**, the chip **stays white** and the **icon turns ember (#E8621A)**.
- If the icon sits with no chip (e.g. reasons/fears pills), the **icon turns white**.
Unselected = white card, gray border, icon in its own category color.

## Inverted "summary/AHA" screens
Some reflection/insight screens use a full **ember background** with white title/subtitle, **white cards** kept intact (colored icons, dark body, ember bold lines), white status bar/home indicator (`<IOSDevice dark>`), and a **white button with ember text**.

## Photo hero card (Liven-style — REUSABLE across tabs/pages)
A page header can be a **rounded photo container** holding the title + subtitle (instead of plain text on the app bg). First used on `MilestoniScreen.jsx`. Recipe:
- Full-width rounded card `borderRadius: 26`, `overflow: hidden`, `minHeight ~188`, `backgroundImage` cover, `backgroundPosition: 'center 28%'`, soft shadow `0 10px 26px rgba(70,110,150,0.18)`.
- `display:flex; flexDirection:column; justifyContent:flex-end` so text sits bottom-left; padding `22px 22px 20px`.
- **Legibility scrim** absolutely-positioned over the image: `linear-gradient(180deg, rgba(40,70,110,0) 32%, rgba(40,70,110,0.22) 70%, rgba(40,70,110,0.42) 100%)`, `pointerEvents:none`.
- Title: white, 30px, weight 700, `textShadow: 0 1px 12px rgba(30,60,100,0.28)`. Subtitle: white 92%, 14px, weight 500, similar shadow. Both `position:relative` to sit above the scrim.
- Give the scroll container ~`68px` top padding so the card clears the status bar. Test image saved at **`assets/sky-bg.webp`** (a clouds/sky photo, like Liven's hero imagery).

---

# BUILD LOG (for handoff — read this first)

## Architecture
- Every screen is a React component in `screens/<Name>.jsx`, transpiled in-browser by Babel. Each file ends with `Object.assign(window, { ComponentName })` to expose itself.
- Each standalone screen also has a sibling launcher `Iskra <Name>.html` that mounts just that screen inside `<IOSDevice>` (see any existing one for the boilerplate: Manrope font, React 18.3.1 + Babel pinned tags, `#stage` scale-to-fit at design size **402×874**).
- The device frame is `frames/ios-frame.jsx` exposing `<IOSDevice>`; pass the `dark` prop (`<IOSDevice dark>`) for inverted/ember screens so the status bar + home indicator turn white.
- `Iskra Prototype.html` is the connected flow: it loads ALL screen files + `HomeScreenV3.jsx`, then a `Flow` component walks an ordered `STEPS` array, persisting the index in `localStorage['iskra_proto_step_v2']`. A `DARK` Set marks which steps render with `<IOSDevice dark>`.

## CRITICAL: global-scope collisions in the prototype
In-browser Babel runs every `<script type="text/babel">` in **shared global scope**, and compiles top-level `const` like `var` (last definition wins). Several screens defined identically-named helpers (`Coin`, `Bird`, `People`, `Flame`, `Stars`, `Check`, `Cal`, `BENEFITS`, `REASONS`, `CARDS`, …). When combined, the last-loaded one clobbered the rest — e.g. Paywall's `BENEFITS` (strings) overwrote Preview's `BENEFITS` (objects with `.Icon`), crashing Preview with "Element type is invalid: undefined".
**Fix in place:** every `screens/*.jsx` is wrapped in an IIFE — first line `/* __IIFE_WRAPPED__ … */` then `;(function () {` … `})();` — so helpers stay file-local while `Object.assign(window, …)` still exposes the component. **When creating a NEW screen file, wrap it the same way** (or give every top-level helper a file-unique prefix). Do not add bare top-level `const Coin = …` etc.

## Flow order (STEPS in Iskra Prototype.html) + component + key copy
1. welcome — `SplashScreen` (onStart/onLogin)
2. name — `OnboardingName` (2/11 progress — note: early screens use /11, later ones /18; not yet normalized)
3. gender — `OnboardingGender` ("Kako da te oslovljavamo?")
4. cigarettes — `OnboardingCigarettes` (stepper, "Koliko cigareta dnevno…")
5. price — `OnboardingPrice` (free input + RSD/EUR currency toggle, default RSD)
6. cost — `OnboardingCost` **[DARK]** AHA reveal "146.000 RSD", "= 10 dana odmora na moru"
7. reasons — `OnboardingReasons` (multi-select, max 3, inverted-selected pills)
7b. reasonText — `OnboardingReasonText` (free-text personal reason; textarea + 120-char counter, scrollable example chips that fill the field, privacy note; comes right after reasons)
8. reflection — `OnboardingReflection` **[DARK]** 3 reassurance cards (Zdravlje/Porodica/Sloboda)
9. fears — `OnboardingFears` (multi-select, inverted-selected pills)
10. fearReflection — `OnboardingFearReflection` **[DARK]** 3 cards (porivi/stres/kafana)
11. triggers — `OnboardingTriggers` (multi-select, inverted-selected pills; 6 in 2-col grid + full-width "Čekanje i dosada"; "Kada ti se najviše puši?")
12. timing — `OnboardingTiming` (single-select, auto-advance, inverted-selected)
13. date — `OnboardingDate` (interactive calendar, June 2026, "Potvrdi datum")
14. preview — `OnboardingPreview` **[DARK]** 3 benefit cards + Marija testimonial (verified ✓, 5 stars)
15. panic — `OnboardingPanic` (panic-button demo; advances when the big button is pressed, no separate Nastavi)
16. commitment — `OnboardingCommitment` **[DARK]** ceremonial signature/contract: ISKRA wordmark, "Pavle, sklapamo dogovor.", 4 pledges w/ white-circle+ember-tick checkmarks, interactive `<canvas>` signature pad (pre-filled sample, X clears, draw your own), white "Potpisujem" CTA. NO progress bar.
17. summary — `OnboardingSummary` **[DARK]** scrollable recap: savings area-chart, 2×2 stat grid, health timeline, razlozi, "Počinjemo"
18. notifications — `OnboardingNotifications` (bell + 3 preview notif cards; onNext/onSkip)
19. review — `ReviewModal` (iOS-style rate prompt, 5 stars, "Oceni Iskru"/"Ne sada")
20. paywall — `Paywall` (long scroll: countdown, data pills, tiers Mesečno/Godišnje[full-width popular banner header]/Doživotno, CTA, payment trust, benefits, money-back, "Dva puta napred" red/green compare, reviews, FAQ accordion; onBuy/onFree → Home)
21. home — `HomeScreenV3` (the main app home; current canonical home screen)

## Time detail (Tvoje vreme)
- `TimeScreen.jsx` (`Iskra Time Detail.html`) — scrollable "Tvoje vreme" timeline detail on white, amber `#BA7517` accent: back + "Tvoje vreme" + share top bar; **ember hero card** ("SLOBODAN/NA VEĆ" label, 2×2 translucent-white time grid 47 dana/06 sati/18 minuta/32 sekunde, divider, italic "od poslednje cigarete"); **full milestone cards** under "Šta si sve preživeo/la" (white past cards w/ green dot + day + title + green icon: plane/rocket/wave/moon/brain; ember-tint current card "TI SI OVDE" badge + "Dan 47" + "Duže od Artemis misije." + "Samo još 19 dana do sledećeg."; 50%-opacity upcoming cards Dan 66–365), "Prethodni pad" card (rose cal, 12. april 2026.), "Vreme koje si povratio/la" (109 sati / 4.5 dana amber), outlined amber "Podeli svoju pobedu". Takes `onBack`. **Opened from Home** by tapping the live-countdown "SLOBODAN SI" card (Countdown3 now a button w/ onClick → `setView('time')`, guarded by `window.TimeScreen`). Loaded in prototype + standalone Home launcher.

## Money saved detail
- `MoneyScreen.jsx` (`Iskra Money Saved.html`) — scrollable "Uštedine" detail on white: back + "Uštedine" + share top bar; hero (gold coin, "18.800 RSD" green `#3A7A3A`, "u 47 dana slobode"); cards — smooth SVG area chart "Rast uštedina" (green line/light-green fill, Dan 1–47), "To je kao..." equivalents (ćevapi/vikend/Netflix), "Ako nastaviš" projections (dnevno→godišnje), cigarettes counter (940 / 47 kutija), milestone (trophy, ember 94% progress to 20.000 RSD), **cigarettes crosslink card** (red cig-off icon, "940 cigareta", chevron → cigarettes screen), outlined ember "Podeli svoju pobedu" button. Takes `onBack` / `onCigarettes`. **Opened from Home** by tapping the RSD stat card (`setView('money')`, guarded by `window.MoneyScreen`; StatCard3 now renders as a button with optional onClick). Loaded in prototype after PorivEntry.

## Cigarettes avoided detail
- `CigarettesScreen.jsx` (`Iskra Cigarettes Avoided.html`) — scrollable "Odbijene cigarete" detail on white, **red `#C24A43`** accent (cigarette category, matches Home stat card): back + "Odbijene cigarete" + share top bar; hero (cig-off icon, "940" blue, "cigareta odbijeno", "u 47 dana slobode"); cards — "Cigarete po danu" 7 equal blue weekly bars, "Šta nisi uneo/la u sebe" health impact (470g katrana lungs-blue / 940mg nikotina molecule-purple / 109 sati clock-green), pack count (940 cigareta / 47 kutija / 4 dana pušenja), "Ako nastaviš" projections (nedeljno→za 5 godina), **money crosslink card** (green coin, "18.800 RSD", chevron → money screen), outlined blue "Podeli svoju pobedu". Takes `onBack` / `onMoney`. **Opened from Home** by tapping the "cigareta odbijeno" stat card (`setView('cigarettes')`, guarded by `window.CigarettesScreen`). Loaded in prototype after MoneyScreen.

## Settings screen
- `SettingsScreen.jsx` (`Iskra Settings.html`) — long scrollable profile/settings on bg `#FDFCFA`: back arrow + "Podešavanja", profile card (P avatar, "Slobodan 47 dana", member-since), section cards **Moj profil / Podešavanja (Notifikacije toggle + Jezik) / Premium / O Iskri / Moje iskustvo**, danger zone (gray "Počni iznova" + red "Odjava"), version footer. Takes `onBack`. **Opened from Home** by tapping the greeting/avatar button (HomeScreenV3 `setView('settings')`, guarded by `window.SettingsScreen` so the standalone Home launcher no-ops). Loaded in the prototype after HomeScreenV3.

## Poriv flow (craving) — two screens
- **`PorivEntry.jsx` (`Iskra Poriv Entry.html`)** — transitional entry on warm `#F0EDE8` (signals mode shift): X close (→ home), "Koliko jak je poriv?" with a **custom range slider** (1–10, ember fill + white thumb, big ember number above, Blag/Jak/Nepodnošljiv labels), "Šta te navelo?" single-select trigger pills (Jutarnja kafa/Stres/Posle jela/Kafana/Dosada/Nešto drugo, ember-tint selected), "Pokreni" CTA (disabled until slider moved AND a trigger picked) + "Porivi traju 3 do 5 minuta. Prođe uvek." Takes `onStart({strength,trigger})` / `onClose`.
- **`PorivMode.jsx` (`Iskra Poriv Mode.html`)** — full-screen **dark** immersive hub (bg `#1A1410`, white text, `<IOSDevice dark>`): top bar (X close + ember "PORIV MODE" eyebrow + "Nivo N" ember pill reflecting entry strength), hero **live countdown ring** (200px, ember arc on white-8% track, depletes over 5 min, "4:23 / minuta" inside), pulsing ember **breathing dot + "Udahni..."**, "IZABERI ALAT" label, 2×3 colored tool grid (Dišem teal / Igram se purple / Moji razlozi ember / Pijem vodu blue / Šetam green / Posmatram dark-warm `#3D3830`), bottom 2px ember progress bar with "Porivi traju 3 do 5 minuta." (left) + underlined "Ipak sam zapalio/la" slip link (right). Takes `onClose` / `onSlip` / `level`.
- **Flow**: Home "Imam poriv" → `setView('poriv')` = PorivEntry → `onStart({strength,trigger})` (strength passed as `level`) → `setView('porivMode')` = PorivMode → close → home. Both guarded by `window.PorivEntry`/`window.PorivMode` so the standalone Home launcher no-ops. Both loaded in the prototype after SettingsScreen.
- **Home footer**: the big full-width ember **"Imam poriv"** button (fixed, above bottom nav) opens the Poriv flow. The retroactive **"Zapalio/la sam"** slip log is a muted outlined button inside the scrollable "Moj napredak" section (with "Beležimo sve — bez osude."), deliberately away from "Imam poriv". (The earlier inline 3-link row was removed; "Prebrodio/la sam" is not currently surfaced.)

## Category detail (Moj napredak)
- `CategoryScreen.jsx` (`Iskra Category Detail.html`) — scrollable roadmap/timeline detail, **template for all 6 Moj napredak categories** (config in `CATEGORIES` map; only Zdravlje built out so far). Zdravlje rose `#D4547E`: back + amber "Za 23:14:33" next-milestone pill top bar; header "Zdravlje" 32px + heart icon "7 / 12 postignuto"; **vertical milestone timeline** w/ connecting line — achieved rows (filled rose dot + title + date), current row (ring dot + title + rose progress bar + %), upcoming rows (empty gray dot + muted title + "Za N dana"); WHO/CDC disclaimer info card at bottom. Takes `cat` (default 'zdravlje') / `onBack`. **Opened from Home** by tapping a "Moj napredak" goal card (`onOpen(key)` → `setView('cat:'+key)`; currently only zdravlje wired, guarded by `window.CategoryScreen`). Loaded in prototype + standalone Home launcher.

## Navigation contract
- Every screen takes `onNext` / `onBack` (selection screens auto-advance via onNext; multi-selects need ≥1 choice to enable "Nastavi"). Notifications uses `onNext`/`onSkip`; Splash uses `onStart`/`onLogin`; Paywall uses `onBuy`/`onFree`.
- Entrance animation `@keyframes scrIn` is keyed on step. NOTE: html-to-image/screenshots often capture these mid-animation as **black/blank** — this is a capture artifact, not a bug. Verify via `get_webview_logs` (should be clean) and DOM inspection, or kill the animation before capturing.

## Goals roadmap (Svi ciljevi)
- `GoalsRoadmapScreen.jsx` (`Iskra Goals Roadmap.html`) — scrollable combined chronological roadmap of ALL category milestones on bg `#FDFCFA`: back + centered "Moj napredak" top bar; **progress overview** card ("Ukupno postignuto", six category pills w/ N/total, ember 42% bar "21 od 50 ukupnih ciljeva"); **Postignuto** section (3 recent colored-dot rows + "Vidi sve postignuto →"); **Predstojeće** chronological timeline — highlighted current card (category-tinted bg + left border + "SLEDEĆE" badge + progress bar), then upcoming rows down a connecting line each w/ category badge + title + "Za N dana"; italic motivational footer. Category colors: Zdravlje rose/Pluća blue/Ekologija teal/Finansije green/Telo terracotta/Nikotin purple. Takes `onBack`. **Opened from Home** by tapping the "Sledeći cilj" card (now a button → `setView('roadmap')`, guarded by `window.GoalsRoadmapScreen`). Loaded in prototype + standalone Home launcher.

## Knowledge base (Saznaj)
- `KnowledgeScreen.jsx` (`Iskra Knowledge Base.html`) — scrollable "Saznaj" knowledge base on bg `#F7F6F3`: header ("Saznaj" + "Sve što treba da znaš o prestanku"), ember **featured card** ("PREPORUČENO" pill, 6 min čitanja), **Kategorije** 2-col colored-icon grid (Razumeti zavisnost purple / Nositi se sa porivima ember / Kafana i društvo slate / Ishrana i gojenje green / Stres bez cigarete blue / Priče iz prve ruke rose) + full-width teal "Naučni fakti", **Popularno** horizontal-scroll article cards (category tag + title + min + lock), **Novo** vertical article list. Has its OWN bottom nav (Početna/Milestoni/**Saznaj** active/Profil). Takes `onHome`. **Replaces the old Zajednica tab** — Home's 3rd nav item is now "Saznaj" (book icon) → `setView('saznaj')`, guarded by `window.KnowledgeScreen`. Loaded in prototype + standalone Home launcher.

## Quote detail (Quote dana)
- `QuoteScreen.jsx` (`Iskra Quote.html`) — standalone editorial "Quote dana #47" detail on bg `#FDFCFA`: back + centered "Quote dana #47" + favorite heart top bar; centered "Humor" category pill under title; faded ember quote mark, 26px quote text, divider, author + "Američki književnik, 1835–1910"; pagination dots (5, first active) + "Prevuci za sledeći quote" hint; bottom Iskra-komentar fun-fact card (flame icon) right above full-width ember "Podeli quote" button. Takes `onBack`. **Extracted out of HomeScreenV3** — Home's quote-of-the-day card opens it via `setView('quote')`, guarded by `window.QuoteScreen`. Loaded in prototype + standalone Home launcher.

## Home screen versions
- `HomeScreenV3.jsx` is current. `HomeScreen.jsx` / `HomeScreenV2.jsx` are earlier iterations kept for history. Home has: greeting + flame streak badge, weekly tracker, live countdown, stat cards (money=blue, cigarettes=red, health=green per category system), quote-of-the-day card (opens full quote), "Moji ciljevi" (next-goal teal card + 6 category goal cards with progress bars), "Imam poriv" button, bottom nav (Početna/Milestoni/Zajednica/Profil).

## Category color system (Home + previews)
Money/Finansije blue, Cigarettes red, Health/Zdravlje green/teal. Reason-pill icon colors: Zdravlje `#D4547E`, Porodica `#4A6080`, Pare/Finansije `#2E8B80`/`#3A7A3A`, Forma `#3A7A3A`, Sloboda `#6B52A8`, Pritisak `#BA7517`. Pastel chip backgrounds pair with each.
