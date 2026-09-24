import type { CheckinRow, SlipRow } from '@/data/repo';

import { todayIso, weekDates, weekFor } from '../week';

const LABELS = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
const ZONE = 'Europe/Belgrade';

// Thursday 8 October 2026, mid-morning in Belgrade.
const NOW = new Date('2026-10-08T08:00:00.000Z');

const checkin = (date: string, clean: boolean): CheckinRow => ({
  id: date,
  date,
  clean,
  created_at: `${date}T10:00:00.000Z`,
});

const slip = (createdAt: string): SlipRow => ({
  id: createdAt,
  trigger: null,
  notes: null,
  cigarettes: 1,
  created_at: createdAt,
});

const build = (over: Partial<Parameters<typeof weekFor>[0]> = {}) =>
  weekFor({
    now: NOW,
    anchorTimeZone: ZONE,
    quitDate: null,
    checkins: [],
    slips: [],
    labels: LABELS,
    ...over,
  });

describe('weekDates', () => {
  it('starts on Monday and runs seven days', () => {
    expect(weekDates(NOW, ZONE)).toEqual([
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ]);
  });

  it('treats Sunday as the last day of the week, not the first', () => {
    const sunday = new Date('2026-10-11T08:00:00.000Z');
    expect(weekDates(sunday, ZONE)[0]).toBe('2026-10-05');
    expect(weekDates(sunday, ZONE)[6]).toBe('2026-10-11');
  });

  it('uses the anchor zone, so a late-evening UTC instant is already tomorrow', () => {
    // 23:30 UTC on Sunday is Monday 00:30 in Belgrade: a new week.
    const lateSunday = new Date('2026-10-11T23:30:00.000Z');
    expect(weekDates(lateSunday, ZONE)[0]).toBe('2026-10-12');
    expect(weekDates(lateSunday, 'UTC')[0]).toBe('2026-10-05');
  });
});

describe('weekFor', () => {
  it('marks days ahead of today as future, never as misses', () => {
    const { days } = build();
    expect(days.slice(4).map((day) => day.state)).toEqual(['future', 'future', 'future']);
  });

  it('leaves an unanswered past day unknown rather than failed', () => {
    const { days } = build();
    expect(days.slice(0, 3).map((day) => day.state)).toEqual(['none', 'none', 'none']);
  });

  it('offers today as the one tappable circle until it is answered', () => {
    expect(build().days[3]?.state).toBe('today');
    expect(build({ checkins: [checkin('2026-10-08', true)] }).days[3]?.state).toBe('clean');
  });

  it('counts only clean days towards n / 7', () => {
    const { clean } = build({
      checkins: [
        checkin('2026-10-05', true),
        checkin('2026-10-06', true),
        checkin('2026-10-07', false),
      ],
    });
    expect(clean).toBe(2);
  });

  it('shows a slip day as a slip, from the slips row alone', () => {
    const { days, clean } = build({ slips: [slip('2026-10-06T19:00:00.000Z')] });
    expect(days[1]?.state).toBe('slip');
    expect(clean).toBe(0);
  });

  it('lets a slip override a check-in that claimed the day was clean', () => {
    const { days } = build({
      checkins: [checkin('2026-10-06', true)],
      slips: [slip('2026-10-06T19:00:00.000Z')],
    });
    expect(days[1]?.state).toBe('slip');
  });

  it('does not show days before the quit date as misses', () => {
    const { days } = build({ quitDate: new Date('2026-10-07T00:00:00.000Z') });
    expect(days.slice(0, 2).map((day) => day.state)).toEqual(['before', 'before']);
    expect(days[2]?.state).toBe('none');
  });

  it('labels the days Monday first and flags exactly one as today', () => {
    const { days } = build();
    expect(days.map((day) => day.label)).toEqual(LABELS);
    expect(days.filter((day) => day.today)).toHaveLength(1);
    expect(days[3]?.today).toBe(true);
  });

  it('never returns a red or failure state: the vocabulary has none', () => {
    const states = build({
      checkins: [checkin('2026-10-05', false)],
      slips: [slip('2026-10-06T19:00:00.000Z')],
    }).days.map((day) => day.state);
    for (const state of states) {
      expect(['clean', 'slip', 'today', 'none', 'future', 'before']).toContain(state);
    }
  });
});

describe('todayIso', () => {
  it('is the anchor zone date, which is what recordCheckin keys on', () => {
    expect(todayIso(NOW, ZONE)).toBe('2026-10-08');
    expect(todayIso(new Date('2026-10-08T23:30:00.000Z'), ZONE)).toBe('2026-10-09');
  });
});
