# Requirements — v1.1 Fidelidade ao Livro de Regras

> Milestone: v1.1 | Gerado: 2026-05-16
> Fonte de verdade: "Magic no Universo Kéos v.0.4.docx"

---

## v1.1 Requirements

### Fidelidade de Dados — Proficiências

- [ ] **FIDE-01**: Corrigir descrições e testes de todas as proficiências de Artes Marciais (Derrubar, Desarmar, Desviar, Fintar, Imobilizar, Aparar) para serem fiéis ao docx
- [ ] **FIDE-02**: Corrigir descrições de proficiências de Atletismo (Prontidão e Fôlego estão completamente erradas; Investida incompleta; Disparar com range inventado)
- [ ] **FIDE-03**: Corrigir proficiências de Esgrima (Armas Leves, Uma Mão, Duas Mãos com atributos errados; Especialização/Mestria dizem "acurácia" em vez de "+2/+5 dano")
- [ ] **FIDE-04**: Corrigir proficiências de Furtividade (Ataque Furtivo: +bônus no teste de ataque, não dano; Ataque Letal: dano adicional = bônus em Furtividade, não "condições"; Ataque Silencioso: descrição completamente errada)
- [ ] **FIDE-05**: Corrigir proficiências de Pontaria (Especialização/Mestria: "+2/+5 dano" não "acurácia"; Mirar: inclui "dano adicional igual valor em Pontaria")
- [ ] **FIDE-06**: Corrigir proficiência Poções de Alquimia (descrição errada: é sobre usar/reconhecer qualquer poção, não criar durante descanso)
- [ ] **FIDE-07**: Corrigir proficiências de Criatividade (Recapitular, Reciclar, Replicar: descrições completamente erradas vs docx)
- [ ] **FIDE-08**: Corrigir proficiências de Investigação (nomes errados: Selo de Encantamento e Selo de Invocação; Leitura: sobre ler/escrever, não "decifrar textos arcanos")
- [ ] **FIDE-09**: Corrigir proficiência Feiticeiro de Mecânica (falta vestimentas mágicas na descrição)
- [ ] **FIDE-10**: Corrigir proficiências de Sobrevivência (Acampamento, Harmonização, Forrageamento, Manufaturação, Treinamento: todas com descrição completamente errada — cada uma muda o teste de uma ação de descanso específica)
- [ ] **FIDE-11**: Corrigir proficiências espirituais (Provocar: teste é vs IP Espiritual, não VON; Coordenar: são 2+ aliados, não 1; Inspirar: bônus = valor em Expressão em uma perícia, não +1d20; Amedrontar: afugenta para não atacar, não desvantagem; Distrair: penalidade = valor em Lábia em uma perícia, não "remove reação")

### Fidelidade de Dados — Habilidades

- [ ] **FIDE-12**: Corrigir Destreza (usa "dW I–V" em vez dos dados reais: 1d4, 1d6, 1d8, 1d10, 1d12; também não menciona bastões)
- [ ] **FIDE-13**: Corrigir Golpe Duplo (falta "ou até dois alvos adjacentes" e "não aplicável a armas de duas mãos")
- [ ] **FIDE-14**: Corrigir Alcance (falta o efeito de sucesso: "impede avanço — move apenas metade do deslocamento")
- [ ] **FIDE-15**: Corrigir Fúria (falta triggers: "ao sofrer dano, falhar em teste de combate ou presenciar aliado cair")
- [ ] **FIDE-16**: Corrigir Grimório (descrição diz "através de grimórios ou observação" — livro diz exatamente o oposto: SEM precisar de livros)
- [ ] **FIDE-17**: Corrigir Modelagem (falta mecânica chave: quando morrer pode ser reativada na mesma cena)
- [ ] **FIDE-18**: Corrigir Toque Mortífero (trigger: "quando for alvo do ataque de uma criatura" — não genérico)

### Fidelidade de Documentação

- [ ] **FIDE-19**: Atualizar `GAME_RULES.md` seções §5 (Perícias/Proficiências) e §7 (Habilidades) para refletir todas as correções aplicadas

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
| FIDE-01 a FIDE-11 | TBD | Active |
| FIDE-12 a FIDE-18 | TBD | Active |
| FIDE-19 | TBD | Active |

*Last updated: 2026-05-16*
