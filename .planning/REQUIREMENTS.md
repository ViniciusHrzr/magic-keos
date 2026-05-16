# Requirements — v1.1 Fidelidade ao Livro de Regras

> Milestone: v1.1 | Gerado: 2026-05-16
> Fonte de verdade: "Magic no Universo Kéos v.0.4.docx"

---

## v1.1 Requirements

### Fidelidade de Dados — Proficiências

- [x] **FIDE-01**: Corrigir descrições e testes de todas as proficiências de Artes Marciais (Derrubar, Desarmar, Desviar, Fintar, Imobilizar, Aparar) para serem fiéis ao docx
- [x] **FIDE-02**: Corrigir descrições de proficiências de Atletismo (Prontidão e Fôlego estão completamente erradas; Investida incompleta; Disparar com range inventado)
- [x] **FIDE-03**: Corrigir proficiências de Esgrima (Armas Leves, Uma Mão, Duas Mãos com atributos errados; Especialização/Mestria dizem "acurácia" em vez de "+2/+5 dano")
- [x] **FIDE-04**: Corrigir proficiências de Furtividade (Ataque Furtivo: +bônus no teste de ataque, não dano; Ataque Letal: dano adicional = bônus em Furtividade, não "condições"; Ataque Silencioso: descrição completamente errada)
- [x] **FIDE-05**: Corrigir proficiências de Pontaria (Especialização/Mestria: "+2/+5 dano" não "acurácia"; Mirar: inclui "dano adicional igual valor em Pontaria")
- [x] **FIDE-06**: Corrigir proficiência Poções de Alquimia (descrição errada: é sobre usar/reconhecer qualquer poção, não criar durante descanso)
- [x] **FIDE-07**: Corrigir proficiências de Criatividade (Recapitular, Reciclar, Replicar: descrições completamente erradas vs docx)
- [x] **FIDE-08**: Corrigir proficiências de Investigação (nomes errados: Selo de Encantamento e Selo de Invocação; Leitura: sobre ler/escrever, não "decifrar textos arcanos")
- [x] **FIDE-09**: Corrigir proficiência Feiticeiro de Mecânica (falta vestimentas mágicas na descrição)
- [x] **FIDE-10**: Corrigir proficiências de Sobrevivência (Acampamento, Harmonização, Forrageamento, Manufaturação, Treinamento: todas com descrição completamente errada — cada uma muda o teste de uma ação de descanso específica)
- [x] **FIDE-11**: Corrigir proficiências espirituais (Provocar: teste é vs IP Espiritual, não VON; Coordenar: são 2+ aliados, não 1; Inspirar: bônus = valor em Expressão em uma perícia, não +1d20; Amedrontar: afugenta para não atacar, não desvantagem; Distrair: penalidade = valor em Lábia em uma perícia, não "remove reação")

### Fidelidade de Dados — Habilidades

- [x] **FIDE-12**: Corrigir Destreza (usa "dW I–V" em vez dos dados reais: 1d4, 1d6, 1d8, 1d10, 1d12; também não menciona bastões)
- [x] **FIDE-13**: Corrigir Golpe Duplo (falta "ou até dois alvos adjacentes" e "não aplicável a armas de duas mãos")
- [x] **FIDE-14**: Corrigir Alcance (falta o efeito de sucesso: "impede avanço — move apenas metade do deslocamento")
- [x] **FIDE-15**: Corrigir Fúria (falta triggers: "ao sofrer dano, falhar em teste de combate ou presenciar aliado cair")
- [x] **FIDE-16**: Corrigir Grimório (descrição diz "através de grimórios ou observação" — livro diz exatamente o oposto: SEM precisar de livros)
- [x] **FIDE-17**: Corrigir Modelagem (falta mecânica chave: quando morrer pode ser reativada na mesma cena)
- [x] **FIDE-18**: Corrigir Toque Mortífero (trigger: "quando for alvo do ataque de uma criatura" — não genérico)

### Fidelidade de Documentação

- [x] **FIDE-19**: Atualizar `GAME_RULES.md` seções §5 (Perícias/Proficiências) e §7 (Habilidades) para refletir todas as correções aplicadas

### Fidelidade Estrutural (Phase 9)

- [x] **FIDE-20**: Auditoria completa docx v0.4 vs todos os hardcoded sections de regras.tsx (§1-3, §6-20) e todas as seções de GAME_RULES.md — zero discrepâncias
- [ ] **FIDE-21**: regras.tsx 100% dinâmico — todo conteúdo de regras importado de data/regras/ TypeScript files (single source of truth)
- [ ] **FIDE-22**: GAME_RULES.md gerado por script a partir de data/regras/ — drift estruturalmente impossível
- [ ] **FIDE-23**: Pre-commit hook valida data/regras/ vs docx antes de cada commit — bloqueia drift

---

## Future Requirements (v1.2+)

- FICHA-04: index.tsx dividida em componentes menores
- Rolador de dados coloridos (dW/dG/dR/dB/dU)
- Rastreador de turno de combate
- Versionamento de schema no migrate()
- Remover MemoGrid.tsx (dead code)

## Out of Scope (v1.1)

- Novas features de gameplay — foco é correção de conteúdo existente
- Alterações no design/layout das telas
- Correção do grimório.json — já foi gerado do Excel oficial
- Backend/multiplayer — app é local-only por design

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| FIDE-01 | Phase 5 | Pending |
| FIDE-02 | Phase 5 | Pending |
| FIDE-03 | Phase 5 | Pending |
| FIDE-04 | Phase 5 | Pending |
| FIDE-05 | Phase 5 | Pending |
| FIDE-06 | Phase 6 | Complete |
| FIDE-07 | Phase 6 | Complete |
| FIDE-08 | Phase 6 | Complete |
| FIDE-09 | Phase 6 | Complete |
| FIDE-10 | Phase 6 | Complete |
| FIDE-11 | Phase 6 | Complete |
| FIDE-12 | Phase 7 | Pending |
| FIDE-13 | Phase 7 | Pending |
| FIDE-14 | Phase 7 | Pending |
| FIDE-15 | Phase 7 | Pending |
| FIDE-16 | Phase 7 | Pending |
| FIDE-17 | Phase 7 | Pending |
| FIDE-18 | Phase 7 | Pending |
| FIDE-19 | Phase 8 | Complete |

*Last updated: 2026-05-16*
