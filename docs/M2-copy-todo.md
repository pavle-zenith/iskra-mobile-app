# M2 copy: closed

Every item on this list was answered in `docs/M2-copy-answers.md` (Pavle, 21.09.2026) and is in
the code. Nothing is owed. Onboarding reads clean in `muško`, `žensko` and unset, with no marker,
no slash and no em dash, and a test proves it for all three.

What the answers changed, and what to keep doing:

- **There is no genderless Serbian word, only a genderless sentence.** Fifteen sentences were
  rewritten for everyone, which deleted their tokens. Five tokens survive (`prestao`, `pusio`,
  `spreman`, `hteo`, `trosio`) and every sentence using one carries its own `x` branch, the way
  `splash.line2` always did. `g(token, 'x')` therefore returns a marker on purpose: seeing one
  on screen means a gendered sentence was added without its branch.
- **Add a token only with the screen that needs it.** Ten tokens that appeared on no screen were
  removed rather than left owed. `zapalio` comes back in M3 with the slip link.
- **The em dash rule has no exception.** Six approved strings were rewritten to drop theirs.
- **The commitment fine print now says what happens:** the signature is kept, in
  `profiles.signature_data`. The export's "Potpis se ne čuva" was untrue and never shipped.
- **The testimonial stays cut.** There are no real users to quote.
- The ten trigger labels, the processing beat borrowed from the website quiz, the IQOS
  accusative (`štapiće`) and the one-year milestone (`Rizik od bolesti srca upola manji`) are
  all approved as they stand.

Still true, and still the rule: **never write, translate or paraphrase a Serbian string.** A
sentence that does not exist gets a `TODO(copy)` and goes to Pavle.
