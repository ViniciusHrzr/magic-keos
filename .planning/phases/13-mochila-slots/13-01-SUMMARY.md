---
phase: 13-mochila-slots
plan: 01
subsystem: mochila-tab
tags: [tab-bar, equipment-slots, modal-picker, collapsible-cards, layout-animation]
dependency_graph:
  requires: ["12-01"]
  provides: [MOCH-01, EQP-01, EQP-02, EQP-03]
  affects: [app/(tabs)/_layout.tsx, components/ui/icon-symbol.tsx, app/(tabs)/mochila.tsx, app/(tabs)/magia.tsx]
tech_stack:
  added: []
  patterns:
    - "KeyboardAvoidingView + SafeAreaView + ScrollView + Modal — matches magia.tsx scaffold"
    - "LayoutAnimation.configureNext(easeInEaseOut) for collapsible cards"
    - "UIManager.setLayoutAnimationEnabledExperimental(true) Android guard (T-13-03)"
    - "SLOT_KEYS const tuple + SlotKey type for type-safe slot indexing"
    - "pickerSlot-as-render-key pattern: activePickerSlot = pickerSlot ?? 'arma' to avoid undefined in visible=false state"
key_files:
  created:
    - app/(tabs)/mochila.tsx
  modified:
    - components/ui/icon-symbol.tsx
    - app/(tabs)/_layout.tsx
    - app/(tabs)/magia.tsx
decisions:
  - "Dead styles equipGrid/equipCell/equipLabel/equipInput removed from magia.tsx — leftover from Phase 12 that caused MOCH-02 grep to return 1 instead of 0"
  - "activePickerSlot fallback ('arma') used to keep TypeScript happy when Modal is not visible — picker renders correctly only when visible=true"
  - "armadura slot excluded from SLOT_KEYS as planned — compatibility slot not shown in UI"
metrics:
  duration: "~20 minutes"
  completed: "2026-05-17T07:18:00Z"
  tasks_completed: 3
  files_changed: 4
  commits: 3
---

# Phase 13 Plan 01: Aba Mochila — Slots de Equipamento Summary

**One-liner:** Mochila tab with 5 collapsible EquipItem slot cards, fullscreen picker modal backed by data/regras/equipamentos, and custom name TextInput wired to setEquipamentoItem.

## What Was Built

### Task 1 — Register Mochila tab icon and tab bar entry (commit 84830f1)

- `components/ui/icon-symbol.tsx`: Added `'bag.fill': 'backpack'` to MAPPING object between `'square.and.pencil'` and closing `} as IconMapping`.
- `app/(tabs)/_layout.tsx`: Inserted `<Tabs.Screen name="mochila" options={{ title: 'Mochila', tabBarIcon: ... }} />` immediately before the `name="explore"` hidden tab entry.

### Task 2 — Create MochilaScreen (commit ba1f6bb)

Created `app/(tabs)/mochila.tsx` from scratch:

- **5 slots**: `arma`, `escudo`, `vestimenta`, `acessorio1`, `acessorio2` (armadura excluded — compatibility-only slot, not shown in UI)
- **Collapsible cards**: `TouchableOpacity` header with `LayoutAnimation.configureNext(easeInEaseOut)` on toggle; shows label, item name (gold if filled, dim if empty), melhorias count badge, chevron indicator
- **Card body** (expanded): `TextInput` for custom name, "Escolher do livro" button, "Remover item" button (only when slot filled)
- **Picker Modal**: `animationType="slide"`, fullscreen `SafeAreaView`, scrollable list with item name + metadata line per item; selected item highlighted with gold left border
- **Functions**: `pickItem` (preserves tipo/melhorias), `clearSlot` (nulls + collapses), `editNome` (creates EquipItem if slot empty and name non-empty), `toggleExpanded`
- **Android guard**: `UIManager.setLayoutAnimationEnabledExperimental(true)` (mitigates T-13-03)
- **Full StyleSheet** with RPG theme tokens

### Task 3 — Verification + MOCH-02 check (commit 3508565 — fix)

All 5 verification checks passed after removing dead styles:

| Check | Expected | Result | Status |
|-------|----------|--------|--------|
| 1. magia.tsx MOCH-02 grep | 0 | 0 | PASS |
| 2. `bag.fill` in icon-symbol.tsx | >= 1 | 1 | PASS |
| 3. `mochila` in _layout.tsx | >= 1 | 2 | PASS |
| 4. `export default function MochilaScreen` | 1 | 1 | PASS |
| 5. `npx tsc --noEmit` | exit 0 | exit 0 | PASS |

Additional done-criteria checks:
- `setEquipamentoItem` occurrences in mochila.tsx: 5 (>= 2 required)
- `pickerSlot` occurrences in mochila.tsx: 12 (>= 3 required)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed dead equip* styles from magia.tsx**

- **Found during:** Task 3
- **Issue:** Phase 12 removed the Inventário/Equipamentos JSX sections but left 4 dead StyleSheet entries (`equipGrid`, `equipCell`, `equipLabel`, `equipInput`) unreferenced in any JSX. `equipGrid` matched the MOCH-02 grep pattern, returning 1 instead of expected 0.
- **Fix:** Removed all 4 dead style objects from `magia.tsx` StyleSheet. None were referenced in any JSX expression. TypeScript remained clean after removal.
- **Files modified:** `app/(tabs)/magia.tsx`
- **Commit:** `3508565`

## Requirements Delivered

| Requirement | Description | Status |
|-------------|-------------|--------|
| MOCH-01 | Ícone Mochila aparece na tab bar e navega para a tela | Delivered |
| MOCH-02 | Aba Magia não exibe Inventário ou Equipamentos | Verified (0 grep hits) |
| EQP-01 | Usuário pode tocar em slot e escolher item via picker modal | Delivered |
| EQP-02 | Usuário pode digitar/editar nome personalizado em qualquer slot | Delivered |
| EQP-03 | Card colapsado exibe nome e contagem de melhorias | Delivered |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| `84830f1` | feat | Register Mochila tab icon and tab bar entry |
| `ba1f6bb` | feat | Create MochilaScreen with 5 collapsible equipment slots and picker modal |
| `3508565` | fix | Remove dead equip styles from magia.tsx (MOCH-02 verification fix) |

## Known Stubs

None — all data is live from `data/regras/equipamentos.ts`, all state mutations go through `setEquipamentoItem` in CharacterContext.

## Threat Flags

No new threat surface beyond what was in the plan's threat model. T-13-03 (LayoutAnimation Android) is mitigated with `UIManager.setLayoutAnimationEnabledExperimental(true)`.

## Self-Check: PASSED

- `app/(tabs)/mochila.tsx` — exists and contains `export default function MochilaScreen`
- `components/ui/icon-symbol.tsx` — contains `'bag.fill': 'backpack'`
- `app/(tabs)/_layout.tsx` — contains `name="mochila"`
- All 3 commits verified in git log: `84830f1`, `ba1f6bb`, `3508565`
- `npx tsc --noEmit` — exit 0
