---
phase: "19"
plan: "19-01"
subsystem: "mochila-equipamentos"
tags: [paperdoll, arpg, layout, equipamentos, ui]
dependency_graph:
  requires: []
  provides: [PaperdollSection]
  affects: [mochila-equipamentos-ui]
tech_stack:
  added: []
  patterns: [absolute-positioning, platform-select-shadow, inline-detail-panel]
key_files:
  created:
    - components/rpg/PaperdollSection.tsx
  modified:
    - app/(tabs)/mochila.tsx
decisions:
  - "hexContainer mantido oculto (opacity 0, height 0, overflow hidden) em vez de display:none — display:none impede measureInWindow de funcionar corretamente"
  - "PaperdollSection sem dependencia Skia — layout View puro RN para evitar sobrecarga de CanvasKit WASM"
  - "availableMelhorias prop definida como T[] em vez de Array<T> para conformidade com eslint array-type rule"
  - "TextInput e NumericStepper removidos dos imports de mochila.tsx — agora exclusivos de PaperdollSection"
metrics:
  duration: "~3min"
  completed: "2026-05-19"
  tasks_completed: 2
  files_changed: 2
---

# Phase 19 Plan 01: PaperdollSection — Layout aRPG com Silhueta e Slots MTG Summary

**One-liner:** Layout paperdoll aRPG View-based com silhueta centralizada e 5 slots absolutamente posicionados substituindo hexContainer de mochila.tsx.

## What Was Built

### Task 1: PaperdollSection.tsx (commit a515810)

Novo componente `components/rpg/PaperdollSection.tsx` implementando o layout paperdoll aRPG:

**Silhueta View-based:**
- `silHead`: círculo 28×28, borderRadius 14, backgroundColor RPG.border, borderColor RPG.goldDim
- `silShoulders`: retângulo 48×8, mesmas cores
- `silBody`: retângulo 34×56, mesmas cores
- Container absoluto com `top: 20`, centralizado horizontalmente

**5 Slots absolutamente posicionados em container 240dp:**
- `vestimenta`: top 8, left 50% - 30 (centralizado)
- `arma`: top 78, left 14
- `escudo`: top 78, right 14
- `acessorio1`: top 163, left 38
- `acessorio2`: top 163, right 38

**Visual dos slots:**
- Vazio: borda RPG.goldDim, background RPG.surface, ícone opacity 0.35, label opacity 0.4 (PAP-02)
- Equipado: borda RPG.gold, background RPG.surfaceAlt + shadow iOS (shadowOpacity 0.45) / elevation Android 4 (PAP-03)
- Selecionado: borda RPG.goldLight, borderWidth 2.5

**Painel de detalhe inline** (aparece abaixo do paperdoll quando slot selecionado):
- TextInput nome personalizado
- Botão "Escolher do livro" (picker modal)
- Botão "Remover item" (condicional)
- Badges de melhorias com remoção individual
- Botão "+ Adicionar Melhoria" / "Máx. 3 melhorias"
- Toggle Básico / Artefato ✦
- Campo efeito + NumericStepper durabilidade (quando artefato)

### Task 2: Integração em mochila.tsx (commit 3e3c25f)

**Mudanças em mochila.tsx:**
- Import `PaperdollSection` adicionado
- `paperdollStatSummary` computado antes do `return` usando `getStatSummary` existente
- `<PaperdollSection>` com todos os 5 slots e callbacks wired substituiu o `<View style={styles.hexContainer}>`
- DroppableHexSlots mantidos em `hexContainerHidden` (opacity 0, height 0, overflow hidden) para preservar `hexRefs` e compatibilidade de drag-drop via `handleDropAttempt`
- Imports `TextInput` (RN) e `NumericStepper` removidos de mochila.tsx (movidos para PaperdollSection)
- StyleSheet: `hexContainer` renomeado para `hexContainerHidden` com propriedades de ocultação

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Lint] Imports nao utilizados removidos de mochila.tsx**
- **Found during:** Task 2 — expo lint
- **Issue:** `TextInput` e `NumericStepper` ficaram no import de mochila.tsx mas nao sao mais usados diretamente (PaperdollSection os gerencia internamente)
- **Fix:** Removidos do import RN block e do import separado NumericStepper
- **Files modified:** app/(tabs)/mochila.tsx
- **Commit:** 3e3c25f

**2. [Rule 1 - Lint] Array<T> substituido por T[] em PaperdollSection.tsx**
- **Found during:** Task 2 — expo lint
- **Issue:** `availableMelhorias: Record<SlotKey, Array<{ label: string; cor: string }>>` violava a regra eslint `@typescript-eslint/array-type` do projeto
- **Fix:** Substituido por `{ label: string; cor: string }[]`
- **Files modified:** components/rpg/PaperdollSection.tsx
- **Commit:** 3e3c25f (aplicado antes do commit de Task 2)

### Decisao sobre hexContainer oculto

O plano propunha `display: 'none'` OU `opacity: 0, height: 0, overflow: 'hidden'`. Foi escolhida a segunda opcao: `opacity: 0, height: 0, overflow: 'hidden'` porque `display: 'none'` impede `measureInWindow` de retornar coordenadas validas, quebrando `handleDropAttempt` do drag-drop. Com `height: 0` os Views ainda sao montados e medíveis, mas nao ocupam espaco visual.

## Known Stubs

Nenhum. PaperdollSection recebe dados reais de `c.equipamentos` via props.

## Threat Flags

Nenhum. Componente puramente de UI — sem novos endpoints, auth paths, ou acessos a filesystem.

## Verification Results

- `npx tsc --noEmit`: 0 erros
- `npx expo lint`: 0 warnings novos (16 warnings pre-existentes em outros arquivos — nenhum introduzido por este plano)
- PaperdollSection exporta `default PaperdollSection` e `PaperdollSectionProps`
- mochila.tsx usa `<PaperdollSection>` com todos os callbacks wired

## Self-Check: PASSED

- FOUND: components/rpg/PaperdollSection.tsx
- FOUND: commit a515810 (Task 1)
- FOUND: commit 3e3c25f (Task 2)
