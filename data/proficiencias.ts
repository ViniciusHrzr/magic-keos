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
        { nome: 'Herbologia', descricao: 'Permite coletar e processar ervas para criar poções de cura, imunidade, estimulantes, danosos ou adaptativos.', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Mineralogia', descricao: 'Permite trabalhar com minerais para fabricar bombas de área e proteções elementais.', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Zoologia', descricao: 'Permite extrair soros de criaturas (mutações temporárias) e catalizadores para potencializar mágicas.', teste: 'Passiva — desbloqueia categoria de produção' },
        { nome: 'Poções', descricao: 'Cria poções alquímicas durante o descanso. O resultado depende do teste.', teste: 'RAZ [Alquimia] no descanso — falha: reduzido · 10+: pretendido · 20+: potencializado', requisito: 'Requer Alquimia lv.1' },
      ],
    },
    criatividade: {
      label: 'Criatividade',
      atributos: ['RAZ'],
      descricao: 'Improviso e adaptação de mágicas em campo. A cada três níveis em Criatividade (2, 5, 8), o personagem pode se tornar proficiente em um talento metamágico para alterar suas mágicas conforme a necessidade:',
      proficiencias: [
        { nome: 'Recapitular', descricao: 'Replica mágica já conjurada na mesma cena pagando apenas mana, sem conjurar novamente.', teste: 'Passiva — disponível ao lançar mágica da mesma cena' },
        { nome: 'Reciclar', descricao: 'Altera alvo, área ou duração de mágica já ativa, pagando mana adicional.', teste: 'Passiva — aplicado ao modificar mágica ativa' },
        { nome: 'Reforçar', descricao: 'Potencializa dano, alcance ou duração de uma mágica ao custo de mana adicional.', teste: 'Passiva — multiplicador de efeito com mana extra' },
        { nome: 'Repartir', descricao: 'Divide o efeito de uma única mágica entre múltiplos alvos dentro do alcance.', teste: 'Passiva — efeito dividido entre os alvos escolhidos' },
        { nome: 'Replicar', descricao: 'Reproduz funcionalmente um objeto simples ou efeito visual observado recentemente.', teste: 'RAZ [Criatividade] vs. complexidade do objeto' },
        { nome: 'Solução', descricao: 'Improvisa respostas eficazes a problemas inéditos sem recursos ou ferramentas ideais.', teste: 'RAZ [Criatividade] vs. dificuldade do problema', requisito: 'Requer Criatividade lv.1' },
      ],
    },
    investigacao: {
      label: 'Investigação',
      atributos: ['RAZ', 'SEN', 'CON'],
      descricao: 'Pesquisa e análise de fenômenos mágicos. A cada três níveis a partir do segundo (2, 5, 8) de Investigação, o personagem torna-se proficiente na produção de um tipo de escrita mágica:',
      proficiencias: [
        { nome: 'Selo de Feitiço', descricao: 'Inscreve mágicas em superfícies para disparar automaticamente quando ativadas.', teste: 'RAZ [Investigação] — dificuldade varia com o grau do feitiço inscrito' },
        { nome: 'Encantamento', descricao: 'Estuda e absorve feitiços de fontes externas: grimórios, artefatos ou mágicas observadas.', teste: 'RAZ [Investigação] oposto à complexidade da fonte' },
        { nome: 'Invocação', descricao: 'Aprende técnicas de conjuração e controle de criaturas mágicas.', teste: 'RAZ [Investigação] para aprender — CON [Investigação] para controlar' },
        { nome: 'Leitura', descricao: 'Decifra textos arcanos, runas, mapas antigos e manuscritos mágicos.', teste: 'RAZ [Investigação] — dificuldade varia com antiguidade e complexidade', requisito: 'Requer Investigação lv.1' },
      ],
    },
    mecanica: {
      label: 'Mecânica',
      atributos: ['RAZ', 'CON'],
      descricao: 'Construção e reparo de objetos e artefatos mágicos. No nível 1, pode utilizar e reparar artefatos variados. A partir do segundo nível e a cada três níveis (2, 5, 8) em Mecânica, adquire proficiência na manufatura de artefatos de um tipo:.',
      proficiencias: [
        { nome: 'Artesão', descricao: 'Fabrica objetos, acessórios e joias com durabilidade e até 3 melhorias elementais.', teste: 'RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas' },
        { nome: 'Feiticeiro', descricao: 'Cria condutores mágicos encantados: varinhas de 1 mão (1d4, 9m) e cajados de 2 mãos (1d6, 18m).', teste: 'RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas' },
        { nome: 'Ferreiro', descricao: 'Forja armas, escudos e armaduras com propriedades especiais e até 3 melhorias elementais.', teste: 'RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas' },
        { nome: 'Artefatos', descricao: 'Ativa artefatos gastando 1 mana incolor e repara cargas perdidas durante o descanso.', teste: 'Ativar: ação [1] + 1 mana incolor · Reparar (CON [Mecânica]): 10+:1 · 15+:2 · 20+:3', requisito: 'Requer Mecânica lv.1' },
      ],
    },
    sobrevivencia: {
      label: 'Sobrevivência',
      atributos: ['RAZ', 'SEN'],
      descricao: 'Subsistência em ambientes hostis. A partir do segundo nível e a cada três níveis (2, 5, 8) em Sobrevivência, torna-se especialista em um tipo de descanso, podendo somar seu bônus dessa perícia no teste realizado.',
      proficiencias: [
        { nome: 'Acampamento', descricao: 'Prepara abrigos que melhoram a recuperação de vida e recursos durante o descanso.', teste: 'RAZ [Sobrevivência] — melhora os modificadores das ações de descanso' },
        { nome: 'Harmonização', descricao: 'Sincroniza com o terreno para obter bônus nos modificadores de canalização de mana.', teste: 'Passiva — melhora modificador de ambiente para Canalizar' },
        { nome: 'Forrageamento', descricao: 'Coleta ervas, minerais e partes de criaturas do ambiente durante exploração ou descanso.', teste: 'RAZ [Sobrevivência] — tipo e quantidade dependem do bioma' },
        { nome: 'Manufaturação', descricao: 'Produz itens básicos de sobrevivência a partir de matérias-primas sem ferramentas especiais.', teste: 'RAZ [Sobrevivência] vs. complexidade do item fabricado' },
        { nome: 'Treinamento', descricao: 'Treina animais ou aliados para desenvolver habilidades específicas e melhorar desempenho em cena.', teste: 'PRE ou INT [Sobrevivência] vs. complexidade do treinamento' },
        { nome: 'Coleta', descricao: 'Recolhe matérias-primas (ervas, minerais, ossadas) durante períodos de descanso.', teste: 'RAZ [Sobrevivência] no descanso — 10+:1 · 15+:2 · 20+:3 · 25+:4 · 30+:5', requisito: 'Requer Sobrevivência lv.1' },
      ],
    },
  },
  espirito: {
    comunhao: {
      label: 'Comunhão',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Conexão emocional com criaturas, aliados e forças naturais. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Provocar (ação livre)', descricao: 'Força inimigo a direcionar todos os ataques a você por uma rodada. Não custa ação.', teste: 'PRE [Comunhão] vs. VON do alvo — sucesso: alvo provocado por 1 rodada', requisito: 'Requer Comunhão lv.3' },
      ],
    },
    diplomacia: {
      label: 'Diplomacia',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Negociação, persuasão e liderança social. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Coordenar (ação livre)', descricao: 'Concede ação padrão extra a um aliado neste turno por coordenação tática. Não custa ação.', teste: 'INT [Diplomacia] — sucesso automático se aliado estiver presente e ativo', requisito: 'Requer Diplomacia lv.3' },
      ],
    },
    expressao: {
      label: 'Expressão',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Comunicação emocional e artística para inspirar e motivar aliados. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Inspirar (ação livre)', descricao: 'Concede vantagem (+1d20) a um aliado no próximo teste com palavras ou gestos. Não custa ação.', teste: 'PRE [Expressão] — sucesso automático se aliado puder ouvi-lo', requisito: 'Requer Expressão lv.3' },
      ],
    },
    intimidacao: {
      label: 'Intimidação',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Uso do medo e da presença para influenciar outros em combate e situações sociais. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Amedrontar (ação livre)', descricao: 'Impõe desvantagem (−1d20) a um inimigo no próximo teste por presença aterrorizante. Não custa ação.', teste: 'VON [Intimidação] vs. VON do alvo — sucesso: desvantagem no próximo teste', requisito: 'Requer Intimidação lv.3' },
      ],
    },
    labia: {
      label: 'Lábia',
      atributos: ['PRE', 'INT', 'VON'],
      descricao: 'Engano, distração e manipulação verbal para desestabilizar e obter vantagem sobre outros. Possui uma única proficiência avançada, desbloqueada a partir do lv.3.',
      proficiencias: [
        { nome: 'Distrair (ação livre)', descricao: 'Remove a reação disponível de um alvo até o próximo turno por distração verbal ou gestual. Não custa ação.', teste: 'INT [Lábia] vs. INT do alvo — sucesso: alvo sem reação até próximo turno', requisito: 'Requer Lábia lv.3' },
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
