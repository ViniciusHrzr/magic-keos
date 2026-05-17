# Phase 14: inventario-craft-artefatos — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17
**Phase:** 14-inventario-craft-artefatos
**Areas discussed:** Melhoria data model, Stats display nos slots, Craft UI & intuitividade, Drag-drop + tab order + PDFs (visual)

---

## Melhoria Data Model

| Option | Description | Selected |
|--------|-------------|----------|
| Aplica os 3 juntos | Melhoria branca na vestimenta dá +1 Armadura E +1 Diplomacia E +1 Esgrima simultaneamente | |
| Jogador escolhe 1 ao aplicar | App mostra as 3 opções e o jogador seleciona uma | |
| Cada linha é uma melhoria separada | Armadura+1 é uma melhoria, Diplomacia+1 é outra, Esgrima+1 é outra — todas brancas, 3 distintas no picker | ✓ |

**User's choice:** Cada linha é uma melhoria separada.
**Notes:** Implica refatoração completa de `MELHORIAS_POR_SLOT` em `data/regras/equipamentos.ts`. Vestimenta passa de 5 para 15 opções; escudo de 5 para 10; acessório de 5 para 10. Arma já estava correto. Segunda pergunta: pode combinar cores iguais? Resposta: sim, qualquer combinação, só o limite de 3 aplica.

---

## Stats Display nos Slots

| Option | Description | Selected |
|--------|-------------|----------|
| Nome + stats resumidos inline | Ex: "Espada · 1d6 · Esg[Uma Mão]" + badges das melhorias | ✓ (colapsado) |
| Nome + contagem de melhorias (atual) | Nome em ouro + "2 melh." | |
| Nome + mini badges coloridas | Dots coloridos das melhorias sem texto | |

**User's choice (colapsado):** Nome + stats resumidos inline.

| Option | Description | Selected |
|--------|-------------|----------|
| Stats card separado | Seção visual com caixa dourada: stats base + melhorias + efeito ativável | |
| Inline abaixo do nome | Stats em texto muted, melhorias em badges | |
| Você decide (com base nos PDFs) | Layout baseado nos PDFs fornecidos | ✓ (expandido) |

**User's choice (expandido):** Baseado nos PDFs — executor decide layout.

**Inventário com stats:** Sim — itens do tipo gear no inventário também exibem stats resumidos.

---

## Craft UI & Intuitividade

| Option | Description | Selected |
|--------|-------------|----------|
| Seleção inline no slot | Lista expande dentro do slot, sem modal | |
| Modal melhorado com preview | Modal atual + preview de efeito | |
| Manter modal — só dados e visual | Problema eram os dados incorretos e falta de stats, não o fluxo | ✓ |

**User's choice:** Manter estrutura de modal. O problema era dados incorretos + ausência de stats + nova UI visual dos PDFs.
**Notes:** A "grande mudança visual" vem dos PDFs — o fluxo de interação (botão → modal → lista) está correto.

---

## Drag-drop + Tab Order + PDFs

| Option | Description | Selected |
|--------|-------------|----------|
| Prioritário — parte do v1.3 | react-native-reanimated + gesture-handler | ✓ |
| Nice-to-have — defer se complicar | Tentar, defer para v1.4 se explodir | |
| Defer para v1.4 | Tap-to-equip agora, drag depois | |

**Drag-drop:** Prioritário v1.3.

| Option | Description | Selected |
|--------|-------------|----------|
| 2ª posição: Ficha \| Mochila \| Magia \| ... | Mochila antes de Magia | |
| 3ª posição: Ficha \| Magia \| Mochila \| ... | Mochila entre Magia e Grimório | ✓ |

**Tab order:** 3ª posição.

**PDFs:** Lidos via pymupdf + renderização de imagem (24 páginas totais). Decisões resultantes:

| Option | Description | Selected |
|--------|-------------|----------|
| Hexagonais completos | Componente hexagonal real com silhueta central | ✓ |
| Cards com afinidade de cor | Retangulares com border color + ícone de slot | |
| Você decide | Executor decide o mais viável | |

**Equipamentos UI:** Hexagonais completos (fiel ao PDF aRPG p.5-6).

| Option | Description | Selected |
|--------|-------------|----------|
| FlatList híbrida (fiel ao PDF) | IQuickNote + IStructuredGear, migra dos 20 slots fixos | ✓ |
| Manter grid 20 slots + melhorar visual | 20 slots numerados, cada slot com equip mostra stats | |

**Inventário:** FlatList híbrida com 2 tipos tipados.

| Option | Description | Selected |
|--------|-------------|----------|
| Sim — 6 slots (+ Armadura) | Schema migration, adicionar slot Armadura | |
| Não — manter 5 slots | Decisão Phase 13 mantida | ✓ |

**Slots:** Manter 5 (Arma, Escudo, Vestimenta, Acessório×2).

---

## Claude's Discretion

- Layout interno do slot hexagonal expandido (posicionamento de stats, melhorias, toggle artefato)
- Animação de transição no drag-and-drop
- Ícone por categoria de equipamento (SF Symbols)
- Posicionamento exato dos 5 hexágonos ao redor da silhueta

## Deferred Ideas

- Slot Armadura como 6º slot — PDF mostra, usuário decidiu não adicionar
- Propriedades elementais (v1.4+)
- Afiadores (v1.4+)
- Integração automática de stats de equipamentos com atributos da Ficha (fora do escopo — app é referência visual)
