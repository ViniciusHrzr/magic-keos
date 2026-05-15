---
phase: 01-estabilidade-de-funda-o
plan: "02"
subsystem: error-handling
tags: [error-boundary, crash-isolation, react-class-component, rpg-ui]
dependency_graph:
  requires: []
  provides: [FOUND-03]
  affects: [app/_layout.tsx, app/(tabs)/index.tsx, app/(tabs)/magia.tsx, app/(tabs)/grimorio.tsx]
tech_stack:
  added: []
  patterns: [React class component ErrorBoundary, per-tab crash isolation, global crash fallback]
key_files:
  created:
    - components/rpg/ErrorBoundary.tsx
  modified:
    - app/_layout.tsx
    - app/(tabs)/index.tsx
    - app/(tabs)/magia.tsx
    - app/(tabs)/grimorio.tsx
decisions:
  - "Per-tab boundaries placed inside each screen file (not in tabs/_layout.tsx) to achieve true per-tab crash isolation as specified by FOUND-03"
metrics:
  duration: "~10 minutes"
  completed_date: "2026-05-15T04:54:55Z"
  tasks_completed: 2
  files_changed: 5
---

# Phase 1 Plan 02: ErrorBoundary Component Summary

**One-liner:** React class ErrorBoundary with RPG-themed fallback UI wired at two levels: per-tab screens and global app root.

## Tasks Completed

### Task 1: Create ErrorBoundary class component

Created `components/rpg/ErrorBoundary.tsx` as a named export class component following the SectionHeader structural analog. The component:
- Imports `React` (default), `View`/`Text`/`StyleSheet` from react-native, and `RPG` from `@/constants/theme`
- Implements `Props { children: React.ReactNode }` and `State { hasError: boolean }` interfaces
- Implements `static getDerivedStateFromError` and `componentDidCatch` lifecycle methods
- Renders RPG-themed fallback UI using `RPG.bg`, `RPG.gold`, `RPG.textMuted` tokens (no hardcoded hex)
- `StyleSheet.create` block positioned after the class, matching project conventions

### Task 2: Wire global and per-tab boundaries

Modified four files to import and wrap with `<ErrorBoundary>`:

- `app/_layout.tsx`: global boundary wraps `<CharacterProvider>` as outermost element — catches any render error that escapes per-tab boundaries
- `app/(tabs)/index.tsx`: per-tab boundary wraps `<KeyboardAvoidingView>` in FichaScreen return
- `app/(tabs)/magia.tsx`: per-tab boundary wraps `<KeyboardAvoidingView>` in MagiaScreen return
- `app/(tabs)/grimorio.tsx`: per-tab boundary wraps `<SafeAreaView>` in GrimorioScreen return

`app/(tabs)/_layout.tsx` was not modified (as specified).

## Verification Results

**TypeScript:** `npx tsc --noEmit` — exit 0, no errors

**Grep checks:**

```
app/(tabs)/grimorio.tsx: import { ErrorBoundary } ... + <ErrorBoundary> wrapper
app/(tabs)/index.tsx:    import { ErrorBoundary } ... + <ErrorBoundary> wrapper
app/(tabs)/magia.tsx:    import { ErrorBoundary } ... + <ErrorBoundary> wrapper
app/_layout.tsx:         import { ErrorBoundary } ... + <ErrorBoundary> wrapper
components/rpg/ErrorBoundary.tsx: export class ErrorBoundary extends React.Component
```

- `getDerivedStateFromError` — 1 match in ErrorBoundary.tsx (line 19)
- `"Algo deu errado nesta tela."` — found in ErrorBoundary.tsx
- `app/(tabs)/_layout.tsx` — no "ErrorBoundary" match (confirmed)

## Deviations from Plan

None — plan executed exactly as written. Per-tab boundaries were placed inside individual screen files as specified, not in `app/(tabs)/_layout.tsx`.

## Files Changed

| File | Status | Key Change |
|------|--------|-----------|
| `components/rpg/ErrorBoundary.tsx` | CREATED | Named export class component with RPG-themed fallback |
| `app/_layout.tsx` | MODIFIED | Import + global ErrorBoundary wrapping CharacterProvider |
| `app/(tabs)/index.tsx` | MODIFIED | Import + ErrorBoundary wrapping KeyboardAvoidingView in FichaScreen |
| `app/(tabs)/magia.tsx` | MODIFIED | Import + ErrorBoundary wrapping KeyboardAvoidingView in MagiaScreen |
| `app/(tabs)/grimorio.tsx` | MODIFIED | Import + ErrorBoundary wrapping SafeAreaView in GrimorioScreen |

## Known Stubs

None — ErrorBoundary is fully wired with no placeholder data.

## Self-Check: PASSED

- `components/rpg/ErrorBoundary.tsx` — EXISTS
- `app/_layout.tsx` — MODIFIED with ErrorBoundary
- `app/(tabs)/index.tsx` — MODIFIED with ErrorBoundary
- `app/(tabs)/magia.tsx` — MODIFIED with ErrorBoundary
- `app/(tabs)/grimorio.tsx` — MODIFIED with ErrorBoundary
- Commit `2045d41` — EXISTS
