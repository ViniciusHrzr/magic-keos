---
phase: 17-vitalidade-status
plan: 01
status: complete
completed_at: 2026-05-18
requirements: [VIT-01]
commit: 49da6dd
---

# Plan 01 Summary — VidaBar Component (VIT-01)

## One-liner

Barra de vida layered com 5 camadas visuais (atual/necro/total/armadura/manto) em React Native Views puras, substituindo os 5 NumericSteppers horizontais por uma barra de progresso colorida com indicadores adaptativos.

## What was done

- Criado `components/rpg/VidaBar.tsx` — componente que recebe `vida: Character['vida']` e `onVidaChange` e renderiza:
  - Barra de progresso horizontal 22px de altura com `borderRadius 4` e `overflow: hidden`
  - Camada de preenchimento da vida atual com cor dinâmica: verde (`#2d7a2d`) quando >= 60%, âmbar (`#a05020`) quando >= 30%, vermelho (`RPG.red`) quando crítico
  - Overlay necro semi-transparente roxo (`rgba(100,0,160,0.5)`) quando `vida.necro > 0`
  - Badge "shield" com o valor de armadura abaixo da barra quando `vida.armadura > 0`
  - Borda ciana (`#00d4ff`) ao redor do componente inteiro quando `vida.manto > 0` (efeito aura)
  - 5 NumericSteppers compact abaixo da barra com labels (Total, Atual, Necro, Armadura, Manto)
- Atualizado `app/(tabs)/index.tsx`:
  - Adicionado import de `VidaBar`
  - Substituida seção VIDA (View map de 5 steppers) por `<VidaBar vida={c.vida} onVidaChange={setVida} />`
  - Removida função helper `vidaIcon`
  - Removidos 4 estilos orphãos: `vidaRow`, `vidaCell`, `vidaIcon`, `vidaLabel`
  - Mantidos `NumericStepper` (ainda usado em sabedoria/mana/InstanceBlock) e `Text` (ainda usado em todo o arquivo)

## Verification

- `npx tsc --noEmit`: PASS — TypeScript sem erros
- Human checkpoint: pendente — revisão visual necessária no dispositivo/emulador

## Deviations from Plan

Nenhum desvio. O plano foi executado exatamente como descrito. A implementação usou `(n + '%') as any` para os widths percentuais em vez de template literals, ambas abordagens equivalentes e aceitas pelo TypeScript.

## Notes

- A posição `relative` no `barContainer` foi declarada explicitamente em vez de usar `StyleSheet.absoluteFillObject` para o `fill` base — isso evita conflito de tipos no TypeScript com o `width` inline override.
- O componente é React Native Views puras, sem Skia, conforme especificado no plano (Skia reservado para Phase 18).
