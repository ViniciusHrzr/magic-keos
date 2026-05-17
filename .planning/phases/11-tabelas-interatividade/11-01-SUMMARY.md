---
phase: 11-tabelas-interatividade
plan: 01
subsystem: ui
tags: [react-native, animated, layout-animation, expo-haptics, stylesheet, rpg-theme]

# Dependency graph
requires:
  - phase: 10-estrutura-tipografia
    provides: sectionHeaderOpen style com backgroundColor condicional e borderBottomWidth — base visual para animação de estado aberto/fechado
provides:
  - Section component com animação de chevron (Animated.Value rotate 0→180deg) e haptic feedback
  - tableHeaderRow com backgroundColor RPG.surfaceAlt — header de tabela visualmente distinto
  - tableRow com borda inferior hairline — separação sutil entre linhas de dados
affects: [regras, v1.2-milestone]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Animated.Value + interpolate para rotação de chevron com useNativeDriver: true"
    - "LayoutAnimation.configureNext(easeInEaseOut) para animar expand/collapse de layout"
    - "expo-haptics sem Platform guard — degradação silenciosa em Android sem motor háptico"

key-files:
  created: []
  modified:
    - app/(tabs)/regras.tsx

key-decisions:
  - "Usar LayoutAnimation + Animated.Value em vez de Reanimated — menor overhead para toggle simples de chevron"
  - "Haptics.impactAsync sem guard Platform.OS — segue padrão implícito do projeto, degradação aceitável em Android"
  - "StyleSheet.hairlineWidth para borda inferior de tableRow — máxima sutileza sem pixel fixo"
  - "RPG.surfaceAlt (#221a12) para tableHeaderRow background — contraste suficiente sem confundir com sectionHeader"
  - "REG-05 satisfeito por design existente — widths do TH e flex dos rows inline já alinham em todas as seções"

patterns-established:
  - "Animated.Value com useRef para animação de rotação em componente funcional"
  - "toggle() centraliza LayoutAnimation + Animated.timing + setState + Haptics em uma única função"

requirements-completed:
  - REG-03
  - REG-04
  - REG-05
  - REG-10
  - REG-11
  - REG-12

# Metrics
duration: 12min
completed: 2026-05-17
---

# Phase 11 Plan 01: Tabelas & Interatividade Summary

**Chevron animado 0→180deg via Animated.Value + LayoutAnimation + haptic leve no Section; tableHeaderRow com RPG.surfaceAlt e tableRow com borda hairline separando linhas de dados**

## Performance

- **Duration:** 12 min
- **Started:** 2026-05-17T03:29:00Z
- **Completed:** 2026-05-17T03:41:45Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Tabelas RPG com header visualmente distinto (RPG.surfaceAlt) e texto bold/gold já existente via tableKey
- Linhas de dados separadas por borda StyleSheet.hairlineWidth em RPG.border — sutileza máxima sem pixel fixo
- Section colapsável com animação suave: chevron rotaciona 180° via Animated.timing (useNativeDriver: true) e body anima via LayoutAnimation.configureNext(easeInEaseOut)
- Haptic leve (ImpactFeedbackStyle.Light) ao tocar no cabeçalho de qualquer seção
- REG-05 verificado por design — nenhuma mudança de código necessária

## Task Commits

1. **Task 1: Restilizar tabelas (REG-03, REG-04, REG-05)** - `b004d1a` (feat)
2. **Task 2: Animação + Haptic no Section colapsável (REG-10, REG-11, REG-12)** - `fe90a1a` (feat)

**Plan metadata:** (docs commit — vide abaixo)

## Files Created/Modified

- `app/(tabs)/regras.tsx` — imports expandidos (useRef, Animated, LayoutAnimation, expo-haptics); Section refatorado com toggle() + Animated.Text chevron; tableHeaderRow e tableRow restilizados

## Decisions Made

- **LayoutAnimation + Animated core em vez de Reanimated** — Reanimated 4.x já instalado no projeto mas seria overhead (worklets, shared values) para um toggle simples. Animated core + LayoutAnimation resolvem com ~8 linhas adicionais no Section.
- **Sem Platform guard no Haptics.impactAsync** — haptic-tab.tsx tem guard `process.env.EXPO_OS === 'ios'`, mas o PLAN especifica explicitamente para não usar guard neste componente, seguindo degradação silenciosa em dispositivos sem motor háptico preciso.
- **StyleSheet.hairlineWidth para borda inferior** — mais sutil que 1px fixo, adaptado à densidade de tela de cada device. Opção preferida sobre fundo alternado (que exigiria mudanças no JSX de R2/R3).
- **RPG.surfaceAlt (#221a12) para tableHeaderRow** — contraste sutil com RPG.surface (#181210) sem confundir com sectionHeader (RPG.headerBg #0d0b08). Alternativa surfaceAlt descartada em favor de headerBg por confusão semântica.
- **REG-05 zero-code** — RESEARCH.md confirmou que os widths do TH e os flex dos rows inline batem em todas as seções (2, 11, 13, 16). Verificado por grep e inspeção — nenhuma mudança necessária.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 11 completa — todos os 6 requirements de v1.2 fechados (REG-03, REG-04, REG-05, REG-10, REG-11, REG-12)
- Milestone v1.2 "Tela de Regras — Visual & Estrutura" completo (Phases 10 + 11)
- `app/(tabs)/regras.tsx` é o único arquivo de produção modificado — zero risco para outras abas
- Verificação visual recomendada: `npx expo start` em device físico iOS para confirmar haptic e animação suave do chevron

## Self-Check

- [x] `app/(tabs)/regras.tsx` existe e foi modificado
- [x] Commit `b004d1a` existe: `feat(11-01): estilo RPG nas tabelas`
- [x] Commit `fe90a1a` existe: `feat(11-01): animação do chevron + haptic feedback`
- [x] `npx tsc --noEmit` retorna zero erros reais
- [x] `npx expo lint` retorna 0 errors (14 warnings pré-existentes, nenhum em regras.tsx)
- [x] REG-03: `RPG.surfaceAlt` em tableHeaderRow — confirmado por grep
- [x] REG-04: `StyleSheet.hairlineWidth` + `RPG.border` em tableRow — confirmado por grep
- [x] REG-05: verificado por design — zero mudanças necessárias
- [x] REG-10: `Animated.timing` + `LayoutAnimation.configureNext` + `Animated.Text` — confirmados por grep
- [x] REG-11: `sectionHeaderOpen` existente (Phase 10) + LayoutAnimation anima transição — confirmado
- [x] REG-12: `Haptics.impactAsync(ImpactFeedbackStyle.Light)` — confirmado por grep

## Self-Check: PASSED

---
*Phase: 11-tabelas-interatividade*
*Completed: 2026-05-17*
