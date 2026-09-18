import {
  Footprints,
  GlassWater,
  Heart,
  Hourglass,
  SquarePen,
  Wind,
  type LucideIcon,
} from 'lucide-react-native';
import type { ImageSourcePropType } from 'react-native';

import type { ToolKey } from '@/theme';

export type PorivTool = {
  key: ToolKey;
  /** Final v1.0 copy from PRODUCT.md. Do not paraphrase. */
  label: string;
  icon: LucideIcon;
  /** The tool's painted panel from iskraclub.com. Bundled, so it renders offline. */
  texture: ImageSourcePropType;
};

/**
 * The six Poriv tools, in PRODUCT.md order. Glyphs and textures match the website's
 * tool cards (see assets/PROVENANCE.md).
 *
 * TODO(M1): `key` must equal the value written to `cravings.tool_used`. Confirm the
 * column's allowed values against the live schema before the first row is written.
 */
export const porivTools: readonly PorivTool[] = [
  { key: 'disem', label: 'Dišem', icon: Wind, texture: require('@assets/tools/disem.jpg') },
  {
    key: 'voda',
    label: 'Pijem vodu',
    icon: GlassWater,
    texture: require('@assets/tools/voda.jpg'),
  },
  {
    key: 'razlozi',
    label: 'Moji razlozi',
    icon: Heart,
    texture: require('@assets/tools/razlozi.jpg'),
  },
  {
    key: 'setam',
    label: 'Šetam',
    icon: Footprints,
    texture: require('@assets/tools/setam.jpg'),
  },
  {
    key: 'odlazem',
    label: 'Odlažem',
    icon: Hourglass,
    texture: require('@assets/tools/odlazem.jpg'),
  },
  {
    key: 'belezim',
    label: 'Beležim',
    icon: SquarePen,
    texture: require('@assets/tools/belezim.jpg'),
  },
];
