import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { RPG } from '@/constants/theme';
import { IStructuredGear, InventoryItem } from '@/types/inventory';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface GearCardProps {
  item: IStructuredGear;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<InventoryItem>) => void;
}

function GearCard({ item, onRemove }: GearCardProps) {
  const [loreOpen, setLoreOpen] = useState(false);
  const affinityColor = item.affinity ? (RPG as any)[item.affinity] ?? RPG.textMuted : RPG.textMuted;

  function toggleLore() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLoreOpen(v => !v);
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={toggleLore} activeOpacity={0.8}>
        <View style={[styles.affinityDot, { backgroundColor: affinityColor }]} />
        <Text style={styles.name} numberOfLines={1}>{item.name || 'Equipamento'}</Text>
        {item.damage ? <Text style={styles.stat}>{item.damage}</Text> : null}
        {item.defense ? <Text style={styles.stat}>{item.defense}</Text> : null}
        <Text style={styles.chevron}>{loreOpen ? '▲' : '▼'}</Text>
        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.remove}>
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      {loreOpen && item.lore ? (
        <Text style={styles.lore}>{item.lore}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RPG.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  affinityDot: { width: 10, height: 10, borderRadius: 5 },
  name: { flex: 1, color: RPG.gold, fontSize: 13, fontWeight: '600' },
  stat: { color: RPG.text, fontSize: 12 },
  chevron: { color: RPG.textMuted, fontSize: 12 },
  remove: { paddingHorizontal: 6 },
  removeText: { color: RPG.textDark, fontSize: 14 },
  lore: { color: RPG.textMuted, fontSize: 12, fontStyle: 'italic', padding: 8 },
});

export default React.memo(GearCard);
