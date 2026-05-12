import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function VenenoTracker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {Array.from({ length: 8 }, (_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onChange(i < value ? i : i + 1)}
            activeOpacity={0.7}
          >
            <View style={[styles.bubble, i < value && styles.filled]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  label: {
    color: RPG.textMuted,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  track: {
    flexDirection: 'row',
    gap: 4,
  },
  bubble: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: RPG.textDark,
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: '#4a1a1a',
    borderColor: RPG.red,
  },
});
