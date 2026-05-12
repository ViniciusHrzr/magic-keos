import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { DieColor } from '@/types/character';
import { RPG } from '@/constants/theme';

const DIE_COLORS: Record<NonNullable<DieColor>, string> = {
  branco: RPG.branco,
  verde: RPG.verde,
  vermelho: RPG.vermelho,
  preto: RPG.preto,
  azul: RPG.azul,
};

const COLOR_CYCLE: DieColor[] = [null, 'branco', 'verde', 'vermelho', 'preto', 'azul'];

interface Props {
  color: DieColor;
  onChange: (next: DieColor) => void;
  size?: number;
}

export default function DieBubble({ color, onChange, size = 22 }: Props) {
  const handlePress = () => {
    const idx = COLOR_CYCLE.indexOf(color);
    onChange(COLOR_CYCLE[(idx + 1) % COLOR_CYCLE.length]);
  };

  const filled = color !== null;
  const fillColor = filled ? DIE_COLORS[color!] : 'transparent';
  const borderColor = filled ? DIE_COLORS[color!] : RPG.goldDim;
  const outer = size + 8;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ width: outer, height: outer, alignItems: 'center', justifyContent: 'center' }}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: size,
          height: size,
          transform: [{ rotate: '45deg' }],
          backgroundColor: fillColor,
          borderWidth: 1.5,
          borderColor,
        }}
      />
    </TouchableOpacity>
  );
}
