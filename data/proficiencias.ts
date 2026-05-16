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
      descricao: 'Artista marciais são os lutadores que dispensam qualquer tipo de arma, recebendo bônus por lutarem desarmados, ou utilizam apenas armas de concussão como bastões. Além disso, a partir do primeiro nível e a cada três níveis (1, 4 e 7), o artista marcial se torna proficiente em uma manobra de combate à sua escolha:',
      proficiencias: [
        { nome: 'Derrubar', descricao: 'derruba o alvo, ele precisa gastar 1 movimentação em seu turno para se levantar', teste: 'Força [Artes Marciais] contra Vigor [Artes Marciais ou Atletismo] do alvo' },
        { nome: 'Desarmar', descricao: 'desarma o alvo e ele precisa gastar uma movimentação para recuperar sua arma (se você a largar)', teste: 'Reflexos [Artes Marciais] contra Reflexos [Artes Marciais ou Furtividade]' },
        { nome: 'Desviar', descricao: 'é capaz de utilizar uma reação para desviar de projéteis físicos', teste: 'Reflexos [Artes Marciais] — oposto' },
        { nome: 'Fintar', descricao: 'distrai o alvo e ele não é capaz de reagir até seu próximo turno', teste: 'Presença [Artes Marciais] contra Vontade [Artes Marciais ou Lábia]' },
        { nome: 'Imobilizar', descricao: 'imobiliza o alvo e ele não pode realizar ações enquanto você o mantiver nesta condição', teste: 'Vigor [Artes Marciais] contra Força [Artes Marciais ou Atletismo]' },
        { nome: 'Aparar (reação)', descricao: 'ao sofrer um ataque corpo a corpo, pode utilizar uma reação para tentar apará-lo: faça um teste oposto de Reflexos [Artes Marciais] ao ataque; se o seu resultado for maior, você apara o ataque e sofre metade do dano causado, então pode realizar uma manobra de combate da qual seja proficiente contra o opositor', teste: 'Reflexos [Artes Marciais] oposto ao ataque — reação [1]', requisito: 'Requer Artes Marciais lv.2' },
      ],
    },
    atletismo: {
      label: 'Atletismo',
      atributos: ['FOR', 'REF', 'VIG'],
      descricao: 'Um personagem atlético é capaz de utilizar os movimentos de seu corpo das mais variadas maneiras para se livrar de situações difíceis, como saltar uma longa distância, fugir de uma criatura que o esteja perseguindo, escalar paredões, nadar contra uma correnteza ou qualquer outra atividade que envolva a sua coordenação motora grossa. Além disso, testes de resistência de Vigor utilizam os bônus desta perícia. A partir do segundo nível e a cada 3 níveis (2, 5 e 8), torna-se proficiente em uma técnica de movimentação:',
      proficiencias: [
        { nome: 'Investida', descricao: 'ao realizar um ataque logo após uma ação de movimento, causa dano adicional igual seu bônus em Atletismo', teste: 'Passiva — dano adicional = bônus em Atletismo' },
        { nome: 'Prontidão', descricao: 'se não realizar nenhuma ação de movimento neste turno, recebe uma reação adicional até o início do próximo turno', teste: 'Passiva — condicional: sem movimentação no turno' },
        { nome: 'Fôlego', descricao: 'se não realizar nenhuma ação padrão neste turno, recebe Velocidade +1 até o final da cena', teste: 'Passiva — condicional: sem ação padrão no turno' },
        { nome: 'Disparar (reação)', descricao: 'a partir do primeiro nível em Atletismo, pode utilizar uma reação para ter uma movimentação extra; pode ser uma ação simples como somente se movimentar, ou uma ação que exija algum teste de [Atletismo]', teste: 'Reflexos [Atletismo] (se exigido) — movimentação extra — reação [1]', requisito: 'Requer Atletismo lv.1' },
      ],
    },
    esgrima: {
      label: 'Esgrima',
      atributos: ['FOR', 'REF'],
      descricao: 'Esgrimista é aquele capaz de lutar com armas brancas, principalmente cortantes e perfurantes como adagas, espadas e lanças. A partir do primeiro nível e a cada 3 níveis (1, 4 e 7), escolhe um tipo de arma para se tornar proficiente — os bônus desta perícia só são aplicados quando o personagem estiver usando uma arma com a qual tem proficiência.',
      proficiencias: [
        { nome: 'Armas Leves', descricao: 'torna-se proficiente no uso de armas pequenas como facas, adagas e punhais que, embora causem menor dano, podem ser escondidas com facilidade e usadas com Reflexos', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Armas de Uma Mão', descricao: 'torna-se proficiente em armas de médio porte, empunhadas com uma mão, como espadas e machados, permitindo o uso de escudos ou de uma segunda arma leve; são usadas com Força', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Armas de Duas Mãos', descricao: 'torna-se proficiente no uso de armas grandes empunhadas com as duas mãos, como montantes (usados com Força) e lanças (usadas com Reflexos)', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Especialização em Arma', descricao: 'torna-se especialista em uma arma em que já é proficiente; ao atacar com ela, causa [+2] de dano adicional', teste: 'Passiva — +2 dano ao atacar com a arma escolhida' },
        { nome: 'Mestria em Arma', descricao: 'torna-se mestre em uma arma em que já é especialista; ao atacar com ela, causa [+5] de dano adicional', teste: 'Passiva — +5 dano ao atacar com a arma escolhida' },
        { nome: 'Contra-atacar (reação)', descricao: 'a partir do segundo nível em Esgrima, se o alvo errar um ataque contra você, pode utilizar uma reação para realizar um ataque corpo a corpo contra ele', teste: 'Reflexos [Esgrima] oposto ao atacante que errou — reação [1]', requisito: 'Requer Esgrima lv.2' },
      ],
    },
    furtividade: {
      label: 'Furtividade',
      atributos: ['REF'],
      descricao: 'Para se esconder, andar sorrateiramente ou praticar atividades que exigem sutileza e coordenação motora fina, o personagem precisa rolar um teste de Furtividade. A partir do segundo nível e a cada 3 níveis (2, 5 e 8), torna-se proficiente em uma técnica sorrateira:',
      proficiencias: [
        { nome: 'Ataque Furtivo', descricao: 'aumenta a acuidade de seus golpes: ao realizar um ataque surpresa, adiciona seu bônus de Furtividade no teste de ataque', teste: 'Passiva — adiciona bônus em Furtividade no teste de ataque surpresa' },
        { nome: 'Ataque Letal', descricao: 'aumenta a letalidade de seus golpes: ao acertar um ataque surpresa, causa dano adicional igual seu bônus em Furtividade', teste: 'Passiva — dano adicional = bônus em Furtividade ao acertar ataque surpresa' },
        { nome: 'Ataque Silencioso', descricao: 'aumenta sua capacidade de permanecer oculto depois de atacar: após realizar um ataque surpresa, pode fazer outro teste para se esconder sem gastar ações para isso; se tiver sucesso, sua localização não é revelada', teste: 'Reflexos [Furtividade] para se esconder após ataque surpresa — sem custo de ação' },
        { nome: 'Esquivar (reação)', descricao: 'a partir do primeiro nível em Furtividade, ao sofrer um ataque, pode utilizar uma reação para tentar esquivar-se: faça um teste oposto de Reflexos [Furtividade] ao ataque; se o seu resultado for maior, você se esquiva do ataque e não sofre dano', teste: 'Reflexos [Furtividade] oposto ao ataque — sucesso: sem dano — reação [1]', requisito: 'Requer Furtividade lv.1' },
      ],
    },
    pontaria: {
      label: 'Pontaria',
      atributos: ['REF', 'FOR', 'RAZ', 'PRE'],
      descricao: 'Perícia essencial para realizar ataques com armas à distância como arcos e bestas, assim como para lançar mágicas contra um alvo, desde que lançadas a partir de um condutor (varinhas, cajados etc.). A partir do primeiro nível e a cada três níveis (1, 4 e 7), escolhe um tipo de arma para se tornar proficiente — os bônus desta perícia só são aplicados quando o personagem estiver usando uma arma com a qual tem proficiência.',
      proficiencias: [
        { nome: 'Arcos', descricao: 'torna-se proficiente no uso de arcos curtos ou longos; arcos curtos são usados com Reflexos e arcos longos são usados com Força', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Armas de Arremesso', descricao: 'torna-se proficiente no uso de armas de arremesso; adagas são usadas com Reflexos e machados são usados com Força', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Condutores', descricao: 'torna-se proficiente no uso de condutores mágicos como varinhas e cajados, usados com Razão ou Presença', teste: 'Passiva — desbloqueia uso sem penalidade' },
        { nome: 'Especialização em Arma', descricao: 'torna-se especialista em uma arma em que já é proficiente; ao atacar com ela, causa [+2] de dano adicional', teste: 'Passiva — +2 dano ao atacar com a arma escolhida' },
        { nome: 'Mestria em Arma', descricao: 'torna-se mestre em uma arma em que já é especialista; ao atacar com ela, causa [+5] de dano adicional', teste: 'Passiva — +5 dano ao atacar com a arma escolhida' },
        { nome: 'Mirar (reação)', descricao: 'a partir do segundo nível em Pontaria, pode escolher não utilizar sua reação para permanecer mirando em um alvo; se o fizer, recebe uma vantagem (+1d20 básico) no teste e, em caso de sucesso, causa dano adicional igual seu valor em Pontaria', teste: 'Reação [1] — vantagem (+1d20 básico) no próximo teste de [Pontaria] + dano adicional = valor em Pontaria no sucesso', requisito: 'Requer Pontaria lv.2' },
      ],
    },
  },
  mente: {
    alquimia: {
      label: 'Alquimia',
      atributos: ['RAZ'],
      descricao: 'Alquimia é a ciência mágica de Kéos, a compreensão de que toda a natureza é composta pelas cinco cores de mana. Um personagem que adquire esta perícia conhece as propriedades de cada cor e pode fazer testes para identificar as cores dos elementos naturais — animais, vegetais e minerais. A partir do nível 2 e a cada três níveis em Alquimia (2, 5, 8), pode se tornar proficiente em um tipo de conhecimento para produzir itens a partir de misturas dos elementos naturais, como remédios, bombas e soros mágicos:',
      proficiencias: [
        { nome: 'Herbologia', descricao: 'utilização de recursos vegetais na criação de remédios e tônicos', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Mineralogia', descricao: 'utilização de recursos minerais na criação de bombas e afiadores (metais que atribuem propriedades elementais a equipamentos)', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Zoologia', descricao: 'utilização de recursos animais na criação de soros (concedem mutações a quem os ingere) e ossadas (catalizadores de mágicas)', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Poções', descricao: 'a partir do primeiro nível em Alquimia, você pode usar e reconhecer poções de qualquer campo (herbologia, mineralogia e zoologia)', teste: 'Passiva — desbloqueia uso e reconhecimento de poções', requisito: 'Requer Alquimia lv.1' },
      ],
    },
    criatividade: {
      label: 'Criatividade',
      atributos: ['RAZ'],
      descricao: 'Esta perícia é usada quando os jogadores têm ideias mirabolantes e muito fora do comum e o mestre fica em dúvida: será que essa ação faria sentido neste universo? Se para o jogador faz, ele pode rolar um teste de Criatividade para ajudar o mestre a decidir. Além disso, magos podem inventar mágicas que não estejam em seu grimório: o jogador pode acordar com o mestre o nível, o custo de mana e os efeitos da mágica, então rolar um teste para ver se sua invenção funciona. Se tiver sucesso, ele acabou de inventar uma nova mágica! A cada três níveis em Criatividade (2, 5, 8), o personagem pode se tornar proficiente em um talento metamágico para alterar suas mágicas conforme a necessidade:',
      proficiencias: [
        { nome: 'Recapitular', descricao: 'pode acrescentar parcialmente os efeitos de uma mágica que esteja na memória na próxima mágica que lançar. Só é possível recapitular os efeitos de Feitiços, mas é possível aplicá-los em Encantamentos e Criaturas. O custo de mana adicional é o custo de mana colorido da mágica a ser recapitulada', teste: 'Passiva — custo: mana colorido da mágica recapitulada' },
        { nome: 'Reciclar', descricao: 'aprende a reciclar suas mágicas, pois algumas são úteis apenas em situações muito específicas: você pode alterar algum descritor da mágica, como o tipo de dano (desde que coerente com sua cor), o atributo-base ou o alvo dela. Aplica-se a Feitiços e a Encantamentos. O custo de mana adicional é de {1} mana incolor para cada alteração', teste: 'Passiva — custo: {1} mana incolor por alteração' },
        { nome: 'Reforçar', descricao: 'potencializa um dos efeitos (dano, área, duração etc.) de uma mágica por um custo de mana maior. Aplica-se a Feitiços, Encantamentos e Criaturas (nestas, você pode reforçar um de seus atributos ou uma habilidade). O custo de mana adicional é pago em mana incolor e varia de metade do valor (+50% do efeito) ao valor completo da mágica (+75% do efeito)', teste: 'Passiva — custo: mana incolor (metade do valor: +50% · valor completo: +75%)' },
        { nome: 'Repartir', descricao: 'compartilha os efeitos de uma mágica com mais alvos, mas ela perde em potência (50% a menos do efeito). Aplica-se em Feitiços e Encantamentos (você só gasta 1 de Foco para manter um encantamento repartido). O custo de mana adicional é {1} de mana incolor para cada alvo extra', teste: 'Passiva — custo: {1} mana incolor por alvo extra' },
        { nome: 'Replicar', descricao: 'mágicas demoram para ser conjuradas, mas se pagar um custo adicional de mana no momento de conjuração, o conjurador consegue fazer uma cópia dela, podendo lançá-la sobre o mesmo alvo ou um alvo diferente. Aplica-se somente a Feitiços. O custo de mana adicional é o mesmo valor da mágica conjurada mais {1} mana incolor para cada grau', teste: 'Passiva — custo: valor da mágica + {1} mana incolor por grau' },
        { nome: 'Solução', descricao: 'a partir do primeiro nível em Criatividade, você pode solucionar problemas de forma criativa; por exemplo, pode fazer um teste para fazer um uso criativo de uma mágica, algo que esteja dentro do domínio dela mas não esteja explícito na descrição', teste: 'Razão [Criatividade] vs. dificuldade do uso criativo', requisito: 'Requer Criatividade lv.1' },
      ],
    },
    investigacao: {
      label: 'Investigação',
      atributos: ['RAZ', 'SEN', 'CON'],
      descricao: 'Investigar significa dedicar atenção a uma tarefa, seja vasculhar uma sala em busca de um objeto ou ler um livro para adquirir conhecimentos importantes. Como em um mundo medieval a leitura e a escrita não são habilidades comuns para a maioria das pessoas, é necessário ter pelo menos um nível nesta perícia para saber ler e escrever. A cada três níveis a partir do segundo (2, 5, 8) de Investigação, o personagem torna-se proficiente na produção de um tipo de escrita mágica:',
      proficiencias: [
        { nome: 'Selo de Feitiço', descricao: 'armazena um feitiço com antecedência (durante cenas de descanso) em um selo mágico que pode ser consumido para lançar a mágica armazenada. Você pode usar selos como uma reação', teste: 'Passiva — armazena feitiço em descanso; consome como reação' },
        { nome: 'Selo de Encantamento', descricao: 'o mesmo que o anterior, mas aprende a armazenar um encantamento em vez disso', teste: 'Passiva — armazena encantamento em descanso; consome como reação' },
        { nome: 'Selo de Invocação', descricao: 'o mesmo que os anteriores, mas aprende a armazenar uma invocação em vez disso', teste: 'Passiva — armazena invocação em descanso; consome como reação' },
        { nome: 'Leitura', descricao: 'a partir do primeiro nível em Investigação, você é capaz de ler e escrever; entre outras coisas, pode aprender novas mágicas a partir da leitura de livros ou pergaminhos', teste: 'Passiva — desbloqueia leitura, escrita e aprendizado de mágicas por livros', requisito: 'Requer Investigação lv.1' },
      ],
    },
    mecanica: {
      label: 'Mecânica',
      atributos: ['RAZ', 'CON'],
      descricao: 'Em Kéos, todo tipo de item mágico é chamado de artefato e, para manuseá-los ou produzi-los, é necessário ter conhecimentos em Mecânica. Logo, é necessário realizar um teste desta perícia sempre que se deseja ativar o efeito de um artefato em sua posse. No nível 1, pode utilizar e reparar artefatos variados. A partir do segundo nível e a cada três níveis (2, 5, 8) em Mecânica, adquire proficiência na manufatura de artefatos de um tipo:',
      proficiencias: [
        { nome: 'Artesão', descricao: 'é capaz de produzir e melhorar acessórios mágicos variados', teste: 'Passiva — desbloqueia produção de acessórios mágicos' },
        { nome: 'Feiticeiro', descricao: 'é capaz de produzir e melhorar varinhas, cajados e vestimentas mágicas', teste: 'Passiva — desbloqueia produção de condutores e vestimentas mágicas' },
        { nome: 'Ferreiro', descricao: 'é capaz de produzir e melhorar armas, armaduras e equipamentos mágicos', teste: 'Passiva — desbloqueia produção de armas e armaduras mágicas' },
        { nome: 'Artefatos', descricao: 'a partir do primeiro nível em Mecânica, você pode usar artefatos (ativá-los) de qualquer profissão (artesão, feiticeiro e ferreiro) e repará-los em cenas de descanso', teste: 'Passiva — ativa artefatos de qualquer profissão; repara em descanso', requisito: 'Requer Mecânica lv.1' },
      ],
    },
    sobrevivencia: {
      label: 'Sobrevivência',
      atributos: ['RAZ', 'SEN'],
      descricao: 'Esta área diz respeito aos conhecimentos relacionados ao meio ambiente e aos seres que compõem os diversos ecossistemas de Kéos, além de estar vinculado à maneira como o personagem sente e interage com esse ambiente. Portanto, o personagem pode usar esta perícia em testes para saber questões geográficas e biológicas de determinado local, assim como para perceber e sentir o ambiente ao seu redor em testes de Reflexos, Sentidos e/ou Intuição. A partir do segundo nível e a cada três níveis (2, 5, 8) em Sobrevivência, torna-se especialista em um tipo de descanso, podendo somar seu bônus dessa perícia no teste realizado.',
      proficiencias: [
        { nome: 'Acampamento', descricao: 'testes de Repousar passam a ser Vigor [Atletismo + Sobrevivência]', teste: 'Vigor [Atletismo + Sobrevivência] — modifica ação de descanso Repousar' },
        { nome: 'Harmonização', descricao: 'testes de Canalizar passam a ser Vontade [Comunhão + Sobrevivência]', teste: 'Vontade [Comunhão + Sobrevivência] — modifica ação de descanso Canalizar' },
        { nome: 'Forrageamento', descricao: 'testes de Coletar passam a ser Razão [Sobrevivência + Sobrevivência]', teste: 'Razão [Sobrevivência + Sobrevivência] — modifica ação de descanso Coletar' },
        { nome: 'Manufaturação', descricao: 'testes de Produzir passam a ser Razão [Alquimia + Sobrevivência] e testes de Fabricar passam a ser Razão [Mecânica + Sobrevivência]', teste: 'Razão [Alquimia + Sobrevivência] (Produzir) · Razão [Mecânica + Sobrevivência] (Fabricar)' },
        { nome: 'Treinamento', descricao: 'testes de Praticar passam a ser Concentração [Artes Marciais/Investigação/Lábia + Sobrevivência]', teste: 'Concentração [Artes Marciais/Investigação/Lábia + Sobrevivência] — modifica ação de descanso Praticar' },
        { nome: 'Coleta', descricao: 'a partir do primeiro nível em Sobrevivência, pode coletar recursos (herbais, minerais ou animais) em cenas de descanso', teste: 'Passiva — desbloqueia coleta de recursos em descanso', requisito: 'Requer Sobrevivência lv.1' },
      ],
    },
  },
  espirito: {
    comunhao: {
      label: 'Comunhão',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Trata-se do uso da palavra para acolher pessoas de espíritos perturbados, dar conselhos e conectar-se com a natureza a fim de compreender seus ciclos e seus seres; é a sabedoria empírica. Está relacionada ao tratamento de animais selvagens e criaturas, assim como à espiritualidade e à conexão com o ambiente.',
      proficiencias: [
        { nome: 'Provocar (ação livre)', descricao: 'a partir do terceiro nível em Comunhão, durante um combate, pode provocar uma criatura ou uma pessoa para que ela se concentre apenas em você até o final do turno', teste: 'Presença [Comunhão] contra IP Espiritual — ação livre', requisito: 'Requer Comunhão lv.3' },
      ],
    },
    diplomacia: {
      label: 'Diplomacia',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Trata-se do uso da palavra para resolver conflitos por meio da conversa, inspirar confiança a outrem ou acessar os seus sentimentos e motivações a fim de compreendê-los. Esta perícia é utilizada sempre que houver uma tentativa de liderar outros personagens ou de apaziguar os ânimos de alguém.',
      proficiencias: [
        { nome: 'Coordenar (ação livre)', descricao: 'a partir do terceiro nível em Diplomacia, pode coordenar seu grupo para realizar uma ação em conjunto: dois ou mais personagens são mobilizados a agir de acordo com suas orientações e não gastam nenhuma ação para isso (é como se cada personagem recebesse uma ação extra, desde que tenham um objetivo em comum)', teste: 'Passiva — ação livre; sem teste; requer objetivo em comum', requisito: 'Requer Diplomacia lv.3' },
      ],
    },
    expressao: {
      label: 'Expressão',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Trata-se do uso da palavra para expressar os seus sentimentos de maneira corriqueira ou para realizar expressões artísticas através da música, da dança, da escrita, do desenho ou de qualquer outra forma de arte.',
      proficiencias: [
        { nome: 'Inspirar (ação livre)', descricao: 'a partir do terceiro nível em Expressão, durante um combate, pode motivar um aliado com suas palavras, então ele recebe bônus igual seu valor em Expressão em uma perícia de sua escolha até o final do turno', teste: 'Passiva — ação livre; sem teste; bônus = valor em Expressão', requisito: 'Requer Expressão lv.3' },
      ],
    },
    intimidacao: {
      label: 'Intimidação',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Trata-se do uso da palavra para intimidar uma pessoa, seja para amedrontá-la e afugentá-la fugir, seja para coagi-la a fazer algo de sua vontade.',
      proficiencias: [
        { nome: 'Amedrontar (ação livre)', descricao: 'a partir do terceiro nível em Intimidação, quando estiver em combate, pode afugentar criaturas e pessoas para que elas não o ataquem até o final do turno', teste: 'Presença [Intimidação] contra IP Espiritual — ação livre', requisito: 'Requer Intimidação lv.3' },
      ],
    },
    labia: {
      label: 'Lábia',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Trata-se do uso da palavra para realizar negociações ou manipular verdades. Ter uma boa lábia significa saber articular bem os seus argumentos, sejam eles verdadeiros ou não, e convencer o seu interlocutor por meio da lógica e da razão.',
      proficiencias: [
        { nome: 'Distrair (ação livre)', descricao: 'a partir do terceiro nível em Lábia, durante um combate, pode ludibriar um inimigo com suas palavras, então ele recebe penalidade igual seu valor em Lábia em uma perícia de sua escolha até o final do turno; é preciso ter sucesso em um teste de Presença [Lábia] contra IP Espiritual do alvo', teste: 'Presença [Lábia] contra IP Espiritual do alvo — ação livre', requisito: 'Requer Lábia lv.3' },
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
