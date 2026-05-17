import React, { useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  ActivityIndicator,
  UIManager,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import NumericStepper from '@/components/rpg/NumericStepper';
import { EquipItem } from '@/types/character';
import { armas, escudos, vestimentas, acessorios, MELHORIAS_POR_SLOT, MelhoriaItem } from '@/data/regras/equipamentos';
import { InventoryItem, IStructuredGear, isQuickNote } from '@/types/inventory';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DroppableHexSlot, { DroppableHexSlotHandle } from '@/components/rpg/DroppableHexSlot';
import DraggableNoteCard from '@/components/rpg/DraggableNoteCard';
import DraggableGearCard from '@/components/rpg/DraggableGearCard';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SLOT_KEYS = ['arma', 'escudo', 'vestimenta', 'acessorio1', 'acessorio2'] as const;
type SlotKey = typeof SLOT_KEYS[number];

const SLOT_ACCEPTS: Record<SlotKey, IStructuredGear['type_equip'][]> = {
  arma: ['arma'],
  escudo: ['escudo'],
  vestimenta: ['vestimenta'],
  acessorio1: ['acessorio'],
  acessorio2: ['acessorio'],
};

const SLOT_LABELS: Record<SlotKey, string> = {
  arma: 'Arma',
  escudo: 'Escudo',
  vestimenta: 'Vestimenta',
  acessorio1: 'Acessório 1',
  acessorio2: 'Acessório 2',
};

const SLOT_META: Record<SlotKey, string[]> = {
  arma:       armas.map(r => `${r.dano} · ${r.especial}`),
  escudo:     escudos.map(r => `IP Corp ${r.ipCorp} · ${r.especial}`),
  vestimenta: vestimentas.map(r => `IP Corp ${r.ipCorp} · Ment ${r.ipMent} · Esp ${r.ipEsp}`),
  acessorio1: acessorios.map(r => r.bonus),
  acessorio2: acessorios.map(r => r.bonus),
};

const SLOT_ITEMS: Record<SlotKey, string[]> = {
  arma:       armas.map(r => r.arma),
  escudo:     escudos.map(r => r.escudo),
  vestimenta: vestimentas.map(r => r.vestimenta),
  acessorio1: acessorios.map(r => r.acessorio),
  acessorio2: acessorios.map(r => r.acessorio),
};

const SLOT_AFFINITY: Record<typeof SLOT_KEYS[number], string> = {
  arma: RPG.vermelho,
  escudo: RPG.azul,
  vestimenta: RPG.verde,
  acessorio1: RPG.branco,
  acessorio2: RPG.branco,
};

const COR_TOKEN: Record<MelhoriaItem['cor'], string> = {
  branco:   RPG.branco,
  verde:    RPG.verde,
  vermelho: RPG.vermelho,
  preto:    RPG.pretoLight,
  azul:     RPG.azul,
};

export default function MochilaScreen() {
  const { character: c, setEquipamentoItem, setInventarioSlot, addInventarioItem, removeInventarioItem, updateInventarioItem, isLoaded } = useCharacter();
  const [pickerSlot, setPickerSlot] = useState<SlotKey | null>(null);
  const [expandedSlot, setExpandedSlot] = useState<SlotKey | null>(null);
  const [crafterSlot, setCrafterSlot] = useState<SlotKey | null>(null);
  const hexRefs = useRef<Record<SlotKey, DroppableHexSlotHandle | null>>({
    arma: null, escudo: null, vestimenta: null, acessorio1: null, acessorio2: null,
  });

  function pickItem(slot: SlotKey, nome: string) {
    const prev = c.equipamentos[slot];
    setEquipamentoItem(slot, {
      nome,
      tipo: prev?.tipo ?? 'basico',
      melhorias: prev?.melhorias ?? [],
    });
    setPickerSlot(null);
  }

  function clearSlot(slot: SlotKey) {
    setEquipamentoItem(slot, null);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSlot(null);
  }

  function editNome(slot: SlotKey, nome: string) {
    const prev = c.equipamentos[slot];
    if (prev) {
      setEquipamentoItem(slot, { ...prev, nome });
    } else if (nome.trim()) {
      setEquipamentoItem(slot, { nome, tipo: 'basico', melhorias: [] });
    }
  }

  function toggleExpanded(slot: SlotKey) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSlot(prev => (prev === slot ? null : slot));
  }

  function addMelhoria(slot: SlotKey, label: string) {
    const item = c.equipamentos[slot];
    if (!item || item.melhorias.length >= 3) return;
    setEquipamentoItem(slot, { ...item, melhorias: [...item.melhorias, label] });
    setCrafterSlot(null);
  }

  function removeMelhoria(slot: SlotKey, idx: number) {
    const item = c.equipamentos[slot];
    if (!item) return;
    setEquipamentoItem(slot, { ...item, melhorias: item.melhorias.filter((_, i) => i !== idx) });
  }

  function handleDropAttempt(payload: { item: IStructuredGear; absoluteX: number; absoluteY: number }) {
    const { item, absoluteX, absoluteY } = payload;
    (Object.keys(hexRefs.current) as SlotKey[]).forEach(slot => {
      const ref = hexRefs.current[slot];
      if (!ref) return;
      ref.measureInWindow((x, y, w, h) => {
        const hitX = absoluteX >= x && absoluteX <= x + w;
        const hitY = absoluteY >= y && absoluteY <= y + h;
        if (hitX && hitY) {
          if (!SLOT_ACCEPTS[slot].includes(item.type_equip)) return;
          setEquipamentoItem(slot, {
            nome: item.name,
            tipo: 'basico',
            melhorias: item.melhorias,
          });
          removeInventarioItem(item.id);
        }
      });
    });
  }

  function newNoteId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  function handleAddNote() { addInventarioItem({ id: newNoteId(), type: 'note', text: '', qty: 1 }); }
  function handleAddGear() { addInventarioItem({ id: newNoteId(), type: 'gear', name: '', type_equip: 'outro', melhorias: [] }); }

  function toggleTipo(slot: SlotKey) {
    const item = c.equipamentos[slot];
    if (!item) return;
    const novoTipo = item.tipo === 'basico' ? 'artefato' : 'basico';
    setEquipamentoItem(slot, {
      ...item,
      tipo: novoTipo,
      efeito: novoTipo === 'basico' ? undefined : item.efeito,
      durabilidade: novoTipo === 'basico' ? undefined : item.durabilidade,
    });
  }

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={RPG.gold} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  const activePickerSlot = pickerSlot ?? 'arma';
  const activeCrafterSlot = crafterSlot ?? 'arma';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleBar}>
            <Text style={styles.title}>Mochila</Text>
          </View>
          <SectionHeader title="Equipamentos" />
          <View style={styles.hexContainer}>
            {SLOT_KEYS.map(slot => {
              const item = c.equipamentos[slot];
              return (
                <DroppableHexSlot
                  ref={r => { hexRefs.current[slot] = r; }}
                  key={slot}
                  slotKey={slot}
                  label={SLOT_LABELS[slot]}
                  affinityColor={SLOT_AFFINITY[slot]}
                  item={item}
                  melhoriaColors={COR_TOKEN}
                  onPress={() => toggleExpanded(slot)}
                  isExpanded={expandedSlot === slot}
                  onPickerOpen={() => setPickerSlot(slot)}
                  onCrafterOpen={() => setCrafterSlot(slot)}
                  onClearSlot={() => clearSlot(slot)}
                  onEditNome={v => editNome(slot, v)}
                  onRemoveMelhoria={idx => removeMelhoria(slot, idx)}
                  onToggleTipo={() => toggleTipo(slot)}
                  onEditEfeito={v => { if (item) setEquipamentoItem(slot, { ...item, efeito: v }); }}
                  onEditDurabilidade={v => { if (item) setEquipamentoItem(slot, { ...item, durabilidade: v }); }}
                  availableMelhorias={MELHORIAS_POR_SLOT[slot].map(m => ({ label: m.label, cor: COR_TOKEN[m.cor] }))}
                  isDropTarget={false}
                />
              );
            })}
          </View>
          <SectionHeader title="Inventário" />
          <FlatList
            data={c.inventarioItems ?? []}
            keyExtractor={(item: InventoryItem) => item.id}
            scrollEnabled={false}
            renderItem={({ item }: { item: InventoryItem }) =>
              isQuickNote(item)
                ? <DraggableNoteCard item={item} onRemove={removeInventarioItem} onUpdate={updateInventarioItem} />
                : <DraggableGearCard item={item} onRemove={removeInventarioItem} onUpdate={updateInventarioItem} onDropAttempt={handleDropAttempt} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyInventory}>Inventário vazio — adicione itens abaixo</Text>
            }
            ListFooterComponent={
              <View style={styles.addItemRow}>
                <TouchableOpacity style={styles.addItemBtn} onPress={handleAddNote} activeOpacity={0.8}>
                  <Text style={styles.addItemBtnText}>+ Nota Rápida</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addItemBtn} onPress={handleAddGear} activeOpacity={0.8}>
                  <Text style={styles.addItemBtnText}>+ Equipamento</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </ScrollView>

        <Modal
          visible={pickerSlot !== null}
          animationType="slide"
          onRequestClose={() => setPickerSlot(null)}
        >
          <SafeAreaView style={styles.modal} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Escolher {SLOT_LABELS[activePickerSlot]}
              </Text>
              <TouchableOpacity onPress={() => setPickerSlot(null)} activeOpacity={0.7}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList} keyboardShouldPersistTaps="handled">
              {SLOT_ITEMS[activePickerSlot].map((nome, i) => {
                const isSelected = c.equipamentos[activePickerSlot]?.nome === nome;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                    onPress={() => pickItem(activePickerSlot, nome)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.modalItemName}>{nome}</Text>
                    <Text style={styles.modalItemMeta}>{SLOT_META[activePickerSlot][i]}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        <Modal
          visible={crafterSlot !== null}
          animationType="slide"
          onRequestClose={() => setCrafterSlot(null)}
        >
          <SafeAreaView style={styles.modal} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Melhoria — {SLOT_LABELS[activeCrafterSlot]}
              </Text>
              <TouchableOpacity onPress={() => setCrafterSlot(null)} activeOpacity={0.7}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList} keyboardShouldPersistTaps="handled">
              {MELHORIAS_POR_SLOT[activeCrafterSlot].map((m, i) => {
                const cor = COR_TOKEN[m.cor];
                const jaAplicada = (c.equipamentos[activeCrafterSlot]?.melhorias ?? []).includes(m.label);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.craftItem, jaAplicada && styles.craftItemApplied]}
                    onPress={() => { if (!jaAplicada) addMelhoria(activeCrafterSlot, m.label); }}
                    activeOpacity={jaAplicada ? 1 : 0.75}
                  >
                    <View style={[styles.craftCorDot, { backgroundColor: cor }]} />
                    <Text style={[styles.craftItemLabel, { color: jaAplicada ? RPG.textDark : RPG.text }]}>
                      {m.label}
                    </Text>
                    {jaAplicada && <Text style={styles.craftItemAppliedMark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: RPG.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 40,
  },
  titleBar: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  title: {
    fontFamily: Platform.select({ ios: 'ui-serif', default: 'serif' }),
    fontSize: 22,
    color: RPG.gold,
    letterSpacing: 1,
  },
  hexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  emptyInventory: {
    color: RPG.textDark,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  addItemRow: { flexDirection: 'row', gap: 8, paddingVertical: 8 },
  addItemBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: RPG.goldDim,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addItemBtnText: { color: RPG.gold, fontSize: 13, fontWeight: '600' },
  nomeInput: {
    backgroundColor: RPG.surface,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: RPG.text,
    fontSize: 14,
  },
  pickerBtn: {
    backgroundColor: RPG.goldDim,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  pickerBtnText: {
    color: RPG.bg,
    fontWeight: '700',
    fontSize: 13,
  },
  clearBtn: {
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 4,
    paddingVertical: 6,
    alignItems: 'center',
  },
  clearBtnText: {
    color: RPG.textMuted,
    fontSize: 12,
  },
  modal: {
    flex: 1,
    backgroundColor: RPG.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RPG.gold,
  },
  modalClose: {
    fontSize: 20,
    color: RPG.textMuted,
    paddingHorizontal: 8,
  },
  modalList: {
    flex: 1,
  },
  modalItem: {
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RPG.border,
  },
  modalItemSelected: {
    backgroundColor: RPG.surface,
    borderLeftWidth: 3,
    borderLeftColor: RPG.gold,
  },
  modalItemName: {
    fontSize: 14,
    color: RPG.text,
    fontWeight: '600',
  },
  modalItemMeta: {
    fontSize: 11,
    color: RPG.textMuted,
    marginTop: 2,
  },
  melhoriasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  melhoriaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
  },
  melhoriaLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  melhoriaRemove: {
    paddingHorizontal: 2,
  },
  melhoriaRemoveText: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  addMelhoriaBtn: {
    borderWidth: 1,
    borderColor: RPG.goldDim,
    borderRadius: 4,
    paddingVertical: 7,
    alignItems: 'center',
  },
  addMelhoriaBtnDisabled: {
    borderColor: RPG.border,
    opacity: 0.5,
  },
  addMelhoriaBtnText: {
    color: RPG.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  tipoToggle: {
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 4,
    paddingVertical: 7,
    alignItems: 'center',
  },
  tipoToggleActive: {
    borderColor: RPG.gold,
    backgroundColor: RPG.surfaceAlt,
  },
  tipoToggleText: {
    color: RPG.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tipoToggleTextActive: {
    color: RPG.gold,
  },
  efeitoInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  craftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RPG.border,
  },
  craftItemApplied: {
    opacity: 0.5,
  },
  craftCorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  craftItemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  craftItemAppliedMark: {
    fontSize: 14,
    color: RPG.textMuted,
  },
});
