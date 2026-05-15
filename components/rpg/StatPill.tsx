import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  label: string;
  value: string;
  isSymbol?: boolean;
}

export default function StatPill({ label, value, isSymbol }: Props) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={[styles.pillValue, isSymbol && { fontFamily: 'PlanewalkerDings', fontStyle: 'normal', fontSize: 16 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: RPG.border,
    backgroundColor: RPG.surfaceAlt,
    borderRadius: 4,
  },
  pillLabel: {
    color: RPG.textMuted,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillValue: { color: RPG.text, fontSize: 13, fontWeight: '600' },
});
