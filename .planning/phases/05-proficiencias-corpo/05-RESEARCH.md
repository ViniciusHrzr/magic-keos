# Phase 5: Proficiências CORPO — Research

**Researched:** 2026-05-16
**Domain:** Data content correction — `data/proficiencias.ts`, corpo section (lines 24–87)
**Confidence:** HIGH — all findings extracted directly from the official docx v0.4

---

## Summary

Phase 5 corrects the `descricao` and `teste` fields of all 22 corpo proficiências across five perícias: Artes Marciais, Atletismo, Esgrima, Furtividade, and Pontaria. The source of truth is `magic keos/Magic no Universo Kéos v.0.4.docx`, extracted verbatim via Python/zipfile.

The corrections are **purely textual data edits** inside a single TypeScript file. No schema changes, no new proficiências added or removed, no UI changes. The TypeScript `Proficiencia` interface (`nome`, `descricao`, `teste`, `requisito?`) is already correct for this data — no type changes needed.

**Primary recommendation:** Edit `data/proficiencias.ts` lines 31–86 only. Make each proficiência's `descricao` and `teste` match the exact mechanics from the docx paragraphs extracted below. Do not touch anything outside the `corpo` block.

---

## Project Constraints (from project context)

- v1.1 scope: content-only corrections — NO new features, NO layout changes, NO new proficiências added/removed
- React Context + AsyncStorage architecture is not touched
- `data/proficiencias.ts` is the only file modified in this phase
- No TypeScript type changes needed — existing `Proficiencia` interface covers all fields

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Rule text content | Data layer (`proficiencias.ts`) | — | Static exported constant, no runtime logic |
| Rendering proficiências | Frontend (React component) | — | Reads from the data file; no changes needed |
| Validation that text is correct | Manual (docx comparison) | — | No automated test infra for text content |

---

## Source Extraction — Docx Paragraphs (VERIFIED)

The following paragraphs were extracted from `magic keos/Magic no Universo Kéos v.0.4.docx` using Python zipfile + ElementTree. Paragraph numbers refer to the in-memory list built from `word/document.xml`.

### Artes Marciais (§ Corporais, parágrafo 578–593)

**[579]** Artista marciais são os lutadores que dispensam qualquer tipo de arma, recebendo bônus por lutarem desarmados, ou utilizam apenas armas de concussão como bastões. Além disso, a partir do primeiro nível e a cada três níveis (1, 4 e 7), o artista marcial se torna proficiente em uma manobra de combate à sua escolha:

- **[580] Derrubar:** derruba o alvo, ele precisa gastar 1 movimentação em seu turno para se levantar; teste de Força [Artes Marciais] contra Vigor [Artes Marciais ou Atletismo] do alvo.
- **[581] Desarmar:** desarma o alvo e ele precisa gastar uma movimentação para recuperar sua arma (se você a largar); teste de Reflexos [Artes Marciais] contra Reflexos [Artes Marciais ou Furtividade].
- **[582] Desviar:** é capaz de utilizar uma reação para desviar de projéteis físicos; teste oposto de Reflexos [Artes Marciais].
- **[583] Fintar:** distrai o alvo e ele não é capaz de reagir até seu próximo turno; teste de Presença [Artes Marciais] contra Vontade [Artes Marciais ou Lábia].
- **[584] Imobilizar:** imobiliza o alvo e ele não pode realizar ações enquanto você o mantiver nesta condição; teste de Vigor [Artes Marciais] contra Força [Artes Marciais ou Atletismo].
- **[586] Aparar (reação):** a partir do segundo nível em Artes Marciais, ao sofrer um ataque corpo a corpo, pode utilizar uma reação para tentar apará-lo: faça um teste oposto de Reflexos [Artes Marciais] ao ataque; se o seu resultado for maior, você apara o ataque e sofre metade do dano causado, então pode realizar uma manobra de combate da qual seja proficiente contra o opositor.

### Atletismo (§ Corporais, parágrafo 594–604)

**[595]** Um personagem atlético é capaz de utilizar os movimentos de seu corpo das mais variadas maneiras para se livrar de situações difíceis... A partir do segundo nível e a cada 3 níveis (2, 5 e 8), torna-se proficiente em uma técnica de movimentação:

- **[596] Investida:** ao realizar um ataque logo após uma ação de movimento, causa dano adicional igual seu bônus em Atletismo.
- **[597] Prontidão:** se não realizar nenhuma ação de movimento neste turno, recebe uma reação adicional até o início do próximo turno.
- **[598] Fôlego:** se não realizar nenhuma ação padrão neste turno, recebe Velocidade +1 até o final da cena.
- **[599] Disparar (reação):** a partir do primeiro nível em Atletismo, pode utilizar uma reação para ter uma movimentação extra; pode ser uma ação simples como somente se movimentar, ou uma ação que exija algum teste de [Atletismo].

### Esgrima (§ Corporais, parágrafo 605–616)

**[606]** Esgrimista é aquele capaz de lutar com armas brancas... A partir do primeiro nível e a cada 3 níveis (1, 4 e 7), escolhe um tipo de arma para se tornar proficiente — os bônus desta perícia só são aplicados quando o personagem estiver usando uma arma com a qual tem proficiência.

- **[607] Armas Leves:** torna-se proficiente no uso de armas pequenas como facas, adagas e punhais que, embora causem menor dano, podem ser escondidas com facilidade e usadas com Reflexos.
- **[608] Armas de Uma Mão:** torna-se proficiente em armas de médio porte, empunhadas com uma mão, como espadas e machados, permitindo o uso de escudos ou de uma segunda arma leve; são usadas com Força.
- **[609] Armas de Duas Mãos:** torna-se proficiente no uso de armas grandes empunhadas com as duas mãos, como montantes (usados com Força) e lanças (usadas com Reflexos).
- **[610] Especialização em Arma:** torna-se especialista em uma arma em que já é proficiente; ao atacar com ela, causa [+2] de dano adicional.
- **[611] Mestria em Arma:** torna-se mestre em uma arma em que já é especialista; ao atacar com ela, causa [+5] de dano adicional.
- **[612] Contra-atacar (reação):** a partir do segundo nível em Esgrima, se o alvo errar um ataque contra você, pode utilizar uma reação para realizar um ataque corpo a corpo contra ele.

### Furtividade (§ Corporais, parágrafo 617–625)

**[618]** Para se esconder, andar sorrateiramente ou praticar atividades que exigem sutileza e coordenação motora fina... A partir do segundo nível e a cada 3 níveis (2, 5 e 8), torna-se proficiente em uma técnica sorrateira:

- **[619] Ataque Furtivo:** aumenta a acuidade de seus golpes: ao realizar um ataque surpresa, adiciona seu bônus de Furtividade no teste de ataque.
- **[620] Ataque Letal:** aumenta a letalidade de seus golpes: ao acertar um ataque surpresa, causa dano adicional igual seu bônus em Furtividade.
- **[621] Ataque Silencioso:** aumenta sua capacidade de permanecer oculto depois de atacar: após realizar um ataque surpresa, pode fazer outro teste para se esconder sem gastar ações para isso; se tiver sucesso, sua localização não é revelada.
- **[622] Esquivar (reação):** a partir do primeiro nível em Furtividade, ao sofrer um ataque, pode utilizar uma reação para tentar esquivar-se: faça um teste oposto de Reflexos [Furtividade] ao ataque; se o seu resultado for maior, você se esquiva do ataque e não sofre dano.

### Pontaria (§ Corporais, parágrafo 626–638)

**[627]** Perícia essencial para realizar ataques com armas à distância... A partir do primeiro nível e a cada três níveis (1, 4 e 7), escolhe um tipo de arma para se tornar proficiente — os bônus desta perícia só são aplicados quando o personagem estiver usando uma arma com a qual tem proficiência.

- **[628] Arcos:** torna-se proficiente no uso de arcos curtos ou longos; arcos curtos são usados com Reflexos e arcos longos são usados com Força.
- **[629] Armas de Arremesso:** torna-se proficiente no uso de armas de arremesso; adagas são usadas com Reflexos e machados são usados com Força.
- **[630] Condutores:** torna-se proficiente no uso de condutores mágicos como varinhas e cajados, usados com Razão ou Presença.
- **[631] Especialização em Arma:** torna-se especialista em uma arma em que já é proficiente; ao atacar com ela, causa [+2] de dano adicional.
- **[632] Mestria em Arma:** torna-se mestre em uma arma em que já é especialista; ao atacar com ela, causa [+5] de dano adicional.
- **[633] Mirar (reação):** a partir do segundo nível em Pontaria, pode escolher não utilizar sua reação para permanecer mirando em um alvo; se o fizer, recebe uma vantagem (+1d20 básico) no teste e, em caso de sucesso, causa dano adicional igual seu valor em Pontaria.

---

## Comparison Table: Current vs. Correct

Legend: STATUS = `CORRECT` | `WRONG` | `INCOMPLETE`

### Artes Marciais

| Proficiência | Field | Current (proficiencias.ts) | Correct (docx) | Status |
|---|---|---|---|---|
| **Derrubar** | descricao | "Joga o oponente ao chão, impondo desvantagem em ataques e impedindo movimentação até se levantar." | "Derruba o alvo; ele precisa gastar 1 movimentação em seu turno para se levantar." | WRONG — "desvantagem em ataques" is invented; docx says only forced movement cost |
| **Derrubar** | teste | "FOR [Artes Marciais] oposto ao oponente" | "FOR [Artes Marciais] contra VIG [Artes Marciais ou Atletismo] do alvo" | WRONG — not "oposto", it's FOR vs VIG |
| **Desarmar** | descricao | "Retira a arma do oponente com golpe ou torção de pulso preciso." | "Desarma o alvo; ele precisa gastar uma movimentação para recuperar sua arma (se você a largar)." | WRONG — misses the mechanical consequence; "se você a largar" condition missing |
| **Desarmar** | teste | "REF [Artes Marciais] oposto ao oponente" | "REF [Artes Marciais] contra REF [Artes Marciais ou Furtividade]" | WRONG — not generic "oposto", specific attributes listed |
| **Desviar** | descricao | "Redireciona um ataque físico para longe do corpo usando o impulso do adversário." | "É capaz de utilizar uma reação para desviar de projéteis físicos." | WRONG — current says "physical attack" broadly; docx specifies "projéteis físicos" (ranged projectiles) |
| **Desviar** | teste | "REF [Artes Marciais] oposto ao atacante" | "Teste oposto de REF [Artes Marciais]" | CORRECT in substance, but phrasing can be aligned |
| **Fintar** | descricao | "Cria abertura falsa para enganar o oponente e atacar com vantagem no próximo golpe." | "Distrai o alvo e ele não é capaz de reagir até seu próximo turno." | WRONG — "atacar com vantagem" is invented; docx says alvo perde reação |
| **Fintar** | teste | "PRE [Artes Marciais] vs. SEN do oponente" | "PRE [Artes Marciais] contra VON [Artes Marciais ou Lábia]" | WRONG — current says "SEN"; docx says "VON [Artes Marciais ou Lábia]" |
| **Imobilizar** | descricao | "Prende o oponente em chave ou torção, impedindo quaisquer ações físicas por uma rodada." | "Imobiliza o alvo e ele não pode realizar ações enquanto você o mantiver nesta condição." | WRONG — "por uma rodada" is invented; docx says "enquanto você o mantiver" (ongoing) |
| **Imobilizar** | teste | "FOR [Artes Marciais] oposto ao oponente" | "VIG [Artes Marciais] contra FOR [Artes Marciais ou Atletismo]" | WRONG — current says FOR attacker; docx says VIG attacker vs FOR defender |
| **Aparar (reação)** | descricao | "Intercepção de ataque físico com corpo ou arma. Sucesso: metade do dano e pode aplicar imediatamente uma manobra." | "Ao sofrer um ataque corpo a corpo, pode utilizar uma reação para tentar apará-lo; se tiver sucesso, sofre metade do dano causado e pode realizar uma manobra de combate da qual seja proficiente contra o opositor." | WRONG — current says "ataque físico" broadly; docx specifies "corpo a corpo" |
| **Aparar (reação)** | teste | "REF [Artes Marciais] oposto ao atacante — reação [1]" | "Teste oposto de REF [Artes Marciais] ao ataque — reação [1]" | CORRECT in substance |

### Atletismo

| Proficiência | Field | Current (proficiencias.ts) | Correct (docx) | Status |
|---|---|---|---|---|
| **Investida** | descricao | "Combina movimentação e ataque em uma única ação, adicionando dano pelo impacto." | "Ao realizar um ataque logo após uma ação de movimento, causa dano adicional igual seu bônus em Atletismo." | WRONG — "dano pelo impacto" is vague/invented; docx specifies "dano adicional igual bônus em Atletismo" |
| **Investida** | teste | "FOR/REF [Atletismo] — dano adicional pela distância percorrida" | Passive — no test listed; dano é fixo (bônus em Atletismo), não "pela distância" | WRONG — "pela distância percorrida" is invented |
| **Prontidão** | descricao | "Corpo em estado de alerta máximo para agir antes dos outros e ignorar surpresas parciais." | "Se não realizar nenhuma ação de movimento neste turno, recebe uma reação adicional até o início do próximo turno." | WRONG — completely different mechanic; docx says conditional reação adicional, not initiative/surprise |
| **Prontidão** | teste | "VIG [Atletismo] — determina posição na ordem de iniciativa" | Passive — condition is "no usar movimentação neste turno" | WRONG — no test involved; it's a passive conditional |
| **Fôlego** | descricao | "Sustenta esforço físico extremo sem penalidades de exaustão por períodos prolongados." | "Se não realizar nenhuma ação padrão neste turno, recebe Velocidade +1 até o final da cena." | WRONG — completely different mechanic; docx says conditional Velocidade +1, not exhaustion resistance |
| **Fôlego** | teste | "VIG [Atletismo] — resistência a condições de esforço e exaustão" | Passive — condition is "no usar ação padrão neste turno" | WRONG — no test; it's a passive conditional |
| **Disparar (reação)** | descricao | "Movimentação de fuga ou avanço rápido como resposta a um evento. Permite mover 9m extras." | "Pode utilizar uma reação para ter uma movimentação extra; pode ser uma ação simples como somente se movimentar, ou uma ação que exija algum teste de [Atletismo]." | WRONG — "9m extras" is invented distance; docx specifies no distance limit, and says it can include an Atletismo test |
| **Disparar (reação)** | teste | "REF [Atletismo] — movimentação extra — reação [1]" | "Reação [1] — movimentação extra (podendo exigir teste de [Atletismo])" | INCOMPLETE — current says REF but docx doesn't specify attribute for Disparar itself |

### Esgrima

| Proficiência | Field | Current (proficiencias.ts) | Correct (docx) | Status |
|---|---|---|---|---|
| **Armas Leves** | descricao | "Proficiência com adagas e armas de uma mão leves, sem penalidades de manejo." | "Torna-se proficiente no uso de armas pequenas como facas, adagas e punhais que, embora causem menor dano, podem ser escondidas com facilidade e usadas com Reflexos." | WRONG — misses that Armas Leves use REF (not FOR), and omits "escondidas com facilidade" |
| **Armas Leves** | teste | "Passiva — desbloqueia uso sem penalidade" | "Passiva — desbloqueia uso sem penalidade" | CORRECT |
| **Uma Mão** | descricao | "Proficiência com espadas e lanças curtas de uma mão, incluindo bônus de escudo simultâneo." | "Torna-se proficiente em armas de médio porte, empunhadas com uma mão, como espadas e machados, permitindo o uso de escudos ou de uma segunda arma leve; são usadas com Força." | WRONG — current lists "lanças curtas" but docx says "espadas e machados"; current doesn't mention FOR; docx allows "segunda arma leve" not just shields |
| **Uma Mão** | teste | "Passiva — desbloqueia uso sem penalidade" | "Passiva — desbloqueia uso sem penalidade" | CORRECT |
| **Duas Mãos** | descricao | "Proficiência com montantes e lanças longas, maximizando o dado de dano." | "Torna-se proficiente no uso de armas grandes empunhadas com as duas mãos, como montantes (usados com Força) e lanças (usadas com Reflexos)." | WRONG — "maximizando o dado de dano" is invented; docx specifies which attribute each weapon type uses |
| **Duas Mãos** | teste | "Passiva — desbloqueia uso sem penalidade" | "Passiva — desbloqueia uso sem penalidade" | CORRECT |
| **Especialização** | descricao | "Bônus fixo de acurácia com a arma favorita, reduzindo penalidades situacionais." | "Torna-se especialista em uma arma em que já é proficiente; ao atacar com ela, causa [+2] de dano adicional." | WRONG — says "acurácia"; docx says "+2 dano" |
| **Especialização** | teste | "Passiva — +bônus nos testes da arma escolhida" | "Passiva — +2 dano ao atacar com a arma escolhida" | WRONG — "testes" implies acurácia; should say dano |
| **Mestria** | descricao | "Domínio pleno que desbloqueia manobras exclusivas e elimina penalidades avançadas." | "Torna-se mestre em uma arma em que já é especialista; ao atacar com ela, causa [+5] de dano adicional." | WRONG — says "manobras exclusivas"; docx says "+5 dano" |
| **Mestria** | teste | "Passiva — desbloqueia manobras especiais da arma" | "Passiva — +5 dano ao atacar com a arma escolhida" | WRONG |
| **Contra-atacar (reação)** | descricao | "Quando o adversário erra um ataque corpo a corpo, realiza imediatamente um contra-ataque." | "Se o alvo errar um ataque contra você, pode utilizar uma reação para realizar um ataque corpo a corpo contra ele." | CORRECT in substance |
| **Contra-atacar (reação)** | teste | "REF [Esgrima] oposto ao atacante que errou — reação [1]" | "Reação [1] — ataque corpo a corpo de REF [Esgrima]" | CORRECT in substance (docx says "contra-atacar com um teste oposto de Reflexos [Esgrima]" in the combat section at [1674]) |

### Furtividade

| Proficiência | Field | Current (proficiencias.ts) | Correct (docx) | Status |
|---|---|---|---|---|
| **Ataque Furtivo** | descricao | "Golpe surpresa de posição oculta, causando dano adicional significativo." | "Aumenta a acuidade de seus golpes: ao realizar um ataque surpresa, adiciona seu bônus de Furtividade no teste de ataque." | WRONG — current says "dano adicional"; docx says bônus no TESTE DE ATAQUE (not dano) |
| **Ataque Furtivo** | teste | "REF [Furtividade] vs. Percepção do alvo — requer posição oculta" | Passive — the effect is adding bônus em Furtividade to the attack roll | WRONG — no separate test; it modifies the attack roll itself |
| **Ataque Letal** | descricao | "Mira zonas vitais do alvo para causar condições graves além do dano base." | "Aumenta a letalidade de seus golpes: ao acertar um ataque surpresa, causa dano adicional igual seu bônus em Furtividade." | WRONG — "condições graves" is invented; docx says "dano adicional igual bônus em Furtividade" |
| **Ataque Letal** | teste | "REF [Furtividade] vs. dificuldade — resultado define a condição aplicada" | Passive — it's an automatic bonus on hit | WRONG — no test; applies automatically when hitting a surprise attack |
| **Ataque Silencioso** | descricao | "Neutraliza o alvo sem produzir som perceptível, sem alertar ninguém nos arredores." | "Aumenta sua capacidade de permanecer oculto depois de atacar: após realizar um ataque surpresa, pode fazer outro teste para se esconder sem gastar ações para isso; se tiver sucesso, sua localização não é revelada." | WRONG — completely different mechanic; it's about staying hidden after attack, not silencing the attack |
| **Ataque Silencioso** | teste | "REF [Furtividade] oposto à SEN de todos os presentes" | "REF [Furtividade] para se esconder (sem custo de ação) após ataque surpresa" | WRONG |
| **Esquivar (reação)** | descricao | "Evita completamente um ataque com desvio no último momento. Sucesso: zero dano." | "Ao sofrer um ataque, pode utilizar uma reação para tentar esquivar-se: faça um teste oposto de Reflexos [Furtividade] ao ataque; se o seu resultado for maior, você se esquiva do ataque e não sofre dano." | CORRECT in substance |
| **Esquivar (reação)** | teste | "REF [Furtividade] oposto ao atacante — sucesso: dano zerado — reação [1]" | "REF [Furtividade] oposto ao ataque — sucesso: não sofre dano — reação [1]" | CORRECT in substance |

### Pontaria

| Proficiência | Field | Current (proficiencias.ts) | Correct (docx) | Status |
|---|---|---|---|---|
| **Arcos** | descricao | "Proficiência com arcos curtos (1d6, 18m) e longos (1d8, 30m), sem penalidades de manejo." | "Torna-se proficiente no uso de arcos curtos ou longos; arcos curtos são usados com Reflexos e arcos longos são usados com Força." | WRONG — damage dice and ranges are weapon stats (not proficiency description); docx emphasizes the attribute distinction |
| **Arcos** | teste | "Passiva — desbloqueia uso sem penalidade" | "Passiva — desbloqueia uso sem penalidade" | CORRECT |
| **Arremesso** | descricao | "Proficiência com armas de arremesso: adagas e machados (9m), lanças curtas (18m)." | "Torna-se proficiente no uso de armas de arremesso; adagas são usadas com Reflexos e machados são usados com Força." | WRONG — distances (9m, 18m) are weapon table stats not in docx proficiency text; docx specifies attribute by weapon type; lances not mentioned in docx text |
| **Arremesso** | teste | "Passiva — desbloqueia uso sem penalidade" | "Passiva — desbloqueia uso sem penalidade" | CORRECT |
| **Condutores** | descricao | "Proficiência com varinhas (1d4, 9m, 1 mão) e cajados (1d6, 18m, 2 mãos) para dano mágico." | "Torna-se proficiente no uso de condutores mágicos como varinhas e cajados, usados com Razão ou Presença." | WRONG — damage dice and distances are weapon table stats; docx emphasizes RAZ or PRE attribute |
| **Condutores** | teste | "Passiva — desbloqueia uso sem penalidade" | "Passiva — desbloqueia uso sem penalidade" | CORRECT |
| **Especialização** | descricao | "Bônus de acurácia com o tipo de arma à distância preferido." | "Torna-se especialista em uma arma em que já é proficiente; ao atacar com ela, causa [+2] de dano adicional." | WRONG — says "acurácia"; docx says "+2 dano" |
| **Especialização** | teste | "Passiva — +bônus nos testes da arma escolhida" | "Passiva — +2 dano ao atacar com a arma escolhida" | WRONG |
| **Mestria** | descricao | "Domínio avançado com técnicas especiais e penalidades de distância reduzidas." | "Torna-se mestre em uma arma em que já é especialista; ao atacar com ela, causa [+5] de dano adicional." | WRONG — "técnicas especiais" and "penalidades de distância reduzidas" are invented; docx says "+5 dano" |
| **Mestria** | teste | "Passiva — desbloqueia manobras especiais de disparo" | "Passiva — +5 dano ao atacar com a arma escolhida" | WRONG |
| **Mirar (reação)** | descricao | "Ajuste cuidadoso de mira que acumula bônus para o próximo ataque de Pontaria." | "Pode escolher não utilizar sua reação para permanecer mirando em um alvo; se o fizer, recebe uma vantagem (+1d20 básico) no teste e, em caso de sucesso, causa dano adicional igual seu valor em Pontaria." | WRONG — misses the "dano adicional igual valor em Pontaria" part entirely |
| **Mirar (reação)** | teste | "REF [Pontaria] — bônus acumulado ao próximo disparo — reação [1]" | "Reação [1] — vantagem (+1d20) no próximo teste de Pontaria + dano adicional igual valor em Pontaria em caso de sucesso" | WRONG — misses dano adicional |

---

## Exact Replacement Values for Each Field Requiring Change

The values below are the exact strings the planner should use in `proficiencias.ts`. These preserve the project's field naming style (concise `descricao`, mechanical `teste`).

### Artes Marciais — Replacements

```
Derrubar:
  descricao: "Derruba o alvo; ele precisa gastar 1 movimentação em seu turno para se levantar."
  teste: "FOR [Artes Marciais] contra VIG [Artes Marciais ou Atletismo] do alvo"

Desarmar:
  descricao: "Desarma o alvo; ele precisa gastar uma movimentação para recuperar sua arma (se você a largar)."
  teste: "REF [Artes Marciais] contra REF [Artes Marciais ou Furtividade] do alvo"

Desviar:
  descricao: "Utiliza uma reação para desviar de projéteis físicos."
  teste: "REF [Artes Marciais] oposto ao atacante — reação"

Fintar:
  descricao: "Distrai o alvo; ele não é capaz de reagir até seu próximo turno."
  teste: "PRE [Artes Marciais] contra VON [Artes Marciais ou Lábia] do alvo"

Imobilizar:
  descricao: "Imobiliza o alvo; ele não pode realizar ações enquanto você o mantiver nesta condição."
  teste: "VIG [Artes Marciais] contra FOR [Artes Marciais ou Atletismo] do alvo"

Aparar (reação):
  descricao: "Ao sofrer um ataque corpo a corpo, pode tentar apará-lo com uma reação; sucesso: metade do dano e pode realizar uma manobra de combate da qual seja proficiente contra o opositor."
  teste: "REF [Artes Marciais] oposto ao ataque — reação [1]"
  requisito: "Requer Artes Marciais lv.2"  ← no change needed
```

### Atletismo — Replacements

```
Investida:
  descricao: "Ao realizar um ataque logo após uma ação de movimento, causa dano adicional igual ao bônus em Atletismo."
  teste: "Passiva — dano adicional = bônus em Atletismo"

Prontidão:
  descricao: "Se não realizar nenhuma ação de movimento neste turno, recebe uma reação adicional até o início do próximo turno."
  teste: "Passiva — condicional: sem movimentação no turno"

Fôlego:
  descricao: "Se não realizar nenhuma ação padrão neste turno, recebe Velocidade +1 até o final da cena."
  teste: "Passiva — condicional: sem ação padrão no turno"

Disparar (reação):
  descricao: "Utiliza uma reação para ter uma movimentação extra; pode ser apenas se movimentar ou uma ação que exija teste de [Atletismo]."
  teste: "REF [Atletismo] (se exigido pela ação) — movimentação extra — reação [1]"
  requisito: "Requer Atletismo lv.1"  ← no change needed
```

### Esgrima — Replacements

```
Armas Leves:
  descricao: "Proficiente no uso de armas pequenas como facas, adagas e punhais; podem ser escondidas com facilidade e são usadas com Reflexos."
  teste: "Passiva — desbloqueia uso sem penalidade"  ← no change needed

Uma Mão:
  descricao: "Proficiente em armas de médio porte empunhadas com uma mão, como espadas e machados; permitem o uso de escudo ou segunda arma leve e são usadas com Força."
  teste: "Passiva — desbloqueia uso sem penalidade"  ← no change needed

Duas Mãos:
  descricao: "Proficiente no uso de armas grandes empunhadas com as duas mãos, como montantes (usados com Força) e lanças (usadas com Reflexos)."
  teste: "Passiva — desbloqueia uso sem penalidade"  ← no change needed

Especialização:
  descricao: "Especialista em uma arma em que já é proficiente; ao atacar com ela, causa +2 de dano adicional."
  teste: "Passiva — +2 dano ao atacar com a arma escolhida"

Mestria:
  descricao: "Mestre em uma arma em que já é especialista; ao atacar com ela, causa +5 de dano adicional."
  teste: "Passiva — +5 dano ao atacar com a arma escolhida"

Contra-atacar (reação):
  descricao: "Se o alvo errar um ataque contra você, pode utilizar uma reação para realizar um ataque corpo a corpo contra ele."
  teste: "REF [Esgrima] oposto ao atacante — reação [1]"
  requisito: "Requer Esgrima lv.2"  ← no change needed
```

### Furtividade — Replacements

```
Ataque Furtivo:
  descricao: "Aumenta a acuidade dos golpes: ao realizar um ataque surpresa, adiciona o bônus de Furtividade no teste de ataque."
  teste: "Passiva — adiciona bônus em Furtividade no teste de ataque surpresa"

Ataque Letal:
  descricao: "Aumenta a letalidade dos golpes: ao acertar um ataque surpresa, causa dano adicional igual ao bônus em Furtividade."
  teste: "Passiva — dano adicional = bônus em Furtividade ao acertar ataque surpresa"

Ataque Silencioso:
  descricao: "Aumenta a capacidade de permanecer oculto após atacar: após um ataque surpresa, pode fazer outro teste para se esconder sem gastar ações; sucesso: localização não é revelada."
  teste: "REF [Furtividade] para se esconder após ataque surpresa — sem custo de ação"

Esquivar (reação):
  descricao: "Ao sofrer um ataque, pode tentar esquivar-se com uma reação; sucesso: não sofre dano."
  teste: "REF [Furtividade] oposto ao ataque — sucesso: sem dano — reação [1]"
  requisito: "Requer Furtividade lv.1"  ← no change needed
```

### Pontaria — Replacements

```
Arcos:
  descricao: "Proficiente no uso de arcos curtos (usados com Reflexos) e arcos longos (usados com Força)."
  teste: "Passiva — desbloqueia uso sem penalidade"  ← no change needed

Arremesso:
  descricao: "Proficiente no uso de armas de arremesso; adagas são usadas com Reflexos e machados são usados com Força."
  teste: "Passiva — desbloqueia uso sem penalidade"  ← no change needed

Condutores:
  descricao: "Proficiente no uso de condutores mágicos como varinhas e cajados, usados com Razão ou Presença."
  teste: "Passiva — desbloqueia uso sem penalidade"  ← no change needed

Especialização:
  descricao: "Especialista em uma arma em que já é proficiente; ao atacar com ela, causa +2 de dano adicional."
  teste: "Passiva — +2 dano ao atacar com a arma escolhida"

Mestria:
  descricao: "Mestre em uma arma em que já é especialista; ao atacar com ela, causa +5 de dano adicional."
  teste: "Passiva — +5 dano ao atacar com a arma escolhida"

Mirar (reação):
  descricao: "Pode não usar a reação para permanecer mirando; recebe vantagem (+1d20) no próximo teste de Pontaria e, em caso de sucesso, causa dano adicional igual ao valor em Pontaria."
  teste: "Reação [1] — vantagem (+1d20) no próximo teste de [Pontaria] + dano adicional = valor em Pontaria no sucesso"
  requisito: "Requer Pontaria lv.2"  ← no change needed
```

---

## Items Already Correct — No Change Needed

These fields in `proficiencias.ts` match the docx and must not be altered:

| Proficiência | Fields Correct |
|---|---|
| Artes Marciais — Aparar (reação) | `requisito` ("Requer Artes Marciais lv.2") |
| Atletismo — Disparar (reação) | `requisito` ("Requer Atletismo lv.1") |
| Esgrima — Armas Leves | `teste` ("Passiva — desbloqueia uso sem penalidade") |
| Esgrima — Uma Mão | `teste` ("Passiva — desbloqueia uso sem penalidade") |
| Esgrima — Duas Mãos | `teste` ("Passiva — desbloqueia uso sem penalidade") |
| Esgrima — Contra-atacar (reação) | `requisito` ("Requer Esgrima lv.2") |
| Furtividade — Esquivar (reação) | `requisito` ("Requer Furtividade lv.1") |
| Pontaria — Arcos | `teste` ("Passiva — desbloqueia uso sem penalidade") |
| Pontaria — Arremesso | `teste` ("Passiva — desbloqueia uso sem penalidade") |
| Pontaria — Condutores | `teste` ("Passiva — desbloqueia uso sem penalidade") |
| Pontaria — Mirar (reação) | `requisito` ("Requer Pontaria lv.2") |
| All `nome` fields | All proficiência names match docx exactly |
| Esgrima/Furtividade — `atributos` arrays | `['FOR', 'REF']` and `['REF']` match docx |
| Artes Marciais/Atletismo/Pontaria — `atributos` | Match docx attribute lists |

---

## Change Count Summary

| Perícia | Proficiências com mudança | Campos alterados |
|---|---|---|
| Artes Marciais | 5 de 6 (todas exceto nomes) | descricao + teste em 5 proficiências |
| Atletismo | 4 de 4 | descricao + teste em todas |
| Esgrima | 5 de 6 (Contra-atacar OK) | descricao em Armas Leves/Uma Mão/Duas Mãos; descricao + teste em Especialização/Mestria |
| Furtividade | 3 de 4 (Esquivar OK) | descricao + teste em Ataque Furtivo, Letal, Silencioso |
| Pontaria | 5 de 6 (Arcos/Arremesso/Condutores teste OK) | descricao em Arcos/Arremesso/Condutores; descricao + teste em Especialização/Mestria/Mirar |
| **Total** | **22 de 22 tocadas** | **~32 field edits** |

---

## Architecture Patterns

### Pattern: Data-only edit in static constant
The entire `proficiencias.ts` file is a single exported `proficiencias` constant of type `ProficienciasMap`. All edits are string replacements inside the `corpo` block (lines 25–87). No functions, no logic, no imports change.

**Recommended structure for the plan:**
- One plan, one task: edit all 32 fields in a single pass through the `corpo` block
- Verify by reading the file back after edit and cross-checking against this RESEARCH.md table
- The app will pick up the new strings at runtime via the existing data import chain

### Project Structure (relevant files only)
```
data/
└── proficiencias.ts   ← only file modified in Phase 5
```

---

## Edge Cases and Risks

### Risk 1: `nome` field includes proficiência type in parentheses
The current file uses `nome: 'Aparar (reação)'`, `nome: 'Disparar (reação)'`, etc. This matches the docx wording. **Do not change names** — they are correct and affect display rendering.

### Risk 2: Esgrima "Uma Mão" vs "Armas de Uma Mão"
The docx paragraph [608] uses "Armas de Uma Mão" as the section header, but the current `nome` field is `'Uma Mão'`. This naming discrepancy predates v1.1 and is **not in scope** to fix. Only fix `descricao` and `teste`.

### Risk 3: Pontaria "Arremesso" vs "Armas de Arremesso"
Similarly, docx [629] uses "Armas de Arremesso" but the current `nome` is `'Arremesso'`. Same rule — name is out of scope.

### Risk 4: TypeScript string quoting
All `descricao` and `teste` values are plain strings. The replacement values in this file do not contain backticks or template literals. Single quotes are used throughout the file. If any replacement text contains an apostrophe (e.g., "não"), it is fine because the file uses single-quoted strings — check for potential escaping issues. The strings "não", "às", "é", etc. are already present in the file and work fine.

### Risk 5: Length increase
Several descriptions get longer (e.g., Prontidão goes from 1 line to 1.5 lines). This is purely a data concern — the UI uses dynamic layout and there is no fixed-length constraint in the `Proficiencia` type or the rendering component. **No layout impact.**

### Risk 6: `descricaoPericias` section (pericias label/descricao)
The `descricao` field at the `PericiaData` level (e.g., `artesMarciais.descricao`) was not flagged in REQUIREMENTS.md for correction. **Do not modify** these higher-level descriptions — only the individual `Proficiencia[]` entries.

---

## Validation Architecture

No automated test infrastructure exists for text content correctness (confirmed by `.planning/codebase/TESTING.md` and `.planning/REQUIREMENTS.md`). Validation is manual:

**Per-proficiência verification checklist:**
1. Read the corrected `proficiencias.ts` corpo block
2. For each proficiência: compare `descricao` against the docx paragraph cited in the "Exact Replacement Values" section above
3. For each proficiência: compare `teste` against the docx paragraph
4. Confirm no `nome`, `requisito`, or other-section field was accidentally modified
5. Run `npx tsc --noEmit` to confirm no TypeScript errors introduced

---

## Environment Availability

Step 2.6 SKIPPED — this phase modifies one static TypeScript data file. No external tools, services, or runtimes beyond the existing project toolchain are required.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | The `nome` fields for "Uma Mão" and "Arremesso" (shortened from docx "Armas de Uma Mão" / "Armas de Arremesso") were intentional prior decisions | Items Already Correct | Low — worst case is a subsequent naming fix phase |
| A2 | Desviar is classified as a reação in the docx (paragraph [582] says "utilizar uma reação") | Artes Marciais docx text | Low — text is explicit |

**All other claims are VERIFIED directly from docx extraction.**

---

## Sources

### Primary (HIGH confidence)
- `magic keos/Magic no Universo Kéos v.0.4.docx` — paragraphs [578]–[638] extracted via Python zipfile + xml.etree.ElementTree; full text confirmed
- `data/proficiencias.ts` — current state read directly (lines 24–87)
- `.planning/REQUIREMENTS.md` — FIDE-01 through FIDE-05 requirements

### Secondary
- `GAME_RULES.md` §5 — cross-reference for atributos lists (confirmed consistent with docx)

---

## Metadata

**Confidence breakdown:**
- Docx text (exact rules): HIGH — extracted verbatim from the source file
- Current code state: HIGH — read directly from proficiencias.ts
- Comparison (wrong vs correct): HIGH — diff performed field by field

**Research date:** 2026-05-16
**Valid until:** Until docx v0.4 is superseded by a newer version
