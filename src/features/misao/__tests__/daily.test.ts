import { dayIndex, lineFor, recentLines } from '../daily';
import { MISLI } from '../misli';

const LINES = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const ZONE = 'Europe/Belgrade';

describe('Misao dana', () => {
  it('is the same line all day in the anchor zone, and the next line tomorrow', () => {
    const morning = new Date('2026-09-24T05:00:00Z');
    const night = new Date('2026-09-24T21:30:00Z'); // 23:30 in Belgrade, still the 24th
    const tomorrow = new Date('2026-09-24T22:30:00Z'); // 00:30 on the 25th in Belgrade
    expect(lineFor(LINES, morning, ZONE)).toBe(lineFor(LINES, night, ZONE));
    expect(dayIndex(tomorrow, ZONE)).toBe(dayIndex(night, ZONE) + 1);
    expect(lineFor(LINES, tomorrow, ZONE)).not.toBe(lineFor(LINES, night, ZONE));
  });

  it('shows the last five days, today last, never ahead', () => {
    const at = new Date('2026-09-24T12:00:00Z');
    const recent = recentLines(LINES, at, ZONE);
    expect(recent).toHaveLength(5);
    expect(recent[4]).toEqual({ line: lineFor(LINES, at, ZONE), daysAgo: 0 });
    expect(recent.map((entry) => entry.daysAgo)).toEqual([4, 3, 2, 1, 0]);
  });

  it('renders nothing while no line is approved', () => {
    expect(MISLI).toEqual([]);
    expect(lineFor(MISLI, new Date(), ZONE)).toBeNull();
    expect(recentLines(MISLI, new Date(), ZONE)).toEqual([]);
  });
});
