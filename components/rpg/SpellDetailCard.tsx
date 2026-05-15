import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';
import { Spell, SpellType } from '@/data/grimoire';
import spellImages from '@/data/spellImages';
import { COLOR_HEX } from '@/constants/spell-constants';
import StatPill from '@/components/rpg/StatPill';

interface Props {
  spell: Spell;
  onClose: () => void;
  magicas?: string[];
  onAddMagica?: (idx: number, name: string) => void;
}

const TYPE_LABELS: Record<SpellType, string> = {
  '[T]': 'Truque',
  '[E]': 'Encantamento',
  '[F]': 'Feitiço',
  '[C]': 'Criatura',
};

export default function SpellDetailCard({ spell, onClose, magicas, onAddMagica }: Props) {
  const [feedback, setFeedback] = useState('');
  const color = COLOR_HEX[spell.cor];
  const img = spellImages[spell.nome];

  const addMagica = () => {
    if (!onAddMagica || !magicas) return;
    const idx = magicas.findIndex(m => !m.trim());
    if (idx === -1) {
      setFeedback('Todos os slots de mágicas estão cheios!');
    } else {
      onAddMagica(idx, spell.nome);
      setFeedback(`"${spell.nome}" adicionada às mágicas!`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.detailContent}>
      <View style={[styles.detailHeader, { borderBottomColor: color }]}>
        {img && <Image source={img} style={styles.spellImg} resizeMode="contain" />}
        <View style={{ flex: 1 }}>
          <Text style={[styles.detailName, { color }]}>{spell.nome}</Text>
          <Text style={styles.detailMeta}>{spell.dominio} · {spell.atributo}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailStats}>
        <StatPill label="Grau" value={String(spell.grau)} />
        <StatPill label="Tipo" value={TYPE_LABELS[spell.tipo]} />
        <StatPill label="Custo" value={spell.custo || '—'} isSymbol />
      </View>
      <Text style={styles.detailEffect}>{spell.efeito}</Text>
      {onAddMagica && (
        <View style={styles.importRow}>
          <TouchableOpacity style={[styles.importBtn, styles.importBtnAlt]} onPress={addMagica} activeOpacity={0.75}>
            <Text style={[styles.importBtnText, { color: RPG.azulLight }]}>+ Mágica</Text>
          </TouchableOpacity>
        </View>
      )}
      {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailContent: { padding: 16, paddingBottom: 32 },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 12,
    gap: 10,
  },
  spellImg: {
    width: 72,
    height: 72,
    borderRadius: 4,
    backgroundColor: RPG.surfaceAlt,
  },
  detailName: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  detailMeta: { color: RPG.textMuted, fontSize: 12 },
  closeBtn: { padding: 4 },
  closeBtnText: { color: RPG.textMuted, fontSize: 18 },
  detailStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  detailEffect: {
    color: RPG.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  importRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  importBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: RPG.gold,
    alignItems: 'center',
    backgroundColor: RPG.surfaceAlt,
  },
  importBtnAlt: { borderColor: RPG.azulLight },
  importBtnText: { color: RPG.gold, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  feedback: {
    marginTop: 10,
    color: RPG.verdeLight,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
