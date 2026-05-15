# Phase 2: Qualidade da Ficha - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 2-Qualidade da Ficha
**Areas discussed:** Escopo geral, FICHA-01 abordagem, FICHA-04 defer

---

## Escopo Geral

| Option | Description | Selected |
|--------|-------------|----------|
| Todas as 4 áreas | Font loading, IP input, Extraction scope, Dead code fate | |
| Mínimo crítico | Só o que afeta o jogador ou integridade de dados | ✓ |

**User's choice:** "Faça somente o que for crítico realmente, não faça muita coisa."
**Notes:** Usuário quer escopo mínimo. Análise identificou que FICHA-02 já está resolvida pelo VenenoTracker existente.

---

## FICHA-04 — Extração do InstanceBlock

| Option | Description | Selected |
|--------|-------------|----------|
| Defer FICHA-04 | Phase 2 fica só com fixes críticos | ✓ |
| Manter no Phase 2 | Incluir extração + redução de index.tsx para < 300 linhas | |

**User's choice:** Defer FICHA-04
**Notes:** Organização de código, não crítico para o jogador.

---

## FICHA-01 — IP Validation Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Usar NumericStepper | Trocar TextInput por componente existente (min=0, clamp) | ✓ |
| Corrigir handler | Manter TextInput, adicionar Math.max(0, parseInt(t) \|\| 0) | |

**User's choice:** Usar NumericStepper
**Notes:** Visualmente consistente com o resto da ficha.

---

## Claude's Discretion

- FICHA-03: Abordagem `return null` escolhida pelo Claude (vs SplashScreen) — suficiente para eliminar o flash sem complexidade adicional
- CODE-01/02/03: Decisão de deletar ambos (modal.tsx, explore.tsx) e criar spell-constants.ts — sem input adicional necessário do usuário

## Deferred Ideas

- FICHA-04: Extração do InstanceBlock — diferida a pedido do usuário
- SplashScreen polished loading: usar `preventAutoHideAsync` + `hideAsync` para transição mais suave — anotado para fase futura
