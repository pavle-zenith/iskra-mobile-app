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
import { listCravings, logCraving, updateCraving, type CravingRow } from '@/data/repo';
import type { CravingOutcome, ToolKey, TriggerKey } from '@/lib/vocab';

import { finishCraving } from './outcome';
import { findResumable } from './session';

/**
 * The open craving, shared by Mode, the six tools and the two outcome screens.
 *
 * The row is the source of truth, not this state: every change is written through
 * `@/data/repo` the moment it happens, so a kill mid-craving loses nothing. Reads come back
 * from SQLite on the next open.
 */

/** The craving the person closed with the X. Remembered so the app does not reopen it at them. */
const DISMISSED_KEY = 'poriv.dismissed';

export type PorivSessionValue = {
  /** Null only for the instant before the row exists; screens render their ground meanwhile. */
  craving: CravingRow | null;
  /** Records the tool as the one that got them through, and survives a kill mid-tool. */
  openTool: (tool: ToolKey) => Promise<void>;
  /** Beležim, or the one optional tap after the craving. */
  note: (input: { trigger?: TriggerKey; strength?: number }) => Promise<void>;
  finish: (outcome: CravingOutcome) => Promise<void>;
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
  const starting = useRef(false);

  useEffect(() => {
    if (starting.current) return;
    starting.current = true;
    let alive = true;

    void (async () => {
      // Resume the open craving if there is one; otherwise this is a new one. Tapping
      // "Imam poriv" on Home has already written the row, so that path resumes it here.
      const [rows, dismissed] = await Promise.all([listCravings(), dismissedCravingId()]);
      const open = findResumable(rows, new Date(), dismissed);
      const row = open
        ? (rows.find((candidate) => candidate.id === open.id) ?? null)
        : await logCraving();
      if (alive) setCraving(row);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const openTool = useCallback(
    async (tool: ToolKey) => {
      if (!craving) return;
      // The column holds one value and this is the last tool opened: the one that got them
      // through. Written on open, not on close, so a kill mid-tool still records it.
      const updated = await updateCraving(craving.id, { toolUsed: tool });
      if (updated) setCraving(updated);
    },
    [craving],
  );

  const note = useCallback(
    async (input: { trigger?: TriggerKey; strength?: number }) => {
      if (!craving) return;
      const updated = await updateCraving(craving.id, {
        ...(input.trigger !== undefined ? { trigger: input.trigger } : {}),
        ...(input.strength !== undefined ? { strength: input.strength } : {}),
      });
      if (updated) setCraving(updated);
    },
    [craving],
  );

  const finish = useCallback(
    async (outcome: CravingOutcome) => {
      if (!craving) return;
      const updated = await finishCraving(craving, outcome);
      if (updated) setCraving(updated);
    },
    [craving],
  );

  const dismiss = useCallback(async () => {
    if (!craving) return;
    await kvSet(DISMISSED_KEY, craving.id);
  }, [craving]);

  const value = useMemo<PorivSessionValue>(
    () => ({ craving, openTool, note, finish, dismiss }),
    [craving, openTool, note, finish, dismiss],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
