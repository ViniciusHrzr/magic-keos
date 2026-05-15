# Phase 1: Estabilidade de Fundação - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 1-Estabilidade de Fundação
**Areas discussed:** Debounce de escrita, Estado de carregamento, Error boundaries, Falhas de gravação, Memoização do contexto

---

## Seleção de Áreas para Discussão

| Option | Description | Selected |
|--------|-------------|----------|
| Debounce de escrita | Quando persistir no AsyncStorage? Só após TextInput ou todas as escritas? | — |
| Estado de carregamento | O que mostrar enquanto o app hidrata dados? | — |
| Error boundaries | Onde isolar crashes de render? | — |
| Falhas de gravação | Quando AsyncStorage.setItem falha, o usuário deve ser notificado? | — |

**User's choice:** Freeform — "Confio em você, arrume o que for necessário porém não altere nenhuma lógica de funcionamento da ficha."

**Notes:** Usuário delegou todas as decisões técnicas ao Claude, com uma restrição central: não alterar a lógica de funcionamento da ficha (setters, transformações de dados, estrutura do personagem, comportamento do usuário). Todas as 4 áreas foram resolvidas por Claude's discretion.

---

## Escopo Extraído (Redirect)

**User's input:** Solicitação de nova feature — reestruturar aba "Proficiências" com proficiências por perícia (Artes Marciais, etc.) consultáveis das regras do jogo.

**Action:** Redirected — nova capacidade fora do escopo da Fase 1. Registrado como deferred idea.

---

## Claude's Discretion

Todas as 4 áreas foram decididas por Claude dado o "confio em você" do usuário:

- **Debounce:** 500ms, todas as escritas, state imediato
- **Loading state:** `isLoaded` flag + indicador simples até hydration completar
- **Error boundaries:** Um por aba + um global fallback
- **Falhas de gravação:** `.catch()` silencioso com `console.error`, sem alertas ao usuário
- **Memoização:** `useMemo` no Provider value + `useCallback` nos `set*` restantes

---

## Deferred Ideas

- **Proficiências por perícia** — Nova feature: adicionar proficiências de todas as perícias (Artes Marciais, etc.) como lista adicionável na aba Proficiências. Fase futura.
- **Schema versioning em migrate()** — Fragilidade conhecida (CONCERNS.md #11). Avaliar se schema mudar em fases posteriores.
