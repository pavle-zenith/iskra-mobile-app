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
 */
export default function ToolRoute() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const { openTool } = usePorivSession();
  const valid = isToolKey(tool);

  useEffect(() => {
    if (valid) void openTool(tool);
  }, [valid, tool, openTool]);

  if (!valid) return <Redirect href="/poriv" />;
  const Screen = SCREENS[tool];
  return <Screen />;
}
