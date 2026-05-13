import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const EFFECTS = [
  { threshold: 2,  text: 'Curas recuperam metade do valor' },
  { threshold: 4,  text: 'Em descansos, 1 ação a menos' },
  { threshold: 6,  text: 'Desvantagem (−1d20) em todos os testes' },
  { threshold: 8,  text: 'Em combate, 1 ação a menos por turno' },
  { threshold: 10, text: 'Cai com zero de vida — Morrendo' },
];

export default function VenenoTracker({ value, onChange }: Props) {
  const active = EFFECTS.filter(e => value >= e.threshold);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {Array.from({ length: 10 }, (_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onChange(i < value ? i : i + 1)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.bubble,
              i < value && styles.filled,
              i < value && i >= 7 && styles.filledCritical,
            ]} />
          </TouchableOpacity>
        ))}
      </View>
      {active.length > 0 && (
        <View style={styles.effects}>
          {active.map(e => (
            <Text
              key={e.threshold}
              style={[styles.effectText, e.threshold === 10 && styles.effectDead]}
            >
              {'• '}{e.text}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    gap: 8,
  },
  track: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  bubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: RPG.textDark,
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: '#4a1a1a',
    borderColor: RPG.red,
  },
  filledCritical: {
    backgroundColor: '#6b1010',
    borderColor: '#ff4444',
  },
  effects: {
    gap: 3,
    paddingLeft: 2,
  },
  effectText: {
    color: '#c87070',
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  effectDead: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
});
