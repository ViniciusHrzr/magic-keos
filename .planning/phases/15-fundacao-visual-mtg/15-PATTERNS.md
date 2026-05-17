# Phase 15: Fundação Visual MTG - Pattern Map

**Mapped:** 2026-05-17
**Files analyzed:** 4 new/modified files
**Analogs found:** 4 / 4

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `constants/theme.ts` | config | transform | `constants/theme.ts` (self — delta update) | exact |
| `components/rpg/LegendaryFrame.tsx` | component | request-response (props in → JSX out) | `components/rpg/HexSlot.tsx` | role-match |
| `app/(tabs)/index.tsx` | screen | request-response | `app/(tabs)/index.tsx` (self — surgical edit) | exact |
| `package.json` | config | — | `package.json` (self — add dep) | exact |

---

## Pattern Assignments

### `constants/theme.ts` (config, transform)

**Analog:** `constants/theme.ts` itself (in-place delta update — no new file)

**Current mana block** (lines 21–33):
```typescript
// Mana & identity colors
branco: '#e8e0cc',
verde: '#3a8a3a',
vermelho: '#b52020',
preto: '#2a2030',
azul: '#1a5ab0',

brancoLight: '#f5f0e0',
verdeLight: '#4aaa4a',
vermelhoLight: '#e03030',
pretoLight: '#6a5882',
azulLight: '#2878e0',

incolor: '#888070',
```

**Target delta (6 base keys → MTG canonical hex):**
```typescript
branco:   '#F8F2E2',   // marfim MTG
verde:    '#00733E',   // floresta profunda MTG
vermelho: '#D3202A',   // carmesim MTG
preto:    '#150B00',   // ônix MTG
azul:     '#0E68AB',   // safira MTG
incolor:  '#A6ADB5',   // pedra cinza MTG
```

**Downstream consumers of mana tokens** (files that must be visually re-checked after the update):
- `components/rpg/AfinidadeSection.tsx` — uses `RPG.branco`, `RPG.verde`, `RPG.vermelho`, `RPG.preto`, `RPG.azul` as badge `backgroundColor`; note hardcoded `text: '#111'` for branco and `text: '#aaa'` for preto (lines 6–11) — these text contrasts must be verified against new bg colors
- `app/(tabs)/index.tsx` — `manaTypes` array uses `RPG.branco`, `RPG.verde`, `RPG.vermelho`, `RPG.preto`, `RPG.azul` as `diamondColor` and `RPG.verdeLight`/`RPG.vermelhoLight`/`RPG.pretoLight`/`RPG.azulLight` as `color` (lines 252–259)
- `components/rpg/DieBubble.tsx`, `components/rpg/HabilidadesSection.tsx`, `components/rpg/SpellDetailCard.tsx`, `app/(tabs)/mochila.tsx`, `app/(tabs)/magia.tsx`, `app/(tabs)/regras.tsx`, `constants/spell-constants.ts` — also import RPG mana tokens (verify none use `RPG.preto` as a foreground text color on dark surfaces)

**AfinidadeSection mana token pattern** (analog for how color values flow — `components/rpg/AfinidadeSection.tsx` lines 5–11):
```typescript
const COLORS = [
  { key: 'branco' as const, label: 'B', bg: RPG.branco, text: '#111' },
  { key: 'verde' as const, label: 'V', bg: RPG.verde, text: '#fff' },
  { key: 'vermelho' as const, label: 'V', bg: RPG.vermelho, text: '#fff' },
  { key: 'preto' as const, label: 'P', bg: RPG.preto, text: '#aaa' },
  { key: 'azul' as const, label: 'A', bg: RPG.azul, text: '#fff' },
];
```
Pattern insight: the `text` companion color is hardcoded per entry, not derived from the RPG token — this is safe and will not break when base colors change.

**Token structure convention** (lines 1–34 of `constants/theme.ts`):
```typescript
import { Platform } from 'react-native';

export const RPG = {
  // ... structural tokens ...
  // Mana & identity colors
  branco: '#...',
  // ...
};

export const Colors = { ... };
export const Fonts = Platform.select({ ... });
```
Rule: all new tokens go inside the `RPG` object; no standalone exports for individual colors.

---

### `components/rpg/LegendaryFrame.tsx` (component, request-response)

**Analog:** `components/rpg/HexSlot.tsx` — same role (pure visual component in `components/rpg/`, accepts typed props, renders RPG-styled UI, uses `StyleSheet.create`, imports from `@/constants/theme`)

**Imports pattern** (copy structure from `components/rpg/HexSlot.tsx` lines 1–6, swap non-Skia imports):
```typescript
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { RPG } from '@/constants/theme';
```

**Props interface pattern** (copy from `components/rpg/HexSlot.tsx` lines 15–33 — typed interface, exported):
```typescript
// HexSlot pattern (lines 15–33) — LegendaryFrame should follow same convention:
export interface LegendaryFrameProps {
  nome: string;
  onNomeChange: (v: string) => void;
  sabedoriaAcumulada: number;
  sabedoriaDisponivel: number;
  onFichasPress: () => void;
  width: number;   // passed from onLayout — avoids Pitfall 4 (zero-size canvas)
}
```

**Core visual pattern — Canvas + absoluteFill overlay** (from RESEARCH.md Pattern 3, no codebase analog exists yet):
```typescript
// FRAME_HEIGHT and CHAMFER are module-level constants (not in StyleSheet)
const FRAME_HEIGHT = 80;
const CHAMFER = 12;

function makeChamferPath(w: number, h: number, c: number) {
  const p = Skia.Path.Make();
  p.moveTo(c, 0);
  p.lineTo(w - c, 0);
  p.lineTo(w, c);
  p.lineTo(w, h - c);
  p.lineTo(w - c, h);
  p.lineTo(c, h);
  p.lineTo(0, h - c);
  p.lineTo(0, c);
  p.close();
  return p;
}

// Component render — two Paths (fill + stroke) inside Canvas,
// RN children overlaid with StyleSheet.absoluteFill:
<View style={{ height: FRAME_HEIGHT }}>
  <Canvas style={StyleSheet.absoluteFill}>
    <Path path={makeChamferPath(width, FRAME_HEIGHT, CHAMFER)}
          color={RPG.headerBg} style="fill" />
    <Path path={makeChamferPath(width, FRAME_HEIGHT, CHAMFER)}
          color={RPG.gold} style="stroke" strokeWidth={2} />
  </Canvas>
  <View style={[StyleSheet.absoluteFill, styles.overlay]}>
    {/* RN children here */}
  </View>
</View>
```

**onLayout width measurement pattern** (prevents Pitfall 4 — zero-size canvas on first render):
```typescript
// Caller pattern in index.tsx (see index.tsx modification section):
const [frameWidth, setFrameWidth] = React.useState(0);
// ...
<View onLayout={e => setFrameWidth(e.nativeEvent.layout.width)}>
  {frameWidth > 0 && <LegendaryFrame width={frameWidth} ... />}
</View>
```

**StyleSheet pattern** (copy from `components/rpg/SectionHeader.tsx` lines 19–38 and `components/rpg/HexSlot.tsx` lines 160–293 — all styles at bottom, no inline objects except for dynamic values):
```typescript
const styles = StyleSheet.create({
  overlay: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  titleRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameTitle: {
    textAlign: 'center',
    color: RPG.gold,
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  fichasBtn: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: RPG.gold,
    borderRadius: 4,
  },
  fichasBtnText: {
    color: RPG.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  nameInput: {
    color: RPG.text,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: RPG.borderLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 200,
    textAlign: 'center',
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  sabedoriaText: {
    color: RPG.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
```
(These style values are copied verbatim from `index.tsx` `titleBar`-related styles at lines 278–326 and `nameInput` at lines 315–326, to preserve visual continuity.)

**Export pattern** (copy from `components/rpg/HexSlot.tsx` line 295):
```typescript
export default React.memo(LegendaryFrame);
```

---

### `app/(tabs)/index.tsx` (screen, request-response — surgical edit)

**Analog:** `app/(tabs)/index.tsx` itself (replace `titleBar` block, add import, add `onLayout` state)

**Import to add** (after existing imports block, lines 1–19):
```typescript
import LegendaryFrame from '@/components/rpg/LegendaryFrame';
```

**State to add** (after existing `useState(false)` for `showManager`, line 22):
```typescript
const [frameWidth, setFrameWidth] = React.useState(0);
```

**Current titleBar block to replace** (lines 39–54 — the exact block LegendaryFrame supersedes):
```typescript
{/* ── HEADER ── */}
<View style={styles.titleBar}>
  <View style={styles.titleRow}>
    <Text style={styles.gameTitle}>Magic Kéos</Text>
    <TouchableOpacity style={styles.fichasBtn} onPress={() => setShowManager(true)} activeOpacity={0.7}>
      <Text style={styles.fichasBtnText}>Fichas</Text>
    </TouchableOpacity>
  </View>
  <TextInput
    style={styles.nameInput}
    value={c.nome}
    onChangeText={setNome}
    placeholder="Nome do personagem"
    placeholderTextColor={RPG.textDark}
  />
</View>
```

**Replacement pattern:**
```typescript
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
```

**Styles to remove from `index.tsx`** (lines 278–326) — once moved into `LegendaryFrame.tsx`, these become dead code in `index.tsx`:
```typescript
titleBar: { ... },
titleRow: { ... },
gameTitle: { ... },
fichasBtn: { ... },
fichasBtnText: { ... },
nameInput: { ... },
```

**Imports to prune from `index.tsx`** — after extracting titleBar into component, verify these are still used elsewhere in the screen before removing: `Text` (still used in many places), `TextInput` (still used in body sections), `TouchableOpacity` (still used in body). Safe to keep all; only the JSX nodes inside `titleBar` move.

---

### `package.json` (config — add dependency)

**Analog:** `package.json` itself (add one entry to `dependencies`)

**Install command** (do not manually edit — let expo set the correct semver pin):
```bash
npx expo install @shopify/react-native-skia
```

**Resulting entry pattern** (Expo pins with `~`, matching existing dep style at lines 13–41):
```json
"@shopify/react-native-skia": "~2.6.2"
```

**No `app.json` changes needed** — Skia is already included in Expo Go; no plugin registration required for SDK 54.

---

## Shared Patterns

### RPG Token Import
**Source:** Every file in `components/rpg/` — consistent single-line import
**Apply to:** `LegendaryFrame.tsx`
```typescript
import { RPG } from '@/constants/theme';
```

### StyleSheet.create at Module Bottom
**Source:** `components/rpg/SectionHeader.tsx` lines 19–38; `components/rpg/NumericStepper.tsx` lines 49–116; `components/rpg/HexSlot.tsx` lines 160–293
**Apply to:** `LegendaryFrame.tsx`
Rule: all style objects go in a single `StyleSheet.create({})` call at the bottom of the file. No inline style objects except for dynamic values (e.g., `{ color: affinityColor }`).

### Path Alias Imports
**Source:** `app/(tabs)/index.tsx` lines 7–19 — all project imports use `@/` alias, never relative `../../`
**Apply to:** `LegendaryFrame.tsx`
```typescript
import { RPG } from '@/constants/theme';
// NOT: import { RPG } from '../../constants/theme';
```

### React.memo Export
**Source:** `components/rpg/HexSlot.tsx` line 295
**Apply to:** `LegendaryFrame.tsx` — wrap in `React.memo` since it's a pure visual component receiving stable props
```typescript
export default React.memo(LegendaryFrame);
```

### Typed Props Interface (exported)
**Source:** `components/rpg/HexSlot.tsx` lines 15–33 — interface is exported so callers can type-check props
**Apply to:** `LegendaryFrame.tsx`
```typescript
export interface LegendaryFrameProps { ... }
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/rpg/LegendaryFrame.tsx` (Skia Canvas portion) | component | — | No Skia components exist in the codebase yet; the Canvas + PathBuilder pattern comes from RESEARCH.md verified docs, not a codebase analog |

The structural shell of `LegendaryFrame` (props interface, StyleSheet, export pattern) has a strong analog in `HexSlot.tsx`. Only the Skia `Canvas` + `Path` render section has no codebase analog.

---

## Metadata

**Analog search scope:** `components/rpg/`, `app/(tabs)/`, `constants/`
**Files read:** `constants/theme.ts`, `app/(tabs)/index.tsx`, `components/rpg/SectionHeader.tsx`, `components/rpg/NumericStepper.tsx`, `components/rpg/HexSlot.tsx`, `components/rpg/StatPill.tsx`, `components/rpg/AfinidadeSection.tsx`, `package.json`
**Files checked for mana token spread:** 10 files (via grep)
**Pattern extraction date:** 2026-05-17
