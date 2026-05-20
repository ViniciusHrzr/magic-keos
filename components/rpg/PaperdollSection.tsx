import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { RPG } from '@/constants/theme';
import NumericStepper from '@/components/rpg/NumericStepper';
import { EquipItem } from '@/types/character';

type SlotKey = 'arma' | 'escudo' | 'vestimenta' | 'acessorio1' | 'acessorio2';

const SLOT_CHAR: Record<SlotKey, string> = {
  arma: '⚔', escudo: '🛡', vestimenta: '👘',
  acessorio1: '◆', acessorio2: '◆',
};

const SLOT_LABELS: Record<SlotKey, string> = {
  arma: 'Arma', escudo: 'Escudo', vestimenta: 'Vestimenta',
  acessorio1: 'Acessório 1', acessorio2: 'Acessório 2',
};

const SLOT_AFFINITY: Record<SlotKey, string> = {
  arma: RPG.vermelho, escudo: RPG.azul, vestimenta: RPG.verde,
  acessorio1: RPG.branco, acessorio2: RPG.branco,
};

export interface PaperdollSectionProps {
  equipamentos: Record<SlotKey, EquipItem | null>;
  expandedSlot: SlotKey | null;
  onSlotPress: (slot: SlotKey) => void;
  onPickerOpen: (slot: SlotKey) => void;
  onCrafterOpen: (slot: SlotKey) => void;
  onClearSlot: (slot: SlotKey) => void;
  onEditNome: (slot: SlotKey, nome: string) => void;
  onRemoveMelhoria: (slot: SlotKey, idx: number) => void;
  onToggleTipo: (slot: SlotKey) => void;
  onEditEfeito: (slot: SlotKey, v: string) => void;
  onEditDurabilidade: (slot: SlotKey, v: number) => void;
  melhoriaColors: Record<string, string>;
  availableMelhorias: Record<SlotKey, { label: string; cor: string }[]>;
  statSummary: Record<SlotKey, string | undefined>;
}

function Silhouette() {
  return (
    <View style={styles.silhouetteWrap}>
      <View style={styles.silHead} />
      <View style={styles.silShoulders} />
    </View>
  );
}

interface SlotBtnProps {
  slotKey: SlotKey;
  item: EquipItem | null;
  isSelected: boolean;
  onPress: () => void;
}

function PaperdollSlot({ slotKey, item, isSelected, onPress }: SlotBtnProps) {
  const equipped = item != null;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.slot,
        equipped ? styles.slotEquipped : styles.slotEmpty,
        isSelected && styles.slotSelected,
      ]}
    >
      {equipped ? (
        <>
          <Text style={styles.slotEquippedChar}>{SLOT_CHAR[slotKey]}</Text>
          <Text style={styles.slotEquippedName} numberOfLines={2}>{item.nome}</Text>
        </>
      ) : (
        <>
          <Text style={[styles.slotChar, { color: SLOT_AFFINITY[slotKey] }]}>
            {SLOT_CHAR[slotKey]}
          </Text>
          <Text style={[styles.slotLabel, { color: SLOT_AFFINITY[slotKey] }]}>
            {SLOT_LABELS[slotKey]}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export default function PaperdollSection({
  equipamentos, expandedSlot, onSlotPress,
  onPickerOpen, onCrafterOpen, onClearSlot,
  onEditNome, onRemoveMelhoria, onToggleTipo,
  onEditEfeito, onEditDurabilidade,
  melhoriaColors, availableMelhorias: _availableMelhorias, statSummary,
}: PaperdollSectionProps) {
  const activeItem = expandedSlot ? equipamentos[expandedSlot] : null;

  return (
    <View>
      {/* ── PAPERDOLL ── */}
      <View style={styles.paperdoll}>
        {/* Silhueta centralizada */}
        <View style={styles.silhouetteContainer}>
          <Silhouette />
        </View>

        {/* Vestimenta — topo centro */}
        {equipamentos.vestimenta && (
          <View style={styles.posVestimenta}>
            <PaperdollSlot slotKey="vestimenta" item={equipamentos.vestimenta} isSelected={expandedSlot === 'vestimenta'} onPress={() => onSlotPress('vestimenta')} />
          </View>
        )}

        {/* Arma — esquerda */}
        {equipamentos.arma && (
          <View style={styles.posArma}>
            <PaperdollSlot slotKey="arma" item={equipamentos.arma} isSelected={expandedSlot === 'arma'} onPress={() => onSlotPress('arma')} />
          </View>
        )}

        {/* Escudo — direita */}
        {equipamentos.escudo && (
          <View style={styles.posEscudo}>
            <PaperdollSlot slotKey="escudo" item={equipamentos.escudo} isSelected={expandedSlot === 'escudo'} onPress={() => onSlotPress('escudo')} />
          </View>
        )}

        {/* Acessório 1 — baixo esquerda */}
        <View style={styles.posAcessorio1}>
          <PaperdollSlot slotKey="acessorio1" item={equipamentos.acessorio1} isSelected={expandedSlot === 'acessorio1'} onPress={() => onSlotPress('acessorio1')} />
        </View>

        {/* Acessório 2 — baixo direita */}
        <View style={styles.posAcessorio2}>
          <PaperdollSlot slotKey="acessorio2" item={equipamentos.acessorio2} isSelected={expandedSlot === 'acessorio2'} onPress={() => onSlotPress('acessorio2')} />
        </View>
      </View>

      {/* ── SUMMARY (sempre visível) ── */}
      {(['arma', 'escudo', 'vestimenta', 'acessorio1', 'acessorio2'] as SlotKey[])
        .filter(slot => equipamentos[slot] != null)
        .map(slot => {
          const item = equipamentos[slot]!;
          const stat = statSummary[slot];
          return (
            <View key={slot} style={styles.summaryRow}>
              <Text style={styles.summaryChar}>{SLOT_CHAR[slot]}</Text>
              <View style={styles.summaryBody}>
                <View style={styles.summaryTop}>
                  <Text style={styles.summaryName} numberOfLines={1}>{item.nome || SLOT_LABELS[slot]}</Text>
                  {stat ? <Text style={styles.summaryStat}>{stat}</Text> : null}
                </View>
                {item.melhorias.length > 0 && (
                  <View style={styles.summaryBadges}>
                    {item.melhorias.map((ml, i) => {
                      const cor = melhoriaColors[ml] ?? RPG.textMuted;
                      return (
                        <View key={i} style={[styles.summaryBadge, { borderColor: cor }]}>
                          <View style={[styles.summaryDot, { backgroundColor: cor }]} />
                          <Text style={[styles.summaryBadgeLabel, { color: cor }]}>{ml}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          );
        })
      }

      {/* ── PAINEL DE DETALHE ── */}
      {expandedSlot !== null && (
        <View style={styles.detailPanel}>
          {statSummary[expandedSlot] ? (
            <Text style={styles.statLine}>{statSummary[expandedSlot]}</Text>
          ) : null}
          <TextInput
            style={styles.nomeInput}
            value={activeItem?.nome ?? ''}
            onChangeText={v => onEditNome(expandedSlot, v)}
            placeholder="Nome personalizado..."
            placeholderTextColor={RPG.textDark}
          />
          <TouchableOpacity style={styles.pickerBtn} onPress={() => onPickerOpen(expandedSlot)} activeOpacity={0.8}>
            <Text style={styles.pickerBtnText}>Escolher do livro</Text>
          </TouchableOpacity>
          {activeItem != null && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => onClearSlot(expandedSlot)} activeOpacity={0.8}>
              <Text style={styles.clearBtnText}>Remover item</Text>
            </TouchableOpacity>
          )}
          {activeItem != null && (
            <>
              {activeItem.melhorias.length > 0 && (
                <View style={styles.melhoriasList}>
                  {activeItem.melhorias.map((ml, idx) => {
                    const cor = melhoriaColors[ml] ?? RPG.textMuted;
                    return (
                      <View key={idx} style={[styles.melhoriaBadge, { borderColor: cor }]}>
                        <Text style={[styles.melhoriaLabel, { color: cor }]}>{ml}</Text>
                        <TouchableOpacity onPress={() => onRemoveMelhoria(expandedSlot, idx)} activeOpacity={0.7} style={styles.melhoriaRemove}>
                          <Text style={[styles.melhoriaRemoveText, { color: cor }]}>×</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
              <TouchableOpacity
                style={[styles.addMelhoriaBtn, activeItem.melhorias.length >= 3 && styles.addMelhoriaBtnDisabled]}
                onPress={() => { if (activeItem.melhorias.length < 3) onCrafterOpen(expandedSlot); }}
                activeOpacity={activeItem.melhorias.length >= 3 ? 1 : 0.8}
              >
                <Text style={styles.addMelhoriaBtnText}>
                  {activeItem.melhorias.length >= 3 ? 'Máx. 3 melhorias' : '+ Adicionar Melhoria'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tipoToggle, activeItem.tipo === 'artefato' && styles.tipoToggleActive]}
                onPress={() => onToggleTipo(expandedSlot)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tipoToggleText, activeItem.tipo === 'artefato' && styles.tipoToggleTextActive]}>
                  {activeItem.tipo === 'basico' ? 'Básico' : 'Artefato ✦'}
                </Text>
              </TouchableOpacity>
              {activeItem.tipo === 'artefato' && (
                <>
                  <TextInput
                    style={[styles.nomeInput, styles.efeitoInput]}
                    value={activeItem.efeito ?? ''}
                    onChangeText={v => onEditEfeito(expandedSlot, v)}
                    placeholder="Efeito ativável..."
                    placeholderTextColor={RPG.textDark}
                    multiline
                  />
                  <NumericStepper
                    label="Durabilidade"
                    value={activeItem.durabilidade ?? 0}
                    onChange={v => onEditDurabilidade(expandedSlot, v)}
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
}

const styles = StyleSheet.create({
  // ── Paperdoll container ──
  paperdoll: {
    height: 240,
    position: 'relative',
    backgroundColor: RPG.bg,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    marginBottom: 2,
  },

  // ── Silhueta ──
  silhouetteContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  silhouetteWrap: {
    alignItems: 'center',
  },
  silHead: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: RPG.border,
    borderWidth: 1,
    borderColor: RPG.goldDim,
  },
  silShoulders: {
    width: 48,
    height: 8,
    backgroundColor: RPG.border,
    borderColor: RPG.goldDim,
    borderWidth: 1,
    marginTop: 2,
  },
  silBody: {
    width: 34,
    height: 56,
    backgroundColor: RPG.border,
    borderColor: RPG.goldDim,
    borderWidth: 1,
    marginTop: 1,
  },

  // ── Slot positions (absolute) ──
  posVestimenta: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -30,
  },
  posArma: {
    position: 'absolute',
    top: 78,
    left: 14,
  },
  posEscudo: {
    position: 'absolute',
    top: 78,
    right: 14,
  },
  posAcessorio1: {
    position: 'absolute',
    top: 163,
    left: 38,
  },
  posAcessorio2: {
    position: 'absolute',
    top: 163,
    right: 38,
  },

  // ── PaperdollSlot ──
  slot: {
    width: 62,
    height: 62,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  slotEmpty: {
    borderColor: RPG.goldDim,
    backgroundColor: RPG.surface,
    opacity: 1,
  },
  slotEquipped: {
    borderColor: RPG.gold,
    backgroundColor: RPG.surfaceAlt,
    ...Platform.select({
      ios: { shadowColor: RPG.gold, shadowOpacity: 0.45, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
      android: { elevation: 4 },
      default: {},
    }),
  },
  slotSelected: {
    borderColor: RPG.goldLight,
    borderWidth: 2.5,
  },
  slotChar: {
    fontSize: 22,
    opacity: 0.35,
  },
  slotLabel: {
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.4,
    marginTop: 2,
  },
  slotEquippedChar: {
    fontSize: 14,
    color: RPG.gold,
  },
  slotEquippedName: {
    fontSize: 8,
    color: RPG.text,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },

  // ── Equipment summary (always visible) ──
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: RPG.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RPG.border,
  },
  summaryChar: { fontSize: 13, width: 18, textAlign: 'center', color: RPG.textMuted, marginTop: 1 },
  summaryBody: { flex: 1 },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  summaryName: { color: RPG.text, fontSize: 12, fontWeight: '600', flexShrink: 1 },
  summaryStat: { color: RPG.textMuted, fontSize: 11, fontStyle: 'italic', flexShrink: 1 },
  summaryBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 3 },
  summaryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    borderWidth: 1, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1,
  },
  summaryDot: { width: 5, height: 5, borderRadius: 2.5 },
  summaryBadgeLabel: { fontSize: 9, fontWeight: '600' },

  // ── Detail panel ──
  detailPanel: {
    padding: 12,
    gap: 8,
    backgroundColor: RPG.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  statLine: {
    color: RPG.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
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
  efeitoInput: {
    minHeight: 60,
    textAlignVertical: 'top',
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
  clearBtnText: { color: RPG.textMuted, fontSize: 12 },
  melhoriasList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  melhoriaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
  },
  melhoriaLabel: { fontSize: 11, fontWeight: '600' },
  melhoriaRemove: { paddingHorizontal: 2 },
  melhoriaRemoveText: { fontSize: 14, lineHeight: 16, fontWeight: '700' },
  addMelhoriaBtn: {
    borderWidth: 1,
    borderColor: RPG.goldDim,
    borderRadius: 4,
    paddingVertical: 7,
    alignItems: 'center',
  },
  addMelhoriaBtnDisabled: { borderColor: RPG.border, opacity: 0.5 },
  addMelhoriaBtnText: { color: RPG.gold, fontSize: 12, fontWeight: '600' },
  tipoToggle: {
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 4,
    paddingVertical: 7,
    alignItems: 'center',
  },
  tipoToggleActive: { borderColor: RPG.gold, backgroundColor: RPG.surfaceAlt },
  tipoToggleText: { color: RPG.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  tipoToggleTextActive: { color: RPG.gold },
});
