# CONVENTIONS.md
_Last updated: 2026-05-15_

# Coding Conventions

**Analysis Date:** 2026-05-15

## Naming Patterns

**Files:**
- Screen files: PascalCase matching the route, exported as `default` — `index.tsx`, `magia.tsx`, `grimorio.tsx`
- Component files: PascalCase matching component name — `CharacterManager.tsx`, `NumericStepper.tsx`, `DiceTrack.tsx`
- Hook files: kebab-case with `use-` prefix — `use-color-scheme.ts`, `use-theme-color.ts`
- Platform variants use `.ios.tsx` / `.web.ts` suffixes — `icon-symbol.ios.tsx`, `use-color-scheme.web.ts`
- Data files: kebab-case — `grimoire.ts`, `spell-image-map.json`
- Constants and theme: singular nouns — `theme.ts`, `character.ts`

**Functions:**
- Components: PascalCase — `function FichaScreen()`, `function InstanceBlock()`, `function SpellDetailView()`
- Hooks: camelCase with `use` prefix — `useCharacter()`, `useThemeColor()`, `useColorScheme()`
- Event handlers: `handle` prefix — `handleExport`, `handleImport`, `handleDelete`, `handleSwitch`
- State setters in context: `set` prefix matching the field — `setNome`, `setVida`, `setMana`, `setVeneno`
- Pure helpers: camelCase verbs — `genId()`, `migrate()`, `vidaIcon()`, `getDomainColor()`

**Variables:**
- Local state: camelCase, descriptive — `showManager`, `importText`, `viewSpell`, `viewDomain`
- Context-destructured character: aliased to single letter `c` — `const { character: c } = useCharacter()`
- Constants: SCREAMING_SNAKE_CASE for module-level lookup maps — `COLOR_HEX`, `GRAU_COLORS`, `EFFECTS`, `COLOR_CYCLE`
- Config arrays: SCREAMING_SNAKE_CASE — `COLORS`, `TYPES`, `manaTypes`, `equipSlots`

**Types/Interfaces:**
- Domain interfaces: named by domain — `Character`, `SkillValue`, `CharInfo`, `DomainGroup`
- Component props: always named `Props` (not `ComponentNameProps`) — `interface Props { ... }` in every component file
- Union types: `type` keyword — `type DieColor = 'branco' | 'verde' | ...`
- Tuple types: `type` keyword — `type AttrDice = [DieColor, DieColor, DieColor, DieColor, DieColor]`
- Context interface: `[Name]ContextType` — `interface CharacterContextType { ... }`

## TypeScript Usage Patterns

**Strict mode is enabled** (`"strict": true` in `tsconfig.json`).

**`interface` for object shapes:**
```typescript
// components/rpg/NumericStepper.tsx
interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
  compact?: boolean;
}
```

**`type` for unions and tuples:**
```typescript
// types/character.ts
export type DieColor = 'branco' | 'verde' | 'vermelho' | 'preto' | 'azul' | null;
export type AttrDice = [DieColor, DieColor, DieColor, DieColor, DieColor];
```

**`as const` assertions** for tagged array elements in data configs:
```typescript
// app/(tabs)/index.tsx
const manaTypes = [
  { key: 'incolor' as const, label: 'Inc', color: RPG.incolor, ... },
  { key: 'branco' as const, label: 'Bco', color: RPG.branco, ... },
];

// data/grimoire.ts
{ key: 'arma' as const, label: 'Arma' }
```

**`keyof typeof` for type-safe lookups:**
```typescript
// hooks/use-theme-color.ts
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
)
```

**`Record<K, V>` for typed maps:**
```typescript
// app/(tabs)/grimorio.tsx
const COLOR_HEX: Record<SpellColor, string> = { branco: RPG.branco, ... };
const TYPE_LABELS: Record<SpellType, string> = { '[T]': 'Truque', ... };
```

**Typed sub-object access with `keyof Character['field']`:**
```typescript
// store/CharacterContext.tsx
setVida: (k: keyof Character['vida'], v: number) => void;
setMana: (k: keyof Character['mana'], field: 'base' | 'total', v: number) => void;
```

**Inline prop type annotation** for private sub-components defined within a screen file:
```typescript
// app/(tabs)/index.tsx
function InstanceBlock({ title, ... }: {
  title: string;
  ipBase: number;
  onIpChange: (field: 'ipBase' | 'ipBonus', v: number) => void;
  ...
}) { ... }
```

**`any` usage** exists but is intentional for the data migration function:
```typescript
// store/CharacterContext.tsx
function migrate(raw: any): Character { ... }
```

**Non-null assertion (`!`)** used sparingly when type inference can't narrow:
```typescript
const fillColor = filled ? DIE_COLORS[color!] : 'transparent';
grimoire.find(s => s.dominio === d)!.cor
```

## Component Patterns

**All components are functional components.** No class components are used.

**Default exports** for all screen and component files:
```typescript
export default function NumericStepper({ ... }: Props) { ... }
export default function FichaScreen() { ... }
```

**Named exports** only for context provider and hook:
```typescript
// store/CharacterContext.tsx
export function CharacterProvider({ children }: { children: React.ReactNode }) { ... }
export function useCharacter() { ... }
```

**Sub-components within screen files** — private helper components are defined in the same file as the screen that uses them, not exported:
```typescript
// app/(tabs)/index.tsx — InstanceBlock is defined after FichaScreen, not exported
function InstanceBlock({ ... }) { ... }

// app/(tabs)/grimorio.tsx — SpellDetail and StatPill are private to the file
function SpellDetail({ ... }) { ... }
function StatPill({ ... }) { ... }
```

**`React` import is explicit** in every file:
```typescript
import React from 'react';
// or with hooks:
import React, { useState, useMemo, useCallback } from 'react';
```

**Props typing:** Always a local `interface Props` in each component file, never imported prop types between components.

**Conditional rendering patterns:**
```typescript
// Short-circuit for optional content
{label && <Text style={styles.label}>{label}</Text>}
{!!feedback && <Text style={styles.feedback}>{feedback}</Text>}

// Ternary for two-state content
{importing ? <ImportPanel /> : <CharacterList />}

// Conditional style array
style={[styles.container, compact && styles.compact]}
style={[styles.base, condition && styles.variant, dynamicProp ? { color: dynamicProp } : null]}
```

## State Management Patterns

**Single state layer: React Context + AsyncStorage.** No Zustand, Redux, or other state libraries.

**Context architecture** (`store/CharacterContext.tsx`):
- One `CharacterContext` holding ALL character state
- `allChars: Record<string, Character>` — all characters keyed by generated ID
- `currentId: string` — which character is active
- `character: Character` — derived from `allChars[currentId] ?? defaultCharacter`

**Update pattern** — all mutations go through a single `update` function:
```typescript
const update = useCallback((patch: (prev: Character) => Character) => {
  setAllChars(prev => {
    const cur = prev[currentId] ?? defaultCharacter;
    const next = { ...prev, [currentId]: patch(cur) };
    AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next));
    return next;
  });
}, [currentId]);
```

**Derived setters** call `update` with immutable spreads:
```typescript
const setNome = (v: string) => update(p => ({ ...p, nome: v }));
const setVida = (k: keyof Character['vida'], v: number) =>
  update(p => ({ ...p, vida: { ...p.vida, [k]: v } }));
```

**`useMemo`** for expensive derived data:
```typescript
const charList = useMemo<CharInfo[]>(
  () => Object.entries(allChars).map(([id, c]) => ({ id, name: c.nome || 'Sem nome' })),
  [allChars],
);
```

**`useCallback`** for context-exposed functions that could cause re-renders:
```typescript
const switchTo = useCallback((id: string) => { ... }, []);
const createChar = useCallback(() => { ... }, []);
const deleteChar = useCallback((id: string) => { ... }, [currentId]);
```

**Persistence** — AsyncStorage writes are fire-and-forget (not awaited in setters), except during initial load:
```typescript
// Fire-and-forget:
const setNome = (v: string) => update(p => ({ ...p, nome: v }));
// Inside update(), AsyncStorage.setItem(...) — no await, no error handling

// Awaited only at load time:
const load = async () => {
  try {
    const charsRaw = await AsyncStorage.getItem(CHARS_KEY);
    ...
  } catch {
    // fallback to default character
  }
};
```

**`useCharacter()` hook** enforces provider presence:
```typescript
export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be inside CharacterProvider');
  return ctx;
}
```

**Local UI state** (not in context) for ephemeral view state:
```typescript
const [showManager, setShowManager] = useState(false);   // FichaScreen
const [viewSpell, setViewSpell] = useState<Spell | null>(null);  // MagiaScreen
const [importing, setImporting] = useState(false);        // CharacterManager
```

## Import Organization

**Consistent three-group ordering** (no enforced tooling, manually maintained):

1. React and React Native core
2. Third-party libraries (expo-*, react-native-*)
3. Internal aliases (`@/`)

```typescript
// Example from app/(tabs)/magia.tsx:
import React, { useState, useMemo, useRef } from 'react';
import { ScrollView, View, Text, ... } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import { grimoire, Spell, SpellColor } from '@/data/grimoire';
import spellImages from '@/data/spellImages';
```

**Path alias `@/`** maps to project root, defined in `tsconfig.json`:
```json
"paths": { "@/*": ["./*"] }
```

All internal imports use `@/` — no relative `../` imports are used in the codebase.

## Styling Approach

**`StyleSheet.create({})` exclusively** — no NativeWind, no styled-components, no inline objects in `style` prop (except dynamic values).

**Styles defined at module bottom** in a `const styles = StyleSheet.create({ ... })` block, separated from component code by a comment divider:
```typescript
// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: RPG.bg },
  ...
});
```

**All color values from `RPG` theme object** (`constants/theme.ts`), never hardcoded hex in StyleSheet:
```typescript
// Correct (used throughout):
color: RPG.gold
backgroundColor: RPG.surface

// Exception: semi-transparent overlays and a few hardcoded accent values:
backgroundColor: '#000000bb'   // modal overlays
backgroundColor: '#4a1a1a'     // VenenoTracker specific fill
borderColor: '#ff4444'         // VenenoTracker critical state
```

**Dynamic styles via array syntax:**
```typescript
style={[styles.container, compact && styles.compact]}
style={[styles.base, condition && styles.variant, color ? { color } : null]}
```

**Hex transparency** appended as string for semi-transparent variants:
```typescript
backgroundColor: RPG.gold + '22'    // in CharacterManager
backgroundColor: COLOR_HEX[c] + '33' // in grimorio.tsx
```

**No `gap` in StyleSheet for older RN** — this codebase does use `gap` throughout, which is valid for RN 0.71+:
```typescript
gap: 6,   // used in numerous components
```

## Error Handling Patterns

**Try/catch in async operations with silent fallback:**
```typescript
// store/CharacterContext.tsx — load fails → create fresh character
try {
  const charsRaw = await AsyncStorage.getItem(CHARS_KEY);
  ...
} catch {
  const id = genId();
  const chars = { [id]: { ...defaultCharacter } };
  setAllChars(chars);
  ...
}
```

**Boolean return for parse operations:**
```typescript
const importJson = useCallback((json: string): boolean => {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return false;
    ...
    return true;
  } catch {
    return false;
  }
}, []);
```

**`Alert.alert()` for user-facing errors:**
```typescript
// components/rpg/CharacterManager.tsx
if (ok) {
  setImportText('');
  setImporting(false);
  onClose();
} else {
  Alert.alert('Erro', 'JSON inválido. Verifique o texto e tente novamente.');
}
```

**Inline feedback state** for non-critical errors within UI:
```typescript
// app/(tabs)/grimorio.tsx — SpellDetail
const [feedback, setFeedback] = useState('');
const addMagica = () => {
  const idx = magicas.findIndex(m => !m.trim());
  if (idx === -1) {
    setFeedback('Todos os slots de mágicas estão cheios!');
  } else {
    onAddMagica(idx, spell.nome);
    setFeedback(`"${spell.nome}" adicionada às mágicas!`);
  }
};
```

**No global error boundaries are defined.** No `console.error`/`console.warn` logging.

## Common Patterns Repeated Across Files

**Section layout pattern** (used in `index.tsx` and `magia.tsx`):
```typescript
<SectionHeader title="Section Name" />
<View style={styles.sectionContent}>
  {/* content */}
</View>
```

**Modal bottom-sheet pattern** (used in `CharacterManager`, `magia.tsx`, `grimorio.tsx`):
```typescript
<Modal visible={!!stateVar} transparent animationType="slide" onRequestClose={closeHandler}>
  <View style={styles.modalBg}>     // flex:1, backgroundColor:'#000000bb', justifyContent:'flex-end'
    <View style={styles.modalCard}> // backgroundColor:RPG.surface, borderTopWidth:2, borderTopColor:RPG.gold
      {stateVar && <Content onClose={closeHandler} />}
    </View>
  </View>
</Modal>
```

**KeyboardAvoidingView + SafeAreaView wrapper** (used in `index.tsx` and `magia.tsx`):
```typescript
<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView keyboardShouldPersistTaps="handled">
      ...
    </ScrollView>
  </SafeAreaView>
</KeyboardAvoidingView>
```

**Immutable array update pattern** (used in context and components):
```typescript
const next = [...prev];
next[i] = newValue;
onChange(next);
```

**Clamp utility** for bounded numeric inputs:
```typescript
// NumericStepper.tsx
const clamp = (v: number) => Math.max(min, Math.min(max, v));
// Context:
Math.max(0, Math.min(10, v))   // veneno clamped 0–10
Math.max(0, Math.min(100, v))  // afinidade clamped 0–100
```

**`parseInt(t) || 0` for numeric TextInput parsing:**
```typescript
onChangeText={t => onChange(clamp(parseInt(t) || 0))}
onChangeText={t => onIpChange('ipBase', parseInt(t) || 0)}
```

**Comment dividers** to separate logical sections within a single large file:
```typescript
// ── HEADER ──
// ── SABEDORIA ──
// ── Sub-component: Instance Block ──────────────────────────────────────────
// ── Helpers ────────────────────────────────────────────────────────────────
// ── Styles ─────────────────────────────────────────────────────────────────
```

**Section header convention** — uppercase title, gold color, serif font, letterSpacing, textTransform uppercase appears in both `SectionHeader` component and manually in screen files.

**Data is Portuguese** — all game domain terms, variable names, and user-facing strings are in Portuguese (Brazilian). Code keywords, function names within hooks/helpers are in English.

---

*Convention analysis: 2026-05-15*
