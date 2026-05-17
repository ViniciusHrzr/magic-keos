export type InstanciaKey = 'corpo' | 'mente' | 'espirito';
export type TipoHabilidade = 'passiva' | 'reacao' | 'acao_livre';

export interface MagicaHabilidade {
  nome: string;
  dominio: string;
  custo: string;
}

export interface Habilidade {
  nome: string;
  instancia: InstanciaKey;
  prerequisito: string;
  custo: string;
  descricao: string;
  tipo: TipoHabilidade;
  magicas?: MagicaHabilidade[];
}

export const habilidades: Habilidade[] = [
  // ── CORPO ────────────────────────────────────────────────────
  {
    nome: 'Alcance',
    instancia: 'corpo',
    prerequisito: 'Reflexos (2); Pontaria (+5)',
    custo: '5 SAB',
    tipo: 'reacao',
    descricao: 'Pode utilizar a reação "Impedir [1]": quando um alvo declara uma ação de movimento, pode realizar um ataque à distância contra ele; em caso de sucesso, impede o alvo de avançar (ele se move apenas metade de seu deslocamento).',
    magicas: [{ nome: 'Mirar Alto', dominio: 'Trilha da Predação', custo: '1gg' }],
  },
  {
    nome: 'Ameaçar',
    instancia: 'corpo',
    prerequisito: 'Reflexos (2); Furtividade (+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Sua aura transborda medo e ameaça, por isso, quando estiver engajado apenas contra um alvo, ele não pode reagir aos seus ataques.',
    magicas: [{ nome: 'Sintonia com a Noite', dominio: 'Arte das Sombras', custo: '1bb' }],
  },
  {
    nome: 'Atropelar',
    instancia: 'corpo',
    prerequisito: 'Força (3); Artes Marciais (+5) ou Esgrima (+5)',
    custo: '5 / 10 / 15 SAB (3 níveis)',
    tipo: 'passiva',
    descricao: 'Seus ataques físicos corpo a corpo causam +1dX de dano, sendo X o valor base do dano da arma. Além disso, você pode distribuir o dano causado em alvos adjacentes. Você pode comprar essa habilidade até 3 vezes para aumentar +1dX de dano.',
    magicas: [{ nome: 'Instinto Selvagem', dominio: 'Trilha dos Instintos', custo: '1gg' }],
  },
  {
    nome: 'Destreza',
    instancia: 'corpo',
    prerequisito: 'Força (1 [II]/2 [III em diante]); Artes Marciais (+2 [II]/+4 [III]/+6 [IV]/+8 [V])',
    custo: '2 / 3 / 4 / 5 SAB (4 níveis)',
    tipo: 'passiva',
    descricao: 'No primeiro de nível de Artes Marciais, você recebe Destreza I, tornando o dano de seu ataque desarmado (ou com bastões) 1d4. Você pode comprar níveis subsequentes: Destreza II (1d6); Destreza III (1d8); Destreza IV (1d10); Destreza V (1d12).',
    magicas: [
      { nome: 'Manoplas da Luz', dominio: 'Alçada da Honra', custo: 'aa' },
      { nome: 'Punhos Chamejantes', dominio: 'Desígnio do Fogo', custo: 'dd' },
      { nome: 'Punhos Dimensionais', dominio: 'Ramo do Espaço-Tempo', custo: 'uu' },
    ],
  },
  {
    nome: 'Golpe Duplo',
    instancia: 'corpo',
    prerequisito: 'Reflexos (3); Artes Marciais (+5), Esgrima (+5) ou Pontaria (+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Você pode realizar até dois ataques consecutivos contra um mesmo alvo ou até dois alvos adjacentes. Não aplicável a armas de duas mãos.',
    magicas: [{ nome: 'Fúria de Batalha', dominio: 'Desígnio da Ira', custo: '1dd' }],
  },
  {
    nome: 'Iniciativa',
    instancia: 'corpo',
    prerequisito: 'Reflexos (2); Esgrima (+5)',
    custo: '5 SAB',
    tipo: 'reacao',
    descricao: 'Pode utilizar a reação "Impugnar [1]": quando um alvo declara uma ação de ataque contra você, pode realizar um ataque contra ele; em caso de sucesso, ataca-o antes e o impede de realizar o seu ataque.',
    magicas: [{ nome: 'Justiça Veloz', dominio: 'Alçada da Justiça', custo: '1aa' }],
  },
  {
    nome: 'Ímpeto',
    instancia: 'corpo',
    prerequisito: 'Reflexos (2); Atletismo (+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Você é sempre o primeiro a agir em combate e pode usar seus pontos de Velocidade para realizar ações padrões e de movimento extras.',
    magicas: [{ nome: 'Agir por Impulso', dominio: 'Desígnio da Agilidade', custo: '1dd' }],
  },
  {
    nome: 'Vigilância',
    instancia: 'corpo',
    prerequisito: 'Reflexos (2); Perícia Corporal (+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Você pode usar reações de forma ilimitada, mas deve gastar 1 ponto de ação para cada uma.',
    magicas: [{ nome: 'Marcado pela Honra', dominio: 'Alçada da Honra', custo: '1aa' }],
  },

  // ── MENTE ─────────────────────────────────────────────────────
  {
    nome: 'Fetiche',
    instancia: 'mente',
    prerequisito: 'Sentidos (1) e Concentração (1); Criatividade (+5)',
    custo: '5 / 10 / 15 SAB (até 3 fetiches)',
    tipo: 'passiva',
    descricao: 'Você produz um objeto para reforçar suas mágicas. Ao construir esse objeto, escolhe um de seus domínios: todas as mágicas que você conjurar deste domínio são reforçadas sem custo adicional de mana. É possível ter até 3 fetiches.',
    magicas: [{ nome: 'Medalhão do Caos', dominio: 'Desígnio dos Ritos Primais', custo: '1dd' }],
  },
  {
    nome: 'Grimório',
    instancia: 'mente',
    prerequisito: 'Razão (1) e Concentração (1); Investigação (+5)',
    custo: '5 SAB + 1 (gr.1) / 3 (gr.2) / 6 (gr.3) por magia',
    tipo: 'passiva',
    descricao: 'Você pode aprender mágicas de outros domínios de forma autodidata, sem precisar encontrar alguém ou um livro que as ensine. Isso significa que você pode gastar pontos de sabedoria a qualquer momento para aprender essas mágicas.',
  },
  {
    nome: 'Mixologia',
    instancia: 'mente',
    prerequisito: 'Razão (1) e Sentidos (1); Alquimia (+5)',
    custo: '5 SAB + 1 / 3 SAB por receita personalizada',
    tipo: 'passiva',
    descricao: 'Você é capaz de misturar ingredientes diversos para fazer poções mágicas com efeitos poderosos. Em vez de ser limitado pelos efeitos dos campos de conhecimento das áreas da alquimia, você pode inventar suas próprias produções ou aprender com pessoas que já conhecem uma receita.',
  },
  {
    nome: 'Modelagem',
    instancia: 'mente',
    prerequisito: 'Razão (1) e Concentração (1); Mecânica (+5)',
    custo: '5 SAB + 1–7 SAB por modelo de criatura',
    tipo: 'passiva',
    descricao: 'Você é capaz de construir uma criatura artefato que te acompanhará sempre. Para fazê-la funcionar, é preciso ativá-la como qualquer artefato. Entretanto, sempre que ela morrer por qualquer efeito, ela pode ser ativada novamente na mesma cena (diferente de outras criaturas que não podem ser conjuradas de novo).',
  },
  {
    nome: 'Travessia',
    instancia: 'mente',
    prerequisito: 'Sentidos (1) e Concentração (1); Sobrevivência (+5)',
    custo: '5 / 10 / 15 SAB (até 3 terrenos)',
    tipo: 'passiva',
    descricao: 'Você se vira melhor em um tipo específico de terreno. Ao adquirir essa habilidade, escolha um tipo de terreno entre Planície (branco), Floresta (verde), Montanha (vermelho), Pântano (preto) ou Ilha (azul); enquanto estiver no terreno escolhido, tem vantagem (+1d20 básico) em qualquer teste que realizar. É possível ter até 3 tipos de travessia.',
    magicas: [{ nome: 'Sintonia com o Ambiente', dominio: 'Trilha da Subsistência', custo: '1gg' }],
  },

  // ── ESPÍRITO ─────────────────────────────────────────────────
  {
    nome: 'Fúria',
    instancia: 'espirito',
    prerequisito: 'Vontade (3); Expressão (+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Pode utilizar a reação "Enfurecer [1]" quando sofrer dano, falhar em um teste de combate ou presenciar um aliado cair para entrar em Fúria; enquanto estiver sob esse efeito, você não pode usar reações, mas recebe uma ação padrão adicional por turno exclusivamente para atacar.',
    magicas: [{ nome: 'Coroa de Chamas', dominio: 'Arte da Guerra', custo: '2dd' }],
  },
  {
    nome: 'Regenerar',
    instancia: 'espirito',
    prerequisito: 'Vontade (3); Comunhão (+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Pode utilizar a reação "Regenerar [1]" ao sofrer dano de qualquer natureza, então faz um teste oposto de Vontade [Comunhão] contra o teste de seu agressor; se tiver sucesso, regenera toda a vida perdida e cura +Xd6 de vida, sendo X seu valor em Vontade.',
    magicas: [{ nome: 'Coroa de Vigor', dominio: 'Arte da Vitalidade', custo: '2gg' }],
  },
  {
    nome: 'Salvaguarda',
    instancia: 'espirito',
    prerequisito: 'Intuição (3); Diplomacia (+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Pode utilizar a reação "Resguardar [1]" quando for alvo de uma mágica para fazer um teste oposto de Intuição [Diplomacia] contra o teste de seu agressor; se tiver sucesso, a mágica não surte efeito em você.',
    magicas: [{ nome: 'Auréola Rúnica', dominio: 'Alçada da Proteção', custo: '2aa' }],
  },
  {
    nome: 'Toque Mortífero',
    instancia: 'espirito',
    prerequisito: 'Vontade (3); Intimidação (+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Pode utilizar a reação "Abater [1]" quando for alvo do ataque de uma criatura conjurada de até Classe B para fazer um teste oposto de Vontade [Intimidação] contra o teste dela; se tiver sucesso, a criatura é destruída.',
    magicas: [{ nome: 'Coroa de Oblívio', dominio: 'Arte da Danação', custo: '2bb' }],
  },
  {
    nome: 'Vidência',
    instancia: 'espirito',
    prerequisito: 'Intuição (3); Lábia (+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Pode utilizar a reação "Antever [1]" quando um alvo declarar uma ação para fazer um teste de Intuição [Lábia] contra o IP Espiritual do alvo; em caso de sucesso, o teste da ação declarada sofre uma desvantagem (-1d20) e, independentemente da ação realizada, o alvo deve resolver esse teste como um teste oposto contra o resultado da sua reação.',
    magicas: [{ nome: 'Auréola Ocular', dominio: 'Ramo da Presciência', custo: '2uu' }],
  },
];

export const INSTANCIA_LABEL: Record<InstanciaKey, string> = {
  corpo: 'CORPO',
  mente: 'MENTE',
  espirito: 'ESPÍRITO',
};

export const TIPO_LABEL: Record<TipoHabilidade, string> = {
  passiva: 'PASSIVA',
  reacao: 'REAÇÃO',
  acao_livre: 'AÇÃO LIVRE',
};
