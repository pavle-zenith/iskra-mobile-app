import { deriveUserState } from '../state';

const BG = 'Europe/Belgrade';
const at = (iso: string) => new Date(iso);
const state = (quit: string | null, now: string, lastSlipAt?: string) =>
  deriveUserState({
    quitDate: quit ? at(quit) : null,
    anchorTimeZone: BG,
    now: at(now),
    lastSlipAt: lastSlipAt ? at(lastSlipAt) : null,
  });

describe('deriveUserState', () => {
  it('lands a future quit date in Pre-quit, never on a counter at zero', () => {
    expect(state('2026-10-01T00:00:00+02:00', '2026-09-21T10:00:00+02:00')).toBe('pre-quit');
  });

  it('treats a missing quit date as Pre-quit', () => {
    expect(state(null, '2026-09-21T10:00:00+02:00')).toBe('pre-quit');
  });

  it('walks day 0 to 3 as the acute window', () => {
    expect(state('2026-09-21T08:00:00+02:00', '2026-09-21T10:00:00+02:00')).toBe('acute');
    expect(state('2026-09-18T08:00:00+02:00', '2026-09-21T10:00:00+02:00')).toBe('acute');
  });

  it('moves to the first week, then consolidating, then established', () => {
    expect(state('2026-09-17T08:00:00+02:00', '2026-09-21T10:00:00+02:00')).toBe('first-week');
    expect(state('2026-09-14T08:00:00+02:00', '2026-09-21T10:00:00+02:00')).toBe('first-week');
    expect(state('2026-09-13T08:00:00+02:00', '2026-09-21T10:00:00+02:00')).toBe('consolidating');
    expect(state('2026-08-25T08:00:00+02:00', '2026-09-21T10:00:00+02:00')).toBe('consolidating');
    expect(state('2026-08-24T08:00:00+02:00', '2026-09-21T10:00:00+02:00')).toBe('established');
  });

  it('leads with absolution for two days after a slip, whatever the day count', () => {
    expect(
      state('2026-01-01T08:00:00+01:00', '2026-09-21T10:00:00+02:00', '2026-09-20T22:00:00+02:00'),
    ).toBe('post-slip');
    expect(
      state('2026-01-01T08:00:00+01:00', '2026-09-21T10:00:00+02:00', '2026-09-18T22:00:00+02:00'),
    ).toBe('established');
  });

  it('never shows post-slip before the quit date', () => {
    expect(
      state('2026-10-01T00:00:00+02:00', '2026-09-21T10:00:00+02:00', '2026-09-21T09:00:00+02:00'),
    ).toBe('pre-quit');
  });
});
