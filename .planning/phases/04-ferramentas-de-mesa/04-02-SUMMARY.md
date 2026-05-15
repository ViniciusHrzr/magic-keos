---
phase: 04-ferramentas-de-mesa
plan: 02
subsystem: ui
tags: [react-native, typescript, chips, character-model, migration]

# Dependency graph
requires:
  - phase: 04-01
    provides: notas field in Character + CharacterContext; Regras tab registered in layout
provides:
  - proficiencias field typed as string[] with migration guard (string -> [])
  - data/proficiencias.ts with 15-pericias taxonomy (CORPO/MENTE/ESPIRITO)
  - ProficienciasSection component with collapsible rows and toggleable gold chips
  - Ficha tab shows structured chip picker instead of free-text TextInput for proficiencias
affects:
  - any future phase reading c.proficiencias (now string[], not string)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - chip-key format 'periciaKey:profNome' for stable AsyncStorage persistence
    - Set<string> local state for expanded sections in collapsible list component
    - Partial<Record<PericiaKey, PericiaData>> for typed sparse taxonomy map

key-files:
  created:
    - data/proficiencias.ts
    - components/rpg/ProficienciasSection.tsx
  modified:
    - types/character.ts
    - store/CharacterContext.tsx
    - app/(tabs)/index.tsx

key-decisions:
  - "D-04: proficiencias field is string[] with default []; migration converts any legacy string to []"
  - "D-05: data/proficiencias.ts uses Partial<Record> so each instancia only contains its own pericias"
  - "D-06: ProficienciasSection owns its SectionHeader; index.tsx removes the outer one to avoid duplicate title"
  - "chip key format 'periciaKey:profNome' chosen for human-readable and collision-safe keys in storage"

patterns-established:
  - "Chip multi-select: string[] selected prop + onChange callback; add via [...selected, key], remove via filter"
  - "Collapsible list: useState<Set<string>> for expanded keys; toggle by Set copy-mutate"
  - "Data taxonomy file: pure typed exports (no JSX, no default export, no side effects)"

requirements-completed: [MESA-02, MESA-03]

# Metrics
duration: 15min
completed: 2026-05-15
---

# Phase 04 Plan 02: Proficiencias Chip Picker Summary

**Toggleable chip picker with 15-pericias CORPO/MENTE/ESPIRITO taxonomy replaces free-text proficiencias field, backed by string[] migration-safe character model**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-15T00:00:00Z
- **Completed:** 2026-05-15T00:15:00Z
- **Tasks:** 3
- **Files modified:** 5 (3 modified, 2 created)

## Accomplishments
- Character.proficiencias changed from string to string[] with migration guard converting legacy strings to []
- data/proficiencias.ts: complete typed taxonomy of 15 pericias (5 CORPO + 5 MENTE + 5 ESPIRITO) with verbatim PT-BR strings from CONTEXT.md
- ProficienciasSection component: collapsible rows per pericias with gold-highlighted toggleable chips; chip key format 'periciaKey:profNome' persists via AsyncStorage through character context
- app/(tabs)/index.tsx: single-line replacement of SectionHeader+TextInput block with ProficienciasSection; zero TypeScript errors project-wide

## Task Commits

Each task was committed atomically:

1. **Task 1: Atualizar Character.proficiencias para string[], migration guard e setter** - `95227c6` (feat)
2. **Task 2: Criar data/proficiencias.ts e components/rpg/ProficienciasSection.tsx** - `7083727` (feat)
3. **Task 3: Substituir TextInput de proficiencias por ProficienciasSection em index.tsx** - `d2ab7e4` (feat)

## Files Created/Modified
- `types/character.ts` - proficiencias field changed from string to string[]; defaultCharacter updated to []
- `store/CharacterContext.tsx` - migration guard added; setProficiencias signature updated to (v: string[])
- `data/proficiencias.ts` - typed taxonomy: InstanciaKey, PericiaKey, PericiaData, ProficienciasMap, proficiencias const, periciaOrdem list
- `components/rpg/ProficienciasSection.tsx` - collapsible pericias list with multi-select chips; Props {selected: string[], onChange: (v: string[]) => void}
- `app/(tabs)/index.tsx` - ProficienciasSection import added; SectionHeader+TextInput block replaced with single JSX line

## Decisions Made
- ProficienciasSection renders its own SectionHeader internally; the outer SectionHeader in index.tsx was removed to avoid duplicate "Proficiencias" titles
- Chip key format 'periciaKey:profNome' (e.g. 'artesMarciais:Derrubar') is stable, human-readable, and prevents cross-pericias key collisions
- ProficienciasMap uses Partial<Record<PericiaKey, PericiaData>> because each instancia only declares its own 5 pericias

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

None - all 15 pericias and their proficiencias are fully wired with real data from data/proficiencias.ts.

## Threat Flags

None - no new network endpoints, auth paths, or file access patterns introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Ficha tab proficiencias section is feature-complete
- Phase 04 is fully complete (04-01 Regras tab + 04-02 Proficiencias chip picker)
- c.proficiencias is now string[] — any future phase reading this field should use array operations

## Self-Check: PASSED
- `types/character.ts` exists and contains `proficiencias: string[]` and `proficiencias: []`
- `store/CharacterContext.tsx` contains migration guard at line 30
- `data/proficiencias.ts` exists (112 lines, 6 exports, 15 labels, verbatim strings verified)
- `components/rpg/ProficienciasSection.tsx` exists (140 lines)
- `app/(tabs)/index.tsx` contains ProficienciasSection import and usage
- Commits 95227c6, 7083727, d2ab7e4 verified in git log
- `npx tsc --noEmit` reports zero errors

---
*Phase: 04-ferramentas-de-mesa*
*Completed: 2026-05-15*
