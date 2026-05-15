import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { grimoire, domains, Spell, SpellColor, SpellType } from '@/data/grimoire';
import { RPG } from '@/constants/theme';
import { useCharacter } from '@/store/CharacterContext';
import spellImages from '@/data/spellImages';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';

const COLOR_LABELS: Record<SpellColor, string> = {
  branco: 'Branco', verde: 'Verde', vermelho: 'Vermelho', preto: 'Preto', azul: 'Azul',
};
const TYPE_LABELS_SHORT: Record<SpellType, string> = {
  '[T]': 'Truque', '[E]': 'Encantamento', '[F]': 'Feitiço', '[C]': 'Criatura',
};
const COLORS: SpellColor[] = ['branco', 'verde', 'vermelho', 'preto', 'azul'];
const TYPES: SpellType[] = ['[T]', '[E]', '[F]', '[C]'];

const TYPE_LABELS: Record<SpellType, string> = {
  '[T]': 'Truque',
  '[E]': 'Encantamento',
  '[F]': 'Feitiço',
  '[C]': 'Criatura',
};

type DomainGroup = {
  name: string;
  spells: Spell[];
  color: SpellColor;
};

export default function GrimorioScreen() {
  const { character: c, setDominio, setMagica, isLoaded } = useCharacter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeColor, setActiveColor] = useState<SpellColor | null>(null);
  const [activeGrau, setActiveGrau] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<SpellType | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Spell | null>(null);

  const domainGroups = useMemo<DomainGroup[]>(() =>
    domains.map(d => ({
      name: d,
      spells: grimoire.filter(s => s.dominio === d),
      color: grimoire.find(s => s.dominio === d)!.cor,
    })),
    []
  );

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    return domainGroups
      .map(g => ({
        ...g,
        spells: g.spells.filter(s => {
          if (activeColor && s.cor !== activeColor) return false;
          if (activeGrau !== null && s.grau !== activeGrau) return false;
          if (activeType && s.tipo !== activeType) return false;
          if (q && !s.nome.toLowerCase().includes(q) && !g.name.toLowerCase().includes(q)) return false;
          return true;
        }),
      }))
      .filter(g => g.spells.length > 0);
  }, [search, activeColor, activeGrau, activeType, domainGroups]);

  const toggleDomain = useCallback((name: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }, []);

  const addDomainToFicha = useCallback((name: string) => {
    if (c.dominios.some(d => d.trim() === name)) return;
    const idx = c.dominios.findIndex(d => !d.trim());
    if (idx === -1) return;
    setDominio(idx, name);
  }, [c.dominios, setDominio]);

  const renderDomain = useCallback(({ item }: { item: DomainGroup }) => {
    const isOpen = expanded.has(item.name);
    const colorHex = COLOR_HEX[item.color];
    const inFicha = c.dominios.some(d => d.trim() === item.name);
    return (
      <View style={styles.domainBlock}>
        <TouchableOpacity style={styles.domainRow} onPress={() => toggleDomain(item.name)} activeOpacity={0.75}>
          <View style={[styles.colorStrip, { backgroundColor: colorHex }]} />
          <Text style={[styles.domainName, { color: colorHex }]} numberOfLines={1}>{item.name}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{item.spells.length}</Text>
          </View>
          <Text style={[styles.chevron, { color: colorHex }]}>{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {isOpen && (
          <>
            <TouchableOpacity
              style={[styles.addDominioRow, inFicha && styles.addDominioRowDone]}
              onPress={() => addDomainToFicha(item.name)}
              activeOpacity={inFicha ? 1 : 0.7}
              disabled={inFicha}
            >
              <Text style={[styles.addDominioText, inFicha && styles.addDominioTextDone]}>
                {inFicha ? '✓ Domínio já está na ficha' : '+ Adicionar Domínio à ficha'}
              </Text>
            </TouchableOpacity>
            {item.spells.map((s, i) => (
              <TouchableOpacity key={i} style={styles.spellRow} onPress={() => setSelected(s)} activeOpacity={0.75}>
                <View style={[styles.grauBadge, { borderColor: GRAU_COLORS[s.grau] }]}>
                  <Text style={[styles.grauText, { color: GRAU_COLORS[s.grau] }]}>{s.grau}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.spellName} numberOfLines={1}>{s.nome}</Text>
                  <Text style={styles.spellMeta}>{TYPE_LABELS[s.tipo]} · {s.atributo}</Text>
                </View>
                <Text style={styles.spellCusto}>{s.custo || '—'}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    );
  }, [expanded, toggleDomain, c.dominios, addDomainToFicha]);

  if (!isLoaded) return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;

  return (
    <ErrorBoundary>
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Grimório</Text>
        <Text style={styles.count}>{grimoire.length} mágicas · {domains.length} domínios</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar domínio ou mágica..."
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
            <Text style={[styles.filterText2, activeGrau === g && { color: RPG.gold }]}>Grau {g}</Text>
          </TouchableOpacity>
        ))}
        {TYPES.map(t => (
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
        data={filteredGroups}
        keyExtractor={item => item.name}
        renderItem={renderDomain}
        extraData={expanded}
        contentContainerStyle={styles.list}
        initialNumToRender={30}
      />

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { paddingBottom: insets.bottom }]}>
            {selected && (
              <SpellDetail
                spell={selected}
                onClose={() => setSelected(null)}
                magicas={c.magicas}
                onAddMagica={setMagica}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </ErrorBoundary>
  );
}

function SpellDetail({ spell, onClose, magicas, onAddMagica }: {
  spell: Spell;
  onClose: () => void;
  magicas: string[];
  onAddMagica: (idx: number, v: string) => void;
}) {
  const [feedback, setFeedback] = useState('');
  const color = COLOR_HEX[spell.cor];

  const addMagica = () => {
    const idx = magicas.findIndex(m => !m.trim());
    if (idx === -1) {
      setFeedback('Todos os slots de mágicas estão cheios!');
    } else {
      onAddMagica(idx, spell.nome);
      setFeedback(`"${spell.nome}" adicionada às mágicas!`);
    }
  };

  const img = spellImages[spell.nome];

  return (
    <ScrollView contentContainerStyle={styles.detailContent}>
      <View style={[styles.detailHeader, { borderBottomColor: color }]}>
        {img && (
          <Image source={img} style={styles.spellImg} resizeMode="contain" />
        )}
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
      <View style={styles.importRow}>
        <TouchableOpacity style={[styles.importBtn, styles.importBtnAlt]} onPress={addMagica} activeOpacity={0.75}>
          <Text style={[styles.importBtnText, { color: RPG.azulLight }]}>+ Mágica</Text>
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
  count: { color: RPG.textMuted, fontSize: 12 },

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
  filterText: { fontSize: 12, fontWeight: '600' },
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
  filterText2: { fontSize: 11, color: RPG.textMuted },

  list: { paddingBottom: 16 },

  domainBlock: {
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RPG.surface,
    paddingVertical: 12,
    paddingRight: 14,
    gap: 10,
  },
  colorStrip: {
    width: 4,
    alignSelf: 'stretch',
  },
  domainName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'serif',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: RPG.surfaceAlt,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  countText: { color: RPG.textMuted, fontSize: 11 },
  chevron: { fontSize: 10, fontWeight: 'bold' },

  addDominioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: RPG.surfaceAlt,
    borderTopWidth: 1,
    borderTopColor: RPG.goldDim,
  },
  addDominioRowDone: {
    borderTopColor: RPG.border,
  },
  addDominioText: {
    color: RPG.gold,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  addDominioTextDone: {
    color: RPG.textMuted,
  },

  spellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RPG.bg,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: RPG.border,
    gap: 10,
  },
  grauBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grauText: { fontSize: 10, fontWeight: 'bold' },
  spellName: { color: RPG.text, fontSize: 13, fontWeight: '600' },
  spellMeta: { color: RPG.textMuted, fontSize: 11 },
  spellCusto: {
    fontFamily: 'PlanewalkerDings',
    fontStyle: 'normal',
    fontSize: 14,
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
  pillValue: { color: RPG.text, fontSize: 13, fontWeight: '600' },
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
