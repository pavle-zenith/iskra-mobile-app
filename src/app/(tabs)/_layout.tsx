import { Tabs } from 'expo-router';
import { BookOpen, Flag, House, User, type LucideIcon } from 'lucide-react-native';

import { Icon } from '@/components/primitives';
import { color, fontFamily } from '@/theme';

/**
 * The bottom nav (docs/M5-brief.md Task 0), turned on now that every tab leads somewhere real:
 * Početna · Napredak · Saznaj · Profil, with the export's glyphs (home, flag, book, user) in
 * Lucide at the app's stroke. The active tab is ember, the rest muted, as in the export.
 * "Imam poriv" is pinned above the nav on Home only.
 */
const TABS: readonly { name: string; title: string; icon: LucideIcon }[] = [
  { name: 'pocetna', title: 'Početna', icon: House },
  { name: 'napredak', title: 'Napredak', icon: Flag },
  { name: 'saznaj', title: 'Saznaj', icon: BookOpen },
  { name: 'profil', title: 'Profil', icon: User },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.accent,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: {
          backgroundColor: color.bg,
          borderTopColor: color.line,
        },
        tabBarLabelStyle: { fontFamily: fontFamily.bodySemiBold, fontSize: 11 },
        sceneStyle: { backgroundColor: color.bg },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <Icon as={tab.icon} size={23} color={focused ? color.accent : color.textMuted} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
