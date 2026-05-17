import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';
import { IQuickNote, InventoryItem } from '@/types/inventory';
import NumericStepper from '@/components/rpg/NumericStepper';

interface NoteCardProps {
  item: IQuickNote;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<InventoryItem>) => void;
}

function NoteCard({ item, onRemove, onUpdate }: NoteCardProps) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.text}
        value={item.text}
        onChangeText={v => onUpdate(item.id, { text: v })}
        placeholder="Item..."
        placeholderTextColor={RPG.textDark}
      />
      <NumericStepper
        value={item.qty}
        onChange={v => onUpdate(item.id, { qty: v })}
        min={1}
        compact
      />
      <TouchableOpacity onPress={() => onRemove(item.id)} activeOpacity={0.7} style={styles.remove}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RPG.border,
  },
  text: { flex: 1, color: RPG.text, fontSize: 13 },
  remove: { paddingHorizontal: 6, paddingVertical: 4 },
  removeText: { color: RPG.textDark, fontSize: 14 },
});

export default React.memo(NoteCard);
