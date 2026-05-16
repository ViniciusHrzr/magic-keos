# Magic no Universo Kéos — Referência do Sistema

> Versão 0.4 · Documento de referência gerado a partir do livro de regras e grimório oficial

---

## Sumário

1. [As Cinco Cores](#1-as-cinco-cores)
2. [Construção de Personagens](#2-construção-de-personagens)
3. [Atributos](#3-atributos)
4. [Mecânica de Dados](#4-mecânica-de-dados)
5. [Perícias](#5-perícias)
6. [Balizadores](#6-balizadores)
7. [Habilidades](#7-habilidades)
8. [Outros Pontos](#8-outros-pontos)
9. [Testes](#9-testes)
10. [Sistema de Mágicas](#10-sistema-de-mágicas)
11. [Domínios](#11-domínios)
12. [Canalização e Mana](#12-canalização-e-mana)
13. [Equipamentos](#13-equipamentos)
14. [Matérias-primas e Alquimia](#14-matérias-primas-e-alquimia)
15. [Artefatos](#15-artefatos)
16. [Criaturas](#16-criaturas)
17. [Condições](#17-condições)
18. [Combate](#18-combate)
19. [Descanso](#19-descanso)
20. [Evolução](#20-evolução)

---

## 1. As Cinco Cores

| Cor | Mana | Valores | Aliadas | Inimigas |
|-----|------|---------|---------|----------|
| **Branco** | Planícies/savanas | Ordem, lei, proteção, cura, comunidade | Verde, Azul | Vermelho, Preto |
| **Verde** | Florestas | Natureza, crescimento, força bruta, instinto | Branco, Vermelho | Azul, Preto |
| **Vermelho** | Montanhas/vulcões | Liberdade, fogo, impulso, criatividade | Verde, Preto | Branco, Azul |
| **Preto** | Pântanos | Poder, ambição, morte, individualismo | Vermelho, Azul | Branco, Verde |
| **Azul** | Ilhas/oceanos | Conhecimento, lógica, ilusão, manipulação | Branco, Preto | Vermelho, Verde |

### Combinações de Duas Cores (Guildas)

| Combinação | Guildo | Filosofia |
|-----------|--------|-----------|
| Branco + Verde | Selesnya | Comunidade |
| Verde + Vermelho | Gruul | Autenticidade |
| Vermelho + Preto | Rakdos | Independência |
| Preto + Azul | Dimir | Crescimento |
| Azul + Branco | Azorius | Estrutura |
| Branco + Vermelho | Boros | Heroísmo |
| Verde + Preto | Golgari | Profanação |
| Vermelho + Azul | Izzet | Criatividade |
| Preto + Branco | Orzhov | Tribalismo |
| Azul + Verde | Simic | Busca pela verdade |

---

## 2. Construção de Personagens

### Identidades

A **Identidade** é a unidade de evolução do personagem — uma "cor" adquirida ao longo da campanha e alocada em um atributo. Cada identidade em um atributo:

- Acrescenta 1 dado daquela cor para rolagens daquele atributo
- Define comportamento, personalidade e mágicas disponíveis
- Concede pontos de **Vida**, **Sabedoria** e **Mana incolor** conforme a Instância (ver tabela em §8)

### Instâncias

| Instância | Conceito | Atributos |
|-----------|----------|-----------|
| **CORPO** | Habilidades físicas, combate | Força (FOR), Reflexos (REF), Vigor (VIG) |
| **MENTE** | Inteligência, percepção, concentração | Razão (RAZ), Sentidos (SEN), Concentração (CON) |
| **ESPÍRITO** | Interpessoal, emocional, social | Presença (PRE), Intuição (INT), Vontade (VON) |

### Pontos por Identidade (por Instância)

| | CORPO | MENTE | ESPÍRITO |
|-|-------|-------|----------|
| Vida | +10 | +5 | +6 |
| Sabedoria | +6 | +10 | +8 |
| Mana incolor | +1 | +2 | +3 |

---

## 3. Atributos

Cada atributo pode ter até **5 identidades** (dados). O valor do atributo = número de d20 rolados em testes.

### CORPO

| Atributo | Código | Descrição |
|----------|--------|-----------|
| Força | FOR | Levantar peso, atividades atléticas, lutar corpo a corpo |
| Reflexos | REF | Velocidade, movimentação, reações em combate |
| Vigor | VIG | Resistir a dor, condições físicas adversas, venenos |

### MENTE

| Atributo | Código | Descrição |
|----------|--------|-----------|
| Razão | RAZ | Aprender, raciocínio lógico, conjuração mental |
| Sentidos | SEN | Perceber o mundo pelos cinco sentidos |
| Concentração | CON | Foco em tarefas, ações preparatórias, resistência mental |

### ESPÍRITO

| Atributo | Código | Descrição |
|----------|--------|-----------|
| Presença | PRE | Notoriedade, intimidação, inspiração, camuflagem social |
| Intuição | INT | Perceber emoções, intenções e o mundo mágico |
| Vontade | VON | Força de vontade, resistir à influência alheia |

---

## 4. Mecânica de Dados

- **Teste base**: rola N d20 (N = valor do atributo), escolhe o **maior** resultado, soma bônus da perícia
- **Cada cor de dado** tem mecânica própria:

| Cor | Dado | Característica Especial |
|-----|------|------------------------|
| Branco | dW | **Progressão**: se todos os dados ≥ 14, dobra o bônus de perícia. Margem diminui com mais dados (2dW=13, 3dW=12, 4dW=11, 5dW=10) |
| Verde | dG | Rola **2d10** em vez de d20, soma os valores. Pares livres entre dados. Cada dG extra adiciona +1d10 |
| Vermelho | dR | Crítico em **19–20** (expande com mais dados: 2dR=18–20 e 1–2, 3dR=17–20 e 1–2, 4dR=16–20 e 1–3, 5dR=15–20 e 1–3) |
| Preto | dB | Para cada dado ≤ 5: recebe **+1d4** ao resultado |
| Azul | dU | Se resultado é múltiplo de 5: pode **rerolar** o dado azul enquanto continuar múltiplo de 5 |

### Resultados Possíveis

| Condição | Resultado | Efeito |
|----------|-----------|--------|
| SUCESSO | > dificuldade | Realiza a ação |
| FRACASSO | < dificuldade | Não realiza a ação |
| SUCESSO CRÍTICO | 20 com vantagem | Realiza perfeitamente + bonificação |
| FRACASSO CRÍTICO | 1 com desvantagem | Realiza terrivelmente + consequência |
| SUCESSO, MAS… | > dificuldade com vantagem + 1 nos dados | Realiza, mas algo dá errado |
| FRACASSO, MAS… | < dificuldade com desvantagem + 20 nos dados | Não realiza, mas algo dá certo |

---

## 5. Perícias

Custo: 1 ponto de Sabedoria para nível 1, +N para cada nível seguinte (total para nível 10 = 55 pts).
Abrindo um domínio: concede nível 1 na perícia-chave daquele domínio.

### CORPO

| Perícia | Atributos Principais | Domínios-chave | Proficiências |
|---------|---------------------|---------------|---------------|
| **Artes Marciais** | FOR, REF, VIG, PRE | Ramo da Água, Alçada da Honra, Desígnio da Terra | Derrubar, Desarmar, Desviar, Fintar, Imobilizar; Aparar (reação, lv.2) |
| **Atletismo** | FOR, REF, VIG | Desígnio da Agilidade, Trilha da Adaptação, Trilha da Vitalidade | Investida, Prontidão, Fôlego; Disparar (reação, lv.1) |
| **Esgrima** | FOR, REF | Alçada da Justiça, Alçada da Autoridade, Arte da Dor | Armas Leves, Uma Mão, Duas Mãos, Especialização, Mestria; Contra-atacar (reação, lv.2) |
| **Furtividade** | REF | Arte das Sombras, Ramo da Transmutação, Arte da Danação | Ataque Furtivo, Ataque Letal, Ataque Silencioso; Esquivar (reação, lv.1) |
| **Pontaria** | REF, FOR, RAZ, PRE | Trilha da Predação, Ramo do Ar, Desígnio do Fogo | Arcos, Arremesso, Condutores, Especialização, Mestria; Mirar (reação, lv.2) |

### MENTE

| Perícia | Atributos Principais | Domínios-chave | Proficiências |
|---------|---------------------|---------------|---------------|
| **Alquimia** | RAZ | Arte da Bruxaria, Trilha da Subsistência, Alçada da Bondade | Herbologia, Mineralogia, Zoologia; Poções (lv.1) |
| **Criatividade** | RAZ | Desígnio do Caos, Desígnio do Raio, Ramo da Contramágica | Recapitular, Reciclar, Reforçar, Repartir, Replicar; Solução (lv.1) |
| **Investigação** | RAZ, SEN, CON | Ramo da Mente, Desígnio dos Ritos Primais, Arte do Sangue | Selo de Feitiço, Selo de Encantamento, Selo de Invocação; Leitura (lv.1) |
| **Mecânica** | RAZ, CON | Alçada do Armamento, Ramo do Conhecimento, Ramo do Espaço-Tempo | Artesão, Feiticeiro, Ferreiro; Artefatos (lv.1) |
| **Sobrevivência** | RAZ, SEN | Trilha do Ambiente, Trilha do Instinto, Arte da Putrefação | Acampamento, Harmonização, Forrageamento, Manufaturação, Treinamento; Coleta (lv.1) |

### ESPÍRITO

| Perícia | Atributos Principais | Domínios-chave | Proficiências |
|---------|---------------------|---------------|---------------|
| **Comunhão** | PRE, INT, VON | Trilha da Comunhão, Trilha dos Animais, Trilha da Vegetação | Provocar (ação livre, lv.3) |
| **Diplomacia** | PRE, INT, VON | Alçada da Devoção, Alçada da Proteção, Alçada da Luz | Coordenar (ação livre, lv.3) |
| **Expressão** | PRE, INT, VON | Desígnio da Guerra, Ramo do Éter, Alçada da União | Inspirar (ação livre, lv.3) |
| **Intimidação** | PRE, INT, VON | Arte da Corrupção, Arte da Necromancia, Desígnio da Ira | Amedrontar (ação livre, lv.3) |
| **Lábia** | PRE, INT, VON | Ramo da Ilusão, Arte do Distúrbio, Desígnio da Maldade | Distrair (ação livre, lv.3) |

---

## 6. Balizadores

Adquiridos como perícias (custo progressivo, máx. 10 níveis). Cada cor tem um balizador-chave.

| Balizador | Cor-chave | Função |
|-----------|-----------|--------|
| **Foco** | Branco | Máximo de permanentes (encantamentos + criaturas) em campo |
| **Canalização** | Verde | Vezes/dia que pode canalizar mana colorido |
| **Domínios** | Preto | Domínios mágicos conhecidos |
| **Memória** | Azul | Feitiços memorizados (prontos para lançar sem conjurar) |
| **Velocidade** | Vermelho | Ações bônus por cena (restauradas no início de cada cena) |

---

## 7. Habilidades

Adquiridas com Sabedoria, requerem pré-requisitos. Concedem reações especiais ou bônus fixos.

### Corporais

| Habilidade | Pré-requisito | Custo (SAB) | Reação |
|-----------|--------------|-------------|--------|
| Alcance | REF(2); Pontaria(+5) | 5 | Impedir [1]: ataque à distância quando alvo avança; sucesso = metade do deslocamento |
| Ameaçar | REF(2); Furtividade(+5) | 5 | — (passiva): alvo engajado não pode reagir |
| Atropelar | FOR(3); AM(+5) ou Esg(+5) | 5/10/15 | — (passiva): +1dX dano, distribuível em adjacentes |
| Destreza | FOR; AM(+2/+4/+6/+8) | 2/3/4/5 | — (passiva): dano desarmado e bastões sobe (1d4 · 1d6 · 1d8 · 1d10 · 1d12) |
| Golpe Duplo | REF(3); AM/Esg/Pont(+5) | 5 | — (passiva): dois ataques consecutivos; até dois alvos adjacentes; não se aplica a armas de duas mãos |
| Iniciativa | REF(2); Esgrima(+5) | 5 | Impugnar [1]: ataca antes do atacante |
| Ímpeto | REF(2); Atletismo(+5) | 5 | — (passiva): age primeiro + Velocidade para ações padrão |
| Vigilância | REF(2); Pericia Corporal(+5) | 5 | — (passiva): reações ilimitadas (custa 1 ação cada) |

### Mentais

| Habilidade | Pré-requisito | Custo (SAB) | Efeito |
|-----------|--------------|-------------|--------|
| Fetiche | SEN(1)+CON(1); Criatividade(+5) | 5/10/15 | Reforça mágicas de 1 domínio sem custo de mana (até 3 fetiches) |
| Grimório | RAZ(1)+CON(1); Investigação(+5) | 5 (+ 1/3/6 por magia) | Aprende mágicas fora do domínio autodidata |
| Mixologia | RAZ(1)+SEN(1); Alquimia(+5) | 5 (+ 1/3 por receita) | Cria poções mágicas personalizadas |
| Modelagem | RAZ(1)+CON(1); Mecânica(+5) | 5 (+ 1–7 por modelo) | Cria criatura artefato; ao morrer pode ser reativada na mesma cena |
| Travessia | SEN(1)+CON(1); Sobrevivência(+5) | 5/10/15 | Vantagem em todos os testes no terreno escolhido |

### Espirituais

| Habilidade | Pré-requisito | Custo (SAB) | Reação |
|-----------|--------------|-------------|--------|
| Fúria | VON(3); Expressão(+6) | 6 | Enfurecer [1]: aciona ao sofrer dano, falhar em combate ou presenciar aliado cair; +1 ação padrão de ataque/turno, sem reações |
| Regenerar | VON(3); Comunhão(+6) | 6 | Regenerar [1]: testa VON[COM] vs. agressor; sucesso = cura total +Xd6 |
| Salvaguarda | INT(3); Diplomacia(+6) | 6 | Resguardar [1]: testa INT[DIP] vs. mago; sucesso = imune à mágica |
| Toque Mortífero | VON(3); Intimidação(+6) | 6 | Abater [1]: aciona quando for alvo de ataque; testa VON[INT] vs. criatura ≤ Classe B; destrói |
| Vidência | INT(3); Lábia(+6) | 6 | Antever [1]: testa INT[LAB] vs. IP Esp.; desvantagem na ação declarada |

---

## 8. Outros Pontos

| Ponto | Função |
|-------|--------|
| **Vida** | Pontos de vida total; ao chegar a 0, testa Vigor para resistir à morte |
| **Necrosado** | Redutor permanente da Vida Total (dano necrotizante) |
| **Armadura** | Reduz 1 pt de dano físico por ponto |
| **Manto** | Reduz 1 pt de dano mágico por ponto |
| **IP Corporal** | Índice de Proteção Corporal (bônus de reação/defesa física) |
| **IP Mental** | Índice de Proteção Mental |
| **IP Espiritual** | Índice de Proteção Espiritual |
| **Mana** | Reserva de mana colorido (branco/verde/vermelho/preto/azul) + incolor |
| **Sabedoria** | Pontos para comprar perícias, habilidades e mágicas |

---

## 9. Testes

**Fórmula**: Rola N d20 (N = valor do atributo) → maior resultado + bônus de perícia vs. dificuldade

| Dificuldade | Valor | Modificador |
|-------------|-------|-------------|
| Facílimo | 5 | bônus positivo [+X] no resultado |
| Fácil | 10 | vantagem (+1d20) |
| Normal | 15 | — |
| Difícil | 20 | penalidade [-X] no resultado |
| Dificílimo | 25 | desvantagem (-1d20) |
| Excepcional | 30 | — |

---

## 10. Sistema de Mágicas

### Tipos de Mágica

| Tipo | Símbolo | Funcionamento |
|------|---------|---------------|
| **Truque** | [T] | Grau 0; custo `]`; livre — 1º truque/turno não gasta ação |
| **Feitiço** | [F] | Dissipa após efeito; conjurar [1] + lançar [1]; pode armazenar na Memória |
| **Encantamento** | [E] | Permanente em campo; ocupa slot de Foco; conjurar [grau] ações |
| **Criatura** | [C] | Permanente em campo; ocupa slot de Foco; só 1 invocação por criatura/cena |

### Graus

| Grau | Poder | Custo de Sabedoria para aprender |
|------|-------|----------------------------------|
| 0 (Truque) | Básico, gratuito | Incluído com o domínio |
| 1 | Padrão | Incluído com o domínio |
| 2 | Avançado | 4 pts de Sabedoria |
| 3 | Poderoso | 8 pts de Sabedoria |

### Notação de Custo de Mana

| Símbolo | Mana |
|---------|------|
| `]` | Truque (gratuito) |
| `a` | 1 mana branco (W) |
| `g` | 1 mana verde (G) |
| `d` | 1 mana vermelho (R) |
| `b` | 1 mana preto (B) |
| `u` | 1 mana azul (U) |
| `1`, `2`, `3`… | mana incolor genérico |
| `x` | variável (jogador decide quanto pagar) |

Exemplos: `"a"` = {W} · `"1a"` = {1}{W} · `"2aa"` = {2}{W}{W} · `"4aaa"` = {4}{W}{W}{W}

### Conjuração e Lançamento

- **Conjurar [1]**: feitiços gastam 1 ação; encantamentos e invocações gastam [grau] ações
- **Lançar [1]**: lança mágica conjurada neste turno ou armazenada na Memória
- **Trucar [0]**: 1º truque do turno não gasta ação
- Feitiços podem ser armazenados na **Memória** (limite = balizador Memória)
- Encantamentos/invocações ocupam **Foco** (limite = balizador Foco)

---

## 11. Domínios

45 domínios no total (9 por cor × 5 cores), organizados por Instância e Atributo-chave.

### Branco

| Instância | Atributo | Domínio | Perícia-chave |
|-----------|----------|---------|---------------|
| CORPO | FOR | Alçada da Honra | Artes Marciais |
| CORPO | REF | Alçada da Justiça | Esgrima |
| CORPO | VIG | Alçada da Autoridade | Esgrima |
| MENTE | RAZ | Alçada do Armamento | Mecânica |
| MENTE | SEN | Alçada da Proteção | Diplomacia |
| MENTE | CON | Alçada da União | Expressão |
| ESPÍRITO | PRE | Alçada da Bondade | Alquimia |
| ESPÍRITO | INT | Alçada da Devoção | Diplomacia |
| ESPÍRITO | VON | Alçada da Luz | Diplomacia |

### Verde

| Instância | Atributo | Domínio | Perícia-chave |
|-----------|----------|---------|---------------|
| CORPO | FOR | Trilha do Instinto | Artes Marciais |
| CORPO | REF | Trilha da Predação | Pontaria |
| CORPO | VIG | Trilha da Adaptação | Atletismo |
| MENTE | RAZ | Trilha da Subsistência | Alquimia |
| MENTE | SEN | Trilha do Ambiente | Sobrevivência |
| MENTE | CON | Trilha da Vitalidade | Atletismo |
| ESPÍRITO | PRE | Trilha dos Animais | Comunhão |
| ESPÍRITO | INT | Trilha da Comunhão | Comunhão |
| ESPÍRITO | VON | Trilha da Vegetação | Comunhão |

### Vermelho

| Instância | Atributo | Domínio | Perícia-chave |
|-----------|----------|---------|---------------|
| CORPO | FOR | Desígnio da Ira | Expressão |
| CORPO | REF | Desígnio da Agilidade | Atletismo |
| CORPO | VIG | Desígnio da Terra | Artes Marciais |
| MENTE | RAZ | Desígnio da Maldade | Lábia |
| MENTE | SEN | Desígnio do Raio | Criatividade |
| MENTE | CON | Desígnio dos Ritos Primais | Investigação |
| ESPÍRITO | PRE | Desígnio da Guerra | Expressão |
| ESPÍRITO | INT | Desígnio do Caos | Criatividade |
| ESPÍRITO | VON | Desígnio do Fogo | Pontaria |

### Preto

| Instância | Atributo | Domínio | Perícia-chave |
|-----------|----------|---------|---------------|
| CORPO | FOR | Arte da Dor | Esgrima |
| CORPO | REF | Arte das Sombras | Furtividade |
| CORPO | VIG | Arte do Sangue | Investigação |
| MENTE | RAZ | Arte da Bruxaria | Alquimia |
| MENTE | SEN | Arte da Putrefação | Sobrevivência |
| MENTE | CON | Arte do Distúrbio | Lábia |
| ESPÍRITO | PRE | Arte da Corrupção | Intimidação |
| ESPÍRITO | INT | Arte da Necromancia | Intimidação |
| ESPÍRITO | VON | Arte da Danação | Furtividade |

### Azul

| Instância | Atributo | Domínio | Perícia-chave |
|-----------|----------|---------|---------------|
| CORPO | FOR | Ramo da Água | Artes Marciais |
| CORPO | REF | Ramo do Ar | Pontaria |
| CORPO | VIG | Ramo da Transmutação | Furtividade |
| MENTE | RAZ | Ramo do Conhecimento | Mecânica |
| MENTE | SEN | Ramo do Espaço-Tempo | Mecânica |
| MENTE | CON | Ramo da Mente | Investigação |
| ESPÍRITO | PRE | Ramo da Ilusão | Lábia |
| ESPÍRITO | INT | Ramo do Éter | Expressão |
| ESPÍRITO | VON | Ramo da Contramágica | Criatividade |

---

## 12. Canalização e Mana

### Como Canalizar

Ação de descanso: teste de **Vontade [Comunhão]**

| Resultado | Mana obtido |
|-----------|-------------|
| 10+ | 1d4 de mana colorido |
| 15+ | 1d6 |
| 20+ | 1d8 |
| 25+ | 1d10 |
| 30+ | 1d12 |

### Modificadores de Ambiente

| Símbolo | Dados | Resultado |
|---------|-------|-----------|
| ++ | 3 dados, fica maior | Muito abundante |
| + | 2 dados, fica maior | Abundante |
| 0 | Normal | Neutro |
| – | 2 dados, fica menor | Escasso |
| –– | 3 dados, fica menor | Muito escasso |

### Ambientes Físicos (resumo)

| Ambiente | W | G | R | B | U |
|----------|---|---|---|---|---|
| Deserto | –– | –– | –– | –– | –– |
| Urbano | + | – | – | + | – |
| Natureza | – | + | + | – | + |
| Fortaleza | + | – | — | — | — |
| Planícies | ++ | + | – | – | — |
| Floresta | — | + | — | — | — |
| Selva densa | – | ++ | + | — | – |
| Rochoso | — | — | + | — | – |
| Vulcões | – | — | ++ | + | – |
| Catacumbas | – | – | — | + | — |
| Pântanos | – | – | — | ++ | + |
| Fonte de água | — | — | – | — | + |
| Alto mar | + | – | – | — | ++ |

### Eventos Climáticos

| Evento | W | G | R | B | U |
|--------|---|---|---|---|---|
| Frio | — | — | – | — | + |
| Calor | — | — | + | — | – |
| Ventos fortes | — | – | – | — | + |
| Chuva intensa | — | + | – | — | + |
| Nevasca | – | –– | –– | – | ++ |
| Tempestade | – | –– | ++ | – | + |
| Dia | — | — | — | – | — |
| Sol a pino | + | — | — | –– | — |
| Noite | – | — | — | — | — |
| Lua cheia | –– | — | — | + | — |
| Eclipse solar | ++ | — | – | ++ | – |

### Mana Colorido × Identidades

A **Reserva de mana** é composta por:
- Mana incolor: conforme Identidades alocadas (ver §2)
- Mana colorido: canalizando do ambiente

---

## 13. Equipamentos

### Armas

| Arma | Dano | Atributo | Perícia | Especial |
|------|------|----------|---------|----------|
| Adaga | 1d4 | REF | Esgrima [Leve] / Pont. [Arremesso] | Alcance curto (9m) |
| Arco Curto | 1d6 | REF | Pontaria [Arcos] | Alcance médio (18m) |
| Arco Longo | 1d8 | FOR | Pontaria [Arcos] | Alcance longo (30m) |
| Bastão Curto | 1d4* | FOR/REF | Artes Marciais | *Destreza aumenta dano |
| Bastão Longo | 1d6* | FOR/REF | Artes Marciais | Alcance próximo (3m); *Destreza |
| Cajado | 1d6 | RAZ/PRE | Pontaria [Condutores] — duas mãos | Alcance médio; dano mágico |
| Desarmado | 1d3* | FOR | Artes Marciais | *Destreza aumenta dano |
| Espada | 1d6 | FOR | Esgrima [Uma Mão] | 1d8 com duas mãos |
| Lança Curta | 1d6 | REF | Esgrima [Uma Mão] / Pont. [Arremesso] | Alcance médio (18m) |
| Lança Longa | 1d10 | REF | Esgrima [Duas Mãos] | Alcance próximo (3m) |
| Machado | 1d6 | FOR | Esgrima [Leve] / Pont. [Arremesso] | 1d8 com duas mãos; alcance curto (9m) |
| Montante | 1d12 | FOR | Esgrima [Duas Mãos] | — |
| Varinha | 1d4 | RAZ/PRE | Pontaria [Condutores] — uma mão | Alcance curto; dano mágico |

### Escudos

| Escudo | IP Corporal | IP Mental | IP Espiritual | Especial |
|--------|-------------|-----------|---------------|---------|
| Escudo de Mão | +1 | — | — | Permite ataque desarmado |
| Escudo de Bronze | +2 | — | — | Só com armas leves/uma mão |
| Escudo Rúnico | — | +1 | +1 | Só com armas leves/uma mão |

### Vestimentas

| Vestimenta | IP Corp | IP Ment | IP Esp |
|-----------|---------|---------|--------|
| Farda de Combatente | +1 | — | — |
| Farda de Cavaleiro | +2 | — | — |
| Túnica de Aprendiz | — | +1 | — |
| Túnica de Sábio | — | +2 | — |
| Traje da Nobreza | — | — | +1 |
| Traje da Realeza | — | — | +2 |

### Acessórios Básicos

| Acessório | Velocidade | Memória | Foco | Canalização | Domínio |
|-----------|-----------|---------|------|------------|---------|
| Bracelete de Prata | +1 | — | — | — | — |
| Tiara de Prata | — | +1 | — | — | — |
| Colar de Prata | — | — | +1 | — | — |
| Brincos de Prata | — | — | — | +1 | — |
| Broche de Prata | — | — | — | — | +1 |

### Melhorias (máx. 3 por item)

**Armas**: W=Acurácia+1 | G=Acurácia madeira+1 | R=Dano físico+1 | B=Dado dano+1 | U=Dano mágico+1

**Vestimentas**: W=Armadura+1 | G=Manto+1 | R=IP Corp.+1 | B=IP Esp.+1 | U=IP Mental+1

### Propriedades Elementais

| Cor | Propriedade | Efeito |
|-----|------------|--------|
| Branco | Sagrado | 2× dano em profanas; normal em Incorpóreos |
| Branco | Vinculado | Recupera 50% do dano causado como vida |
| Verde | Ácido | Ignora Armadura e Manto |
| Verde | Venenoso | Atribui condição "Envenenado" |
| Vermelho | Elétrico | Não pode ser reagido |
| Vermelho | Ígneo | 30% de chance de "Incendiado" |
| Preto | Necrotizante | Diminui Vida Total (condição "Necrosado") |
| Preto | Profano | 2× dano em sagradas; normal em Incorpóreos |
| Azul | Gélido | 30% de chance de "Congelado" |
| Azul | Hídrico | Atribui condição "Molhado" |

### Afiadores (combinações de minerais)

| Combinação | Dano Concedido |
|-----------|---------------|
| W+B {WWB} | Vinculado |
| W+G {WWG} | Sagrado |
| G+B {GGB} | Venenoso |
| G+R {GGR} | Ácido |
| R+W {RRW} | Ígneo |
| R+U {RRU} | Elétrico |
| B+R {BBR} | Profano |
| B+U {BBU} | Necrotizante |
| U+W {UUW} | Gélido |
| U+G {UUG} | Hídrico |

---

## 14. Matérias-primas e Alquimia

### Herbologia (Ervas)

| Cor | Efeito |
|-----|--------|
| Brancas | Curativos |
| Verdes | Imunizantes |
| Vermelhas | Estimulantes |
| Pretas | Danosos |
| Azuis | Adaptativos |

**Receitas básicas (3 ervas)**:
- 2 brancas + 1: cura 1d8+3 (pura) ou 1d6+2 + remoção de condição
- 2 verdes + 1: resistência a danos
- 2 vermelhas + 1: bônus em balizadores (Foco/Velocidade/Memória) ou Dano
- 2 pretas + 1: causa condições
- 2 azuis + 1: bônus de IP

**Proporções**:
- 1 erva = efeito brando
- 2 ervas (2/0) = efeito moderado; (1/1) = poção de mana branda
- 3 ervas (3/0/0) = potente; (2/1/0) = especializado; (1/1/1) = mana moderada
- 4+ ervas = efeitos superiores / poções de mana

### Zoologia (Animais)

**Soros** (mutações temporárias):
| Cor | Habilidades concedidas |
|-----|----------------------|
| Branco | Voar, Vínculo, Iniciativa, Vigilância |
| Verde | Atropelar, Regenerar |
| Vermelho | Ímpeto, Iniciativa |
| Preto | Toque Mortífero, Amedrontar, Regenerar |
| Azul | Mergulhar, Voar, Vidência |

**Catalizadores** (de ossadas — potencializa mágicas):
| Cor | Efeito |
|-----|--------|
| Branco | Entrelaçar: une efeitos de 2 mágicas |
| Verde | Reforçar: potencializa dano/alcance/duração |
| Vermelho | Acelerar: reduz tempo de conjuração |
| Preto | Recapitular: replica mágica já conjurada |
| Azul | Reciclar: modifica características da mágica |

**Complexidade dos animais**: Insetos < Peixes/Anfíbios < Répteis < Aves < Mamíferos

### Mineralogia

**Bombas**: causam efeitos em área
**Afiadores**: atribuem tipo de dano a armas (ver tabela §13)
**Proteções**: {WWW/GGG/RRR/BBB/UUU} = Proteção contra cor correspondente

---

## 15. Artefatos

Objetos mágicos com **Durabilidade** (número de usos antes de precisar reparo).

| Tipo | Produzido por |
|------|--------------|
| Objetos (acessórios, lanternas, joias) | Artesãos |
| Condutores mágicos (varinhas, cajados) | Feiticeiros |
| Equipamentos (armas, escudos, armaduras) | Ferreiros |
| Criaturas mecânicas | Moldadores |

- **Ativar** [1]: custa mana incolor
- **Reparar**: Concentração [Mecânica] em descanso; 10+=1, 15+=2, 20+=3, 25+=4, 30+=5 cargas

---

## 16. Criaturas

### Tabela de Classes

| Classe | Grau | Custo | ♡ Vida | ♢ Resist. | ♤ Poder | ♧ Dano | Durab. |
|--------|------|-------|--------|-----------|---------|--------|--------|
| f | 1 | {1} | 1–4 | 10 | 1d20 | 1d2 | 1 |
| E | 1 | {2} | 4–8 | 11 | 1d20+1 | 1d4 | 2–3 |
| D | 1–2 | {3} | 8–14 | 12 | 2d20+1 | 1d6 | 4–5 |
| C | 2 | {4–5} | 14–20 | 13 | 2d20+3 | 1d8 | 6–7 |
| B | 3 | {6–7} | 20–26 | 14 | 3d20+3 | 1d10 | 8–9 |
| A | 3 | {8–9} | 26–32 | 15 | 3d20+5 | 1d12 | 10 |
| S | — | — | ? | ? | ? | ? | ? |

### Mecânica de Ataque de Criaturas

- **Atacar**: controlador rola 1d20 e deve tirar ≤ valor de Poder da criatura
- **Defender**: alvo rola 1d20 e deve tirar ≥ Resistência da criatura

### Habilidades de Criaturas

| Habilidade | Efeito |
|-----------|--------|
| Alcance | Atinge criaturas com Voar |
| Amedrontar | Criaturas não atacam espontaneamente; bônus de dano por Classe |
| Atropelar | Excesso de dano vai ao controlador |
| Ímpeto | Sem enjoo de invocação |
| Incorpóreo | Imune a físico + condições; vulnerável a sagrado/profano |
| Iniciativa | Sempre ataca primeiro em confrontos |
| Toque Mortífero | Destrói criaturas de mesma classe ou inferior |
| Vínculo com a vida | Controlador cura = dano causado pela criatura |
| Voar | Condição Alado; só atacável por quem também tiver Voar/Alcance |

---

## 17. Condições

| Condição | Efeito |
|---------|--------|
| **Alado** | Pode voar; imune a corpo a corpo de criaturas sem Voar/Alcance |
| **Congelado** | Imóvel; teste dificílimo (25) de Vigor [Atletismo]; a cada rodada que falhar, dificuldade diminui 1 nível |
| **Envenenado** | Acumula marcadores de veneno (efeitos progressivos 2/4/6/8/10) |
| **Incendiado** | 1d6 dano ígneo/turno; acumula se repetido |
| **Molhado** | Desvantagem em testes corporais; vulnerável a elétrico |
| **Morrendo** | Com 0 vida; 3 testes de Vigor [Atletismo] para sobreviver |
| **Necrosado** | Vida Total reduzida pelo dano; não cura com descanso |

### Veneno — Marcadores

| Marcadores | Efeito |
|-----------|--------|
| 2 | Curas recuperam 50% |
| 4 | Descanso: 1 ação a menos |
| 6 | Desvantagem (-1d20) em todos os testes |
| 8 | Combate: 1 ação a menos/turno |
| 10 | Cai imediatamente (condição Morrendo) |

---

## 18. Combate

**Ações por turno**: 1 movimentação + 1 operação + 1 reação + ações extras de Velocidade

### Ações de Movimentação
| Ação | Custo | Efeito |
|------|-------|--------|
| Deslocar-se | [1] | Move até 9m |
| Esconder-se | [1] | REF [Furtividade]; necessário para ataque surpresa |
| Pegar | [1] | Sacar arma, pegar item, entregar objeto |

### Operações (Ações Padrão)
| Ação | Custo | Efeito |
|------|-------|--------|
| Atacar | [1] | Golpe físico |
| Usar Item | [1] | Poções, bombas, outros itens |
| Movimentar-se | [1] | Substitui operação por movimento extra |

### Reações
| Reação | Custo | Efeito |
|--------|-------|--------|
| Aparar | [1] | REF [Artes Marciais] oposto; sucesso = metade dano + manobra |
| Contra-atacar | [1] | Se atacante falhar: ataque de REF [Esgrima] |
| Esquivar-se | [1] | REF [Furtividade] oposto; sucesso = zero dano |
| Disparar | [1] | Movimentação extra com teste de [Atletismo] |
| Mirar | [1] | Bônus ao próximo teste de [Pontaria] |

### Manifestações (Ações Mágicas)
| Ação | Custo | Efeito |
|------|-------|--------|
| Ativar | [1] | Ativa efeito de artefato |
| Canalizar | [3] | Canaliza mana colorida; gasta 1 Canalização |
| Comandar | [1] | Ativa habilidade de criatura |
| Conjurar | [1]/[grau] | Feitiço=[1]; Encantamento/Invocação=[grau] ações |
| Lançar | [1] | Lança mágica conjurada ou da Memória |
| Trucar | [0] | Lança truque; 1º por turno = gratuito |

---

## 19. Descanso

Em cada descanso: recupera mínimo de mana + escolhe **2 ações adicionais**:

| Ação | Teste | Resultado |
|------|-------|-----------|
| **Repousar** | VIG [Atletismo] | 10+=20% vida · 15+=40% · 20+=60% · 25+=80% · 30+=100% |
| **Praticar** | CON [AM / Inv / Lábia] | 10+=1 SAB · 15+=2 · 20+=3 · 25+=4 · 30+=5 |
| **Canalizar** | VON [Comunhão] | 10+=1d4 mana · 15+=1d6 · 20+=1d8 · 25+=1d10 · 30+=1d12 |
| **Coletar** | RAZ [Sobrevivência] | 10+=1 matéria · 15+=2 · 20+=3 · 25+=4 · 30+=5 |
| **Produzir** | RAZ [Alquimia] | falha=efeito reduzido · 10+=pretendido · 20+=potencializado |
| **Improvisar** | RAZ [Criatividade] | falha=instável/1 cena · 10+=1 cena · 20+=3 cenas |
| **Inscrever** | RAZ [Investigação] | falha=reduzido · 10+=pretendido · 20+=potencializado |
| **Fabricar** | RAZ [Mecânica] | falha=0,5 etapa · 10+=1 etapa · 20+=2 etapas |
| **Reparar** | CON [Mecânica] | 10+=1 carga · 15+=2 · 20+=3 · 25+=4 · 30+=5 |

---

## 20. Evolução

### Afinidade e Identidades

- Personagens acumulam **afinidade de cor** (%) pelas suas ações durante a sessão
- Ao atingir **100%** em uma cor: recebe 1 **Identidade** daquela cor para alocar em qualquer atributo
- A contagem reinicia do zero

### Tipos de Cena e Afinidade

| Cena | Dificuldade | Afinidade |
|------|------------|-----------|
| CORPO (combate/físico) | Fácil (1–3 turnos) | 20% ou 3d10 |
| CORPO | Moderada (4–8 turnos) | 50% ou 7d10 |
| CORPO | Difícil (9+ turnos) | 80% ou 10d10 |
| MENTE (investigação) | Simples (1 cena) | 20% ou 3d10 |
| MENTE | Complexa (1+ cenas) | 50% ou 7d10 |
| MENTE | Desafiadora (1+ sessões) | 80% ou 10d10 |
| ESPÍRITO (social) | Tranquila | 20% ou 3d10 |
| ESPÍRITO | Tensa | 50% ou 7d10 |
| ESPÍRITO | Turbulenta | 80% ou 10d10 |

### Comportamentos × Afinidade de Cor (Combate)

| Comportamento | Cor |
|--------------|-----|
| Estratégico, protetor, líder, autoritário | Branco |
| Linha de frente, resistente, instintivo, brutal | Verde |
| Rápido, impulsivo, emocional, sem cautela | Vermelho |
| Furtivo, oportunista, priorizou sobrevivência | Preto |
| Evitou confronto direto, explorou fraquezas, tático | Azul |

---

## Referências Rápidas

### Grimório — Estrutura dos Dados (`data/grimorio.json`)

```json
{
  "nome": "Nome da Mágica",
  "cor": "white | green | red | black | blue",
  "dominio": "Nome do Domínio",
  "atributo": "FOR | REF | VIG | RAZ | SEN | CON | PRE | INT | VON",
  "grau": 0 | 1 | 2 | 3,
  "custo": "notação de mana (ex: '1a', '2aa', ']')",
  "tipo": "[T] | [E] | [F] | [C]",
  "efeito": "Descrição completa do efeito"
}
```

### Tabela de Atributos Resumida

```
CORPO:   FOR · REF · VIG
MENTE:   RAZ · SEN · CON
ESPÍRITO: PRE · INT · VON
```

### Dados por Cor

```
Branco (dW)   Verde (dG)   Vermelho (dR)   Preto (dB)   Azul (dU)
Progressão    2d10 + pares  Crit 19–20+     +1d4 se ≤5   Rerrolar em ×5
```

---

_Última atualização: 2026-05-15 · Extraído de "Magic no Universo Kéos v.0.4.docx" e "Grimório Total v.0.4.xlsx"_
