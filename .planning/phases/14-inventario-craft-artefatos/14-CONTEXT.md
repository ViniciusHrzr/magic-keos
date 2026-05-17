# Phase 14: inventario-craft-artefatos — Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Rework completo da aba Mochila: corrigir dados de melhorias para fidelidade total ao livro,
redesenhar equipamentos com slots hexagonais (estilo aRPG), migrar inventário para FlatList
híbrida (Nota Rápida + Equipamento Estruturado), adicionar drag-and-drop inventário↔equipamentos,
exibir stats do item e de melhorias inline, e reposicionar aba Mochila para 3ª posição.

</domain>

<decisions>
## Implementation Decisions

### Melhoria Data Model
- **D-01:** Cada linha do livro = 1 melhoria separada. 1 stat = 1 melhoria. Não há melhoria que aplica múltiplos bônus simultaneamente.
- **D-02:** Dados corretos por categoria:
  - **Arma** (5 melhorias): Acurácia de lâminas+1 (branco), Acurácia de madeiras+1 (verde), Dano físico+1 (vermelho), Dado de dano+1 (preto), Dano mágico+1 (azul)
  - **Vestimenta** (15 melhorias — 3 por cor): branco: Armadura+1, Diplomacia+1, Esgrima+1 | verde: Manto+1, Comunhão+1, Pontaria+1 | vermelho: IP Corp+1, Expressão+1, Atletismo+1 | preto: IP Esp+1, Intimidação+1, Furtividade+1 | azul: IP Mental+1, Lábia+1, Artes Marciais+1
  - **Escudo** (10 melhorias — 2 por cor): branco: IP Esp+1, Armadura+1 | verde: IP Corp+1, Manto+1 | vermelho: IP Corp+1, Armadura+1 | preto: IP Esp+1, IP Mental+1 | azul: IP Mental+1, Manto+1
  - **Acessório** (10 melhorias — 2 por cor): branco: Foco+1, Mecânica+1 | verde: Canalização+1, Sobrevivência+1 | vermelho: Velocidade+1, Criatividade+1 | preto: Domínio+1, Alquimia+1 | azul: Memória+1, Investigação+1
- **D-03:** Qualquer combinação de cores permitida — só o limite de 3 melhorias por item aplica.
- **D-04:** Deduplicação por label mantida (sem adicionar o mesmo stat duas vezes no mesmo item).

### Equipment UI — Slots Hexagonais
- **D-05:** Slots de equipamento redesenhados como **hexágonos** ao redor de silhueta de personagem (fiel ao PDF aRPG). Top half da tela = layout tático hexagonal.
- **D-06:** 5 slots mantidos: Arma, Escudo, Vestimenta, Acessório 1, Acessório 2. Slot Armadura não é adicionado (decisão Phase 13 mantida).
- **D-07:** Cada slot hexagonal tem cor de afinidade de mana: Arma=vermelho, Escudo=azul, Vestimenta=verde, Acessório1=branco, Acessório2=branco.
- **D-08:** Bottom half da tela = inventário (FlatList híbrida).

### Stats Display
- **D-09:** Slot hexagonal **colapsado** mostra: nome do item + stats resumidos inline (ex: "Espada · 1d6 · Esg[Uma Mão]") + dots coloridos das melhorias aplicadas.
- **D-10:** Slot hexagonal **expandido** (tap): layout baseado nos PDFs — todos os stats do item base + lista de melhorias com seus bônus + efeito ativável se artefato.
- **D-11:** Itens do inventário tipo `gear` também exibem stats (dano/defesa + badges de afinidade), no card do Arsenal Híbrido.

### Inventário — FlatList Híbrida
- **D-12:** Inventário migra de grid de 20 slots fixos para **FlatList unificada** com 2 tipos de item:
  - **IQuickNote**: container compacto — ícone + texto + quantidade + ✕ (exclusão rápida). Para itens simples (poções, tochas, etc.)
  - **IStructuredGear**: card maior — ícone + nome + dano/defesa + badges de afinidade + colapsável para lore/regras. Para equipamentos no inventário.
- **D-13:** Modelagem TypeScript: `type InventoryItem = IQuickNote | IStructuredGear` com union discriminada por `type: "note" | "gear"`.
- **D-14:** Performance: FlatList nativa + componentes `NoteCard` e `GearCard` isolados + `React.memo` para evitar re-renders em cascata.
- **D-15:** Schema migration necessária: `inventarioSlots: string[]` → `inventarioItems: InventoryItem[]`.

### Drag-and-Drop
- **D-16:** Drag-and-drop inventário↔equipamentos é **prioritário para v1.3**. Usar `react-native-reanimated` + `react-native-gesture-handler` (já incluídos no Expo 52).
- **D-17:** Fluxo: tap item no inventário → drag → soltar no slot hexagonal → item equipado, stats atualizados. Inverso: drag do hexágono para o inventário = desequipa.
- **D-18:** Restrição por categoria: slot Arma só aceita IStructuredGear com `type_equip: 'arma'`, etc.

### Tab Order
- **D-19:** Aba Mochila movida para 3ª posição: **Ficha | Magia | Mochila | Grimório | Regras | Notas**.
- **D-20:** Alterar ordem em `app/(tabs)/_layout.tsx` movendo `<Tabs.Screen name="mochila">` para após `magia`.

### Craft UI
- **D-21:** Fluxo de craft mantém estrutura modal (não muda para inline). O problema era dados incorretos + ausência de stats visíveis — não o fluxo de interação.
- **D-22:** Visual do modal de craft atualizado conforme PDFs: mostrar cor da melhoria, label do stat, e preview do efeito antes de confirmar adição.

### Claude's Discretion
- Layout interno do slot hexagonal expandido (posicionamento dos stats, melhorias, toggle artefato) — seguir paradigma do PDF mkeos: ícone + nome + status primários + secundários.
- Animação de transição no drag-and-drop — usar defaults do Reanimated com feel tátil.
- Ícone por categoria de equipamento (espada para Arma, escudo para Escudo, etc.) — usar SF Symbols disponíveis via IconSymbol.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Regras do Jogo — Dados de Melhorias
- `.planning/GAME_RULES.md` §"Melhorias" (linhas 1355–1406) — Fonte de verdade para todos os dados de melhorias por categoria. Cada linha separada por ";" = melhoria separada.

### Requirements
- `.planning/REQUIREMENTS.md` — Requirements CRAFT-01, CRAFT-02, CRAFT-03, INV-01, INV-02, ARTE-01 (atualizar CRAFT-02 para refletir decisão D-01: 1 stat = 1 melhoria).

### Design Visual — PDFs
- `magic keos/The_aRPG_Inventory_Evolution.pdf` — Paradigma aRPG: slots hexagonais, grid espacial, fluxo drag-to-equip. Fonte para UI de equipamentos.
- `magic keos/Magic_Kéos_Inventory_Evolution.pdf` — Arsenal Híbrido: FlatList com IQuickNote + IStructuredGear. Fonte para UI de inventário.

### Código Existente
- `app/(tabs)/mochila.tsx` — Implementação atual (será reescrita quase inteiramente).
- `data/regras/equipamentos.ts` — `MELHORIAS_POR_SLOT` precisa ser corrigido conforme D-02.
- `app/(tabs)/_layout.tsx` — Reordenar tabs (D-19).
- `types/character.ts` — Adicionar `InventoryItem = IQuickNote | IStructuredGear`; migrar `inventarioSlots: string[]` → `inventarioItems: InventoryItem[]`.
- `store/CharacterContext.tsx` — Atualizar `setInventarioSlot` para suportar novo modelo.

### Pesquisa Técnica
- `.planning/phases/14-inventario-craft-artefatos/14-RESEARCH.md` — Stack decisions e patterns de drag-and-drop em Expo.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/rpg/NumericStepper` — reutilizar para Durabilidade no artefato (sem mudanças).
- `components/rpg/SectionHeader` — reutilizar para separação Equipamentos/Inventário.
- `constants/theme.ts` `RPG.*` — tokens de cor (gold, surface, border, branco/verde/vermelho/pretoLight/azul) para badges de melhorias e hexágonos.
- `COR_TOKEN` em mochila.tsx — mapeia `MelhoriaItem['cor']` → cor hex; manter padrão.

### Established Patterns
- `LayoutAnimation.configureNext(easeInEaseOut)` com guard `UIManager.setLayoutAnimationEnabledExperimental(true)` para Android — reutilizar em expansão dos hexágonos.
- Modal pattern (`pickerSlot`, `crafterSlot` state) — manter para pickers e craft modal.
- `setEquipamentoItem(slot, item | null)` — interface do CharacterContext; manter assinatura.
- `migrate()` com guards acumulativos — adicionar Guard C para `inventarioSlots → inventarioItems`.
- TypeScript strict + `as const` em arrays de keys — seguir padrão de SLOT_KEYS.

### Integration Points
- `CharacterContext` → `setInventarioSlot` será substituído por `addInventarioItem`, `removeInventarioItem`, `updateInventarioItem`.
- Drag-and-drop conecta `inventarioItems` (source) com `equipamentos[slot]` (target) — o drop chama `setEquipamentoItem` + `removeInventarioItem`.
- `react-native-reanimated` + `react-native-gesture-handler` já instalados no Expo 52 — sem install novo necessário.

</code_context>

<specifics>
## Specific Ideas

- **Hexágonos**: silhueta de personagem centralizada, slots hexagonais posicionados ao redor (topo: Escudo esquerda / Arma direita | meio: Vestimenta esquerda / (corpo) / Acessório direita | baixo: Acessório 2 esquerda / Acessório 1 direita — ou layout conforme PDF p.6).
- **Nota Rápida**: row compacta com hitbox invisível — "Poção Menor ×3" + ✕ no canto. Toque na row → edita texto/quantidade inline ou via modal simples.
- **Equipamento Estruturado no inventário**: card com borda de raridade (gold para itens com melhorias, border para básico), nome + dano/IP em destaque, badges coloridas de afinidade, chevron para expandir lore.
- **Estado colapsado do hex**: nome em gold + stat principal (ex: "1d6") + dots de melhorias visíveis. Estado vazio: ícone de categoria em muted.
- **Craft modal**: mantém lista com dots de cor + label do stat. Adicionar linha de preview: "Adicionando: Acurácia de lâminas +1 → total: Acurácia +1".

</specifics>

<deferred>
## Deferred Ideas

- Propriedades elementais (Sagrado, Ácido, Elétrico) como melhorias avançadas — v1.4+ (já no roadmap).
- Afiadores: combinações de 3 melhorias para desbloquear propriedade elemental — v1.4+.
- Integração de stats de equipamentos com atributos da Ficha (IP automático etc.) — fora do escopo (app é referência visual, não calculadora automática).
- Slot Armadura como 6º slot — PDF mostra, mas usuário decidiu manter 5 slots.
- Ícones de itens no inventário (sprites de espada, poção etc.) — fora de escopo desta fase; usar ícones SF Symbols disponíveis.

</deferred>

---

*Phase: 14-inventario-craft-artefatos*
*Context gathered: 2026-05-17*
