# Roadmap: Magic Kéos App

## Overview

The app already has a working character sheet, magic screen, and grimoire. This roadmap stabilizes the foundation first (persistence bugs, race conditions, error isolation), then cleans up the character sheet and grimoire screens (validation, font handling, component extraction), then adds the three table-session tools players need mid-game (dice roller, combat tracker, poison tracker). Each phase delivers a coherent, verifiable improvement on top of the last.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Estabilidade de Fundação** - Corrigir debounce, race condition de hidratação, error boundaries e memoização do contexto
- [x] **Phase 2: Qualidade da Ficha** - Validação de entrada, carregamento de fonte, extração de componentes e limpeza de código morto (completed 2026-05-15)
- [ ] **Phase 3: Qualidade do Grimório** - Extração de componentes do grimório e persistência de filtros durante a sessão
- [ ] **Phase 4: Ferramentas de Mesa** - Rolador de dados coloridos, rastreador de turno de combate e rastreador visual de veneno

## Phase Details

### Phase 1: Estabilidade de Fundação
**Goal**: O app persiste dados de forma confiável, hidrata sem corrida e isola crashes sem derrubar a sessão de jogo
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. Ao digitar em qualquer campo de texto, o app não trava ou apresenta jank perceptível em dispositivos Android de médio porte
  2. Ao abrir o app com personagem salvo, a ficha exibe os dados corretos sem flash de estado vazio antes da hidratação completar
  3. Um erro de render em uma tela (ex: campo corrompido) exibe mensagem de erro contida naquela tela sem derrubar as demais abas
  4. Alterar um campo em qualquer tela não causa re-render das telas que não dependem daquele campo
**Plans**: 3 (2 waves)

**Wave 1** *(parallel)*
- [x] 01-01-PLAN.md — Debounce de escrita e memoização do CharacterContext (FOUND-01, FOUND-04)
- [x] 01-02-PLAN.md — Error boundaries globais e por aba (FOUND-03)

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 01-03-PLAN.md — Loading state de hidratação e guards nas screens (FOUND-02)

**Cross-cutting constraints:**
- `store/CharacterContext.tsx` modificado por 01-01 e 01-03 — mudanças aditivas e não conflitantes
- Nenhuma lógica de funcionamento da ficha é alterada (setters, transformações, estrutura do personagem permanecem idênticos)

### Phase 2: Qualidade da Ficha
**Goal**: A ficha de personagem rejeita entradas inválidas, exibe glifos de mana corretamente desde o primeiro frame, e os arquivos de tela são navegáveis e reutilizáveis
**Depends on**: Phase 1
**Requirements**: FICHA-01, FICHA-02, FICHA-03, FICHA-04, CODE-01, CODE-02, CODE-03
**Success Criteria** (what must be TRUE):
  1. Digitar um valor negativo no campo IP Base ou IP Bônus resulta em 0, sem aceitar o valor inválido
  2. Incrementar veneno acima de 10 ou abaixo de 0 é bloqueado pelo componente; o valor sempre fica entre 0 e 10
  3. Ao lançar o app pela primeira vez, os glifos de custo de mana na ficha de magia aparecem corretamente sem flash de caracteres errados
  4. O arquivo index.tsx tem menos de 300 linhas com InstanceBlock extraído para components/rpg/; grimorio.tsx e magia.tsx têm sub-componentes extraídos
  5. Constantes COLOR_HEX e GRAU_COLORS existem em um único arquivo de constantes importado por magia.tsx e grimorio.tsx; modal.tsx e explore.tsx são removidos ou corrigidos
**Plans**: 3 plans (1 wave, fully parallel)

**Wave 1** *(parallel — no file overlaps between plans)*
- [x] 02-01-PLAN.md — Substituir TextInputs de IP por NumericStepper em InstanceBlock (FICHA-01; FICHA-02 pre-satisfied)
- [x] 02-02-PLAN.md — Guard `fontsLoaded` em `_layout.tsx` + deletar `modal.tsx` e `explore.tsx` (FICHA-03, CODE-02, CODE-03; FICHA-04 deferred)
- [x] 02-03-PLAN.md — Criar `constants/spell-constants.ts` e importar em `magia.tsx`/`grimorio.tsx` (CODE-01)

**Phase 2 scope notes:**
- **FICHA-02** (veneno 0–10 clamp) — pre-satisfied by existing `VenenoTracker` component (UI bubble toggle). Referenced in plan frontmatter (02-01) for traceability; no implementation work.
- **FICHA-04** (InstanceBlock extraction → index.tsx < 300 lines) — explicitly deferred per user (02-CONTEXT.md). Referenced in plan frontmatter (02-02) for traceability; no implementation work. Success Criterion #4 will NOT be fully satisfied at the end of this phase; it remains open for a future phase.
- **UI hint**: yes — Plans 02-01 and 02-02 produce visible changes (IP steppers, no-flash cold start, tab bar without Explore).

### Phase 3: Qualidade do Grimório
**Goal**: O grimório é composto por componentes reutilizáveis e os filtros selecionados pelo jogador persistem enquanto ele navega entre abas durante a sessão
**Depends on**: Phase 2
**Requirements**: GRIM-01, GRIM-02
**Success Criteria** (what must be TRUE):
  1. Ao navegar do grimório para a ficha e voltar, os filtros de cor, grau e tipo selecionados anteriormente continuam ativos (sem reset para o estado padrão)
  2. O arquivo grimorio.tsx tem sub-componentes (SpellDetail, StatPill) extraídos para components/rpg/ e importáveis por outras telas
  3. O componente SpellDetailCard compartilhado é usado tanto em magia.tsx quanto em grimorio.tsx, eliminando a duplicação de implementação
**Plans**: 3 plans (3 waves)

**Wave 1**
- [ ] 03-01-PLAN.md — Extrair StatPill inline de grimorio.tsx para components/rpg/StatPill.tsx (GRIM-01)

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 03-02-PLAN.md — Criar SpellDetailCard, remover SpellDetail de grimorio.tsx e SpellDetailView de magia.tsx (GRIM-01)

**Wave 3** *(blocked on Wave 2 completion)*
- [ ] 03-03-PLAN.md — Adicionar variáveis module-level para persistência de filtros em grimorio.tsx (GRIM-02)

**Cross-cutting constraints:**
- `app/(tabs)/grimorio.tsx` modificado pelos 3 planos — execução estritamente sequencial (waves 1→2→3)
- `detailHeader`, `closeBtn`, `closeBtnText` em `magia.tsx` são compartilhados com `DomainView` — NÃO remover ao extrair `SpellDetailCard`

### Phase 4: Ferramentas de Mesa
**Goal**: Jogadores podem rolar dados coloridos, rastrear a ordem de iniciativa e monitorar o nível de veneno de um personagem diretamente no app durante a sessão
**Depends on**: Phase 3
**Requirements**: MESA-01, MESA-02, MESA-03
**Success Criteria** (what must be TRUE):
  1. O jogador pode selecionar uma combinação de dados coloridos (dW/dG/dR/dB/dU) e rolar, vendo o resultado com as mecânicas especiais de cada cor aplicadas
  2. O jogador pode adicionar personagens à fila de iniciativa, marcar o turno atual e avançar para o próximo turno durante combate
  3. O jogador pode ajustar o nível de veneno de 0 a 10 no rastreador visual e ver os efeitos correspondentes a cada nível exibidos na tela
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Estabilidade de Fundação | 3/3 | Complete | 2026-05-15 |
| 2. Qualidade da Ficha | 3/3 | Complete   | 2026-05-15 |
| 3. Qualidade do Grimório | 0/3 | Not started | - |
| 4. Ferramentas de Mesa | 0/TBD | Not started | - |
