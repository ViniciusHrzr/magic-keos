---
phase: 15-fundacao-visual-mtg
plan: 02
status: complete
completed_at: 2026-05-18
---

# Plan 02 Summary — LegendaryFrame Component

## What was done
- Created `components/rpg/LegendaryFrame.tsx` with Skia Canvas chamfer border (8-segment 45° path via `Skia.Path.Make()`) and RN overlay (nome, sabedoria, Fichas button)
- Integrated LegendaryFrame in `app/(tabs)/index.tsx` replacing the titleBar block — onLayout guard ensures Canvas never renders at width=0
- Removed 6 dead styles from index.tsx StyleSheet: `titleBar`, `titleRow`, `gameTitle`, `fichasBtn`, `fichasBtnText`, `nameInput`
- Added `skiaAvailable` guard + RN fallback: if `SkiaApi` JSI global is undefined (Expo Go), component renders flat gold-bordered View instead of crashing

## Verification results
- `npx tsc --noEmit`: PASS
- `npx expo lint`: PASS
- `grep "LegendaryFrame" app/(tabs)/index.tsx`: 2+ matches (import + JSX)
- `grep "titleBar" app/(tabs)/index.tsx`: 0 matches

## Human checkpoint
Aprovado — LegendaryFrame visible and functional in Expo Go. Screen opens without crash. Nome editável, SAB display, Fichas button functional.

## Notes
- Expo Go SDK 54 bundles `@shopify/react-native-skia 2.2.12` but `SkiaApi` JSI global was not initialized — Skia Canvas threw at render time, caught by ErrorBoundary
- Fix: `skiaAvailable` check at module load; Canvas renders only when Skia is confirmed available; RN fallback used otherwise
- Skia Canvas with true chamfer will render in a dev build (expo-dev-client) where JSI is properly initialized
