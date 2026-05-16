# Requirements — Magic Kéos App

## v1 Requirements

### Estabilidade e Fundação (FOUND)

- [x] **FOUND-01**: App persiste dados sem perda ao digitar (debounce no AsyncStorage)
- [x] **FOUND-02**: App hidrata sem race condition (loading state antes de renderizar ficha)
- [x] **FOUND-03**: Crashes de contexto isolados por error boundaries (não derruba app inteiro)
- [x] **FOUND-04**: CharacterContext memoizado (sem re-renders desnecessários)

### Qualidade da Ficha (FICHA)

- [x] **FICHA-01**: Campos numéricos de IP não aceitam valores negativos
- [x] **FICHA-02**: Veneno clampado entre 0–10 (regra: 10 = morte imediata)
- [x] **FICHA-03**: Fonte PlanewalkerDings carrega antes da primeira renderização (sem flash de glyphs)
- [ ] **FICHA-04**: Ficha principal (index.tsx) dividida em componentes menores e reutilizáveis ← deferred to v1.1

### Grimório e Mágicas (GRIM)

- [x] **GRIM-01**: Grimório (grimorio.tsx) dividido em componentes reutilizáveis
- [x] **GRIM-02**: Filtros do grimório persistem durante a sessão (não resetam ao navegar)

### Features de Mesa (MESA)

- [x] **MESA-01**: Aba "Regras" com referência in-session de mecânicas (dados, testes, combate, condições, canalização, descanso, balizadores) e campo "Notas" persistente
- [x] **MESA-02**: Seletor de Proficiências estruturado (chips togláveis agrupados por perícia CORPO/MENTE/ESPÍRITO) substituindo o campo de texto livre
- [x] **MESA-03**: Migração automática de `proficiencias: string` → `proficiencias: string[]` sem perda de dados para personagens existentes

### Qualidade de Código (CODE)

- [x] **CODE-01**: Constantes de cor e grau deduplicadas (COLOR_HEX e GRAU_COLORS em um único lugar)
- [x] **CODE-02**: modal.tsx inacessível removido ou conectado
- [x] **CODE-03**: explore.tsx re-export desnecessário corrigido

## v2 Requirements (Deferred)

- Rolador de dados coloridos (dW/dG/dR/dB/dU com mecânicas especiais) — diferido de v1 Phase 4
- Rastreador de turno de combate (ordem de iniciativa, marcador de turno) — diferido de v1 Phase 4
- Calculadora de veneno (tracker visual 0–10 com efeitos por nível) — diferido de v1 Phase 4
- Calculadora de evolução de personagem (afinidade de cor → nova identidade)
- Rastreador de cena completo (HP de inimigos, criaturas em campo, condições)
- Modo offline-first com sync posterior
- Testes automatizados (jest + testing-library)
- Criação guiada de personagem (wizard step-by-step)
- **FICHA-04**: index.tsx dividida em componentes menores (deferred from v1)

## Out of Scope

- Backend/servidor — local-only por design
- Multiplayer/sync — fora do v1
- Sistema para mestres (criação de campanhas, NPCs, etc.) — foco é no jogador

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FICHA-01 | Phase 2 | Complete |
| FICHA-02 | Phase 2 | Complete (pre-satisfied by VenenoTracker UI) |
| FICHA-03 | Phase 2 | Complete |
| FICHA-04 | Phase 2 | Deferred → v1.1 |
| CODE-01 | Phase 2 | Complete |
| CODE-02 | Phase 2 | Complete |
| CODE-03 | Phase 2 | Complete |
| GRIM-01 | Phase 3 | Complete |
| GRIM-02 | Phase 3 | Complete |
| MESA-01 | Phase 4 | Complete |
| MESA-02 | Phase 4 | Complete |
| MESA-03 | Phase 4 | Complete |
