import { RazloziScreen } from '@/features/poriv/toolScreens';

/**
 * Moji razlozi outside a craving, opened from Home's "Tvoji razlozi" card. It is not under
 * /poriv: that stack's provider opens a craving, and reading your reasons on Home is not one
 * (docs/HOME-V2-brief.md: no `cravings` row is written, the same rule as the onboarding demo).
 */
export default function RazloziRoute() {
  return <RazloziScreen />;
}
