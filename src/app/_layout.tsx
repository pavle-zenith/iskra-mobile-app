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
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { startDataSpine } from '@/data/spine';
import { color } from '@/theme';

export default function RootLayout() {
  // Local database, anonymous auth and sync start here and are never awaited: the first frame
  // renders from the phone, not the network.
  useEffect(() => startDataSpine(), []);

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
