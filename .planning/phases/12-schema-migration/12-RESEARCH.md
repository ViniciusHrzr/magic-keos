# Phase 12: Schema & Migration — Research

**Researched:** 2026-05-17
**Domain:** TypeScript schema design, React Context setters, AsyncStorage migration
**Confidence:** HIGH

---

## Summary

Phase 12 is a pure TypeScript/data-layer change with no new packages and no UI. It has three
distinct sub-problems: (1) add the `EquipItem` interface and widen the `Character` type, (2) extend
`CharacterContext` with typed setters for the new fields, and (3) extend the existing `migrate()`
function to silently upgrade legacy string-based equipment and inventory data.

The codebase has a clear and well-understood precedent for all three. `migrate()` already handles
type-shape changes using accumulative `typeof` guards and `{ ...defaultCharacter, ...parsed }` merging.
`CharacterContext` already has slot-level setters (e.g., `setDominio(idx, v)`, `setMagica(idx, v)`)
and partial-patch setters (e.g., `setVelocidade(update: Partial<...>)`) — the new setters follow
exactly these two patterns.

The key risk is TypeScript strictness: the existing `magia.tsx` calls `c.equipamentos[key]` typed
as `string` and passes strings to `setEquipamento`. These call sites must be updated in the same
pass as the type change to avoid compile errors. No call site touches `inventario` (only
`setInventario` and `setInventario` in magia.tsx) — the rename to `inventarioSlots: string[]` is
similarly confined.

**Primary recommendation:** Widen both types in `types/character.ts`, update `defaultCharacter`,
extend `migrate()` with two new guards, add new setters to `CharacterContext`, and fix the three
affected call sites in `magia.tsx` — all in one plan.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SCHEMA-01 | Schema de Character migra automaticamente: `inventario: string` → `inventarioSlots: string[]` (20 slots) e `equipamentos: { arma: string, ... }` → `equipamentos: { [slot]: EquipItem \| null }`, preservando nomes de itens já preenchidos como `{ nome: existingString, tipo: 'basico', melhorias: [] }` | migrate() pattern exists in CharacterContext; EquipItem shape defined by success criteria; magia.tsx call sites identified |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| EquipItem type definition | Data layer (types/) | — | Pure TypeScript interface, no runtime component |
| Character schema migration | Store layer (store/CharacterContext.tsx) | — | migrate() already lives there; runs at cold-start load |
| Context setters for new fields | Store layer (store/CharacterContext.tsx) | — | All setters are co-located in CharacterContext |
| defaultCharacter update | Data layer (types/character.ts) | — | defaultCharacter is exported from types/ |
| Call-site update in magia.tsx | UI layer (app/(tabs)/magia.tsx) | — | Must type-check against new signature |

---

## Standard Stack

### Core (no new packages — all existing)

| Library / File | Current Version | Purpose | Role in This Phase |
|----------------|-----------------|---------|-------------------|
| TypeScript | ~5.9.2 | Static typing with `strict: true` | Define `EquipItem` interface, widen `Character` |
| `@react-native-async-storage/async-storage` | ^2.2.0 | Persistence layer | Reads legacy JSON; migrate() transforms at load |
| React Context (`store/CharacterContext.tsx`) | — | State management | Add new setters; extend migrate() |
| `types/character.ts` | — | Single source of truth for Character shape | Widen equipamentos + add inventarioSlots |

**No new npm packages are required for this phase.** [VERIFIED: codebase inspection]

---

## Package Legitimacy Audit

No external packages are installed in this phase.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
AsyncStorage (JSON blob)
        |
        v
  load useEffect in CharacterProvider
        |
        v  for each character record
   migrate(raw: any) ─── [GUARD 1] typeof inventario === 'string'
        |                        → inventarioSlots = [inventario, '', '', ...(×19)]
        |                           delete inventario
        |             ─── [GUARD 2] typeof equipamentos.arma === 'string' (etc.)
        |                        → equipamentos.arma = { nome: raw, tipo:'basico', melhorias:[] }
        |
        v
  { ...defaultCharacter, ...parsed }
        |
        v
  Character (new shape) stored in allChars state
        |
        v  via CharacterContext
  components read c.equipamentos[slot]: EquipItem | null
                  c.inventarioSlots[idx]: string
```

### Recommended Project Structure

No new directories. Only these files change:

```
types/
└── character.ts        # EquipItem interface; widen Character; update defaultCharacter
store/
└── CharacterContext.tsx # migrate() guards; new setters; updated CharacterContextType
app/(tabs)/
└── magia.tsx           # Update equipamentos call sites from string to EquipItem
```

### Pattern 1: Accumulative typeof guards in migrate()

**What:** Each migration guard is an independent `if` block that checks for the *old* shape
and upgrades it. Guards never assume another guard has run first.

**When to use:** Whenever the on-disk schema shape changes.

**Example (existing guards — verbatim from codebase):**
```typescript
// Source: store/CharacterContext.tsx lines 14-34
function migrate(raw: any): Character {
  const parsed = { ...raw };
  if (parsed.mana) {
    for (const k of ['incolor', 'branco', ...]) {
      if (typeof parsed.mana[k] === 'number') {
        parsed.mana[k] = { base: 0, total: parsed.mana[k] };
      }
    }
  }
  if (typeof parsed.proficiencias === 'string') parsed.proficiencias = [];
  // ...more guards...
  return { ...defaultCharacter, ...parsed };
}
```
[VERIFIED: store/CharacterContext.tsx]

**New guards to add (Phase 12):**
```typescript
// Guard A: inventario string → inventarioSlots array
if (typeof (parsed as any).inventario === 'string') {
  const legacy = (parsed as any).inventario as string;
  parsed.inventarioSlots = [
    legacy,
    ...Array(19).fill(''),
  ];
  delete (parsed as any).inventario;
}

// Guard B: equipamentos slot values string → EquipItem
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

### Pattern 2: Index-based slot setter (existing pattern from setDominio / setMagica)

**What:** A single setter receives `(idx: number, v: T)`, copies the array immutably, and calls
the shared `update()` function.

**When to use:** Any fixed-length array slot in Character.

**Example (existing):**
```typescript
// Source: store/CharacterContext.tsx lines 166-168
const setDominio = useCallback((idx: number, v: string) =>
  update(p => { const d = [...p.dominios]; d[idx] = v; return { ...p, dominios: d }; }), [update]);
```
[VERIFIED: store/CharacterContext.tsx]

**New setter for inventarioSlots:**
```typescript
const setInventarioSlot = useCallback((idx: number, v: string) =>
  update(p => {
    const slots = [...p.inventarioSlots];
    slots[idx] = v;
    return { ...p, inventarioSlots: slots };
  }), [update]);
```

### Pattern 3: Typed slot setter for equipamentos

**What:** A setter receives `(slot: keyof Character['equipamentos'], item: EquipItem | null)`.

**New setter:**
```typescript
const setEquipamentoItem = useCallback(
  (slot: keyof Character['equipamentos'], item: EquipItem | null) =>
    update(p => ({ ...p, equipamentos: { ...p.equipamentos, [slot]: item } })),
  [update],
);
```

Note: The legacy `setEquipamento(k, v: string)` in the context interface will be **replaced** by
`setEquipamentoItem(k, item: EquipItem | null)`. The magia.tsx call site currently renders
`c.equipamentos[key]` as a plain string input — this section moves to the new Mochila tab in
Phase 13, so the minimal fix for Phase 12 is to **remove or comment out** the Equipamentos
section rendering in magia.tsx rather than re-implement it for the new type (the section is
relocating in Phase 13 anyway).

### Anti-Patterns to Avoid

- **Replacing `inventario` field name in-place:** Using `inventario: string[]` instead of
  `inventarioSlots: string[]` breaks backward compat more confusingly. Use the distinct name
  so migrate() can detect the old shape reliably by field name.
- **Widening `equipamentos` slot type to `string | EquipItem`:** This forces every consumer to
  check the type at runtime. The migrate() function must fully normalize to `EquipItem | null`
  before returning, so callers always see the new shape.
- **Assuming magia.tsx compiles without touching it:** TypeScript strict mode will reject
  `c.equipamentos.arma` (now `EquipItem | null`) being passed to a `TextInput value` prop that
  expects `string`. The equipamentos rendering block must be removed or stubbed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Persistence during migration | Custom migration runner or version-stamp system | Extend existing `migrate()` with additive guards | Established pattern; already handles ≥3 schema versions cleanly |
| New state management | Redux, Zustand, Jotai | Existing React Context + `update()` | Architecture is validated; adding new fields follows the same pattern |
| Type narrowing in consumers | Manual `typeof` checks everywhere | TypeScript discriminated union via `tipo: 'basico' | 'artefato'` | Allows consumers to narrow without instanceof |

**Key insight:** The existing migrate() pattern is explicitly designed for accumulation —
STATE.md documents "migrate() usa guards acumulativos por tipo — SCHEMA-01 amplia esse padrão".
Phase 12 is purely additive: two new guards in migrate(), two new setters in context.

---

## Runtime State Inventory

> This is NOT a rename/refactor phase — it is a schema migration. The inventory below documents
> what persists on-device and how it transitions.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | AsyncStorage key `@magic_keos_chars_v2`: JSON blob with `inventario: string` and `equipamentos: { arma: string, ... }` in existing fichas | migrate() guard runs at cold-start — no manual data migration needed |
| Live service config | None — app is fully local, no external services | None |
| OS-registered state | None | None |
| Secrets/env vars | None | None |
| Build artifacts | None | None |

**Key migration detail:** The migration is purely forward-converting. Old fichas with
`inventario: ""` become `inventarioSlots[0] = ""` with the other 19 slots empty — the display
is equivalent. Old fichas with `equipamentos.arma = ""` become `equipamentos.arma = null` (empty
string treated as null sentinel by the guard). Old fichas with `equipamentos.arma = "Espada"`
become `equipamentos.arma = { nome: "Espada", tipo: "basico", melhorias: [] }`.

---

## Common Pitfalls

### Pitfall 1: magia.tsx type errors at compile time

**What goes wrong:** After widening `equipamentos` slots to `EquipItem | null`, the equipamentos
rendering block in magia.tsx (lines 368–383) passes `c.equipamentos[key]` to a TextInput `value`
prop typed `string`. TypeScript strict mode rejects this immediately.

**Why it happens:** The rendering was written for the old `string` schema. The new type no longer
satisfies the TextInput prop.

**How to avoid:** Remove or comment out the Equipamentos section from magia.tsx in this phase.
It is being relocated to mochila.tsx in Phase 13. Removing it now avoids a temporary
broken-UI state and unblocks TypeScript compilation.

**Warning signs:** `tsc --noEmit` output containing "Type 'EquipItem | null' is not assignable
to type 'string'".

### Pitfall 2: setEquipamento vs setEquipamentoItem naming collision

**What goes wrong:** If the old `setEquipamento(k, v: string)` is not removed from the context
interface when `setEquipamentoItem(k, EquipItem | null)` is added, two setters with different
type signatures coexist, confusing Phase 13 implementers.

**Why it happens:** Incremental extension without removing the old surface.

**How to avoid:** Delete `setEquipamento` from the context type, the implementation, and the
`contextValue` / `useMemo` deps array in the same commit that adds `setEquipamentoItem`.

### Pitfall 3: inventario field surviving migrate() if guard condition misses edge cases

**What goes wrong:** A ficha where `inventario` is `undefined` (never set) or `null` would not
trigger `typeof parsed.inventario === 'string'`, leaving the field absent and defaultCharacter
providing an empty `inventarioSlots` — this is actually fine. But if `inventario` were somehow
a non-string truthy value (impossible in practice but defensive coding matters), the guard skips
and the old key persists.

**Why it happens:** Overly narrow guard condition.

**How to avoid:** Guard should be `if (parsed.inventario !== undefined)` OR
`if ('inventario' in parsed)` as a belt-and-suspenders catch. Either works; the former is simpler.

**Warning signs:** `c.inventario` still present on character object after migration.

### Pitfall 4: EquipItem interface `melhorias` type needs to match Phase 14 craft data

**What goes wrong:** If `melhorias` is typed as `string[]`, Phase 14 will likely want a richer
type. Changing it then would require another migration.

**Why it happens:** Underspecifying the type now to save time.

**How to avoid:** Success criterion SC-1 specifies `melhorias` as the type for the array but
does not specify the element type. Given Phase 14 (CRAFT-01/02/03) adds structured melhorias
from a known list, type `melhorias` as `string[]` now (melhoria names from data/regras/equipamentos.ts)
— this is sufficient for Phase 14 to append strings and is easy to read.

### Pitfall 5: defaultCharacter not updated to match new shape

**What goes wrong:** `defaultCharacter` still has `inventario: ''` and `equipamentos: { arma: '' ... }`.
The `{ ...defaultCharacter, ...parsed }` merge in migrate() would re-inject the old fields.

**Why it happens:** Forgetting that migrate() merges with defaultCharacter as base.

**How to avoid:** Update `defaultCharacter` in `types/character.ts` simultaneously with the
interface change. Remove `inventario`, add `inventarioSlots: Array(20).fill('')`. Change
`equipamentos` values from `''` to `null`.

---

## Code Examples

### EquipItem interface definition (to add to types/character.ts)

```typescript
// Source: Derived from SCHEMA-01 success criteria (SC-1)
export interface EquipItem {
  nome: string;
  tipo: 'basico' | 'artefato';
  melhorias: string[];
  efeito?: string;
  durabilidade?: number;
}
```

### Updated Character interface (changed fields only)

```typescript
// Before:
inventario: string;
equipamentos: {
  arma: string;
  escudo: string;
  vestimenta: string;
  armadura: string;
  acessorio1: string;
  acessorio2: string;
};

// After:
inventarioSlots: string[];   // 20-element array
equipamentos: {
  arma: EquipItem | null;
  escudo: EquipItem | null;
  vestimenta: EquipItem | null;
  armadura: EquipItem | null;
  acessorio1: EquipItem | null;
  acessorio2: EquipItem | null;
};
```

### Updated defaultCharacter (changed fields only)

```typescript
inventarioSlots: Array(20).fill('') as string[],
equipamentos: {
  arma: null,
  escudo: null,
  vestimenta: null,
  armadura: null,
  acessorio1: null,
  acessorio2: null,
},
```

### New CharacterContextType entries

```typescript
// Replace:
setInventario: (v: string) => void;
setEquipamento: (k: keyof Character['equipamentos'], v: string) => void;

// With:
setInventarioSlot: (idx: number, v: string) => void;
setEquipamentoItem: (slot: keyof Character['equipamentos'], item: EquipItem | null) => void;
```

### magia.tsx — remove the Equipamentos section

Lines 367–383 of magia.tsx render `SectionHeader title="Equipamentos"` and a `View equipGrid`.
These lines must be **deleted** (along with the `equipSlots` const at lines 504–511) in Phase 12.
The same applies to the `setInventario` and `setEquipamento` destructures from `useCharacter()`.
The Inventário section (lines 355–366) is also removed — it moves to the Mochila tab in Phase 13.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `equipamentos.arma: string` | `equipamentos.arma: EquipItem \| null` | Phase 12 | Enables structured craft and artefato support |
| `inventario: string` (free text) | `inventarioSlots: string[]` (20 named slots) | Phase 12 | Enables INV-01/INV-02 grid in Phase 14 |

**Deprecated/outdated after this phase:**
- `setInventario(v: string)` → replaced by `setInventarioSlot(idx, v)`
- `setEquipamento(k, v: string)` → replaced by `setEquipamentoItem(k, item)`
- `inventario: string` field in Character → replaced by `inventarioSlots: string[]`

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `melhorias` in EquipItem typed as `string[]` (melhoria names) is sufficient for Phase 14 | Code Examples | Phase 14 may need a richer type; requires another migrate() guard |
| A2 | Empty string `equipamentos.arma = ""` should migrate to `null`, not `{ nome: "", tipo: "basico", melhorias: [] }` | Common Pitfalls | Spurious empty-nome EquipItem objects; Phase 13 UI would need to guard for empty nome |
| A3 | Removing the Equipamentos and Inventário rendering from magia.tsx is acceptable in Phase 12 (before the Mochila tab exists) | Architecture Patterns | User loses access to these fields momentarily; acceptable since they move to mochila.tsx in Phase 13 |

---

## Open Questions

1. **Should `armadura` slot be kept or removed?**
   - What we know: Current `equipamentos` has `armadura: string` as a sixth slot. REQUIREMENTS.md
     lists only 5 slots in EQP-01 (Arma, Escudo, Vestimenta, Acessório 1, Acessório 2). magia.tsx
     renders 6 slots including `armadura`.
   - What's unclear: Whether `armadura` is deprecated (merged into `vestimenta`) or kept separate.
   - Recommendation: Carry `armadura` forward in the schema for now (additive safe); Phase 13 plan
     can decide whether to expose it in the UI. Dropping it now would require yet another migration.

2. **Should the migrate() guard use `'inventario' in parsed` or `typeof parsed.inventario === 'string'`?**
   - What we know: `inventario` was always initialized to `''` in defaultCharacter, so
     `typeof === 'string'` is correct for all real saved data.
   - Recommendation: Use `typeof parsed.inventario === 'string'` to match existing guard style.

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — pure TypeScript/code changes only).

---

## Validation Architecture

`nyquist_validation: true` is set in config.json.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed (testes automatizados deferred to v2 per STATE.md) |
| Config file | none |
| Quick run command | `npx tsc --noEmit` (TypeScript compile check) |
| Full suite command | `npx tsc --noEmit` |

No jest/vitest/testing-library is present in the project. The Nyquist validation for this phase
is TypeScript compilation correctness — `tsc --noEmit` must exit 0 after all changes.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCHEMA-01 (SC-1) | EquipItem interface compiles with strict TS | type-check | `npx tsc --noEmit` | ❌ Wave 0: enforce via tsc only |
| SCHEMA-01 (SC-2) | Context setters typed correctly | type-check | `npx tsc --noEmit` | ❌ |
| SCHEMA-01 (SC-3) | String→EquipItem migration preserves nome | manual | App cold-start with legacy ficha | ❌ manual |
| SCHEMA-01 (SC-4) | inventario→inventarioSlots migration | manual | App cold-start with legacy ficha | ❌ manual |
| SCHEMA-01 (SC-5) | App cold-starts without crash | manual smoke | Run app, check no error overlay | ❌ manual |

### Sampling Rate

- **Per task commit:** `npx tsc --noEmit`
- **Per wave merge:** `npx tsc --noEmit`
- **Phase gate:** `npx tsc --noEmit` exits 0 AND manual smoke test passes

### Wave 0 Gaps

- [ ] No test framework to install — tsc is already available via devDependencies
- [ ] Manual smoke test procedure: back up AsyncStorage with an existing ficha, apply changes,
      cold-start app, verify no TypeScript error overlay, verify character data intact

*(No automated test files need to be created — project has no test infrastructure in v1.3 scope.)*

---

## Security Domain

> This phase has no authentication, input from external sources, cryptography, or network I/O.
> All data is read/written from local AsyncStorage. No ASVS categories apply.
> Security domain: SKIPPED (local-only data transformation, no external inputs).

---

## Sources

### Primary (HIGH confidence)

- `store/CharacterContext.tsx` — migrate() pattern, setter patterns, CharacterContextType shape [VERIFIED: codebase]
- `types/character.ts` — Current Character interface and defaultCharacter [VERIFIED: codebase]
- `app/(tabs)/magia.tsx` — equipamentos and inventario call sites [VERIFIED: codebase]
- `.planning/REQUIREMENTS.md` — SCHEMA-01 exact specification [VERIFIED: codebase]
- `.planning/STATE.md` — "migrate() usa guards acumulativos por tipo — SCHEMA-01 amplia esse padrão" [VERIFIED: codebase]

### Secondary (MEDIUM confidence)

- `data/regras/equipamentos.ts` — melhorias and equipment data structures Phase 14 will use [VERIFIED: codebase]
- `.planning/ROADMAP.md` — Phase 12 success criteria (SC-1 through SC-5) [VERIFIED: codebase]

### Tertiary (LOW confidence)

- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages, existing patterns verified from source
- Architecture: HIGH — migrate() and setter patterns are verbatim from codebase
- Pitfalls: HIGH — identified from static analysis of the actual files that need changing

**Research date:** 2026-05-17
**Valid until:** No expiry — pure internal codebase research, stable until Phase 12 is implemented
