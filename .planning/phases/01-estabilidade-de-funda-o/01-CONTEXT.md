# Phase 1: Estabilidade de Fundação - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Corrigir quatro problemas de estabilidade existentes no app — todos centrados em `store/CharacterContext.tsx` e nas boundaries de erro:

1. **FOUND-01** — Debounce nas escritas do AsyncStorage (jank no Android ao digitar)
2. **FOUND-02** — Loading state durante hidratação inicial (flash de ficha zerada / race condition)
3. **FOUND-03** — Error boundaries por aba (crash isolado não derruba o app inteiro)
4. **FOUND-04** — Memoização do CharacterContext (re-renders desnecessários em toda a árvore)

**Restrição central:** Nenhuma lógica de funcionamento da ficha é alterada. Setters, transformações de dados, estrutura do personagem e comportamento do usuário permanecem idênticos. As mudanças são puramente na camada de persistência e isolamento de erro.

</domain>

<decisions>
## Implementation Decisions

### Debounce de Escrita (FOUND-01 + Concern #6)
- **D-01:** Debounce ALL `AsyncStorage.setItem` calls em ~500ms usando `useRef + setTimeout` dentro do `update()` callback. O timer reseta a cada novo update. Estado React permanece imediato — só a persistência ao disco aguarda.
- **D-02:** Adicionar `.catch(err => console.error('AsyncStorage write failed:', err))` em TODOS os `setItem` fire-and-forget (não apenas em `update()` — também em `switchTo`, `createChar`, `deleteChar`, `importJson`). Sem alertas visíveis ao usuário; captura silenciosa para debug.
- **D-03:** Não diferenciar TextInput vs. botão — a mesma lógica de debounce se aplica a todas as escritas. Simplifica a implementação e o comportamento do usuário é idêntico (estado atualiza imediatamente, só a persistência aguarda).

### Estado de Carregamento (FOUND-02)
- **D-04:** Adicionar `isLoaded: boolean` ao estado do `CharacterProvider` (inicialmente `false`, vira `true` ao fim do `useEffect` de load). Expor via contexto (`useCharacter()` retorna `isLoaded`).
- **D-05:** As screens renderizam um indicador simples de carregamento (`ActivityIndicator` ou `null`) quando `isLoaded === false`. Isso previne o flash de dados zerados e elimina a race condition (edits só são possíveis após `isLoaded = true`).
- **D-06:** Não alterar a lógica de hidratação nem o `migrate()` — apenas adicionar o flag de loading. Schema versioning em `migrate()` (Concern #11) é avaliado em fase posterior.

### Error Boundaries (FOUND-03)
- **D-07:** Criar um componente `ErrorBoundary` (class component React) em `components/rpg/ErrorBoundary.tsx`.
- **D-08:** Adicionar um boundary por aba: envolver cada screen (`FichaScreen`, `MagiaScreen`, `GrimorioScreen`) com `<ErrorBoundary>` em `app/(tabs)/_layout.tsx`. Crash na Ficha não derruba Magia nem Grimório.
- **D-09:** Adicionar um boundary global em `app/_layout.tsx` como fallback (caso o erro ocorra fora das tabs).
- **D-10:** Mensagem de erro: `"Algo deu errado nesta tela. Reinicie o app ou navegue para outra aba."` — mínima e informativa. Visual simples, sem breaking o RPG theme.

### Memoização do CharacterContext (FOUND-04)
- **D-11:** Wrapping do objeto `value` do `CharacterContext.Provider` em `useMemo` (refs: CONCERNS.md #2 e #14, `store/CharacterContext.tsx` linhas 222–231).
- **D-12:** Adicionar `useCallback` em TODOS os `set*` functions que atualmente não têm (linhas 121–154 em `CharacterContext.tsx`). As que já têm `useCallback` (`update`, `charList`, `switchTo`, `createChar`, `deleteChar`, `exportJson`, `importJson`) não precisam mudar.
- **D-13:** React Compiler já está ativo (`experiments.reactCompiler: true`) — cobre memoização de componentes. A memoização manual no provider é necessária além do compiler porque o valor do provider não é otimizado automaticamente pelo compiler.
- **D-14:** Manter contexto único (`CharacterContext`) — não dividir em dois contextos. React Context + AsyncStorage está locked.

### Claude's Discretion
- Ordem de implementação dos 4 fixes: a critério do planejador (sugestão natural: D-11/D-12 primeiro, depois D-01, D-04, D-07/D-08 — cada um independente dos outros).
- `ActivityIndicator` vs `null` durante loading: a critério — mínimo que funcione.
- Placement exato dos boundaries por aba: `_layout.tsx` wrapping ou dentro de cada screen — a critério técnico.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos e Critérios de Sucesso
- `.planning/REQUIREMENTS.md` — FOUND-01, FOUND-02, FOUND-03, FOUND-04 com descrições
- `.planning/ROADMAP.md` — Phase 1 success criteria (4 critérios verificáveis)

### Análise do Código Existente
- `.planning/codebase/CONCERNS.md` — Issues #1, #2, #5, #6, #14: refs exatas de arquivo e linha para cada problema a corrigir
- `.planning/codebase/ARCHITECTURE.md` — CharacterContext state management, persistence pattern, navigation structure

### Arquivos Primários a Modificar
- `store/CharacterContext.tsx` — arquivo central: update(), load effect, set* functions, Provider value
- `app/_layout.tsx` — onde adicionar global error boundary
- `app/(tabs)/_layout.tsx` — onde adicionar error boundaries por aba

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `store/CharacterContext.tsx:112` — função `update()`: ponto central de persistência; debounce vai aqui
- `store/CharacterContext.tsx:72-108` — `useEffect` de load: onde adicionar `setIsLoaded(true)` após hydration
- `store/CharacterContext.tsx:121-154` — batch de `set*` functions sem `useCallback`: alvo do D-12
- `store/CharacterContext.tsx:222-231` — objeto `value` do Provider: alvo do `useMemo` (D-11)

### Established Patterns
- `useCallback` já usado para: `update`, `charList`, `switchTo`, `createChar`, `deleteChar`, `exportJson`, `importJson` — seguir o mesmo padrão para os `set*` restantes
- `useRef` já disponível (React hooks em uso) — usar para armazenar o timeout do debounce
- `ActivityIndicator` disponível via React Native — usar para loading state se necessário
- `RPG.*` tokens de tema centralizados em `constants/theme.ts` — usar no ErrorBoundary UI

### Integration Points
- `CharacterContext.Provider` em `app/_layout.tsx` — wrapping global onde global ErrorBoundary vai acima
- `app/(tabs)/_layout.tsx` — onde cada tab screen é renderizada; boundaries por aba aqui
- `useCharacter()` hook — onde `isLoaded` será exposto para as screens consumirem

</code_context>

<specifics>
## Specific Ideas

- Debounce window de ~500ms (recomendado para Android de médio porte; configurável no código mas 500ms como default)
- Error boundary: class component React padrão (não existe lib externa; implementação manual)
- `.catch(err => console.error(...))`: log simples sem stack trace completo em produção — apenas a mensagem de erro

</specifics>

<deferred>
## Deferred Ideas

- **Reestruturar aba Proficiências** — Adicionar proficiências por perícia (Artes Marciais, etc.) consultáveis das regras do jogo. Nova feature, não é estabilidade — fase futura.
- **Schema versioning em migrate()** (CONCERNS.md #11) — `migrate()` sem campo de versão é uma fragilidade conhecida. Avaliar se o schema mudar em fases posteriores; não alterar em Phase 1 para não tocar na lógica de migração.

</deferred>

---

*Phase: 1-Estabilidade de Fundação*
*Context gathered: 2026-05-15*
