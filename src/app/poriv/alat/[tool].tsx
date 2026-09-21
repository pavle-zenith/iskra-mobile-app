import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { DisemScreen } from '@/features/poriv/Disem';
import { usePorivSession } from '@/features/poriv/PorivSession';
import {
  BelezimScreen,
  OdlazemScreen,
  RazloziScreen,
  SetamScreen,
  VodaScreen,
} from '@/features/poriv/toolScreens';
import { isToolKey, type ToolKey } from '@/lib/vocab';

const SCREENS: Record<ToolKey, () => React.ReactElement> = {
  disem: DisemScreen,
  voda: VodaScreen,
  razlozi: RazloziScreen,
  setam: SetamScreen,
  odlazem: OdlazemScreen,
  belezim: BelezimScreen,
};

/**
 * One route for all six tools. Opening a tool records it on the craving straight away:
 * `tool_used` holds the LAST tool opened, the one that got them through, and writing on open
 * rather than on close means a kill mid-tool still records it.
 *
 * Exactly one write per tool. This effect used to depend on `openTool` itself, which changed
 * identity on every write, so it rewrote the row on every render for as long as a tool was
 * open: an outbox version climbing and a network upsert each time, mid-craving, on battery.
 */
export default function ToolRoute() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const { craving, openTool } = usePorivSession();
  const valid = isToolKey(tool);
  const cravingId = craving?.id ?? null;

  // Depends on the craving's id, not on the row: `openTool` is stable and writes only when
  // the tool is not already recorded, so this runs once per tool per craving.
  useEffect(() => {
    if (valid && cravingId) void openTool(tool);
  }, [valid, tool, cravingId, openTool]);

  if (!valid) return <Redirect href="/poriv" />;
  const Screen = SCREENS[tool];
  return <Screen />;
}
