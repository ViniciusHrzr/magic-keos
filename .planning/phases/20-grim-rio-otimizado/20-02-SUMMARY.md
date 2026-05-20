# Phase 20 Plan 02: MTG Pip Filter Symbols Summary

## One-liner

Substituição dos rótulos de texto do filtro de cor (Branco/Verde/etc.) por caracteres de pip da fonte PlanewalkerDings em botões circulares 36×36.

## What Was Built

O filtro de cores do Grimório agora exibe 5 ícones circulares de pip MTG (`a g d b u`) renderizados em PlanewalkerDings fontSize 20 na cor correspondente a cada escola mágica. O estado ativo/inativo (tint de fundo 33% + borda colorida) foi mantido intacto.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| T0 | Pre-check: PlanewalkerDings confirmado em `_layout.tsx` linha 16 | — |
| T1 | Adicionado `COLOR_PIP` constant (`a/g/d/b/u`) substituindo `COLOR_LABELS` | feaf0dd |
| T2 | JSX atualizado: `filterBtn` → `pipBtn`, `filterText` → `pipText`, `COLOR_LABELS` → `COLOR_PIP` | feaf0dd |
| T3 | Estilos: removidos `filterBtn`/`filterText`, adicionados `pipBtn` (36×36 circular) e `pipText` (PlanewalkerDings 20px) | feaf0dd |
| T4 | `COLOR_LABELS` removido (feito em conjunto com T1) | feaf0dd |
| T5 | `npx tsc --noEmit` — zero erros | feaf0dd |

## Files Modified

- `app/(tabs)/grimorio.tsx` — único arquivo alterado

## Acceptance Criteria — All Met

- [x] Color filter row mostra 5 ícones pip circulares (sem texto)
- [x] Caracteres pip renderizados em PlanewalkerDings na cor correta
- [x] Pip ativo mostra tint de fundo colorido (`COLOR_HEX[c] + '33'`)
- [x] Pip inativo mostra apenas borda colorida
- [x] `npx tsc --noEmit` passa
- [x] `COLOR_LABELS` removido do arquivo

## Pip Character Mapping Used

| Cor | Personagem | Escola MTG |
|-----|-----------|------------|
| branco | `a` | White (W) |
| verde | `g` | Green (G) |
| vermelho | `d` | Red (R) |
| preto | `b` | Black (B) |
| azul | `u` | Blue (U) |

## Deviations from Plan

Nenhuma — plano executado exatamente como escrito. T1 e T4 foram combinados em uma única operação (substituição inline da declaração `COLOR_LABELS` por `COLOR_PIP`).

## Self-Check

- `app/(tabs)/grimorio.tsx` — FOUND
- Commit `feaf0dd` — FOUND

## Self-Check: PASSED
