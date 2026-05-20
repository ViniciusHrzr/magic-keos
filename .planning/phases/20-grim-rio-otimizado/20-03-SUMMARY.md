---
phase: "20"
plan: "03"
subsystem: grimorio
tags: [navigation, reanimated, shared-element, expo-router, refactor]
dependency_graph:
  requires: [20-01, 20-02]
  provides: [spell-detail-route]
  affects: [grimorio, _layout]
tech_stack:
  added: [store/selectedSpell.ts, app/spell-detail.tsx]
  patterns: [module-singleton-data-bridge, route-based-navigation, shared-element-tag]
key_files:
  created:
    - store/selectedSpell.ts
    - app/spell-detail.tsx
  modified:
    - app/(tabs)/grimorio.tsx
    - app/_layout.tsx
    - .expo/types/router.d.ts
decisions:
  - "sharedTransitionTag suprimido com @ts-expect-error — API não tipada no Reanimated 4.1.7"
  - "router.back() em guard de null colocado em useEffect para evitar side-effect durante render"
  - ".expo/types/router.d.ts atualizado manualmente (gitignored, regenerado pelo Expo CLI em dev)"
metrics:
  duration: "~15 min"
  completed: "2026-05-19"
  tasks_completed: 8
  files_changed: 5
---

# Phase 20 Plan 03: Route-Based Spell Detail + Shared Element — Summary

**One-liner:** Substituição do Modal slide-in por rota /spell-detail com Animated.View + sharedTransitionTag para transição shared element no grimório.

## What Was Built

- `store/selectedSpell.ts` — singleton module-level para passar o objeto `Spell` entre grimório e tela de detalhe sem serializar via params de rota e sem circular imports
- `app/spell-detail.tsx` — tela full-screen que lê o spell do singleton, envolve `SpellDetailCard` em `Animated.View` com `sharedTransitionTag` correspondente, e usa `useCharacter` para o botão "+ Mágica"
- `app/_layout.tsx` — `Stack.Screen name="spell-detail"` registrado no Stack raiz com `headerShown: false, animation: 'none'` — garante que a tab bar seja coberta ao navegar
- `app/(tabs)/grimorio.tsx` — removidos `Modal`, `selected` state, `useSafeAreaInsets`, `insets`; adicionados `useRouter`, `Animated`, `selectedSpell`; spell row agora é `Animated.View` com `sharedTransitionTag` dentro de `TouchableOpacity` com `router.push('/spell-detail')`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Imports órfãos após remoção do Modal**
- **Found during:** T5
- **Issue:** `StatPill` e `SpellDetailCard` permaneceram importados em `grimorio.tsx` após remoção do Modal — TypeScript não reclamou (noUnusedLocals não está ativo), mas são dead imports
- **Fix:** Removidos ambos os imports
- **Files modified:** `app/(tabs)/grimorio.tsx`
- **Commit:** 0bcc1ec

**2. [Rule 1 - Bug] Tipos Expo Router não incluíam /spell-detail**
- **Found during:** T8 (tsc check)
- **Issue:** `.expo/types/router.d.ts` é gerado pelo Expo CLI em runtime — não continha `/spell-detail`, causando erro TS2345 em `router.push('/spell-detail')`
- **Fix:** Arquivo atualizado manualmente para incluir a rota. Arquivo está no `.gitignore` e será regenerado corretamente pelo Expo ao iniciar o servidor dev
- **Files modified:** `.expo/types/router.d.ts` (não commitado — gitignored)
- **Commit:** n/a (arquivo gitignored)

### Known API Deviation — sharedTransitionTag no Reanimated 4.x

O `sharedTransitionTag` não existe nos tipos TypeScript do `react-native-reanimated` 4.1.7. A API de shared element transitions foi introduzida no Reanimated 3.x e sua tipagem não foi portada para a v4 ainda. Solução aplicada: `@ts-expect-error` em ambos os usos (`grimorio.tsx` e `spell-detail.tsx`).

**Impacto em runtime:** A prop pode funcionar em runtime via herança de implementação nativa (iOS/Android), ou pode ser silenciosamente ignorada — degradando para uma transição sem animação (cross-fade padrão do Stack `animation: 'none'`). Verificação on-device necessária conforme especificado no plano (critério de aceitação de animação).

**Alternativa se degradar:** Implementar T4-FALLBACK do plano — medir posição da row com `View.measure`, armazenar no singleton, usar `useSharedValue` + `withTiming` em `spell-detail.tsx` para animar de origem até full-screen.

## Acceptance Criteria — Status

- [x] `store/selectedSpell.ts` existe
- [x] `app/spell-detail.tsx` existe com SpellDetailCard + useCharacter
- [x] `spell-detail` registrado no Stack raiz de `app/_layout.tsx`
- [x] Nenhum Modal, `selected` state, `insets`, ou `useSafeAreaInsets` em `grimorio.tsx`
- [x] `npx tsc --noEmit` passa sem erros
- [x] Sem circular imports (selectedSpell.ts importa apenas de @/data/grimoire)
- [ ] Animação shared element verificada on-device (necessário verificação manual)

## Known Stubs

Nenhum stub de dados — SpellDetailCard recebe spell real do singleton, `useCharacter` fornece dados reais de magicas.

## Self-Check: PASSED

- store/selectedSpell.ts: FOUND
- app/spell-detail.tsx: FOUND
- app/_layout.tsx modificado com spell-detail Stack.Screen: FOUND
- grimorio.tsx sem Modal: FOUND
- Commit 0bcc1ec: FOUND
