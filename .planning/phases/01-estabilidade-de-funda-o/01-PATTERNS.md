# Phase 1: Estabilidade de Fundação - Pattern Map

**Mapped:** 2026-05-15
**Files analyzed:** 4 (3 modified, 1 new)
**Analogs found:** 4 / 4

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `store/CharacterContext.tsx` | store/provider | event-driven + CRUD | self (existing file, modify in place) | exact |
| `app/_layout.tsx` | config/layout | request-response | self (existing file, modify in place) | exact |
| `app/(tabs)/_layout.tsx` | config/layout | request-response | self (existing file, modify in place) | exact |
| `components/rpg/ErrorBoundary.tsx` | component/utility | event-driven | `components/rpg/SectionHeader.tsx` (structure); React class component (no existing analog) | partial |

---

## Pattern Assignments

### `store/CharacterContext.tsx` (store/provider, event-driven + CRUD)

**Analog:** self — read the current file at `store/CharacterContext.tsx`

**Existing imports pattern** (lines 1–3):
```typescript
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, defaultCharacter, AttrDice, SkillValue } from '@/types/character';
```
Add `useRef` to the React import destructure (needed for the debounce timer):
```typescript
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
```

**D-04 — isLoaded state: add alongside existing state declarations** (after line 70):
```typescript
const [allChars, setAllChars] = useState<Record<string, Character>>({});
const [currentId, setCurrentId] = useState<string>('');
const [isLoaded, setIsLoaded] = useState<boolean>(false); // ADD THIS
```

**D-04 — setIsLoaded(true) at end of load useEffect** (lines 72–108):

The existing `load()` async function sets state and returns. Add `setIsLoaded(true)` as the **last statement inside the `load()` function, before it closes**, in both the success path and the catch path:
```typescript
// Inside try block, after all setAllChars/setCurrentId calls:
setIsLoaded(true);

// Inside catch block, after all setAllChars/setCurrentId calls:
setIsLoaded(true);
```

**D-01 — debounce ref: declare after state declarations, before `character` derivation** (after line 110):
```typescript
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

**D-01 — debounced update() pattern: replace existing update() at lines 112–119**:
```typescript
const update = useCallback((patch: (prev: Character) => Character) => {
  // Immediate React state update — no debounce on UI
  setAllChars(prev => {
    const cur = prev[currentId] ?? defaultCharacter;
    return { ...prev, [currentId]: patch(cur) };
  });
  // Debounced AsyncStorage write — ~500ms after last call
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    setAllChars(prev => {
      AsyncStorage.setItem(CHARS_KEY, JSON.stringify(prev))
        .catch(err => console.error('AsyncStorage write failed:', err));
      return prev;
    });
  }, 500);
}, [currentId]);
```

**D-02 — fire-and-forget .catch() pattern: apply to ALL bare AsyncStorage.setItem calls.**

The existing pattern (lines 86, 94–96, 163–164, 174–175, 193–194) uses bare `AsyncStorage.setItem(...)` with no error handling. Replace every occurrence with:
```typescript
// BEFORE (existing pattern):
AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next));

// AFTER (D-02 pattern):
AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next))
  .catch(err => console.error('AsyncStorage write failed:', err));
```
Apply to all fire-and-forget calls in: `switchTo`, `createChar`, `deleteChar`, `importJson`, and the load useEffect's setItem calls (lines 86, 94–96).

**D-12 — useCallback on set* functions: lines 121–154 are plain arrow functions with no memoization.**

Pattern to follow — existing useCallback usage (lines 112–119, 161–219):
```typescript
// EXISTING pattern (already uses useCallback):
const update = useCallback((patch: ...) => { ... }, [currentId]);
const switchTo = useCallback((id: string) => { ... }, []);

// APPLY SAME PATTERN to all set* functions. Example:
const setNome = useCallback((v: string) => update(p => ({ ...p, nome: v })), [update]);
const setSabedoria = useCallback((k: 'acumulada' | 'disponivel', v: number) =>
  update(p => ({ ...p, sabedoria: { ...p.sabedoria, [k]: v } })), [update]);
// ... same structure for all remaining set* functions
// Dependency array: [update] for all set* functions (they all call update)
// Exception: setMana, setAttrDice, setSkill — same [update] dep
// Exception: setDominio, setMagica — same [update] dep
```

**D-11 — useMemo on Provider value: replace lines 221–233**:
```typescript
// BEFORE (existing, lines 222–231):
return (
  <CharacterContext.Provider value={{
    character,
    setNome, setSabedoria, ...
  }}>

// AFTER (D-11):
const contextValue = useMemo(() => ({
  character,
  isLoaded,   // ADD — exposes D-04 flag
  setNome, setSabedoria, setVida, setMana, setVeneno, setAfinidade,
  setInstanceIP, setAttrDice, setSkill,
  setProficiencias, setHabilidades,
  setVelocidade, setMemoria, setCanalizacao, setFoco,
  setDominio, setInventario, setEquipamento, setMagica, setReceitas,
  charList, currentId, switchTo, createChar, deleteChar, exportJson, importJson,
}), [
  character, isLoaded,
  setNome, setSabedoria, setVida, setMana, setVeneno, setAfinidade,
  setInstanceIP, setAttrDice, setSkill,
  setProficiencias, setHabilidades,
  setVelocidade, setMemoria, setCanalizacao, setFoco,
  setDominio, setInventario, setEquipamento, setMagica, setReceitas,
  charList, currentId, switchTo, createChar, deleteChar, exportJson, importJson,
]);

return (
  <CharacterContext.Provider value={contextValue}>
    {children}
  </CharacterContext.Provider>
);
```

**D-04 — expose isLoaded via interface: add to CharacterContextType** (lines 35–64):
```typescript
interface CharacterContextType {
  character: Character;
  isLoaded: boolean;   // ADD THIS LINE
  setNome: (v: string) => void;
  // ... rest unchanged
}
```

---

### `app/_layout.tsx` (config/layout, request-response)

**Analog:** self — current file is 29 lines, read in full above.

**Existing imports pattern** (lines 1–7):
```typescript
import { DarkTheme } from '@react-navigation/native';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { CharacterProvider } from '@/store/CharacterContext';
```
Add the ErrorBoundary import:
```typescript
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
```

**D-09 — global ErrorBoundary: wrap the entire return value.**

Current structure (lines 13–29):
```typescript
export default function RootLayout() {
  useFonts({ ... });
  return (
    <CharacterProvider>
      <ThemeProvider value={DarkTheme}>
        ...
      </ThemeProvider>
    </CharacterProvider>
  );
}
```

Modified structure — ErrorBoundary wraps CharacterProvider at the outermost level:
```typescript
export default function RootLayout() {
  useFonts({ ... });
  return (
    <ErrorBoundary>
      <CharacterProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </CharacterProvider>
    </ErrorBoundary>
  );
}
```

---

### `app/(tabs)/_layout.tsx` (config/layout, request-response)

**Analog:** self — current file is 52 lines, read in full above.

**Existing imports pattern** (lines 1–6):
```typescript
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RPG } from '@/constants/theme';
```
Add the ErrorBoundary import:
```typescript
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
```

**D-08 — per-tab ErrorBoundary: wrap each Tabs.Screen's rendered content.**

The existing `<Tabs.Screen>` elements (lines 28–50) define screens by name — they do not render JSX children inline. In Expo Router file-based routing, the screen content is rendered by the corresponding file (e.g., `app/(tabs)/index.tsx`). The boundary must therefore wrap the screen component at the slot level using a layout wrapper around each screen's outlet.

Recommended approach — use Expo Router's `<Slot>` inside each tab's dedicated layout, OR wrap at the `_layout.tsx` level using a `renderScene` / `tabBar` approach. The simplest pattern compatible with this project is to wrap the entire `<Tabs>` component with a single `<ErrorBoundary>` per-tab boundary at the `TabLayout` return level:

```typescript
export default function TabLayout() {
  return (
    <ErrorBoundary>
      <Tabs screenOptions={{ ... }}>
        <Tabs.Screen name="index" options={{ ... }} />
        <Tabs.Screen name="magia" options={{ ... }} />
        <Tabs.Screen name="grimorio" options={{ ... }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
    </ErrorBoundary>
  );
}
```

> **Planner note:** If per-tab isolation (crash on Ficha tab does not affect Magia tab) is required, the boundaries must live inside the individual screen files (`app/(tabs)/index.tsx`, `app/(tabs)/magia.tsx`, `app/(tabs)/grimorio.tsx`) wrapping each screen's root component. A single boundary around `<Tabs>` isolates the tab bar from crashes but not individual tabs from each other. The CONTEXT.md decision D-08 specifies "crash na Ficha não derruba Magia" — planner should decide placement accordingly and document it in the plan.

---

### `components/rpg/ErrorBoundary.tsx` (component/utility, event-driven)

**No direct analog in this codebase** — no existing class component exists. Closest structural analog is `components/rpg/SectionHeader.tsx` for import and export style, and `constants/theme.ts` for styling tokens.

**Structural analog — imports pattern** from `components/rpg/SectionHeader.tsx` (lines 1–3):
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';
```

**Export pattern** from `components/rpg/SectionHeader.tsx` (line 10):
```typescript
export default function SectionHeader(...) { ... }
```
ErrorBoundary uses a class component. Use **named export** (not default) so it can be used as `<ErrorBoundary>` without aliasing:
```typescript
export class ErrorBoundary extends React.Component<Props, State> { ... }
```

**RPG theme tokens to use** (from `constants/theme.ts`):
```typescript
RPG.bg          // '#0a0806' — background
RPG.surface     // '#181210' — card/container surface
RPG.border      // '#3d2e18' — border color
RPG.gold        // '#c9a84c' — title/accent color
RPG.text        // '#f0e6d3' — body text
RPG.textMuted   // '#a89070' — secondary text
RPG.red         // '#c0392b' — error accent color
```

**Standard React class ErrorBoundary pattern to implement** (no analog in codebase — use React documentation pattern):
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo deu errado nesta tela.</Text>
          <Text style={styles.body}>
            Reinicie o app ou navegue para outra aba.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RPG.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: RPG.gold,
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    color: RPG.textMuted,
    fontSize: 13,
    fontFamily: 'serif',
    textAlign: 'center',
    lineHeight: 20,
  },
});
```

---

## Shared Patterns

### useCallback dependency array convention
**Source:** `store/CharacterContext.tsx` lines 112–219
**Apply to:** All new `useCallback` wrappers on set* functions in CharacterContext

The existing project uses `[currentId]` when the callback closes over `currentId`, `[]` when it closes over nothing, and `[allChars, currentId]` when it reads both. For the set* functions being wrapped in D-12, all delegate to `update`, so the dependency is simply `[update]`.

### Fire-and-forget AsyncStorage pattern
**Source:** `store/CharacterContext.tsx` lines 163, 174, 193, 213–214
**Apply to:** All bare `AsyncStorage.setItem(...)` calls outside the debounced `update()`

Every fire-and-forget call must chain `.catch(err => console.error('AsyncStorage write failed:', err))`. No UI alert. No re-throw.

### StyleSheet.create + RPG token usage
**Source:** `components/rpg/SectionHeader.tsx` lines 19–38; `components/rpg/NumericStepper.tsx` lines 49–116
**Apply to:** `components/rpg/ErrorBoundary.tsx` styles

All rpg/ components use a single `const styles = StyleSheet.create({...})` block at the bottom of the file, after the component definition. All color values come from `RPG.*` tokens imported from `@/constants/theme`.

### Path alias convention
**Source:** All files in `store/`, `app/`, `components/rpg/`
**Apply to:** All import statements in modified/new files

Use `@/` alias for all project-internal imports (e.g., `@/constants/theme`, `@/store/CharacterContext`, `@/components/rpg/ErrorBoundary`). Never use relative `../` paths.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `components/rpg/ErrorBoundary.tsx` | component/utility | event-driven | No class component exists in codebase; React ErrorBoundary requires a class component — no functional equivalent exists |

---

## Metadata

**Analog search scope:** `store/`, `app/`, `components/rpg/`, `components/ui/`, `constants/`
**Files scanned:** 9 source files read in full
**Pattern extraction date:** 2026-05-15
