---
plan: "07-01"
phase: "07-habilidades"
status: completed
completed_at: "2026-05-16"
requirements_satisfied:
  - FIDE-12
  - FIDE-13
  - FIDE-14
  - FIDE-15
  - FIDE-16
  - FIDE-17
  - FIDE-18
---

# Plan 07-01 Summary — Habilidades

## What was done

Corrected `descricao` and `teste` fields for 7 habilidades in `data/habilidades.ts` to match docx v0.4. 13 field edits total across 2 tasks.

## Task 1 — Corpo (6 edits)

| Habilidade | Field | Change |
|------------|-------|--------|
| Alcance | descricao | Added sucesso clause: "impede o avanço — o alvo move apenas metade do deslocamento" |
| Alcance | teste | Added consequence: "sucesso = metade do deslocamento" |
| Destreza | descricao | Replaced abstract "dW I–V" notation with real dice: "1d4 → 1d6 → 1d8 → 1d10 → 1d12"; added "bastões" |
| Destreza | teste | Replaced "dW I–V" with "1d4 · 1d6 · 1d8 · 1d10 · 1d12"; added bastões |
| Golpe Duplo | descricao | Added "ou a até dois alvos adjacentes" and "Não aplicável a armas de duas mãos" |
| Golpe Duplo | teste | Added "até dois alvos adjacentes; não se aplica a armas de duas mãos" |

## Task 2 — Mente/Espirito (7 edits)

| Habilidade | Field | Change |
|------------|-------|--------|
| Grimório | descricao | Inverted meaning: "sem precisar de grimórios ou observação" (was: "através de grimórios ou observação") |
| Modelagem | descricao | Replaced vague "ressurge na cena" with explicit trigger: "quando ela morre, pode ser reativada na mesma cena" |
| Modelagem | teste | Same trigger fix in teste field |
| Fúria | descricao | Added 3 triggers before mechanic: "Ao sofrer dano, falhar em teste de combate ou presenciar aliado cair" |
| Fúria | teste | Added triggers to teste field |
| Toque Mortífero | descricao | Added trigger prefix: "Quando for alvo do ataque de uma criatura" |
| Toque Mortífero | teste | Added "aciona quando for alvo de ataque" |

## Verification

- `npx tsc --noEmit` — zero errors
- All 6 untouched habilidades (Ameaçar, Atropelar, Iniciativa, Ímpeto, Vigilância + Fetiche, Mixologia, Travessia, Regenerar, Salvaguarda, Vidência) verified intact
- All protected fields (nome, instancia, prerequisito, custo, tipo) unchanged
- Old incorrect strings fully removed (dW notation, "através de grimórios", "ressurge na cena" vague, missing triggers)

## Requirements

FIDE-12 (Destreza dados reais + bastões) ✓  
FIDE-13 (Golpe Duplo alvos adjacentes + restrição duas mãos) ✓  
FIDE-14 (Alcance efeito de sucesso) ✓  
FIDE-15 (Fúria 3 triggers) ✓  
FIDE-16 (Grimório sem grimórios) ✓  
FIDE-17 (Modelagem reativação na mesma cena) ✓  
FIDE-18 (Toque Mortífero trigger antes da mecânica) ✓  
