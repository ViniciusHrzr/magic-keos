# Phase 6: Proficiências MENTE/ESPÍRITO - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Corrigir os campos `descricao`, `teste`, e em dois casos o campo `nome`, das proficiências nos blocos `mente` e `espirito` de `data/proficiencias.ts` para ficarem fiéis ao docx oficial "Magic no Universo Kéos v.0.4.docx".

Arquivo único modificado: `data/proficiencias.ts`
Blocos afetados: `mente` (linhas 88–148) e `espirito` (linhas 149–190)
Blocos intocáveis: `corpo` (já corrigido na Phase 5)

</domain>

<decisions>
## Implementation Decisions

### Investigação — nome field changes
- **D-01:** Mudar o campo `nome` de `'Encantamento'` → `'Selo de Encantamento'` e de `'Invocação'` → `'Selo de Invocação'`. Isso afeta os labels dos chips na UI.
- **D-02:** Aceitar data loss — personagens que tinham essas proficiências selecionadas perdem a seleção silenciosamente. Nenhuma migration em `migrate()` necessária.

### Alquimia — scope completo
- **D-03:** Todas as 4 proficiências de Alquimia precisam correção: `Herbologia`, `Mineralogia`, `Zoologia` e `Poções`. Não apenas Poções.

### Fonte dos valores de correção
- **D-04:** O researcher deve derivar os valores exatos a partir das pistas nos REQUIREMENTS.md (FIDE-06 a FIDE-11) e do padrão estabelecido na Phase 5. O usuário não fornecerá os textos — o researcher precisa inferir/pesquisar.

### Campos protegidos
- **D-05:** Mesmo padrão da Phase 5: NUNCA alterar `label`, `atributos`, `descricao` de `PericiaData` (nível da perícia, não da proficiência), nem tocar o bloco `corpo`.
- **D-06:** O campo `requisito` não deve ser alterado em nenhuma proficiência.

### ESPÍRITO — mecânicas significativamente diferentes
- **D-07:** FIDE-11 implica mudanças substanciais de mecânica para as 5 proficiências espirituais:
  - `Provocar`: teste correto é vs IP Espiritual, não VON
  - `Coordenar`: afeta 2+ aliados (não 1); mechânica de ação extra pode mudar
  - `Inspirar`: bônus = valor em Expressão em uma perícia específica (não +1d20 vantagem)
  - `Amedrontar`: efeito é afugentar para não atacar (não impor desvantagem −1d20)
  - `Distrair`: penalidade = valor em Lábia em uma perícia (não remove reação)

### TypeScript validation
- **D-08:** Rodar `npx tsc --noEmit` após cada task para garantir TS válido antes de continuar.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — FIDE-06 (Alquimia), FIDE-07 (Criatividade), FIDE-08 (Investigação), FIDE-09 (Mecânica), FIDE-10 (Sobrevivência), FIDE-11 (ESPÍRITO)

### Source of Truth
- `data/proficiencias.ts` — arquivo a editar; blocos `mente` (ln 88–148) e `espirito` (ln 149–190) são o alvo

### Phase 5 Pattern (modelo a seguir)
- `.planning/phases/05-proficiencias-corpo/05-RESEARCH.md` — estrutura de research com valores exatos; seguir o mesmo formato de "Exact Replacement Values" por sub-seção de perícia
- `.planning/phases/05-proficiencias-corpo/05-01-PLAN.md` — estrutura do plano: task por grupo de perícias, acceptance_criteria por campo, verificações grep

### Project Context
- `.planning/PROJECT.md` — decisões de arquitetura e convenções
- `.planning/ROADMAP.md` — Phase 6 goal e success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/proficiencias.ts` — estrutura de dados já definida; campos `Proficiencia` = `{ nome, descricao, teste, requisito? }`. Phase 6 segue exatamente o mesmo padrão de edição da Phase 5.

### Established Patterns
- **Edit tool por proficiência**: editar campo a campo usando old_string → new_string para minimizar risco de conflito de posição
- **Chip key = `pericia:nome`**: mudar `nome` de `Encantamento` → `Selo de Encantamento` altera a key armazenada no AsyncStorage — aceito sem migration (D-02)
- **TypeScript strict**: `npx tsc --noEmit` é gate obrigatório após cada task
- **Nunca reescrever o arquivo inteiro**: usar Edit, não Write, para preservar campos não alterados

### Integration Points
- `app/(tabs)/regras.tsx` §4 renderiza proficiencias.ts dinamicamente — correções aparecem automaticamente sem tocar o componente
- `components/rpg/ProficienciasSection.tsx` — exibe chips com nome das proficiências; mudança de `nome` muda o label visível e a key de persistência

</code_context>

<specifics>
## Specific Ideas

- Phase 5 organizou as tasks por grupo de perícias (Task 1: Artes Marciais + Atletismo; Task 2: Esgrima + Furtividade + Pontaria). Phase 6 deve seguir agrupamento similar — ex: Task 1: Alquimia + Criatividade + Investigação + Mecânica + Sobrevivência (bloco mente), Task 2: ESPÍRITO (5 proficiências espirituais).
- O researcher deve produzir uma seção "Exact Replacement Values" por perícia, com campos `nome` (quando muda), `descricao` e `teste` exatos para cada proficiência — igual ao 05-RESEARCH.md.
- Para ESPÍRITO, o researcher precisa derivar os testes corretos a partir dos hints em FIDE-11 (IP Espiritual, valor em Expressão, valor em Lábia, etc.) e confirmar a estrutura exata.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-proficiencias-mente-espirito*
*Context gathered: 2026-05-16*
