import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  entries: string[];
  onChange: (entries: string[]) => void;
  cols?: number;
  placeholder?: string;
}

export default function MemoGrid({ entries, onChange, cols = 5, placeholder = '' }: Props) {
  const update = (i: number, v: string) => {
    const next = [...entries];
    next[i] = v;
    onChange(next);
  };

  return (
    <View style={styles.grid}>
      {entries.map((val, i) => (
        <TextInput
          key={i}
          style={styles.cell}
          value={val}
          onChangeText={v => update(i, v)}
          placeholder={placeholder}
          placeholderTextColor={RPG.textDark}
          maxLength={40}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  cell: {
    width: '100%',
    height: 34,
    borderWidth: 1,
    borderColor: RPG.border,
    backgroundColor: RPG.surface,
    color: RPG.text,
    fontSize: 11,
    paddingHorizontal: 4,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
});
