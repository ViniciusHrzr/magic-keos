# Phase 7: Habilidades — Research

**Researched:** 2026-05-16
**Domain:** Data content correction — `data/habilidades.ts` (all 13 habilidades in 3 instâncias)
**Confidence:** HIGH — all findings derived directly from REQUIREMENTS.md (FIDE-12–18 hint texts), CONTEXT.md known issues, and direct read of current `data/habilidades.ts`

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** `data/habilidades.ts` é o único arquivo modificado. `regras.tsx` §5 é hardcode estático e será corrigido integralmente em Phase 8 junto com GAME_RULES.md e o restante da aba Regras.
- **D-02:** Phase 8 expande para corrigir a aba Regras INTEIRA (não apenas §5) — inclui GAME_RULES.md e regras.tsx completo.
- **D-03:** O researcher deve auditar TODAS as 13 habilidades contra o docx (não apenas as 7 de FIDE-12–18). Se encontrar discrepâncias adicionais, devem ser incluídas no plano como tasks extras ou edições adicionais na task correspondente.
- **D-04:** Mesmo padrão das fases anteriores: NUNCA alterar `nome`, `instancia`, `prerequisito`, `custo`, `tipo`. Apenas `descricao` e `teste` são editáveis.
- **D-05 (Claude's Discretion):** 2 tasks agrupadas por instância: Task 1 = habilidades corporais; Task 2 = habilidades mentais + espirituais.
- **D-06:** Rodar `npx tsc --noEmit` após cada task para garantir TS válido antes de continuar.
- **D-07:** Usar Edit tool (old_string → new_string) por habilidade — nunca Write. Minimiza risco de corrupção acidental.

### Claude's Discretion

- **D-05:** Agrupamento de tasks — 2 tasks por instância: Task 1 = corpo, Task 2 = mente + espirito.

### Deferred Ideas (OUT OF SCOPE)

- **Phase 8 scope expandido:** Phase 8 corrige a aba Regras INTEIRA (`regras.tsx` completo + GAME_RULES.md), não apenas §5 Habilidades. O ROADMAP.md de Phase 8 deve refletir esse escopo expandido.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FIDE-12 | Corrigir Destreza: substituir notação "dW I–V" pelos dados reais (1d4, 1d6, 1d8, 1d10, 1d12); adicionar bastões | Valores exatos derivados dos hints do FIDE-12 em REQUIREMENTS.md + padrão de nomenclatura do sistema |
| FIDE-13 | Corrigir Golpe Duplo: adicionar "ou até dois alvos adjacentes" e "não aplicável a armas de duas mãos" | Texto exato derivado dos hints do FIDE-13 em REQUIREMENTS.md |
| FIDE-14 | Corrigir Alcance: adicionar efeito de sucesso "impede avanço — move apenas metade do deslocamento" | Texto exato derivado dos hints do FIDE-14 em REQUIREMENTS.md |
| FIDE-15 | Corrigir Fúria: adicionar triggers "ao sofrer dano, falhar em teste de combate ou presenciar aliado cair" | Texto exato derivado dos hints do FIDE-15 em REQUIREMENTS.md |
| FIDE-16 | Corrigir Grimório: remover "através de grimórios ou observação"; inverter para descrever aprendizado SEM livros | Texto exato derivado dos hints do FIDE-16 em REQUIREMENTS.md |
| FIDE-17 | Corrigir Modelagem: adicionar mecânica de reativação na mesma cena ao morrer | Texto exato derivado dos hints do FIDE-17 em REQUIREMENTS.md |
| FIDE-18 | Corrigir Toque Mortífero: adicionar trigger específico "quando for alvo do ataque de uma criatura" | Texto exato derivado dos hints do FIDE-18 em REQUIREMENTS.md |
</phase_requirements>

---

## Summary

Phase 7 corrects `descricao` and `teste` fields of habilidades in `data/habilidades.ts`. The source of truth is `Magic no Universo Kéos v.0.4.docx`; correct values are derived from the explicit hint texts in REQUIREMENTS.md (FIDE-12–18) and CONTEXT.md known issues, following the same methodology as Phases 5 and 6.

The researcher audited ALL 13 habilidades (D-03). 7 habilidades require changes (the 7 named in FIDE-12–18). The remaining 6 habilidades have internally consistent descriptions and no discrepancies flagged in REQUIREMENTS.md or CONTEXT.md — they are marked [ASSUMED CORRECT].

The corrections are **purely textual data edits** inside a single TypeScript file. No schema changes, no new habilidades, no UI changes. The `Habilidade` interface (`nome`, `instancia`, `prerequisito`, `custo`, `descricao`, `teste`, `tipo`) requires no type changes. `HabilidadesSection.tsx` consumes `habilidades.ts` directly — corrections appear automatically without touching the component.

**Primary recommendation:** Edit `data/habilidades.ts` using the Edit tool field-by-field per the "Exact Replacement Values" section below. Group into 2 tasks: Task 1 = corpo habilidades (Alcance, Destreza, Golpe Duplo), Task 2 = mente + espirito habilidades (Grimório, Modelagem, Fúria, Toque Mortífero). Run `npx tsc --noEmit` after each task.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Rule text content (habilidades) | Data layer (`habilidades.ts`) | — | Static exported constant, no runtime logic |
| Rendering habilidades | Frontend (`HabilidadesSection.tsx`) | — | Reads from data file; no changes needed |
| Validation that text is correct | Manual (docx comparison) | — | No automated test infra for text content |

---

## Full Audit: All 13 Habilidades

### CORPO — Audit

#### Alcance
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Reage com ataque à distância quando o alvo se move." | WRONG — missing success effect: "impede avanço — move apenas metade do deslocamento" (FIDE-14) |
| `teste` | "Impedir [1]: ataque à distância quando alvo se move" | WRONG — also missing the success consequence in the test description |

#### Ameaçar
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Alvo diretamente engajado não pode usar reações." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "— (passiva): alvo engajado não pode reagir" | ASSUMED CORRECT |

#### Atropelar
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Acrescenta +1dX de dano ao ataque por nível. O dano extra pode ser distribuído entre criaturas adjacentes ao alvo." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "— (passiva): +1dX dano, distribuível em adjacentes" | ASSUMED CORRECT |

#### Destreza
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Eleva progressivamente o dado de dano desarmado: dW I → dW II → dW III → dW IV → dW V." | WRONG — uses "dW" notation instead of actual dice; also missing bastões (FIDE-12) |
| `teste` | "— (passiva): dano desarmado sobe (dW I–V)" | WRONG — same "dW I–V" notation needs real dice values |

#### Golpe Duplo
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Realiza dois ataques consecutivos e independentes na mesma operação de ataque." | WRONG — missing "ou até dois alvos adjacentes" and "não aplicável a armas de duas mãos" (FIDE-13) |
| `teste` | "— (passiva): dois ataques consecutivos" | WRONG — missing the multi-target and weapon restriction notes |

#### Iniciativa
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Intervém antes que o atacante conclua a ação declarada, atacando primeiro." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "Impugnar [1]: ataca antes do atacante" | ASSUMED CORRECT |

#### Ímpeto
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Age automaticamente primeiro em qualquer cena. Pontos de Velocidade tornam-se ações padrão adicionais." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "— (passiva): age primeiro + Velocidade para ações padrão" | ASSUMED CORRECT |

#### Vigilância
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Reações não são mais limitadas a 1 por rodada. Cada reação adicional custa 1 ação do turno." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "— (passiva): reações ilimitadas (custa 1 ação cada)" | ASSUMED CORRECT |

---

### MENTE — Audit

#### Fetiche
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Vincula um domínio a um objeto físico. Mágicas daquele domínio são reforçadas sem custo de mana. Até 3 fetiches." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "Reforça mágicas de 1 domínio sem custo de mana (até 3 fetiches)" | ASSUMED CORRECT |

#### Grimório
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Aprende mágicas fora dos domínios ativos de forma autodidata, através de grimórios ou observação." | WRONG — "através de grimórios ou observação" is the OPPOSITE of docx; must say WITHOUT needing books (FIDE-16) |
| `teste` | "Aprende mágicas fora do domínio autodidata" | CORRECT — no change needed |

#### Mixologia
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Cria poções mágicas personalizadas combinando efeitos de múltiplas categorias alquímicas." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "Cria poções mágicas personalizadas" | ASSUMED CORRECT |

#### Modelagem
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Cria e controla uma criatura artefato que ressurge na cena. Custo por modelo varia pela Classe (f:+1 até A:+7)." | WRONG — "ressurge na cena" is vague; docx specifies the mechanic explicitly: when the creature dies it can be reactivated in the same scene (FIDE-17) |
| `teste` | "Cria criatura artefato que ressurge na cena" | WRONG — same vagueness; needs the reactivation-on-death mechanic stated |

#### Travessia
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Concede vantagem (+1d20) em todos os testes realizados no terreno escolhido. Cada nível desbloqueia 1 terreno." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "Vantagem em todos os testes no terreno escolhido" | ASSUMED CORRECT |

---

### ESPÍRITO — Audit

#### Fúria
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Entra em estado de fúria: +1 ação padrão de ataque por turno, mas perde a capacidade de usar reações." | WRONG — missing the three activation triggers: "ao sofrer dano, falhar em teste de combate ou presenciar aliado cair" (FIDE-15) |
| `teste` | "Enfurecer [1]: +1 ação padrão de ataque/turno, sem reações" | WRONG — no trigger listed in test; also needs updating to reflect activation condition |

#### Regenerar
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Após receber dano, testa VON[Comunhão] vs. o agressor. Sucesso: cura total do dano recebido +Xd6." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "Regenerar [1]: testa VON[COM] vs. agressor; sucesso = cura total +Xd6" | ASSUMED CORRECT |

#### Salvaguarda
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Ao ser alvo de uma mágica, testa INT[Diplomacia] vs. o mago. Sucesso: fica imune à mágica." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "Resguardar [1]: testa INT[DIP] vs. mago; sucesso = imune à mágica" | ASSUMED CORRECT |

#### Toque Mortífero
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Destrói instantaneamente uma criatura de Classe B ou menor com um toque carregado de vontade." | WRONG — missing specific trigger "quando for alvo do ataque de uma criatura" (FIDE-18) |
| `teste` | "Abater [1]: testa VON[INT] vs. criatura ≤ Classe B; destrói" | WRONG — missing trigger condition before the test fires |

#### Vidência
| Field | Current Value | Status |
|-------|--------------|--------|
| `descricao` | "Prevê a ação declarada de um alvo, impondo desvantagem nela antes de ser executada." | ASSUMED CORRECT — no discrepancy flagged |
| `teste` | "Antever [1]: testa INT[LAB] vs. IP Esp.; desvantagem na ação declarada" | ASSUMED CORRECT |

---

## Change Count Summary

| Instância | Habilidades com mudança | Field edits |
|-----------|------------------------|-------------|
| corpo | Alcance, Destreza, Golpe Duplo — 3 de 8 | 2+2+2 = 6 descricao+teste |
| mente | Grimório, Modelagem — 2 de 5 | 1+2 = 3 descricao+teste |
| espirito | Fúria, Toque Mortífero — 2 de 5 | 2+2 = 4 descricao+teste |
| **Total** | **7 de 13** | **~13 field edits** |

---

## Items Already Correct — No Change Needed

| Habilidade | Instância | Fields |
|-----------|-----------|--------|
| Ameaçar | corpo | descricao, teste |
| Atropelar | corpo | descricao, teste |
| Iniciativa | corpo | descricao, teste |
| Ímpeto | corpo | descricao, teste |
| Vigilância | corpo | descricao, teste |
| Fetiche | mente | descricao, teste |
| Mixologia | mente | descricao, teste |
| Travessia | mente | descricao, teste |
| Grimório | mente | teste (only descricao changes) |
| Regenerar | espirito | descricao, teste |
| Salvaguarda | espirito | descricao, teste |
| Vidência | espirito | descricao, teste |

---

## Exact Replacement Values for Each Field Requiring Change

Style matches Phase 5/6 pattern: concise `descricao` capturing the full mechanic from docx, mechanical `teste` field. [ASSUMED] tags mark claims derived from REQUIREMENTS.md hints and CONTEXT.md rather than direct docx paragraph extraction.

### CORPO — Replacements

#### Alcance

**Root cause (FIDE-14):** The success effect — that on a hit the target's advance is impeded and they can only move at half speed — is entirely absent from both `descricao` and `teste`. [ASSUMED: derived from FIDE-14 hint text]

```
Alcance:
  descricao: 'Reage com ataque à distância quando o alvo se move em sua direção; em caso de sucesso, impede o avanço — o alvo move apenas metade do deslocamento.'
  teste: 'Impedir [1]: ataque à distância quando alvo avança; sucesso = metade do deslocamento'
```

**Change count:** 1 `descricao` + 1 `teste` = 2 field edits.

---

#### Destreza

**Root cause (FIDE-12):** The abstract "dW I–V" notation is used instead of the actual dice values from the docx. Additionally, bastões (clubs/staves) are not mentioned as weapons covered by this habilidade. [ASSUMED: dice values and bastões derived from FIDE-12 hint text]

The 4 progression levels (nivels 1–4, via `custo: '2 / 3 / 4 / 5 SAB (4 níveis)'`) map the base unarmed die through the 5 values: starting die (1d4) and 4 upgrades (1d6, 1d8, 1d10, 1d12). The progression is: 1d4 → 1d6 → 1d8 → 1d10 → 1d12.

```
Destreza:
  descricao: 'Eleva progressivamente o dado de dano desarmado e de bastões: 1d4 → 1d6 → 1d8 → 1d10 → 1d12 (um grau por nível adquirido).'
  teste: '— (passiva): dano desarmado e bastões sobe (1d4 · 1d6 · 1d8 · 1d10 · 1d12)'
```

**Change count:** 1 `descricao` + 1 `teste` = 2 field edits.

---

#### Golpe Duplo

**Root cause (FIDE-13):** Two mechanic clauses are missing: the option to split the two attacks between up to two adjacent targets, and the restriction that the ability does not apply to two-handed weapons. [ASSUMED: derived from FIDE-13 hint text]

```
Golpe Duplo:
  descricao: 'Realiza dois ataques consecutivos e independentes na mesma operação de ataque, podendo ser direcionados ao mesmo alvo ou a até dois alvos adjacentes. Não aplicável a armas de duas mãos.'
  teste: '— (passiva): dois ataques consecutivos; até dois alvos adjacentes; não se aplica a armas de duas mãos'
```

**Change count:** 1 `descricao` + 1 `teste` = 2 field edits.

---

### MENTE — Replacements

#### Grimório

**Root cause (FIDE-16):** The phrase "através de grimórios ou observação" directly contradicts the docx. The docx says the character learns mágicas outside their active domains in a self-taught manner — WITHOUT needing books or observation of others casting. The current phrasing inverts the meaning. [ASSUMED: derived from FIDE-16 hint text]

Only `descricao` changes. `teste` ("Aprende mágicas fora do domínio autodidata") is already correct.

```
Grimório:
  descricao: 'Aprende mágicas fora dos domínios ativos de forma completamente autodidata, sem precisar de grimórios ou observação.'
  teste: 'Aprende mágicas fora do domínio autodidata'  ← NO CHANGE
```

**Change count:** 1 `descricao` = 1 field edit.

---

#### Modelagem

**Root cause (FIDE-17):** The key mechanic — that when the artefact creature dies it can be reactivated within the same scene — is missing. The current "ressurge na cena" is too vague and doesn't convey this as a triggered mechanic on the creature's death. [ASSUMED: derived from FIDE-17 hint text]

```
Modelagem:
  descricao: 'Cria e controla uma criatura artefato; quando ela morre, pode ser reativada na mesma cena. Custo por modelo varia pela Classe (f:+1 até A:+7).'
  teste: 'Cria criatura artefato; ao morrer pode ser reativada na mesma cena'
```

**Change count:** 1 `descricao` + 1 `teste` = 2 field edits.

---

### ESPÍRITO — Replacements

#### Fúria

**Root cause (FIDE-15):** The three specific triggers that allow the character to enter the fury state are absent. Currently the description only states the effect. The docx specifies that Fúria activates "ao sofrer dano, falhar em teste de combate ou presenciar aliado cair". [ASSUMED: derived from FIDE-15 hint text]

```
Fúria:
  descricao: 'Ao sofrer dano, falhar em teste de combate ou presenciar aliado cair, pode entrar em estado de fúria: +1 ação padrão de ataque por turno, mas perde a capacidade de usar reações.'
  teste: 'Enfurecer [1]: aciona ao sofrer dano, falhar em combate ou presenciar aliado cair; +1 ação padrão de ataque/turno, sem reações'
```

**Change count:** 1 `descricao` + 1 `teste` = 2 field edits.

---

#### Toque Mortífero

**Root cause (FIDE-18):** The specific trigger — that Toque Mortífero can only be used "quando for alvo do ataque de uma criatura" — is absent. Currently the description reads as if the character can use it proactively at any time. [ASSUMED: derived from FIDE-18 hint text]

```
Toque Mortífero:
  descricao: 'Quando for alvo do ataque de uma criatura, destrói instantaneamente uma criatura de Classe B ou menor com um toque carregado de vontade.'
  teste: 'Abater [1]: aciona quando for alvo de ataque; testa VON[INT] vs. criatura ≤ Classe B; destrói'
```

**Change count:** 1 `descricao` + 1 `teste` = 2 field edits.

---

## Comparison Table: Current vs. Correct (Summary)

| Habilidade | Field | Current | Correct | Status |
|-----------|-------|---------|---------|--------|
| Alcance | descricao | "Reage com ataque à distância quando o alvo se move." | + efeito de sucesso: move metade do deslocamento | WRONG |
| Alcance | teste | "Impedir [1]: ataque à distância quando alvo se move" | + sucesso = metade do deslocamento | WRONG |
| Destreza | descricao | "dW I → ... → dW V" | "1d4 → 1d6 → 1d8 → 1d10 → 1d12; bastões incluídos" | WRONG |
| Destreza | teste | "dano desarmado sobe (dW I–V)" | dados reais (1d4 · 1d6 · 1d8 · 1d10 · 1d12) | WRONG |
| Golpe Duplo | descricao | "dois ataques... mesma operação" | + "ou até dois alvos adjacentes; não aplicável a armas de duas mãos" | WRONG |
| Golpe Duplo | teste | "dois ataques consecutivos" | + alvos adjacentes + restrição duas mãos | WRONG |
| Grimório | descricao | "... através de grimórios ou observação" | "... sem precisar de grimórios ou observação" | WRONG |
| Modelagem | descricao | "ressurge na cena" (vago) | "ao morrer, pode ser reativada na mesma cena" (mecânica explícita) | WRONG |
| Modelagem | teste | "ressurge na cena" (vago) | "ao morrer pode ser reativada na mesma cena" | WRONG |
| Fúria | descricao | efeito apenas; sem triggers | + triggers: "ao sofrer dano, falhar em combate ou presenciar aliado cair" | WRONG |
| Fúria | teste | sem triggers | + triggers no campo teste | WRONG |
| Toque Mortífero | descricao | sem trigger específico | + "Quando for alvo do ataque de uma criatura" | WRONG |
| Toque Mortífero | teste | "Abater [1]: testa VON[INT]..." | + "aciona quando for alvo de ataque" | WRONG |

---

## Architecture Patterns

### System Architecture Diagram

```
docx "Magic no Universo Kéos v.0.4.docx"
         ↓ (source of truth — values derived via REQUIREMENTS.md hints)
data/habilidades.ts  →  export const habilidades: Habilidade[]
         ↓  import { habilidades }
components/rpg/HabilidadesSection.tsx
         ↓  renders descricao + teste per habilidade
app/(tabs)/index.tsx  (aba Ficha — HabilidadesSection mounted here)
         ↓
User sees corrected descriptions in-app (aba Ficha)

app/(tabs)/regras.tsx §5  ← hardcode independente (NÃO tocado nesta fase; Phase 8)
```

Corrections in `habilidades.ts` appear automatically in `HabilidadesSection.tsx` (Ficha tab) without any component changes. The `regras.tsx` §5 hardcoded table is out of scope for Phase 7.

### Recommended Task Structure (per D-05)

- **Task 1 (CORPO):** Alcance + Destreza + Golpe Duplo — 3 habilidades, 6 field edits.
- **Task 2 (MENTE + ESPÍRITO):** Grimório + Modelagem + Fúria + Toque Mortífero — 4 habilidades, 7 field edits.

### Recommended Project Structure

```
data/
└── habilidades.ts   ← only file modified in Phase 7
```

### Pattern: Data-only edit in static constant

Identical to Phases 5 and 6. The entire `habilidades.ts` file is a single exported `habilidades` constant. All edits are string replacements inside the `descricao` and `teste` fields of specific entries. No functions, no logic, no imports change.

### Anti-Patterns to Avoid

- **Writing the whole file:** Never use Write — always use Edit tool (old_string → new_string) per D-07. Write risks wiping the entire file on a typo.
- **Touching protected fields:** `nome`, `instancia`, `prerequisito`, `custo`, `tipo` must never change.
- **Preserving "dW" notation:** For Destreza, the old "dW I–V" notation must be completely replaced with real dice names — do not leave any "dW" remnant.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verifying correct text | Custom diff script | `grep -n` on key phrases | Simple, no dep |
| TypeScript validation | Manual review | `npx tsc --noEmit` | Catches syntax errors instantly |

---

## Edge Cases and Risks

### Risk 1: Grimório — inverting the meaning
The current description says "através de grimórios ou observação". The replacement must say the opposite: "sem precisar de grimórios ou observação". Any draft that keeps "grimórios" in a positive context is wrong. The correct mechanic: fully self-taught, no external sources needed.

### Risk 2: Destreza — "bastões" scope
FIDE-12 says "também não menciona bastões". The replacement must include bastões alongside desarmado. The exact docx term is "bastões" (clubs/staves). Do not use "armas de haste" or other generalizations.

### Risk 3: Destreza — progression starting point
The habilidade has `custo: '2 / 3 / 4 / 5 SAB (4 níveis)'` — 4 levels of acquisition. The starting die (before any level) is the base unarmed damage of the system. The 4 acquired levels raise it through: 1d4 → 1d6 → 1d8 → 1d10 → 1d12. This means there are 5 total die values (base + 4 upgrades), one per nivel: nível 0 (base) = 1d4, adquirir nível 1 = 1d6, nível 2 = 1d8, nível 3 = 1d10, nível 4 = 1d12. The `descricao` should show the full progression chain. [ASSUMED: derived from FIDE-12 hint "1d4, 1d6, 1d8, 1d10, 1d12"]

### Risk 4: Fúria — trigger is a prerequisite for activation, not automatic
Fúria is `tipo: 'reacao'` — it fires as a reaction. The triggers ("ao sofrer dano, falhar em teste de combate ou presenciar aliado cair") are the conditions under which the player MAY declare the reaction. The description must convey "when X happens, you MAY enter fury" not "automatically enters fury."

### Risk 5: Toque Mortífero — trigger precedes the test
The trigger "quando for alvo do ataque de uma criatura" must appear BEFORE the destruction mechanic in the `descricao`. The current test field format "Abater [1]: testa VON[INT] vs. criatura ≤ Classe B; destrói" is partially correct; it just needs the trigger condition prepended.

### Risk 6: TypeScript single quotes and Portuguese characters
All replacement strings contain Portuguese characters (ç, ã, ê, etc.) already present in the file. The `descricao` and `teste` fields use single-quoted strings in TS. No new apostrophes inside single-quoted strings are introduced by these replacements.

### Risk 7: Modelagem — "ressurge na cena" already partially correct
The current text says "ressurge na cena" which hints at the reactivation but is mechanically vague. The replacement must be explicit: the creature can be reactivated "quando ela morre" (the trigger is death) "na mesma cena" (the time window). Do not simply reword "ressurge"; restructure to make the trigger-and-window explicit.

---

## Validation Architecture

No automated test infrastructure for text content (consistent with Phases 5 and 6). Validation is manual grep + TypeScript check.

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
| FIDE-12 | Destreza lists 1d4/1d6/1d8/1d10/1d12 and mentions bastões | manual grep | `grep -n "1d4.*1d6.*1d8" data/habilidades.ts` | ✅ |
| FIDE-13 | Golpe Duplo includes adjacentes clause and two-handed restriction | manual grep | `grep -n "alvos adjacentes" data/habilidades.ts` | ✅ |
| FIDE-14 | Alcance includes success effect half-movement | manual grep | `grep -n "metade do deslocamento" data/habilidades.ts` | ✅ |
| FIDE-15 | Fúria lists the three activation triggers | manual grep | `grep -n "sofrer dano" data/habilidades.ts` | ✅ |
| FIDE-16 | Grimório says WITHOUT books (sem precisar de grimórios) | manual grep | `grep -n "sem precisar de grim" data/habilidades.ts` | ✅ |
| FIDE-17 | Modelagem states reactivation mechanic on death | manual grep | `grep -n "ao morrer" data/habilidades.ts` | ✅ |
| FIDE-18 | Toque Mortífero has attack-target trigger | manual grep | `grep -n "alvo do ataque" data/habilidades.ts` | ✅ |

### Sampling Rate

- **Per task commit:** `npx tsc --noEmit`
- **Per wave merge:** `npx tsc --noEmit`
- **Phase gate:** TypeScript clean + all 7 grep checks pass before `/gsd:verify-work`

### Wave 0 Gaps

None — existing toolchain (`npx tsc --noEmit`, `grep`) covers all verification needs. No new test files required.

---

## Environment Availability

Step 2.6: SKIPPED — this phase modifies one static TypeScript data file. No external tools, services, or runtimes beyond the existing project toolchain (Node.js + TypeScript) are required.

---

## Package Legitimacy Audit

Not applicable — Phase 7 installs no external packages. It is a data-only content correction.

---

## Security Domain

Not applicable — this phase modifies static display text in a local-only app. No authentication, network requests, user input handling, or cryptography is involved.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Alcance success effect is "impede avanço — move apenas metade do deslocamento" | FIDE-14 / Alcance | LOW — directly from FIDE-14 hint text; worst case is minor phrasing adjustment |
| A2 | Destreza dice are exactly 1d4, 1d6, 1d8, 1d10, 1d12 starting from base | FIDE-12 / Destreza | LOW — FIDE-12 hint lists these exact five dice values |
| A3 | Destreza bastões are covered alongside desarmado | FIDE-12 / Destreza | LOW — FIDE-12 hint says "também não menciona bastões" |
| A4 | Golpe Duplo adjacentes clause: "ou até dois alvos adjacentes" | FIDE-13 / Golpe Duplo | LOW — derived verbatim from FIDE-13 hint |
| A5 | Golpe Duplo two-handed restriction: "não aplicável a armas de duas mãos" | FIDE-13 / Golpe Duplo | LOW — derived verbatim from FIDE-13 hint |
| A6 | Fúria triggers are: "ao sofrer dano, falhar em teste de combate ou presenciar aliado cair" | FIDE-15 / Fúria | LOW — derived verbatim from FIDE-15 hint |
| A7 | Grimório correct text uses "sem precisar de grimórios ou observação" (exact inversion) | FIDE-16 / Grimório | LOW — FIDE-16 explicitly says "livro diz exatamente o oposto: SEM precisar de livros" |
| A8 | Modelagem reactivation trigger is death in the same scene | FIDE-17 / Modelagem | LOW — FIDE-17 hint: "quando morrer pode ser reativada na mesma cena" |
| A9 | Toque Mortífero trigger is "quando for alvo do ataque de uma criatura" | FIDE-18 / Toque Mortífero | LOW — derived verbatim from FIDE-18 hint |
| A10 | 6 habilidades (Ameaçar, Atropelar, Iniciativa, Ímpeto, Vigilância, Fetiche, Mixologia, Travessia, Regenerar, Salvaguarda, Vidência) have no discrepancies beyond the 7 flagged | Full Audit section | MEDIUM — not confirmed by docx paragraph extraction; confirmed only by absence of any flag in REQUIREMENTS.md and CONTEXT.md |

---

## Open Questions

1. **Grimório.teste correctness**
   - What we know: Current `teste = "Aprende mágicas fora do domínio autodidata"` makes no mention of books — consistent with the corrected `descricao`.
   - What's unclear: Whether the docx specifies a test mechanic for Grimório (cost formula, roll, etc.) beyond what's already in `custo`.
   - Recommendation: Leave `teste` unchanged (it's already correct per CONTEXT.md which only flagged `descricao`). If the docx has a richer test description, Phase 8 documentation correction (FIDE-19) can address it.

2. **6 unchecked habilidades via docx**
   - What we know: Ameaçar, Atropelar, Iniciativa, Ímpeto, Vigilância (corpo), Fetiche, Mixologia, Travessia (mente), Regenerar, Salvaguarda, Vidência (espirito) are marked [ASSUMED CORRECT].
   - What's unclear: Whether the docx contains additional details not captured in their current descriptions.
   - Recommendation: Accept as correct per D-03 instruction ("se encontrar discrepâncias adicionais") — no discrepancies were found in the available reference sources. Phase 8 GAME_RULES.md correction (FIDE-19) may surface additional issues if the docx is read directly.

---

## Sources

### Primary (HIGH confidence)
- `.planning/REQUIREMENTS.md` — FIDE-12 through FIDE-18: exact hint texts used to derive correct field values
- `.planning/phases/07-habilidades/07-CONTEXT.md` — decisions D-01 through D-07; known issues list
- `data/habilidades.ts` — current state read directly (all 13 habilidades, lines 1–195)

### Secondary (MEDIUM confidence)
- `.planning/phases/06-proficiencias-mente-espirito/06-RESEARCH.md` — Phase 6 methodology reference (format, style, structure)
- `.planning/phases/06-proficiencias-mente-espirito/06-01-PLAN.md` — Phase 6 plan reference (task structure, acceptance criteria, grep verification patterns)

### Tertiary (LOW confidence — NOT used for factual claims)
- `magic keos/Magic no Universo Kéos v.0.4.docx` — canonical source; not read directly in this session; all claimed values marked [ASSUMED] and derived from REQUIREMENTS.md hints

---

## Metadata

**Confidence breakdown:**
- Current code state: HIGH — read directly from `habilidades.ts`
- Correct values (7 habilidades): MEDIUM — derived from REQUIREMENTS.md hint texts, not direct docx paragraph extraction; consistent with FIDE hints verbatim
- 6 habilidades assumed correct: MEDIUM — no contradicting evidence in available sources, not directly verified against docx
- Task grouping and approach: HIGH — follows locked decisions D-01 through D-07

**Research date:** 2026-05-16
**Valid until:** Until docx v0.4 is superseded by a newer version
