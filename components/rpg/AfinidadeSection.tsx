import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { RPG } from '@/constants/theme';

const COLORS = [
  { key: 'branco' as const, label: 'B', bg: RPG.branco, text: '#111' },
  { key: 'verde' as const, label: 'V', bg: RPG.verde, text: '#fff' },
  { key: 'vermelho' as const, label: 'R', bg: RPG.vermelho, text: '#fff' },
  { key: 'preto' as const, label: 'P', bg: RPG.preto, text: '#aaa' },
  { key: 'azul' as const, label: 'A', bg: RPG.azul, text: '#fff' },
];

interface Afinidade {
  branco: number;
  verde: number;
  vermelho: number;
  preto: number;
  azul: number;
}

interface Props {
  value: Afinidade;
  onChange: (k: keyof Afinidade, v: number) => void;
}

export default function AfinidadeSection({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Afinidade</Text>
      {COLORS.map(({ key, label, bg, text }) => (
        <View key={key} style={styles.row}>
          <View style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${value[key]}%`, backgroundColor: bg }]} />
          </View>
          <TextInput
            style={styles.pct}
            value={value[key] === 0 ? '' : String(value[key])}
            onChangeText={t => onChange(key, Math.min(100, parseInt(t) || 0))}
            keyboardType="numeric"
            maxLength={3}
            selectTextOnFocus
            placeholder="0"
            placeholderTextColor={RPG.textDark}
          />
          <Text style={styles.pctSign}>%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: RPG.surface,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    gap: 6,
  },
  title: {
    color: RPG.gold,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: RPG.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    opacity: 0.8,
  },
  pct: {
    color: RPG.text,
    fontSize: 12,
    width: 30,
    textAlign: 'right',
  },
  pctSign: {
    color: RPG.textMuted,
    fontSize: 11,
  },
});
