# Phase 04: Ferramentas de Mesa - Pattern Map

**Mapped:** 2026-05-15
**Files analyzed:** 7
**Analogs found:** 7 / 7

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `types/character.ts` | model | CRUD | `types/character.ts` (self — surgical edit) | exact |
| `store/CharacterContext.tsx` | store/provider | CRUD | `store/CharacterContext.tsx` (self — surgical edit) | exact |
| `app/(tabs)/regras.tsx` | screen | request-response | `app/(tabs)/magia.tsx` | exact |
| `app/(tabs)/_layout.tsx` | config | request-response | `app/(tabs)/_layout.tsx` (self — surgical edit) | exact |
| `data/proficiencias.ts` | data | transform | `data/grimoire.ts` | role-match |
| `components/rpg/ProficienciasSection.tsx` | component | event-driven | `components/rpg/SpellDetailCard.tsx` + `app/(tabs)/grimorio.tsx` filter chips | role-match |
| `app/(tabs)/index.tsx` | screen | request-response | `app/(tabs)/index.tsx` (self — surgical edit) | exact |

---

## Pattern Assignments

### `types/character.ts` (model, CRUD — surgical edit)

**Analog:** self

Two targeted line changes. No new pattern required beyond what already exists.

**Current `proficiencias` field** (line 83):
```typescript
proficiencias: string;
```
Change to:
```typescript
proficiencias: string[];
```

**Add `notas` field** after `habilidades: string` (line 84):
```typescript
notas: string;
```

**Current default** (line 161):
```typescript
proficiencias: '',
```
Change to:
```typescript
proficiencias: [],
notas: '',
```

---

### `store/CharacterContext.tsx` (store/provider, CRUD — surgical edit)

**Analog:** self

**Migration block pattern** — copy the exact guard structure (lines 13–31):
```typescript
function migrate(raw: any): Character {
  const parsed = { ...raw };
  if (parsed.mana) {
    for (const k of ['incolor', 'branco', 'verde', 'vermelho', 'preto', 'azul']) {
      if (typeof parsed.mana[k] === 'number') {
        parsed.mana[k] = { base: 0, total: parsed.mana[k] };
      }
    }
  }
  if (parsed.magicasReceitas !== undefined) {
    parsed.magicas = typeof parsed.magicasReceitas === 'string'
      ? Array(20).fill('') : parsed.magicasReceitas;
    delete parsed.magicasReceitas;
  }
  if (typeof parsed.magicas === 'string') {
    parsed.magicas = Array(20).fill('');
  }
  return { ...defaultCharacter, ...parsed };
}
```

Add two new guards immediately before the final `return` statement (after line 30):
```typescript
  if (typeof parsed.proficiencias === 'string') parsed.proficiencias = [];
  if (!parsed.notas) parsed.notas = '';
```

**Setter pattern** — every setter follows the same `useCallback([update])` form. Copy from lines 151–152:
```typescript
const setProficiencias = useCallback((v: string) => update(p => ({ ...p, proficiencias: v })), [update]);
const setHabilidades   = useCallback((v: string) => update(p => ({ ...p, habilidades: v })), [update]);
```

New setters to add:
```typescript
const setProficiencias = useCallback((v: string[]) => update(p => ({ ...p, proficiencias: v })), [update]);
const setNotas         = useCallback((v: string)   => update(p => ({ ...p, notas: v })),         [update]);
```

**Context type declaration** — add two entries matching the existing interface pattern (lines 35–65):
```typescript
setProficiencias: (v: string[]) => void;  // change from string
setNotas: (v: string) => void;            // new
```

**`contextValue` useMemo** — add `setNotas` alongside `setProficiencias` in both the object literal and the deps array (lines 242–259):
```typescript
const contextValue = useMemo(() => ({
  // ...
  setProficiencias, setHabilidades, setNotas,
  // ...
}), [
  // ...
  setProficiencias, setHabilidades, setNotas,
  // ...
]);
```

---

### `app/(tabs)/regras.tsx` (screen, request-response — NEW)

**Analog:** `app/(tabs)/magia.tsx`

**Imports pattern** (magia.tsx lines 1–13):
```typescript
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
```

**Screen skeleton** — copy the exact outer scaffold from magia.tsx (lines 52–56):
```typescript
export default function RegrasScreen() {
  const { character: c, setNotas, isLoaded } = useCharacter();
  if (!isLoaded) return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;
  return (
    <ErrorBoundary>
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* sections */}
      </ScrollView>
    </SafeAreaView>
    </ErrorBoundary>
  );
}
```

**Title bar pattern** (magia.tsx lines 58–61):
```typescript
<View style={styles.titleBar}>
  <Text style={styles.title}>Regras</Text>
</View>
```

**SectionHeader per rules section** — copy from magia.tsx pattern:
```typescript
<SectionHeader title="Mecânica de Dados" />
<View style={styles.tableBlock}>
  {/* static table rows */}
</View>
```

**Table row pattern** — use `View` + two `Text` children, styled like the mana table in index.tsx (lines 80–99). Suggested reusable row shape:
```typescript
<View style={styles.tableRow}>
  <Text style={styles.tableKey}>{label}</Text>
  <Text style={styles.tableVal}>{value}</Text>
</View>
```

**Notas TextInput** — copy the `textArea` style from index.tsx (lines 479–489). The Notas section is the last section, connected to context:
```typescript
<SectionHeader title="Notas" />
<TextInput
  style={styles.textArea}
  value={c.notas}
  onChangeText={setNotas}
  multiline
  placeholder="Anotações de sessão..."
  placeholderTextColor={RPG.textDark}
  textAlignVertical="top"
/>
```

**`textArea` style to copy** (index.tsx lines 479–489):
```typescript
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
```

**Base styles to copy** (magia.tsx lines 421–439):
```typescript
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
```

---

### `app/(tabs)/_layout.tsx` (config — surgical edit)

**Analog:** self

**Existing tab registration pattern** (lines 28–48). Add a new `Tabs.Screen` after the grimorio entry, before the hidden `explore` entry:
```typescript
<Tabs.Screen
  name="grimorio"
  options={{
    title: 'Grimório',
    tabBarIcon: ({ color }) => <IconSymbol size={26} name="book.fill" color={color} />,
  }}
/>
{/* ADD HERE: */}
<Tabs.Screen
  name="regras"
  options={{
    title: 'Regras',
    tabBarIcon: ({ color }) => <IconSymbol size={26} name="list.bullet" color={color} />,
  }}
/>
<Tabs.Screen name="explore" options={{ href: null }} />
```

**Icon registration** — `list.bullet` (or `book.pages.fill`) must be added to the MAPPING in `components/ui/icon-symbol.tsx` (lines 16–24):
```typescript
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.fill': 'person',
  'sparkles': 'auto-awesome',
  'book.fill': 'menu-book',
  // ADD:
  'list.bullet': 'list',          // Material Icons: 'list'
} as IconMapping;
```

---

### `data/proficiencias.ts` (data, transform — NEW)

**Analog:** `data/grimoire.ts`

**File structure pattern** (grimoire.ts lines 1–38):
```typescript
// Typed exports, no default export, pure data file
export type PericiaKey = 'artesMarciais' | 'atletismo' | ...;
export type InstanciaKey = 'corpo' | 'mente' | 'espirito';

export interface PericiaData {
  label: string;
  proficiencias: string[];
}

export type ProficienciasMap = Record<InstanciaKey, Record<string, PericiaData>>;

export const proficiencias: ProficienciasMap = {
  corpo: {
    artesMarciais: {
      label: 'Artes Marciais',
      proficiencias: ['Derrubar', 'Desarmar', 'Desviar', 'Fintar', 'Imobilizar', 'Aparar (reação lv.2)'],
    },
    // ...
  },
  mente: { ... },
  espirito: { ... },
};
```

The exact proficiência strings are specified in CONTEXT.md `<specifics>` section (lines 108–111) and must be copied verbatim.

---

### `components/rpg/ProficienciasSection.tsx` (component, event-driven — NEW)

**Primary analog:** `app/(tabs)/grimorio.tsx` — the color filter chips (lines 157–192)
**Secondary analog:** `components/rpg/SpellDetailCard.tsx` — component file structure (lines 1–123)
**Tertiary analog:** `components/rpg/NumericStepper.tsx` — minimal default-export component structure (lines 1–116)

**Component file structure** (NumericStepper.tsx lines 1–14):
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  selected: string[];
  onChange: (v: string[]) => void;
}

export default function ProficienciasSection({ selected, onChange }: Props) {
  // ...
}

const styles = StyleSheet.create({ ... });
```

**Chip toggle pattern** — copy from grimorio.tsx filter buttons (lines 157–168). Selected = gold highlight, unselected = muted border:
```typescript
// In grimorio.tsx, the grau/type toggle pattern:
<TouchableOpacity
  key={g}
  style={[styles.filterBtn2, activeGrau === g && styles.filterBtn2Active]}
  onPress={() => { const next = activeGrau === g ? null : g; setActiveGrau(next); }}
  activeOpacity={0.7}
>
  <Text style={[styles.filterText2, activeGrau === g && { color: RPG.gold }]}>Grau {g}</Text>
</TouchableOpacity>
```

Adapted for multi-select string array (`selected`):
```typescript
const key = `${periciaKey}:${profNome}`;
const isSelected = selected.includes(key);

<TouchableOpacity
  style={[styles.chip, isSelected && styles.chipActive]}
  onPress={() => {
    const next = isSelected
      ? selected.filter(k => k !== key)
      : [...selected, key];
    onChange(next);
  }}
  activeOpacity={0.7}
>
  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{profNome}</Text>
</TouchableOpacity>
```

**Chip styles** — adapt from grimorio.tsx `filterBtn2` / `filterBtn2Active` (lines 282–291):
```typescript
chip: {
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderWidth: 1,
  borderColor: RPG.border,
  borderRadius: 10,
},
chipActive: {
  borderColor: RPG.gold,
  backgroundColor: RPG.goldDim + '33',
},
chipText: { fontSize: 11, color: RPG.textMuted },
chipTextActive: { color: RPG.gold },
```

**Expandable section header** — copy the domain row toggle from grimorio.tsx (lines 92–106):
```typescript
<TouchableOpacity
  style={styles.sectionRow}
  onPress={() => toggleSection(periciaKey)}
  activeOpacity={0.75}
>
  <Text style={styles.sectionTitle}>{label}</Text>
  <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
</TouchableOpacity>
{isOpen && (
  <View style={styles.chipsWrap}>
    {/* chips */}
  </View>
)}
```

**Section grouping** — iterate over `proficiencias` data file by `instanciaKey`, then by `periciaKey`. Use `useState<Set<string>>` for expanded sections, similar to grimorio.tsx `expanded` state (line 49):
```typescript
const [expanded, setExpanded] = useState<Set<string>>(new Set());
const toggle = (k: string) =>
  setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
```

---

### `app/(tabs)/index.tsx` (screen — surgical edit)

**Analog:** self

**Current proficiencias block** (lines 177–188):
```typescript
{/* ── PROFICIÊNCIAS ── */}
<SectionHeader title="Proficiências" />
<TextInput
  style={styles.textArea}
  value={c.proficiencias}
  onChangeText={setProficiencias}
  multiline
  placeholder="Liste as proficiências do personagem..."
  placeholderTextColor={RPG.textDark}
  textAlignVertical="top"
/>
```

Replace with:
```typescript
{/* ── PROFICIÊNCIAS ── */}
<ProficienciasSection selected={c.proficiencias} onChange={setProficiencias} />
```

**Import to add** at top of file:
```typescript
import ProficienciasSection from '@/components/rpg/ProficienciasSection';
```

**Destructure `setProficiencias`** — already destructured at line 25; no change needed there. The type change in CharacterContext is transparent to the call site.

---

## Shared Patterns

### Screen outer scaffold
**Source:** `app/(tabs)/magia.tsx` lines 52–56 + 139 (ErrorBoundary + SafeAreaView + ScrollView)
**Apply to:** `app/(tabs)/regras.tsx`
```typescript
<ErrorBoundary>
<SafeAreaView style={styles.safe} edges={['top']}>
  <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    {/* content */}
  </ScrollView>
</SafeAreaView>
</ErrorBoundary>
```

### Loading guard
**Source:** `app/(tabs)/magia.tsx` line 50
**Apply to:** `app/(tabs)/regras.tsx`
```typescript
if (!isLoaded) return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;
```

### RPG theme tokens in use
**Source:** `constants/theme.ts` lines 3–34
**Apply to:** all new files

| Token | Value | Use |
|---|---|---|
| `RPG.bg` | `#0a0806` | Screen background |
| `RPG.surface` | `#181210` | Card / section background |
| `RPG.surfaceAlt` | `#221a12` | Chip / button background |
| `RPG.headerBg` | `#0d0b08` | Title bar background |
| `RPG.gold` | `#c9a84c` | Active/selected color, section titles |
| `RPG.goldDim` | `#7a6020` | Selected chip overlay tint |
| `RPG.goldLight` | `#e8c96a` | Active text |
| `RPG.border` | `#3d2e18` | Default border |
| `RPG.borderLight` | `#5a4422` | Emphasized border |
| `RPG.text` | `#f0e6d3` | Primary text |
| `RPG.textMuted` | `#a89070` | Secondary / placeholder text |
| `RPG.textDark` | `#6a5540` | Placeholder color |

### SectionHeader component
**Source:** `components/rpg/SectionHeader.tsx` lines 1–38
**Apply to:** `app/(tabs)/regras.tsx`, `components/rpg/ProficienciasSection.tsx`
```typescript
import SectionHeader from '@/components/rpg/SectionHeader';
// usage:
<SectionHeader title="Nome da Seção" />
```

### useCallback([update]) setter pattern
**Source:** `store/CharacterContext.tsx` lines 135–168
**Apply to:** new `setNotas` setter and updated `setProficiencias`
```typescript
const setNotas = useCallback((v: string) => update(p => ({ ...p, notas: v })), [update]);
```

---

## No Analog Found

All files have close analogs. No entries in this section.

---

## Metadata

**Analog search scope:** `app/(tabs)/`, `components/rpg/`, `store/`, `types/`, `data/`, `constants/`, `components/ui/`
**Files scanned:** 12
**Pattern extraction date:** 2026-05-15
