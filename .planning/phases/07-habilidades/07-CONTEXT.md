# Phase 7: Habilidades - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Corrigir os campos `descricao` e `teste` de todas as habilidades em `data/habilidades.ts` para ficarem fiéis ao docx oficial "Magic no Universo Kéos v.0.4.docx".

Arquivo único modificado: `data/habilidades.ts`
O researcher deve auditar TODAS as 13 habilidades (não apenas as 7 listadas em FIDE-12–18) para encontrar qualquer discrepância adicional.

A aba Regras (`regras.tsx` §5 Habilidades) NÃO é tocada nesta fase — Phase 8 corrige a aba Regras inteira.

</domain>

<decisions>
## Implementation Decisions

### Escopo de arquivos
- **D-01:** `data/habilidades.ts` é o único arquivo modificado. `regras.tsx` §5 é hardcode estático e será corrigido integralmente em Phase 8 junto com GAME_RULES.md e o restante da aba Regras.
- **D-02:** Phase 8 expande para corrigir a aba Regras INTEIRA (não apenas §5) — inclui GAME_RULES.md e regras.tsx completo.

### Cobertura de audit
- **D-03:** O researcher deve auditar TODAS as 13 habilidades contra o docx (não apenas as 7 de FIDE-12–18). Se encontrar discrepâncias adicionais, devem ser incluídas no plano como tasks extras ou edições adicionais na task correspondente.

### Campos protegidos
- **D-04:** Mesmo padrão das fases anteriores: NUNCA alterar `nome`, `instancia`, `prerequisito`, `custo`, `tipo`. Apenas `descricao` e `teste` são editáveis.

### Agrupamento de tasks
- **D-05 (Claude's discretion):** 2 tasks agrupadas por instância: Task 1 = habilidades corporais (Alcance, Destreza, Golpe Duplo + qualquer extra que o audit encontrar em corpo); Task 2 = habilidades mentais + espirituais (Grimório, Modelagem, Fúria, Toque Mortífero + qualquer extra em mente/espirito).

### TypeScript validation
- **D-06:** Rodar `npx tsc --noEmit` após cada task para garantir TS válido antes de continuar.

### Ferramenta de edição
- **D-07:** Usar Edit tool (old_string → new_string) por habilidade — nunca Write. Minimiza risco de corrupção acidental.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — FIDE-12 (Destreza), FIDE-13 (Golpe Duplo), FIDE-14 (Alcance), FIDE-15 (Fúria), FIDE-16 (Grimório), FIDE-17 (Modelagem), FIDE-18 (Toque Mortífero)

### Source of Truth
- `data/habilidades.ts` — arquivo a editar; contém 13 habilidades em 3 instâncias (corpo: 8, mente: 5, espirito: 5)

### Phase Pattern (modelo a seguir)
- `.planning/phases/06-proficiencias-mente-espirito/06-RESEARCH.md` — estrutura de research com "Exact Replacement Values" por sub-seção; seguir o mesmo formato
- `.planning/phases/06-proficiencias-mente-espirito/06-01-PLAN.md` — estrutura do plano: task por grupo, acceptance_criteria por campo, verificações grep

### Project Context
- `.planning/PROJECT.md` — decisões de arquitetura e convenções
- `.planning/ROADMAP.md` — Phase 7 goal e success criteria

### Display Integration
- `components/rpg/HabilidadesSection.tsx` — importa `habilidades.ts` diretamente; renderiza `descricao` e `teste` dinamicamente na aba Ficha — correções aparecem automaticamente sem tocar o componente
- `app/(tabs)/regras.tsx` §5 — hardcode estático (NÃO corrigir nesta fase; Phase 8 cuida disso)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/habilidades.ts` — interface `Habilidade` = `{ nome, instancia, prerequisito, custo, descricao, teste, tipo }`. Edição é campo a campo como nas fases anteriores.

### Established Patterns
- **Edit tool por habilidade**: editar campo a campo usando old_string → new_string
- **TypeScript strict**: `npx tsc --noEmit` é gate obrigatório após cada task
- **Nunca reescrever o arquivo inteiro**: usar Edit, não Write
- Grupos de habilidades por instância: `corpo` | `mente` | `espirito`

### Integration Points
- `HabilidadesSection.tsx` — consumer direto de `habilidades.ts`; renderiza `descricao` + `teste` na tela de Ficha do personagem. Nenhuma mudança necessária no componente.
- `app/(tabs)/index.tsx` — monta `HabilidadesSection` com `selected` e `onChange` do CharacterContext
- `regras.tsx` §5 — NÃO é consumer de `habilidades.ts`; é hardcode independente

### Current State vs Correct (known issues)
- `Destreza.descricao`: usa "dW I–V" — deve listar 1d4, 1d6, 1d8, 1d10, 1d12; falta mencionar bastões
- `Golpe Duplo.descricao`: falta "ou até dois alvos adjacentes" e "não aplicável a armas de duas mãos"
- `Alcance.descricao`: falta efeito de sucesso "impede avanço — move apenas metade do deslocamento"
- `Fúria.descricao`: falta triggers: "ao sofrer dano, falhar em teste de combate ou presenciar aliado cair"
- `Grimório.descricao`: diz "através de grimórios ou observação" — livro diz o OPOSTO: SEM precisar de livros
- `Modelagem.descricao`: falta mecânica de reativação na mesma cena ao morrer
- `Toque Mortífero.descricao`: falta trigger específico: "quando for alvo do ataque de uma criatura"

</code_context>

<specifics>
## Specific Ideas

- O researcher deve derivar os textos exatos a partir dos hints em FIDE-12–18 e do padrão de RESEARCH.md das fases anteriores. O usuário não fornecerá os textos — o researcher pesquisa/infere do docx.
- Para cada habilidade com discrepância adicional encontrada no audit completo (além das 7 listadas), incluir como edição na task correspondente (por instância).
- Task 1 cobre corpo, Task 2 cobre mente + espirito — planner define o número exato de edições após o researcher auditar tudo.

</specifics>

<deferred>
## Deferred Ideas

- **Phase 8 scope expandido**: Usuário confirmou que Phase 8 corrige a aba Regras INTEIRA (`regras.tsx` completo + GAME_RULES.md), não apenas §5 Habilidades. O ROADMAP.md de Phase 8 deve refletir esse escopo expandido.

</deferred>

---

*Phase: 07-habilidades*
*Context gathered: 2026-05-16*
