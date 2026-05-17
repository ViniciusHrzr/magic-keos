import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { RPG } from '@/constants/theme';
import { IStructuredGear, InventoryItem } from '@/types/inventory';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TypeEquip = IStructuredGear['type_equip'];

const TYPE_CHIPS: { value: TypeEquip; label: string }[] = [
  { value: 'arma',       label: 'Arma'    },
  { value: 'escudo',     label: 'Escudo'  },
  { value: 'vestimenta', label: 'Vest.'   },
  { value: 'acessorio',  label: 'Acess.'  },
  { value: 'outro',      label: 'Outro'   },
];

interface GearCardProps {
  item: IStructuredGear;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<InventoryItem>) => void;
}

function GearCard({ item, onRemove, onUpdate }: GearCardProps) {
  const [loreOpen, setLoreOpen] = useState(false);
  const affinityColor = item.affinity ? (RPG as any)[item.affinity] ?? RPG.textMuted : RPG.textMuted;

  function toggleLore() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLoreOpen(v => !v);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.affinityDot, { backgroundColor: affinityColor }]} />
        <TextInput
          style={styles.name}
          value={item.name}
          onChangeText={v => onUpdate(item.id, { name: v } as Partial<InventoryItem>)}
          placeholder="Nome do item..."
          placeholderTextColor={RPG.textDark}
        />
        {item.damage ? <Text style={styles.stat}>{item.damage}</Text> : null}
        {item.defense ? <Text style={styles.stat}>{item.defense}</Text> : null}
        <TouchableOpacity onPress={toggleLore} style={styles.chevronBtn} activeOpacity={0.7}>
          <Text style={styles.chevron}>{loreOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.remove}>
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.typeRow}>
        {TYPE_CHIPS.map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            onPress={() => onUpdate(item.id, { type_equip: value } as Partial<InventoryItem>)}
            style={[styles.typeChip, item.type_equip === value && styles.typeChipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeChipText, item.type_equip === value && styles.typeChipTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
    paddingTop: 8,
    paddingBottom: 4,
  },
  affinityDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  name: { flex: 1, color: RPG.gold, fontSize: 13, fontWeight: '600', padding: 0 },
  stat: { color: RPG.text, fontSize: 12, flexShrink: 0 },
  chevronBtn: { paddingHorizontal: 4 },
  chevron: { color: RPG.textMuted, fontSize: 12 },
  remove: { paddingHorizontal: 6 },
  removeText: { color: RPG.textDark, fontSize: 14 },
  typeRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexWrap: 'wrap',
  },
  typeChip: {
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  typeChipActive: {
    borderColor: RPG.gold,
    backgroundColor: RPG.surfaceAlt,
  },
  typeChipText: { color: RPG.textMuted, fontSize: 11 },
  typeChipTextActive: { color: RPG.gold, fontWeight: '600' },
  lore: { color: RPG.textMuted, fontSize: 12, fontStyle: 'italic', padding: 8 },
});

export default React.memo(GearCard);
