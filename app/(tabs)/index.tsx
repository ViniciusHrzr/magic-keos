import React, { useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import DiceTrack from '@/components/rpg/DiceTrack';
import SkillRow from '@/components/rpg/SkillRow';
import NumericStepper from '@/components/rpg/NumericStepper';
import VenenoTracker from '@/components/rpg/VenenoTracker';
import AfinidadeSection from '@/components/rpg/AfinidadeSection';
import CharacterManager from '@/components/rpg/CharacterManager';
import { AttrDice, SkillValue } from '@/types/character';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
import ProficienciasSection from '@/components/rpg/ProficienciasSection';
import HabilidadesSection from '@/components/rpg/HabilidadesSection';
import LegendaryFrame from '@/components/rpg/LegendaryFrame';
import VidaBar from '@/components/rpg/VidaBar';

export default function FichaScreen() {
  const [showManager, setShowManager] = useState(false);
  const [frameWidth, setFrameWidth] = useState(0);
  const {
    character: c,
    setNome, setSabedoria, setVida, setMana, setVeneno, setAfinidade,
    setInstanceIP, setAttrDice, setSkill,
    setProficiencias, setHabilidades,
    isLoaded,
  } = useCharacter();

  if (!isLoaded) return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;

  return (
    <ErrorBoundary>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* ── HEADER ── */}
        <View onLayout={e => setFrameWidth(e.nativeEvent.layout.width)}>
          {frameWidth > 0 && (
            <LegendaryFrame
              nome={c.nome}
              onNomeChange={setNome}
              sabedoriaAcumulada={c.sabedoria.acumulada}
              sabedoriaDisponivel={c.sabedoria.disponivel}
              onFichasPress={() => setShowManager(true)}
              width={frameWidth}
            />
          )}
        </View>

        {/* ── SABEDORIA ── */}
        <SectionHeader title="Sabedoria" />
        <View style={styles.row2col}>
          <NumericStepper label="Acumulada" value={c.sabedoria.acumulada} onChange={v => setSabedoria('acumulada', v)} />
          <NumericStepper label="Disponível" value={c.sabedoria.disponivel} onChange={v => setSabedoria('disponivel', v)} color={RPG.goldLight} />
        </View>

        {/* ── VIDA ── */}
        <SectionHeader title="Vida" />
        <VidaBar vida={c.vida} onVidaChange={setVida} />

        {/* ── MANA ── */}
        <SectionHeader title="Mana" />
        <View style={styles.manaTable}>
          <View style={styles.manaHeaderRow}>
            <View style={styles.manaColorCol} />
            <Text style={styles.manaHeaderCell}>Base</Text>
            <Text style={styles.manaHeaderCell}>Total</Text>
          </View>
          {manaTypes.map(({ key, label, color, diamondColor }) => (
            <View key={key} style={styles.manaTableRow}>
              <View style={styles.manaColorCol}>
                <View style={[styles.manaDiamond, { backgroundColor: diamondColor, borderColor: color }]} />
                <Text style={[styles.manaLabel, { color }]}>{label}</Text>
              </View>
              <View style={styles.manaStepperCell}>
                <NumericStepper compact value={c.mana[key].base} onChange={v => setMana(key, 'base', v)} color={color} />
              </View>
              <View style={styles.manaStepperCell}>
                <NumericStepper compact value={c.mana[key].total} onChange={v => setMana(key, 'total', v)} color={color} />
              </View>
            </View>
          ))}
        </View>

        {/* ── VENENO ── */}
        <SectionHeader title="Veneno" />
        <View style={styles.venenoWrap}>
          <VenenoTracker value={c.veneno} onChange={setVeneno} />
        </View>

        {/* ── AFINIDADE ── */}
        <AfinidadeSection value={c.afinidade} onChange={setAfinidade} />

        {/* ── CORPO ── */}
        <InstanceBlock
          title="Corpo"
          ipBase={c.corpo.ipBase}
          ipBonus={c.corpo.ipBonus}
          onIpChange={(f, v) => setInstanceIP('corpo', f, v)}
          attrs={[
            { label: 'Força', key: 'forca', dice: c.corpo.forca },
            { label: 'Reflexos', key: 'reflexos', dice: c.corpo.reflexos },
            { label: 'Vigor', key: 'vigor', dice: c.corpo.vigor },
          ]}
          skills={[
            { label: 'Artes Marciais', key: 'artesMarciais', value: c.corpo.artesMarciais },
            { label: 'Atletismo', key: 'atletismo', value: c.corpo.atletismo },
            { label: 'Esgrima', key: 'esgrima', value: c.corpo.esgrima },
            { label: 'Furtividade', key: 'furtividade', value: c.corpo.furtividade },
            { label: 'Pontaria', key: 'pontaria', value: c.corpo.pontaria },
          ]}
          onDiceChange={(attr, dice) => setAttrDice('corpo', attr, dice)}
          onSkillChange={(skill, val) => setSkill('corpo', skill, val)}
        />

        {/* ── MENTE ── */}
        <InstanceBlock
          title="Mente"
          ipBase={c.mente.ipBase}
          ipBonus={c.mente.ipBonus}
          onIpChange={(f, v) => setInstanceIP('mente', f, v)}
          attrs={[
            { label: 'Razão', key: 'razao', dice: c.mente.razao },
            { label: 'Sentidos', key: 'sentidos', dice: c.mente.sentidos },
            { label: 'Concentração', key: 'concentracao', dice: c.mente.concentracao },
          ]}
          skills={[
            { label: 'Alquimia', key: 'alquimia', value: c.mente.alquimia },
            { label: 'Criatividade', key: 'criatividade', value: c.mente.criatividade },
            { label: 'Investigação', key: 'investigacao', value: c.mente.investigacao },
            { label: 'Mecânica', key: 'mecanica', value: c.mente.mecanica },
            { label: 'Sobrevivência', key: 'sobrevivencia', value: c.mente.sobrevivencia },
          ]}
          onDiceChange={(attr, dice) => setAttrDice('mente', attr, dice)}
          onSkillChange={(skill, val) => setSkill('mente', skill, val)}
        />

        {/* ── ESPÍRITO ── */}
        <InstanceBlock
          title="Espírito"
          ipBase={c.espirito.ipBase}
          ipBonus={c.espirito.ipBonus}
          onIpChange={(f, v) => setInstanceIP('espirito', f, v)}
          attrs={[
            { label: 'Presença', key: 'presenca', dice: c.espirito.presenca },
            { label: 'Intuição', key: 'intuicao', dice: c.espirito.intuicao },
            { label: 'Vontade', key: 'vontade', dice: c.espirito.vontade },
          ]}
          skills={[
            { label: 'Comunhão', key: 'comunhao', value: c.espirito.comunhao },
            { label: 'Diplomacia', key: 'diplomacia', value: c.espirito.diplomacia },
            { label: 'Expressão', key: 'expressao', value: c.espirito.expressao },
            { label: 'Intimidação', key: 'intimidacao', value: c.espirito.intimidacao },
            { label: 'Lábia', key: 'labia', value: c.espirito.labia },
          ]}
          onDiceChange={(attr, dice) => setAttrDice('espirito', attr, dice)}
          onSkillChange={(skill, val) => setSkill('espirito', skill, val)}
        />

        {/* ── PROFICIÊNCIAS ── */}
        <ProficienciasSection selected={c.proficiencias} onChange={setProficiencias} />

        {/* ── HABILIDADES ── */}
        <HabilidadesSection selected={c.habilidades} onChange={setHabilidades} />

        <View style={{ height: 32 }} />
      </ScrollView>
      <CharacterManager visible={showManager} onClose={() => setShowManager(false)} />
    </SafeAreaView>
    </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

// ── Sub-component: Instance Block ──────────────────────────────────────────
interface AttrEntry { label: string; key: string; dice: AttrDice }
interface SkillEntry { label: string; key: string; value: SkillValue }

function InstanceBlock({ title, ipBase, ipBonus, onIpChange, attrs, skills, onDiceChange, onSkillChange }: {
  title: string;
  ipBase: number;
  ipBonus: number;
  onIpChange: (field: 'ipBase' | 'ipBonus', v: number) => void;
  attrs: AttrEntry[];
  skills: SkillEntry[];
  onDiceChange: (key: string, dice: AttrDice) => void;
  onSkillChange: (key: string, val: SkillValue) => void;
}) {
  return (
    <View style={styles.instanceBlock}>
      <SectionHeader
        title={title}
        rightContent={
          <View style={styles.ipRow}>
            <NumericStepper
              label="IP BASE"
              value={ipBase}
              onChange={v => onIpChange('ipBase', v)}
              compact
            />
            <NumericStepper
              label="BÔNUS"
              value={ipBonus}
              onChange={v => onIpChange('ipBonus', v)}
              compact
            />
          </View>
        }
      />
      <View style={styles.instanceContent}>
        <View style={styles.diceCol}>
          {attrs.map(a => (
            <DiceTrack key={a.key} label={a.label} dice={a.dice} onChange={d => onDiceChange(a.key, d)} />
          ))}
        </View>
        <View style={styles.skillsDivider} />
        <View style={styles.skillsCol}>
          <View style={styles.skillHeader}>
            <Text style={[styles.skillHeaderText, { flex: 1 }]}>Perícia</Text>
            <Text style={[styles.skillHeaderText, { width: 44, textAlign: 'center' }]}>base</Text>
            <Text style={[styles.skillHeaderText, { width: 44, textAlign: 'center', marginLeft: 6 }]}>temp</Text>
          </View>
          {skills.map(s => (
            <SkillRow key={s.key} label={s.label} value={s.value} onChange={v => onSkillChange(s.key, v)} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
const manaTypes = [
  { key: 'incolor' as const, label: 'Inc', color: RPG.incolor, diamondColor: RPG.incolor },
  { key: 'branco' as const, label: 'Bco', color: RPG.branco, diamondColor: RPG.branco },
  { key: 'verde' as const, label: 'Vde', color: RPG.verdeLight, diamondColor: RPG.verde },
  { key: 'vermelho' as const, label: 'Vm', color: RPG.vermelhoLight, diamondColor: RPG.vermelho },
  { key: 'preto' as const, label: 'Pto', color: RPG.pretoLight, diamondColor: RPG.preto },
  { key: 'azul' as const, label: 'Azul', color: RPG.azulLight, diamondColor: RPG.azul },
];

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: RPG.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },

  row2col: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: RPG.surface,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  venenoWrap: {
    backgroundColor: RPG.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },

  manaTable: {
    backgroundColor: RPG.surface,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  manaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: RPG.goldDim,
    marginBottom: 2,
  },
  manaHeaderCell: {
    flex: 1,
    textAlign: 'center',
    color: RPG.gold,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manaTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  manaColorCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  manaStepperCell: {
    flex: 1,
    alignItems: 'center',
  },
  manaDiamond: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
    borderWidth: 1.5,
  },
  manaLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  instanceBlock: {
    backgroundColor: RPG.surface,
    borderWidth: 1,
    borderColor: RPG.goldDim,
    borderRadius: 4,
    marginHorizontal: 8,
    marginVertical: 6,
    overflow: 'hidden',
  },
  instanceContent: {
    backgroundColor: RPG.surface,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
  },
  diceCol: {
    gap: 2,
    marginBottom: 10,
  },
  skillsDivider: {
    height: 1,
    backgroundColor: RPG.border,
    marginVertical: 8,
  },
  skillsCol: {
    gap: 0,
  },
  skillHeader: {
    flexDirection: 'row',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: RPG.goldDim,
    marginBottom: 2,
  },
  skillHeaderText: {
    color: RPG.gold,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  ipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  textArea: {
    backgroundColor: RPG.surface,
    color: RPG.text,
    fontSize: 13,
    padding: 10,
    minHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: RPG.border,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
});
