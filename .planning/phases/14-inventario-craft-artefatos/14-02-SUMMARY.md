---
phase: 14-inventario-craft-artefatos
plan: 02
status: complete
completed: 2026-05-17
requirements: [INV-01]
subsystem: navigation
tags: [tab-bar, reorder, layout]
key-files:
  modified:
    - app/(tabs)/_layout.tsx
    - data/habilidades.ts
decisions:
  - Moved Mochila tab to position 3 (after Magia) to surface inventory access early in the tab bar
tech-stack:
  patterns: [Expo Router tab ordering via Tabs.Screen block sequence]
---

# Phase 14 Plan 02: Tab Bar Reorder — Mochila to Position 3

## One-liner

Moved Mochila tab from position 6 to position 3 by reordering `Tabs.Screen` blocks in `_layout.tsx`, with tsc clean at exit 0.

## What Changed

`app/(tabs)/_layout.tsx`: The `Tabs.Screen name="mochila"` block was moved from after `notas` (position 6) to immediately after `magia` (position 3). No properties of any tab were modified — only the DOM order of the JSX blocks changed.

New tab order:
1. index (Ficha)
2. magia (Magia)
3. mochila (Mochila)  ← moved here
4. grimorio (Grimório)
5. regras (Regras)
6. notas (Notas)
7. explore (href: null, hidden)

## Verification Results

### tsc exit code

```
TypeScript: No errors found
EXIT: 0
```

### grep confirming tab order

```
app/(tabs)/_layout.tsx:29:name="index"
app/(tabs)/_layout.tsx:36:name="magia"
app/(tabs)/_layout.tsx:43:name="mochila"
app/(tabs)/_layout.tsx:50:name="grimorio"
app/(tabs)/_layout.tsx:57:name="regras"
app/(tabs)/_layout.tsx:64:name="notas"
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added MagicaHabilidade type and magicas field to habilidades.ts**
- **Found during:** tsc verification after merge
- **Issue:** The worktree's committed `data/habilidades.ts` was missing the `MagicaHabilidade` interface and `magicas?: MagicaHabilidade[]` field on `Habilidade`. The committed `app/(tabs)/regras.tsx` imports `MagicaHabilidade` from this file, causing 2 tsc errors (TS2305, TS2339). The main repo's working tree had the fix uncommitted.
- **Fix:** Copied the correct `data/habilidades.ts` (with `MagicaHabilidade` and `magicas` field) from the main repo's working tree into the worktree.
- **Files modified:** `data/habilidades.ts`
- **Commit:** ef6d43b

### Worktree Merge

The worktree branch was behind master by 32 commits (missing all Phase 12, 13, and Phase 14 planning work). A `git merge master` fast-forward was performed before making the plan change. No conflicts occurred.

## Self-Check

- [x] `app/(tabs)/_layout.tsx` exists and has correct order
- [x] `data/habilidades.ts` exists with `MagicaHabilidade` exported
- [x] Commit ef6d43b exists

## Self-Check: PASSED
