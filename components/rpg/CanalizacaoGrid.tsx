import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { RPG } from '@/constants/theme';

const CHECKBOX_SIZE = 22;
const CHAMFER = 5;
const STROKE_WIDTH = 1.5;

const skiaAvailable = Skia != null && typeof (Skia as any).Path?.Make === 'function';

function makeChamferPath(w: number, h: number, c: number) {
  const path = Skia.Path.Make();
  path.moveTo(c, 0);
  path.lineTo(w - c, 0);
  path.lineTo(w, c);
  path.lineTo(w, h - c);
  path.lineTo(w - c, h);
  path.lineTo(c, h);
  path.lineTo(0, h - c);
  path.lineTo(0, c);
  path.close();
  return path;
}

interface Props {
  boxes: boolean[];
  onChange: (boxes: boolean[]) => void;
  cols?: number;
}

export default function CanalizacaoGrid({ boxes, onChange }: Props) {
  const chamferPath = useMemo(() => {
    if (!skiaAvailable) return null;
    try {
      return makeChamferPath(CHECKBOX_SIZE, CHECKBOX_SIZE, CHAMFER);
    } catch {
      return null;
    }
  }, []);

  const toggle = (i: number) => {
    const next = [...boxes];
    next[i] = !next[i];
    onChange(next);
  };

  return (
    <View style={styles.grid}>
      {boxes.map((checked, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => toggle(i)}
          activeOpacity={0.7}
          style={styles.cell}
        >
          {skiaAvailable && chamferPath ? (
            <Canvas style={styles.canvas}>
              <Path
                path={chamferPath}
                color={checked ? RPG.gold : RPG.surface}
                style="fill"
              />
              <Path
                path={chamferPath}
                color={checked ? RPG.goldLight : RPG.goldDim}
                style="stroke"
                strokeWidth={STROKE_WIDTH}
              />
            </Canvas>
          ) : (
            <View
              style={[
                styles.fallbackBox,
                checked && styles.fallbackBoxChecked,
              ]}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cell: {
    padding: 2,
  },
  canvas: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
  },
  fallbackBox: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderWidth: 1.5,
    borderColor: RPG.goldDim,
    backgroundColor: RPG.surface,
  },
  fallbackBoxChecked: {
    backgroundColor: RPG.gold,
    borderColor: RPG.goldLight,
  },
});
