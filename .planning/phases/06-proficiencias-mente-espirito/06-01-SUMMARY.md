---
phase: "06-proficiencias-mente-espirito"
plan: 01
subsystem: data
tags: [proficiencias, mente, espirito, content-correction, docx-fidelidade]
dependency_graph:
  requires: []
  provides: [proficiencias-mente-espirito-corrected]
  affects: [ProficienciasSection, regras-tab]
tech_stack:
  added: []
  patterns: [data-only-edit, static-constant]
key_files:
  created: []
  modified:
    - data/proficiencias.ts
decisions:
  - "D-01 applied: Encantamento→Selo de Encantamento and Invocação→Selo de Invocação (nome field changes accepted; AsyncStorage key data loss per D-02)"
  - "D-06 honored: all requisito fields left unchanged across all 29 proficiências"
  - "Corpo block lines 25–87 not touched — verified via grep of Derrubar string"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-16T05:46:33Z"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 1
  field_edits: 56
---

# Phase 06 Plan 01: Corrigir Proficiências MENTE/ESPÍRITO Summary

**One-liner:** 56 field edits correcting descricao/teste/nome for 29 proficiências in mente and espirito blocks to match docx v0.4 verbatim — replacing invented mechanics with official rules.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Corrigir bloco mente — Alquimia, Criatividade, Investigação, Mecânica, Sobrevivência | 224e741 | data/proficiencias.ts |
| 2 | Corrigir bloco espirito — Provocar, Coordenar, Inspirar, Amedrontar, Distrair | 224e741 | data/proficiencias.ts |

Both tasks committed atomically in one commit per plan specification.

## What Was Done

### Task 1: Bloco MENTE (46 field edits)

**Alquimia (4 proficiências, 5 edits):**
- Herbologia.descricao: removed invented "poções de cura, imunidade..." → "remédios e tônicos" (docx [881])
- Mineralogia.descricao: removed invented "proteções elementais" → "afiadores (metais que atribuem propriedades elementais a equipamentos)" (docx [882])
- Zoologia.descricao: removed invented "mutações temporárias" → "soros (concedem mutações a quem os ingere) e ossadas (catalizadores de mágicas)" (docx [883])
- Poções.descricao: replaced "Cria poções durante descanso" → "Permite usar e reconhecer poções de qualquer campo" (docx [884])
- Poções.teste: replaced "RAZ [Alquimia] no descanso — falha/10+/20+" → "Passiva — desbloqueia uso e reconhecimento de poções"

**Criatividade (6 proficiências, 11 edits):**
- Recapitular: completely rewritten — mechanic is blending effects from memory, not instant-casting same spell
- Reciclar: removed "já ativa" (not about active spells) — corrected to descriptor modification (dano, atributo-base, alvo)
- Reforçar: expanded to include Criaturas applicability and mana cost scale (+50%/+75%)
- Repartir: added 50% potency loss and "gasta 1 Foco para manter encantamento repartido"
- Replicar: completely rewritten — mechanic is copying Feitiço at conjuration time (not reproducing objects)
- Solução: corrected from general improvisation to "uso criativo de mágica dentro do domínio"

**Investigação (4 proficiências, 10 edits — includes 2 nome changes per D-01):**
- Selo de Feitiço: rewritten — stores feitiço in descanso, consumed as reação (not auto-trigger on surfaces)
- Encantamento → Selo de Encantamento: nome changed (D-01); descricao/teste rewritten to match Selo de Feitiço pattern
- Invocação → Selo de Invocação: nome changed (D-01); descricao/teste rewritten to match pattern
- Leitura: removed "runas, mapas antigos" → "ler e escrever; aprender novas mágicas por livros" (docx [906])

**Mecânica (4 proficiências, 8 edits):**
- Artesão: removed "joias", "durabilidade", "até 3 melhorias elementais" (invented) → "acessórios mágicos variados"; teste changed from RAZ scale to Passiva
- Feiticeiro: removed weapon stats (1d4/9m, 1d6/18m) (invented); added "vestimentas mágicas" (FIDE-09); teste changed to Passiva
- Ferreiro: removed "propriedades especiais", "até 3 melhorias elementais" → "armas, armaduras e equipamentos mágicos"; teste changed to Passiva
- Artefatos: removed "1 mana incolor", "cargas perdidas" (invented) → "usar de qualquer profissão; reparar em descanso"; teste changed to Passiva

**Sobrevivência (6 proficiências, 12 edits):**
- All 5 sub-proficiências (Acampamento, Harmonização, Forrageamento, Manufaturação, Treinamento): descricao and teste now explicitly state which descanso action they modify and the new test formula
- Coleta: removed "ossadas" (incorrect) → "herbais, minerais ou animais"; teste changed from RAZ scale to Passiva

### Task 2: Bloco ESPÍRITO (10 field edits)

- Provocar: "todos os ataques a você" → "se concentre apenas em você"; VON → IP Espiritual
- Coordenar: "um aliado" → "dois ou mais aliados"; INT test removed → Passiva; added "objetivo em comum" requirement
- Inspirar: "+1d20 vantagem" → "bônus igual ao valor em Expressão em uma perícia de sua escolha"; PRE test removed → Passiva
- Amedrontar: "desvantagem −1d20" → "afugentar... para que elas não o ataquem"; VON [Intimidação] → PRE [Intimidação] contra IP Espiritual
- Distrair: "Remove a reação" → "penalidade igual ao valor em Lábia em uma perícia de sua escolha"; INT → PRE, "IP Espiritual"

## Verification Results

### TypeScript
- After Task 1: `npx tsc --noEmit` — PASS, zero errors
- After Task 2: `npx tsc --noEmit` — PASS, zero errors

### Final Verification Checks

| # | Check | Result |
|---|-------|--------|
| 1 | `npx tsc --noEmit` | PASS — zero errors |
| 2 | `grep "usar e reconhecer"` | PASS — match at line 97 (Poções) |
| 3 | `grep "acrescentar parcialmente"` | PASS — match at line 105 (Recapitular) |
| 4 | `grep "Selo de Encantamento\|Selo de Invocação"` | PASS — matches at lines 119, 120 |
| 5 | `grep "vestimentas m"` | PASS — match at line 130 (Feiticeiro) |
| 6 | 6 Sobrevivência test formulas | PASS — all 6 present (Atletismo, Comunhão, Sobrevivência+Sobrevivência, Alquimia, Mecânica, Artes Marciais/Investigação/Lábia) |
| 7 | `grep "IP Espiritual\|valor em Expressão\|valor em Lábia"` | PASS — 5 matches (3 + 1 + 1) |
| 8 | Banned texts (0 matches expected) | PASS — "todos os ataques a você": 0, "Remove a reação": 0, "RAZ [Alquimia] no descanso": 0. Note: "vantagem (+1d20)" appears once at line 84 (Pontaria/Mirar in corpo block — correct, untouched) |
| 9 | `grep "Derruba o alvo; ele precisa gastar 1 movimentação"` | PASS — match at line 31 (corpo intact) |

### Protected Fields Intact

- All `requisito` fields unchanged (verified by presence of Requer Alquimia/Criatividade/Investigação/Mecânica/Sobrevivência lv.1 and Requer X lv.3 for espirito)
- Corpo block (lines 25–87) untouched — verified by Derrubar string at line 31
- All `label`, `atributos`, `descricao` of PericiaData unchanged

## Requirements Satisfied

| ID | Description | Status |
|----|-------------|--------|
| FIDE-06 | Poções de Alquimia: usar e reconhecer (not criar) | DONE |
| FIDE-07 | Criatividade: Recapitular, Reciclar, Replicar (and all 6) corrected | DONE |
| FIDE-08 | Investigação: Selos renamed, Leitura reads/writes | DONE |
| FIDE-09 | Mecânica Feiticeiro includes vestimentas mágicas | DONE |
| FIDE-10 | Sobrevivência: 5 sub-proficiências describe exact descanso test change | DONE |
| FIDE-11 | ESPÍRITO: PRE vs IP Espiritual (not VON); Coordenar/Inspirar passivas | DONE |

## Deviations from Plan

None — plan executed exactly as written. All 56 field edits applied using Edit tool, never Write. Corpo block untouched. TypeScript valid after each task.

## Known Stubs

None — this plan performs textual data corrections only; no UI rendering changes, no mock data, no placeholders introduced.

## Threat Flags

No new security-relevant surface introduced. This plan is a static data file text correction with no network endpoints, auth paths, or schema changes.

## Self-Check: PASSED

- File `data/proficiencias.ts` modified: FOUND
- Commit `224e741` exists: FOUND
- All 9 verification checks: PASSED
