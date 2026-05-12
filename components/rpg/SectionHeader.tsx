import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  title: string;
  rightContent?: React.ReactNode;
}

export default function SectionHeader({ title, rightContent }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rightContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: RPG.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: RPG.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: RPG.gold,
    fontSize: 14,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
