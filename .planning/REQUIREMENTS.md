# Requirements — Magic Kéos App

## v1 Requirements

### Estabilidade e Fundação (FOUND)

- [ ] **FOUND-01**: App persiste dados sem perda ao digitar (debounce no AsyncStorage)
- [ ] **FOUND-02**: App hidrata sem race condition (loading state antes de renderizar ficha)
- [ ] **FOUND-03**: Crashes de contexto isolados por error boundaries (não derruba app inteiro)
- [ ] **FOUND-04**: CharacterContext memoizado (sem re-renders desnecessários)

### Qualidade da Ficha (FICHA)

- [ ] **FICHA-01**: Campos numéricos de IP não aceitam valores negativos
- [ ] **FICHA-02**: Veneno clampado entre 0–10 (regra: 10 = morte imediata)
- [ ] **FICHA-03**: Fonte PlanewalkerDings carrega antes da primeira renderização (sem flash de glyphs)
- [ ] **FICHA-04**: Ficha principal (index.tsx) dividida em componentes menores e reutilizáveis

### Grimório e Mágicas (GRIM)

- [ ] **GRIM-01**: Grimório (grimorio.tsx) dividido em componentes reutilizáveis
- [ ] **GRIM-02**: Filtros do grimório persistem durante a sessão (não resetam ao navegar)

### Features de Mesa (MESA)

- [ ] **MESA-01**: Rolador de dados que suporta as 5 cores (dW/dG/dR/dB/dU) com mecânicas especiais de cada cor
- [ ] **MESA-02**: Rastreador de turno de combate (ordem de iniciativa, marcador de turno atual)
- [ ] **MESA-03**: Calculadora de veneno (tracker visual 0–10 com efeitos por nível)

### Qualidade de Código (CODE)

- [ ] **CODE-01**: Constantes de cor e grau deduplicadas (COLOR_HEX e GRAU_COLORS em um único lugar)
- [ ] **CODE-02**: modal.tsx inacessível removido ou conectado
- [ ] **CODE-03**: explore.tsx re-export desnecessário corrigido

## v2 Requirements (Deferred)

- Calculadora de evolução de personagem (afinidade de cor → nova identidade)
- Rastreador de cena completo (HP de inimigos, criaturas em campo, condições)
- Modo offline-first com sync posterior
- Testes automatizados (jest + testing-library)
- Criação guiada de personagem (wizard step-by-step)

## Out of Scope

- Backend/servidor — local-only por design
- Multiplayer/sync — fora do v1
- Sistema para mestres (criação de campanhas, NPCs, etc.) — foco é no jogador

## Traceability

| Requirement | Phase |
|-------------|-------|
| FOUND-01–04 | Fase 1 |
| FICHA-01–04 | Fase 2 |
| GRIM-01–02 | Fase 2 |
| MESA-01–03 | Fase 3 |
| CODE-01–03 | Fase 2 |
