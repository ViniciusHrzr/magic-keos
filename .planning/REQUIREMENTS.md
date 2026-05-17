# Requirements — Magic Kéos v1.2

## Milestone

**v1.2 — Tela de Regras: Visual & Estrutura**
**Goal:** Redesenhar `regras.tsx` com hierarquia visual, tabelas RPG, tipografia com escaneabilidade e seções colapsáveis com feedback — alinhado à vibe dark/gold/premium da ficha existente.

---

## Active Requirements

### Hierarquia Visual (REG-01–02)

- [x] **REG-01**: A tela de Regras exibe cada seção principal em um card/bloco visualmente separado do fundo (background distinto, borda ou sombra)
- [x] **REG-02**: O cabeçalho de cada seção principal tem número, título e divisor visual claramente distintos do conteúdo interno

### Tabelas (REG-03–05)

- [ ] **REG-03**: Toda tabela tem uma linha de cabeçalho (header) com fundo distinto e texto em bold/gold
- [ ] **REG-04**: As linhas de dados de tabela têm separação clara (borda inferior ou fundo alternado leve)
- [ ] **REG-05**: Colunas de tabela são alinhadas de forma consistente em todas as seções

### Tipografia (REG-06–09)

- [x] **REG-06**: Títulos de seção: fonte grande (≥16), bold, gold — legível sem expandir
- [x] **REG-07**: Sub-seções (Sub): fonte média (12–14), semibold, text ou goldLight
- [x] **REG-08**: Corpo de texto: regular, textMuted, lineHeight ≥ 18 para leitura confortável em sessão
- [x] **REG-09**: Labels meta (PRÉ-REQ, CUSTO, MÁGICA etc.): uppercase, tiny (≤10), gold, letterSpacing

### Seções Colapsáveis (REG-10–12)

- [ ] **REG-10**: Chevron (▼/▲) anima suavemente entre estado colapsado e expandido
- [ ] **REG-11**: O cabeçalho colapsável muda de aparência visualmente entre fechado e aberto (cor de fundo, borda ou opacidade)
- [ ] **REG-12**: Toque no cabeçalho aciona feedback háptico leve (Expo Haptics)

---

## Future Requirements

- Seção de Regras com busca textual inline (buscar regra por nome/palavra-chave)
- Marcadores de "favorito" por seção para acesso rápido na sessão
- Modo de leitura compacto vs. expandido (densidade configurável)

---

## Out of Scope

- Alterações no conteúdo das regras (`data/regras/`) — conteúdo está correto desde v1.1
- Novas seções ou novas regras na tela
- Redesign de outras telas (Ficha, Magia, Grimório, Notas)
- Backend, sync ou persistência de estado de colapsável entre sessões

---

## Traceability

| REQ-ID | Phase | Plan |
|--------|-------|------|
| REG-01 | 10 | 10-01 |
| REG-02 | 10 | 10-01 |
| REG-06 | 10 | 10-01 |
| REG-07 | 10 | 10-01 |
| REG-08 | 10 | 10-01 |
| REG-09 | 10 | 10-01 |
| REG-03 | 11 | 11-01 |
| REG-04 | 11 | 11-01 |
| REG-05 | 11 | 11-01 |
| REG-10 | 11 | 11-01 |
| REG-11 | 11 | 11-01 |
| REG-12 | 11 | 11-01 |
