# Phase 2: Qualidade da Ficha - Pattern Map

**Mapped:** 2026-05-15
**Files analyzed:** 7 (5 modified, 1 created, 2 deleted)
**Analogs found:** 6 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/_layout.tsx` | config/layout | request-response | self (existing file, targeted edit) | exact |
| `app/(tabs)/index.tsx` | component | request-response | `components/rpg/NumericStepper.tsx` (component to import) | exact |
| `constants/spell-constants.ts` | config/constants | — | `constants/theme.ts` | exact |
| `app/(tabs)/magia.tsx` | component | request-response | `app/(tabs)/grimorio.tsx` (same constants to remove) | exact |
| `app/(tabs)/grimorio.tsx` | component | request-response | `app/(tabs)/magia.tsx` (same constants to remove) | exact |
| `app/modal.tsx` | — | — | none (DELETE) | — |
| `app/(tabs)/explore.tsx` | — | — | none (DELETE) | — |

---

## Pattern Assignments

### `app/_layout.tsx` — Add fontsLoaded guard + remove modal Stack.Screen

**Role:** layout config | **Data flow:** request-response

**Current state** (`app/_layout.tsx` lines 14–32):
```tsx
export default function RootLayout() {
  useFonts({
    PlanewalkerDings: require('@/assets/fonts/PlanewalkerDings.otf'),
  });

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

**Target state — two minimal patches:**

Patch A (D-03): destructure useFonts return and add guard (lines 15–17 become):
```tsx
  const [fontsLoaded] = useFonts({
    PlanewalkerDings: require('@/assets/fonts/PlanewalkerDings.otf'),
  });
  if (!fontsLoaded) return null;
```

Patch B (D-08): remove the modal Stack.Screen entirely (line 25):
```tsx
// DELETE this line:
<Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
```

**No new imports needed** — `useFonts` is already imported at line 6.

---

### `app/(tabs)/index.tsx` — Replace two IP TextInputs with NumericStepper

**Role:** component | **Data flow:** request-response

**Current TextInput pattern** (`index.tsx` lines 229–252, inside InstanceBlock):
```tsx
<View style={styles.ipRow}>
  <Text style={styles.ipLabel}>IP BASE</Text>
  <TextInput
    style={styles.ipInput}
    value={ipBase === 0 ? '' : String(ipBase)}
    onChangeText={t => onIpChange('ipBase', parseInt(t) || 0)}
    keyboardType="numeric"
    maxLength={3}
    selectTextOnFocus
    placeholder="0"
    placeholderTextColor={RPG.textDark}
  />
  <Text style={[styles.ipLabel, { marginLeft: 8 }]}>BÔNUS</Text>
  <TextInput
    style={styles.ipInput}
    value={ipBonus === 0 ? '' : String(ipBonus)}
    onChangeText={t => onIpChange('ipBonus', parseInt(t) || 0)}
    keyboardType="numeric"
    maxLength={3}
    selectTextOnFocus
    placeholder="0"
    placeholderTextColor={RPG.textDark}
  />
</View>
```

**NumericStepper component API** (`components/rpg/NumericStepper.tsx` lines 5–15):
```tsx
interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;   // default: 0  <-- already enforces non-negative
  max?: number;   // default: 999
  label?: string;
  color?: string;
  compact?: boolean;
}
```

**Target state — replacement pattern:**
```tsx
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
```

**Import:** `NumericStepper` is already imported at `index.tsx` line 12 — no import change needed.

**Style note:** The `styles.ipInput` rule on `TextInput` will become unused; can be removed from the StyleSheet at planner's discretion (or left as dead style — minimal change principle applies).

---

### `constants/spell-constants.ts` — New file (constants extraction)

**Role:** config/constants | **Data flow:** none (pure data)

**Analog pattern** (`constants/theme.ts` lines 1–34):
```ts
import { Platform } from 'react-native';      // (only if platform-specific needed)

export const RPG = { ... };                   // named export, plain object literal
export const Colors = { ... };                // multiple named exports in one file
```

**Source data to copy exactly** from `grimorio.tsx` lines 21–27 and 36 (confirmed identical to `magia.tsx` lines 334–340 and 347):
```ts
// grimorio.tsx lines 21–27:
const COLOR_HEX: Record<SpellColor, string> = {
  branco: RPG.branco,
  verde: RPG.verdeLight,
  vermelho: RPG.vermelhoLight,
  preto: RPG.pretoLight,
  azul: RPG.azulLight,
};

// grimorio.tsx line 36:
const GRAU_COLORS = ['#888', RPG.gold, RPG.goldLight, '#fff'];
```

**Target file structure for `constants/spell-constants.ts`:**
```ts
import { RPG } from '@/constants/theme';
import { SpellColor } from '@/data/grimoire';

export const COLOR_HEX: Record<SpellColor, string> = {
  branco: RPG.branco,
  verde: RPG.verdeLight,
  vermelho: RPG.vermelhoLight,
  preto: RPG.pretoLight,
  azul: RPG.azulLight,
};

export const GRAU_COLORS = ['#888', RPG.gold, RPG.goldLight, '#fff'];
```

**Notes for executor:**
- Add `export` keyword to both constants (they were `const` locally in each file).
- `SpellColor` import comes from `@/data/grimoire` — same as both consumer files already import it.
- Internal variable names and values must be byte-for-byte identical to the originals.

---

### `app/(tabs)/magia.tsx` — Remove local COLOR_HEX/GRAU_COLORS, import from spell-constants

**Role:** component | **Data flow:** request-response

**Lines to delete** (`magia.tsx` lines 334–347):
```tsx
const COLOR_HEX: Record<SpellColor, string> = {
  branco: RPG.branco,
  verde: RPG.verdeLight,
  vermelho: RPG.vermelhoLight,
  preto: RPG.pretoLight,
  azul: RPG.azulLight,
};

function getDomainColor(name: string): string | null {     // <-- KEEP this function, only delete above
  ...
}
const GRAU_COLORS = ['#888', RPG.gold, RPG.goldLight, '#fff'];
```

**Precise delete range:** lines 334–340 (COLOR_HEX block) and line 347 (GRAU_COLORS). Line 342–346 (`getDomainColor` function) must be kept.

**Import line to add** (alongside existing imports at top of file):
```tsx
import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';
```

**Existing import block reference** (`magia.tsx` lines 1–12):
```tsx
import React, { useState, useMemo, useRef } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import NumericStepper from '@/components/rpg/NumericStepper';
import CheckboxGrid from '@/components/rpg/CheckboxGrid';
import MemoGrid from '@/components/rpg/MemoGrid';
import { grimoire, Spell, SpellColor } from '@/data/grimoire';
import spellImages from '@/data/spellImages';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
```

Add new import after line 12 (after ErrorBoundary import).

---

### `app/(tabs)/grimorio.tsx` — Remove local COLOR_HEX/GRAU_COLORS, import from spell-constants

**Role:** component | **Data flow:** request-response

**Lines to delete** (`grimorio.tsx` lines 21–27 and line 36):
```tsx
// DELETE lines 21–27:
const COLOR_HEX: Record<SpellColor, string> = {
  branco: RPG.branco,
  verde: RPG.verdeLight,
  vermelho: RPG.vermelhoLight,
  preto: RPG.pretoLight,
  azul: RPG.azulLight,
};

// DELETE line 36:
const GRAU_COLORS = ['#888', RPG.gold, RPG.goldLight, '#fff'];
```

**Lines 29–35 between these two deletions must be kept** (TYPE_LABELS and other constants):
```tsx
const TYPE_LABELS: Record<SpellType, string> = {
  '[T]': 'Truque',
  '[E]': 'Encantamento',
  '[F]': 'Feitiço',
  '[C]': 'Criatura',
};
```

**Import line to add** (after existing imports at top of file):
```tsx
import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';
```

**Existing import block reference** (`grimorio.tsx` lines 1–10):
```tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { grimoire, domains, Spell, SpellColor, SpellType } from '@/data/grimoire';
import { RPG } from '@/constants/theme';
import { useCharacter } from '@/store/CharacterContext';
import spellImages from '@/data/spellImages';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';
```

Add new import after line 10 (after ErrorBoundary import).

---

### `app/modal.tsx` — DELETE

**Action:** Delete file entirely.
**Current content:** Expo template modal (lines 1–29). Never referenced by any app screen other than `_layout.tsx`'s `Stack.Screen name="modal"`, which is also being removed (Patch B above).
**No migration needed** — zero usages in app navigation flow.

---

### `app/(tabs)/explore.tsx` — DELETE

**Action:** Delete file entirely.
**Current content** (lines 1–2):
```tsx
// This file is intentionally left empty — tab removed from navigation.
export { default } from './magia';
```
**Effect of deletion:** Expo Router will automatically remove the "Explore" tab. No other file references `explore.tsx`.

---

## Shared Patterns

### Constants File Convention
**Source:** `constants/theme.ts`
**Apply to:** `constants/spell-constants.ts` (new file)
- Named exports (not default export)
- One `import` at top for dependencies
- Plain object literals, no classes or functions
- No `as const` required (D-07 leaves typing at executor's discretion)

### Import Path Alias
**Source:** All existing files use `@/` prefix
**Apply to:** All import additions in this phase
```ts
import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';
```

### isLoaded Guard Pattern (for reference — already applied, do not duplicate)
**Source:** `app/(tabs)/index.tsx` line 29, `app/(tabs)/magia.tsx` line 49
```tsx
if (!isLoaded) return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;
```
The fontsLoaded guard in `_layout.tsx` is a `return null` (simpler), consistent with D-04.

---

## No Analog Found

No files in this phase are truly novel in pattern — all changes are replacements or deletions of existing code. The new `constants/spell-constants.ts` follows `constants/theme.ts` directly.

---

## Metadata

**Analog search scope:** `app/`, `app/(tabs)/`, `components/rpg/`, `constants/`
**Files read:** 8 (`_layout.tsx`, `index.tsx`, `magia.tsx`, `grimorio.tsx`, `modal.tsx`, `explore.tsx`, `NumericStepper.tsx`, `theme.ts`)
**Pattern extraction date:** 2026-05-15
