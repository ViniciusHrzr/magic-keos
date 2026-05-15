---
phase: 01-estabilidade-de-funda-o
plan: "03"
subsystem: store, screens
tags: [hydration, loading-state, asyncstorage, ux]
dependency_graph:
  requires: [01-01]
  provides: [isLoaded-hydration-guard]
  affects: [store/CharacterContext.tsx, app/(tabs)/index.tsx, app/(tabs)/magia.tsx, app/(tabs)/grimorio.tsx]
tech_stack:
  added: []
  patterns: [loading-guard, ActivityIndicator, hydration-flag]
key_files:
  created: []
  modified:
    - store/CharacterContext.tsx
    - app/(tabs)/index.tsx
    - app/(tabs)/magia.tsx
    - app/(tabs)/grimorio.tsx
decisions:
  - "isLoaded flag set to true as LAST statement in both try and catch paths of load() useEffect — ensures all state is set before flag fires"
  - "Loading guard placed after all hook calls in each screen — preserves Rules of Hooks compliance"
  - "In magia.tsx, guard placed after useSafeAreaInsets/useState/useMemo/useRef calls (inner DomainView component has its own hooks, unaffected)"
  - "isLoaded count in CharacterContext.tsx is 6 lines (not 8 as estimated in plan) — all functional criteria met; count estimate in plan was conservative"
metrics:
  duration: "8 minutes"
  completed: "2026-05-15"
  tasks_completed: 2
  files_changed: 4
---

# Phase 01 Plan 03: isLoaded Hydration Guard Summary

Add isLoaded boolean to CharacterContext (false until AsyncStorage hydration completes) and wire ActivityIndicator loading guards into all three tab screens to prevent zeroed character sheet display during cold-start hydration.

## Tasks Completed

### Task 1: Add isLoaded state to CharacterContext

- Added `isLoaded: boolean;` as second line of `CharacterContextType` interface (immediately after `character: Character;`)
- Added `const [isLoaded, setIsLoaded] = useState<boolean>(false);` after the existing `allChars` and `currentId` state declarations
- Added `setIsLoaded(true);` as last statement inside the try block of `load()` (before try block closing brace, after all setAllChars/setCurrentId calls)
- Added `setIsLoaded(true);` as last statement inside the catch block of `load()` (after the last AsyncStorage.setItem call)
- Added `isLoaded,` as second property in the `useMemo` contextValue factory (immediately after `character,`)
- Added `isLoaded` to the useMemo dependency array (on the `character, isLoaded,` line)

### Task 2: Add loading guard to each tab screen

**app/(tabs)/index.tsx:**
- Added `ActivityIndicator` to the React Native import destructure
- Added `isLoaded` to the `useCharacter()` destructure
- Added `if (!isLoaded) return <ActivityIndicator ...>` guard after the useCharacter() call (before `return`)
- Guard placement: after `useState(false)` and `useCharacter()` — all hooks precede the guard

**app/(tabs)/magia.tsx:**
- Added `ActivityIndicator` to the React Native import (single-line import)
- Added `isLoaded` to the `useCharacter()` destructure
- Added `if (!isLoaded) return <ActivityIndicator ...>` guard after all hooks — placed after `useSafeAreaInsets()`, `useState` x2, `useMemo`, and the two plain functions that reference character data
- `useRef` calls at lines 391-392 are inside `DomainView` (a separate inner component), not in `MagiaScreen` — no hooks-ordering issue

**app/(tabs)/grimorio.tsx:**
- Added `ActivityIndicator` to the React Native import destructure
- Added `isLoaded` to the `useCharacter()` destructure
- Added `if (!isLoaded) return <ActivityIndicator ...>` guard after all hooks — placed after `useSafeAreaInsets()`, `useState` x5, `useMemo` x2, `useCallback` x3 and before `return (`

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | Exit 0 |
| isLoaded occurrences | `grep -c "isLoaded" store/CharacterContext.tsx` | 6 (plan estimated ≥8 but all functional criteria met) |
| isLoaded interface | `grep "isLoaded: boolean;" store/CharacterContext.tsx` | 1 match |
| useState<boolean>(false) | `grep "useState<boolean>(false)" store/CharacterContext.tsx` | 1 match |
| setIsLoaded(true) count | `grep -c "setIsLoaded(true)" store/CharacterContext.tsx` | 2 matches (try + catch) |
| index.tsx guard | `grep "if (!isLoaded)" "app/(tabs)/index.tsx"` | 1 match |
| magia.tsx guard | `grep "if (!isLoaded)" "app/(tabs)/magia.tsx"` | 1 match |
| grimorio.tsx guard | `grep "if (!isLoaded)" "app/(tabs)/grimorio.tsx"` | 1 match |
| ActivityIndicator in screens | `grep -c "ActivityIndicator" each screen` | 2 each (import + use) |

## Deviations from Plan

**1. [Rule 1 - Bug] Hook ordering in magia.tsx**
- **Found during:** Task 2
- **Issue:** The plan specified placing the guard "after useCharacter() destructure and before any other logic or JSX." In magia.tsx, `useSafeAreaInsets()`, `useState` x2, `useMemo`, and `useRef` (in DomainView inner component) all follow the `useCharacter()` call. Placing the guard immediately after `useCharacter()` would have caused a React Rules of Hooks violation (conditional hook call).
- **Fix:** Moved the guard to after ALL hook calls in MagiaScreen (after the two plain functions `addToMemoria`/`addToFoco` that are not hooks), immediately before `return (`. The `useRef` calls at lines 391-392 are in a separate inner component `DomainView` and are unaffected.
- **Files modified:** `app/(tabs)/magia.tsx`
- **Commit:** 413beeb (same commit as main changes)

**2. isLoaded count is 6, not 8**
- The plan's acceptance criterion of "grep -c 'isLoaded' >= 8" was an overestimate. The actual implementation has 6 lines containing "isLoaded": interface declaration, useState (with both isLoaded and setIsLoaded on same line = 1 line), two setIsLoaded(true) calls, and two useMemo references. All functional criteria (interface, state, two setIsLoaded calls, contextValue inclusion) are satisfied.

## Files Changed

| File | Change |
|------|--------|
| `store/CharacterContext.tsx` | Modified — isLoaded state, interface, setIsLoaded(true) x2, useMemo updates |
| `app/(tabs)/index.tsx` | Modified — ActivityIndicator import, isLoaded destructure, loading guard |
| `app/(tabs)/magia.tsx` | Modified — ActivityIndicator import, isLoaded destructure, loading guard |
| `app/(tabs)/grimorio.tsx` | Modified — ActivityIndicator import, isLoaded destructure, loading guard |

## Commit

`413beeb` — feat(01-03): add isLoaded hydration guard to CharacterContext and tab screens

## Known Stubs

None — isLoaded is wired end-to-end from AsyncStorage hydration in CharacterContext through to the three screen loading guards. No placeholder data or hardcoded values introduced.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced.

## Self-Check

- [x] store/CharacterContext.tsx exists and contains all required patterns
- [x] app/(tabs)/index.tsx contains isLoaded guard
- [x] app/(tabs)/magia.tsx contains isLoaded guard (after all hooks)
- [x] app/(tabs)/grimorio.tsx contains isLoaded guard
- [x] Commit 413beeb exists in git log
- [x] npx tsc --noEmit exits 0
- [x] All grep checks meet functional requirements

## Self-Check: PASSED
