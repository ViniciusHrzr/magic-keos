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

  const slotCount = Math.max(5, selected.length + 1);

  const openModal = (i: number) => {
    setSearch('');
    setActiveSlot(i);
  };

  const closeModal = () => setActiveSlot(null);

  const pick = (key: string) => {
    if (activeSlot === null) return;
    const currentInSlot = activeSlot < selected.length ? selected[activeSlot] : undefined;

    if (key === currentInSlot) {
      const next = [...selected];
      next.splice(activeSlot, 1);
      onChange(next);
    } else {
      let next = [...selected];
      const existingIdx = next.indexOf(key);
      if (existingIdx !== -1) next.splice(existingIdx, 1);
      const adjustedSlot =
        existingIdx !== -1 && existingIdx < activeSlot ? activeSlot - 1 : activeSlot;
      if (adjustedSlot < next.length) {
        next[adjustedSlot] = key;
      } else {
        next.push(key);
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

  const getSlotDisplay = (key: string) => {
    const colonIdx = key.indexOf(':');
    const pk = key.slice(0, colonIdx) as PericiaKey;
    const nome = key.slice(colonIdx + 1);
    const ordem = periciaOrdem.find(o => o.periciaKey === pk);
    const data = ordem ? proficiencias[ordem.instancia][pk] : undefined;
    return { periLabel: data?.label ?? pk, nome };
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const results: Array<{
      instancia: InstanciaKey;
      periciaKey: PericiaKey;
      label: string;
      profs: Array<{ nome: string; descricao: string }>;
    }> = [];
    for (const { instancia, periciaKey } of periciaOrdem) {
      const data = proficiencias[instancia][periciaKey];
      if (!data) continue;
      const profs = q
        ? data.proficiencias.filter(
            p =>
              p.nome.toLowerCase().includes(q) ||
              data.label.toLowerCase().includes(q),
          )
        : data.proficiencias;
      if (!profs.length) continue;
      results.push({ instancia, periciaKey, label: data.label, profs });
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
                  <Text style={[styles.badgeNum, key ? styles.badgeNumFilled : styles.badgeNumEmpty]}>
                    {i + 1}
                  </Text>
                </View>
                {disp ? (
                  <View style={styles.slotContent}>
                    <Text style={styles.slotPeriLabel}>{disp.periLabel}</Text>
                    <Text style={styles.slotName} numberOfLines={1}>{disp.nome}</Text>
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
            <Text style={styles.modalTitle}>
              {modalCurrentKey ? 'Trocar Proficiência' : 'Escolher Proficiência'}
            </Text>
            <TouchableOpacity onPress={closeModal} hitSlop={12}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
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
            {filtered.map(section => (
              <View key={section.periciaKey}>
                <View style={styles.periHeader}>
                  <Text style={styles.periInstancia}>{INSTANCIA_LABEL[section.instancia]}</Text>
                  <Text style={styles.periLabel}>{section.label}</Text>
                </View>
                {section.profs.map(prof => {
                  const key = `${section.periciaKey}:${prof.nome}`;
                  const isCurrent = key === modalCurrentKey;
                  const isElsewhere = selected.includes(key) && !isCurrent;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.profRow,
                        isCurrent && styles.profRowCurrent,
                        isElsewhere && styles.profRowElsewhere,
                      ]}
                      onPress={() => pick(key)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.profInfo}>
                        <Text
                          style={[
                            styles.profName,
                            isCurrent && styles.profNameCurrent,
                            isElsewhere && styles.profNameElsewhere,
                          ]}
                        >
                          {prof.nome}
                        </Text>
                        <Text style={[styles.profDesc, isElsewhere && styles.profDescElsewhere]}>
                          {prof.descricao}
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
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  slotFilled: {
    borderColor: RPG.gold,
    backgroundColor: RPG.surfaceAlt,
  },
  slotEmpty: {
    borderColor: RPG.border,
    backgroundColor: 'transparent',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeFilled: {
    backgroundColor: RPG.goldDim,
  },
  badgeEmpty: {
    backgroundColor: RPG.border,
  },
  badgeNum: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeNumFilled: {
    color: RPG.goldLight,
  },
  badgeNumEmpty: {
    color: RPG.textMuted,
  },
  slotContent: {
    flex: 1,
  },
  slotPeriLabel: {
    fontSize: 9,
    color: RPG.textMuted,
    letterSpacing: 0.4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  slotName: {
    fontSize: 12,
    color: RPG.goldLight,
    fontWeight: '600',
    marginTop: 1,
  },
  slotPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: RPG.textDark,
    fontStyle: 'italic',
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    color: RPG.textDark,
    fontSize: 12,
  },

  // Modal
  modal: {
    flex: 1,
    backgroundColor: RPG.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RPG.gold,
    letterSpacing: 0.5,
  },
  modalClose: {
    fontSize: 16,
    color: RPG.textMuted,
  },
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
  list: {
    flex: 1,
  },
  periHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 6,
  },
  periInstancia: {
    fontSize: 8,
    fontWeight: '700',
    color: RPG.textDark,
    letterSpacing: 0.8,
    backgroundColor: RPG.surfaceAlt,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: RPG.border,
  },
  periLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: RPG.gold,
    letterSpacing: 0.3,
  },
  profRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border + '55',
    gap: 10,
  },
  profRowCurrent: {
    backgroundColor: RPG.goldDim + '22',
  },
  profRowElsewhere: {
    opacity: 0.45,
  },
  profInfo: {
    flex: 1,
    gap: 3,
  },
  profName: {
    fontSize: 13,
    color: RPG.text,
    fontWeight: '600',
  },
  profNameCurrent: {
    color: RPG.goldLight,
  },
  profNameElsewhere: {
    color: RPG.textMuted,
  },
  profDesc: {
    fontSize: 11,
    color: RPG.textMuted,
    lineHeight: 15,
  },
  profDescElsewhere: {
    color: RPG.textDark,
  },
  checkMark: {
    fontSize: 16,
    color: RPG.gold,
    fontWeight: '700',
  },
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
  },
  listBottom: {
    height: 40,
  },
});
