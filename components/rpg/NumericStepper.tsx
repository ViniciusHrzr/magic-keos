import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
  compact?: boolean;
}

export default function NumericStepper({ value, onChange, min = 0, max = 999, label, color, compact }: Props) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  return (
    <View style={[styles.container, compact && styles.compact]}>
      {label && <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>}
      <View style={[styles.controls, compact && styles.controlsCompact]}>
        <TouchableOpacity
          style={[styles.btn, compact && styles.btnCompact]}
          onPress={() => onChange(clamp(value - 1))}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnText, compact && styles.btnTextCompact]}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.value, compact && styles.valueCompact, color ? { color } : null]}
          value={String(value)}
          onChangeText={t => onChange(clamp(parseInt(t) || 0))}
          keyboardType="numeric"
          maxLength={4}
          selectTextOnFocus
        />
        <TouchableOpacity
          style={[styles.btn, compact && styles.btnCompact]}
          onPress={() => onChange(clamp(value + 1))}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnText, compact && styles.btnTextCompact]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    color: RPG.textMuted,
    fontSize: 10,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelCompact: {
    marginBottom: 0,
    fontSize: 9,
    letterSpacing: 0,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RPG.border,
    backgroundColor: RPG.surface,
    overflow: 'hidden',
  },
  controlsCompact: {
    height: 28,
  },
  btn: {
    width: 26,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RPG.surfaceAlt,
  },
  btnCompact: {
    width: 20,
    height: 28,
  },
  btnText: {
    color: RPG.gold,
    fontSize: 18,
    lineHeight: 20,
  },
  btnTextCompact: {
    fontSize: 14,
    lineHeight: 16,
  },
  value: {
    color: RPG.goldLight,
    fontSize: 15,
    fontWeight: 'bold',
    width: 44,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 0,
  },
  valueCompact: {
    fontSize: 13,
    width: 32,
    height: 28,
  },
});
