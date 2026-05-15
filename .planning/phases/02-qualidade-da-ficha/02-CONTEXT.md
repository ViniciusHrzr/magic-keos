# Phase 2: Qualidade da Ficha - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Corrigir três bugs visíveis/de integridade na ficha de personagem e eliminar código morto herdado do template Expo. Escopo mínimo — somente o que afeta o jogador ou a integridade dos dados:

1. **FICHA-01** — IP Base e IP Bônus aceitam negativos (TextInput sem validação)
2. **FICHA-03** — PlanewalkerDings não carregada antes da primeira renderização (flash de glyphs errados em magia.tsx e grimorio.tsx)
3. **CODE-01** — `COLOR_HEX` e `GRAU_COLORS` duplicados em `magia.tsx` e `grimorio.tsx`
4. **CODE-02** — `modal.tsx` é o template Expo padrão, nunca conectado ao app
5. **CODE-03** — `explore.tsx` re-exporta `magia.tsx` sem motivo, cria aba fantasma

**Fora de escopo nesta fase:**
- FICHA-02: Veneno 0–10 já é tratado pelo VenenoTracker via UI (toggle de bolhas) — sem trabalho necessário
- FICHA-04: Extração do InstanceBlock / redução de index.tsx para < 300 linhas — diferido

</domain>

<decisions>
## Implementation Decisions

### IP Validation (FICHA-01)
- **D-01:** Substituir os dois `TextInput` de IP Base e IP Bônus dentro de `InstanceBlock` por `NumericStepper` existente (`components/rpg/NumericStepper`). NumericStepper já tem `min=0` como padrão e clamp embutido — zero código novo necessário.
- **D-02:** `InstanceBlock` continua definido inline em `app/(tabs)/index.tsx` (FICHA-04 foi diferido). A mudança é apenas nos dois campos de IP dentro da função.

### Font Loading (FICHA-03)
- **D-03:** Em `app/_layout.tsx`, capturar o retorno de `useFonts`: `const [fontsLoaded] = useFonts({ PlanewalkerDings: ... })`. Adicionar guard imediatamente após: `if (!fontsLoaded) return null;`. Isso segura a renderização inteira até a fonte estar pronta (< 100ms em média).
- **D-04:** Não usar `SplashScreen.preventAutoHideAsync` / `SplashScreen.hideAsync()` — o `return null` é suficiente para eliminar o flash sem adicionar complexidade.

### Shared Spell Constants (CODE-01)
- **D-05:** Criar `constants/spell-constants.ts` com `COLOR_HEX` e `GRAU_COLORS` como named exports.
- **D-06:** Em `magia.tsx` e `grimorio.tsx`, remover as definições locais e importar de `@/constants/spell-constants`. Nenhuma lógica muda — só a localização das constantes.
- **D-07:** Nome do arquivo: `spell-constants.ts` (em inglês para manter consistência com os outros arquivos em `constants/`). Termos de domínio dentro do arquivo podem ser em português.

### Dead Code Removal (CODE-02, CODE-03)
- **D-08:** Deletar `app/modal.tsx` e remover a linha `<Stack.Screen name="modal" .../>` de `app/_layout.tsx`. Sem substituição — o modal não era usado.
- **D-09:** Deletar `app/(tabs)/explore.tsx`. O Expo Router vai remover a aba "Explore" automaticamente. Sem substituição.

### Claude's Discretion
- Estrutura interna de `spell-constants.ts` (tipos, comentários) — a critério do executor.
- Se `GRAU_COLORS` precisa de tipagem explícita (`string[]` vs `readonly`) — a critério.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos e Critérios
- `.planning/REQUIREMENTS.md` — FICHA-01, FICHA-03, CODE-01, CODE-02, CODE-03 com descrições
- `.planning/ROADMAP.md` — Phase 2 success criteria (5 critérios verificáveis)

### Arquivos a Modificar
- `app/_layout.tsx` — onde adicionar fontsLoaded guard e remover Stack.Screen modal
- `app/(tabs)/index.tsx` — onde substituir TextInput de IP por NumericStepper em InstanceBlock
- `app/(tabs)/magia.tsx` — onde remover COLOR_HEX/GRAU_COLORS locais e importar de spell-constants
- `app/(tabs)/grimorio.tsx` — onde remover COLOR_HEX/GRAU_COLORS locais e importar de spell-constants

### Arquivos a Criar
- `constants/spell-constants.ts` — novo arquivo com COLOR_HEX e GRAU_COLORS

### Arquivos a Deletar
- `app/modal.tsx` — template Expo não conectado ao app
- `app/(tabs)/explore.tsx` — re-export de magia, tab fantasma

### Componentes Existentes (reusar, não recriar)
- `components/rpg/NumericStepper.tsx` — já tem min/max/clamp; usar com min=0 (default) para IP

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/rpg/NumericStepper` (props: value, onChange, min=0, max=999, label, color, compact) — substitui TextInput de IP diretamente
- `constants/theme.ts` — padrão de constantes existente para seguir na criação de `spell-constants.ts`

### Established Patterns
- `useFonts` já importado em `app/_layout.tsx` linha 6 — só adicionar o destructure e o guard
- `COLOR_HEX` em `magia.tsx` linhas 334–344, `GRAU_COLORS` linha 347 — copiar exatamente para `spell-constants.ts`
- `COLOR_HEX` em `grimorio.tsx` linhas 21–35, `GRAU_COLORS` linha 36 — mesma definição, confirmar que são idênticas antes de deletar

### Integration Points
- `InstanceBlock` em `app/(tabs)/index.tsx` linhas 214–275: os campos `ipBase` e `ipBonus` com `TextInput` são o alvo de D-01/D-02
- `magia.tsx` e `grimorio.tsx` usam `COLOR_HEX` e `GRAU_COLORS` em múltiplos lugares inline — a deduplicação só muda o import, não os usos

</code_context>

<specifics>
## Specific Ideas

- Usuário quer mínimo de mudanças — cada fix deve ser o menor patch possível
- FICHA-02 (veneno) já funciona via VenenoTracker; não tocar
- FICHA-04 (extração InstanceBlock) diferida explicitamente — não incluir nesta fase

</specifics>

<deferred>
## Deferred Ideas

- **FICHA-04 — Extração do InstanceBlock** — Reduzir index.tsx para < 300 linhas extraindo InstanceBlock para `components/rpg/`. Diferido a pedido do usuário (não é crítico, é organização de código).
- **SplashScreen fontsLoaded** — Usar `SplashScreen.preventAutoHideAsync` + `hideAsync()` para transição de splash mais polida. Não necessário agora — `return null` é suficiente.

</deferred>

---

*Phase: 2-Qualidade da Ficha*
*Context gathered: 2026-05-15*
