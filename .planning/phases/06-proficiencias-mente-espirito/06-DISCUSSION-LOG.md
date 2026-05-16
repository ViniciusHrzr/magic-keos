# Phase 6: Proficiências MENTE/ESPÍRITO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-16
**Phase:** 06-proficiencias-mente-espirito
**Areas discussed:** Investigação nome changes, Alquimia scope, Fonte dos valores, Migração de dados

---

## Investigação — nome field changes

| Option | Description | Selected |
|--------|-------------|----------|
| Mudar o nome também | nome: 'Encantamento' → 'Selo de Encantamento'; idem para Invocação. Afeta chips na UI. | ✓ |
| Só a descricao | O nome na UI fica igual; apenas o texto explicativo muda. | |

**User's choice:** Mudar o nome também
**Notes:** Implica mudança no campo `nome` da struct `Proficiencia`, afetando os labels dos chips em ProficienciasSection e as keys de persistência (`investigacao:Encantamento` → `investigacao:Selo de Encantamento`).

---

## Migração de dados — renomeação de proficiências

| Option | Description | Selected |
|--------|-------------|----------|
| Adicionar migração | migrate() mapeia os nomes antigos para os novos. Zero perda de dados. | |
| Aceitar a perda | Personagens perdem a seleção. Não usamos essas proficiências ainda — impacto zero na prática. | ✓ |

**User's choice:** Aceitar a perda
**Notes:** Os nomes renomeados (Encantamento, Invocação) não estão em uso ativo pelos jogadores. Sem migration necessária.

---

## Alquimia — scope completo

| Option | Description | Selected |
|--------|-------------|----------|
| Só Poções | Herbologia/Mineralogia/Zoologia estão OK. Só Poções muda. | |
| Todas as 4 | Herbologia, Mineralogia, Zoologia também têm texto errado vs docx. | ✓ |

**User's choice:** Todas as 4
**Notes:** FIDE-06 mencionava só Poções no requirement, mas o usuário confirma que as outras 3 também têm texto incorreto.

---

## Fonte dos valores de correção

| Option | Description | Selected |
|--------|-------------|----------|
| Tenho os textos prontos | Usuário fornece valores exatos agora. A RESEARCH.md captura direto. | |
| Researcher investiga | O researcher trabalha a partir dos requirements + padrões de Phase 5. | ✓ |

**User's choice:** Researcher investiga
**Notes:** Diferente da Phase 5 (onde o usuário havia fornecido todos os valores exatos no RESEARCH.md), a Phase 6 terá o researcher derivando os valores corretos a partir das pistas em REQUIREMENTS.md (FIDE-06 a FIDE-11) e dos padrões estabelecidos.

---

## Claude's Discretion

- Agrupamento de tasks no plano (ex: mente em Task 1, espirito em Task 2) — sugerido no CONTEXT.md mas planner decide o melhor agrupamento
- Granularidade de edits por proficiência vs. por block

## Deferred Ideas

None — discussion stayed within phase scope.
