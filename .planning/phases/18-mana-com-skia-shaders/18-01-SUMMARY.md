---
plan: "18-01"
status: completed
commit: "5bc20a9"
---

# Summary: MANA-02 — ManaRow + ManaShadersLib

## Arquivos criados/modificados

- **`components/rpg/shaders/ManaShadersLib.ts`** (novo): 4 RuntimeEffect compilados em module scope + MANA_VISUAL_STRATEGY + ManaKey type
- **`components/rpg/ManaRow.tsx`** (novo): componente memoizado com useClock + useDerivedValue + fallback gracioso
- **`app/(tabs)/index.tsx`** (modificado): substituiu manaTypes.map por \<ManaRow\>, adicionou manaCanvasHeaderCol, removeu estilos órfãos (manaTableRow, manaStepperCell, manaDiamond, manaLabel), ajustou manaColorCol width 70→60

## Correção de import importante

O PLAN especificava `import { useClock } from 'react-native-reanimated'` mas o RESEARCH verificou que `useClock` é exportado de `@shopify/react-native-skia`. Import corrigido para:
```ts
import { ..., useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
```

## SKSL final (sem tuning — código exato do PLAN)

- **fireEffect (Vermelho)**: fract(sin(dot(...))) Perlin-like noise com `smoothstep(0.4, 0.9, noise * (1.0 - uv.y))`
- **wavesEffect (Azul)**: ondas concêntricas `sin(dist * 20.0 - iTime * 3.0)`
- **particlesEffect (Verde)**: 3 partículas ascendentes com `fract(t * speed)` offsets
- **neutralDistortionEffect (Incolor)**: hash estático `smoothstep(0.35, 0.85, n)`

## Validação

- `npx tsc --noEmit` → 0 erros
- `npx expo lint` → 0 novos warnings (18 warnings pré-existentes em outros arquivos)
- Active gate: canvas sem shader quando `total === 0`
- Fallback RN View quando `!skiaAvailable`
