---
phase: 02-qualidade-da-ficha
plan: "02"
subsystem: layout, routing, fonts
tags: [expo-router, expo-font, useFonts, dead-code-removal, stack-navigation]

requires:
  - phase: 01-estabilidade-de-fundacao
    provides: ErrorBoundary wrapping and CharacterContext in RootLayout

provides:
  - fontsLoaded guard in RootLayout blocking render until PlanewalkerDings is ready
  - modal route removed from Stack navigation (app/modal.tsx deleted)
  - Explore phantom tab removed (app/(tabs)/explore.tsx deleted)

affects: [app-layout, tab-navigation, font-rendering]

tech-stack:
  added: []
  patterns:
    - "useFonts guard: const [fontsLoaded] = useFonts({...}); if (!fontsLoaded) return null;"
    - "Dead route removal: delete file + remove corresponding Stack.Screen in same or prior commit"

key-files:
  created: []
  modified:
    - app/_layout.tsx
  deleted:
    - app/modal.tsx
    - app/(tabs)/explore.tsx

key-decisions:
  - "return null (not SplashScreen API) is sufficient to block render until fonts load — D-04"
  - "Variable name fontsLoaded (not loaded/ready) to match must_haves grep criteria"
  - "Delete files with git rm so deletions show as D in git status"

patterns-established:
  - "fontsLoaded guard: destructure useFonts return, guard with if (!fontsLoaded) return null before JSX"

requirements-completed:
  - FICHA-03
  - CODE-02
  - CODE-03

duration: 8min
completed: 2026-05-15
---

# Phase 02, Plan 02: Fonts Guard + Dead Code Removal Summary

**fontsLoaded guard added to RootLayout blocking cold-start glyph flash, and two Expo template orphan files (modal.tsx, explore.tsx) deleted with their Stack.Screen registration**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-15T00:00:00Z
- **Completed:** 2026-05-15T00:08:00Z
- **Tasks:** 2
- **Files modified:** 1 modified, 2 deleted

## Accomplishments
- Cold-start render now gated on `fontsLoaded` — PlanewalkerDings font must load before any tab screen renders (FICHA-03)
- Expo template modal route removed: `app/modal.tsx` deleted and `Stack.Screen name="modal"` removed from `_layout.tsx` (CODE-02)
- Phantom Explore tab eliminated: `app/(tabs)/explore.tsx` deleted — Expo Router auto-drops the tab (CODE-03)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add fontsLoaded guard and remove modal Stack.Screen** - `129249e` (feat)
2. **Task 2: Delete app/modal.tsx and app/(tabs)/explore.tsx** - `93dcdec` (chore)

**Plan metadata:** (committed with SUMMARY.md as docs commit)

## Verification Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | exit 0 (OK) |
| `const [fontsLoaded] = useFonts(` count in `_layout.tsx` | 1 (OK) |
| `if (!fontsLoaded) return null;` count in `_layout.tsx` | 1 (OK) |
| `name="modal"` count in `_layout.tsx` | 0 (OK) |
| `SplashScreen` count in `_layout.tsx` | 0 (OK) |
| `Stack.Screen name="(tabs)"` count in `_layout.tsx` | 1 (OK) |
| `app/modal.tsx` exists | No — not found (OK) |
| `app/(tabs)/explore.tsx` exists | No — not found (OK) |
| `git ls-files` for modal.tsx | empty (OK) |
| `git ls-files` for explore.tsx | empty (OK) |
| References to deleted files (project-wide grep) | 0 matches (OK) |
| `git status` deletions type | D entries (OK) |

## Files Created/Modified

| File | Change | Description |
|------|--------|-------------|
| `app/_layout.tsx` | modified | Added fontsLoaded guard + removed modal Stack.Screen |
| `app/modal.tsx` | deleted | Expo template modal, never connected to app flow |
| `app/(tabs)/explore.tsx` | deleted | 2-line re-export of magia creating phantom Explore tab |

## Decisions Made

- Used `return null` (D-04) instead of SplashScreen API — sufficient to block render, no added complexity
- Variable name `fontsLoaded` (not `loaded` or `ready`) per must_haves grep requirements
- Used `git rm` for file deletions so changes appear as D entries in git status per task instructions
- Note: current `_layout.tsx` did not have `<ErrorBoundary>` wrapping (context docs described it; actual file did not). Changes applied only to what was actually present — no regression.

## Deviations from Plan

None - plan executed exactly as written.

The plan's context described `<ErrorBoundary>` wrapping in `_layout.tsx` (from Phase 1 plan 01-02), but the actual file in the worktree does not have ErrorBoundary. This is not a deviation — the plan's two patches (fontsLoaded guard + remove modal Screen) were applied correctly to the actual file as found.

## Issues Encountered

None.

## Threat Mitigations Applied

| Threat ID | Mitigation Applied |
|-----------|--------------------|
| T-02-04 | `if (!fontsLoaded) return null;` blocks render tree until PlanewalkerDings loaded |
| T-02-05 | `Stack.Screen name="modal"` removed + `app/modal.tsx` deleted together |
| T-02-06 | `app/(tabs)/explore.tsx` deleted — phantom Explore tab eliminated |

## Known Stubs

None — no stubs introduced in this plan.

## Next Phase Readiness

- Tab bar will show only Ficha, Magia, Grimorio at runtime (no Explore tab)
- PlanewalkerDings font gated before first render — no cold-start glyph flash
- Ready for Phase 02 plans 01 and 03 (parallel wave — no dependencies on this plan)

---

## Self-Check: PASSED

| Item | Status |
|------|--------|
| `app/_layout.tsx` exists with fontsLoaded guard | FOUND |
| `app/modal.tsx` deleted | CONFIRMED (not in filesystem or git index) |
| `app/(tabs)/explore.tsx` deleted | CONFIRMED (not in filesystem or git index) |
| Commit 129249e exists | FOUND |
| Commit 93dcdec exists | FOUND |
| TypeScript clean | PASSED |

---
*Phase: 02-qualidade-da-ficha*
*Completed: 2026-05-15*
