/*
 * DIRECTION CONTRACT
 * THESIS: The app is the website's world held in one hand. Paper ground, ember as the
 * single voice of action, one colour per Poriv tool. Refuses the category's dark
 * dashboard of counters and rings.
 * OWN-WORLD: paper #fdfcfa, ink #191512, ember #ec691c. Host Grotesk 600 headlines,
 * Manrope body. White 20pt cards with a line border; each tool carries the site's
 * painted texture panel and a Lucide glyph (1.9 stroke) in its colour on its tint.
 * Two-tone headings: ink line, ember line. The real flame on an ember tile.
 * STORY: Serbian smokers see the same Iskra they met on the site, and every control is
 * large enough to hit with a shaking hand.
 * FIRST VIEWPORT: brand lockup top-left, the question in 40pt Host Grotesk, supporting
 * paragraph, the six tools begin below; "Imam poriv" pinned in the thumb zone.
 * FORM: inherited world (iskraclub.com), no concept roll; M0 foundations specimen.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
 * review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
 */
import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { startDataSpine } from '@/data/spine';
import {
  installNotificationHandler,
  type NotificationTarget,
} from '@/features/notifications/scheduler';
import { color } from '@/theme';

export default function RootLayout() {
  // Local database, anonymous auth and sync start here and are never awaited: the first frame
  // renders from the phone, not the network.
  useEffect(() => startDataSpine(), []);

  // Local notifications (docs/M5-brief.md Task 5): never shown over a craving, and a tap opens
  // what it is about, including a tap that launched the app.
  useEffect(() => {
    installNotificationHandler();
    const open = (response: Notifications.NotificationResponse | null) => {
      const target = response?.notification.request.content.data?.target as
        NotificationTarget | undefined;
      if (target === 'checkin') {
        router.push({ pathname: '/pocetna', params: { checkin: String(Date.now()) } });
      } else if (target === 'goal') router.push('/napredak');
      else if (target === 'nudge') router.push('/pocetna');
    };
    const launched = Notifications.getLastNotificationResponse();
    if (launched) open(launched);
    const subscription = Notifications.addNotificationResponseReceivedListener(open);
    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.bg },
        }}
      />
    </>
  );
}
