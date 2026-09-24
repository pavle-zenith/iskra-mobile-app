import { useRouter } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { kvGet, kvSet } from '@/data/db';
import { getProfile, updateProfile, type ProfilePatch } from '@/data/repo';
import {
  canAdvance,
  nextStep,
  previousStep,
  resumeStep,
  type OnboardingDraft,
  type StepId,
} from '@/lib/onboarding/steps';

import { genderCode, type GenderCode } from './gender';
import type { CopyContext, ProductKey } from './copy';

/**
 * Onboarding state. Every answer is written to SQLite the moment it is given, so a force-quit
 * on step 11 comes back to step 11 with the answers intact, and the profile syncs itself when
 * there is signal. Nothing here waits on the network.
 */

const STEP_KEY = 'onboarding.step';

type OnboardingValue = {
  ready: boolean;
  draft: OnboardingDraft;
  /** Everything the copy layer needs to render a sentence about this person. */
  copyContext: CopyContext;
  gender: GenderCode;
  canAdvanceFrom: (step: StepId) => boolean;
  answer: (patch: OnboardingDraft) => Promise<void>;
  goNext: (from: StepId) => Promise<void>;
  goBack: (from: StepId) => void;
  finish: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingValue | null>(null);

/** Draft answers become profile columns. The two names differ; this is the only mapping. */
function toProfilePatch(draft: OnboardingDraft): ProfilePatch {
  const patch: ProfilePatch = {};
  if (draft.name !== undefined) patch.name = draft.name;
  if (draft.gender !== undefined) patch.gender = draft.gender;
  if (draft.product !== undefined) patch.product = draft.product;
  if (draft.cigarettesPerDay !== undefined) patch.cigarettesPerDay = draft.cigarettesPerDay;
  if (draft.packPriceRsd !== undefined) patch.packPriceRsd = draft.packPriceRsd;
  if (draft.reasons !== undefined) patch.reasons = draft.reasons;
  if (draft.reasonText !== undefined) patch.reasonText = draft.reasonText;
  if (draft.fears !== undefined) patch.fears = draft.fears;
  if (draft.triggers !== undefined) patch.triggers = draft.triggers;
  if (draft.timing !== undefined) patch.timing = draft.timing;
  if (draft.quitDate !== undefined) patch.quitDate = draft.quitDate;
  if (draft.quitTimeZone !== undefined) patch.quitTimeZone = draft.quitTimeZone;
  if (draft.committed !== undefined) patch.committed = draft.committed;
  if (draft.signatureData !== undefined) patch.signatureData = draft.signatureData;
  return patch;
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [draft, setDraft] = useState<OnboardingDraft>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    void getProfile().then((profile) => {
      if (!alive || !profile) {
        if (alive) setReady(true);
        return;
      }
      setDraft({
        name: profile.name ?? undefined,
        gender: profile.gender ?? undefined,
        product: profile.product ?? undefined,
        cigarettesPerDay: profile.cigarettesPerDay ?? undefined,
        packPriceRsd: profile.packPriceRsd || undefined,
        reasons: profile.reasons.length ? profile.reasons : undefined,
        reasonText: profile.reasonText ?? undefined,
        fears: profile.fears.length ? profile.fears : undefined,
        triggers: profile.triggers.length ? profile.triggers : undefined,
        timing: profile.timing ?? undefined,
        quitDate: profile.quitDate ?? undefined,
        quitTimeZone: profile.quitTimeZone ?? undefined,
        committed: profile.committed || undefined,
        signatureData: profile.signatureData ?? undefined,
      });
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const answer = useCallback(async (patch: OnboardingDraft) => {
    setDraft((current) => ({ ...current, ...patch }));
    await updateProfile(toProfilePatch(patch));
  }, []);

  const goNext = useCallback(
    async (from: StepId) => {
      const next = nextStep(from);
      if (!next) return;
      await kvSet(STEP_KEY, next);
      router.push({ pathname: '/onboarding/[step]', params: { step: next } });
    },
    [router],
  );

  const goBack = useCallback(
    (from: StepId) => {
      const previous = previousStep(from);
      if (!previous) return;
      void kvSet(STEP_KEY, previous);
      if (router.canGoBack()) router.back();
      else router.replace({ pathname: '/onboarding/[step]', params: { step: previous } });
    },
    [router],
  );

  const finish = useCallback(async () => {
    await updateProfile({ onboardingCompleted: true });
    await kvSet(STEP_KEY, null);
    router.replace('/');
  }, [router]);

  const gender = genderCode(draft.gender);

  const value = useMemo<OnboardingValue>(
    () => ({
      ready,
      draft,
      gender,
      copyContext: {
        name: draft.name ?? '',
        gender,
        product: (draft.product as ProductKey) ?? 'cigarete',
        cigarettesPerDay: draft.cigarettesPerDay ?? 20,
        cigarettesPerPack: 20,
        packPriceRsd: draft.packPriceRsd ?? 0,
        alreadyQuit: draft.timing === 'vec_prestao',
      },
      canAdvanceFrom: (step: StepId) => canAdvance(step, draft),
      answer,
      goNext,
      goBack,
      finish,
    }),
    [ready, draft, gender, answer, goNext, goBack, finish],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingValue {
  const value = useContext(OnboardingContext);
  if (!value) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return value;
}

/**
 * Where onboarding should open: the saved step, held back to the first unanswered question.
 * `splash` is true until consent is on the phone: the intro and the consent screen come first.
 */
export async function resumeOnboardingTarget(): Promise<{ splash: boolean; step: StepId }> {
  const [saved, profile] = await Promise.all([kvGet(STEP_KEY), getProfile()]);
  const draft: OnboardingDraft = profile
    ? {
        name: profile.name ?? undefined,
        gender: profile.gender ?? undefined,
        product: profile.product ?? undefined,
        cigarettesPerDay: profile.cigarettesPerDay ?? undefined,
        packPriceRsd: profile.packPriceRsd || undefined,
        reasons: profile.reasons.length ? profile.reasons : undefined,
        reasonText: profile.reasonText ?? undefined,
        fears: profile.fears.length ? profile.fears : undefined,
        triggers: profile.triggers.length ? profile.triggers : undefined,
        timing: profile.timing ?? undefined,
        quitDate: profile.quitDate ?? undefined,
        committed: profile.committed || undefined,
        signatureData: profile.signatureData ?? undefined,
      }
    : {};
  const step = resumeStep((saved as StepId | null) ?? null, draft);
  // The intro and consent come first for anyone who has not consented. After consent the
  // intro is behind them: they resume on a step, which is step 1 if nothing is answered yet.
  return { splash: !profile?.consentedAt, step };
}
