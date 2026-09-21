# M2 copy: Pavle's answers

Answers to every item in `M2-copy-todo.md`. Apply all of it, then delete the rows it resolves.
Approved by Pavle once he has read this file; the strings below are final copy, not proposals.

## 0. Implementation note, read first

A word-level `x` form cannot work. A genderless rewrite changes the sentence around the word
("Budi iskren" does not become "Budi [something]", it becomes "Odgovori iskreno"). So:

- **"All genders"** below: replace the sentence for everyone and drop the `g()` call. Fewer
  gendered strings is the goal, not a compromise.
- **"x only"**: keep m/f as today and branch the whole sentence for `x`, the way
  `splash.line2` and the FearReflection CTA already do.
- Tokens with no string on screen (`siguran`, `posvecen`, `izdrzao`, `odoleo`, `mogao`,
  `zavrsio`, `vratio`, `preziveo`, `odlagao`, `zapalio`) are **not owed**. Remove them from the
  missing-rewrite count. A rewrite gets written when a screen first needs the sentence, never
  as a lone word. `zapalio` comes back in M3 with the slip link.
- Fix the diacritics: `trošio` / `trošila`.

## 1. Gendered strings

| Where | Scope | New string |
|---|---|---|
| Reflection `forma`, takeaway | all genders | Vratićeš dah za koji ti se činilo da je nestao. |
| Reflection `pritisak`, body | all genders | Možda je počelo zbog drugih. Ali prestaješ zbog sebe. |
| Fear `kafana`, takeaway | all genders | Tu smo i za te večeri. |
| Fear `neuspeh`, body | all genders | Prosečna osoba pokuša više puta pre nego što prestane zauvek. Pokušaj nije neuspeh. |
| Fears subtitle | all genders | Odgovori iskreno. Tu smo da pomognemo. |
| Date question | all genders | Koji je tvoj datum? |
| Commitment pledge 1 | all genders | Imaću strpljenja sa sobom. |
| Commitment pledge 2 | all genders | Neću odustati posle jednog teškog dana. |
| Summary subtitle | all genders | Na osnovu tvojih odgovora, ovo je tvoje putovanje. |
| Preview card 3 title | all genders | Sloboda od nikotina |
| Cigarettes question (step 4) | x only | Koliko cigareta ti je dnevno išlo? |
| Cost lead, already quit | x only | Godišnje ti je na cigarete odlazilo |
| Timing option 3 | x only | Već ne pušim |
| Summary heading | x only | [ime], sve je spremno. |
| Panic body | m/f and x | m/f: Zatvori oči. Zamisli da ti se sada puši. Kad budeš [g:spreman], pritisni. x: Zatvori oči. Zamisli da ti se sada puši. Kad osetiš da možeš, pritisni. |

The `neuspeh` line was a grammar bug, not a gender problem: the subject is "prosečna osoba",
so the verb is present tense and needs no token. Pledge 2 had the same kind of problem.

For the panic body the m/f forms are "spreman" and "spremna" via `g()` as today; only the em
dash becomes a comma.

## 2. Trigger labels

Approved exactly as proposed. No changes.

## 3. The decisions

- **Processing beat:** reusing the quiz's copy is fine.
- **Commitment fine print:** `* Potpis ostaje u tvom profilu, kao podsetnik samo za tebe.`
- **Testimonial cut:** agreed. It stays cut.
- **Em dashes:** the rule has no exception. Rewrite all of them:
  - Iskra ti vraća taj novac, dan po dan.
  - Pasivni dim utiče na sve oko tebe, a najviše na decu.
  - Svaki poriv traje između 3 i 5 minuta i prođe sam od sebe. Uvek.
  - Nikotin ne smanjuje stres. Samo nakratko gasi apstinenciju koju je sam izazvao.
  - Apetit se može vratiti, ali to se kontroliše malim navikama, ne nikotinom.
  - Šaljemo samo ono što je važno. Nikad spam.
- **Summary, 1 godina:** `Rizik od bolesti srca upola manji`. "Bolesti srca" rather than
  "srčanog udara", because the source finding is about coronary heart disease overall, and
  the line has to be defensible.
- **Notification samples:** `Dan 8 bez cigarete` and `Za 2 sata: nova prekretnica`. No
  English loanwords.
- **IQOS accusative:** `štapiće`.

## 4. Copy that exists nowhere

Both stay unbuilt. The fourth reason pill disabling is enough, and it needs no message.
