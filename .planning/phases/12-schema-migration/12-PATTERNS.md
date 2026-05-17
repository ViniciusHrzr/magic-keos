# Phase 12: Schema & Migration — Pattern Map

**Mapped:** 2026-05-17
**Files analyzed:** 3 modified files
**Analogs found:** 3 / 3

---

## File Classification

| Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------|------|-----------|----------------|---------------|
| `types/character.ts` | model | transform | `types/character.ts` (self — extend existing interface) | exact |
| `store/CharacterContext.tsx` | store / provider | CRUD + transform | `store/CharacterContext.tsx` (self — extend migrate() and setters) | exact |
| `app/(tabs)/magia.tsx` | UI (call-site fix) | request-response | `app/(tabs)/magia.tsx` (self — remove broken sections) | exact |

All three targets are modifications of existing files; no new files are created. The analogs are the files themselves — the patterns to copy are the existing patterns already inside each file.

---

## Pattern Assignments

### `types/character.ts` (model, transform)

**Analog:** `types/character.ts` (self)

**Imports pattern** (lines 1–7):
```typescript
export type DieColor = 'branco' | 'verde' | 'vermelho' | 'preto' | 'azul' | null;
export type AttrDice = [DieColor, DieColor, DieColor, DieColor, DieColor];

export interface SkillValue {
  base: number;
  temp: number;
}
```
New interface follows same export + `interface` convention. Place `EquipItem` before `Character`:
```typescript
export interface EquipItem {
  nome: string;
  tipo: 'basico' | 'artefato';
  melhorias: string[];
  efeito?: string;
  durabilidade?: number;
}
```

**Core field pattern — existing structured fields** (lines 26–32, mana shape for reference):
```typescript
mana: {
  incolor:  { base: number; total: number };
  branco:   { base: number; total: number };
  // ...
};
```
Follow same keyed-object style when widening `equipamentos`:
```typescript
// Before (lines 96–103):
equipamentos: {
  arma: string;
  escudo: string;
  vestimenta: string;
  armadura: string;
  acessorio1: string;
  acessorio2: string;
};

// After:
equipamentos: {
  arma: EquipItem | null;
  escudo: EquipItem | null;
  vestimenta: EquipItem | null;
  armadura: EquipItem | null;
  acessorio1: EquipItem | null;
  acessorio2: EquipItem | null;
};
```
Replace `inventario: string` (line 94) with `inventarioSlots: string[];`.

**defaultCharacter pattern — array initialisation** (lines 165–172):
```typescript
// Existing pattern for fixed-length arrays:
velocidade: { base: 0, temp: 0, boxes: Array(15).fill(false) },
memoria: { base: 0, temp: 0, entries: Array(15).fill('') },
dominios: Array(12).fill(''),
magicas: Array(20).fill(''),
// Old:
inventario: '',
equipamentos: { arma: '', escudo: '', vestimenta: '', armadura: '', acessorio1: '', acessorio2: '' },

// New (copy Array(20).fill('') pattern from magicas/memoria):
inventarioSlots: Array(20).fill('') as string[],
equipamentos: { arma: null, escudo: null, vestimenta: null, armadura: null, acessorio1: null, acessorio2: null },
```

---

### `store/CharacterContext.tsx` (store, CRUD + transform)

**Analog:** `store/CharacterContext.tsx` (self)

**Imports pattern** (lines 1–3):
```typescript
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, defaultCharacter, AttrDice, SkillValue } from '@/types/character';
```
Add `EquipItem` to the named imports from `@/types/character`:
```typescript
import { Character, defaultCharacter, AttrDice, SkillValue, EquipItem } from '@/types/character';
```

**migrate() — accumulative typeof guard pattern** (lines 13–34):
```typescript
function migrate(raw: any): Character {
  const parsed = { ...raw };
  // Guard 1: mana number → object (existing)
  if (parsed.mana) {
    for (const k of ['incolor', 'branco', ...]) {
      if (typeof parsed.mana[k] === 'number') {
        parsed.mana[k] = { base: 0, total: parsed.mana[k] };
      }
    }
  }
  // Guard 2: magicasReceitas rename (existing)
  if (parsed.magicasReceitas !== undefined) { ... }
  // Guard 3: string fields to arrays (existing)
  if (typeof parsed.proficiencias === 'string') parsed.proficiencias = [];
  if (typeof parsed.habilidades === 'string') parsed.habilidades = [];
  // ...
  return { ...defaultCharacter, ...parsed };
}
```
Add two new guards immediately before the `return` statement, following the same independent-`if` style:
```typescript
// Guard NEW-A: inventario string → inventarioSlots array
if (typeof (parsed as any).inventario === 'string') {
  const legacy = (parsed as any).inventario as string;
  parsed.inventarioSlots = [legacy, ...Array(19).fill('')];
  delete (parsed as any).inventario;
}

// Guard NEW-B: equipamentos slot values string → EquipItem | null
if (parsed.equipamentos) {
  const slots = ['arma', 'escudo', 'vestimenta', 'armadura', 'acessorio1', 'acessorio2'] as const;
  for (const slot of slots) {
    const val = (parsed.equipamentos as any)[slot];
    if (typeof val === 'string') {
      (parsed.equipamentos as any)[slot] = val.trim()
        ? { nome: val, tipo: 'basico' as const, melhorias: [] }
        : null;
    }
  }
}
```

**CharacterContextType — existing setter signatures to use as templates** (lines 38–69):
```typescript
// Index-based slot setter (template — setDominio, line 57):
setDominio: (idx: number, v: string) => void;
// Partial-patch setter (template — setVelocidade, line 53):
setVelocidade: (update: Partial<Character['velocidade']>) => void;
// Keyed-object setter (template — setEquipamento, line 59 — to be REPLACED):
setEquipamento: (k: keyof Character['equipamentos'], v: string) => void;
// Simple string setter (template — setInventario, line 58 — to be REPLACED):
setInventario: (v: string) => void;

// Replace the two above with:
setInventarioSlot: (idx: number, v: string) => void;
setEquipamentoItem: (slot: keyof Character['equipamentos'], item: EquipItem | null) => void;
```

**Setter implementations — copy from setDominio / setMagica pattern** (lines 166–173):
```typescript
// TEMPLATE — index setter (line 166–167):
const setDominio = useCallback((idx: number, v: string) =>
  update(p => { const d = [...p.dominios]; d[idx] = v; return { ...p, dominios: d }; }), [update]);

// TEMPLATE — keyed object setter (line 169–170):
const setEquipamento = useCallback((k: keyof Character['equipamentos'], v: string) =>
  update(p => ({ ...p, equipamentos: { ...p.equipamentos, [k]: v } })), [update]);

// NEW implementations:
const setInventarioSlot = useCallback((idx: number, v: string) =>
  update(p => {
    const slots = [...p.inventarioSlots];
    slots[idx] = v;
    return { ...p, inventarioSlots: slots };
  }), [update]);

const setEquipamentoItem = useCallback(
  (slot: keyof Character['equipamentos'], item: EquipItem | null) =>
    update(p => ({ ...p, equipamentos: { ...p.equipamentos, [slot]: item } })),
  [update],
);
```
Remove old `setInventario` and `setEquipamento` const declarations entirely.

**contextValue useMemo — existing pattern** (lines 247–264):
```typescript
const contextValue = useMemo(() => ({
  character, isLoaded,
  setNome, setSabedoria, ...,
  setDominio, setInventario, setEquipamento, setMagica, setReceitas,
  charList, currentId, switchTo, createChar, deleteChar, exportJson, importJson,
}), [
  character, isLoaded, ...,
  setDominio, setInventario, setEquipamento, setMagica, setReceitas,
  ...
]);
```
Swap `setInventario` → `setInventarioSlot` and `setEquipamento` → `setEquipamentoItem` in both the object and the deps array.

---

### `app/(tabs)/magia.tsx` (UI call-site fix, request-response)

**Analog:** `app/(tabs)/magia.tsx` (self)

**Destructure pattern** (lines 15–21):
```typescript
const {
  character: c,
  setVelocidade, setMemoria, setCanalizacao, setFoco,
  setDominio, setInventario, setEquipamento, setMagica, setReceitas,
  isLoaded,
} = useCharacter();
```
Remove `setInventario` and `setEquipamento` from this destructure. They no longer exist in the context.

**Inventário section to remove** (lines 355–365):
```typescript
{/* ── INVENTÁRIO ── */}
<SectionHeader title="Inventário" />
<TextInput
  style={styles.bigTextArea}
  value={c.inventario}          // <-- type error after migration
  onChangeText={setInventario}
  multiline
  placeholder="Itens carregados..."
  placeholderTextColor={RPG.textDark}
  textAlignVertical="top"
/>
```
Delete these 11 lines entirely. The Inventário section moves to mochila.tsx in Phase 13.

**Equipamentos section to remove** (lines 367–382):
```typescript
{/* ── EQUIPAMENTOS ── */}
<SectionHeader title="Equipamentos" />
<View style={styles.equipGrid}>
  {equipSlots.map(({ key, label }) => (
    <View key={key} style={styles.equipCell}>
      <Text style={styles.equipLabel}>{label}</Text>
      <TextInput
        style={styles.equipInput}
        value={c.equipamentos[key]}    // <-- type error: EquipItem | null not string
        onChangeText={v => setEquipamento(key, v)}
        placeholder="—"
        placeholderTextColor={RPG.textDark}
      />
    </View>
  ))}
</View>
```
Delete these 16 lines entirely. The Equipamentos section moves to mochila.tsx in Phase 13.

**equipSlots const to remove** (lines 504–511):
```typescript
const equipSlots = [
  { key: 'arma' as const, label: 'Arma' },
  { key: 'escudo' as const, label: 'Escudo' },
  { key: 'vestimenta' as const, label: 'Vestimenta' },
  { key: 'armadura' as const, label: 'Armadura' },
  { key: 'acessorio1' as const, label: 'Acessório' },
  { key: 'acessorio2' as const, label: 'Acessório' },
];
```
Delete this const — it references the old string-typed equipamentos keys and is unused after section removal.

---

## Shared Patterns

### update() immutable patch pattern
**Source:** `store/CharacterContext.tsx` lines 122–137
**Apply to:** All new setter implementations
```typescript
const update = useCallback((patch: (prev: Character) => Character) => {
  setAllChars(prev => {
    const cur = prev[currentId] ?? defaultCharacter;
    return { ...prev, [currentId]: patch(cur) };
  });
  // Debounced AsyncStorage write
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
All new setters (`setInventarioSlot`, `setEquipamentoItem`) call `update()` — do not bypass this function.

### migrate() final merge pattern
**Source:** `store/CharacterContext.tsx` line 33
**Apply to:** The `migrate()` function — unchanged, but critical to preserve
```typescript
return { ...defaultCharacter, ...parsed };
```
This merge means `defaultCharacter` is the base and `parsed` fields override it. Any field present in `defaultCharacter` but absent in `parsed` gets the default value. Both `inventarioSlots` and the new `equipamentos` null values in `defaultCharacter` must be present before this merge runs — which is why `defaultCharacter` in `types/character.ts` must be updated in the same pass.

### useCallback + [update] deps pattern
**Source:** `store/CharacterContext.tsx` lines 139–173
**Apply to:** Both new setter implementations
```typescript
// All setters follow this exact pattern:
const setXxx = useCallback((...args) =>
  update(p => ({ ...p, field: newValue })), [update]);
```
The dependency array is always `[update]` only — no other deps. This is the established convention for all setters.

---

## No Analog Found

No files in this phase lack an analog — all three files are modifications of existing files with direct in-file precedents.

---

## Metadata

**Analog search scope:** `store/`, `types/`, `app/(tabs)/`
**Files read:** 4 (`CharacterContext.tsx`, `character.ts`, `magia.tsx`, `data/regras/equipamentos.ts`)
**Pattern extraction date:** 2026-05-17
