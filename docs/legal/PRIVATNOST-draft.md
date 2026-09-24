# Politika privatnosti: izmene za aplikaciju (nacrt)

Nacrt, 23.09.2026. Nije pregledao advokat (odluka Pavla, 23.09.2026). Ovo nije nova politika
nego **dopuna postojeće** na iskraclub.com/privatnost (`src/app/privatnost/page.tsx`), tako da
jedna politika pokriva sajt, kviz i aplikaciju. Istu adresu navodimo u App Store i Google Play
listingu.

Pravilo iz komentara na vrhu te stranice važi i ovde: svaka rečenica mora da opisuje ono što kod
zaista radi. Mesta označena sa **[PROVERI]** agent potvrđuje u kodu pre objavljivanja.

---

## 0. Podaci koji fale u `src/lib/legal.ts`

`LEGAL.operator` je trenutno prazan, pa stranica prikazuje samo „Iskra". Za aplikaciju sa
podacima o zdravlju rukovalac mora biti tačno imenovan:

- `name`: registrovani naziv PR radnje, tačno kako piše u APR-u
- `address`: adresa sedišta
- `registrationNumber`: matični broj
- `taxId`: PIB

Kontakt email je `LEGAL.email` i jedan je za sajt i aplikaciju.

---

## 1. Uvod (zamena)

> Iskra je aplikacija za prestanak pušenja. Ova politika objašnjava koje podatke prikupljamo
> preko sajta iskraclub.com, kviza na iskraclub.com/kviz i aplikacije Iskra za iOS i Android,
> zašto ih prikupljamo, gde se čuvaju i koja prava imaš.

Sažetak na vrhu dobija dve stavke:

- Aplikacija čuva tvoje porive, posrtaje i dnevne provere. To su podaci o zdravlju i čuvamo ih
  samo uz tvoj izričit pristanak.
- Nalog praviš preko Apple ili Google naloga ili email adrese. Sve podatke brišeš jednim
  dugmetom u aplikaciji.
- Emailove sa savetima i novostima šaljemo samo ako to posebno označiš.

## 2. „Koje podatke prikupljamo": nova podsekcija, posle „Kviz"

> **Aplikacija Iskra**
>
> Nalog praviš preko Apple naloga, Google naloga ili email adrese. Uz nalog čuvamo email
> adresu i, ako se prijaviš preko Apple ili Google naloga, identifikator koji ti taj servis
> dodeljuje. Ako pri prijavi preko Apple naloga izabereš da sakriješ adresu, dobijamo samo
> Apple adresu za prosleđivanje. Lozinku ne čuvamo, jer je nema: prijava ide preko tih servisa
> ili koda koji stiže na email. Uz nalog aplikacija čuva:
>
> - ono što uneseš na početku: ime ili nadimak kojim te oslovljavamo, pol ako ga navedeš, da li
>   pušiš cigarete ili IQOS, koliko dnevno i po kojoj ceni, datum prestanka, razloge, strahove,
>   okidače (na primer kafa ili stres) i tekst koji sam napišeš o svom razlogu;
> - tvoj potpis iz koraka obećanja, sačuvan kao crtež;
> - porive: kada su se javili, koliko su bili jaki, šta ih je izazvalo, koji alat je pomogao,
>   koliko su trajali i kako su se završili;
> - posrtaje, odnosno zapaljene cigarete, uz okidač i belešku ako je napišeš;
> - dnevne provere („Kako je prošao dan?") i otključane prekretnice;
> - vremensku zonu telefona, da bi brojač dana bio tačan.
>
> Podaci se prvo čuvaju na tvom telefonu, tako da aplikacija radi i bez interneta, a kada je veza
> dostupna, šifrovano se šalju u našu bazu u Evropskoj uniji.
>
> **Analitika u aplikaciji. [PROVERI: uključuje se u M6.]** Ako to posebno dozvoliš, aplikacija
> beleži kako se koristi: koji ekrani su otvoreni i koje radnje su izvršene, na primer da je
> otvoren alat „Dišem". Tekst koji sam napišeš, tvoje ime i potpis nikada ne ulaze u analitiku.
> Izveštaji o greškama (pad aplikacije, tehnički opis greške i model telefona) šalju se i bez tog
> pristanka, jer bez njih ne možemo da popravimo aplikaciju, i ne sadrže ništa od onoga što
> uneseš.

## 3. „Podaci o zdravlju" (zamena)

> Odgovori iz kviza i podaci iz aplikacije (navike pušenja, porivi, posrtaji i dnevne provere)
> govore o pušenju i nikotinskoj zavisnosti, pa ih tretiramo kao podatke o zdravlju, koji po
> zakonu imaju posebnu zaštitu. Obrađujemo ih samo uz tvoj izričit pristanak i samo za svrhe iz
> 3. dela. U aplikaciji pristanak daješ posle kratkog uvoda, pre nego što bilo šta uneseš.

## 4. „Zašto ih koristimo": tri nove stavke

> **Nalog.** Da bi tvoji podaci ostali sačuvani i vratili se kada se prijaviš na drugom
> telefonu. Osnov je izvršenje ugovora, odnosno Uslova korišćenja.
>
> **Emailovi sa savetima i novostima.** Samo ako na ekranu za nalog označiš to polje. Osnov je
> tvoj pristanak. Odjava je jednim klikom u svakom emailu ili u Profilu.
>
> **Rad aplikacije.** Da bi brojala dane, računala ušteđen novac, pamtila tvoje razloge,
> beležila porive i posrtaje i čuvala ih kada promeniš ekran ili zatvoriš aplikaciju. Osnov je
> tvoj izričit pristanak.
>
> **Obaveštenja.** Podsetnik za dnevnu proveru, obaveštenje o prekretnici i kratka poruka u
> vreme tvojih okidača. Najviše tri dnevno, nikad između 22 i 8 časova i
> nikad u 48 sati posle posrtaja. Osnov je tvoja dozvola u podešavanjima telefona, koju možeš da
> povučeš u svakom trenutku.
>
> **Popravljanje i unapređivanje aplikacije.** Izveštaji o greškama, na osnovu našeg legitimnog
> interesa da aplikacija radi. Analitika korišćenja, samo uz tvoj poseban pristanak.

Rečenicu „Podatke ne prodajemo…" zadržati. Dodati:

> Iskra ne donosi automatske odluke o tebi. Brojevi u aplikaciji (dani, ušteđen novac,
> izbegnute cigarete) izračunati su iz onoga što uneseš i nisu medicinska procena.

## 5. „Ko obrađuje podatke za nas": izmene tabele `PROCESSORS`

| Pružalac | Šta radi | Gde se podaci nalaze |
|---|---|---|
| Supabase | Baza podataka za listu čekanja, kviz i aplikaciju | Evropska unija (Irska) |
| Apple, Google | Distribucija aplikacije preko App Store i Google Play; prijava na nalog, ako je izabereš; dostava obaveštenja, ako ih dozvoliš | SAD |
| Resend | Slanje koda za prijavu i, uz tvoj pristanak, emailova sa savetima i novostima | SAD |
| Sentry **[PROVERI, M6]** | Izveštaji o greškama u aplikaciji | Evropska unija (Nemačka), ako se izabere EU region |
| PostHog **[PROVERI, M6]** | Analitika korišćenja kviza i, uz poseban pristanak, aplikacije | SAD, ili EU ako se aplikacija poveže na EU projekat |

Preporuka za M6: za aplikaciju koristiti **EU region i kod Sentryja i kod PostHoga**. Tada ništa
iz aplikacije ne napušta EU osim distribucije i obaveštenja, a to je jača rečenica za
aplikaciju sa podacima o zdravlju.

## 6. „Koliko dugo čuvamo podatke": nove stavke

> - Podatke iz aplikacije čuvamo dok koristiš aplikaciju. Ako je ne otvoriš 24 meseca,
>   brišemo ih. **[PROVERI: treba zakazan posao u bazi; dok ne postoji, ova rečenica ne ide
>   na sajt.]**
> - Kada izabereš „Obriši sve podatke" u aplikaciji, brišemo ih sa servera odmah, a iz
>   rezervnih kopija baze najkasnije u roku od 30 dana.
> - Podaci na telefonu brišu se kada obrišeš aplikaciju.
> - Izveštaje o greškama čuvamo najduže 90 dana, a analitiku iz aplikacije najduže 12 meseci.

## 7. „Tvoja prava": dodatak

> U aplikaciji sve podatke brišeš sam, u Profilu, dugmetom „Obriši sve podatke". To je ujedno
> i povlačenje pristanka. Analitiku isključuješ u istom meniju.
>
> Zahtev emailom pošalji sa adrese vezane za nalog, da bismo znali o kojim podacima je reč. Ako je pri
> prijavi preko Apple naloga adresa sakrivena, navedi Apple adresu za prosleđivanje koja piše u
> Profilu.

**Zavisnost:** ovo pretpostavlja ekran Profil sa brisanjem i prikazom email adrese naloga. Apple ga
ionako zahteva (brisanje naloga u aplikaciji). Mora postojati pre objavljivanja ovog teksta.

## 8. „Bezbednost": dodatak

> U aplikaciji se sesija čuva u šifrovanom skladištu telefona. Podaci putuju šifrovano, a
> pravila na nivou baze dozvoljavaju svakom nalogu da vidi i menja samo sopstvene podatke.

## 9. „Maloletna lica" (zamena)

> Sajt, kviz i aplikacija namenjeni su punoletnim osobama. Aplikacija pre prvog unosa traži
> potvrdu da imaš 18 ili više godina. Ne prikupljamo svesno podatke osoba mlađih od 18 godina.
> Ako saznamo da su takvi podaci stigli do nas, brišemo ih.

## 10. „Izmene ove politike" (zamena poslednje rečenice)

Obrisati „Kada aplikacija izađe, dobiće sopstvenu politiku privatnosti." Dodati:

> O bitnim izmenama koje se tiču aplikacije obaveštavamo te u samoj aplikaciji, pre nego što
> počnu da važe.

## 11. `LEGAL.updated`

Datum menjati na dan objavljivanja.
