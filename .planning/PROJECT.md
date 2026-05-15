# Magic Kéos — App Companion

## What This Is

Aplicativo móvel (React Native/Expo) que serve como companion digital para o RPG de mesa Magic no Universo Kéos. Permite que jogadores gerenciem fichas de personagem completas, consultem o grimório de mágicas, e acompanhem o jogo sem depender de papel. Suporta múltiplos personagens com persistência local.

## Core Value

O app precisa ser confiável e rápido durante a sessão de jogo — perder dados ou travar na mesa quebra a imersão.

## Requirements

### Validated

- ✓ Ficha de personagem: nome, sabedoria, vida (total/necro/atual/armadura/manto), mana (5 cores + incolor), veneno, afinidade por cor — existing
- ✓ Atributos por instância (CORPO/MENTE/ESPÍRITO): dados coloridos (até 5 por atributo), perícias com base/temp — existing
- ✓ IP por instância (base + bônus) — existing
- ✓ Balizadores: Velocidade, Memória, Canalização, Foco com caixas de marcação — existing
- ✓ Domínios (12 slots), inventário, equipamentos, 20 slots de mágicas, receitas — existing
- ✓ Grimório completo com busca, filtros por cor/grau/tipo e agrupamento por domínio — existing
- ✓ Múltiplos personagens: criar, deletar, alternar, exportar/importar JSON — existing
- ✓ Visualização de spell ao tocar nome na ficha de magia — existing
- ✓ Persistência via AsyncStorage — existing

### Active

- [ ] Debounce no AsyncStorage (escrita a cada keystroke causa degradação no Android)
- [ ] Memoização do CharacterContext (re-renders desnecessários em toda árvore)
- [ ] Estado de carregamento durante hidratação (race condition na inicialização)
- [ ] Error boundaries para evitar crash silencioso
- [ ] Validação de entrada de dados (impedir negativos em IP, clampar veneno 0–10)
- [ ] Separação de screens grandes (index.tsx 766 linhas, grimorio.tsx 510 linhas)
- [ ] Novas features a definir em discuss-phase (rolador de dados, rastreador de combate, calculadora de evolução, etc.)

### Out of Scope

- Backend/servidor — app é local-only por design
- Multiplayer/sync em tempo real — fora do escopo v1
- Sistema de criação de campanha para mestres — foco é no jogador

## Context

- Stack: Expo 52, React Native 0.76, TypeScript strict, Expo Router
- Estado: React Context + AsyncStorage (sem Zustand)
- Tema: RPG theme object centralizado com 5 cores (branco/verde/vermelho/preto/azul)
- Convenções: nomes em português para termos do domínio, StyleSheet.create exclusivo
- Grimório: ~3700+ entradas JSON geradas do Excel oficial, 45 domínios, 5 cores
- Sem testes automatizados; ESLint + TypeScript strict como única validação

## Constraints

- **Plataforma**: iOS + Android via Expo (sem web)
- **Persistência**: AsyncStorage (sem banco de dados externo)
- **Linguagem de domínio**: português brasileiro — manter nos novos componentes
- **Sem breaking changes**: fichas existentes dos jogadores não podem perder dados (migrations necessárias)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Context + AsyncStorage (não Zustand) | Simplicidade para o tamanho atual do app | — Pending (memoization fix needed) |
| Grimório como JSON estático | Performance; dados não mudam em runtime | ✓ Good |
| Expo Router file-based routing | Convenção Expo 52 | ✓ Good |
| Nomes em português no domínio | Coerência com o sistema de jogo | ✓ Good |

## Evolution

Este documento evolui a cada transição de fase.

**Após cada fase**: mover requirements concluídos para Validated; novos descobertos para Active.

---
*Last updated: 2026-05-15 após inicialização*
