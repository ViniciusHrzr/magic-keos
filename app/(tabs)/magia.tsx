import React, { useState, useMemo, useRef } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import NumericStepper from '@/components/rpg/NumericStepper';
import CheckboxGrid from '@/components/rpg/CheckboxGrid';
import CanalizacaoGrid from '@/components/rpg/CanalizacaoGrid';

import { grimoire, Spell, SpellColor } from '@/data/grimoire';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
import SpellDetailCard from '@/components/rpg/SpellDetailCard';
import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';

export default function MagiaScreen() {
  const {
    character: c,
    setVelocidade, setMemoria, setCanalizacao, setFoco,
    setDominio, setMagica, setReceitas,
    isLoaded,
  } = useCharacter();

  const insets = useSafeAreaInsets();

  const [viewSpell, setViewSpell] = useState<Spell | null>(null);
  const [viewDomain, setViewDomain] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const spellByName = (v: string) => grimoire.find(s => s.nome === v.trim());
  const isDomainName = (v: string) => v.trim() !== '' && grimoire.some(s => s.dominio === v.trim());
  const domainSpells = useMemo(
    () => viewDomain ? grimoire.filter(s => s.dominio === viewDomain) : [],
    [viewDomain],
  );

  const addToMemoria = (name: string) => {
    if (c.memoria.entries.some(e => e.trim() === name.trim())) {
      showToast(`"${name}" já está na Memória`);
      return;
    }
    const idx = c.memoria.entries.findIndex(e => !e.trim());
    if (idx === -1) { showToast('Memória cheia'); return; }
    const next = [...c.memoria.entries];
    next[idx] = name;
    setMemoria({ entries: next });
    showToast(`"${name}" adicionado à Memória`);
  };
  const addToFoco = (name: string) => {
    if (c.foco.entries.some(e => e.trim() === name.trim())) {
      showToast(`"${name}" já está no Foco`);
      return;
    }
    const idx = c.foco.entries.findIndex(e => !e.trim());
    if (idx === -1) { showToast('Foco cheio'); return; }
    const next = [...c.foco.entries];
    next[idx] = name;
    setFoco({ entries: next });
    showToast(`"${name}" adicionado ao Foco`);
  };

  if (!isLoaded) return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;

  return (
    <ErrorBoundary>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.titleBar}>
          <Text style={styles.title}>Ficha de Magia</Text>
        </View>

        {/* ── VELOCIDADE + CANALIZAÇÃO ── */}
        <View style={styles.twoCol}>
          {/* Velocidade */}
          <View style={{ flex: 1 }}>
            <SectionHeader title="Velocidade" />
            <View style={styles.balizRow}>
              <NumericStepper
                label="base"
                value={c.velocidade.base}
                onChange={v => setVelocidade({ base: v })}
                compact
              />
              <NumericStepper
                label="temp"
                value={c.velocidade.temp}
                onChange={v => setVelocidade({ temp: v })}
                compact
                color={RPG.textMuted}
              />
            </View>
            <View style={styles.gridWrap}>
              <CheckboxGrid
                boxes={c.velocidade.boxes}
                onChange={boxes => setVelocidade({ boxes })}
              />
            </View>
          </View>

          <View style={styles.colDivider} />

          {/* Canalização */}
          <View style={{ flex: 1 }}>
            <SectionHeader title="Canalização" />
            <View style={styles.balizRow}>
              <NumericStepper
                label="base"
                value={c.canalizacao.base}
                onChange={v => setCanalizacao({ base: v })}
                compact
              />
              <NumericStepper
                label="temp"
                value={c.canalizacao.temp}
                onChange={v => setCanalizacao({ temp: v })}
                compact
                color={RPG.textMuted}
              />
            </View>
            <View style={styles.gridWrap}>
              <CanalizacaoGrid
                boxes={c.canalizacao.boxes}
                onChange={boxes => setCanalizacao({ boxes })}
              />
            </View>
          </View>
        </View>

        {/* ── MEMÓRIA + FOCO ── */}
        <View style={styles.twoCol}>
          {/* Memória */}
          <View style={{ flex: 1 }}>
            <SectionHeader title="Memória" />
            <View style={styles.balizRow}>
              <NumericStepper
                label="base"
                value={c.memoria.base}
                onChange={v => setMemoria({ base: v })}
                compact
              />
              <NumericStepper
                label="temp"
                value={c.memoria.temp}
                onChange={v => setMemoria({ temp: v })}
                compact
                color={RPG.textMuted}
              />
            </View>
            <View style={[styles.gridWrap, { gap: 3 }]}>
              {c.memoria.entries.map((m, i) => {
                const spell = spellByName(m);
                return (
                  <View key={i} style={[styles.dominioCell, styles.memoDominioCell]}>
                    {spell && <View style={[styles.dominioColorStrip, { backgroundColor: COLOR_HEX[spell.cor] }]} />}
                    {spell && (
                      <View style={styles.magicaInfoBlock}>
                        <View style={[styles.grauBadge, { borderColor: GRAU_COLORS[spell.grau] }]}>
                          <Text style={[styles.grauText, { color: GRAU_COLORS[spell.grau] }]}>{spell.grau}</Text>
                        </View>
                        <Text style={styles.magicaTipo}>{spell.tipo}</Text>
                        {spell.custo ? <Text style={styles.magicaCusto}>{spell.custo}</Text> : null}
                      </View>
                    )}
                    <TextInput
                      style={[styles.dominioInput, styles.memoInput]}
                      value={m}
                      onChangeText={v => {
                        if (v.trim() && c.memoria.entries.some((e, j) => j !== i && e.trim() === v.trim())) return;
                        const next = [...c.memoria.entries]; next[i] = v; setMemoria({ entries: next });
                      }}
                      placeholder="feitiço..."
                      placeholderTextColor={RPG.textDark}
                      multiline
                    />
                    {spell && (
                      <TouchableOpacity style={styles.slotBtn} onPress={() => setViewSpell(spell)} activeOpacity={0.7}>
                        <Text style={styles.slotBtnSpell}>ℹ</Text>
                      </TouchableOpacity>
                    )}
                    {m.trim() !== '' && (
                      <TouchableOpacity style={styles.slotBtnClear} onPress={() => { const next = [...c.memoria.entries]; next[i] = ''; setMemoria({ entries: next }); }} activeOpacity={0.7}>
                        <Text style={styles.slotBtnClearText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.colDivider} />

          {/* Foco */}
          <View style={{ flex: 1 }}>
            <SectionHeader title="Foco" />
            <View style={styles.balizRow}>
              <NumericStepper
                label="base"
                value={c.foco.base}
                onChange={v => setFoco({ base: v })}
                compact
              />
              <NumericStepper
                label="temp"
                value={c.foco.temp}
                onChange={v => setFoco({ temp: v })}
                compact
                color={RPG.textMuted}
              />
            </View>
            <View style={[styles.gridWrap, { gap: 3 }]}>
              {c.foco.entries.map((m, i) => {
                const spell = spellByName(m);
                return (
                  <View key={i} style={[styles.dominioCell, styles.memoDominioCell]}>
                    {spell && <View style={[styles.dominioColorStrip, { backgroundColor: COLOR_HEX[spell.cor] }]} />}
                    {spell && (
                      <View style={styles.magicaInfoBlock}>
                        <View style={[styles.grauBadge, { borderColor: GRAU_COLORS[spell.grau] }]}>
                          <Text style={[styles.grauText, { color: GRAU_COLORS[spell.grau] }]}>{spell.grau}</Text>
                        </View>
                        <Text style={styles.magicaTipo}>{spell.tipo}</Text>
                        {spell.custo ? <Text style={styles.magicaCusto}>{spell.custo}</Text> : null}
                      </View>
                    )}
                    <TextInput
                      style={[styles.dominioInput, styles.memoInput]}
                      value={m}
                      onChangeText={v => {
                        if (v.trim() && c.foco.entries.some((e, j) => j !== i && e.trim() === v.trim())) return;
                        const next = [...c.foco.entries]; next[i] = v; setFoco({ entries: next });
                      }}
                      placeholder="permanente..."
                      placeholderTextColor={RPG.textDark}
                      multiline
                    />
                    {spell && (
                      <TouchableOpacity style={styles.slotBtn} onPress={() => setViewSpell(spell)} activeOpacity={0.7}>
                        <Text style={styles.slotBtnSpell}>ℹ</Text>
                      </TouchableOpacity>
                    )}
                    {m.trim() !== '' && (
                      <TouchableOpacity style={styles.slotBtnClear} onPress={() => { const next = [...c.foco.entries]; next[i] = ''; setFoco({ entries: next }); }} activeOpacity={0.7}>
                        <Text style={styles.slotBtnClearText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── DOMÍNIOS ── */}
        <SectionHeader title="Domínios" />
        <View style={styles.dominiosGrid}>
          {c.dominios.map((d, i) => {
            const spell = spellByName(d);
            const isDomain = !spell && isDomainName(d);
            return (
              <View key={i} style={[styles.dominioCell, i < 3 && styles.dominioInitial]}>
                {isDomain
                  ? <View style={[styles.dominioColorStrip, { backgroundColor: getDomainColor(d) ?? RPG.gold }]} />
                  : i < 3 && <Text style={styles.dominioInitialLabel}>inicial</Text>
                }
                <TextInput
                  style={styles.dominioInput}
                  value={d}
                  onChangeText={v => setDominio(i, v)}
                  placeholder={i < 3 ? `Domínio inicial ${i + 1}` : `Domínio ${i + 1}`}
                  placeholderTextColor={RPG.textDark}
                />
                {spell && (
                  <TouchableOpacity style={styles.slotBtn} onPress={() => setViewSpell(spell)} activeOpacity={0.7}>
                    <Text style={styles.slotBtnSpell}>ℹ</Text>
                  </TouchableOpacity>
                )}
                {isDomain && (
                  <TouchableOpacity style={styles.slotBtn} onPress={() => setViewDomain(d.trim())} activeOpacity={0.7}>
                    <Text style={styles.slotBtnDomain}>▼</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* ── MÁGICAS ── */}
        <SectionHeader title="Mágicas" />
        <View style={styles.dominiosGrid}>
          {c.magicas.map((m, i) => {
            const spell = spellByName(m);
            return (
              <View key={i} style={styles.dominioCell}>
                {spell && <View style={[styles.dominioColorStrip, { backgroundColor: COLOR_HEX[spell.cor] }]} />}
                {spell && (
                  <View style={styles.magicaInfoBlock}>
                    <View style={[styles.grauBadge, { borderColor: GRAU_COLORS[spell.grau] }]}>
                      <Text style={[styles.grauText, { color: GRAU_COLORS[spell.grau] }]}>{spell.grau}</Text>
                    </View>
                    <Text style={styles.magicaTipo}>{spell.tipo}</Text>
                    {spell.custo ? (
                      <Text style={styles.magicaCusto}>{spell.custo}</Text>
                    ) : null}
                  </View>
                )}
                <TextInput
                  style={styles.dominioInput}
                  value={m}
                  onChangeText={v => setMagica(i, v)}
                  placeholder={`Mágica ${i + 1}`}
                  placeholderTextColor={RPG.textDark}
                />
                {spell && (
                  <>
                    {spell.tipo === '[F]' && (
                      <TouchableOpacity style={styles.pillMem} onPress={() => addToMemoria(m)} activeOpacity={0.7}>
                        <Text style={styles.pillMemText}>Mem</Text>
                      </TouchableOpacity>
                    )}
                    {(spell.tipo === '[E]' || spell.tipo === '[C]') && (
                      <TouchableOpacity style={styles.pillFoco} onPress={() => addToFoco(m)} activeOpacity={0.7}>
                        <Text style={styles.pillFocoText}>Foco</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.slotBtn} onPress={() => setViewSpell(spell)} activeOpacity={0.7}>
                      <Text style={styles.slotBtnSpell}>ℹ</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            );
          })}
        </View>

        {/* ── RECEITAS ── */}
        <SectionHeader title="Receitas" />
        <TextInput
          style={styles.bigTextArea}
          value={c.receitas}
          onChangeText={setReceitas}
          multiline
          placeholder="Receitas de alquimia..."
          placeholderTextColor={RPG.textDark}
          textAlignVertical="top"
        />

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Spell detail modal */}
      <Modal visible={!!viewSpell} transparent animationType="slide" onRequestClose={() => setViewSpell(null)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { paddingBottom: insets.bottom }]}>
            {viewSpell && <SpellDetailCard spell={viewSpell} onClose={() => setViewSpell(null)} />}
          </View>
        </View>
      </Modal>

      {/* Domain expansion modal */}
      <Modal visible={!!viewDomain} transparent animationType="slide" onRequestClose={() => setViewDomain(null)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { paddingBottom: insets.bottom }]}>
            {viewDomain && (
              <DomainView
                domain={viewDomain}
                spells={domainSpells}
                onAddMemoria={addToMemoria}
                onAddFoco={addToFoco}
                onClose={() => setViewDomain(null)}
              />
            )}
          </View>
          {toast !== null && (
            <View style={styles.toast} pointerEvents="none">
              <Text style={styles.toastText}>{toast}</Text>
            </View>
          )}
        </View>
      </Modal>
      {toast !== null && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </SafeAreaView>
    </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

function getDomainColor(name: string): string | null {
  const spell = grimoire.find(s => s.dominio === name.trim());
  if (!spell) return null;
  return COLOR_HEX[spell.cor];
}

function DomainView({ domain, spells, onAddMemoria, onAddFoco, onClose }: {
  domain: string;
  spells: Spell[];
  onAddMemoria: (name: string) => void;
  onAddFoco: (name: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Spell | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);

  const closeSpell = () => {
    const y = scrollY.current;
    setSelected(null);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y, animated: false }));
  };

  if (selected) {
    return <SpellDetailCard spell={selected} onClose={closeSpell} />;
  }

  return (
    <ScrollView
      ref={scrollRef}
      onScroll={e => { scrollY.current = e.nativeEvent.contentOffset.y; }}
      scrollEventThrottle={32}
    >
      <View style={[styles.detailHeader, { borderBottomColor: RPG.gold, padding: 16, paddingBottom: 12, marginBottom: 0 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.domainTitle}>{domain}</Text>
          <Text style={styles.domainCount}>{spells.length} mágicas</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
      {spells.map((item, i) => (
        <View key={i} style={styles.domainSpellCard}>
          <TouchableOpacity style={styles.domainSpellInfo} onPress={() => setSelected(item)} activeOpacity={0.7}>
            <View style={[styles.grauBadge, { borderColor: GRAU_COLORS[item.grau] }]}>
              <Text style={[styles.grauText, { color: GRAU_COLORS[item.grau] }]}>{item.grau}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.domainSpellName} numberOfLines={1}>{item.nome}</Text>
              <Text style={styles.domainSpellMeta}>
                {item.tipo} · Custo: <Text style={{ fontFamily: 'PlanewalkerDings', fontStyle: 'normal' }}>{item.custo || '—'}</Text>
              </Text>
            </View>
          </TouchableOpacity>
          {item.tipo !== '[T]' && (
            <View style={styles.spellPills}>
              {item.tipo === '[F]' && (
                <TouchableOpacity style={styles.pillMem} onPress={() => onAddMemoria(item.nome)} activeOpacity={0.7}>
                  <Text style={styles.pillMemText}>Mem</Text>
                </TouchableOpacity>
              )}
              {(item.tipo === '[E]' || item.tipo === '[C]') && (
                <TouchableOpacity style={styles.pillFoco} onPress={() => onAddFoco(item.nome)} activeOpacity={0.7}>
                  <Text style={styles.pillFocoText}>Foco</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      ))}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: RPG.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },

  titleBar: {
    backgroundColor: RPG.headerBg,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: RPG.gold,
    alignItems: 'center',
  },
  title: {
    color: RPG.gold,
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  twoCol: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  colDivider: {
    width: 1,
    backgroundColor: RPG.border,
  },

  balizRow: {
    flexDirection: 'column',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: RPG.surface,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  gridWrap: {
    padding: 8,
    backgroundColor: RPG.surface,
  },

  dominiosGrid: {
    backgroundColor: RPG.surface,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    gap: 6,
  },
  dominioCell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RPG.border,
    backgroundColor: RPG.surfaceAlt,
  },
  dominioInitial: {
    borderColor: RPG.goldDim,
    borderStyle: 'dashed',
  },
  dominioInitialLabel: {
    color: RPG.goldDim,
    fontSize: 9,
    paddingHorizontal: 6,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  dominioColorStrip: {
    width: 4,
    alignSelf: 'stretch',
  },
  magicaInfoBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 2,
  },
  magicaTipo: {
    color: RPG.textMuted,
    fontSize: 9,
    letterSpacing: 0.3,
  },
  magicaCusto: {
    fontFamily: 'PlanewalkerDings',
    color: RPG.textMuted,
    fontSize: 11,
    fontStyle: 'normal',
  },
  dominioInput: {
    flex: 1,
    color: RPG.text,
    fontSize: 13,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  slotBtnClear: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotBtnClearText: {
    color: RPG.textMuted,
    fontSize: 16,
    lineHeight: 18,
  },
  memoInput: {
    fontSize: 11,
    paddingVertical: 4,
    textAlignVertical: 'top',
  },
  memoDominioCell: {
    alignItems: 'flex-start',
  },

  bigTextArea: {
    backgroundColor: RPG.surface,
    color: RPG.text,
    fontSize: 13,
    padding: 10,
    minHeight: 120,
    lineHeight: 20,
    textAlignVertical: 'top',
  },

  slotBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotBtnSpell: {
    color: RPG.azulLight,
    fontSize: 16,
  },
  slotBtnDomain: {
    color: RPG.gold,
    fontSize: 13,
    fontWeight: 'bold',
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
    maxHeight: '80%',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 12,
    gap: 10,
  },
  closeBtn: { padding: 4 },
  closeBtnText: { color: RPG.textMuted, fontSize: 18 },
  domainTitle: {
    color: RPG.gold,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  domainCount: {
    color: RPG.textMuted,
    fontSize: 12,
  },
  domainSpellCard: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
    alignItems: 'center',
  },
  domainSpellName: {
    color: RPG.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  domainSpellMeta: {
    color: RPG.textMuted,
    fontSize: 11,
  },
  grauBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grauText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  domainSpellInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  spellPills: {
    flexDirection: 'row',
    gap: 4,
    paddingRight: 10,
  },
  pillMem: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: RPG.azulLight,
    borderRadius: 4,
  },
  pillMemText: {
    color: RPG.azulLight,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  pillFoco: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: RPG.goldLight,
    borderRadius: 4,
  },
  pillFocoText: {
    color: RPG.goldLight,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: RPG.headerBg,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RPG.gold,
    zIndex: 999,
  },
  toastText: {
    color: RPG.gold,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
