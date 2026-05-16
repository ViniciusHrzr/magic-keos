# Retrospective — Magic Kéos App

## Milestone: v1.0 — MVP

**Shipped:** 2026-05-15
**Phases:** 4 | **Plans:** 11 | **Commits:** ~50

### What Was Built

1. **Foundation stability** — debounce 500ms, useMemo/useCallback memoization, isLoaded hydration guard, ErrorBoundary por aba
2. **Input validation** — NumericStepper para IP BASE/BÔNUS (min=0); veneno 0–10 já garantido pelo VenenoTracker existente
3. **Font & dead code** — fontsLoaded guard elimina flash de glifos; modal.tsx e explore.tsx removidos; spell-constants.ts deduplica constantes
4. **Component extraction** — StatPill, SpellDetailCard extraídos para components/rpg/; SpellDetailCard compartilhado entre magia e grimório
5. **Filter persistence** — filtros do grimório sobrevivem navegação entre abas via module-level vars
6. **Regras tab** — 4ª aba com 8 seções de referência estática + campo Notas persistido
7. **Proficiências chips** — ProficienciasSection (CORPO/MENTE/ESPÍRITO), migration string→string[] automática

### What Worked

- **Wave-based parallelism**: plans sem sobreposição de arquivos executados em paralelo reduziram o tempo total de execução
- **Pre-satisfied requirements discovery**: FICHA-02 (veneno clamp) identificado como já implementado antes de gastar trabalho — bom sinal de que REQUIREMENTS.md foi lido antes de planejar
- **Module-level vars para filtros**: solução simples, zero Context, zero AsyncStorage, funciona perfeitamente para o caso de uso (processo-vivo)
- **Chips com key `pericia:nome`**: esquema de key composta evitou bugs sutis de colisão sem adicionar complexidade
- **NumericStepper reuse**: zero código de validação novo — reutilizar componente existente com min=0 default foi a decisão certa

### What Was Inefficient

- **REQUIREMENTS.md nunca atualizado durante execução**: traceability table ficou 100% stale; precisou de atualização retroativa no milestone close. Em v1.1, atualizar REQUIREMENTS.md ao final de cada fase.
- **`.continue-here` handoff stale**: arquivo de planejamento criado durante a sessão de planejamento, nunca limpo após execução completa. Lembrar de remover handoffs obsoletos.
- **STATE.md progress vs ROADMAP checkboxes dessincronia**: STATE reportava 100% mas ROADMAP tinha inconsistências menores nos campos de status. Sincronização mais rigorosa no final de cada fase seria melhor.

### Patterns Established

- **useCallback([update]) para todos os setters de Context**: padrão agora documentado em PATTERNS.md
- **useMemo no valor do Provider**: previne re-renders — sempre aplicar em novos Contexts
- **Migration guard pattern**: `if (typeof parsed.field === 'oldType') parsed.field = defaultValue` — usar consistentemente para mudanças de schema
- **Flat scroll para referência de sessão**: sem accordion, sem nesting — acesso rápido é mais importante que compactação em telas de referência
- **Module-level vars para estado processo-vivo**: alternativa leve ao Context para estado que não precisa sobreviver ao kill do app

### Key Lessons

1. **Read REQUIREMENTS.md antes de planejar cada fase** — evita trabalho desnecessário (como FICHA-02)
2. **Atualizar traceability ao final de cada fase** — não deixar para o milestone close
3. **FICHA-04 trade-off**: decisão certa diferir extração de index.tsx — app funcional > arquitetura ideal; mas o debt existe e deve entrar em v1.1
4. **migrate() sem versão**: funciona para mudanças simples, mas será fragilidade para mudanças maiores de schema em v1.1

---

## Cross-Milestone Trends

| Metric | v1.0 |
|--------|------|
| Phases | 4 |
| Plans | 11 |
| Requirements shipped | 15/16 |
| Duration | 1 day |
| Deferred to next | 1 req + schema debt |
