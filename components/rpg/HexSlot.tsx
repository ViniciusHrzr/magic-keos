import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';
import { EquipItem } from '@/types/character';
import NumericStepper from '@/components/rpg/NumericStepper';

const SLOT_CHAR: Record<string, string> = {
  arma: '⚔',
  escudo: '🛡',
  vestimenta: '👘',
  acessorio1: '◆',
  acessorio2: '◆',
};

export interface HexSlotProps {
  slotKey: 'arma' | 'escudo' | 'vestimenta' | 'acessorio1' | 'acessorio2';
  label: string;
  affinityColor: string;
  item: EquipItem | null;
  melhoriaColors: Record<string, string>;
  onPress: () => void;
  isExpanded: boolean;
  onPickerOpen: () => void;
  onCrafterOpen: () => void;
  onClearSlot: () => void;
  onEditNome: (nome: string) => void;
  onRemoveMelhoria: (idx: number) => void;
  onToggleTipo: () => void;
  onEditEfeito: (v: string) => void;
  onEditDurabilidade: (v: number) => void;
  availableMelhorias: Array<{ label: string; cor: string }>;
  statSummary?: string;
}

function HexSlot(props: HexSlotProps) {
  const {
    slotKey, label, affinityColor, item, melhoriaColors, onPress,
    isExpanded, onPickerOpen, onCrafterOpen, onClearSlot, onEditNome,
    onRemoveMelhoria, onToggleTipo, onEditEfeito, onEditDurabilidade,
    statSummary,
  } = props;

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.hex, { borderColor: affinityColor }]}
        activeOpacity={0.8}
      >
        {item ? (
          <>
            <Text style={styles.hexName} numberOfLines={1}>{item.nome || label}</Text>
            {statSummary ? (
              <Text style={styles.hexStat} numberOfLines={1}>{statSummary}</Text>
            ) : null}
            {item.melhorias.length > 0 && (
              <View style={styles.hexDots}>
                {item.melhorias.slice(0, 3).map((ml, i) => (
                  <View
                    key={i}
                    style={[styles.hexDot, { backgroundColor: melhoriaColors[ml] ?? RPG.textMuted }]}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={[styles.hexChar, { color: affinityColor }]}>{SLOT_CHAR[slotKey]}</Text>
            <Text style={[styles.hexLabel, { color: affinityColor }]}>{label}</Text>
          </>
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.body}>
          {statSummary ? (
            <Text style={styles.statLine}>{statSummary}</Text>
          ) : null}
          <TextInput
            style={styles.nomeInput}
            value={item?.nome ?? ''}
            onChangeText={onEditNome}
            placeholder="Nome personalizado..."
            placeholderTextColor={RPG.textDark}
          />
          <TouchableOpacity style={styles.pickerBtn} onPress={onPickerOpen} activeOpacity={0.8}>
            <Text style={styles.pickerBtnText}>Escolher do livro</Text>
          </TouchableOpacity>
          {item != null && (
            <TouchableOpacity style={styles.clearBtn} onPress={onClearSlot} activeOpacity={0.8}>
              <Text style={styles.clearBtnText}>Remover item</Text>
            </TouchableOpacity>
          )}
          {item != null && (
            <>
              {item.melhorias.length > 0 && (
                <View style={styles.melhoriasList}>
                  {item.melhorias.map((ml, idx) => {
                    const cor = melhoriaColors[ml] ?? RPG.textMuted;
                    return (
                      <View key={idx} style={[styles.melhoriaBadge, { borderColor: cor }]}>
                        <Text style={[styles.melhoriaLabel, { color: cor }]}>{ml}</Text>
                        <TouchableOpacity
                          onPress={() => onRemoveMelhoria(idx)}
                          activeOpacity={0.7}
                          style={styles.melhoriaRemove}
                        >
                          <Text style={[styles.melhoriaRemoveText, { color: cor }]}>×</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
              <TouchableOpacity
                style={[styles.addMelhoriaBtn, item.melhorias.length >= 3 && styles.addMelhoriaBtnDisabled]}
                onPress={() => { if (item.melhorias.length < 3) onCrafterOpen(); }}
                activeOpacity={item.melhorias.length >= 3 ? 1 : 0.8}
              >
                <Text style={styles.addMelhoriaBtnText}>
                  {item.melhorias.length >= 3 ? 'Máx. 3 melhorias' : '+ Adicionar Melhoria'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tipoToggle, item.tipo === 'artefato' && styles.tipoToggleActive]}
                onPress={onToggleTipo}
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
                    onChangeText={onEditEfeito}
                    placeholder="Efeito ativável..."
                    placeholderTextColor={RPG.textDark}
                    multiline
                  />
                  <NumericStepper
                    label="Durabilidade"
                    value={item.durabilidade ?? 0}
                    onChange={onEditDurabilidade}
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
  wrap: {
    width: '100%',
  },
  hex: {
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: RPG.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  hexName: {
    color: RPG.gold,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  hexStat: {
    color: RPG.textMuted,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 1,
  },
  statLine: {
    color: RPG.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    paddingBottom: 2,
  },
  hexChar: {
    fontSize: 20,
  },
  hexLabel: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  hexDots: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  hexDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  body: {
    padding: 10,
    gap: 8,
    backgroundColor: RPG.surfaceAlt,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: RPG.border,
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

export default React.memo(HexSlot);
