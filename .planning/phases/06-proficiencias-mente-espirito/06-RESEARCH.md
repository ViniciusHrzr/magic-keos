# Phase 6: Proficiências MENTE/ESPÍRITO — Research

**Researched:** 2026-05-16
**Domain:** Data content correction — `data/proficiencias.ts`, blocos `mente` (linhas 88–148) e `espirito` (linhas 149–190)
**Confidence:** HIGH — all findings extracted directly from the official docx v0.4

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Mudar o campo `nome` de `'Encantamento'` → `'Selo de Encantamento'` e de `'Invocação'` → `'Selo de Invocação'`. Isso afeta os labels dos chips na UI.
- **D-02:** Aceitar data loss — personagens que tinham essas proficiências selecionadas perdem a seleção silenciosamente. Nenhuma migration em `migrate()` necessária.
- **D-03:** Todas as 4 proficiências de Alquimia precisam correção: `Herbologia`, `Mineralogia`, `Zoologia` e `Poções`. Não apenas Poções.
- **D-04:** O researcher deve derivar os valores exatos a partir das pistas nos REQUIREMENTS.md (FIDE-06 a FIDE-11) e do padrão estabelecido na Phase 5.
- **D-05:** Mesmo padrão da Phase 5: NUNCA alterar `label`, `atributos`, `descricao` de `PericiaData` (nível da perícia, não da proficiência), nem tocar o bloco `corpo`.
- **D-06:** O campo `requisito` não deve ser alterado em nenhuma proficiência.
- **D-07:** FIDE-11 implica mudanças substanciais de mecânica para as 5 proficiências espirituais.
- **D-08:** Rodar `npx tsc --noEmit` após cada task para garantir TS válido antes de continuar.

### Claude's Discretion

None — all decisions are locked.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FIDE-06 | Corrigir Poções de Alquimia (e também Herbologia, Mineralogia, Zoologia — D-03) | Docx parágrafo [881]–[884]: textos exatos extraídos |
| FIDE-07 | Corrigir Criatividade: Recapitular, Reciclar, Replicar (descrições completamente erradas) | Docx parágrafos [891], [892], [895]: textos exatos extraídos |
| FIDE-08 | Corrigir Investigação: nomes (Selo de Encantamento, Selo de Invocação) e Leitura | Docx parágrafos [904], [905], [906]: textos exatos extraídos |
| FIDE-09 | Corrigir Feiticeiro de Mecânica (falta vestimentas mágicas) | Docx parágrafo [916]: texto exato extraído |
| FIDE-10 | Corrigir Sobrevivência: 5 sub-proficiências descrevem mudança de teste de descanso | Docx parágrafos [926]–[930]: textos exatos extraídos |
| FIDE-11 | Corrigir proficiências espirituais: Provocar, Coordenar, Inspirar, Amedrontar, Distrair | Docx parágrafos [939], [948], [957], [966], [975]: textos exatos extraídos |
</phase_requirements>

---

## Summary

Phase 6 corrects the `descricao`, `teste`, and in two cases the `nome` fields of proficiências in the `mente` and `espirito` blocks of `data/proficiencias.ts`. The source of truth is `magic keos/Magic no Universo Kéos v.0.4.docx`, extracted verbatim via Python/zipfile + ElementTree (same method as Phase 5).

The `mente` block contains 5 perícias: Alquimia (4 proficiências), Criatividade (6 proficiências), Investigação (4 proficiências), Mecânica (4 proficiências), Sobrevivência (6 proficiências). The `espirito` block contains 5 perícias each with 1 proficiência: Comunhão (Provocar), Diplomacia (Coordenar), Expressão (Inspirar), Intimidação (Amedrontar), Lábia (Distrair).

The corrections are **purely textual data edits** inside a single TypeScript file. No schema changes, no new proficiências added or removed, no UI changes beyond the chip label change for the two renamed Investigação proficiências. The `Proficiencia` interface (`nome`, `descricao`, `teste`, `requisito?`) requires no type changes.

**Primary recommendation:** Edit `data/proficiencias.ts` — only the `mente` block (lines 88–148) and `espirito` block (lines 149–190). Use the exact replacement values in the "Exact Replacement Values" section below. Run `npx tsc --noEmit` after each task.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Rule text content | Data layer (`proficiencias.ts`) | — | Static exported constant, no runtime logic |
| Rendering proficiências | Frontend (React component) | — | Reads from data file; no changes needed |
| Chip key / label change | Data layer (`proficiencias.ts`) | Frontend (ProficienciasSection) | `nome` field → chip label and AsyncStorage key; UI reads it dynamically |
| Validation that text is correct | Manual (docx comparison) | — | No automated test infra for text content |

---

## Source Extraction — Docx Paragraphs (VERIFIED)

All paragraphs extracted from `magic keos/Magic no Universo Kéos v.0.4.docx` via Python zipfile + ElementTree. Paragraph numbers reference the in-memory list from `word/document.xml` (same methodology as Phase 5).

### Alquimia (parágrafo 880–884)

**[880]** Alquimia é a ciência mágica de Kéos... A partir do nível 2 e a cada três níveis em Alquimia (2, 5, 8), pode se tornar proficiente em um tipo de conhecimento para produzir itens a partir de misturas dos elementos naturais, como remédios, bombas e soros mágicos:

- **[881] Herbologia:** utilização de recursos vegetais na criação de remédios e tônicos.
- **[882] Mineralogia:** utilização de recursos minerais na criação de bombas e afiadores (metais que atribuem propriedades elementais a equipamentos).
- **[883] Zoologia:** utilização de recursos animais na criação de soros (concedem mutações a quem os ingere) e ossadas (catalizadores de mágicas).
- **[884] Proficiência em Poções:** a partir do primeiro nível em Alquimia, você pode usar e reconhecer poções de qualquer campo (herbologia, mineralogia e zoologia).

### Criatividade (parágrafo 889–896)

**[890]** Esta perícia é usada quando os jogadores têm ideias mirabolantes... magos podem inventar mágicas... A cada três níveis em Criatividade (2, 5, 8), o personagem pode se tornar proficiente em um talento metamágico para alterar suas mágicas conforme a necessidade:

- **[891] Recapitular:** pode acrescentar parcialmente os efeitos de uma mágica que esteja na memória na próxima mágica que lançar. Só é possível recapitular os efeitos de Feitiços, mas é possível aplicá-los em Encantamentos e Criaturas. O custo de mana adicional é o custo de mana colorido da mágica a ser recapitulada.
- **[892] Reciclar:** aprende a reciclar suas mágicas, pois algumas são úteis apenas em situações muito específicas: você pode alterar algum descritor da mágica, como o tipo de dano (desde que coerente com sua cor), o atributo-base ou o alvo dela. Aplica-se a Feitiços e a Encantamentos. O custo de mana adicional é de {1} mana incolor para cada alteração.
- **[893] Reforçar:** potencializa um dos efeitos (dano, área, duração etc.) de uma mágica por um custo de mana maior. Aplica-se a Feitiços, Encantamentos e Criaturas (nestas, você pode reforçar um de seus atributos ou uma habilidade). O custo de mana adicional é pago em mana incolor e varia de metade do valor (+50% do efeito) ao valor completo da mágica (+75% do efeito).
- **[894] Repartir:** compartilha os efeitos de uma mágica com mais alvos, mas ela perde em potência (50% a menos do efeito). Aplica-se em Feitiços e Encantamentos (você só gasta 1 de Foco para manter um encantamento repartido). O custo de mana adicional é {1} de mana incolor para cada alvo extra.
- **[895] Replicar:** mágicas demoram para ser conjuradas, mas se pagar um custo adicional de mana no momento de conjuração, o conjurador consegue fazer uma cópia dela, podendo lançá-la sobre o mesmo alvo ou um alvo diferente. Aplica-se somente a Feitiços. O custo de mana adicional é o mesmo valor da mágica conjurada mais {1} mana incolor para cada grau.
- **[896] Proficiência em Solução:** a partir do primeiro nível em Criatividade, você pode solucionar problemas de forma criativa; por exemplo, pode fazer um teste para fazer um uso criativo de uma mágica, algo que esteja dentro do domínio dela mas não esteja explícito na descrição.

### Investigação (parágrafo 901–906)

**[902]** Investigar significa dedicar atenção a uma tarefa... Como em um mundo medieval a leitura e a escrita não são habilidades comuns para a maioria das pessoas, é necessário ter pelo menos um nível nesta perícia para ler e escrever... A cada três níveis a partir do segundo (2, 5, 8) de Investigação, o personagem torna-se proficiente na produção de um tipo de escrita mágica:

- **[903] Selo de Feitiço:** armazena um feitiço com antecedência (durante cenas de descanso) em um selo mágico que pode ser consumido para lançar a mágica armazenada. Você pode usar selos como uma reação.
- **[904] Selo de Encantamento:** o mesmo que o anterior, mas aprende a armazenar um encantamento em vez disso.
- **[905] Selo de Invocação:** o mesmo que os anteriores, mas aprende a armazenar uma invocação em vez disso.
- **[906] Proficiência em Leitura:** a partir do primeiro nível em Investigação, você é capaz de ler e escrever; entre outras coisas, pode aprender novas mágicas a partir da leitura de livros ou pergaminhos.

### Mecânica (parágrafo 913–918)

**[914]** Em Kéos, todo tipo de item mágico é chamado de artefato... No nível 1, pode utilizar e reparar artefatos variados. A partir do segundo nível e a cada três níveis (2, 5, 8) em Mecânica, adquire proficiência na manufatura de artefatos de um tipo:

- **[915] Artesão:** é capaz de produzir e melhorar acessórios mágicos variados.
- **[916] Feiticeiro:** é capaz de produzir e melhorar varinhas, cajados e vestimentas mágicas.
- **[917] Ferreiro:** é capaz de produzir e melhorar armas, armaduras e equipamentos mágicos.
- **[918] Proficiência em Artefatos:** a partir do primeiro nível em Mecânica, você pode usar artefatos (ativá-los) de qualquer profissão (artesão, feiticeiro e ferreiro) e repará-los em cenas de descanso.

### Sobrevivência (parágrafo 924–931)

**[925]** Esta área diz respeito aos conhecimentos relacionados ao meio ambiente... A partir do segundo nível e a cada três níveis (2, 5, 8) em Sobrevivência, torna-se especialista em um tipo de descanso, podendo somar seu bônus dessa perícia no teste realizado.

- **[926] Acampamento:** testes de Repousar passam a ser Vigor [Atletismo + Sobrevivência].
- **[927] Harmonização:** testes de Canalizar passam a ser Vontade [Comunhão + Sobrevivência].
- **[928] Forrageamento:** testes de Coletar passam a ser Razão [Sobrevivência + Sobrevivência].
- **[929] Manufaturação:** testes de Produzir passam a ser Razão [Alquimia + Sobrevivência] e testes de Fabricar passam a ser Razão [Mecânica + Sobrevivência].
- **[930] Treinamento:** testes de Praticar passam a ser Concentração [Artes Marciais/Investigação/Lábia + Sobrevivência].
- **[931] Proficiência em Coleta:** a partir do primeiro nível em Sobrevivência, pode coletar recursos (herbais, minerais ou animais) em cenas de descanso.

### ESPÍRITO (parágrafo 939, 948, 957, 966, 975)

- **[939] Proficiência em Provocar (ação livre):** a partir do terceiro nível em Comunhão, durante um combate, pode provocar uma criatura ou uma pessoa para que ela se concentre apenas em você até o final do turno; teste de Presença [Comunhão] contra IP Espiritual.
- **[948] Proficiência em Coordenar (ação livre):** a partir do terceiro nível em Diplomacia, pode coordenar seu grupo para realizar uma ação em conjunto: dois ou mais personagens são mobilizados a agir de acordo com suas orientações e não gastam nenhuma ação para isso (é como se cada personagem recebesse uma ação extra, desde que tenham um objetivo em comum).
- **[957] Proficiência em Inspirar (ação livre):** a partir do terceiro nível em Expressão, durante um combate, pode motivar um aliado com suas palavras, então ele recebe bônus igual seu valor em Expressão em uma perícia de sua escolha até o final do turno.
- **[966] Proficiência em Amedrontar (ação livre):** a partir do terceiro nível em Intimidação, quando estiver em combate, pode afugentar criaturas e pessoas para que elas não o ataquem até o final do turno; teste de Presença [Intimidação] contra IP Espiritual.
- **[975] Proficiência em Distrair (ação livre):** a partir do terceiro nível em Lábia, durante um combate, pode ludibriar um inimigo com suas palavras, então ele recebe penalidade igual seu valor em Lábia em uma perícia de sua escolha até o final do turno; é preciso ter sucesso em um teste de Presença [Lábia] contra IP Espiritual do alvo.

---

## Current State Analysis

Reading `data/proficiencias.ts` lines 88–190 (MENTE and ESPÍRITO blocks as they exist now):

### Alquimia — Current State

| Proficiência | Field | Current Value | Status |
|---|---|---|---|
| **Herbologia** | descricao | "Permite coletar e processar ervas para criar poções de cura, imunidade, estimulantes, danosos ou adaptativos." | WRONG — "poções de cura, imunidade..." is invented; docx says "remédios e tônicos" |
| **Herbologia** | teste | "Passiva — desbloqueia categoria de produção" | CORRECT |
| **Mineralogia** | descricao | "Permite trabalhar com minerais para fabricar bombas de área e proteções elementais." | WRONG — "proteções elementais" is invented; docx says "bombas e afiadores (metais que atribuem propriedades elementais a equipamentos)" |
| **Mineralogia** | teste | "Passiva — desbloqueia categoria de produção" | CORRECT |
| **Zoologia** | descricao | "Permite extrair soros de criaturas (mutações temporárias) e catalizadores para potencializar mágicas." | WRONG — "mutações temporárias" is an interpretation; docx says "soros (concedem mutações a quem os ingere) e ossadas (catalizadores de mágicas)"; the word "catalizadores" is correct but the phrase structure differs |
| **Zoologia** | teste | "Passiva — desbloqueia categoria de produção" | CORRECT |
| **Poções** | nome | "Poções" | CORRECT |
| **Poções** | descricao | "Cria poções alquímicas durante o descanso. O resultado depende do teste." | WRONG — completely wrong; docx says this is about USING and RECOGNIZING potions from any field (not creating) |
| **Poções** | teste | "RAZ [Alquimia] no descanso — falha: reduzido · 10+: pretendido · 20+: potencializado" | WRONG — no test listed in docx; Poções is a passive proficiency |
| **Poções** | requisito | "Requer Alquimia lv.1" | CORRECT — D-06: do not change |

### Criatividade — Current State

The docx lists 5 sub-proficiências (Recapitular, Reciclar, Reforçar, Repartir, Replicar) and 1 proficiency (Solução). The current `proficiencias.ts` has 6 entries. Mapping:

| Proficiência | Field | Current Value | Status |
|---|---|---|---|
| **Recapitular** | descricao | "Replica mágica já conjurada na mesma cena pagando apenas mana, sem conjurar novamente." | WRONG — says "replica já conjurada na mesma cena"; docx says "acrescentar parcialmente os efeitos de uma mágica que esteja na memória na próxima mágica que lançar" (different mechanic entirely — it's about blending effects, not instant-casting) |
| **Recapitular** | teste | "Passiva — disponível ao lançar mágica da mesma cena" | WRONG — should describe cost (mana colorido), not timing condition |
| **Reciclar** | descricao | "Altera alvo, área ou duração de mágica já ativa, pagando mana adicional." | WRONG — "já ativa" is invented; docx says "alterar algum descritor da mágica, como o tipo de dano..., o atributo-base ou o alvo"; not about active spells, about modifying any feitiço/encantamento |
| **Reciclar** | teste | "Passiva — aplicado ao modificar mágica ativa" | WRONG — "ativa" is wrong; should describe cost ({1} mana incolor por alteração) |
| **Reforçar** | descricao | "Potencializa dano, alcance ou duração de uma mágica ao custo de mana adicional." | INCOMPLETE — current is partially correct but omits Criaturas applicability, omits mana cost scale (+50% ou +75%) |
| **Reforçar** | teste | "Passiva — multiplicador de efeito com mana extra" | INCOMPLETE |
| **Repartir** | descricao | "Divide o efeito de uma única mágica entre múltiplos alvos dentro do alcance." | INCOMPLETE — omits "50% a menos do efeito" and the Encantamento Foco note |
| **Repartir** | teste | "Passiva — efeito dividido entre os alvos escolhidos" | INCOMPLETE |
| **Replicar** | descricao | "Reproduz funcionalmente um objeto simples ou efeito visual observado recentemente." | WRONG — completely different mechanic; docx says "fazer uma cópia" of a spell at conjuration time, applies only to Feitiços |
| **Replicar** | teste | "RAZ [Criatividade] vs. complexidade do objeto" | WRONG — no RAZ test; it's about paying additional mana at conjuration |
| **Solução** | descricao | "Improvisa respostas eficazes a problemas inéditos sem recursos ou ferramentas ideais." | WRONG — docx says this is a proficiency to make creative use of a mágica (within its domain), not general improvisation |
| **Solução** | teste | "RAZ [Criatividade] vs. dificuldade do problema" | PARTIALLY OK — test is RAZ [Criatividade], but description of what it's for is wrong |
| **Solução** | requisito | "Requer Criatividade lv.1" | CORRECT — D-06: do not change |

### Investigação — Current State

| Proficiência | Field | Current Value | Status |
|---|---|---|---|
| **Selo de Feitiço** | nome | "Selo de Feitiço" | CORRECT |
| **Selo de Feitiço** | descricao | "Inscreve mágicas em superfícies para disparar automaticamente quando ativadas." | WRONG — "inscreve em superfícies" and "disparar automaticamente" are invented; docx says "armazena um feitiço com antecedência (durante cenas de descanso) em um selo mágico que pode ser consumido para lançar a mágica armazenada. Você pode usar selos como uma reação." |
| **Selo de Feitiço** | teste | "RAZ [Investigação] — dificuldade varia com o grau do feitiço inscrito" | WRONG — no test listed in docx; it's a passive capability; teste should be "Passiva — armazena feitiço em descanso; consome como reação" |
| **Encantamento** | nome | "Encantamento" | WRONG (D-01) → must change to "Selo de Encantamento" |
| **Encantamento** | descricao | "Estuda e absorve feitiços de fontes externas: grimórios, artefatos ou mágicas observadas." | WRONG — completely different mechanic; docx says "o mesmo que o anterior, mas aprende a armazenar um encantamento em vez disso" |
| **Encantamento** | teste | "RAZ [Investigação] oposto à complexidade da fonte" | WRONG — no test; passive like Selo de Feitiço |
| **Invocação** | nome | "Invocação" | WRONG (D-01) → must change to "Selo de Invocação" |
| **Invocação** | descricao | "Aprende técnicas de conjuração e controle de criaturas mágicas." | WRONG — completely different mechanic; docx says "o mesmo que os anteriores, mas aprende a armazenar uma invocação em vez disso" |
| **Invocação** | teste | "RAZ [Investigação] para aprender — CON [Investigação] para controlar" | WRONG — no test; passive |
| **Leitura** | descricao | "Decifra textos arcanos, runas, mapas antigos e manuscritos mágicos." | WRONG — "runas, mapas antigos" is invented; docx says "capaz de ler e escrever; entre outras coisas, pode aprender novas mágicas a partir da leitura de livros ou pergaminhos" |
| **Leitura** | teste | "RAZ [Investigação] — dificuldade varia com antiguidade e complexidade" | WRONG — no test; passive proficiency |
| **Leitura** | requisito | "Requer Investigação lv.1" | CORRECT — D-06: do not change |

### Mecânica — Current State

| Proficiência | Field | Current Value | Status |
|---|---|---|---|
| **Artesão** | descricao | "Fabrica objetos, acessórios e joias com durabilidade e até 3 melhorias elementais." | WRONG — "joias", "durabilidade", "até 3 melhorias elementais" are invented details; docx says "é capaz de produzir e melhorar acessórios mágicos variados" |
| **Artesão** | teste | "RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas" | WRONG — no test structure listed in docx paragraph [915]; the test scale is not in the proficiência description |
| **Feiticeiro** | descricao | "Cria condutores mágicos encantados: varinhas de 1 mão (1d4, 9m) e cajados de 2 mãos (1d6, 18m)." | WRONG — weapon stats are not in docx; docx says "é capaz de produzir e melhorar varinhas, cajados e vestimentas mágicas" — **missing "vestimentas mágicas"** (FIDE-09) |
| **Feiticeiro** | teste | "RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas" | WRONG — same issue as Artesão |
| **Ferreiro** | descricao | "Forja armas, escudos e armaduras com propriedades especiais e até 3 melhorias elementais." | WRONG — "propriedades especiais", "até 3 melhorias elementais" are invented; docx says "é capaz de produzir e melhorar armas, armaduras e equipamentos mágicos" |
| **Ferreiro** | teste | "RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas" | WRONG — same issue |
| **Artefatos** | descricao | "Ativa artefatos gastando 1 mana incolor e repara cargas perdidas durante o descanso." | WRONG — "1 mana incolor" and "cargas perdidas" are invented; docx says "pode usar artefatos (ativá-los) de qualquer profissão (artesão, feiticeiro e ferreiro) e repará-los em cenas de descanso" |
| **Artefatos** | teste | "Ativar: ação [1] + 1 mana incolor · Reparar (CON [Mecânica]): 10+:1 · 15+:2 · 20+:3" | WRONG — invented scale; no test listed in docx [918] |
| **Artefatos** | requisito | "Requer Mecânica lv.1" | CORRECT — D-06: do not change |

### Sobrevivência — Current State

| Proficiência | Field | Current Value | Status |
|---|---|---|---|
| **Acampamento** | descricao | "Prepara abrigos que melhoram a recuperação de vida e recursos durante o descanso." | WRONG — "prepara abrigos", "vida e recursos" are invented; docx says "testes de Repousar passam a ser Vigor [Atletismo + Sobrevivência]" |
| **Acampamento** | teste | "RAZ [Sobrevivência] — melhora os modificadores das ações de descanso" | WRONG — no RAZ test; it modifies the Repousar test |
| **Harmonização** | descricao | "Sincroniza com o terreno para obter bônus nos modificadores de canalização de mana." | WRONG — vague; docx says "testes de Canalizar passam a ser Vontade [Comunhão + Sobrevivência]" |
| **Harmonização** | teste | "Passiva — melhora modificador de ambiente para Canalizar" | WRONG — phrasing wrong; docx specifies the exact test change |
| **Forrageamento** | descricao | "Coleta ervas, minerais e partes de criaturas do ambiente durante exploração ou descanso." | WRONG — "durante exploração" is invented; docx says "testes de Coletar passam a ser Razão [Sobrevivência + Sobrevivência]" |
| **Forrageamento** | teste | "RAZ [Sobrevivência] — tipo e quantidade dependem do bioma" | WRONG — invents "tipo e quantidade" scale; docx specifies test change |
| **Manufaturação** | descricao | "Produz itens básicos de sobrevivência a partir de matérias-primas sem ferramentas especiais." | WRONG — invents scope; docx says "testes de Produzir passam a ser Razão [Alquimia + Sobrevivência] e testes de Fabricar passam a ser Razão [Mecânica + Sobrevivência]" |
| **Manufaturação** | teste | "RAZ [Sobrevivência] vs. complexidade do item fabricado" | WRONG |
| **Treinamento** | descricao | "Treina animais ou aliados para desenvolver habilidades específicas e melhorar desempenho em cena." | WRONG — "animais ou aliados" is partially invented; docx says "testes de Praticar passam a ser Concentração [Artes Marciais/Investigação/Lábia + Sobrevivência]" |
| **Treinamento** | teste | "PRE ou INT [Sobrevivência] vs. complexidade do treinamento" | WRONG — PRE/INT are wrong attributes; docx says CON |
| **Coleta** | descricao | "Recolhe matérias-primas (ervas, minerais, ossadas) durante períodos de descanso." | WRONG — "ossadas" is incorrect (docx says "herbais, minerais ou animais"); also misses that it's a proficiency that enables the Coletar descanso action |
| **Coleta** | teste | "RAZ [Sobrevivência] no descanso — 10+:1 · 15+:2 · 20+:3 · 25+:4 · 30+:5" | WRONG — invented scale not in docx [931]; proficiência just enables coletar descanso |
| **Coleta** | requisito | "Requer Sobrevivência lv.1" | CORRECT — D-06: do not change |

### ESPÍRITO — Current State

| Proficiência | Field | Current Value | Status |
|---|---|---|---|
| **Provocar** | descricao | "Força inimigo a direcionar todos os ataques a você por uma rodada. Não custa ação." | WRONG — "todos os ataques" is incorrect; docx says "se concentre apenas em você" (targets you, not "all attacks"); also docx says "até o final do turno" not "por uma rodada" |
| **Provocar** | teste | "PRE [Comunhão] vs. VON do alvo — sucesso: alvo provocado por 1 rodada" | WRONG — "VON" is wrong; docx says "IP Espiritual"; "1 rodada" vs "até o final do turno" |
| **Coordenar** | descricao | "Concede ação padrão extra a um aliado neste turno por coordenação tática. Não custa ação." | WRONG — "um aliado" is wrong; docx says "dois ou mais personagens"; also the mechanic is different (no test, group action in common) |
| **Coordenar** | teste | "INT [Diplomacia] — sucesso automático se aliado estiver presente e ativo" | WRONG — "INT" is wrong attribute; docx has no test; also "sucesso automático" while correct in one sense, the docx has no test listed at all |
| **Inspirar** | descricao | "Concede vantagem (+1d20) a um aliado no próximo teste com palavras ou gestos. Não custa ação." | WRONG — "+1d20 vantagem" is wrong; docx says "bônus igual seu valor em Expressão em uma perícia de sua escolha" |
| **Inspirar** | teste | "PRE [Expressão] — sucesso automático se aliado puder ouvi-lo" | WRONG — docx has no test for Inspirar; the proficiency is automatic (ação livre) |
| **Amedrontar** | descricao | "Impõe desvantagem (−1d20) a um inimigo no próximo teste por presença aterrorizante. Não custa ação." | WRONG — "desvantagem (−1d20) no próximo teste" is wrong; docx says "afugentar criaturas e pessoas para que elas não o ataquem" |
| **Amedrontar** | teste | "VON [Intimidação] vs. VON do alvo — sucesso: desvantagem no próximo teste" | WRONG — "VON" for attacker is wrong (docx says PRE); "VON do alvo" is wrong (docx says IP Espiritual); effect is wrong |
| **Distrair** | descricao | "Remove a reação disponível de um alvo até o próximo turno por distração verbal ou gestual. Não custa ação." | WRONG — "remove a reação" is completely wrong; docx says "penalidade igual seu valor em Lábia em uma perícia de sua escolha" |
| **Distrair** | teste | "INT [Lábia] vs. INT do alvo — sucesso: alvo sem reação até próximo turno" | WRONG — "INT" for attacker is wrong (docx says PRE); "INT do alvo" is wrong (docx says IP Espiritual); effect description wrong |

---

## Exact Replacement Values for Each Field Requiring Change

The values below are the exact strings the planner should use in `proficiencias.ts`. Style matches Phase 5 pattern: concise `descricao` capturing the mechanic, mechanical `teste` matching docx attributes.

### Alquimia — Replacements

```
Herbologia:
  descricao: "Utilização de recursos vegetais na criação de remédios e tônicos."
  teste: "Passiva — desbloqueia categoria de produção"  ← NO CHANGE

Mineralogia:
  descricao: "Utilização de recursos minerais na criação de bombas e afiadores (metais que atribuem propriedades elementais a equipamentos)."
  teste: "Passiva — desbloqueia categoria de produção"  ← NO CHANGE

Zoologia:
  descricao: "Utilização de recursos animais na criação de soros (concedem mutações a quem os ingere) e ossadas (catalizadores de mágicas)."
  teste: "Passiva — desbloqueia categoria de produção"  ← NO CHANGE

Poções:
  descricao: "Permite usar e reconhecer poções de qualquer campo (herbologia, mineralogia e zoologia)."
  teste: "Passiva — desbloqueia uso e reconhecimento de poções"
  requisito: "Requer Alquimia lv.1"  ← NO CHANGE (D-06)
```

**Alquimia change count:** 4 `descricao` fields + 1 `teste` field = 5 field edits.

---

### Criatividade — Replacements

Note: FIDE-07 calls out Recapitular, Reciclar, Replicar as "completamente erradas". Reforçar, Repartir, and Solução are also wrong/incomplete — all 6 proficiências require correction per D-03 pattern (full scope correction from docx).

```
Recapitular:
  descricao: "Pode acrescentar parcialmente os efeitos de uma mágica na memória à próxima mágica lançada; aplica-se a Feitiços recapitulados em Encantamentos e Criaturas."
  teste: "Passiva — custo: mana colorido da mágica recapitulada"

Reciclar:
  descricao: "Altera um descritor da mágica (tipo de dano, atributo-base ou alvo, desde que coerente com sua cor); aplica-se a Feitiços e Encantamentos."
  teste: "Passiva — custo: {1} mana incolor por alteração"

Reforçar:
  descricao: "Potencializa um efeito (dano, área, duração etc.) de uma mágica; aplica-se a Feitiços, Encantamentos e Criaturas (pode reforçar atributo ou habilidade)."
  teste: "Passiva — custo: mana incolor (metade do valor: +50% · valor completo: +75%)"

Repartir:
  descricao: "Compartilha os efeitos de uma mágica com mais alvos, mas ela perde 50% do efeito; aplica-se a Feitiços e Encantamentos (gasta 1 Foco para manter encantamento repartido)."
  teste: "Passiva — custo: {1} mana incolor por alvo extra"

Replicar:
  descricao: "Paga custo adicional de mana ao conjurar para criar uma cópia do Feitiço, lançável sobre o mesmo alvo ou outro."
  teste: "Passiva — custo: valor da mágica + {1} mana incolor por grau"

Solução:
  descricao: "Pode fazer um uso criativo de uma mágica dentro do domínio dela, mesmo que não esteja explícito na descrição."
  teste: "RAZ [Criatividade] vs. dificuldade do uso criativo"
  requisito: "Requer Criatividade lv.1"  ← NO CHANGE (D-06)
```

**Criatividade change count:** 6 `descricao` fields + 5 `teste` fields (Solução.teste phrasing is partially correct but needs alignment) = 11 field edits. Solução.teste keeps "RAZ [Criatividade]" but description clarifies it's about creative use of mágicas.

---

### Investigação — Replacements

Two `nome` changes (D-01). Three `descricao` + `teste` corrections. Leitura `descricao` + `teste` correction.

```
Selo de Feitiço:
  nome: "Selo de Feitiço"  ← NO CHANGE
  descricao: "Armazena um feitiço com antecedência (em descanso) em um selo mágico que pode ser consumido para lançar a mágica armazenada; selos podem ser usados como uma reação."
  teste: "Passiva — armazena feitiço em descanso; consome como reação"

Encantamento → Selo de Encantamento:
  nome: "Selo de Encantamento"  ← CHANGE (D-01)
  descricao: "O mesmo que Selo de Feitiço, mas armazena um encantamento em vez disso."
  teste: "Passiva — armazena encantamento em descanso; consome como reação"

Invocação → Selo de Invocação:
  nome: "Selo de Invocação"  ← CHANGE (D-01)
  descricao: "O mesmo que os anteriores, mas armazena uma invocação em vez disso."
  teste: "Passiva — armazena invocação em descanso; consome como reação"

Leitura:
  nome: "Leitura"  ← NO CHANGE
  descricao: "Permite ler e escrever; pode aprender novas mágicas a partir da leitura de livros ou pergaminhos."
  teste: "Passiva — desbloqueia leitura, escrita e aprendizado de mágicas por livros"
  requisito: "Requer Investigação lv.1"  ← NO CHANGE (D-06)
```

**Investigação change count:** 2 `nome` fields + 4 `descricao` fields + 4 `teste` fields = 10 field edits.

---

### Mecânica — Replacements

```
Artesão:
  descricao: "É capaz de produzir e melhorar acessórios mágicos variados."
  teste: "Passiva — desbloqueia produção de acessórios mágicos"

Feiticeiro:
  descricao: "É capaz de produzir e melhorar varinhas, cajados e vestimentas mágicas."
  teste: "Passiva — desbloqueia produção de condutores e vestimentas mágicas"

Ferreiro:
  descricao: "É capaz de produzir e melhorar armas, armaduras e equipamentos mágicos."
  teste: "Passiva — desbloqueia produção de armas e armaduras mágicas"

Artefatos:
  descricao: "Permite usar artefatos de qualquer profissão (artesão, feiticeiro e ferreiro) e repará-los em cenas de descanso."
  teste: "Passiva — ativa artefatos de qualquer profissão; repara em descanso"
  requisito: "Requer Mecânica lv.1"  ← NO CHANGE (D-06)
```

**Mecânica change count:** 4 `descricao` fields + 4 `teste` fields = 8 field edits.

---

### Sobrevivência — Replacements

The pattern for the 5 sub-proficiências: each one changes the test of a specific descanso action. The `descricao` must state what test changes and to what. The `teste` confirms the changed test formula.

```
Acampamento:
  descricao: "Torna-se especialista em Repousar: testes de Repousar passam a ser Vigor [Atletismo + Sobrevivência]."
  teste: "VIG [Atletismo + Sobrevivência] — modifica ação de descanso Repousar"

Harmonização:
  descricao: "Torna-se especialista em Canalizar: testes de Canalizar passam a ser Vontade [Comunhão + Sobrevivência]."
  teste: "VON [Comunhão + Sobrevivência] — modifica ação de descanso Canalizar"

Forrageamento:
  descricao: "Torna-se especialista em Coletar: testes de Coletar passam a ser Razão [Sobrevivência + Sobrevivência]."
  teste: "RAZ [Sobrevivência + Sobrevivência] — modifica ação de descanso Coletar"

Manufaturação:
  descricao: "Torna-se especialista em Produzir e Fabricar: testes de Produzir passam a ser Razão [Alquimia + Sobrevivência] e testes de Fabricar passam a ser Razão [Mecânica + Sobrevivência]."
  teste: "RAZ [Alquimia + Sobrevivência] (Produzir) · RAZ [Mecânica + Sobrevivência] (Fabricar)"

Treinamento:
  descricao: "Torna-se especialista em Praticar: testes de Praticar passam a ser Concentração [Artes Marciais/Investigação/Lábia + Sobrevivência]."
  teste: "CON [Artes Marciais/Investigação/Lábia + Sobrevivência] — modifica ação de descanso Praticar"

Coleta:
  descricao: "Permite coletar recursos (herbais, minerais ou animais) em cenas de descanso."
  teste: "Passiva — desbloqueia coleta de recursos em descanso"
  requisito: "Requer Sobrevivência lv.1"  ← NO CHANGE (D-06)
```

**Sobrevivência change count:** 6 `descricao` fields + 6 `teste` fields = 12 field edits.

---

### ESPÍRITO — Replacements

Key points from docx:
- **Provocar** (Comunhão lv.3): PRE [Comunhão] vs. IP Espiritual; effect = "se concentre apenas em você até o final do turno"
- **Coordenar** (Diplomacia lv.3): no test; "dois ou mais personagens" mobilizados; each gets "uma ação extra" (se objetivo em comum); ação livre
- **Inspirar** (Expressão lv.3): no test listed; bônus = valor em Expressão em uma perícia de escolha; até o final do turno; ação livre
- **Amedrontar** (Intimidação lv.3): PRE [Intimidação] vs. IP Espiritual; effect = "afugentar... para que elas não o ataquem até o final do turno"
- **Distrair** (Lábia lv.3): PRE [Lábia] vs. IP Espiritual do alvo; penalidade = valor em Lábia em uma perícia de escolha; até o final do turno

```
Provocar (ação livre):
  nome: "Provocar (ação livre)"  ← NO CHANGE
  descricao: "Durante um combate, provoca uma criatura ou pessoa para que ela se concentre apenas em você até o final do turno."
  teste: "PRE [Comunhão] contra IP Espiritual do alvo — ação livre"
  requisito: "Requer Comunhão lv.3"  ← NO CHANGE (D-06)

Coordenar (ação livre):
  nome: "Coordenar (ação livre)"  ← NO CHANGE
  descricao: "Coordena o grupo para agir em conjunto: dois ou mais aliados agem de acordo com suas orientações sem gastar ação (como se cada um recebesse uma ação extra, desde que tenham objetivo em comum)."
  teste: "Passiva — ação livre; sem teste; requer objetivo em comum"
  requisito: "Requer Diplomacia lv.3"  ← NO CHANGE (D-06)

Inspirar (ação livre):
  nome: "Inspirar (ação livre)"  ← NO CHANGE
  descricao: "Durante um combate, motiva um aliado com palavras; ele recebe bônus igual ao valor em Expressão em uma perícia de sua escolha até o final do turno."
  teste: "Passiva — ação livre; sem teste; bônus = valor em Expressão"
  requisito: "Requer Expressão lv.3"  ← NO CHANGE (D-06)

Amedrontar (ação livre):
  nome: "Amedrontar (ação livre)"  ← NO CHANGE
  descricao: "Durante um combate, afugenta criaturas e pessoas para que elas não o ataquem até o final do turno."
  teste: "PRE [Intimidação] contra IP Espiritual do alvo — ação livre"
  requisito: "Requer Intimidação lv.3"  ← NO CHANGE (D-06)

Distrair (ação livre):
  nome: "Distrair (ação livre)"  ← NO CHANGE
  descricao: "Durante um combate, ludibriam um inimigo com palavras; ele recebe penalidade igual ao valor em Lábia em uma perícia de sua escolha até o final do turno."
  teste: "PRE [Lábia] contra IP Espiritual do alvo — ação livre"
  requisito: "Requer Lábia lv.3"  ← NO CHANGE (D-06)
```

**ESPÍRITO change count:** 5 `descricao` fields + 5 `teste` fields = 10 field edits.

---

## Comparison Table: Current vs. Correct (Summary)

| Perícia | Field | Current | Correct | Status |
|---|---|---|---|---|
| Alquimia — Herbologia | descricao | "poções de cura, imunidade..." | "remédios e tônicos" | WRONG |
| Alquimia — Mineralogia | descricao | "proteções elementais" | "afiadores (metais...)" | WRONG |
| Alquimia — Zoologia | descricao | "soros de criaturas (mutações temporárias)" | "soros (concedem mutações) e ossadas (catalizadores)" | WRONG |
| Alquimia — Poções | descricao | "Cria poções... durante descanso" | "Permite usar e reconhecer poções" | WRONG |
| Alquimia — Poções | teste | "RAZ [Alquimia] no descanso — falha:..." | "Passiva — desbloqueia uso e reconhecimento" | WRONG |
| Criatividade — Recapitular | descricao | "Replica mágica já conjurada..." | "acrescentar parcialmente os efeitos de mágica na memória" | WRONG |
| Criatividade — Recapitular | teste | "Passiva — disponível ao lançar..." | "Passiva — custo: mana colorido" | WRONG |
| Criatividade — Reciclar | descricao | "mágica já ativa" | "alterar descritor (dano, atributo, alvo)" | WRONG |
| Criatividade — Reciclar | teste | "aplicado ao modificar mágica ativa" | "custo: {1} mana incolor" | WRONG |
| Criatividade — Reforçar | descricao | incomplete | full scope with Criaturas | INCOMPLETE |
| Criatividade — Reforçar | teste | incomplete | mana cost scale | INCOMPLETE |
| Criatividade — Repartir | descricao | "Divide o efeito... dentro do alcance" | includes 50% loss and Foco note | INCOMPLETE |
| Criatividade — Repartir | teste | "efeito dividido entre os alvos" | "{1} mana incolor por alvo extra" | INCOMPLETE |
| Criatividade — Replicar | descricao | "Reproduz funcionalmente um objeto simples" | "criar uma cópia do Feitiço ao conjurar" | WRONG |
| Criatividade — Replicar | teste | "RAZ [Criatividade] vs. complexidade" | "Passiva — custo mana adicional" | WRONG |
| Criatividade — Solução | descricao | "Improvisa respostas... sem recursos ideais" | "uso criativo de mágica dentro do domínio" | WRONG |
| Criatividade — Solução | teste | "RAZ [Criatividade] vs. dificuldade" | "RAZ [Criatividade] vs. dificuldade do uso criativo" | PARTIALLY OK |
| Investigação — Selo de Feitiço | descricao | "Inscreve mágicas em superfícies..." | "Armazena feitiço em descanso... reação" | WRONG |
| Investigação — Selo de Feitiço | teste | "RAZ [Investigação] — dificuldade..." | "Passiva — armazena em descanso; consome como reação" | WRONG |
| Investigação — Encantamento | nome | "Encantamento" | "Selo de Encantamento" | WRONG (D-01) |
| Investigação — Encantamento | descricao | "Estuda e absorve feitiços de fontes externas" | "armazena encantamento... reação" | WRONG |
| Investigação — Encantamento | teste | "RAZ [Investigação] oposto à complexidade" | "Passiva — armazena em descanso; consome como reação" | WRONG |
| Investigação — Invocação | nome | "Invocação" | "Selo de Invocação" | WRONG (D-01) |
| Investigação — Invocação | descricao | "Aprende técnicas de conjuração..." | "armazena invocação... reação" | WRONG |
| Investigação — Invocação | teste | "RAZ [Investigação] para aprender..." | "Passiva — armazena em descanso; consome como reação" | WRONG |
| Investigação — Leitura | descricao | "Decifra textos arcanos, runas..." | "ler e escrever; aprender mágicas por livros" | WRONG |
| Investigação — Leitura | teste | "RAZ [Investigação] — dificuldade..." | "Passiva — desbloqueia leitura, escrita..." | WRONG |
| Mecânica — Artesão | descricao | "joias... até 3 melhorias elementais" | "acessórios mágicos variados" | WRONG |
| Mecânica — Artesão | teste | "RAZ [Mecânica] no descanso — falha:..." | "Passiva — desbloqueia produção" | WRONG |
| Mecânica — Feiticeiro | descricao | "varinhas... (1d4, 9m)..." | "varinhas, cajados e vestimentas mágicas" | WRONG |
| Mecânica — Feiticeiro | teste | "RAZ [Mecânica] no descanso — falha:..." | "Passiva — desbloqueia produção" | WRONG |
| Mecânica — Ferreiro | descricao | "propriedades especiais... até 3 melhorias" | "armas, armaduras e equipamentos mágicos" | WRONG |
| Mecânica — Ferreiro | teste | "RAZ [Mecânica] no descanso — falha:..." | "Passiva — desbloqueia produção" | WRONG |
| Mecânica — Artefatos | descricao | "1 mana incolor... cargas perdidas" | "usar artefatos de qualquer profissão; reparar em descanso" | WRONG |
| Mecânica — Artefatos | teste | "Ativar: ação [1] + 1 mana incolor..." | "Passiva — ativa e repara em descanso" | WRONG |
| Sobrevivência — Acampamento | descricao | "Prepara abrigos..." | "Repousar → Vigor [Atletismo + Sobrevivência]" | WRONG |
| Sobrevivência — Acampamento | teste | "RAZ [Sobrevivência]..." | "VIG [Atletismo + Sobrevivência]" | WRONG |
| Sobrevivência — Harmonização | descricao | "Sincroniza com terreno..." | "Canalizar → Vontade [Comunhão + Sobrevivência]" | WRONG |
| Sobrevivência — Harmonização | teste | "Passiva — melhora modificador..." | "VON [Comunhão + Sobrevivência]" | WRONG |
| Sobrevivência — Forrageamento | descricao | "Coleta ervas... durante exploração" | "Coletar → Razão [Sobrevivência + Sobrevivência]" | WRONG |
| Sobrevivência — Forrageamento | teste | "RAZ [Sobrevivência] — tipo e quantidade..." | "RAZ [Sobrevivência + Sobrevivência]" | WRONG |
| Sobrevivência — Manufaturação | descricao | "Produz itens básicos..." | "Produzir → RAZ [Alquimia + Sobrevivência]; Fabricar → RAZ [Mecânica + Sobrevivência]" | WRONG |
| Sobrevivência — Manufaturação | teste | "RAZ [Sobrevivência] vs. complexidade" | dual test formula | WRONG |
| Sobrevivência — Treinamento | descricao | "Treina animais ou aliados..." | "Praticar → CON [Artes Marciais/Investigação/Lábia + Sobrevivência]" | WRONG |
| Sobrevivência — Treinamento | teste | "PRE ou INT [Sobrevivência]..." | "CON [Artes Marciais/Investigação/Lábia + Sobrevivência]" | WRONG |
| Sobrevivência — Coleta | descricao | "Recolhe matérias-primas (ervas, minerais, ossadas)..." | "coletar recursos (herbais, minerais ou animais) em cenas de descanso" | WRONG |
| Sobrevivência — Coleta | teste | "RAZ [Sobrevivência] no descanso — 10+:1..." | "Passiva — desbloqueia coleta em descanso" | WRONG |
| ESPÍRITO — Provocar | descricao | "todos os ataques a você" | "se concentre apenas em você" | WRONG |
| ESPÍRITO — Provocar | teste | "PRE [Comunhão] vs. VON do alvo" | "PRE [Comunhão] contra IP Espiritual do alvo" | WRONG |
| ESPÍRITO — Coordenar | descricao | "um aliado... ação padrão extra" | "dois ou mais aliados; ação extra com objetivo em comum" | WRONG |
| ESPÍRITO — Coordenar | teste | "INT [Diplomacia] — sucesso automático" | "Passiva — ação livre; sem teste" | WRONG |
| ESPÍRITO — Inspirar | descricao | "vantagem (+1d20)" | "bônus = valor em Expressão em uma perícia" | WRONG |
| ESPÍRITO — Inspirar | teste | "PRE [Expressão] — sucesso automático" | "Passiva — ação livre; bônus = valor em Expressão" | WRONG |
| ESPÍRITO — Amedrontar | descricao | "desvantagem (−1d20) no próximo teste" | "afugentar... para não o atacar" | WRONG |
| ESPÍRITO — Amedrontar | teste | "VON [Intimidação] vs. VON do alvo" | "PRE [Intimidação] contra IP Espiritual do alvo" | WRONG |
| ESPÍRITO — Distrair | descricao | "Remove a reação disponível" | "penalidade = valor em Lábia em uma perícia" | WRONG |
| ESPÍRITO — Distrair | teste | "INT [Lábia] vs. INT do alvo" | "PRE [Lábia] contra IP Espiritual do alvo" | WRONG |

---

## Items Already Correct — No Change Needed

| Proficiência | Fields Correct |
|---|---|
| All Alquimia | `nome` (Herbologia, Mineralogia, Zoologia, Poções) |
| All Alquimia | `teste` for Herbologia, Mineralogia, Zoologia (already "Passiva — desbloqueia categoria de produção") |
| All Alquimia | `requisito` on Poções ("Requer Alquimia lv.1") |
| All Criatividade | `nome` (all 6) |
| Criatividade — Solução | `requisito` ("Requer Criatividade lv.1") |
| All Investigação | `requisito` on Leitura ("Requer Investigação lv.1") |
| Investigação — Selo de Feitiço | `nome` ("Selo de Feitiço") |
| All Mecânica | `nome` (Artesão, Feiticeiro, Ferreiro, Artefatos) |
| Mecânica — Artefatos | `requisito` ("Requer Mecânica lv.1") |
| All Sobrevivência | `nome` (all 6) |
| Sobrevivência — Coleta | `requisito` ("Requer Sobrevivência lv.1") |
| All ESPÍRITO | `nome` (Provocar, Coordenar, Inspirar, Amedrontar, Distrair — including "(ação livre)" suffix) |
| All ESPÍRITO | `requisito` on all 5 (Requer X lv.3) |
| All blocks | `label`, `atributos`, `descricao` of PericiaData (D-05: never touch) |

---

## Change Count Summary

| Perícia | Proficiências tocadas | Field edits |
|---|---|---|
| Alquimia | 4 de 4 | 4 descricao + 1 teste = 5 |
| Criatividade | 6 de 6 | 6 descricao + 5 teste + 0 nome = 11 |
| Investigação | 4 de 4 | 4 descricao + 4 teste + 2 nome = 10 |
| Mecânica | 4 de 4 | 4 descricao + 4 teste = 8 |
| Sobrevivência | 6 de 6 | 6 descricao + 6 teste = 12 |
| ESPÍRITO | 5 de 5 | 5 descricao + 5 teste = 10 |
| **Total** | **29 de 29** | **~56 field edits** |

---

## Architecture Patterns

### Pattern: Data-only edit in static constant

Identical to Phase 5. The entire `proficiencias.ts` file is a single exported `proficiencias` constant. All edits are string replacements inside the `mente` block (lines 88–148) and `espirito` block (lines 149–190). No functions, no logic, no imports change.

### System Architecture Diagram

```
docx paragraphs [881–931, 939, 948, 957, 966, 975]
         ↓ (source of truth)
data/proficiencias.ts  →  import { proficiencias }
         ↓
app/(tabs)/regras.tsx §4   (renders rules dynamically — no change needed)
         ↓
components/rpg/ProficienciasSection.tsx
         ↓ (chip label = proficiencia.nome → AsyncStorage key)
User sees corrected descriptions and tests in-app
```

The two `nome` changes for Investigação (Encantamento→Selo de Encantamento, Invocação→Selo de Invocação) change both the visible chip label and the AsyncStorage key. This is accepted per D-02 (data loss accepted, no migration).

### Recommended Task Structure

Following Phase 5 two-task pattern:

- **Task 1 (MENTE):** Alquimia + Criatividade + Investigação + Mecânica + Sobrevivência — all 5 perícias in the `mente` block (lines 88–148). Approx. 46 field edits.
- **Task 2 (ESPÍRITO):** Comunhão + Diplomacia + Expressão + Intimidação + Lábia — all 5 proficiências in the `espirito` block (lines 149–190). Approx. 10 field edits.

### Project Structure (relevant files)

```
data/
└── proficiencias.ts   ← only file modified in Phase 6
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verifying correct text | Custom diff script | `grep -n` on key phrases | Simple, no dep |
| TypeScript validation | Manual review | `npx tsc --noEmit` | Catches syntax errors instantly |

---

## Edge Cases and Risks

### Risk 1: Two proficiências share nome "Especialização" and "Mestria" across Esgrima and Pontaria (corpo)
Not applicable to Phase 6 — no duplicates in `mente`/`espirito` blocks. Each proficiência has a unique `nome` within its perícia.

### Risk 2: Coordenar — no test in docx
The docx paragraph [948] explicitly describes Coordenar as an automatic ação livre with no opposed test ("não gastam nenhuma ação para isso"). The current code has "INT [Diplomacia] — sucesso automático" which implies a test that doesn't exist. The replacement `teste` must convey it's automatic/passive. Use `"Passiva — ação livre; sem teste; requer objetivo em comum"` — matching the docx description faithfully.

### Risk 3: Inspirar — no test in docx
Similar to Coordenar: docx [957] says "pode motivar um aliado" and "recebe bônus" without mentioning a test. Use `"Passiva — ação livre; sem teste; bônus = valor em Expressão"`.

### Risk 4: Sobrevivência — "Razão [Sobrevivência + Sobrevivência]" looks odd for Forrageamento
This is verbatim from docx [928]: "testes de Coletar passam a ser Razão [Sobrevivência + Sobrevivência]". Keep this exact phrasing — it is the canonical rule. Do not simplify to "RAZ [Sobrevivência]".

### Risk 5: Criatividade proficiências Reforçar, Repartir not in FIDE-07 explicit callout
FIDE-07 names Recapitular, Reciclar, Replicar as "completamente erradas". However, D-03's logic (full scope correction from docx) and the current analysis show Reforçar, Repartir, and Solução are also wrong/incomplete. All 6 Criatividade proficiências must be corrected to match docx. This is consistent with Phase 5 methodology (correct all, not just the named ones).

### Risk 6: TypeScript single quotes and special characters
Strings contain Portuguese characters (ê, ã, ç, â, é, í, ó, ú, etc.) and curly braces (`{1}`) — both already present in the file and work fine. Check that no new apostrophe is introduced inside a single-quoted string.

### Risk 7: Chip key collision after nome change
Changing `'Encantamento'` → `'Selo de Encantamento'` changes the AsyncStorage chip key from `'investigacao:Encantamento'` to `'investigacao:Selo de Encantamento'`. The old key silently becomes orphaned. D-02 explicitly accepts this data loss. No migration task needed.

### Risk 8: Mecânica `teste` field currently contains production step scale
The current `teste` values for Artesão, Feiticeiro, Ferreiro use a `"falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas"` format. This scale is NOT in the docx proficiência descriptions — it appears to be a design artifact from the app's crafting system. Replacing with `"Passiva — desbloqueia produção de X"` aligns with docx but loses the production scale. This is correct per the task (fidelidade ao docx v0.4 proficiência text).

---

## Validation Architecture

No automated test infrastructure for text content (consistent with Phase 5). Validation is manual + TypeScript check:

### Test Framework

| Property | Value |
|----------|-------|
| Framework | TypeScript compiler (built-in to project) |
| Config file | `tsconfig.json` |
| Quick run command | `npx tsc --noEmit` |
| Full suite command | `npx tsc --noEmit` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FIDE-06 | Poções describes using/recognizing potions (not creating) | manual grep | `grep -n "usar e reconhecer" data/proficiencias.ts` | ✅ |
| FIDE-07 | Recapitular, Reciclar, Replicar match docx mechanics | manual grep | `grep -n "acrescentar parcialmente" data/proficiencias.ts` | ✅ |
| FIDE-08 | Selos renamed; Leitura describes read/write | manual grep | `grep -n "Selo de Encantamento\|Selo de Invocação" data/proficiencias.ts` | ✅ |
| FIDE-09 | Feiticeiro includes vestimentas mágicas | manual grep | `grep -n "vestimentas mágicas" data/proficiencias.ts` | ✅ |
| FIDE-10 | 5 Sobrevivência proficiências describe test change per descanso action | manual grep | `grep -n "Atletismo + Sobrevivência\|Comunhão + Sobrevivência" data/proficiencias.ts` | ✅ |
| FIDE-11 | ESPÍRITO: correct tests (PRE vs IP Espiritual) and mechanics | manual grep | `grep -n "IP Espiritual\|valor em Expressão\|valor em Lábia" data/proficiencias.ts` | ✅ |

### Wave 0 Gaps

None — existing toolchain (`npx tsc --noEmit`, `grep`) covers all verification needs. No new test files required.

---

## Environment Availability

Step 2.6: SKIPPED — this phase modifies one static TypeScript data file. No external tools, services, or runtimes beyond the existing project toolchain (Node.js + TypeScript) are required.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | Criatividade Reforçar and Repartir are also wrong (not just FIDE-07's named three) — all 6 need correction | Criatividade section | Low — docx extraction is explicit; worst case is extra correct edits |
| A2 | Coordenar and Inspirar have no test in docx — they are automatic ação livre | ESPÍRITO section | Low — docx [948] and [957] both lack any test statement |
| A3 | "Razão [Sobrevivência + Sobrevivência]" in Forrageamento is intentional docx text, not a typo | Sobrevivência section | Low — docx paragraph [928] states this exactly |
| A4 | Mecânica production step scale ("falha: 0,5 etapa · 10+: 1 etapa") is not part of docx proficiência text — removing it is correct | Mecânica section | Low — docx [915]–[917] contain no step scales |

**All other claims are VERIFIED directly from docx extraction (paragraphs cited throughout).**

---

## Package Legitimacy Audit

Not applicable — Phase 6 installs no external packages. It is a data-only content correction.

---

## Security Domain

Not applicable — this phase modifies static display text in a local-only app. No authentication, network requests, user input handling, or cryptography is involved. `security_enforcement` is not blocking.

---

## Sources

### Primary (HIGH confidence)
- `magic keos/Magic no Universo Kéos v.0.4.docx` — paragraphs [881]–[931] (MENTE) and [939], [948], [957], [966], [975] (ESPÍRITO) extracted via Python zipfile + xml.etree.ElementTree; full text confirmed
- `data/proficiencias.ts` — current state read directly (lines 88–190)
- `.planning/REQUIREMENTS.md` — FIDE-06 through FIDE-11 requirements
- `.planning/phases/06-proficiencias-mente-espirito/06-CONTEXT.md` — decisions D-01 through D-08

### Secondary
- `.planning/phases/05-proficiencias-corpo/05-RESEARCH.md` — Phase 5 methodology reference
- `GAME_RULES.md` §5 — cross-reference for atributos lists

---

## Metadata

**Confidence breakdown:**
- Docx text (exact rules): HIGH — extracted verbatim from source file, paragraphs cited
- Current code state: HIGH — read directly from proficiencias.ts lines 88–190
- Comparison (wrong vs correct): HIGH — diff performed field by field against docx
- ESPÍRITO mechanics: HIGH — docx paragraphs [939], [948], [957], [966], [975] are explicit; Coordenar/Inspirar have no test (verified by absence, not assumption)

**Research date:** 2026-05-16
**Valid until:** Until docx v0.4 is superseded by a newer version
