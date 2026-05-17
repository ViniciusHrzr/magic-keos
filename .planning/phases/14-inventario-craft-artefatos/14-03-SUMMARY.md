---
phase: 14-inventario-craft-artefatos
plan: 03
status: complete
completed: 2026-05-17
requirements: [INV-01, INV-02]
subsystem: inventory-types
tags: [types, schema, migration, context]
dependency_graph:
  requires: []
  provides: [InventoryItem-type, migrate-guard-C, inventory-setters]
  affects: [types/character.ts, store/CharacterContext.tsx]
tech_stack:
  added: []
  patterns: [discriminated-union, type-guard, useCallback-setter]
key_files:
  created:
    - types/inventory.ts
  modified:
    - types/character.ts
    - store/CharacterContext.tsx
decisions:
  - Used `import type` in character.ts to break circular reference with inventory.ts
  - inventarioSlots made optional (not added) since it never existed in schema; kept for migrate Guard C type safety
  - Guard C migrates any legacy inventarioSlots string[] data to IQuickNote items preserving text
metrics:
  duration: ~8min
  completed_date: 2026-05-17
  tasks: 3
  files: 3
---

# Phase 14 Plan 03: Inventário Type System — IQuickNote/IStructuredGear + migrate guard C

**One-liner:** Discriminated-union `InventoryItem` type (IQuickNote | IStructuredGear) with migrate guard C and three new context setters.

## What Was Built

### types/inventory.ts (NEW)
Defines the full inventory type system:
- `IQuickNote` — lightweight note item (`type: 'note'`, text, qty)
- `IStructuredGear` — RPG equipment item (`type: 'gear'`, name, type_equip, damage/defense, affinity, melhorias, lore)
- `InventoryItem` — discriminated union of both
- `isQuickNote()` and `isStructuredGear()` — type guards for narrowing

### types/character.ts (MODIFIED)
- Added `import type { InventoryItem }` (type-only to avoid circular import at runtime)
- Added `inventarioSlots?: string[]` — optional, deprecated field for migrate() Guard C type safety
- Added `inventarioItems: InventoryItem[]` — the new canonical inventory array
- Added `inventarioItems: []` to `defaultCharacter`

### store/CharacterContext.tsx (MODIFIED)
- Added `import { InventoryItem }` import
- Added **Guard C** in `migrate()`: converts any legacy `inventarioSlots: string[]` to `InventoryItem[]` notes, removes the old field, and ensures `inventarioItems` always exists as an array
- Added 3 new setters to `CharacterContextType` interface and `CharacterProvider`:
  - `addInventarioItem(item)` — appends item to array
  - `removeInventarioItem(id)` — filters by id
  - `updateInventarioItem(id, patch)` — patches item by id with spread
- All 3 setters added to `contextValue` useMemo and deps array

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] No setInventarioSlot in existing code**
- **Found during:** Task 3
- **Issue:** Plan said "add after setInventarioSlot" and "KEEP setInventarioSlot", but this function never existed in the codebase
- **Fix:** Added the 3 new setters after `setInventario` instead; no need to "keep" a nonexistent function
- **Files modified:** store/CharacterContext.tsx

**2. [Rule 2 - Correctness] Circular import risk**
- **Found during:** Task 2
- **Issue:** `character.ts` → `inventory.ts` → `character.ts` (for DieColor) creates a circular dependency
- **Fix:** Used `import type { InventoryItem }` in character.ts so the circular reference is type-only and safe at runtime
- **Files modified:** types/character.ts

## Verification

- `npx tsc --noEmit` → exit 0 (no errors)
- `grep -c "inventarioItems" types/character.ts` → 3 (>= 2 required)
- `grep -c "addInventarioItem" store/CharacterContext.tsx` → 4 (>= 3 required)
- `grep -c "Guard C" store/CharacterContext.tsx` → 1 (>= 1 required)

## Self-Check: PASSED
- types/inventory.ts: FOUND
- types/character.ts: MODIFIED (inventarioItems + inventarioSlots?)
- store/CharacterContext.tsx: MODIFIED (Guard C + 3 setters)
- Commit 1fbdc73: FOUND
