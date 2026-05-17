# Requirements — Magic Kéos v1.3

## Milestone

**v1.3 — Aba Mochila: Equipamentos & Craft**
**Goal:** Criar aba dedicada com slots de equipamento interativos (picker do livro + nome custom), grade de inventário nomeada, e sistema de craft com melhorias tabeladas (até 3 por item) e suporte a artefatos com efeito ativável.

---

## Active Requirements

### Mochila (Aba)

- [ ] **MOCH-01**: Usuário pode acessar nova aba "Mochila" dedicada a equipamentos e inventário
- [ ] **MOCH-02**: Seções de Inventário e Equipamentos são removidas da aba Magia (relocadas para Mochila)

### Equipamentos (Slots)

- [ ] **EQP-01**: Usuário pode selecionar tipo base de cada slot (Arma, Escudo, Vestimenta, Acessório 1, Acessório 2) via picker com lista do livro
- [ ] **EQP-02**: Usuário pode usar nome personalizado em qualquer slot (para artefatos com nome único)
- [ ] **EQP-03**: Cada slot de equipamento exibe o item selecionado com suas melhorias visíveis em estado colapsado

### Inventário (Grade)

- [ ] **INV-01**: Usuário pode nomear itens em grade de 20 slots de inventário organizados em 2 colunas
- [ ] **INV-02**: Usuário pode apagar conteúdo de slot de inventário individualmente (sem apagar outros slots)

### Craft (Melhorias)

- [ ] **CRAFT-01**: Usuário pode adicionar até 3 melhorias a qualquer slot de equipamento, escolhendo de lista filtrada pelo tipo do slot
- [ ] **CRAFT-02**: Lista de melhorias segue exatamente o livro por categoria:
  - Armas: Acurácia+1 (branco), Acurácia madeira+1 (verde), Dano físico+1 (vermelho), Dado dano+1 (preto), Dano mágico+1 (azul)
  - Vestimentas: Armadura+1/Diplomacia+1/Esgrima+1 (branco), Manto+1/Comunhão+1/Pontaria+1 (verde), IP Corp+1/Expressão+1/Atletismo+1 (vermelho), IP Esp+1/Intimidação+1/Furtividade+1 (preto), IP Mental+1/Lábia+1/Artes Marciais+1 (azul)
  - Escudos: IP Esp+1/Armadura+1 (branco), IP Corp+1/Manto+1 (verde), IP Corp+1/Armadura+1 (vermelho), IP Esp+1/IP Mental+1 (preto), IP Mental+1/Manto+1 (azul)
  - Acessórios: Foco+1/Mecânica+1 (branco), Canalização+1/Sobrevivência+1 (verde), Velocidade+1/Criatividade+1 (vermelho), Domínio+1/Alquimia+1 (preto), Memória+1/Investigação+1 (azul)
- [ ] **CRAFT-03**: Usuário pode remover qualquer melhoria individualmente sem afetar as demais

### Artefatos

- [ ] **ARTE-01**: Usuário pode marcar qualquer item equipado como Artefato (toggle básico/artefato), desbloqueando campo de efeito ativável (texto livre) e campo de durabilidade (inteiro)

### Schema & Migration

- [x] **SCHEMA-01**: Schema de Character migra automaticamente: `inventario: string` → `inventarioSlots: string[]` (20 slots) e `equipamentos: { arma: string, ... }` → `equipamentos: { [slot]: EquipItem | null }`, preservando nomes de itens já preenchidos como `{ nome: existingString, tipo: 'basico', melhorias: [] }`

---

## Future Requirements

- Propriedades elementais (Sagrado, Ácido, Elétrico etc.) como melhorias avançadas — v1.4+
- Afiadores: combinações de 3 melhorias para desbloquear propriedade elemental — v1.4+
- Múltiplas armas equipadas (mão principal + mão secundária) — v2+
- Rastreador de uso de artefatos (gasto de mana por uso) — v2+

---

## Out of Scope

- Cálculo automático de bônus: melhorias são referência visual, não se aplicam automaticamente aos atributos da ficha
- Gerenciamento de peso/carga — fora do escopo (sistema não usa carga)
- Loja ou economia in-app — fora do escopo (app local-only)
- Validação de proficiência no equipamento selecionado — fora do escopo (jogador controla)

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| SCHEMA-01 | Phase 12 | complete |
| MOCH-01 | Phase 13 | pending |
| MOCH-02 | Phase 13 | pending |
| EQP-01 | Phase 13 | pending |
| EQP-02 | Phase 13 | pending |
| EQP-03 | Phase 13 | pending |
| INV-01 | Phase 14 | pending |
| INV-02 | Phase 14 | pending |
| CRAFT-01 | Phase 14 | pending |
| CRAFT-02 | Phase 14 | pending |
| CRAFT-03 | Phase 14 | pending |
| ARTE-01 | Phase 14 | pending |
