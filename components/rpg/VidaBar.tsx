import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';
import NumericStepper from '@/components/rpg/NumericStepper';
import type { Character } from '@/types/character';

interface Props {
  vida: Character['vida'];
  onVidaChange: (k: keyof Character['vida'], v: number) => void;
}

export default function VidaBar({ vida, onVidaChange }: Props) {
  const ratio = vida.total > 0 ? vida.atual / vida.total : 0;
  const actualColor = ratio >= 0.6 ? '#2d7a2d' : ratio >= 0.3 ? '#a05020' : RPG.red;
  const necroWidth = vida.total > 0 ? Math.min(100, (vida.necro / vida.total) * 100) : 0;

  const bar = (
    <View>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.fill,
            {
              width: (Math.min(100, ratio * 100) + '%') as any,
              backgroundColor: actualColor,
            },
          ]}
        />
        {vida.necro > 0 && (
          <View
            style={[
              styles.fill,
              styles.necroOverlay,
              { width: (necroWidth + '%') as any },
            ]}
          />
        )}
      </View>
      {vida.armadura > 0 && (
        <View style={styles.armaduraBadge}>
          <Text style={styles.armaduraBadgeText}>🛡 {vida.armadura}</Text>
        </View>
      )}
      <View style={styles.stepperRow}>
        {([
          { key: 'total', label: 'Total', color: RPG.textMuted },
          { key: 'atual', label: 'Atual', color: '#e74c3c' },
          { key: 'necro', label: 'Necro', color: '#a060d0' },
          { key: 'armadura', label: 'Armadura', color: RPG.textMuted },
          { key: 'manto', label: 'Manto', color: '#00d4ff' },
        ] as const).map(({ key, label, color }) => (
          <View key={key} style={styles.stepperItem}>
            <Text style={styles.stepperLabel}>{label}</Text>
            <NumericStepper
              compact
              value={vida[key]}
              onChange={v => onVidaChange(key, v)}
              color={color}
            />
          </View>
        ))}
      </View>
    </View>
  );

  if (vida.manto > 0) {
    return <View style={styles.mantoAura}>{bar}</View>;
  }
  return bar;
}

const styles = StyleSheet.create({
  mantoAura: {
    borderWidth: 2,
    borderColor: '#00d4ff',
    borderRadius: 6,
    padding: 2,
  },
  barContainer: {
    height: 22,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: RPG.textDark,
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '0%',
  },
  necroOverlay: {
    backgroundColor: 'rgba(100,0,160,0.5)',
  },
  armaduraBadge: {
    alignSelf: 'flex-start',
    marginTop: 2,
    backgroundColor: RPG.surface,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  armaduraBadgeText: {
    color: RPG.textMuted,
    fontSize: 11,
  },
  stepperRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  stepperItem: {
    alignItems: 'center',
    gap: 2,
  },
  stepperLabel: {
    color: RPG.textMuted,
    fontSize: 9,
    textTransform: 'uppercase',
  },
});
