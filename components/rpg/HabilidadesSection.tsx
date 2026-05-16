import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  TextInput, ScrollView, SafeAreaView,
} from 'react-native';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import { habilidades, INSTANCIA_LABEL, TIPO_LABEL, InstanciaKey, TipoHabilidade } from '@/data/habilidades';

interface Props {
  selected: string[];
  onChange: (v: string[]) => void;
}

const TIPO_COLOR: Record<TipoHabilidade, string> = {
  passiva: RPG.textDark,
  reacao: RPG.gold,
  acao_livre: RPG.verdeLight,
};

const INSTANCIA_ORDER: InstanciaKey[] = ['corpo', 'mente', 'espirito'];

export default function HabilidadesSection({ selected, onChange }: Props) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const slotCount = Math.max(3, selected.length + 1);

  const openModal = (i: number) => {
    setSearch('');
    setActiveSlot(i);
  };

  const closeModal = () => setActiveSlot(null);

  const pick = (nome: string) => {
    if (activeSlot === null) return;
    const currentInSlot = activeSlot < selected.length ? selected[activeSlot] : undefined;

    if (nome === currentInSlot) {
      const next = [...selected];
      next.splice(activeSlot, 1);
      onChange(next);
    } else {
      let next = [...selected];
      const existingIdx = next.indexOf(nome);
      if (existingIdx !== -1) next.splice(existingIdx, 1);
      const adjustedSlot =
        existingIdx !== -1 && existingIdx < activeSlot ? activeSlot - 1 : activeSlot;
      if (adjustedSlot < next.length) {
        next[adjustedSlot] = nome;
      } else {
        next.push(nome);
      }
      onChange(next);
    }
    closeModal();
  };

  const clearSlot = (i: number) => {
    const next = [...selected];
    next.splice(i, 1);
    onChange(next);
  };

  const getHabilidade = (nome: string) =>
    habilidades.find(h => h.nome === nome);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = q
      ? habilidades.filter(
          h =>
            h.nome.toLowerCase().includes(q) ||
            h.prerequisito.toLowerCase().includes(q) ||
            h.descricao.toLowerCase().includes(q),
        )
      : habilidades;

    const groups: Partial<Record<InstanciaKey, typeof habilidades>> = {};
    for (const h of list) {
      if (!groups[h.instancia]) groups[h.instancia] = [];
      groups[h.instancia]!.push(h);
    }
    return INSTANCIA_ORDER.map(inst => ({
      instancia: inst,
      habs: groups[inst] ?? [],
    })).filter(g => g.habs.length > 0);
  }, [search]);

  const modalCurrentName =
    activeSlot !== null && activeSlot < selected.length ? selected[activeSlot] : undefined;

  return (
    <>
      <SectionHeader title="Habilidades" />
      <View style={styles.container}>
        {Array.from({ length: slotCount }, (_, i) => {
          const nome = i < selected.length ? selected[i] : null;
          const hab = nome ? getHabilidade(nome) : null;
          return (
            <View key={i} style={styles.slotRow}>
              <TouchableOpacity
                style={[styles.slot, hab ? styles.slotFilled : styles.slotEmpty]}
                onPress={() => openModal(i)}
                activeOpacity={0.7}
              >
                <View style={[styles.badge, hab ? styles.badgeFilled : styles.badgeEmpty]}>
                  <Text style={[styles.badgeNum, hab ? styles.badgeNumFilled : styles.badgeNumEmpty]}>
                    {i + 1}
                  </Text>
                </View>
                {hab ? (
                  <View style={styles.slotContent}>
                    <View style={styles.slotNameRow}>
                      <Text style={styles.slotInstancia}>{INSTANCIA_LABEL[hab.instancia]}</Text>
                      <View style={[styles.tipoTag, { borderColor: TIPO_COLOR[hab.tipo] + '88' }]}>
                        <Text style={[styles.tipoText, { color: TIPO_COLOR[hab.tipo] }]}>
                          {TIPO_LABEL[hab.tipo]}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.slotName} numberOfLines={1}>{hab.nome}</Text>
                    <Text style={styles.slotDesc} numberOfLines={2}>{hab.descricao}</Text>
                  </View>
                ) : (
                  <Text style={styles.slotPlaceholder}>Toque para selecionar…</Text>
                )}
              </TouchableOpacity>
              {hab && (
                <TouchableOpacity style={styles.clearBtn} onPress={() => clearSlot(i)} hitSlop={8}>
                  <Text style={styles.clearText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      <Modal visible={activeSlot !== null} animationType="slide" onRequestClose={closeModal}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalCurrentName ? 'Trocar Habilidade' : 'Escolher Habilidade'}
            </Text>
            <TouchableOpacity onPress={closeModal} hitSlop={12}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrap}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar habilidade ou pré-requisito…"
              placeholderTextColor={RPG.textMuted}
              value={search}
              onChangeText={setSearch}
              autoFocus
              returnKeyType="search"
            />
          </View>

          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {filtered.map(group => (
              <View key={group.instancia}>
                <View style={styles.instanciaHeader}>
                  <Text style={styles.instanciaLabel}>{INSTANCIA_LABEL[group.instancia]}</Text>
                </View>
                {group.habs.map(hab => {
                  const isCurrent = hab.nome === modalCurrentName;
                  const isElsewhere = selected.includes(hab.nome) && !isCurrent;
                  return (
                    <TouchableOpacity
                      key={hab.nome}
                      style={[
                        styles.habRow,
                        isCurrent && styles.habRowCurrent,
                        isElsewhere && styles.habRowElsewhere,
                      ]}
                      onPress={() => pick(hab.nome)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.habInfo}>
                        <View style={styles.habNameRow}>
                          <Text
                            style={[
                              styles.habName,
                              isCurrent && styles.habNameCurrent,
                              isElsewhere && styles.habNameElsewhere,
                            ]}
                          >
                            {hab.nome}
                          </Text>
                          <View style={[styles.tipoTag, { borderColor: TIPO_COLOR[hab.tipo] + '88' }]}>
                            <Text style={[styles.tipoText, { color: TIPO_COLOR[hab.tipo] }]}>
                              {TIPO_LABEL[hab.tipo]}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.metaRow}>
                          <Text style={styles.metaLabel}>PRÉ-REQ </Text>
                          <Text style={styles.metaValue}>{hab.prerequisito}</Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaLabel}>CUSTO </Text>
                          <Text style={styles.metaValue}>{hab.custo}</Text>
                        </View>

                        <Text style={[styles.habDesc, isElsewhere && styles.habDescElsewhere]}>
                          {hab.descricao}
                        </Text>
                      </View>
                      {isCurrent && <Text style={styles.checkMark}>✓</Text>}
                      {isElsewhere && <Text style={styles.elsewhereTag}>em uso</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
            <View style={styles.listBottom} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: RPG.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  slotRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  slot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  slotFilled: { borderColor: RPG.gold, backgroundColor: RPG.surfaceAlt },
  slotEmpty: { borderColor: RPG.border, backgroundColor: 'transparent' },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  badgeFilled: { backgroundColor: RPG.goldDim },
  badgeEmpty: { backgroundColor: RPG.border },
  badgeNum: { fontSize: 10, fontWeight: '700' },
  badgeNumFilled: { color: RPG.goldLight },
  badgeNumEmpty: { color: RPG.textMuted },
  slotContent: { flex: 1, gap: 2 },
  slotNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  slotInstancia: {
    fontSize: 8,
    color: RPG.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tipoTag: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  tipoText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.4 },
  slotName: { fontSize: 12, color: RPG.goldLight, fontWeight: '600' },
  slotDesc: { fontSize: 10, color: RPG.textMuted, lineHeight: 14, marginTop: 2 },
  slotTesteRow: { flexDirection: 'row', marginTop: 2 },
  slotTesteLabel: { fontSize: 9, color: RPG.gold, fontWeight: '700', letterSpacing: 0.5 },
  slotTesteValue: { fontSize: 9, color: RPG.textMuted, flex: 1 },
  slotPlaceholder: { flex: 1, fontSize: 12, color: RPG.textDark, fontStyle: 'italic', marginTop: 2 },
  clearBtn: { padding: 4, marginTop: 2 },
  clearText: { color: RPG.textDark, fontSize: 12 },

  // Modal
  modal: { flex: 1, backgroundColor: RPG.bg },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: RPG.gold, letterSpacing: 0.5 },
  modalClose: { fontSize: 16, color: RPG.textMuted },
  searchWrap: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  searchInput: {
    backgroundColor: RPG.surfaceAlt,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: RPG.text,
  },
  list: { flex: 1 },
  instanciaHeader: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  instanciaLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: RPG.gold,
    letterSpacing: 1.2,
  },
  habRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border + '44',
    gap: 10,
  },
  habRowCurrent: { backgroundColor: RPG.goldDim + '22' },
  habRowElsewhere: { opacity: 0.4 },
  habInfo: { flex: 1, gap: 4 },
  habNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  habName: { fontSize: 14, color: RPG.text, fontWeight: '700' },
  habNameCurrent: { color: RPG.goldLight },
  habNameElsewhere: { color: RPG.textMuted },
  metaRow: { flexDirection: 'row' },
  metaLabel: { fontSize: 9, color: RPG.gold, fontWeight: '700', letterSpacing: 0.6 },
  metaValue: { fontSize: 9, color: RPG.textMuted, flex: 1 },
  habDesc: { fontSize: 11, color: RPG.textMuted, lineHeight: 16 },
  habDescElsewhere: { color: RPG.textDark },
  testeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  testeLabel: { fontSize: 9, color: RPG.gold, fontWeight: '700', letterSpacing: 0.6 },
  testeValue: { fontSize: 9, color: RPG.textMuted, flex: 1 },
  checkMark: { fontSize: 16, color: RPG.gold, fontWeight: '700', marginTop: 4 },
  elsewhereTag: {
    fontSize: 9,
    color: RPG.textDark,
    fontWeight: '600',
    letterSpacing: 0.4,
    borderWidth: 1,
    borderColor: RPG.border,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 4,
  },
  listBottom: { height: 40 },
});
