import { toProfile, toProfilePayload, type LocalProfileRow } from '../profileRow';

const row: LocalProfileRow = {
  id: 'me',
  remote_id: 'user-1',
  name: 'Pavle',
  gender: 'muško',
  product: 'cigarete',
  cigarettes_per_day: 20,
  cigarettes_per_pack: 20,
  pack_price_rsd: 450,
  quit_date: '2026-10-01T00:00:00+02:00',
  quit_time_zone: 'Europe/Belgrade',
  reasons: '["zdravlje","pare"]',
  reason_text: 'Zbog ćerke.',
  fears: '["porivi"]',
  triggers: '["kafa","kafana"]',
  timing: 'odmah',
  onboarding_completed: 1,
  is_premium: 0,
  committed: 1,
  signature_data: 'M0,0 L10,10',
  push_token: null,
  created_at: '2026-09-20T10:00:00.000Z',
  updated_at: '2026-09-21T10:00:00.000Z',
};

describe('toProfile', () => {
  it('turns SQLite 0/1 and JSON text back into booleans and arrays', () => {
    const profile = toProfile(row);
    expect(profile.onboardingCompleted).toBe(true);
    expect(profile.isPremium).toBe(false);
    expect(profile.committed).toBe(true);
    expect(profile.reasons).toEqual(['zdravlje', 'pare']);
    expect(profile.triggers).toEqual(['kafa', 'kafana']);
    expect(profile.reasonText).toBe('Zbog ćerke.');
  });

  it('survives an empty or corrupt list without losing the profile', () => {
    expect(toProfile({ ...row, reasons: '', fears: 'not json' }).reasons).toEqual([]);
    expect(toProfile({ ...row, fears: 'not json' }).fears).toEqual([]);
    expect(toProfile({ ...row, triggers: '[1,"kafa"]' }).triggers).toEqual(['kafa']);
  });
});

describe('toProfilePayload', () => {
  const payload = toProfilePayload(row);

  it('never sends the local-only columns: the sync engine owns the id', () => {
    expect(payload).not.toHaveProperty('id');
    expect(payload).not.toHaveProperty('remote_id');
  });

  it('sends real booleans and arrays under the database column names', () => {
    expect(payload.onboarding_completed).toBe(true);
    expect(payload.committed).toBe(true);
    expect(payload.reasons).toEqual(['zdravlje', 'pare']);
    expect(payload.pack_price_rsd).toBe(450);
    expect(payload.quit_time_zone).toBe('Europe/Belgrade');
    expect(payload.signature_data).toBe('M0,0 L10,10');
  });

  it('never sends is_premium: pricing is not wired and the column stays false', () => {
    expect(payload).not.toHaveProperty('is_premium');
  });
});
