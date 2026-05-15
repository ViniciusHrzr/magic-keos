import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  TextInput, ScrollView, SafeAreaView,
} from 'react-native';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import { proficiencias, periciaOrdem, PericiaKey, InstanciaKey } from '@/data/proficiencias';

interface Props {
  selected: string[];
  onChange: (v: string[]) => void;
}

const INSTANCIA_LABEL: Record<InstanciaKey, string> = {
  corpo: 'CORPO',
  mente: 'MENTE',
  espirito: 'ESPÍRITO',
};

export default function ProficienciasSection({ selected, onChange }: Props) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<PericiaKey>>(new Set());

  const slotCount = Math.max(5, selected.length + 1);

  const openModal = (i: number) => { setSearch(''); setActiveSlot(i); };
  const closeModal = () => setActiveSlot(null);

  const toggleSection = (pk: PericiaKey) =>
    setExpanded(prev => {
      const n = new Set(prev);
      n.has(pk) ? n.delete(pk) : n.add(pk);
      return n;
    });

  const pick = (key: string) => {
    if (activeSlot === null) return;
    const currentInSlot = activeSlot < selected.length ? selected[activeSlot] : undefined;
    if (key === currentInSlot) {
      const next = [...selected]; next.splice(activeSlot, 1); onChange(next);
    } else {
      let next = [...selected];
      const ei = next.indexOf(key);
      if (ei !== -1) next.splice(ei, 1);
      const adj = ei !== -1 && ei < activeSlot ? activeSlot - 1 : activeSlot;
      if (adj < next.length) next[adj] = key; else next.push(key);
      onChange(next);
    }
    closeModal();
  };

  const clearSlot = (i: number) => {
    const next = [...selected]; next.splice(i, 1); onChange(next);
  };

  const getSlotDisplay = (key: string) => {
    const ci = key.indexOf(':');
    const pk = key.slice(0, ci) as PericiaKey;
    const nome = key.slice(ci + 1);
    const ordem = periciaOrdem.find(o => o.periciaKey === pk);
    const data = ordem ? proficiencias[ordem.instancia][pk] : undefined;
    const prof = data?.proficiencias.find(p => p.nome === nome);
    return { periLabel: data?.label ?? pk, nome, descricao: prof?.descricao, teste: prof?.teste };
  };

  const isSearching = search.trim().length > 0;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const results: Array<{
      instancia: InstanciaKey; periciaKey: PericiaKey; label: string; descricao: string;
      profs: Array<{ nome: string; descricao: string; teste: string; requisito?: string }>;
    }> = [];
    for (const { instancia, periciaKey } of periciaOrdem) {
      const data = proficiencias[instancia][periciaKey];
      if (!data) continue;
      const profs = q
        ? data.proficiencias.filter(p => p.nome.toLowerCase().includes(q) || data.label.toLowerCase().includes(q))
        : data.proficiencias;
      if (!profs.length) continue;
      results.push({ instancia, periciaKey, label: data.label, descricao: data.descricao, profs });
    }
    return results;
  }, [search]);

  const modalCurrentKey =
    activeSlot !== null && activeSlot < selected.length ? selected[activeSlot] : undefined;

  return (
    <>
      <SectionHeader title="Proficiências" />
      <View style={styles.container}>
        {Array.from({ length: slotCount }, (_, i) => {
          const key = i < selected.length ? selected[i] : null;
          const disp = key ? getSlotDisplay(key) : null;
          return (
            <View key={i} style={styles.slotRow}>
              <TouchableOpacity
                style={[styles.slot, key ? styles.slotFilled : styles.slotEmpty]}
                onPress={() => openModal(i)}
                activeOpacity={0.7}
              >
                <View style={[styles.badge, key ? styles.badgeFilled : styles.badgeEmpty]}>
                  <Text style={[styles.badgeNum, key ? styles.badgeNumFilled : styles.badgeNumEmpty]}>{i + 1}</Text>
                </View>
                {disp ? (
                  <View style={styles.slotContent}>
                    <Text style={styles.slotPeriLabel}>{disp.periLabel}</Text>
                    <Text style={styles.slotName} numberOfLines={1}>{disp.nome}</Text>
                    {disp.descricao && <Text style={styles.slotDesc} numberOfLines={2}>{disp.descricao}</Text>}
                    {disp.teste && (
                      <View style={styles.slotTesteRow}>
                        <Text style={styles.slotTesteLabel}>TESTE </Text>
                        <Text style={styles.slotTesteValue} numberOfLines={1}>{disp.teste}</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text style={styles.slotPlaceholder}>Toque para selecionar…</Text>
                )}
              </TouchableOpacity>
              {key && (
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
            <Text style={styles.modalTitle}>{modalCurrentKey ? 'Trocar Proficiência' : 'Escolher Proficiência'}</Text>
            <TouchableOpacity onPress={closeModal} hitSlop={12}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
          </View>

          <View style={styles.searchWrap}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar proficiência ou perícia…"
              placeholderTextColor={RPG.textMuted}
              value={search}
              onChangeText={setSearch}
              autoFocus
              returnKeyType="search"
            />
          </View>

          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {filtered.map(section => {
              const isOpen = isSearching || expanded.has(section.periciaKey);
              return (
                <View key={section.periciaKey}>
                  <TouchableOpacity
                    style={styles.periHeader}
                    onPress={() => toggleSection(section.periciaKey)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.periHeaderLeft}>
                      <Text style={styles.periInstancia}>{INSTANCIA_LABEL[section.instancia]}</Text>
                      <Text style={styles.periLabel}>{section.label}</Text>
                    </View>
                    <Text style={styles.periChevron}>{isOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.periBody}>
                      <Text style={styles.periDescricao}>{section.descricao}</Text>
                      {section.profs.map(prof => {
                        const key = `${section.periciaKey}:${prof.nome}`;
                        const isCurrent = key === modalCurrentKey;
                        const isElsewhere = selected.includes(key) && !isCurrent;
                        return (
                          <TouchableOpacity
                            key={key}
                            style={[styles.profRow, isCurrent && styles.profRowCurrent, isElsewhere && styles.profRowElsewhere]}
                            onPress={() => pick(key)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.profInfo}>
                              <View style={styles.profNameRow}>
                                <Text style={[styles.profName, isCurrent && styles.profNameCurrent, isElsewhere && styles.profNameElsewhere]}>
                                  {prof.nome}
                                </Text>
                                {prof.requisito && (
                                  <View style={styles.reqTag}><Text style={styles.reqText}>{prof.requisito}</Text></View>
                                )}
                              </View>
                              <Text style={[styles.profDesc, isElsewhere && styles.profDescDim]}>{prof.descricao}</Text>
                              <View style={styles.testeRow}>
                                <Text style={styles.testeLabel}>TESTE </Text>
                                <Text style={styles.testeValue}>{prof.teste}</Text>
                              </View>
                            </View>
                            {isCurrent && <Text style={styles.checkMark}>✓</Text>}
                            {isElsewhere && <Text style={styles.elsewhereTag}>em uso</Text>}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: RPG.surface, paddingVertical: 8, paddingHorizontal: 12, gap: 6 },
  slotRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  slot: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6, borderWidth: 1 },
  slotFilled: { borderColor: RPG.gold, backgroundColor: RPG.surfaceAlt },
  slotEmpty: { borderColor: RPG.border, backgroundColor: 'transparent' },
  badge: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  badgeFilled: { backgroundColor: RPG.goldDim },
  badgeEmpty: { backgroundColor: RPG.border },
  badgeNum: { fontSize: 10, fontWeight: '700' },
  badgeNumFilled: { color: RPG.goldLight },
  badgeNumEmpty: { color: RPG.textMuted },
  slotContent: { flex: 1, gap: 2 },
  slotPeriLabel: { fontSize: 9, color: RPG.textMuted, letterSpacing: 0.4, fontWeight: '600', textTransform: 'uppercase' },
  slotName: { fontSize: 12, color: RPG.goldLight, fontWeight: '600' },
  slotDesc: { fontSize: 10, color: RPG.textMuted, lineHeight: 14, marginTop: 1 },
  slotTesteRow: { flexDirection: 'row', marginTop: 2 },
  slotTesteLabel: { fontSize: 9, color: RPG.gold, fontWeight: '700', letterSpacing: 0.5 },
  slotTesteValue: { fontSize: 9, color: RPG.textMuted, flex: 1 },
  slotPlaceholder: { flex: 1, fontSize: 12, color: RPG.textDark, fontStyle: 'italic', marginTop: 2 },
  clearBtn: { padding: 4, marginTop: 2 },
  clearText: { color: RPG.textDark, fontSize: 12 },

  modal: { flex: 1, backgroundColor: RPG.bg },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: RPG.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: RPG.gold, letterSpacing: 0.5 },
  modalClose: { fontSize: 16, color: RPG.textMuted },
  searchWrap: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: RPG.border },
  searchInput: { backgroundColor: RPG.surfaceAlt, borderWidth: 1, borderColor: RPG.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, color: RPG.text },
  list: { flex: 1 },

  periHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: RPG.border, backgroundColor: RPG.surfaceAlt },
  periHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  periInstancia: { fontSize: 8, fontWeight: '700', color: RPG.textDark, letterSpacing: 0.8, backgroundColor: RPG.bg, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, borderWidth: 1, borderColor: RPG.border },
  periLabel: { fontSize: 14, fontWeight: '700', color: RPG.gold },
  periChevron: { fontSize: 10, color: RPG.gold },
  periBody: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 0, backgroundColor: RPG.surface },
  periDescricao: { fontSize: 11, color: RPG.textMuted, lineHeight: 16, marginBottom: 8, fontStyle: 'italic' },

  profRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderTopWidth: 1, borderTopColor: RPG.border + '44', gap: 10 },
  profRowCurrent: { backgroundColor: RPG.goldDim + '22' },
  profRowElsewhere: { opacity: 0.4 },
  profInfo: { flex: 1, gap: 3 },
  profNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  profName: { fontSize: 13, color: RPG.text, fontWeight: '600' },
  profNameCurrent: { color: RPG.goldLight },
  profNameElsewhere: { color: RPG.textMuted },
  reqTag: { backgroundColor: RPG.surfaceAlt, borderWidth: 1, borderColor: RPG.border, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1 },
  reqText: { fontSize: 9, color: RPG.textMuted, fontWeight: '600' },
  profDesc: { fontSize: 11, color: RPG.textMuted, lineHeight: 15 },
  profDescDim: { color: RPG.textDark },
  testeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  testeLabel: { fontSize: 9, color: RPG.gold, fontWeight: '700', letterSpacing: 0.5 },
  testeValue: { fontSize: 9, color: RPG.textMuted, flex: 1 },
  checkMark: { fontSize: 16, color: RPG.gold, fontWeight: '700', marginTop: 2 },
  elsewhereTag: { fontSize: 9, color: RPG.textDark, fontWeight: '600', letterSpacing: 0.4, borderWidth: 1, borderColor: RPG.border, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 2, marginTop: 2 },
});
