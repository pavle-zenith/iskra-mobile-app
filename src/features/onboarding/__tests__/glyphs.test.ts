import { TRIGGER_KEYS } from '@/lib/vocab';

import { FEARS, REASONS, TRIGGERS, copy } from '../copy';
import { FEAR_GLYPHS, MILESTONE_DOTS, REASON_GLYPHS, STAT_GLYPHS, TRIGGER_GLYPHS } from '../glyphs';

/**
 * Every option a person can tap carries a coloured glyph, because the copy brief asks for one
 * and because a grid of identical text tiles is unreadable at a glance (PRODUCT.md: "Icon plus
 * one word"). A key added to the vocabulary without a glyph fails here rather than shipping a
 * blank tile.
 */
describe('every option has a glyph', () => {
  it('covers all ten trigger keys, the database vocabulary', () => {
    expect(Object.keys(TRIGGER_GLYPHS).sort()).toEqual([...TRIGGER_KEYS].sort());
    for (const trigger of TRIGGERS) {
      expect({ key: trigger.key, has: !!TRIGGER_GLYPHS[trigger.key as never] }).toEqual({
        key: trigger.key,
        has: true,
      });
    }
  });

  it('covers every reason and every fear on screen', () => {
    for (const reason of REASONS) {
      expect({ key: reason.key, has: !!REASON_GLYPHS[reason.key] }).toEqual({
        key: reason.key,
        has: true,
      });
    }
    for (const fear of FEARS) {
      expect({ key: fear.key, has: !!FEAR_GLYPHS[fear.key] }).toEqual({ key: fear.key, has: true });
    }
  });

  it('gives the summary a stat glyph and one dot per milestone', () => {
    expect(Object.keys(STAT_GLYPHS).sort()).toEqual(Object.keys(copy.summary.statLabels).sort());
    expect(MILESTONE_DOTS).toHaveLength(copy.summary.milestones.length);
  });
});

describe('glyph colours come from the theme', () => {
  const all = [
    ...Object.values(TRIGGER_GLYPHS),
    ...Object.values(REASON_GLYPHS),
    ...Object.values(FEAR_GLYPHS),
    ...Object.values(STAT_GLYPHS),
  ];

  it('gives each glyph a colour and a tint to sit on', () => {
    for (const glyph of all) {
      expect(glyph.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(glyph.tint).toMatch(/^#[0-9a-f]{6}$/i);
      expect(glyph.color).not.toBe(glyph.tint);
    }
  });

  it('never gives two triggers in the same row the same hue', () => {
    const keys = Object.keys(TRIGGER_GLYPHS) as (keyof typeof TRIGGER_GLYPHS)[];
    for (let i = 0; i + 1 < keys.length; i += 2) {
      const left = TRIGGER_GLYPHS[keys[i] as keyof typeof TRIGGER_GLYPHS];
      const right = TRIGGER_GLYPHS[keys[i + 1] as keyof typeof TRIGGER_GLYPHS];
      expect({ row: i / 2, same: left.color === right.color }).toEqual({
        row: i / 2,
        same: false,
      });
    }
  });
});
