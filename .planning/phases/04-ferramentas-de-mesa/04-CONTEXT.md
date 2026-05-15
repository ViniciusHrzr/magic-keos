# Phase 04: Ferramentas de Mesa - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Source:** .continue-here checkpoint (scope revised by user in prior session)

<domain>
## Phase Boundary

Phase 04 delivers two quality-of-play improvements for in-session use:

1. **Aba "Regras"** — 4th tab with scrollable in-session rules reference (8 sections from GAME_RULES.md) plus a persistent "Notas" TextInput connected to the character model.
2. **Seletor de Proficiências estruturado** — replaces the free-text `proficiencias: string` field with a toggleable chip UI grouped by perícia category, backed by `proficiencias: string[]` in the character model.

**Scope NOT included (deferred to v2):**
- Rolador de dados coloridos (dice roller)
- Rastreador de iniciativa (combat turn tracker)
- Calculadora de veneno (poison tracker)

</domain>

<decisions>
## Implementation Decisions

### D-01: Aba Regras — dados no modelo
- Adicionar `notas: string` (default `''`) à interface `Character` em `types/character.ts`
- Adicionar migration: `if (!parsed.notas) parsed.notas = ''` no bloco de migration de `CharacterContext`
- Adicionar `setNotas: (v: string) => void` ao context e provider

### D-02: Aba Regras — tela
- Arquivo novo: `app/(tabs)/regras.tsx`
- Conteúdo estático das seções vem de `GAME_RULES.md` §4 / §6 / §9 / §12 / §17 / §18 / §19
- Layout: ScrollView com 8 seções colapsáveis ou sequenciais:
  1. Mecânica de Dados — tabela dW/dG/dR/dB/dU
  2. Testes — tabela de dificuldade (5/10/15/20/25/30)
  3. Combate — ações por turno + lista de ações
  4. Condições — efeitos de status + tabela de marcadores de Veneno
  5. Canalização — tabela de resultados de rolar para canalizar
  6. Descanso — tabela de ações de descanso
  7. Balizadores — tabela de referência rápida
  8. Notas — TextInput conectado a `c.notas` via `setNotas`

### D-03: Aba Regras — registro no layout
- Adicionar aba em `app/(tabs)/_layout.tsx` após a aba Grimório
- Ícone: `book.pages.fill` ou `list.bullet` (SF Symbols)

### D-04: Proficiências — mudança de tipo
- `proficiencias: string` → `proficiencias: string[]` em `types/character.ts`
- Default: `proficiencias: []`
- Migration: `if (typeof parsed.proficiencias === 'string') parsed.proficiencias = []`
- Setter `setProficiencias` mantém o mesmo nome, nova assinatura: `(v: string[]) => void`

### D-05: Proficiências — arquivo de dados
- Novo arquivo `data/proficiencias.ts` com estrutura completa:
  - **CORPO**: artesMarciais, atletismo, esgrima, furtividade, pontaria
  - **MENTE**: alquimia, criatividade, investigacao, mecanica, sobrevivencia
  - **ESPÍRITO**: comunhao, diplomacia, expressao, intimidacao, labia
- Cada entrada: chave = nome da perícia, valor = array de strings (nomes das proficiências)
- Proficiências especiais com nível: ex. `"Aparar (reação lv.2)"`, `"Poções (lv.1)"`

### D-06: Proficiências — componente
- Novo componente `components/rpg/ProficienciasSection.tsx`
- Props: `selected: string[]`, `onChange: (v: string[]) => void`
- Renderiza todas as perícias como seções expansíveis
- Cada proficiência = chip togglável (selecionado = gold highlight, não selecionado = muted)
- Chave de chip: `"pericia:nome"` (ex. `"artesMarciais:Derrubar"`)
- Toggle: se em `selected` → remover; se não → adicionar

### D-07: Proficiências — substituição na tela principal
- Em `app/(tabs)/index.tsx`: substituir `<TextInput value={c.proficiencias} onChangeText={setProficiencias} ...>` por `<ProficienciasSection selected={c.proficiencias} onChange={setProficiencias} />`

### Claude's Discretion
- Estrutura visual exata das seções da aba Regras (accordion vs. scroll flat)
- Animações/transições dos chips de proficiência
- Densidade de informação nas tabelas de regras (inline vs. modal)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Character model and context
- `types/character.ts` — interface `Character` + defaults
- `store/CharacterContext.tsx` — context, provider, migration block, setter pattern

### Existing component patterns
- `components/rpg/NumericStepper.tsx` — component structure reference
- `components/rpg/SpellDetailCard.tsx` — component structure reference
- `constants/theme.ts` — `RPG.*` style tokens

### Tab registration
- `app/(tabs)/_layout.tsx` — tab registration; `explore` tab uses `href: null` to hide — same pattern for any hidden tabs

### Icon library
- `components/ui/icon-symbol.tsx` — SF Symbols name mapping

### Game content source
- `GAME_RULES.md` — sections §4 / §6 / §9 / §12 / §17 / §18 / §19 for Regras tab content

</canonical_refs>

<specifics>
## Specific Ideas

- Proficiências structured data (from .continue-here):
  - CORPO: artesMarciais [Derrubar, Desarmar, Desviar, Fintar, Imobilizar, "Aparar (reação lv.2)"], atletismo [Investida, Prontidão, Fôlego, "Disparar (reação lv.1)"], esgrima ["Armas Leves", "Uma Mão", "Duas Mãos", Especialização, Mestria, "Contra-atacar (reação lv.2)"], furtividade ["Ataque Furtivo", "Ataque Letal", "Ataque Silencioso", "Esquivar (reação lv.1)"], pontaria [Arcos, Arremesso, Condutores, Especialização, Mestria, "Mirar (reação lv.2)"]
  - MENTE: alquimia [Herbologia, Mineralogia, Zoologia, "Poções (lv.1)"], criatividade [Recapitular, Reciclar, Reforçar, Repartir, Replicar, "Solução (lv.1)"], investigacao ["Selo de Feitiço", Encantamento, Invocação, "Leitura (lv.1)"], mecanica [Artesão, Feiticeiro, Ferreiro, "Artefatos (lv.1)"], sobrevivencia [Acampamento, Harmonização, Forrageamento, Manufaturação, Treinamento, "Coleta (lv.1)"]
  - ESPÍRITO: comunhao ["Provocar (ação livre lv.3)"], diplomacia ["Coordenar (ação livre lv.3)"], expressao ["Inspirar (ação livre lv.3)"], intimidacao ["Amedrontar (ação livre lv.3)"], labia ["Distrair (ação livre lv.3)"]
- Tabelas de regras: conteúdo em PT-BR conforme GAME_RULES.md
- Context setter pattern: todos os setters usam `useCallback([update])` — manter padrão

</specifics>

<deferred>
## Deferred Ideas

- Rolador de dados coloridos (dW/dG/dR/dB/dU) — original MESA-01, diferido para v2
- Rastreador de iniciativa (ordem de combate) — original MESA-02, diferido para v2
- Calculadora de veneno (tracker visual 0–10) — original MESA-03, diferido para v2

</deferred>

---

*Phase: 04-ferramentas-de-mesa*
*Context gathered: 2026-05-15 via .continue-here checkpoint (prior session scope revision)*
