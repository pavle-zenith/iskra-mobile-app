import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Pressable, Text } from '@/components/primitives';
import { deleteEverything } from '@/data/account';
import { getAccountEmail, getBoundUserId } from '@/data/auth';
import { getProfile, setMarketingConsent, updateProfile } from '@/data/repo';
import { legalLinks, profil } from '@/features/legal/copy';
import { openLegal } from '@/features/legal/links';
import { color, minTarget, radius, space } from '@/theme';

/**
 * Profil, the minimum Apple requires (docs/LEGAL-brief.md Task 2): the account, the two consent
 * toggles, "Obriši sve podatke", and the policy and terms.
 *
 * A row whose data does not exist is not shown. Anonymous accounts have no email, so the email
 * and the marketing toggle appear only once docs/ACCOUNT-brief.md gives the account one: an
 * "emails with tips" switch on an account with no email would promise something impossible.
 *
 * Deleting is not red. Every reference colours it red, but `negative` is never pointed at the
 * user (AGENTS.md): erasing your own data is a right, not a failure. The confirmation carries
 * the weight instead. Structure: .impeccable/review/profil/REFERENCES.md.
 */
type ProfilData = {
  accountId: string | null;
  email: string | null;
  analytics: boolean;
  marketing: boolean;
};

export function ProfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<ProfilData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [profile, accountId, email] = await Promise.all([
        getProfile(),
        getBoundUserId(),
        getAccountEmail(),
      ]);
      if (!alive) return;
      setData({
        accountId,
        email,
        analytics: profile?.analyticsConsent ?? false,
        marketing: profile?.marketingConsent ?? false,
      });
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setAnalytics = (on: boolean) => {
    setData((current) => (current ? { ...current, analytics: on } : current));
    void updateProfile({ analyticsConsent: on });
  };

  const setMarketing = (on: boolean) => {
    setData((current) => (current ? { ...current, marketing: on } : current));
    void setMarketingConsent(on);
  };

  const erase = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    // The phone is wiped before this returns; the server part finishes now or on reconnect.
    await deleteEverything();
    // Back to the very start, signed out, as the brief and the Roots reference end.
    if (router.canDismiss()) router.dismissAll();
    router.replace('/onboarding');
  };

  const confirmErase = () => {
    Alert.alert(profil.deleteTitle, profil.deleteBody, [
      { text: profil.deleteCancel, style: 'cancel' },
      { text: profil.deleteConfirm, onPress: () => void erase() },
    ]);
  };

  // Paper, not a spinner: the first frame is the app's own ground.
  if (!data) return <View style={styles.screen} />;

  // The account line is the email once there is one; until then the id, which is what a
  // request by email can quote.
  const account = data.email ?? data.accountId;

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top + space.xs }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel={profil.back}
          hitSlop={space.xs}
          style={styles.back}
        >
          <Icon as={ChevronLeft} size={26} color={color.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="title" accessibilityRole="header">
          {profil.title}
        </Text>

        {account ? (
          <View style={styles.card}>
            <Text variant="caption" color="textMuted" style={styles.eyebrow}>
              {profil.account}
            </Text>
            {/* Selectable: long-press to copy, with no clipboard dependency. */}
            <Text variant="bodyStrong" selectable style={styles.account}>
              {account}
            </Text>
            <Text variant="caption" color="textMuted">
              {profil.accountIdHint}
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          {data.email ? (
            <ToggleRow
              label={profil.marketing}
              hint={profil.marketingHint}
              value={data.marketing}
              onChange={setMarketing}
            />
          ) : null}
          <ToggleRow
            label={profil.analytics}
            hint={profil.analyticsHint}
            value={data.analytics}
            onChange={setAnalytics}
          />
        </View>

        <View style={styles.card}>
          <LinkRow label={legalLinks.privacy} onPress={() => openLegal('privacy')} />
          <View style={styles.divider} />
          <LinkRow label={legalLinks.terms} onPress={() => openLegal('terms')} />
        </View>

        <Pressable
          onPress={confirmErase}
          disabled={deleting}
          accessibilityLabel={profil.deleteAll}
          style={styles.erase}
        >
          <Text variant="label">{profil.deleteAll}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text variant="bodyStrong">{label}</Text>
        <Text variant="caption" color="textMuted">
          {hint}
        </Text>
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

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={label}
      feedback="none"
      style={styles.linkRow}
    >
      <Text variant="body">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  top: { paddingHorizontal: space.gutter },
  back: {
    width: minTarget,
    height: minTarget,
    justifyContent: 'center',
    marginLeft: -space.sm,
  },
  content: { paddingHorizontal: space.gutter, paddingTop: space.md, gap: space.md },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    padding: space.md,
    gap: space.xs,
  },
  eyebrow: { letterSpacing: 1.2 },
  account: { fontVariant: ['tabular-nums'] },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: minTarget,
    paddingVertical: space.xs,
  },
  toggleText: { flex: 1, gap: 2 },
  linkRow: { minHeight: minTarget, justifyContent: 'center' },
  divider: { height: 1, backgroundColor: color.line },
  erase: {
    minHeight: minTarget + 8,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
});
