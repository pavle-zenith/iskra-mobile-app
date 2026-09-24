import type { TriggerKey } from '@/lib/vocab';

/**
 * Which local notifications the next seven days hold (docs/M5-brief.md Task 5, Pavle's rule of
 * 23.09.2026 in ROADMAP Part 4). Pure: it plans, and the scheduler hands the plan to the phone.
 *
 * - Three kinds: the evening check-in, a goal reached (at its crossing), a nudge at the time of
 *   a trigger chosen in onboarding
 * - At most three a day, and nothing between 22:00 and 08:00
 * - Nothing for 48 hours after a slip
 * - It reads state before it speaks: the plan is rebuilt on every launch, foreground and change,
 *   so a goal a slip or a date edit has made untrue is never left scheduled
 */

export type Clock = { hour: number; minute: number };

export type NotificationSettings = {
  checkin: { enabled: boolean; time: Clock };
  goals: { enabled: boolean };
  risky: { enabled: boolean; times: Partial<Record<TriggerKey, Clock>> };
};

/** Triggers with a time of day, and their defaults. The rest get no nudge. */
export const NUDGE_DEFAULTS: Partial<Record<TriggerKey, Clock>> = {
  budjenje: { hour: 7, minute: 30 },
  kafa: { hour: 8, minute: 30 },
  posao: { hour: 11, minute: 0 },
  jelo: { hour: 14, minute: 0 },
  kafana: { hour: 20, minute: 0 },
  alkohol: { hour: 20, minute: 0 },
};

/** Kafana and alkohol nudge on Friday and Saturday evenings only. */
const WEEKEND_ONLY: readonly TriggerKey[] = ['kafana', 'alkohol'];

export const DEFAULT_SETTINGS: NotificationSettings = {
  checkin: { enabled: true, time: { hour: 20, minute: 0 } },
  goals: { enabled: true },
  risky: { enabled: true, times: {} },
};

export const QUIET_FROM_HOUR = 22;
export const QUIET_UNTIL_HOUR = 8;
export const MAX_PER_DAY = 3;
export const SILENCE_AFTER_SLIP_MS = 48 * 60 * 60 * 1000;
export const HORIZON_DAYS = 7;

export type PlannedGoal = { key: string; at: Date };

export type PlanInput = {
  now: Date;
  settings: NotificationSettings;
  /** The triggers chosen in onboarding, in their order. */
  triggers: readonly TriggerKey[];
  /** Goals not yet reached whose crossing time can be computed (Vreme, Zdravlje). */
  goals: readonly PlannedGoal[];
  lastSlipAt: Date | null;
  /** No check-in is planned for a day already answered. */
  answeredDates: ReadonlySet<string>;
  /** Before the quit date there is nothing to check in on and no goal on its way. */
  quitDate: Date | null;
};

export type Planned =
  | { kind: 'checkin'; at: Date }
  | { kind: 'goal'; at: Date; key: string }
  | { kind: 'nudge'; at: Date; trigger: TriggerKey };

/** Kinds in the order they keep their place when a day would hold more than three. */
const PRIORITY: Record<Planned['kind'], number> = { goal: 0, checkin: 1, nudge: 2 };

export function isQuiet(at: Date): boolean {
  const hour = at.getHours();
  return hour >= QUIET_FROM_HOUR || hour < QUIET_UNTIL_HOUR;
}

/** The same moment, or 08:00 after it when it falls between 22:00 and 08:00. */
export function afterQuiet(moment: Date): Date {
  if (!isQuiet(moment)) return moment;
  const morning = new Date(
    moment.getFullYear(),
    moment.getMonth(),
    moment.getDate(),
    QUIET_UNTIL_HOUR,
    0,
  );
  // Before midnight the morning is tomorrow's.
  if (moment.getHours() >= QUIET_FROM_HOUR) morning.setDate(morning.getDate() + 1);
  return morning;
}

/** "2026-09-24", the phone's own calendar day. */
export function dayKey(at: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}`;
}

function at(day: Date, clock: Clock): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), clock.hour, clock.minute);
}

export function planNotifications(input: PlanInput): Planned[] {
  const { now, settings, quitDate } = input;
  const end = new Date(now.getTime() + HORIZON_DAYS * 86_400_000);
  const silentUntil = input.lastSlipAt
    ? new Date(input.lastSlipAt.getTime() + SILENCE_AFTER_SLIP_MS)
    : null;
  const candidates: Planned[] = [];

  for (let offset = 0; offset <= HORIZON_DAYS; offset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);

    if (settings.checkin.enabled && quitDate && !input.answeredDates.has(dayKey(day))) {
      candidates.push({ kind: 'checkin', at: at(day, settings.checkin.time) });
    }

    if (settings.risky.enabled) {
      for (const trigger of input.triggers) {
        const clock = settings.risky.times[trigger] ?? NUDGE_DEFAULTS[trigger];
        if (!clock) continue;
        // Friday is 5, Saturday 6.
        if (WEEKEND_ONLY.includes(trigger) && day.getDay() !== 5 && day.getDay() !== 6) continue;
        candidates.push({ kind: 'nudge', at: at(day, clock), trigger });
      }
    }
  }

  if (settings.goals.enabled) {
    // A quit date is set at midnight, so every Vreme goal and most Zdravlje ones are crossed in
    // the quiet hours. They are told at 08:00, the first moment the app may speak, not dropped.
    for (const goal of input.goals) {
      candidates.push({ kind: 'goal', at: afterQuiet(goal.at), key: goal.key });
    }
  }

  const allowed = candidates.filter(
    (item) =>
      item.at.getTime() > now.getTime() &&
      item.at.getTime() <= end.getTime() &&
      !isQuiet(item.at) &&
      !(silentUntil && item.at.getTime() < silentUntil.getTime()),
  );

  // One nudge per time slot (kafana and alkohol share 20:00 and would say it twice), then at
  // most three a day, the highest priority first.
  const seen = new Set<string>();
  const unique = allowed.filter((item) => {
    if (item.kind !== 'nudge') return true;
    const slot = `${item.at.getTime()}`;
    if (seen.has(slot)) return false;
    seen.add(slot);
    return true;
  });

  const byDay = new Map<string, Planned[]>();
  for (const item of unique) {
    const key = dayKey(item.at);
    byDay.set(key, [...(byDay.get(key) ?? []), item]);
  }

  const kept: Planned[] = [];
  for (const items of byDay.values()) {
    kept.push(
      ...[...items]
        .sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind] || a.at.getTime() - b.at.getTime())
        .slice(0, MAX_PER_DAY),
    );
  }
  return kept.sort((a, b) => a.at.getTime() - b.at.getTime());
}
