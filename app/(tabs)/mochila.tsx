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
import { EquipItem } from '@/types/character';
import { armas, escudos, vestimentas, acessorios } from '@/data/regras/equipamentos';

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

export default function MochilaScreen() {
  const { character: c, setEquipamentoItem, isLoaded } = useCharacter();
  const [pickerSlot, setPickerSlot] = useState<SlotKey | null>(null);
  const [expandedSlot, setExpandedSlot] = useState<SlotKey | null>(null);

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

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={RPG.gold} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  const activePickerSlot = pickerSlot ?? 'arma';

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
                  </View>
                )}
              </View>
            );
          })}
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
});
