import type { CravingRow } from '@/data/repo';

import { shouldRecordTool } from '../session';

const craving = (over: Partial<CravingRow> = {}): CravingRow => ({
  id: 'c1',
  strength: null,
  trigger: null,
  tool_used: null,
  duration_seconds: null,
  outcome: null,
  created_at: '2026-10-05T12:00:00.000Z',
  ...over,
});

/**
 * The guard that stopped the write loop.
 *
 * The tool route's effect used to depend on the `openTool` callback, which changed identity on
 * every write, so it rewrote the row on every render for as long as a tool was open: an
 * exclusive transaction, a climbing outbox version and a network upsert each time, mid-craving
 * and on battery. The effect now keys on the craving's id, and this is the second line of
 * defence: the same tool is never written twice.
 */
describe('shouldRecordTool', () => {
  it('records a tool the craving has not seen', () => {
    expect(shouldRecordTool(craving(), 'disem')).toBe(true);
    expect(shouldRecordTool(craving({ tool_used: 'voda' }), 'disem')).toBe(true);
  });

  it('is a no-op when the same tool is already recorded, however often it is asked', () => {
    const open = craving({ tool_used: 'disem' });
    for (let render = 0; render < 50; render += 1) {
      expect(shouldRecordTool(open, 'disem')).toBe(false);
    }
  });

  it('writes nothing before the row exists', () => {
    expect(shouldRecordTool(null, 'disem')).toBe(false);
  });
});
