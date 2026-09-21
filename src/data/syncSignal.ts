/**
 * A one-way doorbell from writers to the sync engine. Kept separate so the repository never
 * imports the engine (which imports the repository). If nothing is listening yet, the ring is
 * dropped: the engine drains everything on start anyway.
 */
type Listener = (reason: string) => void;

let listener: Listener | null = null;

export function requestSync(reason: string): void {
  listener?.(reason);
}

export function onSyncRequested(next: Listener): () => void {
  listener = next;
  return () => {
    if (listener === next) listener = null;
  };
}
