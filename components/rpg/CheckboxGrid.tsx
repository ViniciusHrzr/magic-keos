import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  boxes: boolean[];
  onChange: (boxes: boolean[]) => void;
  cols?: number;
}

export default function CheckboxGrid({ boxes, onChange, cols = 5 }: Props) {
  const toggle = (i: number) => {
    const next = [...boxes];
    next[i] = !next[i];
    onChange(next);
  };

  return (
    <View style={styles.grid}>
      {boxes.map((checked, i) => (
        <TouchableOpacity key={i} onPress={() => toggle(i)} activeOpacity={0.7} style={styles.cell}>
          <View style={[styles.box, checked && styles.checked]} />
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
  box: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: RPG.borderLight,
    backgroundColor: RPG.surface,
  },
  checked: {
    backgroundColor: RPG.gold,
    borderColor: RPG.goldLight,
  },
});
