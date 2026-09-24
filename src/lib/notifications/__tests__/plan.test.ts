import {
  afterQuiet,
  DEFAULT_SETTINGS,
  dayKey,
  isQuiet,
  MAX_PER_DAY,
  planNotifications,
  type PlanInput,
} from '../plan';

// Wednesday 23 September 2026, 12:00, the phone's own time.
const NOW = new Date(2026, 8, 23, 12, 0);
const HOUR = 3_600_000;

const input = (over: Partial<PlanInput> = {}): PlanInput => ({
  now: NOW,
  settings: DEFAULT_SETTINGS,
  triggers: [],
  goals: [],
  lastSlipAt: null,
  answeredDates: new Set(),
  quitDate: new Date(2026, 8, 20),
  ...over,
});

describe('afterQuiet', () => {
  it('moves a moment in the quiet hours to 08:00, the same night or the next morning', () => {
    expect(afterQuiet(new Date(2026, 8, 25, 0, 0))).toEqual(new Date(2026, 8, 25, 8, 0));
    expect(afterQuiet(new Date(2026, 8, 24, 23, 10))).toEqual(new Date(2026, 8, 25, 8, 0));
    expect(afterQuiet(new Date(2026, 8, 24, 15, 0))).toEqual(new Date(2026, 8, 24, 15, 0));
  });
});

describe('planNotifications', () => {
  it('plans the evening check-in each day, and none for a day already answered', () => {
    const plan = planNotifications(input({ answeredDates: new Set([dayKey(NOW)]) }));
    const checkins = plan.filter((item) => item.kind === 'checkin');
    expect(checkins[0]?.at).toEqual(new Date(2026, 8, 24, 20, 0));
    expect(checkins.every((item) => item.at.getHours() === 20)).toBe(true);
  });

  it('plans nothing between 22:00 and 08:00', () => {
    const plan = planNotifications(
      input({
        triggers: ['budjenje'],
        settings: {
          ...DEFAULT_SETTINGS,
          checkin: { enabled: true, time: { hour: 22, minute: 30 } },
          risky: { enabled: true, times: { budjenje: { hour: 6, minute: 0 } } },
        },
      }),
    );
    expect(plan).toEqual([]);
    expect(isQuiet(new Date(2026, 8, 24, 21, 59))).toBe(false);
    expect(isQuiet(new Date(2026, 8, 24, 8, 0))).toBe(false);
  });

  it('keeps 48 hours of silence after a slip', () => {
    const slip = new Date(NOW.getTime() - HOUR);
    const plan = planNotifications(input({ lastSlipAt: slip, triggers: ['kafa'] }));
    expect(plan.length).toBeGreaterThan(0);
    expect(plan.every((item) => item.at.getTime() >= slip.getTime() + 48 * HOUR)).toBe(true);
  });

  it('never plans more than three a day, goals first', () => {
    const plan = planNotifications(
      input({
        triggers: ['budjenje', 'kafa', 'posao', 'jelo'],
        goals: [{ key: 'vreme-3', at: new Date(2026, 8, 24, 15, 0) }],
      }),
    );
    const perDay = new Map<string, number>();
    for (const item of plan) perDay.set(dayKey(item.at), (perDay.get(dayKey(item.at)) ?? 0) + 1);
    expect(Math.max(...perDay.values())).toBe(MAX_PER_DAY);
    const tomorrow = plan.filter((item) => dayKey(item.at) === '2026-09-24');
    expect(tomorrow.map((item) => item.kind)).toEqual(['nudge', 'goal', 'checkin']);
  });

  it('nudges kafana and alkohol on Friday and Saturday evenings only, once', () => {
    const plan = planNotifications(
      input({ triggers: ['kafana', 'alkohol'], answeredDates: new Set() }),
    );
    const nudges = plan.filter((item) => item.kind === 'nudge');
    expect(nudges.map((item) => item.at.getDay())).toEqual([5, 6]);
  });

  it('gives triggers without a time of day no nudge', () => {
    const plan = planNotifications(input({ triggers: ['stres', 'dosada', 'okolina', 'drugo'] }));
    expect(plan.filter((item) => item.kind === 'nudge')).toEqual([]);
  });

  it('plans no check-in and no goal before there is a quit date', () => {
    const plan = planNotifications(input({ quitDate: null }));
    expect(plan.filter((item) => item.kind === 'checkin')).toEqual([]);
  });

  it('respects each switch', () => {
    const off = {
      checkin: { enabled: false, time: { hour: 20, minute: 0 } },
      goals: { enabled: false },
      risky: { enabled: false, times: {} },
    };
    const plan = planNotifications(
      input({
        settings: off,
        triggers: ['kafa'],
        goals: [{ key: 'vreme-3', at: new Date(2026, 8, 24, 15, 0) }],
      }),
    );
    expect(plan).toEqual([]);
  });

  it('tells a goal crossed at midnight at 08:00 instead of dropping it', () => {
    const plan = planNotifications(
      input({ goals: [{ key: 'vreme-7', at: new Date(2026, 8, 25, 0, 0) }] }),
    );
    expect(plan.find((item) => item.kind === 'goal')?.at).toEqual(new Date(2026, 8, 25, 8, 0));
  });

  it('plans nothing in the past and nothing past seven days', () => {
    const plan = planNotifications(
      input({
        goals: [
          { key: 'past', at: new Date(NOW.getTime() - HOUR) },
          { key: 'far', at: new Date(NOW.getTime() + 8 * 24 * HOUR) },
        ],
      }),
    );
    expect(plan.filter((item) => item.kind === 'goal')).toEqual([]);
  });
});
