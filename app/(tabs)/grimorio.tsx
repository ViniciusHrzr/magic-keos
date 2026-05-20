import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { grimoire, domains, Spell, SpellColor, SpellType } from '@/data/grimoire';
import { RPG } from '@/constants/theme';
import { useCharacter } from '@/store/CharacterContext';
import spellImages from '@/data/spellImages';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';
import StatPill from '@/components/rpg/StatPill';
import SpellDetailCard from '@/components/rpg/SpellDetailCard';

const COLOR_PIP: Record<SpellColor, string> = {
  branco: 'a', verde: 'g', vermelho: 'd', preto: 'b', azul: 'u',
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

type FlatItem =
  | { type: 'domain-header'; domain: DomainGroup }
  | { type: 'add-domain';    domain: DomainGroup }
  | { type: 'spell';         spell: Spell; domainColor: SpellColor };

function buildFlatItems(groups: DomainGroup[], expanded: Set<string>): FlatItem[] {
  const items: FlatItem[] = [];
  for (const domain of groups) {
    items.push({ type: 'domain-header', domain });
    if (expanded.has(domain.name)) {
      items.push({ type: 'add-domain', domain });
      for (const spell of domain.spells) {
        items.push({ type: 'spell', spell, domainColor: domain.color });
      }
    }
  }
  return items;
}

let _search = '';
let _activeColor: SpellColor | null = null;
let _activeGrau: number | null = null;
let _activeType: SpellType | null = null;

export default function GrimorioScreen() {
  const { character: c, setDominio, setMagica, isLoaded } = useCharacter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState(_search);
  const [activeColor, setActiveColor] = useState<SpellColor | null>(_activeColor);
  const [activeGrau, setActiveGrau] = useState<number | null>(_activeGrau);
  const [activeType, setActiveType] = useState<SpellType | null>(_activeType);
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

  const renderItem = useCallback(({ item }: { item: FlatItem }) => {
    if (item.type === 'domain-header') {
      const { domain } = item;
      const isOpen = expanded.has(domain.name);
      const colorHex = COLOR_HEX[domain.color];
      return (
        <View style={styles.domainBlock}>
          <TouchableOpacity style={styles.domainRow} onPress={() => toggleDomain(domain.name)} activeOpacity={0.75}>
            <View style={[styles.colorStrip, { backgroundColor: colorHex }]} />
            <Text style={[styles.domainName, { color: colorHex }]} numberOfLines={1}>{domain.name}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{domain.spells.length}</Text>
            </View>
            <Text style={[styles.chevron, { color: colorHex }]}>{isOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === 'add-domain') {
      const { domain } = item;
      const inFicha = c.dominios.some(d => d.trim() === domain.name);
      return (
        <TouchableOpacity
          style={[styles.addDominioRow, inFicha && styles.addDominioRowDone]}
          onPress={() => addDomainToFicha(domain.name)}
          activeOpacity={inFicha ? 1 : 0.7}
          disabled={inFicha}
        >
          <Text style={[styles.addDominioText, inFicha && styles.addDominioTextDone]}>
            {inFicha ? '✓ Domínio já está na ficha' : '+ Adicionar Domínio à ficha'}
          </Text>
        </TouchableOpacity>
      );
    }
    // type === 'spell'
    const { spell } = item;
    return (
      <TouchableOpacity style={styles.spellRow} onPress={() => setSelected(spell)} activeOpacity={0.75}>
        <View style={[styles.grauBadge, { borderColor: GRAU_COLORS[spell.grau] }]}>
          <Text style={[styles.grauText, { color: GRAU_COLORS[spell.grau] }]}>{spell.grau}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.spellName} numberOfLines={1}>{spell.nome}</Text>
          <Text style={styles.spellMeta}>{TYPE_LABELS[spell.tipo]} · {spell.atributo}</Text>
        </View>
        <Text style={styles.spellCusto}>{spell.custo || '—'}</Text>
      </TouchableOpacity>
    );
  }, [expanded, toggleDomain, c.dominios, addDomainToFicha]);
  // setSelected é estável via useState — omitido intencionalmente do dep array

  const flatItems = useMemo(
    () => buildFlatItems(filteredGroups, expanded),
    [filteredGroups, expanded]
  );

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
          onChangeText={v => { _search = v; setSearch(v); }}
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
            style={[styles.pipBtn, { borderColor: COLOR_HEX[c] }, activeColor === c && { backgroundColor: COLOR_HEX[c] + '33' }]}
            onPress={() => { const next = activeColor === c ? null : c; _activeColor = next; setActiveColor(next); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.pipText, { color: COLOR_HEX[c] }]}>{COLOR_PIP[c]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grau + Type filters */}
      <View style={styles.filters}>
        {[0, 1, 2, 3].map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.filterBtn2, activeGrau === g && styles.filterBtn2Active]}
            onPress={() => { const next = activeGrau === g ? null : g; _activeGrau = next; setActiveGrau(next); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText2, activeGrau === g && { color: RPG.gold }]}>Grau {g}</Text>
          </TouchableOpacity>
        ))}
        {TYPES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.filterBtn2, activeType === t && styles.filterBtn2Active]}
            onPress={() => { const next = activeType === t ? null : t; _activeType = next; setActiveType(next); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText2, activeType === t && { color: RPG.gold }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlashList
        data={flatItems}
        renderItem={renderItem}
        keyExtractor={(item) => {
          if (item.type === 'domain-header') return `hdr-${item.domain.name}`;
          if (item.type === 'add-domain') return `add-${item.domain.name}`;
          return `spell-${item.spell.nome}-${item.spell.dominio}`;
        }}
        drawDistance={500}
        extraData={expanded}
        contentContainerStyle={styles.list}
      />

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { paddingBottom: insets.bottom }]}>
            {selected && (
              <SpellDetailCard
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
  pipBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipText: {
    fontFamily: 'PlanewalkerDings',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 24,
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
  filterText2: { fontSize: 11, color: RPG.textMuted },

  list: { paddingBottom: 16 },

  domainBlock: {},
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RPG.surface,
    paddingVertical: 12,
    paddingRight: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
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
});
