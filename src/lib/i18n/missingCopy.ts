/**
 * The marker for Serbian that does not exist yet.
 *
 * Loud on purpose: it can never be mistaken for copy, never reads as a slash and never falls
 * back to the masculine form. An agent may not write, translate or paraphrase a Serbian
 * string, so a missing one renders this and goes on the list for Pavle.
 */
export function missingCopy(what: string): string {
  return `«TODO(copy): ${what}»`;
}

/** True when a string still carries a placeholder, so screens can be checked in a test. */
export function hasMissingCopy(value: string): boolean {
  return value.includes('«TODO(copy)');
}
