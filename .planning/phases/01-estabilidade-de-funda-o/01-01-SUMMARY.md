---
phase: 01-estabilidade-de-funda-o
plan: "01"
subsystem: store
tags: [performance, asyncstorage, memoization, debounce]
dependency_graph:
  requires: []
  provides: [debounced-asyncstorage-writes, memoized-character-context]
  affects: [store/CharacterContext.tsx]
tech_stack:
  added: []
  patterns: [useRef-debounce, useCallback-setters, useMemo-provider-value]
key_files:
  created: []
  modified:
    - store/CharacterContext.tsx
decisions:
  - "Debounce window set to 500ms — balances responsiveness vs. write frequency on Android"
  - "All 20 set* functions wrapped in useCallback with [update] dep array"
  - "Provider value memoized via useMemo (contextValue) — prevents tree-wide re-renders"
  - "8 .catch() handlers added to fire-and-forget setItem calls; awaited calls in load useEffect unchanged"
metrics:
  duration: "12 minutes"
  completed: "2026-05-15"
  tasks_completed: 2
  files_changed: 1
---

# Phase 01 Plan 01: Debounce AsyncStorage writes and memoize CharacterContext Summary

Debounce all AsyncStorage writes in CharacterContext (500ms via useRef+setTimeout) and memoize the Provider value object plus all set* functions to eliminate unnecessary re-renders.

## Tasks Completed

### Task 1: Debounce AsyncStorage writes and add .catch() handlers

- Added `useRef` to the React import destructure (line 1)
- Declared `debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)` after state declarations
- Replaced the existing `update()` body: UI state update is immediate (no delay), AsyncStorage write is debounced 500ms. On each call, any pending timer is cleared via `clearTimeout(debounceRef.current)` before a new 500ms timer is set
- The timer's callback uses a functional `setAllChars` updater to read the latest state snapshot, then calls `AsyncStorage.setItem(CHARS_KEY, ...).catch(...)`
- Added `.catch(err => console.error('AsyncStorage write failed:', err))` to all 8 fire-and-forget `setItem` calls: `switchTo` (1), `createChar` (2), `deleteChar` (2), `importJson` (2), and the debounce timer itself (1)
- Awaited `setItem` calls inside `load useEffect` were left unchanged (already covered by try/catch)

### Task 2: Wrap all set* functions in useCallback and Provider value in useMemo

- Wrapped all 20 plain arrow `set*` functions in `useCallback` with `[update]` dependency array:
  `setNome`, `setSabedoria`, `setVida`, `setMana`, `setVeneno`, `setAfinidade`, `setInstanceIP`, `setAttrDice`, `setSkill`, `setProficiencias`, `setHabilidades`, `setVelocidade`, `setMemoria`, `setCanalizacao`, `setFoco`, `setDominio`, `setInventario`, `setEquipamento`, `setMagica`, `setReceitas`
- Extracted Provider value into `const contextValue = useMemo(...)` before the return statement, with all 27 entries in both the factory and dependency array
- Changed `<CharacterContext.Provider value={{...}}>` to `<CharacterContext.Provider value={contextValue}>`

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | Exit 0 |
| debounceRef occurrences | `grep -n "debounceRef"` | 3 matches (declaration, clearTimeout, setTimeout assignment) |
| clearTimeout present | `grep -n "clearTimeout(debounceRef.current)"` | 1 match (line 121) |
| setTimeout 500ms | `grep -n "}, 500)"` | 1 match (line 128) |
| .catch handlers | `grep -c ".catch(err =>"` | 8 (requirement: >= 5) |
| useRef in import | `grep -n "useRef"` | present (line 1) |
| contextValue = useMemo | `grep -n "contextValue = useMemo"` | 1 match (line 238) |
| useCallback count | `grep -c "useCallback"` | 27 (requirement: >= 20) |
| Provider uses contextValue | `grep -n "value={contextValue}"` | 1 match (line 257) |

## Deviations from Plan

None — plan executed exactly as written. Both tasks were implemented in a single file write since all changes were to the same file. The `.catch()` count is 8 (exceeding the minimum of 5) because the debounce timer's internal `setItem` call also received a handler, matching the pattern from D-02 in PATTERNS.md.

## Files Changed

| File | Change |
|------|--------|
| `store/CharacterContext.tsx` | Modified — 81 insertions, 54 deletions (net +27 lines) |

## Commit

`3c0bc87` — feat(01-01): debounce AsyncStorage writes and memoize CharacterContext

## Self-Check

- [x] store/CharacterContext.tsx exists and contains all required patterns
- [x] Commit 3c0bc87 exists in git log
- [x] npx tsc --noEmit exits 0
- [x] All grep counts meet or exceed minimums

## Self-Check: PASSED
