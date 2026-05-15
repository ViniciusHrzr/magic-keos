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
}

export interface PericiaData {
  label: string;
  proficiencias: Proficiencia[];
}

export type ProficienciasMap = Record<InstanciaKey, Partial<Record<PericiaKey, PericiaData>>>;

export const proficiencias: ProficienciasMap = {
  corpo: {
    artesMarciais: {
      label: 'Artes Marciais',
      proficiencias: [
        { nome: 'Derrubar', descricao: 'Joga o oponente ao chão, deixando-o em desvantagem física por uma rodada.' },
        { nome: 'Desarmar', descricao: 'Arranca a arma do oponente das mãos com força ou técnica apurada.' },
        { nome: 'Desviar', descricao: 'Redireciona um ataque físico para longe do corpo usando o próprio movimento.' },
        { nome: 'Fintar', descricao: 'Cria uma abertura falsa no combate para atacar o oponente com vantagem.' },
        { nome: 'Imobilizar', descricao: 'Prende o movimento do oponente, impedindo-o de agir fisicamente por uma rodada.' },
        { nome: 'Aparar (reação lv.2)', descricao: 'Intercepta ataques físicos com o corpo ou arma. REF [AM] oposto — sucesso reduz metade do dano e permite uma manobra. Reação, requer lv.2.' },
      ],
    },
    atletismo: {
      label: 'Atletismo',
      proficiencias: [
        { nome: 'Investida', descricao: 'Combina movimento e ataque em uma única ação veloz, causando dano extra pela força do impacto.' },
        { nome: 'Prontidão', descricao: 'Mantém o corpo em estado de alerta máximo para agir antes dos outros na cena.' },
        { nome: 'Fôlego', descricao: 'Sustenta esforço físico intenso por períodos prolongados sem penalidades de exaustão.' },
        { nome: 'Disparar (reação lv.1)', descricao: 'Executa uma movimentação de fuga ou avanço rápido com teste de Atletismo. Reação, requer lv.1.' },
      ],
    },
    esgrima: {
      label: 'Esgrima',
      proficiencias: [
        { nome: 'Armas Leves', descricao: 'Maneja adagas, machados leves e outras armas de uma mão leves com precisão e velocidade.' },
        { nome: 'Uma Mão', descricao: 'Empunha espadas, lanças curtas e armas de uma mão com domínio técnico.' },
        { nome: 'Duas Mãos', descricao: 'Opera montantes, lanças longas e armas pesadas de duas mãos com força e controle.' },
        { nome: 'Especialização', descricao: 'Aplica técnicas avançadas com a arma favorita, obtendo bônus fixo de acurácia.' },
        { nome: 'Mestria', descricao: 'Domínio pleno da arma escolhida — desbloqueia manobras exclusivas e reduz penalidades.' },
        { nome: 'Contra-atacar (reação lv.2)', descricao: 'Quando o adversário erra um ataque, realiza um contra-ataque imediato de REF [Esgrima]. Reação, requer lv.2.' },
      ],
    },
    furtividade: {
      label: 'Furtividade',
      proficiencias: [
        { nome: 'Ataque Furtivo', descricao: 'Golpe surpresa realizado a partir das sombras ou posição oculta, com dano adicional significativo.' },
        { nome: 'Ataque Letal', descricao: 'Mira zonas vitais do alvo para causar condições graves além do dano base.' },
        { nome: 'Ataque Silencioso', descricao: 'Neutraliza o alvo sem gerar ruído, alertas ou evidências visíveis nos arredores.' },
        { nome: 'Esquivar (reação lv.1)', descricao: 'Evita completamente um ataque com um desvio ágil no momento certo. REF [Furtividade] oposto — sucesso cancela todo o dano. Reação, requer lv.1.' },
      ],
    },
    pontaria: {
      label: 'Pontaria',
      proficiencias: [
        { nome: 'Arcos', descricao: 'Maneja arcos curtos (18m) e longos (30m) com precisão e cadência de disparo.' },
        { nome: 'Arremesso', descricao: 'Lança adagas, machados e lanças curtas como projéteis com alcance de 9–18m.' },
        { nome: 'Condutores', descricao: 'Utiliza varinhas e cajados como armas de alcance para projéteis mágicos.' },
        { nome: 'Especialização', descricao: 'Aplica técnicas apuradas com o tipo de arma à distância preferido, ganhando bônus de acurácia.' },
        { nome: 'Mestria', descricao: 'Domínio avançado que desbloqueia técnicas de disparo especiais e reduz penalidades de distância.' },
        { nome: 'Mirar (reação lv.2)', descricao: 'Ajusta a mira cuidadosamente, concedendo bônus ao próximo ataque de Pontaria. Reação, requer lv.2.' },
      ],
    },
  },
  mente: {
    alquimia: {
      label: 'Alquimia',
      proficiencias: [
        { nome: 'Herbologia', descricao: 'Coleta e processa ervas para criar poções de cura, imunidade, estimulantes ou poções danosas.' },
        { nome: 'Mineralogia', descricao: 'Trabalha com minerais para fabricar bombas de efeito em área e proteções alquímicas.' },
        { nome: 'Zoologia', descricao: 'Extrai soros de partes de criaturas para conceder mutações temporárias, e catalizadores para potencializar mágicas.' },
        { nome: 'Poções (lv.1)', descricao: 'Cria poções alquímicas básicas durante períodos de descanso com RAZ [Alquimia]. Requer lv.1.' },
      ],
    },
    criatividade: {
      label: 'Criatividade',
      proficiencias: [
        { nome: 'Recapitular', descricao: 'Replica uma mágica já conjurada anteriormente durante a mesma cena, sem precisar conjurar novamente.' },
        { nome: 'Reciclar', descricao: 'Modifica características de uma mágica já ativa — alvo, área ou duração.' },
        { nome: 'Reforçar', descricao: 'Potencializa dano, alcance ou duração de uma mágica ao custo de mana adicional.' },
        { nome: 'Repartir', descricao: 'Divide o efeito de uma única mágica entre múltiplos alvos simultaneamente.' },
        { nome: 'Replicar', descricao: 'Reproduz funcionalmente um objeto simples ou efeito visual observado recentemente.' },
        { nome: 'Solução (lv.1)', descricao: 'Improvisa respostas criativas a problemas inéditos sem os recursos ideais. RAZ [Criatividade]. Requer lv.1.' },
      ],
    },
    investigacao: {
      label: 'Investigação',
      proficiencias: [
        { nome: 'Selo de Feitiço', descricao: 'Inscreve mágicas em superfícies ou objetos para disparar automaticamente quando ativados.' },
        { nome: 'Encantamento', descricao: 'Estuda e absorve feitiços de fontes externas como grimórios, artefatos e mágicas observadas.' },
        { nome: 'Invocação', descricao: 'Pesquisa e aprende técnicas de conjuração e controle de criaturas mágicas.' },
        { nome: 'Leitura (lv.1)', descricao: 'Decifra textos arcanos, runas, mapas antigos e manuscritos mágicos. RAZ [Investigação]. Requer lv.1.' },
      ],
    },
    mecanica: {
      label: 'Mecânica',
      proficiencias: [
        { nome: 'Artesão', descricao: 'Fabrica objetos, acessórios e joias funcionais com durabilidade e propriedades elementais.' },
        { nome: 'Feiticeiro', descricao: 'Cria condutores mágicos encantados — varinhas de 1 mão e cajados de 2 mãos para dano mágico.' },
        { nome: 'Ferreiro', descricao: 'Forja armas, escudos e armaduras com melhorias elementais e propriedades especiais.' },
        { nome: 'Artefatos (lv.1)', descricao: 'Ativa artefatos com mana incolor e os repara com CON [Mecânica] durante descanso. Requer lv.1.' },
      ],
    },
    sobrevivencia: {
      label: 'Sobrevivência',
      proficiencias: [
        { nome: 'Acampamento', descricao: 'Prepara abrigos e locais de descanso que melhoram a recuperação de vida e recursos.' },
        { nome: 'Harmonização', descricao: 'Sincroniza-se com o terreno para obter bônus nos modificadores de canalização de mana.' },
        { nome: 'Forrageamento', descricao: 'Coleta ervas, minerais e partes de criaturas do ambiente natural ao redor.' },
        { nome: 'Manufaturação', descricao: 'Produz itens de sobrevivência básicos a partir de matérias-primas brutas sem ferramentas especiais.' },
        { nome: 'Treinamento', descricao: 'Treina animais ou aliados para desenvolver habilidades específicas e melhorar desempenho em cena.' },
        { nome: 'Coleta (lv.1)', descricao: 'Recolhe matérias-primas naturais durante períodos de descanso com RAZ [Sobrevivência]. Requer lv.1.' },
      ],
    },
  },
  espirito: {
    comunhao: {
      label: 'Comunhão',
      proficiencias: [
        { nome: 'Provocar (ação livre lv.3)', descricao: 'Força um inimigo a direcionar todos os seus ataques a você durante a próxima rodada. Ação livre, requer lv.3 em Comunhão.' },
      ],
    },
    diplomacia: {
      label: 'Diplomacia',
      proficiencias: [
        { nome: 'Coordenar (ação livre lv.3)', descricao: 'Concede uma ação padrão extra a um aliado neste turno por meio de coordenação tática perfeita. Ação livre, requer lv.3 em Diplomacia.' },
      ],
    },
    expressao: {
      label: 'Expressão',
      proficiencias: [
        { nome: 'Inspirar (ação livre lv.3)', descricao: 'Concede vantagem (+1d20) a um aliado no seu próximo teste de dados com palavras ou gestos inspiradores. Ação livre, requer lv.3 em Expressão.' },
      ],
    },
    intimidacao: {
      label: 'Intimidação',
      proficiencias: [
        { nome: 'Amedrontar (ação livre lv.3)', descricao: 'Impõe desvantagem (−1d20) a um inimigo no seu próximo teste através de presença aterrorizante. Ação livre, requer lv.3 em Intimidação.' },
      ],
    },
    labia: {
      label: 'Lábia',
      proficiencias: [
        { nome: 'Distrair (ação livre lv.3)', descricao: 'Remove a reação disponível de um alvo até o início do próximo turno por meio de distração verbal ou gestual. Ação livre, requer lv.3 em Lábia.' },
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
