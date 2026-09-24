/**
 * The consent rules, kept pure so they can be tested without a screen (docs/LEGAL-brief.md).
 *
 * Two boxes are required and separate: being 18 or older, and agreeing to the smoking and
 * craving data being kept. The third, analytics, is optional and starts unticked. Someone who
 * does not tick both required boxes cannot continue, and nothing else happens: no nagging, no
 * second screen.
 */
export type ConsentChoices = { age: boolean; data: boolean; analytics: boolean };

export const INITIAL_CHOICES: ConsentChoices = { age: false, data: false, analytics: false };

/** The button is enabled only when both required boxes are ticked. Analytics never counts. */
export function canAccept(choices: ConsentChoices): boolean {
  return choices.age && choices.data;
}
