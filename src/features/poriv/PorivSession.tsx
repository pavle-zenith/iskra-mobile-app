import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { kvGet, kvSet } from '@/data/db';
import { listCravings, logCraving, updateCraving, updateSlip, type CravingRow } from '@/data/repo';
import type { CravingOutcome, ToolKey, TriggerKey } from '@/lib/vocab';

import { finishCraving } from './outcome';
import { findResumable, shouldRecordTool } from './session';

/**
 * The open craving, shared by Mode, the six tools and the two outcome screens.
 *
 * The row is the source of truth, not this state: every change is written through
 * `@/data/repo` the moment it happens, so a kill mid-craving loses nothing.
 *
 * Every callback here is stable, and reads the current row from a ref rather than from a
 * dependency. That is not tidiness: a callback that changes identity on every write re-runs
 * the effects that call it, and the tool route's effect then rewrote the row on every render,
 * for as long as a tool was open, bumping the outbox and pushing upserts in a loop.
 */

/** The craving the person closed with the X. Remembered so the app does not reopen it at them. */
const DISMISSED_KEY = 'poriv.dismissed';

export type PorivSessionValue = {
  /** Null only for the instant before the row exists; controls stay disabled until it is set. */
  craving: CravingRow | null;
  /** The slip written by this craving, if it ended in one. */
  slipId: string | null;
  /** Records the tool as the one that got them through. A no-op if it is already recorded. */
  openTool: (tool: ToolKey) => Promise<void>;
  /** Beležim, or the one optional tap afterwards. Updates the slip row too, when there is one. */
  note: (input: { trigger?: TriggerKey; strength?: number }) => Promise<void>;
  /** True if this call is the one that ended the craving; false if it was already over. */
  finish: (outcome: CravingOutcome) => Promise<boolean>;
  /** The X: leaves `outcome` null, because we do not know how it ended and never guess. */
  dismiss: () => Promise<void>;
};

const Context = createContext<PorivSessionValue | null>(null);

export function usePorivSession(): PorivSessionValue {
  const value = useContext(Context);
  if (!value) throw new Error('usePorivSession outside PorivProvider');
  return value;
}

/** The id the gate must not auto-resume. Read by the home route. */
export async function dismissedCravingId(): Promise<string | null> {
  return kvGet(DISMISSED_KEY);
}

/**
 * The craving waiting to be resumed, if there is one. The home route asks this on a cold
 * start so a killed craving reopens where it was.
 */
export async function resumableCraving(now = new Date()) {
  const [rows, dismissed] = await Promise.all([listCravings(), dismissedCravingId()]);
  return findResumable(rows, now, dismissed);
}

export function PorivProvider({ children }: { children: React.ReactNode }) {
  const [craving, setCraving] = useState<CravingRow | null>(null);
  const [slipId, setSlipId] = useState<string | null>(null);
  const started = useRef(false);

  // The callbacks read from here, so none of them depends on the row or changes identity.
  const cravingRef = useRef<CravingRow | null>(null);
  const slipRef = useRef<string | null>(null);

  const remember = useCallback((row: CravingRow | null) => {
    cravingRef.current = row;
    setCraving(row);
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let alive = true;

    void (async () => {
      // Resume the open craving if there is one; otherwise this is a new one. Tapping
      // "Imam poriv" on Home has already written the row, so that path resumes it here.
      const [rows, dismissed] = await Promise.all([listCravings(), dismissedCravingId()]);
      const open = findResumable(rows, new Date(), dismissed);
      const row = open
        ? (rows.find((candidate) => candidate.id === open.id) ?? null)
        : await logCraving();
      if (alive) remember(row);
    })();

    return () => {
      alive = false;
    };
  }, [remember]);

  const openTool = useCallback(
    async (tool: ToolKey) => {
      const current = cravingRef.current;
      if (!current || !shouldRecordTool(current, tool)) return;
      // The column holds one value and this is the last tool opened: the one that got them
      // through. Written on open, not on close, so a kill mid-tool still records it.
      const updated = await updateCraving(current.id, { toolUsed: tool });
      if (updated) remember(updated);
    },
    [remember],
  );

  const note = useCallback(
    async (input: { trigger?: TriggerKey; strength?: number }) => {
      const current = cravingRef.current;
      if (!current) return;
      const updated = await updateCraving(current.id, {
        ...(input.trigger !== undefined ? { trigger: input.trigger } : {}),
        ...(input.strength !== undefined ? { strength: input.strength } : {}),
      });
      if (updated) remember(updated);
      // The slip must carry the same trigger as its craving, or the two can never be compared,
      // which is the whole reason M2 gave them one shared vocabulary.
      if (slipRef.current && input.trigger !== undefined) {
        await updateSlip(slipRef.current, { trigger: input.trigger });
      }
    },
    [remember],
  );

  const finish = useCallback(
    async (outcome: CravingOutcome) => {
      const current = cravingRef.current;
      if (!current) return false;
      const result = await finishCraving(current, outcome);
      if (!result) return false;
      remember(result.craving);
      slipRef.current = result.slipId;
      setSlipId(result.slipId);
      return true;
    },
    [remember],
  );

  const dismiss = useCallback(async () => {
    const current = cravingRef.current;
    if (!current) return;
    await kvSet(DISMISSED_KEY, current.id);
  }, []);

  const value = useMemo<PorivSessionValue>(
    () => ({ craving, slipId, openTool, note, finish, dismiss }),
    [craving, slipId, openTool, note, finish, dismiss],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
