/**
 * What happens in the body after the last cigarette. Exactly these eleven items, in this order,
 * each with its source (docs/M4-brief.md Task 2). Nothing else is added: no "lung function 30%",
 * no "nicotine receptors reset". The export's extras are unsourced and were cut.
 *
 * Sources:
 *   WHO, "Tobacco: health benefits of smoking cessation",
 *   https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation
 *   NHS Better Health, "What could happen when you quit smoking",
 *   https://www.nhs.uk/better-health/quit-smoking/ready-to-quit-smoking/what-could-happen-when-you-quit-smoking/
 *
 * The WHO lines are the website's approved Serbian (`HEALTH_MILESTONES` in its `content.ts`); the
 * three NHS lines were approved in the brief. Both are verbatim.
 *
 * A range ("od 2 do 12 nedelja") counts as reached at the start of its range; its label still
 * shows the whole range. Everything is measured from the quit date.
 */

export type HealthSource = 'WHO' | 'NHS';

/** When an item is reached, counted from the quit moment. */
export type Offset =
  | { unit: 'minutes' | 'hours'; value: number }
  | { unit: 'weeks' | 'months' | 'years'; value: number };

export type HealthItem = {
  key: string;
  /** The label as written in the brief's table, range included. */
  at: string;
  offset: Offset;
  source: HealthSource;
  text: string;
};

export const HEALTH_ITEMS: readonly HealthItem[] = [
  {
    key: 'pulse',
    at: '20 minuta',
    offset: { unit: 'minutes', value: 20 },
    source: 'WHO',
    text: 'Puls i krvni pritisak se spuštaju.',
  },
  {
    key: 'oxygen',
    at: '8 sati',
    offset: { unit: 'hours', value: 8 },
    source: 'NHS',
    text: 'Nivo kiseonika se oporavlja, a ugljen-monoksida u krvi je upola manje.',
  },
  {
    key: 'carbon-monoxide',
    at: '12 sati',
    offset: { unit: 'hours', value: 12 },
    source: 'WHO',
    text: 'Nivo ugljen-monoksida u krvi se vraća na normalu.',
  },
  {
    key: 'taste-smell',
    at: '48 sati',
    offset: { unit: 'hours', value: 48 },
    source: 'NHS',
    text: 'Pluća počinju da izbacuju sluz, a ukus i miris se popravljaju.',
  },
  {
    key: 'breathing',
    at: '72 sata',
    offset: { unit: 'hours', value: 72 },
    source: 'NHS',
    text: 'Disanje postaje lakše jer se disajni putevi opuštaju. Energije je više.',
  },
  {
    key: 'circulation',
    at: 'od 2 do 12 nedelja',
    offset: { unit: 'weeks', value: 2 },
    source: 'WHO',
    text: 'Cirkulacija se poboljšava, a pluća rade bolje.',
  },
  {
    key: 'cough',
    at: 'od 1 do 9 meseci',
    offset: { unit: 'months', value: 1 },
    source: 'WHO',
    text: 'Kašalj i nedostatak daha se smanjuju.',
  },
  {
    key: 'heart-half',
    at: '1 godina',
    offset: { unit: 'years', value: 1 },
    source: 'WHO',
    text: 'Rizik od koronarne bolesti srca je otprilike upola manji nego kod pušača.',
  },
  {
    key: 'stroke',
    at: 'od 5 do 15 godina',
    offset: { unit: 'years', value: 5 },
    source: 'WHO',
    text: 'Rizik od moždanog udara pada na nivo nepušača.',
  },
  {
    key: 'lung-cancer',
    at: '10 godina',
    offset: { unit: 'years', value: 10 },
    source: 'WHO',
    text: 'Rizik od raka pluća je otprilike upola manji nego kod pušača.',
  },
  {
    key: 'heart-normal',
    at: '15 godina',
    offset: { unit: 'years', value: 15 },
    source: 'WHO',
    text: 'Rizik od koronarne bolesti srca je kao kod nepušača.',
  },
];

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * The instant an item is reached. Minutes, hours and weeks are fixed durations; months and years
 * are calendar steps from the quit date (in UTC, where no day is ever 23 or 25 hours), so "1
 * godina" lands on the anniversary rather than 365 days later in a leap year.
 */
export function reachedAt(quitDate: Date, offset: Offset): Date {
  const start = quitDate.getTime();
  switch (offset.unit) {
    case 'minutes':
      return new Date(start + offset.value * MINUTE);
    case 'hours':
      return new Date(start + offset.value * HOUR);
    case 'weeks':
      return new Date(start + offset.value * 7 * DAY);
    case 'months':
    case 'years': {
      const date = new Date(start);
      const months = offset.unit === 'months' ? offset.value : offset.value * 12;
      const day = date.getUTCDate();
      date.setUTCDate(1);
      date.setUTCMonth(date.getUTCMonth() + months);
      // 31 January plus a month is the last day of February, not 3 March.
      const lastDay = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
      ).getUTCDate();
      date.setUTCDate(Math.min(day, lastDay));
      return date;
    }
  }
}
