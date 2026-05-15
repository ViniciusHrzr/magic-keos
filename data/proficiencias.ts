export type InstanciaKey = 'corpo' | 'mente' | 'espirito';

export type PericiaKey =
  | 'artesMarciais'
  | 'atletismo'
  | 'esgrima'
  | 'furtividade'
  | 'pontaria'
  | 'alquimia'
  | 'criatividade'
  | 'investigacao'
  | 'mecanica'
  | 'sobrevivencia'
  | 'comunhao'
  | 'diplomacia'
  | 'expressao'
  | 'intimidacao'
  | 'labia';

export interface Proficiencia {
  nome: string;
  descricao: string;
  teste: string;
  requisito?: string;
}

export interface PericiaData {
  label: string;
  atributos: string[];
  proficiencias: Proficiencia[];
}

export type ProficienciasMap = Record<InstanciaKey, Partial<Record<PericiaKey, PericiaData>>>;

export const proficiencias: ProficienciasMap = {
  corpo: {
    artesMarciais: {
      label: 'Artes Marciais',
      atributos: ['FOR', 'REF', 'VIG', 'PRE'],
      proficiencias: [
        {
          nome: 'Derrubar',
          descricao: 'Joga o oponente ao chão, impondo desvantagem em ataques e impedindo movimentação até que ele se levante.',
          teste: 'FOR [Artes Marciais] oposto ao oponente',
        },
        {
          nome: 'Desarmar',
          descricao: 'Retira a arma do oponente das mãos com um golpe ou torção de pulso preciso.',
          teste: 'REF [Artes Marciais] oposto ao oponente',
        },
        {
          nome: 'Desviar',
          descricao: 'Redireciona um ataque físico para longe do corpo usando o próprio impulso do adversário.',
          teste: 'REF [Artes Marciais] oposto ao atacante',
        },
        {
          nome: 'Fintar',
          descricao: 'Cria uma abertura falsa para enganar o oponente e atacar com vantagem no próximo golpe.',
          teste: 'PRE [Artes Marciais] vs. SEN do oponente',
        },
        {
          nome: 'Imobilizar',
          descricao: 'Prende o oponente em uma chave ou torção, impedindo quaisquer ações físicas por uma rodada.',
          teste: 'FOR [Artes Marciais] oposto ao oponente',
        },
        {
          nome: 'Aparar (reação lv.2)',
          descricao: 'Intercepção de ataque físico com o corpo ou arma. No sucesso: metade do dano e pode aplicar imediatamente uma manobra de Artes Marciais.',
          teste: 'REF [Artes Marciais] oposto ao atacante — reação [1]',
          requisito: 'Requer Artes Marciais lv.2',
        },
      ],
    },
    atletismo: {
      label: 'Atletismo',
      atributos: ['FOR', 'REF', 'VIG'],
      proficiencias: [
        {
          nome: 'Investida',
          descricao: 'Combina movimentação e ataque em uma única ação, adicionando dano pela força do impacto.',
          teste: 'FOR/REF [Atletismo] — dano adicional pela distância percorrida',
        },
        {
          nome: 'Prontidão',
          descricao: 'Mantém o corpo em estado de alerta máximo, permitindo agir antes dos outros e ignorar surpresas parciais.',
          teste: 'VIG [Atletismo] — determina posição na ordem de iniciativa',
        },
        {
          nome: 'Fôlego',
          descricao: 'Sustenta esforço físico extremo sem sofrer penalidades de exaustão por períodos prolongados.',
          teste: 'VIG [Atletismo] — resistência a condições de esforço e exaustão',
        },
        {
          nome: 'Disparar (reação lv.1)',
          descricao: 'Executar movimentação de fuga ou avanço rápido como resposta a um evento. Sucesso permite mover 9m extras.',
          teste: 'REF [Atletismo] vs. dificuldade 15 — reação [1]',
          requisito: 'Requer Atletismo lv.1',
        },
      ],
    },
    esgrima: {
      label: 'Esgrima',
      atributos: ['FOR', 'REF'],
      proficiencias: [
        {
          nome: 'Armas Leves',
          descricao: 'Proficiência com adagas e armas de uma mão leves — sem penalidades de manejo, alcance curto de 9m para arremesso.',
          teste: 'Passiva — desbloqueia uso sem penalidade',
        },
        {
          nome: 'Uma Mão',
          descricao: 'Proficiência com espadas e lanças curtas de uma mão, incluindo bônus de escudo simultâneo.',
          teste: 'Passiva — desbloqueia uso sem penalidade',
        },
        {
          nome: 'Duas Mãos',
          descricao: 'Proficiência com montantes, lanças longas e armas pesadas, maximizando o dado de dano.',
          teste: 'Passiva — desbloqueia uso sem penalidade',
        },
        {
          nome: 'Especialização',
          descricao: 'Bônus fixo de acurácia com a arma favorita, reduzindo penalidades situacionais.',
          teste: 'Passiva — +bônus nos testes da arma escolhida',
        },
        {
          nome: 'Mestria',
          descricao: 'Domínio pleno que desbloqueia manobras exclusivas e elimina penalidades avançadas.',
          teste: 'Passiva — desbloqueia manobras especiais da arma',
        },
        {
          nome: 'Contra-atacar (reação lv.2)',
          descricao: 'Quando o adversário erra um ataque corpo a corpo, realiza imediatamente um contra-ataque.',
          teste: 'REF [Esgrima] oposto ao atacante que errou — reação [1]',
          requisito: 'Requer Esgrima lv.2',
        },
      ],
    },
    furtividade: {
      label: 'Furtividade',
      atributos: ['REF'],
      proficiencias: [
        {
          nome: 'Ataque Furtivo',
          descricao: 'Golpe surpresa executado de posição oculta, causando dano adicional significativo.',
          teste: 'REF [Furtividade] vs. Percepção do alvo — requer posição oculta',
        },
        {
          nome: 'Ataque Letal',
          descricao: 'Mira zonas vitais do alvo para causar condições graves além do dano base.',
          teste: 'REF [Furtividade] vs. dificuldade — resultado define a condição aplicada',
        },
        {
          nome: 'Ataque Silencioso',
          descricao: 'Neutraliza o alvo sem produzir som perceptível, sem alertar ninguém nos arredores.',
          teste: 'REF [Furtividade] oposto à SEN de todos os presentes',
        },
        {
          nome: 'Esquivar (reação lv.1)',
          descricao: 'Evita completamente um ataque com um desvio no último momento. Sucesso: zero dano recebido.',
          teste: 'REF [Furtividade] oposto ao atacante — sucesso: dano zerado — reação [1]',
          requisito: 'Requer Furtividade lv.1',
        },
      ],
    },
    pontaria: {
      label: 'Pontaria',
      atributos: ['REF', 'FOR', 'RAZ', 'PRE'],
      proficiencias: [
        {
          nome: 'Arcos',
          descricao: 'Proficiência com arcos curtos (1d6, 18m) e longos (1d8, 30m), sem penalidades de manejo.',
          teste: 'Passiva — desbloqueia uso sem penalidade',
        },
        {
          nome: 'Arremesso',
          descricao: 'Proficiência com armas de arremesso: adagas e machados (9m, 1d4), lanças curtas (18m, 1d6).',
          teste: 'Passiva — desbloqueia uso sem penalidade',
        },
        {
          nome: 'Condutores',
          descricao: 'Proficiência com varinhas (1d4, 9m, 1 mão) e cajados (1d6, 18m, 2 mãos) para dano mágico.',
          teste: 'Passiva — desbloqueia uso sem penalidade',
        },
        {
          nome: 'Especialização',
          descricao: 'Bônus de acurácia com o tipo de arma à distância preferido, reduzindo penalidades situacionais.',
          teste: 'Passiva — +bônus nos testes da arma escolhida',
        },
        {
          nome: 'Mestria',
          descricao: 'Domínio avançado com técnicas especiais de disparo e penalidades de distância reduzidas.',
          teste: 'Passiva — desbloqueia manobras especiais de disparo',
        },
        {
          nome: 'Mirar (reação lv.2)',
          descricao: 'Ajuste cuidadoso de mira que acumula bônus para o próximo ataque de Pontaria.',
          teste: 'REF [Pontaria] — bônus acumulado ao próximo disparo — reação [1]',
          requisito: 'Requer Pontaria lv.2',
        },
      ],
    },
  },
  mente: {
    alquimia: {
      label: 'Alquimia',
      atributos: ['RAZ'],
      proficiencias: [
        {
          nome: 'Herbologia',
          descricao: 'Permite coletar e processar ervas (brancas/verdes/vermelhas/pretas/azuis) para criar poções de cura, imunidade, estimulantes, danosos ou adaptativos.',
          teste: 'Passiva — desbloqueia categoria de produção',
        },
        {
          nome: 'Mineralogia',
          descricao: 'Permite trabalhar com minerais para fabricar bombas de efeito em área e proteções elementais contra cores específicas.',
          teste: 'Passiva — desbloqueia categoria de produção',
        },
        {
          nome: 'Zoologia',
          descricao: 'Permite extrair soros de criaturas (mutações temporárias por cor) e catalizadores para potencializar mágicas.',
          teste: 'Passiva — desbloqueia categoria de produção',
        },
        {
          nome: 'Poções (lv.1)',
          descricao: 'Cria poções alquímicas durante o descanso. O resultado depende do teste.',
          teste: 'RAZ [Alquimia] no descanso — falha: reduzido · 10+: pretendido · 20+: potencializado',
          requisito: 'Requer Alquimia lv.1',
        },
      ],
    },
    criatividade: {
      label: 'Criatividade',
      atributos: ['RAZ'],
      proficiencias: [
        {
          nome: 'Recapitular',
          descricao: 'Replica uma mágica já conjurada na mesma cena pagando apenas o custo de mana, sem conjurar novamente.',
          teste: 'Passiva — disponível ao lançar mágica da mesma cena',
        },
        {
          nome: 'Reciclar',
          descricao: 'Altera alvo, área ou duração de uma mágica já ativa, pagando custo de mana adicional.',
          teste: 'Passiva — aplicado ao modificar mágica ativa',
        },
        {
          nome: 'Reforçar',
          descricao: 'Potencializa dano, alcance ou duração de uma mágica ao custo de mana adicional.',
          teste: 'Passiva — multiplicador de efeito com mana extra',
        },
        {
          nome: 'Repartir',
          descricao: 'Divide o efeito de uma única mágica entre múltiplos alvos dentro do alcance.',
          teste: 'Passiva — efeito dividido entre os alvos escolhidos',
        },
        {
          nome: 'Replicar',
          descricao: 'Reproduz funcionalmente um objeto simples ou efeito visual observado recentemente.',
          teste: 'RAZ [Criatividade] vs. complexidade do objeto',
        },
        {
          nome: 'Solução (lv.1)',
          descricao: 'Improvisa respostas eficazes a problemas inéditos sem os recursos ou ferramentas ideais.',
          teste: 'RAZ [Criatividade] vs. dificuldade do problema',
          requisito: 'Requer Criatividade lv.1',
        },
      ],
    },
    investigacao: {
      label: 'Investigação',
      atributos: ['RAZ', 'SEN', 'CON'],
      proficiencias: [
        {
          nome: 'Selo de Feitiço',
          descricao: 'Inscreve mágicas em superfícies ou objetos para disparar automaticamente quando ativadas por uma condição.',
          teste: 'RAZ [Investigação] — dificuldade varia com o grau do feitiço inscrito',
        },
        {
          nome: 'Encantamento',
          descricao: 'Estuda e absorve feitiços de fontes externas: grimórios, artefatos ou mágicas observadas em uso.',
          teste: 'RAZ [Investigação] oposto à complexidade da fonte',
        },
        {
          nome: 'Invocação',
          descricao: 'Aprende e aprimora técnicas de conjuração e controle de criaturas mágicas.',
          teste: 'RAZ [Investigação] para aprender — CON [Investigação] para controlar a criatura',
        },
        {
          nome: 'Leitura (lv.1)',
          descricao: 'Decifra textos arcanos, runas, mapas antigos e manuscritos mágicos de qualquer era.',
          teste: 'RAZ [Investigação] — dificuldade varia com a antiguidade e complexidade do texto',
          requisito: 'Requer Investigação lv.1',
        },
      ],
    },
    mecanica: {
      label: 'Mecânica',
      atributos: ['RAZ', 'CON'],
      proficiencias: [
        {
          nome: 'Artesão',
          descricao: 'Fabrica objetos, acessórios e joias com durabilidade e possibilidade de até 3 melhorias elementais.',
          teste: 'RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas',
        },
        {
          nome: 'Feiticeiro',
          descricao: 'Cria condutores mágicos encantados: varinhas de 1 mão (1d4, 9m) e cajados de 2 mãos (1d6, 18m).',
          teste: 'RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas',
        },
        {
          nome: 'Ferreiro',
          descricao: 'Forja armas, escudos e armaduras com propriedades especiais e até 3 melhorias elementais.',
          teste: 'RAZ [Mecânica] no descanso — falha: 0,5 etapa · 10+: 1 etapa · 20+: 2 etapas',
        },
        {
          nome: 'Artefatos (lv.1)',
          descricao: 'Ativa artefatos gastando 1 mana incolor e repara cargas perdidas durante o descanso.',
          teste: 'Ativar: ação [1] + 1 mana incolor · Reparar (CON [Mecânica]): 10+:1 · 15+:2 · 20+:3 · 25+:4 · 30+:5',
          requisito: 'Requer Mecânica lv.1',
        },
      ],
    },
    sobrevivencia: {
      label: 'Sobrevivência',
      atributos: ['RAZ', 'SEN'],
      proficiencias: [
        {
          nome: 'Acampamento',
          descricao: 'Prepara abrigos e locais de descanso estruturados que melhoram a recuperação de vida e recursos.',
          teste: 'RAZ [Sobrevivência] — melhora os modificadores das ações de descanso',
        },
        {
          nome: 'Harmonização',
          descricao: 'Sincroniza com o terreno local para obter bônus nos modificadores de canalização de mana.',
          teste: 'Passiva — melhora modificador de ambiente para Canalizar',
        },
        {
          nome: 'Forrageamento',
          descricao: 'Coleta ervas, minerais e partes de criaturas do ambiente natural durante exploração ou descanso.',
          teste: 'RAZ [Sobrevivência] — tipo e quantidade dependem do bioma',
        },
        {
          nome: 'Manufaturação',
          descricao: 'Produz itens básicos de sobrevivência a partir de matérias-primas sem precisar de ferramentas especiais.',
          teste: 'RAZ [Sobrevivência] vs. complexidade do item fabricado',
        },
        {
          nome: 'Treinamento',
          descricao: 'Treina animais ou aliados para desenvolver habilidades específicas e melhorar seu desempenho em cena.',
          teste: 'PRE ou INT [Sobrevivência] vs. complexidade do treinamento',
        },
        {
          nome: 'Coleta (lv.1)',
          descricao: 'Recolhe matérias-primas naturais (ervas, minerais, ossadas) durante períodos de descanso.',
          teste: 'RAZ [Sobrevivência] no descanso — 10+:1 · 15+:2 · 20+:3 · 25+:4 · 30+:5',
          requisito: 'Requer Sobrevivência lv.1',
        },
      ],
    },
  },
  espirito: {
    comunhao: {
      label: 'Comunhão',
      atributos: ['PRE', 'INT', 'VON'],
      proficiencias: [
        {
          nome: 'Provocar (ação livre lv.3)',
          descricao: 'Força um inimigo a direcionar todos os seus ataques a você durante a próxima rodada. Não custa ação.',
          teste: 'PRE [Comunhão] vs. VON do alvo — sucesso: alvo provocado por 1 rodada',
          requisito: 'Requer Comunhão lv.3',
        },
      ],
    },
    diplomacia: {
      label: 'Diplomacia',
      atributos: ['PRE', 'INT', 'VON'],
      proficiencias: [
        {
          nome: 'Coordenar (ação livre lv.3)',
          descricao: 'Concede uma ação padrão extra a um aliado neste turno por coordenação tática perfeita. Não custa ação.',
          teste: 'INT [Diplomacia] — sucesso automático se aliado estiver presente e ativo',
          requisito: 'Requer Diplomacia lv.3',
        },
      ],
    },
    expressao: {
      label: 'Expressão',
      atributos: ['PRE', 'INT', 'VON'],
      proficiencias: [
        {
          nome: 'Inspirar (ação livre lv.3)',
          descricao: 'Concede vantagem (+1d20) a um aliado no próximo teste com palavras ou gestos inspiradores. Não custa ação.',
          teste: 'PRE [Expressão] — sucesso automático se aliado puder ouvi-lo',
          requisito: 'Requer Expressão lv.3',
        },
      ],
    },
    intimidacao: {
      label: 'Intimidação',
      atributos: ['PRE', 'INT', 'VON'],
      proficiencias: [
        {
          nome: 'Amedrontar (ação livre lv.3)',
          descricao: 'Impõe desvantagem (−1d20) a um inimigo no próximo teste por presença aterrorizante. Não custa ação.',
          teste: 'VON [Intimidação] vs. VON do alvo — sucesso: desvantagem no próximo teste',
          requisito: 'Requer Intimidação lv.3',
        },
      ],
    },
    labia: {
      label: 'Lábia',
      atributos: ['PRE', 'INT', 'VON'],
      proficiencias: [
        {
          nome: 'Distrair (ação livre lv.3)',
          descricao: 'Remove a reação disponível de um alvo até o início do próximo turno por distração verbal ou gestual. Não custa ação.',
          teste: 'INT [Lábia] vs. INT do alvo — sucesso: alvo sem reação até o próximo turno',
          requisito: 'Requer Lábia lv.3',
        },
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
