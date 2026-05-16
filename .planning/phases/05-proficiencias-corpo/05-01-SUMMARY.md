---
phase: "05-proficiencias-corpo"
plan: 01
status: COMPLETED
date: 2026-05-16
---

# Summary: 05-01 — Corrigir Proficiências CORPO

## Status: COMPLETED

## Tasks Done

### Task 1: Artes Marciais + Atletismo
- **Artes Marciais (6 proficiências):** corrected `descricao` + `teste` for Derrubar, Desarmar, Desviar, Fintar, Imobilizar, Aparar — 12 fields edited
- **Atletismo (4 proficiências):** corrected `descricao` + `teste` for Investida, Prontidão, Fôlego, Disparar — 8 fields edited

### Task 2: Esgrima + Furtividade + Pontaria
- **Esgrima (5 of 6 proficiências):** corrected `descricao` for Armas Leves, Uma Mão, Duas Mãos; `descricao` + `teste` for Especialização, Mestria — 7 fields edited; Contra-atacar untouched
- **Furtividade (3 of 4 proficiências):** corrected `descricao` + `teste` for Ataque Furtivo, Ataque Letal, Ataque Silencioso — 6 fields edited; Esquivar untouched
- **Pontaria (6 proficiências):** corrected `descricao` for Arcos, Arremesso, Condutores; `descricao` + `teste` for Especialização, Mestria, Mirar — 9 fields edited

## Fields Edited: 42 total field writes across 32 logical fields
(Some descriptions and tests were combined in single-line edits; total unique proficiência entries corrected = 22)

## TypeScript: Passing
`npx tsc --noEmit` — no errors after all edits.

## Protected Fields: Intact (5 requisito fields confirmed)
- `Requer Artes Marciais lv.2` — line 36 ✓
- `Requer Atletismo lv.1` — line 47 ✓
- `Requer Esgrima lv.2` — line 60 ✓
- `Requer Furtividade lv.1` — line 71 ✓
- `Requer Pontaria lv.2` — line 84 ✓

## Key Verification Results
- `acurácia` — 0 matches (eliminated from Esgrima/Pontaria Especialização/Mestria)
- `dano adicional igual ao` — 3 matches (Investida, Ataque Letal, Mirar) ✓
- `+2 de dano adicional` / `+5 de dano adicional` — 4 matches (Esgrima Esp, Esgrima Mestria, Pontaria Esp, Pontaria Mestria) ✓
- No invented content remains: no "desvantagem em ataques", no "9m extras", no "condições graves", no "por uma rodada" in corpo block

## Requirements Satisfied
- FIDE-01 (Artes Marciais) ✓
- FIDE-02 (Atletismo) ✓
- FIDE-03 (Esgrima) ✓
- FIDE-04 (Furtividade) ✓
- FIDE-05 (Pontaria) ✓
