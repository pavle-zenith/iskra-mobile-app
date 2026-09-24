import {
  computeProgress,
  evaluateGoals,
  goalEta,
  upcomingInOrder,
  mergeHistory,
  nearestGoals,
  newlyReached,
  nextInCategory,
  type GoalInput,
} from '..';

const DAY = 86_400_000;
const QUIT = new Date('2026-09-01T08:00:00Z');

const input = (days: number, over: Partial<GoalInput> = {}): GoalInput => {
  const now = new Date(QUIT.getTime() + days * DAY);
  return {
    progress: computeProgress({
      quitDate: QUIT,
      cigarettesPerDay: 20,
      packPriceRsd: 450,
      cigarettesPerPack: 20,
      slips: [],
      now,
    }),
    quitDate: QUIT,
    now,
    cravingsSurvived: 0,
    cleanCheckins: 0,
    ...over,
  };
};

const keys = (goals: { key: string; reached: boolean }[]) =>
  goals.filter((goal) => goal.reached).map((goal) => goal.key);

describe('evaluateGoals', () => {
  it('reaches the time goals by elapsed days, with the crossing computable', () => {
    const goals = evaluateGoals(input(7.5)).filter((goal) => goal.category === 'vreme');
    expect(keys(goals)).toEqual(['vreme-1', 'vreme-3', 'vreme-7']);
    expect(goals[2]?.crossedAt).toEqual(new Date(QUIT.getTime() + 7 * DAY));
    expect(goals[3]).toMatchObject({ key: 'vreme-14', left: { kind: 'time', ms: 6.5 * DAY } });
  });

  it('reaches money and cigarette goals from the engine figures', () => {
    // 20 days: 400 cigarettes, 9.000 RSD.
    const goals = evaluateGoals(input(20));
    expect(keys(goals.filter((goal) => goal.category === 'novac'))).toEqual([
      'novac-1000',
      'novac-5000',
    ]);
    expect(nextInCategory(goals, 'novac')).toMatchObject({
      key: 'novac-10000',
      left: { kind: 'rsd', amount: 1000 },
    });
    expect(keys(goals.filter((goal) => goal.category === 'cigarete'))).toEqual(['cigarete-100']);
  });

  it('counts cravings survived and clean check-ins', () => {
    const goals = evaluateGoals(input(2, { cravingsSurvived: 12, cleanCheckins: 7 }));
    expect(keys(goals.filter((goal) => goal.category === 'porivi'))).toEqual([
      'porivi-1',
      'porivi-10',
    ]);
    expect(keys(goals.filter((goal) => goal.category === 'provere'))).toEqual(['provere-7']);
    expect(nextInCategory(goals, 'porivi')?.fraction).toBeCloseTo(2 / 15);
  });

  it('has the eleven health items as Zdravlje goals', () => {
    const health = evaluateGoals(input(3.2)).filter((goal) => goal.category === 'zdravlje');
    expect(health).toHaveLength(11);
    expect(keys(health)).toHaveLength(5);
  });

  it('adds yearly time goals one at a time', () => {
    const vreme = evaluateGoals(input(400)).filter((goal) => goal.category === 'vreme');
    expect(vreme.map((goal) => goal.threshold).slice(-2)).toEqual([365, 730]);
  });

  it('reaches nothing before the quit date', () => {
    const goals = evaluateGoals({ ...input(0), quitDate: null });
    expect(keys(goals)).toEqual([]);
  });
});

describe('history', () => {
  it('keeps a goal reached once it has a row, even after a slip pulls the number back', () => {
    const goals = evaluateGoals(input(4)); // 80 cigarettes: cigarete-100 not reached
    const merged = mergeHistory(goals, new Set(['cigarete-100']));
    expect(merged.find((goal) => goal.key === 'cigarete-100')).toMatchObject({
      reached: true,
      fraction: 1,
    });
  });

  it('writes only what has no row yet', () => {
    const goals = evaluateGoals(input(3.5));
    expect(newlyReached(goals, new Set(['vreme-1'])).map((goal) => goal.key)).toContain('vreme-3');
    expect(newlyReached(goals, new Set(['vreme-1'])).map((goal) => goal.key)).not.toContain(
      'vreme-1',
    );
  });
});

describe('nearestGoals', () => {
  it('gives the next goal of each category, the most advanced first', () => {
    const nearest = nearestGoals(evaluateGoals(input(6.5, { cravingsSurvived: 9 })), 3);
    expect(nearest).toHaveLength(3);
    expect(nearest[0]?.fraction).toBeGreaterThanOrEqual(nearest[1]?.fraction ?? 0);
    expect(new Set(nearest.map((goal) => goal.category)).size).toBe(3);
  });
});

describe('the roadmap order', () => {
  it('puts clocked goals first, soonest first, then the rest by progress', () => {
    const state = input(2.5, { cravingsSurvived: 5 });
    const order = upcomingInOrder(evaluateGoals(state), state.progress);
    // Day 2.5: "3 dana" in half a day comes before "72 sata" health in half a day or so.
    const etas = order
      .map((goal) => goalEta(goal, state.progress))
      .filter((eta): eta is number => eta !== null);
    expect([...etas].sort((a, b) => a - b)).toEqual(etas);
    const firstUntimed = order.findIndex((goal) => goalEta(goal, state.progress) === null);
    expect(
      order.slice(firstUntimed).every((goal) => ['porivi', 'provere'].includes(goal.category)),
    ).toBe(true);
  });

  it('projects money from the daily cost', () => {
    const state = input(1);
    const next = nextInCategory(evaluateGoals(state), 'novac');
    // 450 RSD saved, 550 to go at 450 a day.
    expect(goalEta(next!, state.progress)).toBeCloseTo((550 / 450) * DAY);
  });
});
