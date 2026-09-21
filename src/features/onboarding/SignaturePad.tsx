import { X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Icon, Pressable, Text } from '@/components/primitives';
import { color, radius, space } from '@/theme';

import { copy } from './copy';

/**
 * The commitment signature. A finger path, captured as SVG so it survives as text in
 * `profiles.signature_data`.
 *
 * It is not a legal signature and is never shown to anyone else (PRODUCT.md). It starts empty:
 * the export pre-draws a sample, which is a prototype convenience, and here the first thing a
 * person sees is the invitation to sign.
 */

type Point = { x: number; y: number };

function toPath(stroke: readonly Point[]): string {
  if (stroke.length === 0) return '';
  const [first, ...rest] = stroke as [Point, ...Point[]];
  return `M${first.x.toFixed(1)},${first.y.toFixed(1)}${rest
    .map((point) => `L${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join('')}`;
}

export function SignaturePad({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (path: string | null) => void;
}) {
  // One piece of state: the finished strokes and the one being drawn. Keeping them together
  // means the gesture handlers only ever need a functional update, never a ref read.
  const [pad, setPad] = useState<{ strokes: Point[][]; current: Point[] }>({
    strokes: [],
    current: [],
  });
  const [size, setSize] = useState({ width: 0, height: 180 });

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          setPad((previous) => ({ ...previous, current: [{ x: locationX, y: locationY }] }));
        },
        onPanResponderMove: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          setPad((previous) => ({
            ...previous,
            current: [...previous.current, { x: locationX, y: locationY }],
          }));
        },
        onPanResponderRelease: () => {
          setPad((previous) =>
            previous.current.length >= 2
              ? { strokes: [...previous.strokes, previous.current], current: [] }
              : { ...previous, current: [] },
          );
        },
      }),
    [],
  );

  // Publishing the path is a side effect of the strokes changing, and of nothing else. The
  // callback is held in a ref so that a parent re-render cannot re-fire this effect: with
  // `onChange` in the dependency list, an inline arrow from the caller would loop forever.
  const publish = useRef(onChange);
  useEffect(() => {
    publish.current = onChange;
  }, [onChange]);

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      // Nothing to publish on mount; a saved signature is already in the draft.
      if (pad.strokes.length === 0) return;
    }
    publish.current(pad.strokes.length > 0 ? pad.strokes.map(toPath).join(' ') : null);
  }, [pad.strokes]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  const clear = () => setPad({ strokes: [], current: [] });

  const paths = [...pad.strokes.map(toPath), toPath(pad.current)].filter(Boolean);
  const signed = !!value && pad.strokes.length > 0;

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.pad}
        onLayout={onLayout}
        accessibilityLabel={copy.commitment.signatureHint}
        accessibilityRole="none"
        {...responder.panHandlers}
      >
        <Svg width={size.width} height={size.height}>
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              stroke={color.onField}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </Svg>
        {paths.length === 0 ? (
          <View pointerEvents="none" style={styles.hint}>
            <Text variant="body" style={styles.hintText}>
              {copy.commitment.signatureHint}
            </Text>
          </View>
        ) : null}
      </View>

      {signed ? (
        <Pressable onPress={clear} accessibilityLabel={copy.commitment.clear} style={styles.clear}>
          <Icon as={X} size={18} color={color.onField} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  pad: {
    height: 180,
    borderRadius: radius.card,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    overflow: 'hidden',
  },
  hint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: { color: color.onField, opacity: 0.7, fontStyle: 'italic' },
  clear: {
    position: 'absolute',
    top: space.xs,
    right: space.xs,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
