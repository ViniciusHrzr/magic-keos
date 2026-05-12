import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { grimoire, Spell, SpellColor, SpellType } from '@/data/grimoire';
import { RPG } from '@/constants/theme';
import { useCharacter } from '@/store/CharacterContext';

const COLOR_LABELS: Record<SpellColor, string> = {
  branco: 'Branco',
  verde: 'Verde',
  vermelho: 'Vermelho',
  preto: 'Preto',
  azul: 'Azul',
};

const COLOR_HEX: Record<SpellColor, string> = {
  branco: RPG.branco,
  verde: RPG.verdeLight,
  vermelho: RPG.vermelhoLight,
  preto: RPG.pretoLight,
  azul: RPG.azulLight,
};

const TYPE_LABELS: Record<SpellType, string> = {
  '[T]': 'Truque',
  '[E]': 'Encantamento',
  '[F]': 'Feitiço',
  '[C]': 'Criatura',
};

const GRAU_COLORS = ['#888', RPG.gold, RPG.goldLight, '#fff'];
const COLORS: SpellColor[] = ['branco', 'verde', 'vermelho', 'preto', 'azul'];

export default function GrimorioScreen() {
  const { character: c, setDominio } = useCharacter();
  const [search, setSearch] = useState('');
  const [activeColor, setActiveColor] = useState<SpellColor | null>(null);
  const [activeGrau, setActiveGrau] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<SpellType | null>(null);
  const [selected, setSelected] = useState<Spell | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return grimoire.filter(s => {
      if (activeColor && s.cor !== activeColor) return false;
      if (activeGrau !== null && s.grau !== activeGrau) return false;
      if (activeType && s.tipo !== activeType) return false;
      if (q && !s.nome.toLowerCase().includes(q) && !s.dominio.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, activeColor, activeGrau, activeType]);

  const renderSpell = useCallback(({ item }: { item: Spell }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelected(item)} activeOpacity={0.75}>
      <View style={[styles.colorStrip, { backgroundColor: COLOR_HEX[item.cor] }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardName} numberOfLines={1}>{item.nome}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.gradeBadge, { borderColor: GRAU_COLORS[item.grau] }]}>
              <Text style={[styles.gradeText, { color: GRAU_COLORS[item.grau] }]}>{item.grau}</Text>
            </View>
            <Text style={[styles.typeBadge, typeColor(item.tipo)]}>{item.tipo}</Text>
          </View>
        </View>
        <Text style={styles.cardDomain} numberOfLines={1}>{item.dominio} · {item.atributo}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.cardCustoLabel}>Custo:</Text>
          <Text style={styles.cardCustoSymbol}>{item.custo || '—'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Grimório</Text>
        <Text style={styles.count}>{filtered.length} mágicas</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nome ou domínio..."
          placeholderTextColor={RPG.textDark}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Color filters */}
      <View style={styles.filters}>
        {COLORS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.filterBtn, { borderColor: COLOR_HEX[c] }, activeColor === c && { backgroundColor: COLOR_HEX[c] + '33' }]}
            onPress={() => setActiveColor(activeColor === c ? null : c)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, { color: COLOR_HEX[c] }]}>{COLOR_LABELS[c]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grau + Type filters */}
      <View style={styles.filters}>
        {[0, 1, 2, 3].map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.filterBtn2, activeGrau === g && styles.filterBtn2Active]}
            onPress={() => setActiveGrau(activeGrau === g ? null : g)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText2, activeGrau === g && { color: RPG.gold }]}>
              Grau {g}
            </Text>
          </TouchableOpacity>
        ))}
        {(['[T]', '[E]', '[F]', '[C]'] as SpellType[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.filterBtn2, activeType === t && styles.filterBtn2Active]}
            onPress={() => setActiveType(activeType === t ? null : t)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText2, activeType === t && { color: RPG.gold }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderSpell}
        contentContainerStyle={styles.list}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}
      />

      {/* Spell detail modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            {selected && (
              <SpellDetail
                spell={selected}
                onClose={() => setSelected(null)}
                dominios={c.dominios}
                onSetDominio={setDominio}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SpellDetail({ spell, onClose, dominios, onSetDominio }: {
  spell: Spell;
  onClose: () => void;
  dominios: string[];
  onSetDominio: (idx: number, v: string) => void;
}) {
  const [feedback, setFeedback] = useState('');
  const color = COLOR_HEX[spell.cor];

  const addDominio = () => {
    const idx = dominios.slice(0, 3).findIndex(d => !d.trim());
    if (idx === -1) {
      setFeedback('Domínios iniciais já estão cheios!');
    } else {
      onSetDominio(idx, spell.dominio);
      setFeedback(`Domínio "${spell.dominio}" adicionado!`);
    }
  };

  const addMagia = () => {
    const slotIdx = dominios.slice(3).findIndex(d => !d.trim());
    if (slotIdx === -1) {
      setFeedback('Todos os slots de domínio estão cheios!');
    } else {
      onSetDominio(3 + slotIdx, spell.nome);
      setFeedback(`"${spell.nome}" adicionado aos domínios!`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.detailContent}>
      <View style={[styles.detailHeader, { borderBottomColor: color }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.detailName, { color }]}>{spell.nome}</Text>
          <Text style={styles.detailMeta}>
            {COLOR_LABELS[spell.cor]} · {spell.dominio} · {spell.atributo}
          </Text>
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
      <View style={styles.importRow}>
        <TouchableOpacity style={styles.importBtn} onPress={addDominio} activeOpacity={0.75}>
          <Text style={styles.importBtnText}>+ Domínio Inicial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.importBtn, styles.importBtnAlt]} onPress={addMagia} activeOpacity={0.75}>
          <Text style={styles.importBtnText}>+ Magia ao Domínio</Text>
        </TouchableOpacity>
      </View>
      {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </ScrollView>
  );
}

function StatPill({ label, value, isSymbol }: { label: string; value: string; isSymbol?: boolean }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={[styles.pillValue, isSymbol && { fontFamily: 'PlanewalkerDings', fontStyle: 'normal', fontSize: 16 }]}>{value}</Text>
    </View>
  );
}

function typeColor(t: SpellType) {
  switch (t) {
    case '[T]': return { color: RPG.incolor };
    case '[E]': return { color: RPG.azulLight };
    case '[F]': return { color: RPG.vermelhoLight };
    case '[C]': return { color: RPG.verdeLight };
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: RPG.bg },

  header: {
    backgroundColor: RPG.headerBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: RPG.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: RPG.gold,
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  count: {
    color: RPG.textMuted,
    fontSize: 12,
  },

  searchWrap: {
    padding: 8,
    backgroundColor: RPG.surface,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  search: {
    backgroundColor: RPG.surfaceAlt,
    color: RPG.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: RPG.border,
    fontSize: 13,
  },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    padding: 6,
    backgroundColor: RPG.surface,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterBtn2: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 10,
  },
  filterBtn2Active: {
    borderColor: RPG.gold,
    backgroundColor: RPG.goldDim + '33',
  },
  filterText2: {
    fontSize: 11,
    color: RPG.textMuted,
  },

  list: {
    padding: 6,
    gap: 4,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: RPG.surface,
    borderWidth: 1,
    borderColor: RPG.border,
    marginVertical: 2,
    height: 76,
  },
  colorStrip: {
    width: 4,
    alignSelf: 'stretch',
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    color: RPG.text,
    fontSize: 14,
    fontFamily: 'serif',
    fontWeight: '600',
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  gradeBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  typeBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardDomain: {
    color: RPG.textMuted,
    fontSize: 11,
  },
  cardCustoLabel: {
    color: RPG.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
  },
  cardCustoSymbol: {
    fontFamily: 'PlanewalkerDings',
    fontStyle: 'normal',
    fontSize: 13,
    color: RPG.textMuted,
  },

  modalBg: {
    flex: 1,
    backgroundColor: '#000000bb',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: RPG.surface,
    borderTopWidth: 2,
    borderTopColor: RPG.gold,
    maxHeight: '75%',
  },
  detailContent: {
    padding: 16,
    paddingBottom: 32,
  },
  detailHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 12,
  },
  detailName: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  detailMeta: {
    color: RPG.textMuted,
    fontSize: 12,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: RPG.textMuted,
    fontSize: 18,
  },
  detailStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: RPG.border,
    backgroundColor: RPG.surfaceAlt,
    borderRadius: 4,
  },
  pillLabel: {
    color: RPG.textMuted,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillValue: {
    color: RPG.text,
    fontSize: 13,
    fontWeight: '600',
  },
  detailEffect: {
    color: RPG.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  importRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  importBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: RPG.gold,
    alignItems: 'center',
    backgroundColor: RPG.surfaceAlt,
  },
  importBtnAlt: {
    borderColor: RPG.azulLight,
  },
  importBtnText: {
    color: RPG.gold,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  feedback: {
    marginTop: 10,
    color: RPG.verdeLight,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
