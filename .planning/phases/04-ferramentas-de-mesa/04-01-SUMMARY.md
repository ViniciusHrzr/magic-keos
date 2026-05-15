---
phase: 04-ferramentas-de-mesa
plan: 01
subsystem: ui
tags: [react-native, expo-router, tabs, scroll-view, async-storage, character-model]

# Dependency graph
requires:
  - phase: 03-grimorio-de-feiticos
    provides: Tab layout pattern with grimorio tab, ErrorBoundary, SectionHeader, CharacterContext setter pattern
provides:
  - Aba "Regras" (4th tab) with 8 scrollable sections covering system mechanics
  - notas: string field in Character model with AsyncStorage persistence
  - setNotas setter in CharacterContext (migration guard for legacy characters)
  - list.bullet SF Symbol mapped to Material Icons 'list'
affects: [04-02-proficiencias, any future plan that reads Character.notas]

# Tech tracking
tech-stack:
  added: []
  patterns: [flat-scroll rules reference (no accordion), inline tables via View+Text rows]

key-files:
  created:
    - app/(tabs)/regras.tsx
  modified:
    - types/character.ts
    - store/CharacterContext.tsx
    - app/(tabs)/_layout.tsx
    - components/ui/icon-symbol.tsx

key-decisions:
  - "D-01: notas: string (default '') added to Character interface; migration guard if (!parsed.notas) covers both undefined and empty string"
  - "D-02: flat ScrollView (no accordion) for simplicity on first delivery; 8 sections in canonical order"
  - "D-03: list.bullet SF Symbol mapped to Material Icons 'list' — distinct from book.fill/menu-book already used by Grimório"

patterns-established:
  - "Regras table pattern: tableBlock (RPG.surface bg) > tableRow (flexDirection row) > tableKey (RPG.gold, minWidth 80) + tableMid/tableVal (flex)"
  - "Sub-sections within a rules section use a plain subTitle Text style, NOT SectionHeader, to preserve header hierarchy"

requirements-completed: [MESA-01]

# Metrics
duration: 25min
completed: 2026-05-15
---

# Phase 04 Plan 01: Regras Tab + Notas Summary

**4th tab "Regras" with 8 scrollable rule-reference sections (7 static tables from GAME_RULES.md + 1 persistent Notas TextInput) backed by Character.notas persisted via AsyncStorage**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-05-15T00:00:00Z
- **Completed:** 2026-05-15T00:25:00Z
- **Tasks:** 3
- **Files modified:** 5 (1 created, 4 modified)

## Accomplishments

- Added `notas: string` to Character model and migration guard ensuring legacy characters load without crash
- Created `app/(tabs)/regras.tsx` (300+ lines) with 8 sections, all content faithful to GAME_RULES.md PT-BR
- Registered "Regras" tab after "Grimório" in layout with `list.bullet` icon; TypeScript passes with zero errors

## Task Commits

1. **Task 1: Add notas field, migration, setNotas setter** - `89837e9` (feat)
2. **Task 2: Create Regras screen with 8 sections** - `3a2b3d2` (feat)
3. **Task 3: Register Regras tab and icon mapping** - `11601fe` (feat)

## Files Created/Modified

- `app/(tabs)/regras.tsx` — New screen: ErrorBoundary + SafeAreaView + ScrollView; 8 sections; Notas TextInput wired to c.notas/setNotas
- `types/character.ts` — Added `notas: string` to interface and `notas: ''` to defaultCharacter
- `store/CharacterContext.tsx` — Migration guard, setNotas declaration, useCallback setter, contextValue wiring
- `app/(tabs)/_layout.tsx` — Added `<Tabs.Screen name="regras">` after grimorio
- `components/ui/icon-symbol.tsx` — Added `'list.bullet': 'list'` to MAPPING

## Decisions Made

- Flat ScrollView chosen over accordion (D-02 Claude's Discretion) — simpler first delivery, all content always visible
- Used `list.bullet` → `list` icon mapping (D-03) to distinguish Regras from Grimório which uses `book.fill`
- Migration guard `if (!parsed.notas) parsed.notas = ''` covers both `undefined` (legacy) and falsy empty string

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 04-02 (Proficiências chip picker) can proceed: `proficiencias: string` still in model, setter still compatible
- Character.notas is available and persisted — future plans can read/write it
- All 3 tabs (Ficha/Magia/Grimório) are unaffected; no regressions expected

## Self-Check: PASSED

- `app/(tabs)/regras.tsx` exists (300+ lines, 8 SectionHeader calls, value={c.notas}, onChangeText={setNotas})
- `types/character.ts` has `notas: string` in interface and `notas: ''` in default
- `store/CharacterContext.tsx` has 4 occurrences of setNotas (type, setter, useMemo obj, useMemo deps)
- `app/(tabs)/_layout.tsx` has `name="regras"` after grimorio block
- `components/ui/icon-symbol.tsx` has `'list.bullet': 'list'`
- `npx tsc --noEmit` — TypeScript: No errors found
- Commits: 89837e9, 3a2b3d2, 11601fe all present in git log

---
*Phase: 04-ferramentas-de-mesa*
*Completed: 2026-05-15*
