export type InstanciaKey = 'corpo' | 'mente' | 'espirito';

export type PericiaKey =
  | 'artesMarciais' | 'atletismo' | 'esgrima' | 'furtividade' | 'pontaria'
  | 'alquimia' | 'criatividade' | 'investigacao' | 'mecanica' | 'sobrevivencia'
  | 'comunhao' | 'diplomacia' | 'expressao' | 'intimidacao' | 'labia';

export interface Proficiencia {
  nome: string;
  descricao: string;
  teste: string;
  requisito?: string;
}

export interface PericiaData {
  label: string;
  atributos: string[];
  descricao: string;
  proficiencias: Proficiencia[];
}

export type ProficienciasMap = Record<InstanciaKey, Partial<Record<PericiaKey, PericiaData>>>;

export const proficiencias: ProficienciasMap = {
  corpo: {
    artesMarciais: {
      label: 'Artes Marciais',
      atributos: ['FOR', 'REF', 'VIG', 'PRE'],
      descricao: 'Técnicas de combate desarmado e com armas improvisadas. Domina manobras táticas — derrubar, desarmar e imobilizar — sem depender de armas convencionais. A cada três níveis (1, 4 e 7), o artista marcial se torna proficiente em uma manobra de combate à sua escolha:',
      proficiencias: [
        { nome: 'Derrubar', descricao: 'Derruba o alvo; ele precisa gastar 1 movimentação em seu turno para se levantar.', teste: 'FOR [Artes Marciais] contra VIG [Artes Marciais ou Atletismo] do alvo' },
        { nome: 'Desarmar', descricao: 'Desarma o alvo; ele precisa gastar uma movimentação para recuperar sua arma (se você a largar).', teste: 'REF [Artes Marciais] contra REF [Artes Marciais ou Furtividade] do alvo' },
        { nome: 'Desviar', descricao: 'Utiliza uma reação para desviar de projéteis físicos.', teste: 'REF [Artes Marciais] oposto ao atacante — reação' },
        { nome: 'Fintar', descricao: 'Distrai o alvo; ele não é capaz de reagir até seu próximo turno.', teste: 'PRE [Artes Marciais] contra VON [Artes Marciais ou Lábia] do alvo' },
        { nome: 'Imobilizar', descricao: 'Imobiliza o alvo; ele não pode realizar ações enquanto você o mantiver nesta condição.', teste: 'VIG [Artes Marciais] contra FOR [Artes Marciais ou Atletismo] do alvo' },
        { nome: 'Aparar (reação)', descricao: 'Ao sofrer um ataque corpo a corpo, pode tentar apará-lo com uma reação; sucesso: metade do dano e pode realizar uma manobra de combate da qual seja proficiente contra o opositor.', teste: 'REF [Artes Marciais] oposto ao ataque — reação [1]', requisito: 'Requer Artes Marciais lv.2' },
      ],
    },
    atletismo: {
      label: 'Atletismo',
      atributos: ['FOR', 'REF', 'VIG'],
      descricao: 'Capacidades físicas gerais: corrida, salto, escalada e resistência. Define potencial de movimentação em combate e em terreno hostil. A partir do segundo nível e a cada 3 níveis (2, 5 e 8), torna-se proficiente em uma técnica de movimentação:',
      proficiencias: [
        { nome: 'Investida', descricao: 'Ao realizar um ataque logo após uma ação de movimento, causa dano adicional igual ao bônus em Atletismo.', teste: 'Passiva — dano adicional = bônus em Atletismo' },
        { nome: 'Prontidão', descricao: 'Se não realizar nenhuma ação de movimento neste turno, recebe uma reação adicional até o início do próximo turno.', teste: 'Passiva — condicional: sem movimentação no turno' },
        { nome: 'Fôlego', descricao: 'Se não realizar nenhuma ação padrão neste turno, recebe Velocidade +1 até o final da cena.', teste: 'Passiva — condicional: sem ação padrão no turno' },
        { nome: 'Disparar (reação)', descricao: 'Utiliza uma reação para ter uma movimentação extra; pode ser apenas se movimentar ou uma ação que exija teste de [Atletismo].', teste: 'REF [Atletismo] (se exigido pela ação) — movimentação extra — reação [1]', requisito: 'Requer Atletismo lv.1' },
      ],
    },
    esgrima: {
      label: 'Esgrima',
      atributos: ['FOR', 'REF'],
      descricao: 'Combate com armas brancas — cortantes e perfurantes. A cada 3 níveis (1, 4 e 7) o personagem escolhe uma proficiência de arma; os bônus da perícia só se aplicam com armas conhecidas.',
      proficiencias: [
        { nome: 'Armas Leves', descricao: 'Proficiente no uso de armas pequenas como facas, adagas e punhais; podem ser escondidas com facilidade e são usadas com Reflexos.', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Uma Mão', descricao: 'Proficiente em armas de médio porte empunhadas com uma mão, como espadas e machados; permitem o uso de escudo ou segunda arma leve e são usadas com Força.', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Duas Mãos', descricao: 'Proficiente no uso de armas grandes empunhadas com as duas mãos, como montantes (usados com Força) e lanças (usadas com Reflexos).', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Especialização', descricao: 'Especialista em uma arma em que já é proficiente; ao atacar com ela, causa +2 de dano adicional.', teste: 'Passiva — +2 dano ao atacar com a arma escolhida' },
        { nome: 'Mestria', descricao: 'Mestre em uma arma em que já é especialista; ao atacar com ela, causa +5 de dano adicional.', teste: 'Passiva — +5 dano ao atacar com a arma escolhida' },
        { nome: 'Contra-atacar (reação)', descricao: 'Quando o adversário erra um ataque corpo a corpo, realiza imediatamente um contra-ataque.', teste: 'REF [Esgrima] oposto ao atacante que errou — reação [1]', requisito: 'Requer Esgrima lv.2' },
      ],
    },
    furtividade: {
      label: 'Furtividade',
      atributos: ['REF'],
      descricao: 'Movimentação silenciosa e ocultação. Base para ataques surpresa, evasão de combate e operações sem ser detectado. A partir do segundo nível e a cada 3 níveis (2, 5 e 8), torna-se proficiente em uma técnica sorrateira:',
      proficiencias: [
        { nome: 'Ataque Furtivo', descricao: 'Aumenta a acuidade dos golpes: ao realizar um ataque surpresa, adiciona o bônus de Furtividade no teste de ataque.', teste: 'Passiva — adiciona bônus em Furtividade no teste de ataque surpresa' },
        { nome: 'Ataque Letal', descricao: 'Aumenta a letalidade dos golpes: ao acertar um ataque surpresa, causa dano adicional igual ao bônus em Furtividade.', teste: 'Passiva — dano adicional = bônus em Furtividade ao acertar ataque surpresa' },
        { nome: 'Ataque Silencioso', descricao: 'Aumenta a capacidade de permanecer oculto após atacar: após um ataque surpresa, pode fazer outro teste para se esconder sem gastar ações; sucesso: localização não é revelada.', teste: 'REF [Furtividade] para se esconder após ataque surpresa — sem custo de ação' },
        { nome: 'Esquivar (reação)', descricao: 'Evita completamente um ataque com desvio no último momento. Sucesso: zero dano.', teste: 'REF [Furtividade] oposto ao atacante — sucesso: dano zerado — reação [1]', requisito: 'Requer Furtividade lv.1' },
      ],
    },
    pontaria: {
      label: 'Pontaria',
      atributos: ['REF', 'FOR', 'RAZ', 'PRE'],
      descricao: 'Combate à distância com arcos, arremesso e condutores mágicos. A partir do primeiro nível e a cada três níveis (1, 4 e 7), escolhe um tipo de arma para se tornar proficiente — os bônus desta perícia só são aplicados quando o personagem estiver usando uma arma com a qual tem proficiência.',
      proficiencias: [
        { nome: 'Arcos', descricao: 'Proficiente no uso de arcos curtos (usados com Reflexos) e arcos longos (usados com Força).', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Arremesso', descricao: 'Proficiente no uso de armas de arremesso; adagas são usadas com Reflexos e machados são usados com Força.', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Condutores', descricao: 'Proficiente no uso de condutores mágicos como varinhas e cajados, usados com Razão ou Presença.', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Especialização', descricao: 'Especialista em uma arma em que já é proficiente; ao atacar com ela, causa +2 de dano adicional.', teste: 'Passiva — +2 dano ao atacar com a arma escolhida' },
        { nome: 'Mestria', descricao: 'Mestre em uma arma em que já é especialista; ao atacar com ela, causa +5 de dano adicional.', teste: 'Passiva — +5 dano ao atacar com a arma escolhida' },
        { nome: 'Mirar (reação)', descricao: 'Pode não usar a reação para permanecer mirando; recebe vantagem (+1d20) no próximo teste de Pontaria e, em caso de sucesso, causa dano adicional igual ao valor em Pontaria.', teste: 'Reação [1] — vantagem (+1d20) no próximo teste de [Pontaria] + dano adicional = valor em Pontaria no sucesso', requisito: 'Requer Pontaria lv.2' },
      ],
    },
  },
  mente: {
    alquimia: {
      label: 'Alquimia',
      atributos: ['RAZ'],
      descricao: 'Criação de substâncias mágicas e químicas: poções, bombas e soros. A partir do nível 2 e a cada três níveis em Alquimia (2, 5, 8), pode se tornar proficiente em um tipo de conhecimento para produzir itens.',
      proficiencias: [
        { nome: 'Herbologia', descricao: 'Utilização de recursos vegetais na criação de remédios e tônicos.', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Mineralogia', descricao: 'Utilização de recursos minerais na criação de bombas e afiadores (metais que atribuem propriedades elementais a equipamentos).', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Zoologia', descricao: 'Utilização de recursos animais na criação de soros (concedem mutações a quem os ingere) e ossadas (catalizadores de mágicas).', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Poções', descricao: 'Permite usar e reconhecer poções de qualquer campo (herbologia, mineralogia e zoologia).', teste: 'Passiva — desbloqueia uso e reconhecimento de poções', requisito: 'Requer Alquimia lv.1' },
      ],
    },
    criatividade: {
      label: 'Criatividade',
      atributos: ['RAZ'],
      descricao: 'Improviso e adaptação de mágicas em campo. A cada três níveis em Criatividade (2, 5, 8), o personagem pode se tornar proficiente em um talento metamágico para alterar suas mágicas conforme a necessidade:',
      proficiencias: [
        { nome: 'Recapitular', descricao: 'Pode acrescentar parcialmente os efeitos de uma mágica na memória à próxima mágica lançada; aplica-se a Feitiços recapitulados em Encantamentos e Criaturas.', teste: 'Passiva — custo: mana colorido da mágica recapitulada' },
        { nome: 'Reciclar', descricao: 'Altera um descritor da mágica (tipo de dano, atributo-base ou alvo, desde que coerente com sua cor); aplica-se a Feitiços e Encantamentos.', teste: 'Passiva — custo: {1} mana incolor por alteração' },
        { nome: 'Reforçar', descricao: 'Potencializa um efeito (dano, área, duração etc.) de uma mágica; aplica-se a Feitiços, Encantamentos e Criaturas (pode reforçar atributo ou habilidade).', teste: 'Passiva — custo: mana incolor (metade do valor: +50% · valor completo: +75%)' },
        { nome: 'Repartir', descricao: 'Compartilha os efeitos de uma mágica com mais alvos, mas ela perde 50% do efeito; aplica-se a Feitiços e Encantamentos (gasta 1 Foco para manter encantamento repartido).', teste: 'Passiva — custo: {1} mana incolor por alvo extra' },
        { nome: 'Replicar', descricao: 'Paga custo adicional de mana ao conjurar para criar uma cópia do Feitiço, lançável sobre o mesmo alvo ou outro.', teste: 'Passiva — custo: valor da mágica + {1} mana incolor por grau' },
        { nome: 'Solução', descricao: 'Pode fazer um uso criativo de uma mágica dentro do domínio dela, mesmo que não esteja explícito na descrição.', teste: 'RAZ [Criatividade] vs. dificuldade do uso criativo', requisito: 'Requer Criatividade lv.1' },
      ],
    },
    investigacao: {
      label: 'Investigação',
      atributos: ['RAZ', 'SEN', 'CON'],
      descricao: 'Pesquisa e análise de fenômenos mágicos. A cada três níveis a partir do segundo (2, 5, 8) de Investigação, o personagem torna-se proficiente na produção de um tipo de escrita mágica:',
      proficiencias: [
        { nome: 'Selo de Feitiço', descricao: 'Armazena um feitiço com antecedência (em descanso) em um selo mágico que pode ser consumido para lançar a mágica armazenada; selos podem ser usados como uma reação.', teste: 'Passiva — armazena feitiço em descanso; consome como reação' },
        { nome: 'Selo de Encantamento', descricao: 'O mesmo que Selo de Feitiço, mas armazena um encantamento em vez disso.', teste: 'Passiva — armazena encantamento em descanso; consome como reação' },
        { nome: 'Selo de Invocação', descricao: 'O mesmo que os anteriores, mas armazena uma invocação em vez disso.', teste: 'Passiva — armazena invocação em descanso; consome como reação' },
        { nome: 'Leitura', descricao: 'Permite ler e escrever; pode aprender novas mágicas a partir da leitura de livros ou pergaminhos.', teste: 'Passiva — desbloqueia leitura, escrita e aprendizado de mágicas por livros', requisito: 'Requer Investigação lv.1' },
      ],
    },
    mecanica: {
      label: 'Mecânica',
      atributos: ['RAZ', 'CON'],
      descricao: 'Construção e reparo de objetos e artefatos mágicos. No nível 1, pode utilizar e reparar artefatos variados. A partir do segundo nível e a cada três níveis (2, 5, 8) em Mecânica, adquire proficiência na manufatura de artefatos de um tipo:.',
      proficiencias: [
        { nome: 'Artesão', descricao: 'É capaz de produzir e melhorar acessórios mágicos variados.', teste: 'Passiva — desbloqueia produção de acessórios mágicos' },
        { nome: 'Feiticeiro', descricao: 'É capaz de produzir e melhorar varinhas, cajados e vestimentas mágicas.', teste: 'Passiva — desbloqueia produção de condutores e vestimentas mágicas' },
        { nome: 'Ferreiro', descricao: 'É capaz de produzir e melhorar armas, armaduras e equipamentos mágicos.', teste: 'Passiva — desbloqueia produção de armas e armaduras mágicas' },
        { nome: 'Artefatos', descricao: 'Permite usar artefatos de qualquer profissão (artesão, feiticeiro e ferreiro) e repará-los em cenas de descanso.', teste: 'Passiva — ativa artefatos de qualquer profissão; repara em descanso', requisito: 'Requer Mecânica lv.1' },
      ],
    },
    sobrevivencia: {
      label: 'Sobrevivência',
      atributos: ['RAZ', 'SEN'],
      descricao: 'Subsistência em ambientes hostis. A partir do segundo nível e a cada três níveis (2, 5, 8) em Sobrevivência, torna-se especialista em um tipo de descanso, podendo somar seu bônus dessa perícia no teste realizado.',
      proficiencias: [
        { nome: 'Acampamento', descricao: 'Torna-se especialista em Repousar: testes de Repousar passam a ser Vigor [Atletismo + Sobrevivência].', teste: 'VIG [Atletismo + Sobrevivência] — modifica ação de descanso Repousar' },
        { nome: 'Harmonização', descricao: 'Torna-se especialista em Canalizar: testes de Canalizar passam a ser Vontade [Comunhão + Sobrevivência].', teste: 'VON [Comunhão + Sobrevivência] — modifica ação de descanso Canalizar' },
        { nome: 'Forrageamento', descricao: 'Torna-se especialista em Coletar: testes de Coletar passam a ser Razão [Sobrevivência + Sobrevivência].', teste: 'RAZ [Sobrevivência + Sobrevivência] — modifica ação de descanso Coletar' },
        { nome: 'Manufaturação', descricao: 'Torna-se especialista em Produzir e Fabricar: testes de Produzir passam a ser Razão [Alquimia + Sobrevivência] e testes de Fabricar passam a ser Razão [Mecânica + Sobrevivência].', teste: 'RAZ [Alquimia + Sobrevivência] (Produzir) · RAZ [Mecânica + Sobrevivência] (Fabricar)' },
        { nome: 'Treinamento', descricao: 'Torna-se especialista em Praticar: testes de Praticar passam a ser Concentração [Artes Marciais/Investigação/Lábia + Sobrevivência].', teste: 'CON [Artes Marciais/Investigação/Lábia + Sobrevivência] — modifica ação de descanso Praticar' },
        { nome: 'Coleta', descricao: 'Permite coletar recursos (herbais, minerais ou animais) em cenas de descanso.', teste: 'Passiva — desbloqueia coleta de recursos em descanso', requisito: 'Requer Sobrevivência lv.1' },
      ],
    },
  },
  espirito: {
    comunhao: {
      label: 'Comunhão',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Conexão emocional com criaturas, aliados e forças naturais. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Provocar (ação livre)', descricao: 'Durante um combate, provoca uma criatura ou pessoa para que ela se concentre apenas em você até o final do turno.', teste: 'PRE [Comunhão] contra IP Espiritual do alvo — ação livre', requisito: 'Requer Comunhão lv.3' },
      ],
    },
    diplomacia: {
      label: 'Diplomacia',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Negociação, persuasão e liderança social. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Coordenar (ação livre)', descricao: 'Coordena o grupo para agir em conjunto: dois ou mais aliados agem de acordo com suas orientações sem gastar ação (como se cada um recebesse uma ação extra, desde que tenham objetivo em comum).', teste: 'Passiva — ação livre; sem teste; requer objetivo em comum', requisito: 'Requer Diplomacia lv.3' },
      ],
    },
    expressao: {
      label: 'Expressão',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Comunicação emocional e artística para inspirar e motivar aliados. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Inspirar (ação livre)', descricao: 'Durante um combate, motiva um aliado com palavras; ele recebe bônus igual ao valor em Expressão em uma perícia de sua escolha até o final do turno.', teste: 'Passiva — ação livre; sem teste; bônus = valor em Expressão', requisito: 'Requer Expressão lv.3' },
      ],
    },
    intimidacao: {
      label: 'Intimidação',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Uso do medo e da presença para influenciar outros em combate e situações sociais. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Amedrontar (ação livre)', descricao: 'Durante um combate, afugenta criaturas e pessoas para que elas não o ataquem até o final do turno.', teste: 'PRE [Intimidação] contra IP Espiritual do alvo — ação livre', requisito: 'Requer Intimidação lv.3' },
      ],
    },
    labia: {
      label: 'Lábia',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Engano, distração e manipulação verbal para desestabilizar e obter vantagem sobre outros. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Distrair (ação livre)', descricao: 'Durante um combate, ludibriam um inimigo com palavras; ele recebe penalidade igual ao valor em Lábia em uma perícia de sua escolha até o final do turno.', teste: 'PRE [Lábia] contra IP Espiritual do alvo — ação livre', requisito: 'Requer Lábia lv.3' },
      ],
    },
  },
};

export const periciaOrdem: { instancia: InstanciaKey; periciaKey: PericiaKey }[] = [
  { instancia: 'corpo', periciaKey: 'artesMarciais' },
  { instancia: 'corpo', periciaKey: 'atletismo' },
  { instancia: 'corpo', periciaKey: 'esgrima' },
  { instancia: 'corpo', periciaKey: 'furtividade' },
  { instancia: 'corpo', periciaKey: 'pontaria' },
  { instancia: 'mente', periciaKey: 'alquimia' },
  { instancia: 'mente', periciaKey: 'criatividade' },
  { instancia: 'mente', periciaKey: 'investigacao' },
  { instancia: 'mente', periciaKey: 'mecanica' },
  { instancia: 'mente', periciaKey: 'sobrevivencia' },
  { instancia: 'espirito', periciaKey: 'comunhao' },
  { instancia: 'espirito', periciaKey: 'diplomacia' },
  { instancia: 'espirito', periciaKey: 'expressao' },
  { instancia: 'espirito', periciaKey: 'intimidacao' },
  { instancia: 'espirito', periciaKey: 'labia' },
];
