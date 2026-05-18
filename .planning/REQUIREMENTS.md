# Requirements — Magic Kéos App

## Milestone v1.4 — Nova UI: aRPG & MTG Style

### Visual Foundation

- [ ] **UI-01**: App usa @shopify/react-native-skia instalado e configurado sem quebrar build Expo 52
- [ ] **UI-02**: Paleta MTG hex exata atualizada em constants/theme.ts (Branco/#F8F2E2, Verde/#00733E, Vermelho/#D3202A, Preto/#150B00, Azul/#0E68AB, Incolor/#A6ADB5)
- [ ] **UI-03**: Legendary Frame component disponível e aplicado no header do personagem (nome + sabedoria com borda chanfrada estilo MTG)

### Atributos & Dados

- [ ] **ATTR-01**: Ícones de dados (d4, d6, d8, d10, d12) exibidos visualmente ao lado de cada atributo nas 3 instâncias (Corpo, Mente, Espírito)
- [ ] **ATTR-02**: Power Crests circulares usados como containers de ícones para proficiências e habilidades
- [ ] **ATTR-03**: Cards das instâncias (Corpo/Mente/Espírito) redesenhados com visual MTG — bordas, texturas, separação de camadas

### Vitalidade & Status

- [ ] **VIT-01**: Barra de vida unificada exibe 5 camadas sobrepostas: Total (container), Atual (gradiente verde→vermelho), Necro (overlay roxo bloqueante), Armadura (shield overlay esquerdo com valor), Manto (aura ciano contornando a barra)
- [ ] **VIT-02**: Sabedoria exibe dois contadores separados e independentes: Acumulada (total histórico) e Disponível (recurso atual)
- [ ] **VIT-03**: Veneno exibe tracker visual com grid de slots/checkmarks (não apenas número numérico)

### Mana com Skia

- [ ] **MANA-01**: Cada cor de mana (Branco, Verde, Vermelho, Preto, Azul, Incolor) tem stepper duplo: Base (mana mínima garantida após descanso) e Total (mana disponível agora)
- [ ] **MANA-02**: Shader Skia por cor de mana: Vermelho=fogo Perlin, Azul=ondas concêntricas, Verde=partículas ascendentes, Branco=brilho etéreo, Preto=sombra profunda, Incolor=distorção neutra
- [ ] **MANA-03**: Canalização redesenhada como grid de checkboxes estilizados MTG (não texto plano)

### Paperdoll & Mochila

- [ ] **PAP-01**: Silhueta de personagem centralizada no topo da aba Mochila com 5 slots de equipamento posicionados ao redor (estilo aRPG paperdoll)
- [ ] **PAP-02**: Slots vazios exibem Power Crest (ícone de categoria — espada, escudo, etc.) com opacidade 0.3 como placeholder visual
- [ ] **PAP-03**: Itens equipados refletem status visual com borda dourada ou glow no slot correspondente

### Grimório

- [ ] **GRIM-01**: FlatList do grimório substituída por FlashList (@shopify/flash-list) mantendo 60fps durante scroll intenso
- [ ] **GRIM-02**: Filtros de cor de mana exibem ícones/símbolos MTG (W/U/B/R/G/C) em vez de texto
- [ ] **GRIM-03**: Tap em magia no grimório usa shared element transition (card expande para preencher tela com detalhe)

---

## Future Requirements (deferred)

- Propriedades elementais (Sagrado, Ácido, Elétrico) como melhorias avançadas — v1.5+
- Afiadores: combinações de 3 melhorias para propriedade elemental — v1.5+
- Ícones 3D/isométricos animados para dados (pulso ao equipar item) — v1.5+
- Feedback tátil (haptics) em ajuste de mana e vitalidade — v1.5+
- Item raridade system (Comum → Lendário) com borda colorida — v1.5+
- Glow Lendário via Skia Canvas (transborda limites do slot) — v1.5+
- "Orb de Conhecimento" botão no Paperdoll que abre Grimório — v2+

## Out of Scope

- Zustand (migração de Context+AsyncStorage): risco alto sem ganho imediato para UI — decisão confirmada
- Slot Armadura como 6º slot de equipamento: decisão Phase 13 mantida (Armadura = overlay visual na barra de vida)
- Cálculo automático de bônus de equipamentos em atributos: app é referência visual, não calculadora
- Backend/servidor, multiplayer, testes automatizados: fora do escopo do app

## Traceability

| REQ-ID | Phase |
|--------|-------|
| UI-01, UI-02, UI-03 | Phase 15 |
| ATTR-01, ATTR-02, ATTR-03 | Phase 16 |
| VIT-01, VIT-02, VIT-03 | Phase 17 |
| MANA-01, MANA-02, MANA-03 | Phase 18 |
| PAP-01, PAP-02, PAP-03 | Phase 19 |
| GRIM-01, GRIM-02, GRIM-03 | Phase 20 |
