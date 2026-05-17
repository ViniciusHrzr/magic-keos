---
phase: 12-schema-migration
plan: "01"
subsystem: schema
tags: [migration, types, context, schema-widening]
dependency_graph:
  requires: []
  provides: [EquipItem-interface, inventarioSlots-field, setInventarioSlot, setEquipamentoItem, migrate-guards]
  affects: [app/(tabs)/magia.tsx, store/CharacterContext.tsx, types/character.ts]
tech_stack:
  added: []
  patterns: [accumulative-typeof-guards, useCallback-update-pattern, as-const-tuple-iteration]
key_files:
  created: []
  modified:
    - types/character.ts
    - store/CharacterContext.tsx
    - app/(tabs)/magia.tsx
decisions:
  - "armadura slot kept in EquipItem migration guard (6 slots total) per RESEARCH.md Open Question 1 — additive carry-forward for Phase 13"
  - "Guard B uses (parsed.equipamentos as any)[slot] cast to handle widening from string to EquipItem | null"
  - "Guard A uses (parsed as any).inventario and delete (parsed as any).inventario to satisfy strict TS after inventario removed from Character interface"
metrics:
  duration_seconds: 165
  completed: "2026-05-17T05:06:35Z"
  tasks_completed: 3
  tasks_total: 3
  files_changed: 3
---

# Phase 12 Plan 01: Schema & Migration Summary

One-liner: TypeScript schema widened to EquipItem | null per equipment slot and 20-slot inventarioSlots array, with backward-compatible migrate() guards converting legacy string-based fichas on load.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add EquipItem interface and widen Character schema | e86722c | types/character.ts |
| 2 | Extend migrate() guards and replace setters in CharacterContext | 4383e41 | store/CharacterContext.tsx |
| 3 | Remove Inventario and Equipamentos sections from magia.tsx | ef41607 | app/(tabs)/magia.tsx |

## TypeScript Compile Gate

`npx tsc --noEmit` exits with **0 errors** after all three tasks. Confirmed output: "TypeScript: No errors found".

After Task 1 only: 2 errors in magia.tsx (expected — resolved in Task 3).
After Task 2 only: 4 errors in magia.tsx (expected — resolved in Task 3).
After Task 3: 0 errors project-wide.

## Migrate() Guard Conditions

No deviations from plan. Guards implemented exactly as specified:

**Guard A (inventario → inventarioSlots):**
- Condition: `typeof (parsed as any).inventario === 'string'`
- Action: `parsed.inventarioSlots = [legacyValue, ...Array(19).fill('')]`
- Cleanup: `delete (parsed as any).inventario`
- Legacy `inventario` field is truly deleted from parsed before the `{ ...defaultCharacter, ...parsed }` merge. A ficha with `inventario = "Corda, Tocha"` will load with `inventarioSlots[0] = "Corda, Tocha"` and `inventarioSlots[1..19] = ''`.

**Guard B (equipamentos string → EquipItem | null):**
- Condition: `parsed.equipamentos` is truthy
- Iteration over const tuple `['arma', 'escudo', 'vestimenta', 'armadura', 'acessorio1', 'acessorio2'] as const`
- Non-empty string → `{ nome: val, tipo: 'basico' as const, melhorias: [] }`
- Empty string → `null`
- Non-string values (already-migrated EquipItem objects or null) pass through untouched
- Pitfall 3 edge case: `delete (parsed as any).inventario` confirmed — field does not survive migrate() merge into defaultCharacter.

## Context Surface Changes

Removed:
- `setInventario: (v: string) => void` — no longer exists anywhere in CharacterContext.tsx
- `setEquipamento: (k: keyof Character['equipamentos'], v: string) => void` — fully removed

Added:
- `setInventarioSlot: (idx: number, v: string) => void` — in CharacterContextType, implementation (useCallback pattern), contextValue object, and deps array
- `setEquipamentoItem: (slot: keyof Character['equipamentos'], item: EquipItem | null) => void` — same four locations

## magia.tsx Call-Site Cleanup

Removed from magia.tsx:
- `setInventario` and `setEquipamento` from useCharacter() destructure
- `{/* ── INVENTÁRIO ── */}` comment + SectionHeader + TextInput block
- `{/* ── EQUIPAMENTOS ── */}` comment + SectionHeader + equipGrid View block
- `equipSlots` const array declaration

Left in place (intentionally, out of scope):
- `styles.equipGrid`, `styles.equipCell`, `styles.equipLabel`, `styles.equipInput` — dead style entries, Phase 13 may reuse or remove in mochila.tsx

## Manual Cold-Start Smoke Test

Automated compile gate passed. Manual smoke test is deferred to human verification at end-of-phase per `workflow.human_verify_mode=end-of-phase`.

Expected test procedure:
1. Start app on device/emulator with legacy ficha in AsyncStorage
2. Verify no TypeScript error overlay
3. Verify character name, atributos, magicas, etc. display correctly
4. For legacy `inventario = "Corda, Tocha"`: inspect via export JSON — `inventarioSlots[0]` should contain the value
5. For legacy `equipamentos.arma = "Espada Longa"`: inspect via export JSON — should be `{ nome: "Espada Longa", tipo: "basico", melhorias: [] }`

## Open Question: armadura Slot (Phase 13)

Per RESEARCH.md Open Question 1: `armadura` is kept in the 6-slot equipamentos tuple. REQUIREMENTS.md EQP-01 mentions 5 slots without armadura. The discrepancy is intentional — armadura is carried additively into this phase's migration guard. Phase 13 must resolve whether to expose the armadura slot in the Mochila UI or remove it from the schema.

**Flag for Phase 13:** Decision needed on `equipamentos.armadura` — expose in Mochila tab UI (6 slots) or remove from Character interface and migration guard (5 slots to match EQP-01). Removal in Phase 13 would require an additional migrate() guard to drop the field.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `types/character.ts` exists and contains `export interface EquipItem {` — FOUND
- `store/CharacterContext.tsx` exists and contains `setInventarioSlot` — FOUND
- `app/(tabs)/magia.tsx` exists and does not contain `setInventario` — CONFIRMED
- Commit e86722c exists — CONFIRMED
- Commit 4383e41 exists — CONFIRMED
- Commit ef41607 exists — CONFIRMED
- `npx tsc --noEmit` exits 0 — CONFIRMED
