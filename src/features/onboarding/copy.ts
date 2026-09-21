/**
 * Every Serbian string in onboarding, in one place.
 *
 * Source of truth: ONBOARDING_COPY_BRIEF.md in the design export, which wins wherever it and
 * the export's screen files disagree (Pavle's call, 21.09.2026). Strings the brief does not
 * specify come from the screen files, cited per line. Nothing here is written, translated or
 * paraphrased by an agent: a string that does not exist renders as a marker and goes on the
 * list in docs/M2-copy-todo.md.
 *
 * `[var]` slots take profile data. `[g:token]` slots go through `g()`, which never produces a
 * slash and never defaults to masculine.
 */
import { g, type GenderCode } from './gender';

export type ProductKey = 'cigarete' | 'iqos';

export type CopyContext = {
  name: string;
  gender: GenderCode;
  product: ProductKey;
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packPriceRsd: number;
  /** `vec_prestao` shifts the money screens into the past tense (brief section 7.6). */
  alreadyQuit?: boolean;
};

// --- numbers ---------------------------------------------------------------

/**
 * Serbian grouping: 7300 becomes "7.300". Grouped by hand rather than through Intl, whose
 * separator for sr-RS varies by engine (Hermes on two platforms, Node in tests).
 *
 * Rounded to the nearest dinar and never up to a nicer number: PRODUCT.md forbids flattering
 * this figure, and it is the product's sharpest proof.
 */
export function formatRsd(amount: number): string {
  const whole = Math.round(Math.abs(amount));
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return amount < 0 ? `-${grouped}` : grouped;
}

/** annualCost = (cigsPerDay / cigsPerPack) * packPrice * 365 (brief section 1). */
export function annualCostRsd(ctx: CopyContext): number {
  const packs = ctx.cigarettesPerDay / Math.max(1, ctx.cigarettesPerPack);
  return packs * ctx.packPriceRsd * 365;
}

export function annualCigarettes(ctx: CopyContext): number {
  return ctx.cigarettesPerDay * 365;
}

/**
 * The "= …" line under the big annual number (brief section 6). Approximate by design, never a
 * unit count, never guilt: "this is what is now possible", not "look what you wasted".
 * The alternates rotate on a stable index so the line does not feel canned.
 */
const EQUIVALENT_BANDS: readonly { max: number; headline: string; alts: readonly string[] }[] = [
  {
    max: 30_000,
    headline: '= godinu dana Netflixa i još ostane',
    alts: ['= 40 večera u gradu', '= dobre patike i još para za izlaske'],
  },
  {
    max: 60_000,
    headline: '= godinu dana u teretani',
    alts: ['= produžen vikend u planini', '= nov telefon na rate, bez rata'],
  },
  {
    max: 100_000,
    headline: '= nov telefon svake godine',
    alts: ['= dva meseca kirije', '= 12 večera za dvoje'],
  },
  {
    max: 140_000,
    headline: '= produžen vikend u inostranstvu',
    alts: ['= skoro tri meseca kirije', '= najnoviji telefon i još ostane'],
  },
  {
    max: 200_000,
    headline: '= 10 dana odmora na moru',
    alts: ['= najnoviji telefon, svake godine', '= četiri meseca kirije'],
  },
  {
    max: 300_000,
    headline: '= letovanje za celu porodicu',
    alts: ['= pola godine kirije', '= mali polovni auto za par godina'],
  },
  {
    max: 450_000,
    headline: '= pristojan polovni auto',
    alts: ['= godinu dana kirije', '= dva letovanja godišnje'],
  },
  {
    max: Number.POSITIVE_INFINITY,
    headline: '= polovni auto, svake godine',
    alts: ['= više od godinu dana kirije'],
  },
];

/** Below this the savings story is weak, so the framing changes (brief section 6, edge rules). */
const WEAK_SAVINGS_RSD = 12_000;
const WEAK_SAVINGS_LINE = '= mali korak koji se brzo skuplja.';

export function costEquivalent(annualRsd: number, rotation = 0): string {
  if (annualRsd < WEAK_SAVINGS_RSD) return WEAK_SAVINGS_LINE;
  const band = EQUIVALENT_BANDS.find((b) => annualRsd < b.max) ?? EQUIVALENT_BANDS.at(-1)!;
  const options = [band.headline, ...band.alts];
  return options[Math.abs(rotation) % options.length] as string;
}

// --- product nouns ---------------------------------------------------------

/**
 * The brief swaps "cigareta/cigarete" for "štapića/grejanja duvana" when product is iqos.
 * It supplies the genitive ("štapića") and nothing else, so the accusative slot for iqos is
 * missing copy rather than an invented inflection. v1 is cigarettes (ROADMAP Part 3).
 */
export function productNounGenitive(product: ProductKey): string {
  return product === 'iqos' ? 'štapića' : 'cigareta';
}

export function productNounAccusative(product: ProductKey): string {
  return product === 'iqos' ? 'štapiće' : 'cigarete';
}

// --- option lists ----------------------------------------------------------

export type Option = { key: string; label: string; sub?: string };

/** Reasons: brief sections 3a and 7.3. `listLabel` is the lowercase in-sentence form. */
export const REASONS: readonly (Option & { listLabel: string })[] = [
  { key: 'zdravlje', label: 'Zdravlje', listLabel: 'zdravlje' },
  { key: 'porodica', label: 'Porodica', listLabel: 'porodica' },
  { key: 'pare', label: 'Pare', listLabel: 'pare' },
  { key: 'forma', label: 'Fizička forma', listLabel: 'fizička forma' },
  { key: 'sloboda', label: 'Sloboda', listLabel: 'sloboda' },
  { key: 'pritisak', label: 'Pritisak okoline', listLabel: 'pritisak okoline' },
];

export const FEARS: readonly (Option & { listLabel: string })[] = [
  { key: 'porivi', label: 'Jaki porivi', listLabel: 'jaki porivi' },
  { key: 'stres', label: 'Stres bez cigarete', listLabel: 'stres' },
  { key: 'kafana', label: 'Kafana i društvo', listLabel: 'kafana i društvo' },
  { key: 'neuspeh', label: 'Strah od neuspeha', listLabel: 'strah od neuspeha' },
  { key: 'razdrazljivost', label: 'Razdražljivost', listLabel: 'razdražljivost' },
  { key: 'kilaza', label: 'Dobitak na kilaži', listLabel: 'kilaža' },
];

/** Triggers: the ten keys of src/lib/vocab.ts, shared with cravings and slips. */
export const TRIGGERS: readonly Option[] = [
  { key: 'kafa', label: 'Uz kafu' },
  { key: 'budjenje', label: 'Posle buđenja' },
  { key: 'posao', label: 'Pauza na poslu' },
  { key: 'kafana', label: 'Kafana' },
  { key: 'okolina', label: 'Kad drugi puše' },
  { key: 'alkohol', label: 'Uz piće' },
  { key: 'stres', label: 'Stres' },
  { key: 'jelo', label: 'Posle jela' },
  { key: 'dosada', label: 'Dosada i čekanje' },
  { key: 'drugo', label: 'Nešto drugo' },
];

/** Serbian list join (brief section 7.3): "A, B i C", capital only on the first word. */
export function joinSerbianList(labels: readonly string[]): string {
  if (labels.length === 0) return '';
  const joined =
    labels.length === 1
      ? (labels[0] as string)
      : `${labels.slice(0, -1).join(', ')} i ${labels.at(-1) as string}`;
  return `${joined.charAt(0).toUpperCase()}${joined.slice(1)}.`;
}

// --- reflection cards ------------------------------------------------------

export type ReflectionCard = { key: string; title: string; body: string; takeaway: string };

/** One card per chosen reason, in selection order (brief sections 3a and 7.2). */
export function reasonCard(key: string, ctx: CopyContext): ReflectionCard | null {
  switch (key) {
    case 'zdravlje':
      return {
        key,
        title: 'Zdravlje',
        body: 'Već 20 minuta nakon poslednje cigarete krvni pritisak počinje da se vraća u normalu.',
        takeaway: 'Tvoje telo počinje da se oporavlja odmah.',
      };
    case 'porodica':
      return {
        key,
        title: 'Porodica',
        body: 'Pasivni dim utiče na sve oko tebe, a najviše na decu.',
        takeaway: 'Oni su razlog koji se ne dovodi u pitanje.',
      };
    case 'pare':
      return {
        key,
        title: 'Pare',
        body: `Trošiš ${formatRsd(annualCostRsd(ctx))} RSD godišnje na ${productNounAccusative(ctx.product)}. Taj novac može biti tvoj.`,
        takeaway: 'Svaki dan bez pušenja je novac u tvom džepu.',
      };
    case 'forma':
      return {
        key,
        title: 'Fizička forma',
        body: 'Već posle nedelju dana pluća rade lakše, a izdržljivost raste.',
        takeaway: 'Vratićeš dah za koji ti se činilo da je nestao.',
      };
    case 'sloboda':
      return {
        key,
        title: 'Sloboda',
        body: 'Nikotin stvara iluziju kontrole. Bez njega, ti odlučuješ.',
        takeaway: 'Sloboda počinje prvog dana.',
      };
    case 'pritisak':
      return {
        key,
        title: 'Pritisak okoline',
        body: 'Možda je počelo zbog drugih. Ali prestaješ zbog sebe.',
        takeaway: 'Ovo je tvoja odluka, ni za koga drugog.',
      };
    default:
      return null;
  }
}

/** One card per chosen fear (brief section 3b). No cap: the screen scrolls (section 7.4). */
export function fearCard(key: string): ReflectionCard | null {
  switch (key) {
    case 'porivi':
      return {
        key,
        title: 'Jaki porivi',
        body: 'Svaki poriv traje između 3 i 5 minuta i prođe sam od sebe. Uvek.',
        takeaway: 'Iskra ima alat za tačno taj trenutak.',
      };
    case 'stres':
      return {
        key,
        title: 'Stres bez cigarete',
        body: 'Nikotin ne smanjuje stres. Samo nakratko gasi apstinenciju koju je sam izazvao.',
        takeaway: 'Pravo olakšanje dolazi posle 3 nedelje.',
      };
    case 'kafana':
      return {
        key,
        title: 'Kafana i društvo',
        body: 'Društvene situacije su čest okidač. Imaćeš plan za svaku od njih.',
        takeaway: 'Tu smo i za te večeri.',
      };
    case 'neuspeh':
      return {
        key,
        title: 'Strah od neuspeha',
        body: 'Prosečna osoba pokuša više puta pre nego što prestane zauvek. Pokušaj nije neuspeh.',
        takeaway: 'Ovaj put imaš pomoć uz sebe.',
      };
    case 'razdrazljivost':
      return {
        key,
        title: 'Razdražljivost',
        body: 'Prvih par dana mozak traži naviku. To je privremeno i predvidivo.',
        takeaway: 'Za 2 nedelje vraća se mir.',
      };
    case 'kilaza':
      return {
        key,
        title: 'Dobitak na kilaži',
        body: 'Apetit se može vratiti, ali to se kontroliše malim navikama, ne nikotinom.',
        takeaway: 'Brinemo i o tome, korak po korak.',
      };
    default:
      return null;
  }
}

// --- screens ---------------------------------------------------------------

export const copy = {
  splash: {
    wordmark: 'ISKRA',
    line1: 'Znaš da treba.',
    // Brief screen 1: "Iskra ti pomaže da i [g:hteo]." with the x rewrite given as
    // "…da to i ostvariš." Since that rewrite exists, it is the genderless form here.
    line2: (gender: GenderCode) =>
      gender === 'x'
        ? 'Iskra ti pomaže da to i ostvariš.'
        : `Iskra ti pomaže da i ${g('hteo', gender)}.`,
    cta: 'Počni',
  },

  name: {
    question: 'Kako da te zovemo?',
    sub: 'Koristićemo ovo ime kroz celu aplikaciju.',
    placeholder: 'Tvoje ime',
    cta: 'Nastavi',
  },

  gender: {
    question: 'Kako da te oslovljavamo?',
    sub: 'Da bismo ti se obraćali kako treba i prilagodili zdravstveni napredak.',
    male: 'Muško',
    female: 'Žensko',
    unspecified: 'Preferiram da ne kažem',
  },

  product: {
    question: 'Šta koristiš?',
    sub: 'Prilagodićemo Iskru tebi.',
    options: [
      { key: 'cigarete', label: 'Cigarete', sub: 'Klasično pušenje' },
      { key: 'iqos', label: 'IQOS', sub: 'Zagrevani duvan' },
    ] as readonly Option[],
    cta: 'Nastavljam',
  },

  cigarettes: {
    question: (ctx: CopyContext) =>
      ctx.gender === 'x'
        ? `Koliko ${productNounGenitive(ctx.product)} ti je dnevno išlo?`
        : `Koliko ${productNounGenitive(ctx.product)} dnevno si ${g('pusio', ctx.gender)}?`,
    sub: 'Koristimo ovo da izračunamo tvoje uštedine.',
    unit: (ctx: CopyContext) => `${productNounGenitive(ctx.product)} dnevno`,
    note: 'Prosek u Srbiji je oko 15 dnevno.',
    packLabel: 'Cigara u pakli',
    packSub: 'Najčešće 20',
    cta: 'Nastavi',
    min: 1,
    max: 80,
    default: 20,
    packDefault: 20,
  },

  price: {
    question: 'Koliko košta tvoja kutija?',
    sub: 'Koristimo ovo da izračunamo koliko ćeš uštedeti.',
    // RSD only: no currency toggle (M2 brief Task 2).
    currency: 'RSD',
    note: 'Marlboro u Srbiji košta oko 400–500 RSD.',
    cta: 'Nastavi',
    default: 400,
  },

  cost: {
    eyebrow: 'TVOJI PODACI',
    lead: (ctx: CopyContext) => {
      if (!ctx.alreadyQuit) return `Godišnje trošiš na ${productNounAccusative(ctx.product)}`;
      return ctx.gender === 'x'
        ? `Godišnje ti je na ${productNounAccusative(ctx.product)} odlazilo`
        : `Godišnje si ${g('trosio', ctx.gender)} na ${productNounAccusative(ctx.product)}`;
    },
    currency: 'RSD',
    closing: 'Iskra ti vraća taj novac, dan po dan.',
    cta: 'Nastavi',
  },

  panic: {
    eyebrow: 'PROBA',
    header: 'Hajde da vežbamo jedan trenutak.',
    body: (gender: GenderCode) =>
      gender === 'x'
        ? 'Zatvori oči. Zamisli da ti se sada puši. Kad osetiš da možeš, pritisni.'
        : `Zatvori oči. Zamisli da ti se sada puši. Kad budeš ${g('spreman', gender)}, pritisni.`,
    button: 'Imam poriv',
    footer: 'Svaki poriv traje 3 do 5 minuta. Iskra te provede kroz njega.',
  },

  reasons: {
    question: 'Zašto hoćeš da prestaneš?',
    sub: 'Izaberi do 3 razloga. Vraćaćemo ti ih kad bude teško.',
    cta: 'Nastavi',
  },

  reasonText: {
    question: 'Zapiši to svojim rečima.',
    sub: 'Pokazaćemo ti ovo svaki put kad bude najteže.',
    placeholder: 'Hoću da uštedim za letovanje',
    chips: ['Zbog zdravlja', 'Zbog dece', 'Zbog para', 'Zbog sebe', 'Zbog partnera'] as const,
    privacy: 'Samo ti ovo vidiš. Nikad ne delimo.',
    cta: 'Nastavi',
  },

  reflection: {
    eyebrow: 'ČUJEMO TE',
    sub: 'To su tvoji razlozi. Iskra će ti ih uvek vraćati.',
    cta: 'Tačno tako',
  },

  fears: {
    question: 'Šta te brine kod prestanka?',
    sub: 'Odgovori iskreno. Tu smo da pomognemo.',
    cta: 'Nastavi',
  },

  fearReflection: {
    header: 'Ove brige su normalne. Svi ih imaju.',
    sub: 'Iskra je napravljena baš za ove trenutke.',
    // Brief screen 12 gives the x rewrites itself: "Spremni smo" or "Idemo dalje".
    cta: (gender: GenderCode) =>
      gender === 'x' ? 'Idemo dalje' : `${capitalize(g('spreman', gender))} sam`,
  },

  triggers: {
    question: 'Kada ti se najviše puši?',
    sub: 'Koristićemo ovo da ti pomognemo baš u tim trenucima.',
    cta: 'Nastavi',
  },

  timing: {
    question: 'Kada hoćeš da prestaneš?',
    sub: 'Nema pogrešnog odgovora.',
    options: (gender: GenderCode): readonly Option[] => [
      { key: 'odmah', label: 'Odmah', sub: 'Počinjemo danas' },
      { key: 'uskoro', label: 'Uskoro', sub: 'Izaberi datum' },
      {
        key: 'vec_prestao',
        label: gender === 'x' ? 'Već ne pušim' : `Već sam ${g('prestao', gender)}`,
        sub: 'Nastavljam niz',
      },
    ],
  },

  date: {
    question: 'Koji je tvoj datum?',
    sub: 'Možeš ga promeniti kasnije.',
    footnote: 'Postavljanje konkretnog datuma povećava šanse za uspeh.¹',
    // The citation exists only in the export's screen file, not in the brief.
    citation: 'West & Sohal, BMJ 2006',
    months: [
      'Januar',
      'Februar',
      'Mart',
      'April',
      'Maj',
      'Jun',
      'Jul',
      'Avgust',
      'Septembar',
      'Oktobar',
      'Novembar',
      'Decembar',
    ] as const,
    weekdays: ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'] as const,
    cta: 'Potvrdi datum',
  },

  preview: {
    header: 'Za 3 meseca, ovo te čeka.',
    sub: 'Na osnovu tvojih podataka.',
    // Brief section 3c. Not a mirror: the same three cards for everyone.
    savingsCaption: 'ušteđeno za godinu dana',
    healthTitle: 'Plućna funkcija +30%',
    healthCaption: (ctx: CopyContext) => `u prvih 90 dana bez ${productNounGenitive(ctx.product)}`,
    freedomTitle: 'Sloboda od nikotina',
    freedomCaption: 'mozak se vraća u prirodno stanje',
    cta: 'Jedva čekam',
  },

  commitment: {
    wordmark: 'ISKRA',
    header: (name: string) => `${name}, sklapamo dogovor.`,
    // The brief's four pledges (screen 18), which win over the export's different set.
    // Pledges 1 and 2 are Pavle's genderless rewrites: the second also fixed a grammar bug.
    pledges: [
      'Imaću strpljenja sa sobom.',
      'Neću odustati posle jednog teškog dana.',
      'Vraćaću se svojim razlozima.',
      'Dajem sebi pravo na novi početak.',
    ] as readonly string[],
    signatureHint: 'Potpiši se ovde',
    clear: 'Obriši',
    cta: 'Potpisujem',
    // Replaces the export's "Potpis se ne čuva", which was untrue: it is in profiles.signature_data.
    finePrint: '* Potpis ostaje u tvom profilu, kao podsetnik samo za tebe.',
  },

  processing: {
    /**
     * Ported from the website quiz's LoadingStage, which is the precedent the M2 brief names.
     * The strings are the site's own approved Serbian, reused verbatim for the same job.
     */
    header: 'Analiziramo tvoje odgovore…',
    steps: [
      'Analiza obrasca pušenja',
      'Analiza nikotinske zavisnosti',
      'Psihološki okidači',
      'Generisanje preporuka',
    ] as const,
    facts: [
      'Retko je kriv sam nikotin. Češće je to ista situacija koja se ponavlja.',
      'Prva tri dana su fizički najteža. Posle toga psihologija postaje važnija od hemije.',
      'Plan ne mora da bude veliki. Mora da postoji pre trenutka kada zatreba.',
    ] as const,
  },

  summary: {
    eyebrow: 'TVOJ PLAN',
    header: (ctx: CopyContext) =>
      ctx.gender === 'x'
        ? `${ctx.name}, sve je spremno.`
        : `${ctx.name}, ${g('spreman', ctx.gender)} si.`,
    sub: 'Na osnovu tvojih odgovora, ovo je tvoje putovanje.',
    savingsTitle: 'Uštedine tokom godine',
    milestonesTitle: 'Šta te čeka',
    reasonsTitle: 'Tvoji razlozi',
    statLabels: {
      quitDate: 'Datum prestanka',
      perDay: 'Cigareta dnevno',
      packPrice: 'Cena kutije',
      perYear: 'Cigareta godišnje',
    },
    /** Static for everyone, from the export's MILESTONES array. */
    milestones: [
      { time: '20 min', text: 'Krvni pritisak se normalizuje' },
      { time: '8 sati', text: 'Kiseonik u krvi se vraća' },
      { time: '48 sati', text: 'Ukus i miris se vraćaju' },
      { time: '1 nedelja', text: 'Disanje postaje lakše' },
      { time: '1 mesec', text: 'Pluća rade bolje' },
      // Pavle's wording: coronary heart disease overall, which is what the finding supports.
      { time: '1 godina', text: 'Rizik od bolesti srca upola manji' },
    ] as const,
    closing: 'Iskra je tu svaki put kad bude teško.',
    cta: 'Počinjemo',
    finePrint: 'Možeš promeniti sve podatke u podešavanjima.',
  },

  notifications: {
    header: 'Iskra je najkorisnija kad si tu.',
    sub: 'Šaljemo samo ono što je važno. Nikad spam.',
    /**
     * Examples of what Iskra would send. The notification catalogue and the rule that a push
     * reads state before it speaks are still undecided (ROADMAP Part 4), so these are shown,
     * never sent. M2 sends nothing at all.
     */
    samples: [
      {
        title: 'Dan 8 bez cigarete',
        body: 'Već 8 dana bez cigarete. Pluća ti se zahvaljuju.',
      },
      { title: 'Za 2 sata: nova prekretnica', body: 'Cirkulacija se poboljšava. Oseti razliku.' },
      {
        title: 'Vuče te? Otvori Iskru.',
        body: 'Poriv prolazi za 5 minuta. Klikni i prođi kroz njega.',
      },
    ] as const,
    cta: 'Dozvoli obaveštenja',
    skip: 'Možda kasnije',
  },

  /** Shared. */
  back: 'Nazad',
} as const;

function capitalize(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
