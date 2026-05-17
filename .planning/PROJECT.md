# Magic Kéos — App Companion

## What This Is

Aplicativo móvel (React Native/Expo) que serve como companion digital para o RPG de mesa Magic no Universo Kéos. Permite que jogadores gerenciem fichas de personagem completas, consultem o grimório de mágicas com filtros persistentes, acessem referência de regras in-session, e selecionem proficiências por chips — tudo sem depender de papel. Suporta múltiplos personagens com persistência local confiável.

## Core Value

O app precisa ser confiável e rápido durante a sessão de jogo — perder dados ou travar na mesa quebra a imersão.

## Current State (v1.0)

Shipped 2026-05-15. App estável, sem race conditions de hidratação, sem re-renders em cascata, com 4 abas funcionais (Ficha, Magia, Grimório, Regras).

Stack: Expo 52, React Native 0.76, TypeScript strict, Expo Router
~4300 LOC adicionadas em v1.0 (24 arquivos TS/TSX)
Sem testes automatizados; ESLint + TypeScript strict como única validação.

## Current Milestone: v1.2 Tela de Regras — Visual & Estrutura

**Goal:** Redesenhar `regras.tsx` com hierarquia visual, tabelas com estilo RPG, tipografia com escaneabilidade, e seções colapsáveis com feedback claro — alinhado à vibe dark/gold/premium da ficha existente.

**Target features:**
- Cards e separação visual entre seções (não mais texto plano/HTML cru)
- Tabelas com estilo RPG (bordas, cores, header consistente)
- Hierarquia tipográfica: títulos, subtítulos, corpo, labels com pesos/cores/tamanhos
- Seções colapsáveis com animação/indicadores de estado (aberto/fechado)

## Requirements

### Validated

- ✓ Ficha de personagem: nome, sabedoria, vida, mana (5 cores + incolor), veneno, afinidade — existing
- ✓ Atributos por instância (CORPO/MENTE/ESPÍRITO): dados coloridos, perícias com base/temp — existing
- ✓ IP por instância (base + bônus) — existing
- ✓ Balizadores: Velocidade, Memória, Canalização, Foco com caixas de marcação — existing
- ✓ Domínios (12 slots), inventário, equipamentos, 20 slots de mágicas, receitas — existing
- ✓ Grimório completo com busca, filtros por cor/grau/tipo e agrupamento por domínio — existing
- ✓ Múltiplos personagens: criar, deletar, alternar, exportar/importar JSON — existing
- ✓ Persistência via AsyncStorage — existing
- ✓ Debounce no AsyncStorage (500ms via useRef) — v1.0
- ✓ Memoização do CharacterContext (useMemo/useCallback) — v1.0
- ✓ Estado de carregamento durante hidratação (isLoaded guard) — v1.0
- ✓ Error boundaries por aba e globais — v1.0
- ✓ Campos IP não aceitam negativos (NumericStepper min=0) — v1.0
- ✓ Veneno clampado 0–10 (VenenoTracker pré-existente) — v1.0
- ✓ Fonte PlanewalkerDings sem flash no cold start (fontsLoaded guard) — v1.0
- ✓ Constantes COLOR_HEX e GRAU_COLORS deduplicadas (spell-constants.ts) — v1.0
- ✓ modal.tsx e explore.tsx mortos removidos — v1.0
- ✓ StatPill e SpellDetailCard extraídos para components/rpg/ — v1.0
- ✓ Filtros do grimório persistem durante a sessão — v1.0
- ✓ Aba "Regras" com referência in-session + Notas persistente — v1.0
- ✓ Proficiências como chips togláveis (CORPO/MENTE/ESPÍRITO) — v1.0
- ✓ Migration automática proficiencias string→string[] — v1.0
- ✓ Aba Notas separada da aba Regras (5ª tab: square.and.pencil icon) — v1.0 gsd-fast
- ✓ Memória/Foco com metadata completo de feitiço (color strip, grau, tipo, custo, ℹ, ×) — v1.0 gsd-fast
- ✓ Duplicate blocking em Memória e Foco (mesmo feitiço não entra duas vezes) — v1.0 gsd-fast
- ✓ Toast system no Magia (2.5s, dourado, funciona dentro e fora de modal) — v1.0 gsd-fast
- ✓ ProficienciasSection collapsível (default colapsado, expande em search) — v1.0 gsd-fast
- ✓ PericiaData com campo descricao; slots mostram nome + descricao + teste — v1.0 gsd-fast
- ✓ Regras seção 4 dinâmica (rendering de proficiencias.ts) e seção 5 tabela Habilidades — v1.0 gsd-fast

### Active (v1.2)

- [ ] **REG-01**: Hierarquia visual — cards e separação clara entre seções de regras
- [ ] **REG-02**: Tabelas com estilo RPG (header, bordas, cores coerentes)
- [ ] **REG-03**: Hierarquia tipográfica (títulos, subtítulos, corpo, labels)
- [ ] **REG-04**: Seções colapsáveis com animação e indicadores de estado visuais

### Out of Scope

- Backend/servidor — app é local-only por design
- Multiplayer/sync em tempo real — fora do escopo
- Sistema de criação de campanha para mestres — foco é no jogador
- Calculadora de evolução de personagem — v2+
- Rastreador de cena completo (HP de inimigos) — v2+
- Testes automatizados — v2+
- Criação guiada de personagem (wizard) — v2+

## Context

- Stack: Expo 52, React Native 0.76, TypeScript strict, Expo Router
- Estado: React Context + AsyncStorage (sem Zustand — memoização via useMemo/useCallback suficiente)
- Tema: RPG theme object centralizado com 5 cores (branco/verde/vermelho/preto/azul)
- Convenções: nomes em português para termos do domínio, StyleSheet.create exclusivo
- Grimório: ~3700+ entradas JSON geradas do Excel oficial, 45 domínios, 5 cores
- Componentes: NumericStepper, SpellDetailCard, StatPill, ProficienciasSection, ErrorBoundary em components/rpg/
- Sem testes automatizados; ESLint + TypeScript strict como única validação

## Constraints

- **Plataforma**: iOS + Android via Expo (sem web)
- **Persistência**: AsyncStorage (sem banco de dados externo)
- **Linguagem de domínio**: português brasileiro — manter nos novos componentes
- **Sem breaking changes**: fichas existentes dos jogadores não podem perder dados (migrations necessárias)
- **Schema versioning**: migrate() usa guards acumulativos por tipo — fragilidade conhecida para mudanças maiores de schema

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Context + AsyncStorage (não Zustand) | Simplicidade para o tamanho atual do app | ✓ Good — memoização via useMemo/useCallback suficiente |
| Grimório como JSON estático | Performance; dados não mudam em runtime | ✓ Good |
| Expo Router file-based routing | Convenção Expo 52 | ✓ Good |
| Nomes em português no domínio | Coerência com o sistema de jogo | ✓ Good |
| Debounce 500ms (não 300ms) | Balanceia responsividade vs. write frequency no Android | ✓ Good |
| useCallback([update]) em todos os set* | Previne re-renders desnecessários em filhos | ✓ Good |
| useMemo no contextValue | Provider value estável = zero re-renders extras no tree | ✓ Good |
| NumericStepper para IP (min=0 default) | Zero código novo de validação — usa contrato existente | ✓ Good |
| Module-level vars para persistência de filtros | Simples, sem Context — persiste enquanto processo vivo | ✓ Good (processo-vivo apenas) |
| SpellDetailCard compartilhado magia↔grimório | Elimina duplicação sem abstrair demais | ✓ Good |
| Aba Regras como conteúdo estático flat (sem accordion) | Referência de sessão — acesso rápido > compactação | ✓ Good |
| Chips com key `pericia:nome` | Evita colisões entre proficiências homônimas | ✓ Good |
| FICHA-04 diferido (index.tsx extração) | Trade-off praticidade vs. perfeição técnica; app funcional > arquitetura ideal | ⚠ Revisit em v1.1 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-16 — v1.2 milestone started*
