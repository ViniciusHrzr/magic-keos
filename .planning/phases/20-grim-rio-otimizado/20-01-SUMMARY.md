---
phase: 20-grim-rio-otimizado
plan: "01"
subsystem: grimorio
tags: [performance, flashlist, flatlist, collapse-expand]
dependency_graph:
  requires: []
  provides: [grimorio-flashlist-base]
  affects: [app/(tabs)/grimorio.tsx]
tech_stack:
  added: ["@shopify/flash-list@2.0.2"]
  patterns: [typed-flat-array, discriminated-union, useMemo-flatItems]
key_files:
  created: []
  modified:
    - app/(tabs)/grimorio.tsx
    - package.json
    - package-lock.json
decisions:
  - "FlashList v2 API usa drawDistance em vez de estimatedItemSize — prop removido na v2.0.2"
  - "domainBlock mantido como wrapper vazio para preservar estrutura DOM; borderBottom movido para domainRow"
  - "renderItem omite setSelected do dep array (estável via useState)"
metrics:
  duration: "~12 min"
  completed: "2026-05-19"
  tasks_completed: 8
  files_modified: 3
---

# Phase 20 Plan 01: FlashList Refactor Summary

**One-liner:** Substituição de FlatList por FlashList com array plano tipado (`FlatItem`) para renderização de 3700+ mágicas sem regressão de UX no collapse/expand.

## Tasks Completed

| Task | Description | Status |
|------|-------------|--------|
| T1 | Instalar @shopify/flash-list via `npx expo install` | Done |
| T2 | Adicionar `FlatItem` union type após `DomainGroup` | Done |
| T3 | Adicionar `buildFlatItems` helper acima do componente | Done |
| T4 | Substituir `renderDomain` por `renderItem` (3 branches) | Done |
| T5 | Adicionar `flatItems` via `useMemo` | Done |
| T6 | Substituir `<FlatList>` por `<FlashList>` | Done |
| T7 | Mover `borderBottomWidth` de `domainBlock` para `domainRow` | Done |
| T8 | `npx tsc --noEmit` — 0 erros | Done |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `estimatedItemSize` não existe na FlashList v2.0.2**
- **Found during:** T8 (TypeScript check)
- **Issue:** O plano especificava `estimatedItemSize={56}` mas a versão instalada (2.0.2) removeu esse prop da API. O tipo `FlashListProps` v2 usa `drawDistance` para controle de pré-renderização.
- **Fix:** Substituído por `drawDistance={500}` — 500dp de pré-render além da viewport, equivalente funcional para scroll suave.
- **Files modified:** `app/(tabs)/grimorio.tsx`
- **Commit:** a09d204

## Architecture Notes

A refatoração transforma o modelo de dados de `DomainGroup[]` (com renderização interna de filhos) para `FlatItem[]` (array plano discriminado). Isso permite ao FlashList reciclar células individualmente em vez de blocos inteiros de domínio, reduzindo significativamente o trabalho de layout para listas com 3700+ entradas.

O `buildFlatItems` é chamado apenas quando `filteredGroups` ou `expanded` mudam (via `useMemo`), mantendo referential stability no array passado ao FlashList.

## Self-Check

- [x] `@shopify/flash-list` em `package.json` (v2.0.2)
- [x] `app/(tabs)/grimorio.tsx` modificado com FlashList
- [x] Commit a09d204 existe
- [x] `npx tsc --noEmit` passou com 0 erros
- [x] FlatList removida dos imports React Native
- [x] renderDomain removido, renderItem com 3 branches discriminados
- [x] flatItems useMemo presente
- [x] buildFlatItems helper presente acima do componente

## Self-Check: PASSED
