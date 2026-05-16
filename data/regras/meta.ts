// Metadata for each section of the Regras screen:
// section titles, intro notes, sub-section labels, and table column headers.

export interface SecaoMeta {
  num: string
  titulo: string
  nota?: string
  subs?: Record<string, string>
  colunas?: Record<string, string[]>
}

export const secoes: Record<string, SecaoMeta> = {
  cores: {
    num: '1',
    titulo: 'As Cinco Cores',
    subs: { guildas: 'Combinações (Guildas)' },
    colunas: {
      main: ['Cor', 'Valores', 'Aliadas', 'Inimigas'],
      guildas: ['Combo', 'Nome'],
    },
  },
  personagens: {
    num: '2',
    titulo: 'Construção de Personagens',
    nota: 'Identidade: unidade de evolução — 1 dado daquela cor no atributo, +Vida, +Sabedoria, +Mana incolor',
    subs: { pontosIdentidade: 'Pontos por Identidade' },
    colunas: {
      instancias: ['Instância', 'Conceito', 'Atributos'],
      pontosIdentidade: ['', 'CORPO', 'MENTE', 'ESPÍRITO'],
    },
  },
  atributos: {
    num: '3',
    titulo: 'Atributos',
    nota: 'Cada atributo: até 5 identidades (dados). N dados = N d20 rolados por teste.',
    subs: { corpo: 'CORPO', mente: 'MENTE', espirito: 'ESPÍRITO' },
  },
  pericias: {
    num: '4',
    titulo: 'Perícias',
    nota: 'Custo: 1 SAB para nível 1, +N por nível seguinte (total lv.10 = 55 pts). Abrir domínio concede nível 1 na perícia-chave.',
  },
  habilidades: {
    num: '5',
    titulo: 'Habilidades',
    nota: 'Adquiridas com Sabedoria. Requerem pré-requisitos. Concedem reações especiais ou bônus fixos.',
    subs: { corporais: 'Corporais', mentais: 'Mentais', espirituais: 'Espirituais' },
  },
  balizadores: {
    num: '6',
    titulo: 'Balizadores',
    nota: 'Adquiridos como perícias (custo progressivo, máx. 10 níveis). Cada cor tem um balizador-chave.',
    colunas: { main: ['Balizador', 'Cor', 'Função'] },
  },
  pontos: {
    num: '7',
    titulo: 'Outros Pontos',
    colunas: { main: ['Ponto', 'Função'] },
  },
  dados: {
    num: '8',
    titulo: 'Mecânica de Dados',
    nota: 'Teste base: rola N d20 (N = valor do atributo), escolhe o maior resultado, soma bônus da perícia.',
    subs: { resultados: 'Resultados' },
    colunas: { main: ['Dado', 'Cor', 'Característica Especial'] },
  },
  testes: {
    num: '9',
    titulo: 'Testes',
    nota: 'Fórmula: N d20 → maior resultado + bônus de perícia vs. dificuldade',
    colunas: { main: ['Dificuldade', 'Valor', 'Modificador'] },
  },
  magicas: {
    num: '10',
    titulo: 'Sistema de Mágicas',
    subs: {
      tipos: 'Tipos',
      graus: 'Graus',
      notacao: 'Notação de Custo de Mana',
      conjuracao: 'Conjuração',
    },
    colunas: {
      tipos: ['Tipo', 'Símbolo', 'Funcionamento'],
      graus: ['Grau', 'Nível', 'Custo'],
      notacao: ['Símbolo', 'Significado'],
      conjuracao: ['Ação', 'Descrição'],
    },
  },
  dominios: {
    num: '11',
    titulo: 'Domínios',
    nota: '45 domínios no total (9 por cor × 5 cores), organizados por Instância e Atributo-chave.',
    subs: {
      branco: 'Branco',
      verde: 'Verde',
      vermelho: 'Vermelho',
      preto: 'Preto',
      azul: 'Azul',
    },
    colunas: { main: ['Domínio', 'Instância', 'Atributo', 'Perícia'] },
  },
  canalizacao: {
    num: '12',
    titulo: 'Canalização e Mana',
    nota: 'Ação de descanso — Teste: Vontade [Comunhão]',
    subs: {
      modificadores: 'Modificadores de Ambiente',
      ambientes: 'Ambientes W·G·R·B·U (Branco·Verde·Verm·Preto·Azul)',
      eventos: 'Eventos Climáticos',
    },
    colunas: {
      resultados: ['Resultado', 'Mana obtido'],
      modificadores: ['Mod', 'Descrição'],
      ambientes: ['Ambiente', 'Modificadores'],
      eventos: ['Evento', 'Modificadores'],
    },
  },
  equipamentos: {
    num: '13',
    titulo: 'Equipamentos',
    subs: {
      armas: 'Armas',
      escudos: 'Escudos',
      vestimentas: 'Vestimentas',
      acessorios: 'Acessórios Básicos',
      melhorias: 'Melhorias (máx. 3 por item)',
      elementais: 'Propriedades Elementais',
      afiadores: 'Afiadores (combinações de minerais)',
    },
    colunas: {
      armas: ['Arma', 'Dano', 'Especial'],
      escudos: ['Escudo', 'IP Corp', 'Especial'],
      vestimentas: ['Vestimenta', 'IP Corp', 'IP Ment', 'IP Esp'],
      acessorios: ['Acessório', 'Bônus'],
      melhorias: ['Tipo', 'Descrição'],
      elementais: ['Cor', 'Propriedade', 'Efeito'],
      afiadores: ['Combo', 'Propriedade'],
    },
  },
  alquimia: {
    num: '14',
    titulo: 'Matérias-primas e Alquimia',
    subs: {
      herbologia: 'Herbologia (Ervas)',
      receitas: 'Receitas básicas (3 ervas)',
      proporcoes: 'Proporções',
      soros: 'Zoologia — Soros (mutações temporárias)',
      catalisadores: 'Zoologia — Catalizadores (de ossadas)',
      mineralogia: 'Mineralogia',
    },
    colunas: {
      herbologia: ['Cor', 'Tipo'],
      receitas: ['Combinação', 'Efeito'],
      proporcoes: ['Proporção', 'Resultado'],
      soros: ['Cor', 'Mutações'],
      catalisadores: ['Cor', 'Efeito'],
      mineralogia: ['Tipo', 'Descrição'],
    },
  },
  artefatos: {
    num: '15',
    titulo: 'Artefatos',
    nota: 'Objetos mágicos com Durabilidade (número de usos antes de precisar reparo).',
    subs: { usoReparo: 'Uso e Reparo' },
    colunas: {
      tipos: ['Tipo', 'Produzido por'],
      usoReparo: ['Ação', 'Descrição'],
    },
  },
  criaturas: {
    num: '16',
    titulo: 'Criaturas',
    subs: {
      classes: 'Tabela de Classes',
      ataque: 'Mecânica de Ataque',
      habilidades: 'Habilidades de Criaturas',
    },
    colunas: {
      classes: ['Cl', 'Gr', 'Custo', 'Vida', 'Res', 'Poder', 'Dano', 'Dur'],
      ataque: ['Ação', 'Descrição'],
      habilidades: ['Habilidade', 'Descrição'],
    },
  },
  condicoes: {
    num: '17',
    titulo: 'Condições',
    subs: { veneno: 'Veneno — Marcadores' },
    colunas: {
      main: ['Condição', 'Efeito'],
      veneno: ['Marcadores', 'Efeito'],
    },
  },
  combate: {
    num: '18',
    titulo: 'Combate',
    nota: 'Ações por turno: 1 movimentação + 1 operação + 1 reação + ações extras de Velocidade',
    subs: {
      movimentacao: 'Movimentação',
      operacoes: 'Operações (Ações Padrão)',
      reacoes: 'Reações',
      manifestacoes: 'Manifestações (Ações Mágicas)',
    },
    colunas: { acoes: ['Ação', 'Custo', 'Efeito'], reacoes: ['Reação', 'Custo', 'Efeito'] },
  },
  descanso: {
    num: '19',
    titulo: 'Descanso',
    nota: 'Em cada descanso: recupera mínimo de mana + escolhe 2 ações adicionais',
    colunas: { main: ['Ação', 'Teste', 'Resultado'] },
  },
  evolucao: {
    num: '20',
    titulo: 'Evolução',
    nota: 'Personagens acumulam afinidade de cor (%) pelas ações durante a sessão. Ao atingir 100%: recebe 1 Identidade daquela cor. A contagem reinicia do zero.',
    subs: {
      cenas: 'Tipos de Cena e Afinidade',
      comportamentos: 'Comportamentos × Cor (Combate)',
    },
    colunas: {
      cenas: ['Cena', 'Dificuldade', 'Afinidade'],
      comportamentos: ['Cor', 'Comportamento'],
    },
  },
}
