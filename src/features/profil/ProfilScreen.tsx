import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CigaretteOff,
  FileText,
  Flag,
  FlaskConical,
  Lightbulb,
  Lock,
  Mail,
  RefreshCcw,
  User,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusScrim } from '@/components/StatusScrim';
import { Icon, Pressable, Text } from '@/components/primitives';
import { deleteEverything } from '@/data/account';
import { getAccountEmail, getBoundUserId } from '@/data/auth';
import { getProfile, listSlips, setMarketingConsent, updateProfile } from '@/data/repo';
import { profil as legal } from '@/features/legal/copy';
import { openLegal } from '@/features/legal/links';
import { progressFor } from '@/features/napredak/data';
import {
  readNotificationSettings,
  saveNotificationSettings,
} from '@/features/notifications/scheduler';
import { TRIGGERS } from '@/features/onboarding/copy';
import { formatDate } from '@/lib/i18n/date';
import { NUDGE_DEFAULTS, type Clock, type NotificationSettings } from '@/lib/notifications/plan';
import type { Profile } from '@/lib/sync/profileRow';
import { isTriggerKey, type TriggerKey } from '@/lib/vocab';
import { color, elevation, minTarget, radius, space } from '@/theme';

import { CONTACT_EMAIL, profilCopy, SOURCES_URL } from './copy';
import { TimeSheet } from './TimeSheet';

/**
 * Profil, the fourth tab: the export's SettingsScreen structure (docs/M5-brief.md, Export
 * alignment 7). A profile card, then Moj profil, Podešavanja, O Iskri and Moje iskustvo, then the
 * danger zone. LEGAL's minimum stays: the account id to quote in a request, the analytics
 * switch, the policy and terms, and "Obriši sve podatke".
 *
 * Deleting is not red. `negative` is never pointed at the user: erasing your own data is a right,
 * not a failure. The confirmation carries the weight instead.
 */
type ProfilData = {
  profile: Profile | null;
  days: number | null;
  accountId: string | null;
  email: string | null;
  settings: NotificationSettings;
  permission: boolean;
};

export function ProfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<ProfilData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingTime, setEditingTime] = useState<
    { kind: 'checkin' } | { kind: 'risky'; trigger: TriggerKey } | null
  >(null);
  const deletingRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void (async () => {
        const [profile, slips, accountId, email, settings, permission] = await Promise.all([
          getProfile(),
          listSlips(),
          getBoundUserId(),
          getAccountEmail(),
          readNotificationSettings(),
          Notifications.getPermissionsAsync(),
        ]);
        if (!alive) return;
        const quitDate = profile?.quitDate ? new Date(profile.quitDate) : null;
        const days =
          quitDate && quitDate.getTime() <= Date.now()
            ? progressFor(profile, slips, new Date()).smokeFreeDays
            : null;
        setData({ profile, days, accountId, email, settings, permission: permission.granted });
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  const changeSettings = (next: NotificationSettings) => {
    setData((current) => (current ? { ...current, settings: next } : current));
    void saveNotificationSettings(next);
  };

  const setAnalytics = (on: boolean) => {
    setData((current) =>
      current?.profile
        ? { ...current, profile: { ...current.profile, analyticsConsent: on } }
        : current,
    );
    void updateProfile({ analyticsConsent: on });
  };

  const setMarketing = (on: boolean) => {
    setData((current) =>
      current?.profile
        ? { ...current, profile: { ...current.profile, marketingConsent: on } }
        : current,
    );
    void setMarketingConsent(on);
  };

  /** A new quit date is confirmed first: the counters restart from it, the slips stay. */
  const changeQuitDate = () => {
    const copy = profilCopy.quitConfirm;
    Alert.alert(copy.title, copy.body, [
      { text: copy.cancel, style: 'cancel' },
      {
        text: copy.confirm,
        onPress: () => router.push({ pathname: '/profil/[polje]', params: { polje: 'datum' } }),
      },
    ]);
  };

  const erase = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    // The phone is wiped before this returns; the server part finishes now or on reconnect.
    await deleteEverything();
    if (router.canDismiss()) router.dismissAll();
    router.replace('/onboarding');
  };

  const confirmErase = () => {
    Alert.alert(legal.deleteTitle, legal.deleteBody, [
      { text: legal.deleteCancel, style: 'cancel' },
      { text: legal.deleteConfirm, onPress: () => void erase() },
    ]);
  };

  // Paper, not a spinner: the first frame is the app's own ground.
  if (!data) return <View style={styles.screen} />;

  const { profile, settings } = data;
  const name = profile?.name?.trim() ?? '';
  const account = data.email ?? data.accountId;
  const quitDate = profile?.quitDate ? new Date(profile.quitDate) : null;
  const perDay = profile?.cigarettesPerDay;
  const price = profile?.packPriceRsd;
  // Rizični trenuci: the triggers chosen in onboarding that have a time of day.
  const timedTriggers = (profile?.triggers ?? []).filter(
    (key): key is TriggerKey => isTriggerKey(key) && NUDGE_DEFAULTS[key] !== undefined,
  );
  const version = Constants.expoConfig?.version ?? '';

  const clockOf = (target: NonNullable<typeof editingTime>): Clock =>
    target.kind === 'checkin'
      ? settings.checkin.time
      : (settings.risky.times[target.trigger] ??
        NUDGE_DEFAULTS[target.trigger] ?? { hour: 20, minute: 0 });

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.md }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="title" accessibilityRole="header">
          {profilCopy.title}
        </Text>

        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.avatar}>
            <Text variant="heading" style={{ color: color.onAccent }}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.grow}>
            <Text variant="heading">{name}</Text>
            {data.days !== null ? (
              <Text variant="body" color="textSoft">
                {profilCopy.headerLine(data.days)}
              </Text>
            ) : null}
          </View>
        </View>

        <Section title={profilCopy.sections.profile}>
          <Row
            first
            icon={User}
            label={profilCopy.rows.nameGender}
            value={name}
            onPress={() => router.push({ pathname: '/profil/[polje]', params: { polje: 'ime' } })}
          />
          <Row
            icon={CalendarDays}
            label={profilCopy.rows.quitDate}
            value={quitDate ? formatDate(quitDate) : undefined}
            onPress={changeQuitDate}
          />
          <Row
            icon={CigaretteOff}
            label={profilCopy.rows.habits}
            value={perDay && price ? profilCopy.rows.habitsValue(perDay, price) : undefined}
            onPress={() =>
              router.push({ pathname: '/profil/[polje]', params: { polje: 'navike' } })
            }
          />
        </Section>

        <Section title={profilCopy.sections.settings}>
          {data.permission ? (
            <>
              <ToggleRow
                first
                icon={Bell}
                label={profilCopy.notifications.checkin}
                value={settings.checkin.enabled}
                onChange={(on) =>
                  changeSettings({ ...settings, checkin: { ...settings.checkin, enabled: on } })
                }
              />
              {settings.checkin.enabled ? (
                <TimeRow
                  clock={settings.checkin.time}
                  label={profilCopy.notifications.checkin}
                  onPress={() => setEditingTime({ kind: 'checkin' })}
                />
              ) : null}
              <ToggleRow
                icon={Flag}
                label={profilCopy.notifications.goals}
                value={settings.goals.enabled}
                onChange={(on) => changeSettings({ ...settings, goals: { enabled: on } })}
              />
              {timedTriggers.length > 0 ? (
                <ToggleRow
                  icon={Zap}
                  label={profilCopy.notifications.risky}
                  value={settings.risky.enabled}
                  onChange={(on) =>
                    changeSettings({ ...settings, risky: { ...settings.risky, enabled: on } })
                  }
                />
              ) : null}
              {settings.risky.enabled
                ? timedTriggers.map((trigger) => (
                    <TimeRow
                      key={trigger}
                      label={TRIGGERS.find((option) => option.key === trigger)?.label ?? trigger}
                      clock={clockOf({ kind: 'risky', trigger })}
                      onPress={() => setEditingTime({ kind: 'risky', trigger })}
                    />
                  ))
                : null}
              <Text variant="caption" color="textMuted" style={styles.quiet}>
                {profilCopy.notifications.quiet}
              </Text>
            </>
          ) : (
            <View style={styles.permission}>
              <Text variant="body" color="textSoft">
                {profilCopy.notifications.permissionOff}
              </Text>
              <Pressable
                onPress={() => void Linking.openSettings()}
                accessibilityLabel={profilCopy.notifications.openSettings}
                style={styles.inlineButton}
              >
                <Text variant="label">{profilCopy.notifications.openSettings}</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.divider} />
          <ToggleRow
            label={legal.analytics}
            hint={legal.analyticsHint}
            value={profile?.analyticsConsent ?? false}
            onChange={setAnalytics}
          />
          {data.email ? (
            <ToggleRow
              label={legal.marketing}
              hint={legal.marketingHint}
              value={profile?.marketingConsent ?? false}
              onChange={setMarketing}
            />
          ) : null}
        </Section>

        <Section title={profilCopy.sections.about}>
          <Row
            first
            icon={Lock}
            label={profilCopy.rows.privacy}
            onPress={() => openLegal('privacy')}
          />
          <Row icon={FileText} label={profilCopy.rows.terms} onPress={() => openLegal('terms')} />
          <Row
            icon={FlaskConical}
            label={profilCopy.rows.science}
            onPress={() => void Linking.openURL(SOURCES_URL)}
          />
        </Section>

        {/* "Oceni aplikaciju" appears once a store listing exists. */}
        <Section title={profilCopy.sections.experience}>
          <Row
            first
            icon={Lightbulb}
            label={profilCopy.rows.suggest}
            onPress={() => void Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
          />
          <Row
            icon={Mail}
            label={profilCopy.rows.problem}
            onPress={() => void Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
          />
        </Section>

        {account ? (
          <View style={styles.card}>
            <Text variant="caption" color="textMuted" style={styles.eyebrow}>
              {legal.account.toUpperCase()}
            </Text>
            {/* Selectable: long-press to copy, with no clipboard dependency. */}
            <Text variant="bodyStrong" selectable>
              {account}
            </Text>
            <Text variant="caption" color="textMuted">
              {legal.accountIdHint}
            </Text>
          </View>
        ) : null}

        {/* The danger zone. "Odjava" joins it once accounts exist (docs/ACCOUNT-brief.md). */}
        <View style={styles.listCard}>
          <Row
            first
            icon={RefreshCcw}
            label={profilCopy.rows.newQuitDate}
            onPress={changeQuitDate}
          />
          <Pressable
            onPress={confirmErase}
            disabled={deleting}
            accessibilityLabel={legal.deleteAll}
            style={[styles.erase, styles.rowRule]}
          >
            <Text variant="label">{legal.deleteAll}</Text>
          </Pressable>
        </View>

        <Text variant="caption" color="textMuted" style={styles.footer}>
          {profilCopy.footer(version)}
        </Text>
      </ScrollView>

      <StatusScrim />

      <TimeSheet
        visible={editingTime !== null}
        title={
          editingTime?.kind === 'risky'
            ? (TRIGGERS.find((option) => option.key === editingTime.trigger)?.label ?? '')
            : profilCopy.notifications.checkin
        }
        value={editingTime ? clockOf(editingTime) : { hour: 20, minute: 0 }}
        onClose={() => setEditingTime(null)}
        onSave={(clock) => {
          if (!editingTime) return;
          if (editingTime.kind === 'checkin') {
            changeSettings({ ...settings, checkin: { ...settings.checkin, time: clock } });
          } else {
            changeSettings({
              ...settings,
              risky: {
                ...settings.risky,
                times: { ...settings.risky.times, [editingTime.trigger]: clock },
              },
            });
          }
          setEditingTime(null);
        }}
      />
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="caption" color="textMuted" style={styles.sectionLabel}>
        {title.toUpperCase()}
      </Text>
      <View style={styles.listCard}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  first = false,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  onPress: () => void;
  first?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      feedback="none"
      style={[styles.row, first ? null : styles.rowRule]}
    >
      <Icon as={icon} size={20} color={color.textSoft} />
      <Text variant="body" style={styles.grow}>
        {label}
      </Text>
      {value ? (
        <Text variant="caption" color="textMuted" numberOfLines={1} style={styles.value}>
          {value}
        </Text>
      ) : null}
      <Icon as={ChevronRight} size={18} color={color.textMuted} />
    </Pressable>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onChange,
  first = false,
}: {
  icon?: LucideIcon;
  label: string;
  hint?: string;
  value: boolean;
  onChange: (on: boolean) => void;
  first?: boolean;
}) {
  return (
    <View style={[styles.row, first ? null : styles.rowRule]}>
      {icon ? <Icon as={icon} size={20} color={color.textSoft} /> : null}
      <View style={styles.grow}>
        <Text variant="body">{label}</Text>
        {hint ? (
          <Text variant="caption" color="textMuted">
            {hint}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: color.accent, false: color.line }}
        thumbColor={color.surface}
        ios_backgroundColor={color.line}
      />
    </View>
  );
}

/** A notification's time, indented under its switch; tapping it opens the time sheet. */
function TimeRow({ label, clock, onPress }: { label: string; clock: Clock; onPress: () => void }) {
  const time = `${String(clock.hour).padStart(2, '0')}:${String(clock.minute).padStart(2, '0')}`;
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`${label}, ${time}`}
      feedback="none"
      style={[styles.row, styles.rowRule, styles.timeRow]}
    >
      <Text variant="body" color="textSoft" style={styles.grow}>
        {label}
      </Text>
      <Text variant="bodyStrong">{time}</Text>
      <Icon as={ChevronRight} size={18} color={color.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.gutter, paddingBottom: space.xl, gap: space.md },
  grow: { flex: 1 },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    padding: space.md,
    gap: space.xs,
    ...(elevation.raised as object),
  },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { gap: space.xs },
  sectionLabel: { letterSpacing: 1, marginLeft: space.xxs },
  listCard: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    overflow: 'hidden',
    ...(elevation.raised as object),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    minHeight: minTarget + 6,
    paddingVertical: space.xs,
  },
  rowRule: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
  value: { maxWidth: '45%' },
  timeRow: { paddingLeft: space.md + 20 + space.sm },
  quiet: { paddingHorizontal: space.md, paddingBottom: space.sm },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: color.line },
  permission: { padding: space.md, gap: space.sm },
  inlineButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    justifyContent: 'center',
  },
  eyebrow: { letterSpacing: 1 },
  erase: { minHeight: minTarget + 6, alignItems: 'center', justifyContent: 'center' },
  footer: { textAlign: 'center', marginTop: space.xs },
});
