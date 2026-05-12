import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SkillValue } from '@/types/character';
import { RPG } from '@/constants/theme';

interface Props {
  label: string;
  value: SkillValue;
  onChange: (v: SkillValue) => void;
}

export default function SkillRow({ label, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputGroup}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={value.base === 0 ? '' : String(value.base)}
            onChangeText={t => onChange({ ...value, base: parseInt(t) || 0 })}
            keyboardType="numeric"
            maxLength={3}
            placeholder="0"
            placeholderTextColor={RPG.textDark}
            selectTextOnFocus
          />
        </View>
        <View style={[styles.inputWrap, styles.tempWrap]}>
          <TextInput
            style={[styles.input, styles.tempInput]}
            value={value.temp === 0 ? '' : String(value.temp)}
            onChangeText={t => onChange({ ...value, temp: parseInt(t) || 0 })}
            keyboardType="numeric"
            maxLength={3}
            placeholder="0"
            placeholderTextColor={RPG.textDark}
            selectTextOnFocus
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  label: {
    color: RPG.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  inputWrap: {
    width: 44,
    height: 34,
    backgroundColor: RPG.surface,
    borderWidth: 1,
    borderColor: RPG.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tempWrap: {
    borderStyle: 'dashed',
    borderColor: RPG.goldDim,
  },
  input: {
    color: RPG.goldLight,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 42,
    height: 34,
    padding: 0,
  },
  tempInput: {
    color: RPG.textMuted,
  },
});
