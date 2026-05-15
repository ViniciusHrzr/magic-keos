---
phase: 02-qualidade-da-ficha
plan: "03"
subsystem: constants, magia, grimorio
tags: [refactor, constants, deduplication, magia, grimorio]
completed: "2026-05-15T10:04:00Z"
duration: "~2 minutes"

dependency_graph:
  requires: []
  provides: [shared-spell-constants]
  affects:
    - app/(tabs)/magia.tsx
    - app/(tabs)/grimorio.tsx
  created:
    - constants/spell-constants.ts

tech_stack:
  added: []
  patterns:
    - constants extraction to shared module (follows constants/theme.ts convention)
    - named exports only (no default export)

key_files:
  created:
    - constants/spell-constants.ts
  modified:
    - app/(tabs)/magia.tsx
    - app/(tabs)/grimorio.tsx

decisions:
  - D-05: Created constants/spell-constants.ts with COLOR_HEX and GRAU_COLORS as named exports
  - D-06: Both magia.tsx and grimorio.tsx import from @/constants/spell-constants; local definitions removed
  - D-07: Filename spell-constants.ts (English, kebab-case) consistent with constants/theme.ts
---

# Phase 02 Plan 03: Shared Spell Constants Summary

**One-liner:** Extracted duplicate COLOR_HEX and GRAU_COLORS into a single constants/spell-constants.ts source-of-truth, imported by magia.tsx and grimorio.tsx, satisfying CODE-01.

## Tasks Completed

### Task 1: Create constants/spell-constants.ts
Created `constants/spell-constants.ts` exporting `COLOR_HEX` (a `Record<SpellColor, string>` mapping the five spell colors to their RPG theme hex values) and `GRAU_COLORS` (a four-element string array for grau pip colors). The file imports `RPG` from `@/constants/theme` and `SpellColor` from `@/data/grimoire`. Named exports only; no default export. Values are byte-for-byte identical to the originals in both consumer files.

**Commit:** c106dc7

### Task 2: Update magia.tsx and grimorio.tsx to import shared constants
Added `import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';` to both screen files (after the existing `ErrorBoundary` import in each). Removed the local `COLOR_HEX` definition (7-line block) and local `GRAU_COLORS` definition (1 line) from both files. Preserved `getDomainColor` function in magia.tsx and `TYPE_LABELS`, `COLORS`, `TYPES`, `COLOR_LABELS`, `TYPE_LABELS_SHORT` in grimorio.tsx. TypeScript exits 0; no rendering logic changed.

**Commit:** 945175c

## Verification Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` exits 0 | PASS |
| `constants/spell-constants.ts` exists | PASS |
| `app/(tabs)/magia.tsx` exists | PASS |
| `app/(tabs)/grimorio.tsx` exists | PASS |
| `export const COLOR_HEX` appears once in spell-constants.ts | PASS |
| `export const GRAU_COLORS` appears once in spell-constants.ts | PASS |
| `import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';` in magia.tsx | PASS |
| `import { COLOR_HEX, GRAU_COLORS } from '@/constants/spell-constants';` in grimorio.tsx | PASS |
| `const COLOR_HEX: Record<SpellColor, string> = {` not in magia.tsx (0 matches) | PASS |
| `const COLOR_HEX: Record<SpellColor, string> = {` not in grimorio.tsx (0 matches) | PASS |
| `const GRAU_COLORS = ['#888'` not in magia.tsx (0 matches) | PASS |
| `const GRAU_COLORS = ['#888'` not in grimorio.tsx (0 matches) | PASS |
| `function getDomainColor` still in magia.tsx | PASS |
| `const TYPE_LABELS: Record<SpellType, string> = {` still in grimorio.tsx | PASS |
| `COLOR_HEX` usages in magia.tsx (4 — import + getDomainColor + SpellDetailView + render) | PASS |
| `GRAU_COLORS` usages in magia.tsx (5 — import + render usages) | PASS |
| `COLOR_HEX` usages in grimorio.tsx (5 — import + render usages) | PASS |
| `GRAU_COLORS` usages in grimorio.tsx (3 — import + render usages) | PASS |

## Deviations from Plan

None — plan executed exactly as written.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `constants/spell-constants.ts` | Created | Single source-of-truth for COLOR_HEX and GRAU_COLORS |
| `app/(tabs)/magia.tsx` | Modified | Added shared import, removed 8 lines of local definitions |
| `app/(tabs)/grimorio.tsx` | Modified | Added shared import, removed 8 lines of local definitions |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| c106dc7 | feat | Create constants/spell-constants.ts with shared COLOR_HEX and GRAU_COLORS |
| 945175c | refactor | Update magia.tsx and grimorio.tsx to import shared spell constants |

## Known Stubs

None. All constants are wired to RPG theme tokens; no placeholder values.

## Threat Flags

None. The new constants module exports plain literal data; no new network endpoints, auth paths, or trust boundaries introduced.

## Self-Check: PASSED

- [x] `constants/spell-constants.ts` exists at `C:\Users\edysano\Desktop\magic-keos\.claude\worktrees\agent-a5f2512dc27569e5b\constants\spell-constants.ts`
- [x] `app/(tabs)/magia.tsx` exists and contains import from `@/constants/spell-constants`
- [x] `app/(tabs)/grimorio.tsx` exists and contains import from `@/constants/spell-constants`
- [x] Commit c106dc7 exists in git log
- [x] Commit 945175c exists in git log
- [x] TypeScript exits 0
- [x] CODE-01 satisfied: COLOR_HEX and GRAU_COLORS exist in exactly one file
