import {
  Beer,
  Bird,
  Calendar,
  CigaretteOff,
  CloudLightning,
  Coffee,
  Coins,
  Dumbbell,
  Ellipsis,
  Flame,
  Gauge,
  Heart,
  Hourglass,
  Laptop,
  RotateCcw,
  Scale,
  Sunrise,
  ThermometerSun,
  Users,
  Utensils,
  Wine,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

import type { TriggerKey } from '@/lib/vocab';
import { color, progressColor, toolColor } from '@/theme';

/**
 * One coloured glyph per option, as the copy brief asks for ("small colored icon + title")
 * and the export's own screens do it: a Lucide glyph in a solid hue, on a rounded square of
 * its tint, always beside or above the option's Serbian label.
 *
 * Hues come from `@/theme` only. The export draws four colours the website does not have
 * (#BA7517, #4A6080, #D4547E, #999999); each is mapped to its nearest palette token rather
 * than pasted in, because `tokens.ts` is a port of `globals.css` and the site leads.
 *
 * Glyph-on-tint runs 2.78:1 to 5.53:1. That is only allowed because the label carries the
 * meaning (AGENTS.md); never render one of these without its text.
 */
export type Glyph = { icon: LucideIcon; color: string; tint: string };

const swatch = {
  ember: { color: color.accent, tint: color.accentTint },
  teal: toolColor.disem,
  blue: toolColor.voda,
  green: toolColor.setam,
  indigo: toolColor.odlazem,
  violet: toolColor.belezim,
  money: { color: progressColor.money.base, tint: progressColor.money.tint },
  health: { color: progressColor.health.base, tint: progressColor.health.tint },
  time: { color: progressColor.time.base, tint: progressColor.time.tint },
  /** "Nešto drugo" is the option with no colour of its own, so it does not claim one. */
  neutral: { color: color.textMuted, tint: color.well },
} as const;

const glyph = (icon: LucideIcon, s: { color: string; tint: string }): Glyph => ({
  icon,
  color: s.color,
  tint: s.tint,
});

/**
 * The ten shared trigger keys. Laid out two to a row, so neighbours are given hues that do
 * not read as the same colour at a glance.
 */
export const TRIGGER_GLYPHS: Record<TriggerKey, Glyph> = {
  kafa: glyph(Coffee, swatch.ember),
  budjenje: glyph(Sunrise, swatch.health),
  posao: glyph(Laptop, swatch.teal),
  kafana: glyph(Beer, swatch.violet),
  okolina: glyph(Users, swatch.blue),
  alkohol: glyph(Wine, swatch.time),
  stres: glyph(CloudLightning, swatch.indigo),
  jelo: glyph(Utensils, swatch.money),
  dosada: glyph(Hourglass, swatch.green),
  drugo: glyph(Ellipsis, swatch.neutral),
};

/** Reasons. Heart, people and bird follow the export's own three. */
export const REASON_GLYPHS: Record<string, Glyph> = {
  zdravlje: glyph(Heart, swatch.health),
  porodica: glyph(Users, swatch.blue),
  pare: glyph(Coins, swatch.money),
  forma: glyph(Dumbbell, swatch.teal),
  sloboda: glyph(Bird, swatch.time),
  pritisak: glyph(Gauge, swatch.indigo),
};

/** Fears. `neuspeh` gets a retry arrow, not a falling graph: the card's point is that
 * trying again is normal. */
export const FEAR_GLYPHS: Record<string, Glyph> = {
  porivi: glyph(Zap, swatch.ember),
  stres: glyph(CloudLightning, swatch.indigo),
  kafana: glyph(Users, swatch.violet),
  neuspeh: glyph(RotateCcw, swatch.blue),
  razdrazljivost: glyph(ThermometerSun, swatch.health),
  kilaza: glyph(Scale, swatch.money),
};

/** The four summary stats, in the order `SummaryStep` builds them. */
export const STAT_GLYPHS = {
  quitDate: glyph(Calendar, swatch.ember),
  perDay: glyph(CigaretteOff, swatch.blue),
  packPrice: glyph(Coins, swatch.money),
  perYear: glyph(Flame, swatch.ember),
} as const;

/**
 * The dot beside each health milestone, warming from the first hours to the first year.
 * Decoration beside text, so it carries no meaning of its own.
 */
export const MILESTONE_DOTS: readonly string[] = [
  swatch.money.color,
  swatch.money.color,
  swatch.teal.color,
  swatch.teal.color,
  swatch.time.color,
  swatch.ember.color,
];
