# FIX-1: recap and bugfix round after M3

For the code agent. Written 21.09.2026 from a review of the uncommitted M3 tree (tsc clean,
149 tests passing) and the M3 screenshots. Nothing new gets built here. Every item is a fix or a
gap in what M0 to M3 already promise.

Do Task 0 first. Then P0 and P1 in order. Every fix gets a test that fails before it and passes
after.

---

## Where we are

| Milestone | Planned by | Status |
|---|---|---|
| M0 Foundations | 25.09 | Done |
| M1 Data spine | 09.10 | Done |
| M2 Onboarding | 16.10 | Done, committed as `0df0845` |
| M3 Poriv mod + Home v1 | 30.10 | Built, **uncommitted** (38 files) |
| M4 Napredak | 06.11 | Next |

About five weeks ahead of the roadmap. The spare time goes into the closed beta, not into new
features.

Still owed by Pavle, not by the agent: the notification rule (before M6), the Early Access offer
(before M8), and the privacy policy and terms rewritten for app data (they block the first real
user, not submission).

---

## Task 0: commit M3 as it is

Before touching anything, commit the current tree as `m3` so the fixes below are reviewable as
their own diff. The website repo also has an uncommitted `CLAUDE.md` change from M2 (the note that
migrations live in this repo). Pavle commits that one.

---

## P0: data bugs. These write wrong rows.

### 1. Opening a tool starts an endless write loop

`src/app/poriv/alat/[tool].tsx` calls `openTool(tool)` in a `useEffect` that depends on
`openTool`. `openTool` is a `useCallback` over `[craving]`, and it calls `setCraving` with a new
row object, which produces a new `openTool`, which runs the effect again. For as long as a tool is
open, every render does an exclusive transaction, bumps the outbox version and calls
`requestSync`, so the app is also sending network upserts in a loop.

That happens mid-craving, on battery, and it is likely what made "database is locked" routine
before `serialiseWrite()` hid it.

Fix: record the tool once per route mount (a ref guard, or depend on `craving?.id` rather than the
callback). Also make `openTool` a no-op when `tool_used` already equals `tool`.

Test: open a tool, let it render for a few seconds, and assert exactly one `updateCraving` call and
an outbox `version` that does not climb.

### 2. The slip row never gets its trigger

The M3 brief: the optional trigger tap after a slip "updates both rows". Today `note()` updates
only the craving. The `slips` row was written by `finishCraving()` a moment earlier with a null
trigger, and it stays null. That is exactly the case the unified vocabulary from M2 was built to
compare.

Fix: `finishCraving()` returns the slip id. `note()` on the Slip screen updates that `slips` row
too, through a new `updateSlip()` in `repo.ts` that goes through `write()` and `enqueue()` like
every other write.

Test: slip with no trigger, tap a chip, and assert that both rows carry it.

### 3. A double tap writes two slips

`end()` in `ModeScreen` has no in-flight guard, and `finishCraving()` never checks whether the
craving already has an outcome. Two taps on "Desila se cigareta" create two `slips` rows, and that
second slip is a false fact about someone's relapse. "Prošlo je" followed quickly by the slip link
records both outcomes, in whichever order they land.

Fix, at both layers:

- the UI: a ref-based `ending` guard, and both controls disabled once one is pressed
- the data: `finishCraving()` returns early when `outcome` is not null. That makes it idempotent
  whoever calls it

The same ref guard goes on Home's "Imam poriv". `starting` is React state, so two taps inside one
frame both pass it and create two craving rows.

Test: call `finishCraving()` twice with `slipped`, and assert one `slips` row and an unchanged
`duration_seconds`.

### 4. The outcome buttons work before the row exists

On the `iskra://poriv` path the row is written inside the provider, after Mode has mounted. If
someone taps "Prošlo je" during that instant, `finish()` returns silently while `end()` still
navigates to Success, so the Success screen shows over a craving that never got an outcome.

Fix: disable the X, "Prošlo je" and the slip link while `craving` is null. It lasts milliseconds,
so it needs no visual state.

---

## P1: mid-craving usability

### 5. Two of the six tools are below the fold

The M3 screenshot at 4:57 shows the ember half, then four tools, with Odlažem and Beležim cut off
under "Prošlo je". Someone mid-craving has to scroll to find a third of the product, and the slip
link sits below that. On an iPhone SE (667pt) it is worse.

Fix: **all six tools and the slip link visible without scrolling on a 667pt screen**, with the
64pt minimum target unchanged. The texture panels are what take the room. Make each one a slim band
or the tile's background at low opacity, not a separate block, and shrink the ember half to fit.
Keep one texture move per screen as the direction contract says. Screenshot it on SE and on Pro
Max.

### 6. Home does not refresh when the app returns to the foreground

`useFocusEffect` fires on navigation, not on `AppState` changes. If the app is left open overnight,
Home still shows yesterday's day count in the morning. The day counter is the number beta testers
will check first (ROADMAP M7: "does the day counter ever show a wrong number").

Fix: reload Home on `AppState` → `active` as well. Add a test on the refresh trigger.

### 7. "Today" uses the wrong day

`survivedOn()` uses the device's `toDateString()`, while the day count uses the anchor time zone
from `profiles.quit_time_zone`. Someone who travels sees Success say "Danas" for a different day
than Home counts. Use `calendarDateIn(instant, anchorZone)` in both places.

### 8. The trigger chips vanish the instant one is tapped

`OptionalTrigger` returns null as soon as `craving.trigger` is set, so the chosen chip disappears
under the person's thumb with no confirmation. Keep the chips on screen with the choice selected,
and only hide them when the screen opens with a trigger already set.

---

## P2: Home at day 5

The screenshot shows the day count and the button, with nothing between them. The brief allowed
this, and it is too bare. The reason is not the M4 or M5 gap: data that already exists is going
unused.

- **"Tvoji razlozi" shows in every state except Pre-quit**, where it already leads, as a
  supporting card below the day count: `reason_text` in „…" or, if that is empty, the first two
  reason labels. Onboarding asked for their reasons, and Home is the place to give them back.
  Approved copy exists: the card title is "Tvoji razlozi".
- The survived line hides at 0. Keep that: "0 poriva iza tebe" reads like a score.

That is the whole change. Still no placeholders and no tabs.

---

## Copy, approved

- `mode.close`: **Zatvori**. It is accurate: the X closes Mode without saying how the craving
  ended. Delete the row from `M3-copy-todo.md`, and delete the file if nothing else is left in it.

## Decisions confirmed

- The tappable strength steps in Beležim stay instead of a slider. Tapping works for a shaking
  hand.
- Quick action: skipped, correctly. It goes back on the list for v1.1, with the widget.
- The four export colours are mapped to palette tokens. The site leads, so no new hexes.
- The 6 `x: null` gender tokens stay. None of them is on screen, and a test already pins the list.

## Acceptance

- [ ] `m3` committed before any fix
- [ ] Opening a tool writes once; the outbox version is stable while a tool is open
- [ ] The slip trigger lands on both `cravings` and `slips`
- [ ] Double taps create one craving, one outcome and one slip, and never two
- [ ] No outcome can be written, and no navigation happens, before the row exists
- [ ] Six tools and the slip link visible without scrolling on iPhone SE, screenshot in
      `.impeccable/review/fix-1/`
- [ ] Home refreshes on foreground; "today" means the same day on Home and on Success
- [ ] The chosen chip stays visible
- [ ] Reasons card on Home in every state except Pre-quit
- [ ] Zero `TODO(copy)` markers left in M3
- [ ] **Pavle taps it on a real phone, in aeroplane mode**: one craving through each tool, one
      survived and one slipped, then reconnect and check the rows in Supabase. The agent could
      not tap the simulator, so the M3 button wiring is still unverified by a human finger
