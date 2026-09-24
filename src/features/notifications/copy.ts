import type { TriggerKey } from '@/lib/vocab';

/**
 * Notification text, approved by Pavle in docs/M5-brief.md (Copy, 24.09.2026), verbatim. No
 * title except a goal's: the app's name shows.
 */
export const notificationCopy = {
  checkin: 'Kako je prošao dan? Jedan dodir i dan je zabeležen.',
  goalTitle: 'Cilj dostignut',
  /** "[title] [sub].", and Zdravlje "[title]: [sub]" (its sub already ends with a full stop). */
  goalBody: (title: string, sub: string, health: boolean) =>
    health ? `${title}: ${sub}` : `${title} ${sub}.`,
  nudges: {
    budjenje: 'Jutarnji poriv prođe za par minuta. Ako se javi, Iskra je jedan dodir daleko.',
    kafa: 'Kafa ide i bez cigarete. Ako se javi poriv, otvori Iskru.',
    posao: 'Pauza može i bez cigarete. Prošetaj ili popij vodu.',
    jelo: 'Posle jela poriv zna da se javi. Traje 3 do 5 minuta.',
    kafana: 'Večeras napolju? Kad se javi poriv, dodirni „Imam poriv".',
    alkohol: 'Večeras napolju? Kad se javi poriv, dodirni „Imam poriv".',
  } satisfies Partial<Record<TriggerKey, string>>,
} as const;
