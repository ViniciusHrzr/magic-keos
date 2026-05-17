# Roadmap: Magic Kéos App

## Milestones

- ✅ **v1.0 MVP** — Phases 1–4 (shipped 2026-05-15)
- ✅ **v1.1 Fidelidade ao Livro de Regras** — Phases 5–9 (shipped 2026-05-16)
- ✅ **v1.2 Tela de Regras — Visual & Estrutura** — Phases 10–11 (shipped 2026-05-17)
- 🔄 **v1.3 Aba Mochila — Equipamentos & Craft** — Phases 12–14 (active)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–4) — SHIPPED 2026-05-15</summary>

- [x] Phase 1: Estabilidade de Fundação (3/3 plans) — completed 2026-05-15
- [x] Phase 2: Qualidade da Ficha (3/3 plans) — completed 2026-05-15
- [x] Phase 3: Qualidade do Grimório (3/3 plans) — completed 2026-05-15
- [x] Phase 4: Ferramentas de Mesa (2/2 plans) — completed 2026-05-15

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### ✅ v1.1 Fidelidade ao Livro de Regras (Complete — 2026-05-16)

**Milestone Goal:** Garantir que todo conteúdo de regras do app seja 100% fiel ao livro oficial "Magic no Universo Kéos v.0.4.docx".

- [x] **Phase 5: Proficiências CORPO** — Corrigir descrições/testes das perícias de Artes Marciais, Atletismo, Esgrima, Furtividade e Pontaria *(completed 2026-05-16)*
- [x] **Phase 6: Proficiências MENTE/ESPÍRITO** — Corrigir descrições das perícias de Alquimia, Criatividade, Investigação, Feiticeiro de Mecânica, Sobrevivência e Espirituais (completed 2026-05-16)
- [x] **Phase 7: Habilidades** — Corrigir descrições e mecânicas das habilidades corporais/espirituais em habilidades.ts *(completed 2026-05-16)*
- [x] **Phase 8: Documentação** — Sincronizar GAME_RULES.md com todas as correções aplicadas *(completed 2026-05-16)*

### ✅ v1.2 Tela de Regras — Visual & Estrutura (Complete — 2026-05-17)

**Milestone Goal:** Redesenhar `regras.tsx` com hierarquia visual, tabelas RPG, tipografia com escaneabilidade e seções colapsáveis com feedback — dark/gold/premium coerente com a ficha existente.

- [x] **Phase 10: Estrutura & Tipografia** — Cards, separação visual e sistema tipográfico (completed 2026-05-17)
- [x] **Phase 11: Tabelas & Interatividade** — Estilo RPG nas tabelas e animações de colapsável *(completed 2026-05-17)*

### v1.3 Aba Mochila — Equipamentos & Craft (Active)

**Milestone Goal:** Criar aba dedicada com slots de equipamento interativos (picker do livro + nome custom), grade de inventário nomeada, e sistema de craft com melhorias tabeladas (até 3 por item) e suporte a artefatos com efeito ativável.

- [x] **Phase 12: Schema & Migration** — Definir EquipItem, setar CharacterContext, migrate() automático
- [ ] **Phase 13: Aba Mochila & Slots de Equipamento** — Nova aba, remoção de magia.tsx, slots com picker e nome custom
- [ ] **Phase 14: Inventário, Craft & Artefatos** — Grade 20 slots, craft com 3 melhorias, toggle artefato

## Phase Details

### Phase 5: Proficiências CORPO
**Goal**: Todas as proficiências de atributos CORPO estão com descrições e testes fiéis ao docx oficial
**Depends on**: Phase 4
**Requirements**: FIDE-01, FIDE-02, FIDE-03, FIDE-04, FIDE-05
**Success Criteria** (what must be TRUE):
  1. Proficiências de Artes Marciais (Derrubar, Desarmar, Desviar, Fintar, Imobilizar, Aparar) mostram exatamente as descrições e testes do docx
  2. Proficiências de Atletismo (Prontidão, Fôlego, Investida, Disparar) mostram descrições corretas sem texto inventado nem incompleto
  3. Proficiências de Esgrima (Armas Leves, Uma Mão, Duas Mãos, Especialização, Mestria) mostram atributos corretos e "+2/+5 dano" onde o docx diz dano
  4. Proficiências de Furtividade (Ataque Furtivo, Ataque Letal, Ataque Silencioso) mostram mecânicas corretas: bônus no teste de ataque e dano adicional = bônus em Furtividade
  5. Proficiências de Pontaria (Especialização, Mestria, Mirar) mostram "+2/+5 dano" e incluem "dano adicional igual valor em Pontaria"
**Plans**: 1 plan

Plans:
- [x] 05-01-PLAN.md — Corrigir todas as 22 proficiências de CORPO em data/proficiencias.ts (Artes Marciais, Atletismo, Esgrima, Furtividade, Pontaria)

### Phase 6: Proficiências MENTE/ESPÍRITO
**Goal**: Todas as proficiências de atributos MENTE e ESPÍRITO estão com descrições fiéis ao docx oficial
**Depends on**: Phase 5
**Requirements**: FIDE-06, FIDE-07, FIDE-08, FIDE-09, FIDE-10, FIDE-11
**Success Criteria** (what must be TRUE):
  1. Poções de Alquimia descreve usar/reconhecer qualquer poção (não criar durante descanso)
  2. Proficiências de Criatividade (Recapitular, Reciclar, Replicar) mostram descrições idênticas ao docx
  3. Proficiências de Investigação têm nomes corretos (Selo de Encantamento, Selo de Invocação) e Leitura descreve ler/escrever
  4. Feiticeiro de Mecânica inclui vestimentas mágicas na descrição
  5. Proficiências de Sobrevivência (5 sub-proficiências) descrevem corretamente que cada uma muda o teste de uma ação de descanso específica
  6. Proficiências espirituais (Provocar, Coordenar, Inspirar, Amedrontar, Distrair) mostram testes, alvos e mecânicas corretos do docx
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md — Corrigir todas as 29 proficiências de MENTE/ESPÍRITO em data/proficiencias.ts (Alquimia, Criatividade, Investigação, Mecânica, Sobrevivência, Espirituais)

### Phase 7: Habilidades
**Goal**: Todas as habilidades em habilidades.ts estão com descrições e mecânicas fiéis ao docx oficial
**Depends on**: Phase 6
**Requirements**: FIDE-12, FIDE-13, FIDE-14, FIDE-15, FIDE-16, FIDE-17, FIDE-18
**Success Criteria** (what must be TRUE):
  1. Destreza lista os dados reais por nível (1d4, 1d6, 1d8, 1d10, 1d12) e menciona bastões
  2. Golpe Duplo inclui "ou até dois alvos adjacentes" e "não aplicável a armas de duas mãos"
  3. Alcance inclui o efeito de sucesso: "impede avanço — move apenas metade do deslocamento"
  4. Fúria inclui os três triggers corretos: ao sofrer dano, falhar em teste de combate ou presenciar aliado cair
  5. Grimório descreve que feitiços são aprendidos SEM precisar de livros (não "através de grimórios ou observação")
  6. Modelagem inclui a mecânica de reativação na mesma cena ao morrer
  7. Toque Mortífero especifica o trigger correto: "quando for alvo do ataque de uma criatura"
**Plans**: 1 plan

Plans:
- [x] 07-01-PLAN.md — Corrigir 7 habilidades em data/habilidades.ts (corpo: Alcance, Destreza, Golpe Duplo; mente+espirito: Grimório, Modelagem, Fúria, Toque Mortífero)

### Phase 8: Documentação
**Goal**: GAME_RULES.md reflete com precisão todas as correções aplicadas nas Phases 5–7
**Depends on**: Phase 7
**Requirements**: FIDE-19
**Success Criteria** (what must be TRUE):
  1. Seção §5 (Perícias/Proficiências) do GAME_RULES.md está sincronizada com proficiencias.ts corrigido
  2. Seção §7 (Habilidades) do GAME_RULES.md está sincronizada com habilidades.ts corrigido
  3. Não existem discrepâncias entre o que o app exibe, o GAME_RULES.md descreve e o docx oficial define
**Plans**: 1 plan

Plans:
- [x] 08-01-PLAN.md — Sincronizar GAME_RULES.md §5 (Investigação names) e §7 (7 habilidades table cells) com correções das Phases 5–7

### Phase 9: Fidelidade Estrutural
**Goal**: Todo conteúdo de regras no app é 100% fiel ao docx e drift futuro é estruturalmente impossível
**Depends on**: Phase 8
**Requirements**: FIDE-20, FIDE-21, FIDE-22, FIDE-23
**Success Criteria** (what must be TRUE):
  1. Auditoria completa docx vs regras.tsx (§1-3, §6-20) e GAME_RULES.md (todas seções) — zero discrepâncias
  2. regras.tsx é 100% dinâmico: todo conteúdo importado de data/regras/ TypeScript files
  3. GAME_RULES.md gerado por script a partir de data/regras/ — nunca desatualiza manualmente
  4. Pre-commit hook bloqueia commits com drift entre data/regras/ e docx
**Plans**: 3 plans

Plans:
- [x] 09-01-PLAN.md — Auditoria completa docx vs todos hardcoded sections (regras.tsx §1-3,§6-20 + GAME_RULES.md todas seções) → corrigir discrepâncias
- [x] 09-02-PLAN.md — Migrar todo conteúdo hardcoded para data/regras/ TS files + regras.tsx 100% dinâmico
- [x] 09-03-PLAN.md — Scripts audit-docx.py + generate-game-rules.py + pre-commit hook + regenerar GAME_RULES.md
- [x] 09-04 — proficiencias.ts + habilidades.ts texto exato docx; meta.ts (SecaoMeta §1-20); regras.tsx §1-20 zero hardcode (secoes.*); PlanewalkerDings em notacaoMana

### Phase 10: Estrutura & Tipografia

**Goal**: A tela de Regras tem hierarquia visual clara — cards por seção, cabeçalhos distintos e tipografia com escaneabilidade RPG
**Depends on**: Phase 9
**Requirements**: REG-01, REG-02, REG-06, REG-07, REG-08, REG-09
**Success Criteria** (what must be TRUE):
  1. Cada seção da tela de Regras está envolvida em um card/bloco com background e borda distintos do scroll background
  2. O cabeçalho de cada seção (número + título) é visivelmente separado do corpo por divisor ou diferença de estilo
  3. Títulos de seção: ≥ 16px, bold, RPG.gold — legíveis sem expandir a seção
  4. Sub-seções usam fonte 12–14, semibold, text/goldLight — hierarquia clara em relação ao corpo
  5. Corpo de texto tem lineHeight ≥ 18 — confortável para leitura em sessão longa
  6. Labels meta (PRÉ-REQ, CUSTO, MÁGICA etc.) estão uppercase, ≤ 10px, gold, letterSpacing
**Plans**: 1 plan

Plans:
- [x] 10-01-PLAN.md — Redesenhar estrutura visual de regras.tsx: cards por seção, separação de cabeçalho, sistema tipográfico (tamanhos, pesos, cores, lineHeight)

### Phase 11: Tabelas & Interatividade

**Goal**: Tabelas têm estilo RPG consistente e seções colapsáveis comunicam seu estado com animação e feedback
**Depends on**: Phase 10
**Requirements**: REG-03, REG-04, REG-05, REG-10, REG-11, REG-12
**Success Criteria** (what must be TRUE):
  1. Toda tabela tem header row com fundo distinto (goldDim/surfaceAlt) e texto bold
  2. Linhas de dados têm borda inferior clara ou fundo alternado — não parecem texto plano
  3. Colunas de tabela são alinhadas de forma consistente em todas as 15+ seções de regras
  4. Chevron anima suavemente (LayoutAnimation ou Animated) ao expandir/colapsar seção
  5. Cabeçalho colapsável tem aparência visivelmente diferente quando aberto vs. fechado (cor, borda, opacidade)
  6. Toque no cabeçalho aciona haptic leve via Expo Haptics
**Plans**: 1 plan

Plans:
- [x] 11-01-PLAN.md — Refatorar TH/R2/R3 com estilo RPG; adicionar animação e haptic no Section collapsível

### Phase 12: Schema & Migration

**Goal**: O schema de Character suporta o modelo completo de equipamentos e inventário, e fichas existentes migram automaticamente sem perda de dados
**Depends on**: Phase 11
**Requirements**: SCHEMA-01
**Success Criteria** (what must be TRUE):
  1. Interface EquipItem em types/character.ts define `nome`, `tipo` (basico | artefato), `melhorias`, `efeito?`, `durabilidade?` e aceita TypeScript strict sem erros
  2. CharacterContext expõe setters tipados para equipamentos (por slot) e inventarioSlots (por índice)
  3. Ficha existente com `equipamentos.arma = "Espada"` migra automaticamente para `equipamentos.arma = { nome: "Espada", tipo: "basico", melhorias: [] }` sem perder o nome
  4. Ficha existente com `inventario = "Corda, Tocha"` migra para `inventarioSlots[0] = "Corda, Tocha"` e demais slots ficam strings vazias
  5. App cold-starts sem erros de TypeScript e sem crash em ficha com schema legado
**Plans**: 1 plan
**UI hint**: no

Plans:
- [x] 12-01-PLAN.md — EquipItem interface + Character schema widening + migrate() guards + context setters + remove broken call sites in magia.tsx

### Phase 13: Aba Mochila & Slots de Equipamento

**Goal**: Usuário acessa uma aba dedicada "Mochila" com 5 slots de equipamento interativos e a aba Magia não exibe mais Inventário/Equipamentos
**Depends on**: Phase 12
**Requirements**: MOCH-01, MOCH-02, EQP-01, EQP-02, EQP-03
**Success Criteria** (what must be TRUE):
  1. Ícone "Mochila" aparece na tab bar e navega para a nova tela sem erros
  2. A aba Magia não exibe mais as seções de Inventário e Equipamentos
  3. Usuário pode tocar em qualquer slot (Arma, Escudo, Vestimenta, Acessório 1, Acessório 2) e escolher um item da lista do livro via picker/modal
  4. Usuário pode inserir ou editar um nome personalizado em qualquer slot (para itens únicos/artefatos nomeados)
  5. O card do slot exibe em estado colapsado o nome do item selecionado e a quantidade de melhorias aplicadas
**Plans**: 1 plan
**UI hint**: yes

Plans:
- [x] 13-01-PLAN.md — Registrar tab Mochila, criar tela com 5 slots colapsáveis, picker modal e nome custom

### Phase 14: Inventário, Craft & Artefatos

**Goal**: Usuário gerencia inventário em grade, aplica melhorias do livro em equipamentos e pode marcar itens como artefatos com efeito ativável
**Depends on**: Phase 13
**Requirements**: INV-01, INV-02, CRAFT-01, CRAFT-02, CRAFT-03, ARTE-01
**Success Criteria** (what must be TRUE):
  1. Grade de 20 slots em 2 colunas exibe na aba Mochila e cada slot aceita texto livre como nome do item
  2. Usuário pode apagar o conteúdo de qualquer slot de inventário individualmente sem afetar os demais
  3. Usuário pode adicionar até 3 melhorias a qualquer slot de equipamento, com a lista filtrada pelo tipo do slot (ex.: slot Arma mostra apenas opções de Arma)
  4. Cada melhoria exibida corresponde exatamente ao livro por categoria e cor (Acurácia+1 branco para Arma, etc.)
  5. Usuário pode remover qualquer melhoria individualmente sem afetar as demais
  6. Usuário pode toglar um slot entre "Básico" e "Artefato", e no modo Artefato dois campos extras aparecem: efeito ativável (texto livre) e durabilidade (inteiro)
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Estabilidade de Fundação | v1.0 | 3/3 | Complete | 2026-05-15 |
| 2. Qualidade da Ficha | v1.0 | 3/3 | Complete | 2026-05-15 |
| 3. Qualidade do Grimório | v1.0 | 3/3 | Complete | 2026-05-15 |
| 4. Ferramentas de Mesa | v1.0 | 2/2 | Complete | 2026-05-15 |
| 5. Proficiências CORPO | v1.1 | 1/1 | Complete | 2026-05-16 |
| 6. Proficiências MENTE/ESPÍRITO | v1.1 | 1/1 | Complete | 2026-05-16 |
| 7. Habilidades | v1.1 | 1/1 | Complete | 2026-05-16 |
| 8. Documentação | v1.1 | 1/1 | Complete | 2026-05-16 |
| 9. Fidelidade Estrutural | v1.1 | 4/4 | Complete | 2026-05-16 |
| 10. Estrutura & Tipografia | v1.2 | 1/1 | Complete | 2026-05-17 |
| 11. Tabelas & Interatividade | v1.2 | 1/1 | Complete | 2026-05-17 |
| 12. Schema & Migration | v1.3 | 1/1 | Complete | 2026-05-17 |
| 13. Aba Mochila & Slots | v1.3 | 1/1 | Complete | 2026-05-17 |
| 14. Inventário, Craft & Artefatos | v1.3 | 0/? | Not started | - |
