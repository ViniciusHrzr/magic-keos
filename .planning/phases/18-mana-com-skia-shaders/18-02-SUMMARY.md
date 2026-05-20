---
plan: "18-02"
status: completed
commit: "20eb0fd"
---

# Summary: MANA-03 — CanalizacaoGrid

## Arquivos criados/modificados

- **`components/rpg/CanalizacaoGrid.tsx`** (novo): checkboxes chanfrados via Skia.Path, drop-in compatível com CheckboxGrid, useMemo para path único compartilhado, fallback RN puro
- **`app/(tabs)/magia.tsx`** (modificado): import CanalizacaoGrid adicionado, bloco Canalização usa \<CanalizacaoGrid\>, Velocidade mantém \<CheckboxGrid\> inalterado

## Constantes finais

- `CHECKBOX_SIZE = 22` (manteve mesma dimensão do CheckboxGrid)
- `CHAMFER = 5` (~22% do lado — proporcional ao padrão LegendaryFrame)
- `STROKE_WIDTH = 1.5` (mesmo que LegendaryFrame)

## Pattern replicado

`makeChamferPath` copiado exatamente de `LegendaryFrame.tsx`, com `skiaAvailable` guard em module scope (não dentro do componente).

## Validação

- `npx tsc --noEmit` → 0 erros
- `npx expo lint` → 0 novos warnings
- `CheckboxGrid.tsx` não foi modificado
- Interface Props drop-in compatível: `boxes`, `onChange`, `cols` (aceito mas não usado no layout — mesmo comportamento do original)
