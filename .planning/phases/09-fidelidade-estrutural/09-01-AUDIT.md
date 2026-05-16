# Audit Report — Phase 9 Plan 01

Auditoria completa: docx v0.4 vs regras.tsx §1-3 e §6-20, e GAME_RULES.md §§1-4, §§6-20.
Data: 2026-05-16

| Seção | Arquivo | Campo | Valor atual | Valor correto (docx) | Status |
|-------|---------|-------|-------------|----------------------|--------|
| §1 | regras.tsx | Branco — Valores | "Ordem, lei, proteção, cura, comunidade" | Ordem, lei, proteção, cura, comunidade | OK |
| §1 | regras.tsx | Branco — Aliadas/Inimigas | "Verde, Azul · vs Verm, Preto" | Verde e Azul; vs Vermelho, Preto | OK |
| §1 | regras.tsx | Verde — Aliadas/Inimigas | "Branco, Verm · vs Azul, Preto" | Branco e Vermelho; vs Azul, Preto | OK |
| §1 | regras.tsx | Vermelho — Aliadas/Inimigas | "Verde, Preto · vs Branco, Azul" | Verde e Preto; vs Branco, Azul | OK |
| §1 | regras.tsx | Preto — Aliadas/Inimigas | "Verm, Azul · vs Branco, Verde" | Vermelho e Azul; vs Branco, Verde | OK |
| §1 | regras.tsx | Azul — Aliadas/Inimigas | "Branco, Preto · vs Verm, Verde" | Branco e Preto; vs Vermelho, Verde | OK |
| §1 | regras.tsx | Guildas (B+V…Az+V) | 10 combinações presentes | 10 combinações do docx | OK |
| §1 | GAME_RULES.md | Tabela Cores (5 linhas) | Correta | Aliadas/Inimigas conferem com docx | OK |
| §1 | GAME_RULES.md | Guildas (10 combinações) | Corretas | Conferem com docx parágrafos 0123-0133 | OK |
| §2 | regras.tsx | Identidade — nota | "unidade de evolução — 1 dado daquela cor no atributo, +Vida, +Sabedoria, +Mana incolor" | Correto | OK |
| §2 | regras.tsx | Instâncias (CORPO/MENTE/ESPÍRITO) | Presentes com atributos corretos | Conferem com DOCX TABLE 13 e parágrafos | OK |
| §2 | regras.tsx | Pontos por Identidade — Vida | +10/+5/+6 | +10/+5/+6 (TABLE 31) | OK |
| §2 | regras.tsx | Pontos por Identidade — Sabedoria | +6/+10/+8 | +6/+10/+8 (TABLE 31) | OK |
| §2 | regras.tsx | Pontos por Identidade — Mana incolor | +1/+2/+3 | +1/+2/+3 (TABLE 31) | OK |
| §2 | GAME_RULES.md | Pontos por Identidade (tabela) | Corretos | Conferem com TABLE 31 | OK |
| §2 | GAME_RULES.md | Instâncias (tabela) | Corretas | Conferem com DOCX | OK |
| §3 | regras.tsx | FOR — descrição | "levantar peso, corpo a corpo, atletismo" | Levantar peso, atividades atléticas, lutar | OK |
| §3 | regras.tsx | REF — descrição | "velocidade, movimentação, reações" | Velocidade, movimentação, reações em combate | OK |
| §3 | regras.tsx | VIG — descrição | "resistir dor, condições físicas, venenos" | Suportar dor, resistir condições adversas, venenos | OK |
| §3 | regras.tsx | RAZ — descrição | "aprender, raciocínio lógico, conjuração mental" | Aprender, raciocínio lógico, conjuração mental | OK |
| §3 | regras.tsx | SEN — descrição | "perceber o mundo pelos cinco sentidos" | Perceber o mundo pelos cinco sentidos | OK |
| §3 | regras.tsx | CON — descrição | "foco, ações preparatórias, resistência mental" | Concentrar, ações preparatórias, sem ser interrompido | OK |
| §3 | regras.tsx | PRE — descrição | "notoriedade, intimidação, inspiração, camuflagem social" | Notoriedade, intimidação, inspiração, camuflagem social | OK |
| §3 | regras.tsx | INT — descrição | "perceber emoções, intenções, o mundo mágico" | Perceber emoções, intenções e o mundo mágico | OK |
| §3 | regras.tsx | VON — descrição | "resistir à influência alheia" | Resistir à vontade dos outros | OK |
| §3 | GAME_RULES.md | Atributos CORPO/MENTE/ESPÍRITO (tabelas) | Corretos | Conferem com TABLE 13 e parágrafos | OK |
| §6 | regras.tsx | Foco — cor | "Branco" | Branco | OK |
| §6 | regras.tsx | Canalização — cor | "Verde" | Verde | OK |
| §6 | regras.tsx | Domínios — cor | "Preto" | Preto | OK |
| §6 | regras.tsx | Memória — cor | "Azul" | Azul | OK |
| §6 | regras.tsx | Velocidade — cor | "Vermelho" | Vermelho | OK |
| §6 | regras.tsx | Todos balizadores — funções | Corretas | Conferem com docx | OK |
| §6 | GAME_RULES.md | Balizadores (tabela 5 linhas) | Corretos | Conferem com docx | OK |
| §7 | regras.tsx | Vida — função | "ao chegar a 0, testa Vigor para resistir à morte" | Correto (DOCX para 0535) | OK |
| §7 | regras.tsx | Necrosado — função | "Redutor permanente da Vida Total; não cura com descanso" | Redutor da vida total (DOCX para 0536) | OK |
| §7 | regras.tsx | Armadura/Manto/IP/Mana/Sabedoria | Corretos | Conferem com DOCX para 0538-0541 | OK |
| §7 | GAME_RULES.md | Outros Pontos (tabela 9 linhas) | Corretos | Conferem com docx | OK |
| §8 | regras.tsx | Dados base — nota | "N d20 → maior resultado + bônus da perícia" | Correto (DOCX para 0226) | OK |
| §8 | regras.tsx | dW — progressão | "todos ≥ 14 → dobra bônus (2dW=13, 3dW=12, 4dW=11, 5dW=10)" | Correto (TABLE 15 R0) | OK |
| §8 | regras.tsx | dG — mecânica | "Rola 2d10; pares livres; cada dG extra +1d10" | Correto (TABLE 15 R1) | OK |
| §8 | regras.tsx | dR — críticos | "19–20; 2dR=18–20 e 1–2, 3dR=17–20 e 1–2, 4dR=16–20 e 1–3, 5dR=15–20 e 1–3" | Correto (TABLE 15 R2) | OK |
| §8 | regras.tsx | dB — mecânica | "Para cada dado ≤ 5: recebe +1d4" | Correto (TABLE 15 R3) | OK |
| §8 | regras.tsx | dU — mecânica | "Resultado múltiplo de 5: rerrola enquanto continuar ×5" | Correto (TABLE 15 R4) | OK |
| §8 | regras.tsx | Resultados (SUCESSO, FRACASSO, etc.) | 6 resultados corretos | Conferem com TABLE 14 | OK |
| §4 | GAME_RULES.md | dR — expansão críticos | "2dR=18–20, 3dR=17–20, 4dR=16–20 e 1–3, 5dR=15–20 e 1–3" — faltava "e 1–2" para 2dR e 3dR | "2dR=18–20 e 1–2, 3dR=17–20 e 1–2" (TABLE 15 R2) | CORRIGIDO |
| §9 | regras.tsx | Fórmula | "N d20 → maior resultado + bônus de perícia vs. dificuldade" | Correto (DOCX para 0226) | OK |
| §9 | regras.tsx | Dificuldades (6 níveis) | Facílimo=5, Fácil=10, Normal=15, Difícil=20, Dificílimo=25, Excepcional=30 | Corretos (TABLE 32) | OK |
| §9 | regras.tsx | Modificadores | Bônus/Vantagem/—/Penalidade/Desvantagem/— | Corretos (TABLE 32) | OK |
| §9 | GAME_RULES.md | Dificuldades e modificadores | Corretos | Conferem com TABLE 32 | OK |
| §10 | regras.tsx | Tipos (Truque/Feitiço/Encantamento/Criatura) | Corretos | Conferem com DOCX para 0544-0548 | OK |
| §10 | regras.tsx | Graus (0-3) | Básico/Padrão/Avançado/Poderoso; custos corretos | Corretos (DOCX para 0549) | OK |
| §10 | regras.tsx | Notação mana (]/a/g/d/b/u/1,2,3…/x) | Corretos | Conferem com GAME_RULES.md §10 | OK |
| §10 | regras.tsx | Conjuração ([1]/[grau]/etc.) | Corretos | Conferem com DOCX para 0855-0857 | OK |
| §10 | GAME_RULES.md | Sistema de Mágicas (completo) | Correto | Confere com docx | OK |
| §11 | regras.tsx | 45 domínios (9/cor × 5) | Presentes | Conferem com TABLE 17 | OK |
| §11 | regras.tsx | Branco — 9 domínios | Alçada da Honra/Justiça/Autoridade/Armamento/Proteção/União/Bondade/Devoção/Luz | Corretos (TABLE 17) | OK |
| §11 | regras.tsx | Verde — 9 domínios | Trilha do Instinto/Predação/Adaptação/Subsistência/Ambiente/Vitalidade/Animais/Comunhão/Vegetação | Corretos (TABLE 17) | OK |
| §11 | regras.tsx | Vermelho — 9 domínios | Desígnio da Ira/Agilidade/Terra/Maldade/Raio/Ritos Primais/Guerra/Caos/Fogo | Corretos (TABLE 17) | OK |
| §11 | regras.tsx | Preto — 9 domínios | Arte da Dor/Sombras/Sangue/Bruxaria/Putrefação/Distúrbio/Corrupção/Necromancia/Danação | Corretos (TABLE 17) | OK |
| §11 | regras.tsx | Azul — 9 domínios | Ramo da Água/Ar/Transmutação/Conhecimento/Espaço-Tempo/Mente/Ilusão/Éter/Contramágica | Corretos (TABLE 17) | OK |
| §11 | GAME_RULES.md | 45 domínios (todos) | Corretos | Conferem com TABLE 17 | OK |
| §12 | regras.tsx | Canalização resultados (10+ a 30+) | 1d4/1d6/1d8/1d10/1d12 | Corretos (DOCX para 0560-0564) | OK |
| §12 | regras.tsx | Modificadores (++/+/0/–/––) | Corretos | Conferem com DOCX para 0566-0570 | OK |
| §12 | regras.tsx | Deserto | –– · –– · –– · –– · –– | Correto (TABLE 18 R1) | OK |
| §12 | regras.tsx | Urbano | + · – · – · + · – | Correto (TABLE 18 R2) | OK |
| §12 | regras.tsx | Natureza | – · + · + · – · + | Correto (TABLE 18 R3) | OK |
| §12 | regras.tsx | Fortaleza | + · – · — · — · — | Correto (TABLE 18 R4: W=+, G=–, R/B/U=neutro) | OK |
| §12 | regras.tsx | Planícies | ++ · + · – · – · — | Correto (TABLE 18 R5) | OK |
| §12 | regras.tsx | Floresta | — · + · — · — · — | Correto (TABLE 18 R6: W=neutro, G=+) | OK |
| §12 | regras.tsx | Selva densa | – · ++ · + · — · – | Correto (TABLE 18 R7) | OK |
| §12 | regras.tsx | Rochoso | — · — · + · — · – | Correto (TABLE 18 R8) | OK |
| §12 | regras.tsx | Vulcões | – · — · ++ · + · – | Correto (TABLE 18 R9) | OK |
| §12 | regras.tsx | Catacumbas | – · – · — · + · — | Correto (TABLE 18 R10) | OK |
| §12 | regras.tsx | Pântanos | – · – · — · ++ · + | Correto (TABLE 18 R11) | OK |
| §12 | regras.tsx | Fonte de água | — · — · – · — · + | Correto (TABLE 18 R12) | OK |
| §12 | regras.tsx | Alto mar | + · – · – · — · ++ | Correto (TABLE 18 R13) | OK |
| §12 | regras.tsx | Frio | — · — · – · — · + | Correto (TABLE 18 R14) | OK |
| §12 | regras.tsx | Calor | — · — · + · — · – | Correto (TABLE 18 R15) | OK |
| §12 | regras.tsx | Ventos fortes | — · – · – · — · + | Correto (TABLE 18 R16) | OK |
| §12 | regras.tsx | Chuva intensa | — · + · – · — · + | Correto (TABLE 18 R17) | OK |
| §12 | regras.tsx | Nevasca | – · –– · –– · – · ++ | Correto (TABLE 18 R18) | OK |
| §12 | regras.tsx | Tempestade | – · –– · ++ · – · + | Correto (TABLE 18 R19) | OK |
| §12 | regras.tsx | Dia | — · — · — · – · — | Correto (TABLE 18 R20) | OK |
| §12 | regras.tsx | Sol a pino | + · — · — · –– · — | Correto (TABLE 18 R21) | OK |
| §12 | regras.tsx | Noite | – · — · — · — · — | Correto (TABLE 18 R22) | OK |
| §12 | regras.tsx | Lua cheia | –– · — · — · + · — | Correto (TABLE 18 R23) | OK |
| §12 | regras.tsx | Eclipse solar | ++ · — · – · ++ · – | Correto (TABLE 18 R24) | OK |
| §12 | GAME_RULES.md | Floresta — W/G invertidos | "W=+, G=—" (errado) | W=neutro, G=+ (TABLE 18 R6) | CORRIGIDO |
| §12 | GAME_RULES.md | Fortaleza — ausente | Linha faltando | W=+, G=–, R/B/U=neutro | CORRIGIDO |
| §12 | GAME_RULES.md | Rochoso — ausente | Linha faltando | W/G=neutro, R=+, B=neutro, U=– | CORRIGIDO |
| §12 | GAME_RULES.md | Catacumbas — ausente | Linha faltando | W/G=–, R=neutro, B=+, U=neutro | CORRIGIDO |
| §12 | GAME_RULES.md | Fonte de água — ausente | Linha faltando | W/G=neutro, R=–, B=neutro, U=+ | CORRIGIDO |
| §12 | GAME_RULES.md | Eventos Climáticos — ausentes | Seção inteira faltando | 11 linhas de eventos climáticos (TABLE 18 R14-R24) | CORRIGIDO |
| §13 | regras.tsx | Adaga — dano/atributo/perícia | 1d4/REF/Esg[Leve]/Pont[Arremesso] | Correto (TABLE 20 R1) | OK |
| §13 | regras.tsx | Arco Curto | 1d6/REF/Pont[Arcos]/alcance 18m | Correto (TABLE 20 R2) | OK |
| §13 | regras.tsx | Arco Longo | 1d8/FOR/Pont[Arcos]/alcance 30m | Correto (TABLE 20 R3) | OK |
| §13 | regras.tsx | Bastão Curto | 1d4*/FOR/REF/AM | Correto (TABLE 20 R4) | OK |
| §13 | regras.tsx | Bastão Longo | 1d6*/FOR/REF/AM/3m | Correto (TABLE 20 R5) | OK |
| §13 | regras.tsx | Cajado | 1d6/RAZ/PRE/Pont[Condutores]/2 mãos/dano mágico | Correto (TABLE 20 R6) | OK |
| §13 | regras.tsx | Desarmado | 1d3*/FOR/AM | Correto (TABLE 20 R7) | OK |
| §13 | regras.tsx | Espada | 1d6/FOR/Esg[Uma Mão]/1d8 2 mãos | Correto (TABLE 20 R8) | OK |
| §13 | regras.tsx | Lança Curta | 1d6/REF/Esg[Uma Mão]/Pont[Arremesso]/18m | Correto (TABLE 20 R9) | OK |
| §13 | regras.tsx | Lança Longa | 1d10/REF/Esg[Duas Mãos]/3m | Correto (TABLE 20 R10) | OK |
| §13 | regras.tsx | Machado | 1d6/FOR/Esg[Leve]/Pont[Arremesso]/1d8 2 mãos | Correto (TABLE 20 R11) | OK |
| §13 | regras.tsx | Montante | 1d12/FOR/Esg[Duas Mãos] | Correto (TABLE 20 R12) | OK |
| §13 | regras.tsx | Varinha | 1d4/RAZ/PRE/Pont[Condutores]/1 mão/dano mágico | Correto (TABLE 20 R13) | OK |
| §13 | regras.tsx | Escudo de Mão | +1 IP Corp / permite desarmado | Correto (TABLE 21 R1) | OK |
| §13 | regras.tsx | Escudo de Bronze | +2 IP Corp / só armas leves/1 mão | Correto (TABLE 21 R2) | OK |
| §13 | regras.tsx | Escudo Rúnico | "+1M +1E" (IP Mental +1 / IP Esp +1) | Correto (TABLE 21 R3: –/+1/+1) | OK |
| §13 | regras.tsx | Vestimentas (6 itens) | Corretos | Conferem com TABLE 22 | OK |
| §13 | regras.tsx | Acessórios (5 itens) | Corretos | Conferem com TABLE 23 | OK |
| §13 | regras.tsx | Melhorias armas/vestimentas | Corretos | Conferem com DOCX para 0698-0703 | OK |
| §13 | regras.tsx | Propriedades elementais (10 entradas) | Corretos | Conferem com DOCX para 0724-0738 | OK |
| §13 | regras.tsx | Afiadores (10 combinações) | Corretos | Conferem com DOCX para 0668-0677 | OK |
| §13 | GAME_RULES.md | Armas (13 entradas) | Corretos | Conferem com TABLE 20 | OK |
| §13 | GAME_RULES.md | Escudos (3 entradas) | Corretos | Conferem com TABLE 21 | OK |
| §13 | GAME_RULES.md | Vestimentas (6 entradas) | Corretos | Conferem com TABLE 22 | OK |
| §13 | GAME_RULES.md | Acessórios (5 entradas) | Corretos | Conferem com TABLE 23 | OK |
| §14 | regras.tsx | Herbologia — cores/efeitos | Brancas=Curativos, Verdes=Imunizantes, Vermelhas=Estimulantes, Pretas=Danosos, Azuis=Adaptativos | Correto (DOCX para 0584-0588) | OK |
| §14 | regras.tsx | Receitas básicas (5 fórmulas) | 2B+1, 2V+1, 2R+1, 2Pr+1, 2Az+1 | Corretas (TABLE 19) | OK |
| §14 | regras.tsx | Proporções (7 entradas) | 1 erva a 4+ ervas | Corretas (DOCX para 0593-0612) | OK |
| §14 | regras.tsx | Soros (5 cores) | Branco/Verde/Vermelho/Preto/Azul | Corretos (DOCX para 0647-0651) | OK |
| §14 | regras.tsx | Catalizadores (5 cores) | Entrelaçar/Reforçar/Acelerar/Recapitular/Reciclar | Corretos (DOCX para 0653-0657) | OK |
| §14 | regras.tsx | Mineralogia — Bombas/Afiadores/Proteções | Resumo correto | Confere com DOCX para 0660-0683 | OK |
| §14 | GAME_RULES.md | Herbologia e Alquimia | Corretos | Conferem com docx | OK |
| §14 | GAME_RULES.md | Zoologia (Soros e Catalizadores) | Corretos | Conferem com DOCX para 0647-0657 | OK |
| §14 | GAME_RULES.md | Mineralogia | Correto | Confere com docx | OK |
| §15 | regras.tsx | Artefatos — 4 tipos | Objetos/Condutores/Equipamentos/Criaturas mecânicas | Corretos (DOCX para 0755) | OK |
| §15 | regras.tsx | Ativar [1] / Reparar | "custa mana incolor" / "CON [Mecânica]..." | Corretos (DOCX para 0758) | OK |
| §15 | GAME_RULES.md | Artefatos (completo) | Correto | Confere com docx | OK |
| §16 | regras.tsx | Classes f/E/D/C/B/A/S | Todas as colunas corretas | Conferem com TABLE 24 | OK |
| §16 | regras.tsx | Mecânica Atacar/Defender | "1d20 ≤ Poder" / "1d20 ≥ Resistência" | Corretos (DOCX para 0772-0773) | OK |
| §16 | regras.tsx | Habilidades de Criaturas (9) | Alcance/Amedrontar/Atropelar/Ímpeto/Incorpóreo/Iniciativa/Toque Mortífero/Vínculo/Voar | Corretos (DOCX para 0784-0792) | OK |
| §16 | GAME_RULES.md | Classes (tabela) | Correto | Confere com TABLE 24 | OK |
| §16 | GAME_RULES.md | Habilidades de Criaturas (9) | Corretas | Conferem com DOCX para 0784-0792 | OK |
| §17 | regras.tsx | Alado | "pode voar; imune a corpo a corpo de criaturas sem Voar/Alcance" | Correto (DOCX para 0741) | OK |
| §17 | regras.tsx | Congelado | "Imóvel; teste dificílimo (25) de Vigor [Atletismo]; a cada rodada que falhar, dificuldade diminui 1 nível" | Correto (DOCX para 0742) | OK |
| §17 | regras.tsx | Envenenado | "Acumula marcadores (efeitos progressivos 2/4/6/8/10)" | Correto (DOCX para 0743) | OK |
| §17 | regras.tsx | Incendiado | "1d6 dano ígneo/turno; acumula se repetido" | Correto (DOCX para 0749) | OK |
| §17 | regras.tsx | Molhado | "Desvantagem em testes corporais; vulnerável a elétrico" | Correto (DOCX para 0750) | OK |
| §17 | regras.tsx | Morrendo | "Com 0 vida; 3 testes de Vigor [Atletismo] para sobreviver" | Correto (DOCX para 0751) | OK |
| §17 | regras.tsx | Necrosado | "Vida Total reduzida pelo dano; não cura com descanso" | Correto (DOCX para 0752) | OK |
| §17 | regras.tsx | Veneno 2/4/6/8/10 marcadores | Todos corretos | Conferem com DOCX para 0744-0748 | OK |
| §17 | GAME_RULES.md | Congelado — "teste difícil" | "Imóvel; teste difícil de Vigor [Atletismo] por rodada para sair" (errado) | "teste dificílimo (25)... dificuldade diminui 1 nível" (DOCX para 0742) | CORRIGIDO |
| §17 | GAME_RULES.md | Alado/Envenenado/Incendiado/Molhado/Morrendo/Necrosado | Corretos | Conferem com docx | OK |
| §17 | GAME_RULES.md | Veneno — Marcadores | Corretos | Conferem com docx | OK |
| §18 | regras.tsx | Ações por turno | "1 movimentação + 1 operação + 1 reação + ações extras de Velocidade" | Correto (DOCX para 0834) | OK |
| §18 | regras.tsx | Movimentações (Deslocar/Esconder/Pegar) | Corretos | Conferem com DOCX para 0838-0840 | OK |
| §18 | regras.tsx | Operações (Atacar/Usar Item/Movimentar) | Corretos | Conferem com DOCX para 0842-0844 | OK |
| §18 | regras.tsx | Reações (Aparar/Contra-atacar/Esquivar/Disparar/Mirar) | Corretos | Conferem com DOCX para 0846-0850 | OK |
| §18 | regras.tsx | Manifestações (Ativar/Canalizar/Comandar/Conjurar/Lançar/Trucar) | Corretos | Conferem com DOCX para 0852-0857 | OK |
| §18 | GAME_RULES.md | Combate (completo) | Correto | Confere com docx | OK |
| §19 | regras.tsx | Descanso — nota | "recupera mínimo de mana + escolhe 2 ações adicionais" | Correto (DOCX para 0870) | OK |
| §19 | regras.tsx | 9 ações de descanso | Repousar/Praticar/Canalizar/Coletar/Produzir/Improvisar/Inscrever/Fabricar/Reparar | Corretos (DOCX para 0871-0917) | OK |
| §19 | regras.tsx | Resultados de cada ação | Todos corretos | Conferem com DOCX para 0872-0917 | OK |
| §19 | GAME_RULES.md | Descanso (tabela 9 ações) | Correto | Confere com docx | OK |
| §20 | regras.tsx | Nota Evolução | "acumulam afinidade (%) pelas ações; 100% = 1 Identidade; reinicia" | Correto (DOCX para 0799) | OK |
| §20 | regras.tsx | CORPO — 3 dificuldades | Fácil/Moderada/Difícil com % e dados | Corretos (TABLE 25) | OK |
| §20 | regras.tsx | MENTE — dificuldades | Simples/Complexa/Desafiadora — faltava "ou Xd10" e descrições | Simples (1 cena)/Complexa (1+ cenas)/Desafiadora (1+ sessões) com 3d10/7d10/10d10 (TABLE 27) | CORRIGIDO |
| §20 | regras.tsx | ESPÍRITO — dificuldades | Tranquila/Tensa/Turbulenta — faltava "ou Xd10" | Com 3d10/7d10/10d10 (TABLE 29) | CORRIGIDO |
| §20 | regras.tsx | Comportamentos × Cor (5 entradas) | Branco/Verde/Vermelho/Preto/Azul | Corretos (TABLE 26) | OK |
| §20 | GAME_RULES.md | MENTE dificuldades | Simples/Complexa/Desafiadora — faltava "ou Xd10" e descrições de tempo | Corrigido com (1 cena)/(1+ cenas)/(1+ sessões) e 3d10/7d10/10d10 | CORRIGIDO |
| §20 | GAME_RULES.md | ESPÍRITO dificuldades | Tranquila/Tensa/Turbulenta — faltava "ou Xd10" | Corrigido com 3d10/7d10/10d10 | CORRIGIDO |
| §20 | GAME_RULES.md | Comportamentos × Cor | Corretos | Conferem com TABLE 26 | OK |

## Resumo de Discrepâncias

| # | Arquivo | Seção | Tipo | Status |
|---|---------|-------|------|--------|
| 1 | GAME_RULES.md | §4 | dR: faltava "e 1–2" para 2dR e 3dR | CORRIGIDO |
| 2 | GAME_RULES.md | §12 | Floresta: W e G invertidos | CORRIGIDO |
| 3 | GAME_RULES.md | §12 | Fortaleza, Rochoso, Catacumbas, Fonte de água: linhas ausentes | CORRIGIDO |
| 4 | GAME_RULES.md | §12 | Eventos Climáticos: seção completa ausente (11 linhas) | CORRIGIDO |
| 5 | GAME_RULES.md | §17 | Congelado: "teste difícil" deveria ser "teste dificílimo (25)" | CORRIGIDO |
| 6 | GAME_RULES.md | §20 | MENTE: faltava "ou Xd10" e descrições de duração | CORRIGIDO |
| 7 | GAME_RULES.md | §20 | ESPÍRITO: faltava "ou Xd10" | CORRIGIDO |
| 8 | regras.tsx | §20 | MENTE: faltava "ou Xd10" e descrições de duração | CORRIGIDO |
| 9 | regras.tsx | §20 | ESPÍRITO: faltava "ou Xd10" | CORRIGIDO |
