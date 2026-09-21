import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Icon, Pressable, Text } from '@/components/primitives';
import { color, fontFamily, minTarget, radius, space, textVariants } from '@/theme';

import { copy } from './copy';

/** Minus, a big number, plus. The minus dims at the minimum rather than disappearing. */
export function Stepper({
  value,
  unit,
  min,
  max,
  onChange,
}: {
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        haptic="light"
        accessibilityLabel="Manje"
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.stepperButton, styles.stepperMinus]}
      >
        <Icon as={Minus} size={24} color={color.text} />
      </Pressable>

      <View style={styles.stepperValue}>
        <Text variant="display" accessibilityLabel={`${value} ${unit}`}>
          {value}
        </Text>
        <Text variant="caption" color="textMuted">
          {unit}
        </Text>
      </View>

      <Pressable
        haptic="light"
        accessibilityLabel="Više"
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={[styles.stepperButton, styles.stepperPlus]}
      >
        <Icon as={Plus} size={24} color={color.onAccent} />
      </Pressable>
    </View>
  );
}

export function NumberField({
  value,
  onChange,
  suffix,
  placeholder,
  accessibilityLabel,
  maxLength = 6,
}: {
  value: number | null;
  onChange: (next: number | null) => void;
  suffix?: string;
  placeholder?: string;
  accessibilityLabel: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.field, focused && styles.fieldFocused]}>
      <TextInput
        value={value === null ? '' : String(value)}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, '').slice(0, maxLength);
          onChange(digits === '' ? null : Number(digits));
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        inputMode="numeric"
        placeholder={placeholder}
        placeholderTextColor={color.textMuted}
        accessibilityLabel={accessibilityLabel}
        style={styles.input}
      />
      {suffix ? (
        <Text variant="bodyStrong" color="textMuted">
          {suffix}
        </Text>
      ) : null}
    </View>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  accessibilityLabel,
  maxLength = 120,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  accessibilityLabel: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.field, styles.textAreaBox, focused && styles.fieldFocused]}>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.slice(0, maxLength))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={color.textMuted}
        accessibilityLabel={accessibilityLabel}
        multiline
        style={[styles.input, styles.textArea]}
      />
    </View>
  );
}

// --- calendar --------------------------------------------------------------

const MS_PER_DAY = 86_400_000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Monday-first grid for the given month. */
export function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Sunday is 0 in JS; the week starts on Monday here.
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(new Date(year, month, day));
  return cells;
}

/** The quit day picker: today and later only, past days are shown but not selectable. */
export function Calendar({
  value,
  onChange,
  today = new Date(),
}: {
  value: Date | null;
  onChange: (next: Date) => void;
  today?: Date;
}) {
  const start = startOfDay(today);
  const [view, setView] = useState({ year: start.getFullYear(), month: start.getMonth() });
  const cells = monthGrid(view.year, view.month);
  const atMin = view.year === start.getFullYear() && view.month === start.getMonth();

  const shift = (by: number) => {
    const next = new Date(view.year, view.month + by, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  };

  return (
    <View style={{ gap: space.sm }}>
      <View style={styles.monthBar}>
        <Pressable
          onPress={() => shift(-1)}
          disabled={atMin}
          accessibilityLabel="Prethodni mesec"
          style={styles.monthButton}
        >
          <Icon as={ChevronLeft} size={22} color={atMin ? color.line : color.text} />
        </Pressable>
        <Text variant="label">{`${copy.date.months[view.month]} ${view.year}`}</Text>
        <Pressable
          onPress={() => shift(1)}
          accessibilityLabel="Sledeći mesec"
          style={styles.monthButton}
        >
          <Icon as={ChevronRight} size={22} color={color.text} />
        </Pressable>
      </View>

      <View style={styles.week}>
        {copy.date.weekdays.map((day) => (
          <Text key={day} variant="caption" color="textMuted" style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((date, index) => {
          if (!date) return <View key={`pad-${index}`} style={styles.day} />;
          const isPast = date.getTime() < start.getTime();
          const isToday = date.getTime() === start.getTime();
          const selected = !!value && startOfDay(value).getTime() === date.getTime();
          return (
            <Pressable
              key={date.toISOString()}
              disabled={isPast}
              onPress={() => onChange(date)}
              haptic="light"
              feedback="none"
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: isPast }}
              accessibilityLabel={`${date.getDate()}. ${copy.date.months[date.getMonth()]}`}
              style={[
                styles.day,
                selected && styles.daySelected,
                !selected && isToday && styles.dayToday,
              ]}
            >
              <Text
                variant="body"
                style={{
                  color: selected ? color.onAccent : isPast ? color.line : color.text,
                  fontFamily: selected ? fontFamily.bodyBold : fontFamily.body,
                }}
              >
                {date.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export { MS_PER_DAY };

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.md,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperMinus: { borderWidth: 1, borderColor: color.line, backgroundColor: color.surface },
  stepperPlus: { backgroundColor: color.accent },
  stepperValue: { alignItems: 'center', gap: 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: minTarget + 8,
    paddingHorizontal: space.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface,
  },
  fieldFocused: { borderColor: color.accent },
  input: {
    flex: 1,
    color: color.text,
    fontFamily: fontFamily.body,
    fontSize: textVariants.bodyLarge.fontSize,
    paddingVertical: space.sm,
  },
  textAreaBox: { alignItems: 'flex-start', minHeight: 120 },
  textArea: { minHeight: 104, textAlignVertical: 'top' },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: minTarget,
    height: minTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  week: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  day: {
    width: `${100 / 7}%`,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
  },
  daySelected: { backgroundColor: color.accent, borderRadius: 23 },
  dayToday: { borderWidth: 1, borderColor: color.line, borderRadius: 23 },
});
