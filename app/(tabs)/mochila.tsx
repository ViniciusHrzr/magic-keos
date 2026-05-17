import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import NumericStepper from '@/components/rpg/NumericStepper';
import { EquipItem } from '@/types/character';
import { armas, escudos, vestimentas, acessorios, MELHORIAS_POR_SLOT, MelhoriaItem } from '@/data/regras/equipamentos';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SLOT_KEYS = ['arma', 'escudo', 'vestimenta', 'acessorio1', 'acessorio2'] as const;
type SlotKey = typeof SLOT_KEYS[number];

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

const COR_TOKEN: Record<MelhoriaItem['cor'], string> = {
  branco:   RPG.branco,
  verde:    RPG.verde,
  vermelho: RPG.vermelho,
  preto:    RPG.pretoLight,
  azul:     RPG.azul,
};

export default function MochilaScreen() {
  const { character: c, setEquipamentoItem, setInventarioSlot, isLoaded } = useCharacter();
  const [pickerSlot, setPickerSlot] = useState<SlotKey | null>(null);
  const [expandedSlot, setExpandedSlot] = useState<SlotKey | null>(null);
  const [crafterSlot, setCrafterSlot] = useState<SlotKey | null>(null);

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
          {SLOT_KEYS.map(slot => {
            const item = c.equipamentos[slot];
            const isExpanded = expandedSlot === slot;
            return (
              <View
                key={slot}
                style={[styles.slotCard, item != null && styles.slotCardFilled]}
              >
                <TouchableOpacity
                  onPress={() => toggleExpanded(slot)}
                  activeOpacity={0.8}
                  style={styles.slotHeader}
                >
                  <Text style={styles.slotLabel}>{SLOT_LABELS[slot].toUpperCase()}</Text>
                  {item != null ? (
                    <Text style={styles.slotNome} numberOfLines={1}>{item.nome}</Text>
                  ) : (
                    <Text style={[styles.slotNome, styles.slotNomeEmpty]}>—</Text>
                  )}
                  {item != null && item.melhorias.length > 0 && (
                    <Text style={styles.slotMelhorias}>{item.melhorias.length} melh.</Text>
                  )}
                  <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.slotBody}>
                    <TextInput
                      style={styles.nomeInput}
                      value={item?.nome ?? ''}
                      onChangeText={v => editNome(slot, v)}
                      placeholder="Nome personalizado..."
                      placeholderTextColor={RPG.textDark}
                    />
                    <TouchableOpacity
                      style={styles.pickerBtn}
                      onPress={() => setPickerSlot(slot)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pickerBtnText}>Escolher do livro</Text>
                    </TouchableOpacity>
                    {item != null && (
                      <TouchableOpacity
                        style={styles.clearBtn}
                        onPress={() => clearSlot(slot)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.clearBtnText}>Remover item</Text>
                      </TouchableOpacity>
                    )}
                    {item != null && (
                      <>
                        {item.melhorias.length > 0 && (
                          <View style={styles.melhoriasList}>
                            {item.melhorias.map((label, idx) => {
                              const melhoriaData = MELHORIAS_POR_SLOT[slot].find(m => m.label === label);
                              const cor = melhoriaData ? COR_TOKEN[melhoriaData.cor] : RPG.textMuted;
                              return (
                                <View key={idx} style={[styles.melhoriaBadge, { borderColor: cor }]}>
                                  <Text style={[styles.melhoriaLabel, { color: cor }]}>{label}</Text>
                                  <TouchableOpacity onPress={() => removeMelhoria(slot, idx)} activeOpacity={0.7} style={styles.melhoriaRemove}>
                                    <Text style={[styles.melhoriaRemoveText, { color: cor }]}>×</Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        )}
                        <TouchableOpacity
                          style={[styles.addMelhoriaBtn, item.melhorias.length >= 3 && styles.addMelhoriaBtnDisabled]}
                          onPress={() => { if (item.melhorias.length < 3) setCrafterSlot(slot); }}
                          activeOpacity={item.melhorias.length >= 3 ? 1 : 0.8}
                        >
                          <Text style={styles.addMelhoriaBtnText}>
                            {item.melhorias.length >= 3 ? 'Máx. 3 melhorias' : '+ Adicionar Melhoria'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.tipoToggle, item.tipo === 'artefato' && styles.tipoToggleActive]}
                          onPress={() => toggleTipo(slot)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.tipoToggleText, item.tipo === 'artefato' && styles.tipoToggleTextActive]}>
                            {item.tipo === 'basico' ? 'Básico' : 'Artefato ✦'}
                          </Text>
                        </TouchableOpacity>
                        {item.tipo === 'artefato' && (
                          <>
                            <TextInput
                              style={[styles.nomeInput, styles.efeitoInput]}
                              value={item.efeito ?? ''}
                              onChangeText={v => setEquipamentoItem(slot, { ...item, efeito: v })}
                              placeholder="Efeito ativável..."
                              placeholderTextColor={RPG.textDark}
                              multiline
                            />
                            <NumericStepper
                              label="Durabilidade"
                              value={item.durabilidade ?? 0}
                              onChange={v => setEquipamentoItem(slot, { ...item, durabilidade: v })}
                              min={0}
                              compact
                            />
                          </>
                        )}
                      </>
                    )}
                  </View>
                )}
              </View>
            );
          })}
          <SectionHeader title="Inventário" />
          <View style={styles.invGrid}>
            {Array.from({ length: 10 }, (_, row) => (
              <View key={row} style={styles.invRow}>
                {[row * 2, row * 2 + 1].map(idx => (
                  <View key={idx} style={styles.invCell}>
                    <TextInput
                      style={styles.invInput}
                      value={(c.inventarioSlots ?? [])[idx] ?? ''}
                      onChangeText={v => setInventarioSlot(idx, v)}
                      placeholder={String(idx + 1)}
                      placeholderTextColor={RPG.textDark}
                    />
                    {((c.inventarioSlots ?? [])[idx] ?? '').trim() !== '' && (
                      <TouchableOpacity
                        onPress={() => setInventarioSlot(idx, '')}
                        activeOpacity={0.7}
                        style={styles.invClearBtn}
                      >
                        <Text style={styles.invClearText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
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
  slotCard: {
    backgroundColor: RPG.surface,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  slotCardFilled: {
    borderColor: RPG.goldDim,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  slotLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: RPG.textDark,
    letterSpacing: 1,
    width: 80,
  },
  slotNome: {
    flex: 1,
    fontSize: 14,
    color: RPG.gold,
    fontWeight: '600',
  },
  slotNomeEmpty: {
    color: RPG.textDark,
    fontWeight: '400',
  },
  slotMelhorias: {
    fontSize: 11,
    color: RPG.textMuted,
  },
  chevron: {
    fontSize: 12,
    color: RPG.textDark,
    marginLeft: 4,
  },
  slotBody: {
    padding: 12,
    paddingTop: 0,
    gap: 10,
  },
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
  invGrid: {
    marginTop: 4,
    marginBottom: 16,
  },
  invRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  invCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RPG.surface,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 0,
    minHeight: 38,
  },
  invInput: {
    flex: 1,
    color: RPG.text,
    fontSize: 13,
    paddingVertical: 8,
  },
  invClearBtn: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  invClearText: {
    color: RPG.textDark,
    fontSize: 13,
  },
});
