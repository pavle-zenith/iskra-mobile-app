/**
 * Translating the local profile row into what Supabase expects. Pure.
 *
 * SQLite has no booleans and no arrays, so the local mirror stores 0/1 and JSON text. The
 * local-only columns (`id` is always 'me', `remote_id` is the auth user) never travel: the
 * sync engine stamps the real id at push time.
 */

export type LocalProfileRow = {
  id: string;
  remote_id: string | null;
  name: string | null;
  gender: string | null;
  product: string | null;
  cigarettes_per_day: number | null;
  cigarettes_per_pack: number | null;
  pack_price_rsd: number | null;
  quit_date: string | null;
  quit_time_zone: string | null;
  reasons: string;
  reason_text: string | null;
  fears: string;
  triggers: string;
  timing: string | null;
  onboarding_completed: number;
  is_premium: number;
  committed: number;
  signature_data: string | null;
  push_token: string | null;
  consented_at: string | null;
  analytics_consent: number;
  marketing_consent: number;
  marketing_consent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  name: string | null;
  gender: string | null;
  product: string | null;
  cigarettesPerDay: number | null;
  cigarettesPerPack: number | null;
  packPriceRsd: number | null;
  quitDate: string | null;
  quitTimeZone: string | null;
  reasons: string[];
  reasonText: string | null;
  fears: string[];
  triggers: string[];
  timing: string | null;
  onboardingCompleted: boolean;
  isPremium: boolean;
  committed: boolean;
  signatureData: string | null;
  /** When both required consent boxes were ticked. Null means nothing may be stored yet. */
  consentedAt: string | null;
  analyticsConsent: boolean;
  marketingConsent: boolean;
  updatedAt: string;
};

function parseList(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function toProfile(row: LocalProfileRow): Profile {
  return {
    name: row.name,
    gender: row.gender,
    product: row.product,
    cigarettesPerDay: row.cigarettes_per_day,
    cigarettesPerPack: row.cigarettes_per_pack,
    packPriceRsd: row.pack_price_rsd,
    quitDate: row.quit_date,
    quitTimeZone: row.quit_time_zone,
    reasons: parseList(row.reasons),
    reasonText: row.reason_text,
    fears: parseList(row.fears),
    triggers: parseList(row.triggers),
    timing: row.timing,
    onboardingCompleted: row.onboarding_completed === 1,
    isPremium: row.is_premium === 1,
    committed: row.committed === 1,
    signatureData: row.signature_data,
    consentedAt: row.consented_at,
    analyticsConsent: row.analytics_consent === 1,
    marketingConsent: row.marketing_consent === 1,
    updatedAt: row.updated_at,
  };
}

/**
 * The row as Supabase stores it. `id` is added by the sync engine from the session.
 *
 * `push_token` is not sent, and the server no longer has the column (migration 20260924122353).
 * Every notification is local and scheduled on the phone (ROADMAP Part 4, 23.09.2026), so no
 * server ever needs to reach this device. The phone's own column stays, always empty.
 */
export function toProfilePayload(row: LocalProfileRow): Record<string, unknown> {
  return {
    name: row.name,
    gender: row.gender,
    product: row.product,
    cigarettes_per_day: row.cigarettes_per_day,
    cigarettes_per_pack: row.cigarettes_per_pack,
    pack_price_rsd: row.pack_price_rsd,
    quit_date: row.quit_date,
    quit_time_zone: row.quit_time_zone,
    reasons: parseList(row.reasons),
    reason_text: row.reason_text,
    fears: parseList(row.fears),
    triggers: parseList(row.triggers),
    timing: row.timing,
    onboarding_completed: row.onboarding_completed === 1,
    committed: row.committed === 1,
    signature_data: row.signature_data,
    consented_at: row.consented_at,
    analytics_consent: row.analytics_consent === 1,
    marketing_consent: row.marketing_consent === 1,
    marketing_consent_at: row.marketing_consent_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
