import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttrDice, DieColor } from '@/types/character';
import { RPG } from '@/constants/theme';
import DieBubble from './DieBubble';

interface Props {
  label: string;
  dice: AttrDice;
  onChange: (dice: AttrDice) => void;
}

export default function DiceTrack({ label, dice, onChange }: Props) {
  const handleChange = (i: number, color: DieColor) => {
    const next = [...dice] as AttrDice;
    next[i] = color;
    onChange(next);
  };

  const count = dice.filter(Boolean).length;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        {dice.map((d, i) => (
          <DieBubble key={i} color={d} onChange={c => handleChange(i, c)} />
        ))}
      </View>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  label: {
    color: RPG.text,
    fontSize: 13,
    fontFamily: 'serif',
    width: 104,
    fontWeight: '600',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    color: RPG.goldLight,
    fontSize: 14,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
    marginLeft: 2,
  },
});
