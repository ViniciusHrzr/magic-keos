---
phase: "08-documentacao"
plan: "01"
subsystem: "documentacao"
tags: [game-rules, regras, habilidades, proficiencias, fidelidade-docx]
dependency_graph:
  requires: []
  provides: [FIDE-19]
  affects: [GAME_RULES.md, regras.tsx, data/habilidades.ts, data/proficiencias.ts]
tech_stack:
  added: []
  patterns: [dynamic-mapping-from-data, single-source-of-truth]
key_files:
  created: []
  modified:
    - .planning/GAME_RULES.md
    - app/(tabs)/regras.tsx
decisions:
  - "regras.tsx §5 agora usa habilidades.ts como fonte única — evita drift futuro entre UI e dados"
  - "habCusto() helper normaliza custo string (strip SAB suffix, normalize slashes) sem alterar lógica de dados"
  - "proficiencias.ts e habilidades.ts (exceto Grimório) auditados e confirmados fiéis ao docx v0.4 — zero correções necessárias nos arquivos de dados"
metrics:
  duration: "~6 minutos"
  completed: "2026-05-16T13:01:43Z"
  tasks_completed: 3
  tasks_total: 3
  files_modified: 2
---

# Phase 8 Plan 01: Documentação — GAME_RULES.md + regras.tsx §5 + Auditoria dados Summary

**One-liner:** 7 correções no GAME_RULES.md §5+§7 via python-docx, refatoração de §5 regras.tsx para fonte única em habilidades.ts, auditoria completa de proficiencias.ts e habilidades.ts vs docx v0.4.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Auditar GAME_RULES.md via python-docx e corrigir discrepâncias | `9386689` | `.planning/GAME_RULES.md` |
| 2 | Refatorar regras.tsx §5 — importar de habilidades.ts | `02b25ff` | `app/(tabs)/regras.tsx` |
| 3 | Revisar proficiencias.ts e habilidades.ts vs docx (exceto Grimório) | — (sem alterações) | nenhum |

## What Was Built

### Task 1 — GAME_RULES.md: 7 correções §5+§7

Comparação via python-docx revelou 7 discrepâncias entre GAME_RULES.md e o docx v0.4:

**§5 Investigação:**
- `Encantamento, Invocação` → `Selo de Encantamento, Selo de Invocação` (prefixo "Selo de" faltava)

**§7 Habilidades Corporais:**
- Alcance: `quando alvo se move` → `quando alvo avança; sucesso = metade do deslocamento`
- Destreza: `dano desarmado sobe (dW I–V)` → `dano desarmado e bastões sobe (1d4 · 1d6 · 1d8 · 1d10 · 1d12)`
- Golpe Duplo: `dois ataques consecutivos` → `dois ataques consecutivos; até dois alvos adjacentes; não se aplica a armas de duas mãos`

**§7 Habilidades Mentais:**
- Modelagem: `ressurge na cena` → `ao morrer pode ser reativada na mesma cena`

**§7 Habilidades Espirituais:**
- Fúria: `Enfurecer [1]: +1 ação padrão` → trigger completo `aciona ao sofrer dano, falhar em combate ou presenciar aliado cair`
- Toque Mortífero: `Abater [1]: testa VON[INT]` → `Abater [1]: aciona quando for alvo de ataque; testa VON[INT]`

### Task 2 — regras.tsx §5 Refatoração

- Adicionado `import { habilidades } from '@/data/habilidades'`
- Adicionado helper `habCusto()` que remove sufixo ` SAB.*` e normaliza ` / ` → `/`
- Substituídos 17 `HabBlock` hardcoded por `.map()` dinâmico sobre `habilidades` filtrado por `instancia`
- §5 agora sempre sincronizado com data/habilidades.ts (fonte única)
- TypeScript compila sem erros

### Task 3 — Auditoria proficiencias.ts e habilidades.ts vs docx v0.4

Auditoria sistemática via python-docx comparou:
- **17 habilidades** (exceto Grimório) — prerequisito, custo, descricao, teste
- **Proficiências prioritárias**: Artes Marciais (6), Atletismo (4), Esgrima (6), Furtividade (4), Pontaria (6), Investigação (4)

**Resultado: zero discrepâncias encontradas.** Todos os arquivos de dados já estavam fiéis ao docx v0.4 (Phases 5-7 já haviam corrigido os dados). Grimório não foi tocado.

## Deviations from Plan

None — plano executado exatamente como escrito.

## Acceptance Criteria Results

| # | Critério | Resultado |
|---|----------|-----------|
| 1 | `grep -c "Selo de Encantamento" GAME_RULES.md` ≥ 1 | 1 ✓ |
| 2 | `grep -c "metade do deslocamento" GAME_RULES.md` ≥ 1 | 1 ✓ |
| 3 | `grep -c "1d4.*1d6" GAME_RULES.md` ≥ 1 | 2 ✓ |
| 4 | `grep -c "alvos adjacentes" GAME_RULES.md` ≥ 1 | 1 ✓ |
| 5 | `grep -c "ao morrer" GAME_RULES.md` ≥ 1 | 1 ✓ |
| 6 | `grep -c "sofrer dano" GAME_RULES.md` ≥ 1 | 1 ✓ |
| 7 | `grep -c "alvo de ataque" GAME_RULES.md` ≥ 1 | 1 ✓ |
| 8 | `grep "import { habilidades }" regras.tsx` = 1 | 1 ✓ |
| 9 | `grep -c "dW I–V" regras.tsx` = 0 | 0 ✓ |
| 10 | `grep -c "quando alvo se move" regras.tsx` = 0 | 0 ✓ |
| 11 | `grep -c "ressurge na cena" regras.tsx` = 0 | 0 ✓ |
| 12 | `npx tsc --noEmit` = 0 errors | 0 errors ✓ |

## Known Stubs

None — nenhum stub introduzido neste plano.

## Threat Flags

None — nenhuma nova superfície de segurança introduzida.

## Self-Check: PASSED

- `.planning/GAME_RULES.md` — existe e contém as 7 correções verificadas por grep
- `app/(tabs)/regras.tsx` — existe, import presente, habCusto presente, §5 dinâmico
- Commit `9386689` — verificado em git log
- Commit `02b25ff` — verificado em git log
- `npx tsc --noEmit` — 0 erros
