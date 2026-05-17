# Phase 13: Aba Mochila & Slots de Equipamento — Pattern Map

**Mapped:** 2026-05-17
**Files analyzed:** 5 (3 novos, 2 modificados)
**Analogs found:** 5 / 5

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `app/(tabs)/mochila.tsx` | screen | request-response (CRUD via context) | `app/(tabs)/magia.tsx` | exact |
| `components/rpg/SlotEquipamento.tsx` | component | CRUD | `components/rpg/HabilidadesSection.tsx` | exact |
| `components/rpg/PickerModal.tsx` | component | request-response | `components/rpg/ProficienciasSection.tsx` | exact |
| `app/(tabs)/_layout.tsx` | config | — | `app/(tabs)/_layout.tsx` (si mesmo) | exact |
| `components/ui/IconSymbol.tsx` | config/utility | — | `components/ui/icon-symbol.tsx` (si mesmo) | exact |

---

## Pattern Assignments

### `app/(tabs)/mochila.tsx` (screen, CRUD)

**Analog:** `app/(tabs)/magia.tsx`

**Imports pattern** (linhas 1-14 de magia.tsx):
```typescript
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
```

**Loading guard pattern** (linhas 67 de magia.tsx):
```typescript
if (!isLoaded) return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;
```

**Screen wrapper pattern** (linhas 70-73 de magia.tsx):
```typescript
return (
  <ErrorBoundary>
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
```

**Title bar pattern** (linhas 75-77 de magia.tsx):
```typescript
<View style={styles.titleBar}>
  <Text style={styles.title}>Ficha de Magia</Text>
</View>
```

**Styles base pattern** (linhas 476-479 de magia.tsx):
```typescript
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
});
```

**Context destructuring pattern** — extrair apenas os setters necessários (linhas 15-21 de magia.tsx):
```typescript
const {
  character: c,
  setEquipamentoItem,
  isLoaded,
} = useCharacter();
```

**Nota de implementação:** `mochila.tsx` é uma screen simples — o estado local de "qual slot está expandido" e "qual slot tem picker aberto" vive aqui. Os 5 cards de slot (`arma`, `escudo`, `vestimenta`, `acessorio1`, `acessorio2`) podem ser renderizados inline ou via componente `SlotEquipamento`. O slot `armadura` NÃO é exposto na UI (permanece no schema para compatibilidade).

---

### `components/rpg/SlotEquipamento.tsx` (component, CRUD)

**Analog primário:** `components/rpg/HabilidadesSection.tsx`
**Analog de collapse:** `app/(tabs)/regras.tsx` (função `Section`, linhas 125-156)

**Props interface pattern** (inspirado em HabilidadesSection.tsx linhas 10-13):
```typescript
interface Props {
  slotKey: keyof Character['equipamentos'];   // 'arma' | 'escudo' | 'vestimenta' | 'acessorio1' | 'acessorio2'
  label: string;                              // 'ARMA' | 'ESCUDO' | 'VESTIMENTA' | 'ACESSÓRIO 1' | 'ACESSÓRIO 2'
  item: EquipItem | null;
  onChangeItem: (item: EquipItem | null) => void;
  onOpenPicker: () => void;
}
```

**Collapsible state pattern** (regras.tsx linhas 126-138):
```typescript
const [open, setOpen] = useState(false);

const toggle = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setOpen(v => !v);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
```

**Imports necessários para collapse** (regras.tsx linhas 1-11):
```typescript
import { LayoutAnimation, Animated, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
```

**Card collapsed view pattern** — adaptar dos styles de HabilidadesSection.tsx (linhas 262-314):
```typescript
// Collapsed: label uppercase goldDim + nome do item (gold se preenchido, textDark se vazio)
// + badge count de melhorias se item presente
<TouchableOpacity
  style={[styles.slot, item ? styles.slotFilled : styles.slotEmpty]}
  onPress={toggle}
  activeOpacity={0.7}
>
  <Text style={styles.slotLabel}>{label}</Text>
  <Text style={[styles.slotName, item ? null : styles.slotNameEmpty]}>
    {item?.nome ?? 'Vazio'}
  </Text>
  {item && item.melhorias.length > 0 && (
    <Text style={styles.slotMelhorias}>{item.melhorias.length} melhorias</Text>
  )}
  <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
</TouchableOpacity>
```

**Card expanded view pattern** — TextInput inline para nome + botão picker:
```typescript
// Expanded: TextInput editável para nome + botão "Escolher do livro"
{open && (
  <View style={styles.expandedBody}>
    <TextInput
      style={styles.nomeInput}
      value={item?.nome ?? ''}
      onChangeText={v => onChangeItem(item ? { ...item, nome: v } : { nome: v, tipo: 'basico', melhorias: [] })}
      placeholder="Nome personalizado..."
      placeholderTextColor={RPG.textDark}
    />
    <TouchableOpacity style={styles.pickerBtn} onPress={onOpenPicker} activeOpacity={0.7}>
      <Text style={styles.pickerBtnText}>Escolher do livro</Text>
    </TouchableOpacity>
    {item && (
      <TouchableOpacity style={styles.clearBtn} onPress={() => onChangeItem(null)} hitSlop={8}>
        <Text style={styles.clearText}>Remover item</Text>
      </TouchableOpacity>
    )}
  </View>
)}
```

**Styles pattern** — copiar de HabilidadesSection.tsx (linhas 253-401) adaptando:
```typescript
const styles = StyleSheet.create({
  slot: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderRadius: 6 },
  slotFilled: { borderColor: RPG.gold, backgroundColor: RPG.surfaceAlt },
  slotEmpty: { borderColor: RPG.border, backgroundColor: 'transparent' },
  slotLabel: { fontSize: 9, color: RPG.goldDim, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', minWidth: 72 },
  slotName: { flex: 1, fontSize: 13, color: RPG.goldLight, fontWeight: '600' },
  slotNameEmpty: { color: RPG.textDark, fontStyle: 'italic' },
  slotMelhorias: { fontSize: 9, color: RPG.textMuted },
  chevron: { color: RPG.goldDim, fontSize: 11 },
  expandedBody: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderTopWidth: 1, borderTopColor: RPG.border },
  nomeInput: { backgroundColor: RPG.surfaceAlt, borderWidth: 1, borderColor: RPG.border, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, color: RPG.text },
  pickerBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: RPG.goldDim, borderRadius: 4, alignSelf: 'flex-start' },
  pickerBtnText: { color: RPG.gold, fontSize: 12, fontWeight: '600' },
  clearBtn: { alignSelf: 'flex-start' },
  clearText: { color: RPG.textDark, fontSize: 11 },
});
```

---

### `components/rpg/PickerModal.tsx` (component, request-response)

**Analog:** `components/rpg/ProficienciasSection.tsx` (linhas 140-219 + 246-279)

Este é o análogo mais próximo e mais completo — copiar o padrão de Modal fullscreen diretamente.

**Props interface:**
```typescript
interface Props {
  visible: boolean;
  slotKey: keyof Character['equipamentos'] | null;
  onClose: () => void;
  onPick: (item: { nome: string; tipo: 'basico' | 'artefato' }) => void;
}
```

**Imports pattern** (ProficienciasSection.tsx linhas 1-14):
```typescript
import React, { useMemo, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RPG } from '@/constants/theme';
```

**Modal fullscreen wrapper pattern** (ProficienciasSection.tsx linhas 140-141):
```typescript
<Modal visible={visible} animationType="slide" onRequestClose={onClose}>
  <SafeAreaView style={styles.modal}>
```

**Modal header pattern** (ProficienciasSection.tsx linhas 142-145):
```typescript
<View style={styles.modalHeader}>
  <Text style={styles.modalTitle}>Escolher {SLOT_LABEL[slotKey]}</Text>
  <TouchableOpacity onPress={onClose} hitSlop={12}>
    <Text style={styles.modalClose}>✕</Text>
  </TouchableOpacity>
</View>
```

**Search input pattern** (ProficienciasSection.tsx linhas 147-157):
```typescript
<View style={styles.searchWrap}>
  <TextInput
    style={styles.searchInput}
    placeholder="Pesquisar..."
    placeholderTextColor={RPG.textMuted}
    value={search}
    onChangeText={setSearch}
    autoFocus
    returnKeyType="search"
  />
</View>
```

**List com seções pattern** (ProficienciasSection.tsx linhas 159-216):
```typescript
<ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
  {filtered.map(section => (
    <View key={section.categoria}>
      {/* Cabeçalho da categoria (ex: "ARMAS DE 1 MÃO") */}
      <View style={styles.periHeader}>
        <Text style={styles.periLabel}>{section.categoria}</Text>
      </View>
      {section.itens.map(item => (
        <TouchableOpacity
          key={item.nome}
          style={styles.profRow}
          onPress={() => { onPick({ nome: item.nome, tipo: 'basico' }); onClose(); }}
          activeOpacity={0.7}
        >
          <Text style={styles.profName}>{item.nome}</Text>
          {item.descricao && <Text style={styles.profDesc}>{item.descricao}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  ))}
  <View style={{ height: 40 }} />
</ScrollView>
```

**Modal styles pattern** (ProficienciasSection.tsx linhas 246-279):
```typescript
modal: { flex: 1, backgroundColor: RPG.bg },
modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: RPG.border },
modalTitle: { fontSize: 16, fontWeight: '700', color: RPG.gold, letterSpacing: 0.5 },
modalClose: { fontSize: 16, color: RPG.textMuted },
searchWrap: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: RPG.border },
searchInput: { backgroundColor: RPG.surfaceAlt, borderWidth: 1, borderColor: RPG.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, color: RPG.text },
list: { flex: 1 },
periHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: RPG.border, backgroundColor: RPG.surfaceAlt },
periLabel: { fontSize: 14, fontWeight: '700', color: RPG.gold },
profRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: RPG.border + '44', gap: 10 },
profName: { fontSize: 13, color: RPG.text, fontWeight: '600' },
profDesc: { fontSize: 11, color: RPG.textMuted, lineHeight: 15 },
```

**Fonte de dados do picker por slot** (data/regras.ts — arrays já exportados):
```typescript
// Mapear slotKey → lista de itens do livro
const SLOT_ITEMS: Record<keyof Character['equipamentos'], Array<{ nome: string; descricao?: string }>> = {
  arma:       armas.map(r => ({ nome: r.arma, descricao: r.especial })),
  escudo:     escudos.map(r => ({ nome: r.escudo, descricao: r.especial })),
  vestimenta: vestimentas.map(r => ({ nome: r.vestimenta })),
  acessorio1: acessorios.map(r => ({ nome: r.acessorio, descricao: r.bonus })),
  acessorio2: acessorios.map(r => ({ nome: r.acessorio, descricao: r.bonus })),
  armadura:   [],  // slot oculto na UI — lista vazia
};
```

---

### `app/(tabs)/_layout.tsx` (config, modificação)

**Analog:** si mesmo — adicionar entrada seguindo o padrão exato dos 5 `Tabs.Screen` existentes.

**Padrão de adição** (linhas 28-63 de _layout.tsx — copiar estrutura de qualquer tab existente):
```typescript
// Adicionar ANTES de <Tabs.Screen name="explore" options={{ href: null }} />
<Tabs.Screen
  name="mochila"
  options={{
    title: 'Mochila',
    tabBarIcon: ({ color }) => <IconSymbol size={26} name="bag.fill" color={color} />,
  }}
/>
```

**Contexto completo de onde inserir** (_layout.tsx linhas 49-64):
```typescript
      <Tabs.Screen
        name="notas"
        options={{
          title: 'Notas',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="square.and.pencil" color={color} />,
        }}
      />
      {/* INSERIR AQUI: Tabs.Screen name="mochila" */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
```

**Nota:** O arquivo `app/(tabs)/mochila.tsx` precisa existir antes de registrar a tab — Expo Router valida na inicialização.

---

### `components/ui/IconSymbol.tsx` (utility, modificação)

**Analog:** si mesmo — adicionar uma entrada no `MAPPING` seguindo o padrão exato.

**Padrão de mapeamento** (icon-symbol.tsx linhas 16-26):
```typescript
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.fill': 'person',
  'sparkles': 'auto-awesome',
  'book.fill': 'menu-book',
  'list.bullet': 'list',
  'square.and.pencil': 'edit-note',
  // ADICIONAR:
  'bag.fill': 'backpack',   // MaterialIcons 'backpack' verificado em icons.expo.fyi
} as IconMapping;
```

**Nota:** A chave `'bag.fill'` é um SF Symbol válido para iOS. O valor `'backpack'` é o nome do ícone em `@expo/vector-icons/MaterialIcons`. Apenas `icon-symbol.tsx` (Android/web) precisa de alteração — `icon-symbol.ios.tsx` aceita qualquer SF Symbol nativo sem mapeamento.

---

## Shared Patterns

### Loading Guard
**Source:** `app/(tabs)/notas.tsx` linhas 11-13 / `app/(tabs)/magia.tsx` linha 67
**Aplicar a:** `app/(tabs)/mochila.tsx`
```typescript
if (!isLoaded) {
  return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;
}
```

### ErrorBoundary wrapper
**Source:** `app/(tabs)/magia.tsx` linhas 70, 395
**Aplicar a:** `app/(tabs)/mochila.tsx`
```typescript
return (
  <ErrorBoundary>
    {/* conteúdo */}
  </ErrorBoundary>
);
```

### Context setter — setEquipamentoItem
**Source:** `store/CharacterContext.tsx` linhas 183-184
```typescript
const setEquipamentoItem = useCallback((slot: keyof Character['equipamentos'], item: EquipItem | null) =>
  update(p => ({ ...p, equipamentos: { ...p.equipamentos, [slot]: item } })), [update]);
```
**Aplicar a:** `SlotEquipamento.tsx` e `mochila.tsx` — chamar `setEquipamentoItem(slotKey, novoItem)` diretamente ao confirmar seleção no picker.

### RPG theme tokens
**Source:** `constants/theme.ts` linhas 3-34
**Aplicar a:** todos os novos arquivos
- Cor de fundo: `RPG.bg` (`#0a0806`)
- Superfície: `RPG.surface` (`#181210`), `RPG.surfaceAlt` (`#221a12`)
- Borda: `RPG.border` (`#3d2e18`)
- Ouro principal: `RPG.gold` (`#c9a84c`), dim: `RPG.goldDim` (`#7a6020`), light: `RPG.goldLight` (`#e8c96a`)
- Texto: `RPG.text` (`#f0e6d3`), muted: `RPG.textMuted` (`#a89070`), dark: `RPG.textDark` (`#6a5540`)
- Header background: `RPG.headerBg` (`#0d0b08`)

### LayoutAnimation collapse
**Source:** `app/(tabs)/regras.tsx` linhas 129-138
**Aplicar a:** `SlotEquipamento.tsx`
```typescript
import { LayoutAnimation } from 'react-native';
import * as Haptics from 'expo-haptics';

const toggle = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setOpen(v => !v);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
```

### SectionHeader
**Source:** componente existente em `components/rpg/SectionHeader.tsx`
**Aplicar a:** `app/(tabs)/mochila.tsx`
```typescript
import SectionHeader from '@/components/rpg/SectionHeader';
// Uso:
<SectionHeader title="Equipamentos" />
```

---

## No Analog Found

Nenhum arquivo desta fase ficou sem análogo. Todos os padrões existem no codebase.

---

## Data Sources Verificados

| Slot | Array de dados | Campo nome | Campo extra |
|------|---------------|-----------|-------------|
| `arma` | `armas[]` em `data/regras.ts` | `r.arma` | `r.especial` (dano) |
| `escudo` | `escudos[]` em `data/regras.ts` | `r.escudo` | `r.especial` |
| `vestimenta` | `vestimentas[]` em `data/regras.ts` | `r.vestimenta` | `r.ipCorp` |
| `acessorio1` / `acessorio2` | `acessorios[]` em `data/regras.ts` | `r.acessorio` | `r.bonus` |
| `armadura` | — | oculto na UI | schema-only |

**Import path para os arrays:**
```typescript
import { armas, escudos, vestimentas, acessorios } from '@/data/regras';
```

---

## Metadata

**Analog search scope:** `app/(tabs)/`, `components/rpg/`, `components/ui/`, `store/`, `types/`, `constants/`
**Files scanned:** 9 arquivos lidos integralmente
**Pattern extraction date:** 2026-05-17
