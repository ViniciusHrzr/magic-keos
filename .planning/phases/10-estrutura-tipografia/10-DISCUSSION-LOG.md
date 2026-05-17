# Phase 10: Estrutura & Tipografia - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-16
**Phase:** 10-estrutura-tipografia
**Areas discussed:** Card anatomy, Header redesign, Hierarquia tipográfica

---

## Card anatomy

### Q1: Como cada seção deve 'flutuar' visualmente?

| Option | Description | Selected |
|--------|-------------|----------|
| Borda completa + borderRadius | borderWidth:1, borderColor: RPG.border, borderRadius: 8, marginHorizontal | |
| Background + borda superior em gold | backgroundColor: RPG.surface, borderTopWidth: 2, borderTopColor: RPG.goldDim | ✓ |
| Sem borda, só background + margem | marginHorizontal: 8, marginVertical: 4 | |

**User's choice:** Background + borda superior em gold
**Notes:** Sem radius, mais sóbrio. A borda superior gold marca cada seção sem o visual "card de app".

---

### Q2: Margem horizontal?

| Option | Description | Selected |
|--------|-------------|----------|
| Sim, margin 8-12px lateral | Cards com respiro das bordas — fundo aparece nas laterais | ✓ |
| Sem margem, full-width | Ocupa toda a largura, só marginVertical separa | |

**User's choice:** Sim, margin 8-12px lateral

---

### Q3: Espaçamento entre cards?

| Option | Description | Selected |
|--------|-------------|----------|
| 6-8px entre cards | Gutter moderado | ✓ |
| 12-16px entre cards | Mais respiro, scroll maior | |
| Sem espaço | Cards colados | |

**User's choice:** 6-8px entre cards

---

### Q4: sectionBody background?

| Option | Description | Selected |
|--------|-------------|----------|
| sectionBody = RPG.surface, header mais escuro | Header RPG.headerBg, contraste sutil | ✓ |
| sectionBody = RPG.surfaceAlt | Body mais claro que header | |
| Header e body com mesmo background | Uniformidade dentro do card | |

**User's choice:** sectionBody = RPG.surface (#181210), header permanece RPG.headerBg (#0d0b08)

---

## Header redesign

### Q1: Tamanhos de sectionTitle e sectionNum

| Option | Description | Selected |
|--------|-------------|----------|
| Title 16px, Num 13px | Escala mínima REG-06 | |
| Title 18px, Num 13px | Mais impacto | |
| Title 16px, Num 16px | Mesma escala | |

**User's choice:** "sem mais perguntas, confio em vc" — Claude's Discretion
**Notes:** Usuário delegou decisões de header redesign inteiramente ao Claude.

---

## Hierarquia tipográfica

### Q1: Sub component — tamanho e uppercase?

| Option | Description | Selected |
|--------|-------------|----------|
| 12px semibold goldLight, manter uppercase | +2px, peso e cor mais brilhante | ✓ |
| 14px semibold goldLight, sem uppercase | Mais parecido com título de parágrafo | |
| 13px semibold goldLight, manter uppercase | Meio-termo | |

**User's choice:** 12px semibold goldLight, manter uppercase

---

### Q2: profTeste — manter azulLight?

| Option | Description | Selected |
|--------|-------------|----------|
| Manter azulLight para profTeste | Distinção semântica de mecânica de teste | ✓ |
| Uniformizar tudo em gold/goldDim | REG-09 estrito | |

**User's choice:** Manter azulLight — cor semântica para mecânica de teste, não label de metadado

---

### Q3: Body lineHeight

| Option | Description | Selected |
|--------|-------------|----------|
| lineHeight 18 universalmente | REG-08 exato em todos os elementos | ✓ |
| lineHeight 20 narrativos, 18 tabelas | Diferenciado por tipo de texto | |

**User's choice:** lineHeight 18 universalmente

---

## Claude's Discretion

- sectionTitle: 16px bold gold (mínimo REG-06)
- sectionNum: 12px goldDim (sobe 1pt, discreto)
- Header quando aberto: backgroundColor muda para RPG.surface, borderBottom 1px goldDim
- Header quando fechado: backgroundColor RPG.headerBg, sem borderBottom
- marginHorizontal exato: 8px
- marginVertical exato: 6px entre cards
- profReq e habPrereq: 10px gold uppercase letterSpacing 0.5 (alinhados ao REG-09)

## Deferred Ideas

- Animação do chevron → Phase 11
- Haptic feedback no header → Phase 11
- Estilo RPG para tabelas (TH/R2/R3) → Phase 11
- Aparência animada aberto vs fechado → Phase 11
