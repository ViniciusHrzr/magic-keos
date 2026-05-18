import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Canvas, Fill, Shader, Group, RadialGradient, Circle, vec, BlurMask, useClock,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import NumericStepper from '@/components/rpg/NumericStepper';
import { RPG } from '@/constants/theme';
import {
  fireEffect,
  wavesEffect,
  particlesEffect,
  neutralDistortionEffect,
  MANA_VISUAL_STRATEGY,
  skiaAvailable,
} from '@/components/rpg/shaders/ManaShadersLib';
import type { ManaKey } from '@/components/rpg/shaders/ManaShadersLib';

export interface ManaRowProps {
  manaKey: ManaKey;
  label: string;
  color: string;
  diamondColor: string;
  base: number;
  total: number;
  onBaseChange: (v: number) => void;
  onTotalChange: (v: number) => void;
}

const CANVAS_SIZE = 44;

function ManaRow({ manaKey, label, color, diamondColor, base, total, onBaseChange, onTotalChange }: ManaRowProps) {
  const active = total > 0;
  const strategy = MANA_VISUAL_STRATEGY[manaKey];

  const clock = useClock();
  const uniforms = useDerivedValue(() => ({
    iResolution: [CANVAS_SIZE, CANVAS_SIZE],
    iTime: clock.value / 1000,
  }));

  const effect = useMemo(() => {
    switch (manaKey) {
      case 'vermelho': return fireEffect;
      case 'azul':     return wavesEffect;
      case 'verde':    return particlesEffect;
      case 'incolor':  return neutralDistortionEffect;
      default:         return null;
    }
  }, [manaKey]);

  const renderCanvas = () => {
    if (!skiaAvailable || !active) {
      return <View style={[styles.canvasFallback, !active && styles.canvasInactive]} />;
    }

    if (strategy.kind === 'radial-glow') {
      return (
        <Canvas style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
          <Fill color={RPG.surface} />
          <Group>
            <Circle cx={CANVAS_SIZE / 2} cy={CANVAS_SIZE / 2} r={CANVAS_SIZE / 2}>
              <RadialGradient
                c={vec(CANVAS_SIZE / 2, CANVAS_SIZE / 2)}
                r={CANVAS_SIZE / 2}
                colors={[strategy.glowColor!, 'transparent']}
              />
              <BlurMask blur={8} style="solid" />
            </Circle>
          </Group>
        </Canvas>
      );
    }

    return (
      <Canvas style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
        <Fill color={RPG.surface} />
        {effect && (
          <Fill>
            <Shader source={effect} uniforms={uniforms} />
          </Fill>
        )}
      </Canvas>
    );
  };

  return (
    <View style={styles.row}>
      <View style={styles.canvasWrap}>{renderCanvas()}</View>
      <View style={styles.colorCol}>
        <View style={[styles.diamond, { backgroundColor: diamondColor, borderColor: color }]} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      <View style={styles.stepperCell}>
        <NumericStepper compact value={base} onChange={onBaseChange} color={color} />
      </View>
      <View style={styles.stepperCell}>
        <NumericStepper compact value={total} onChange={onTotalChange} color={color} />
      </View>
    </View>
  );
}

export default React.memo(ManaRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    gap: 6,
  },
  canvasWrap: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: RPG.goldDim,
    overflow: 'hidden',
  },
  canvasFallback: {
    flex: 1,
    backgroundColor: RPG.surface,
  },
  canvasInactive: {
    opacity: 0.4,
  },
  colorCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 60,
  },
  diamond: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepperCell: {
    flex: 1,
    alignItems: 'center',
  },
});
