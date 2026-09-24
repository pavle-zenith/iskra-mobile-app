import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { kvGet, kvSet } from '@/data/db';
import { listCheckins, getProfile, listSlips } from '@/data/repo';
import { syncGoals } from '@/features/ciljevi/data';
import { goalSub, goalTitle } from '@/features/ciljevi/copy';
import {
  DEFAULT_SETTINGS,
  planNotifications,
  type NotificationSettings,
  type Planned,
} from '@/lib/notifications/plan';
import { isTriggerKey, type TriggerKey } from '@/lib/vocab';

import { notificationCopy } from './copy';

/**
 * Hands the plan (`src/lib/notifications/plan.ts`) to the phone. Everything is local: no server
 * push, no token. Rebuilt from scratch on every launch, foreground and change, because a local
 * notification is fixed when it is scheduled and the app must read state before it speaks.
 */

const SETTINGS_KEY = 'notifications.settings';
const CHANNEL = 'iskra';

export async function readNotificationSettings(): Promise<NotificationSettings> {
  const raw = await kvGet(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<NotificationSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  await kvSet(SETTINGS_KEY, JSON.stringify(settings));
  await rescheduleNotifications();
}

/** True while Poriv mod or a tool is open: nothing is shown over a craving. */
let porivOpen = false;
export function setPorivOpen(open: boolean): void {
  porivOpen = open;
}

/** Foreground presentation: shown on Home and elsewhere, never during a craving. */
export function installNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: !porivOpen,
      shouldShowList: !porivOpen,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

let running: Promise<void> = Promise.resolve();

/** Rebuilds the next seven days. Runs one at a time; a call while one runs queues behind it. */
export function rescheduleNotifications(): Promise<void> {
  running = running.then(rebuild, rebuild);
  return running;
}

async function rebuild(): Promise<void> {
  const permission = await Notifications.getPermissionsAsync();
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!permission.granted) return;

  const [settings, profile, slips, checkins, goalsState] = await Promise.all([
    readNotificationSettings(),
    getProfile(),
    listSlips(),
    listCheckins(),
    syncGoals(),
  ]);
  if (!profile?.consentedAt || !profile.onboardingCompleted) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Iskra',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const now = new Date();
  const byKey = new Map(goalsState.goals.map((goal) => [goal.key, goal]));
  const plan = planNotifications({
    now,
    settings,
    triggers: (profile.triggers ?? []).filter((key): key is TriggerKey => isTriggerKey(key)),
    // Only goals whose crossing can be computed: Vreme and Zdravlje, from the quit date.
    goals: goalsState.goals
      .filter(
        (goal) =>
          !goal.reached &&
          goal.crossedAt &&
          (goal.category === 'vreme' || goal.category === 'zdravlje'),
      )
      .map((goal) => ({ key: goal.key, at: goal.crossedAt as Date })),
    lastSlipAt: slips[0] ? new Date(slips[0].created_at) : null,
    answeredDates: new Set(checkins.map((row) => row.date)),
    quitDate: profile.quitDate ? new Date(profile.quitDate) : null,
  });

  for (const item of plan) {
    const content = contentFor(item, byKey);
    if (!content) continue;
    await Notifications.scheduleNotificationAsync({
      content: { ...content, data: dataFor(item) },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: item.at,
        channelId: CHANNEL,
      },
    });
  }
}

function contentFor(
  item: Planned,
  goals: Map<string, Parameters<typeof goalTitle>[0]>,
): Notifications.NotificationContentInput | null {
  switch (item.kind) {
    case 'checkin':
      return { body: notificationCopy.checkin };
    case 'nudge': {
      const body = (notificationCopy.nudges as Partial<Record<TriggerKey, string>>)[item.trigger];
      return body ? { body } : null;
    }
    case 'goal': {
      const goal = goals.get(item.key);
      if (!goal) return null;
      return {
        title: notificationCopy.goalTitle,
        body: notificationCopy.goalBody(
          goalTitle(goal),
          goalSub(goal),
          goal.category === 'zdravlje',
        ),
      };
    }
  }
}

/** What a tap opens: the check-in sheet, the Napredak tab, or Home. */
export type NotificationTarget = 'checkin' | 'goal' | 'nudge';

function dataFor(item: Planned): Record<string, string> {
  return { target: item.kind satisfies NotificationTarget };
}
