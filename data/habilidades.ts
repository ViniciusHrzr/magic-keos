export type InstanciaKey = 'corpo' | 'mente' | 'espirito';
export type TipoHabilidade = 'passiva' | 'reacao' | 'acao_livre';

export interface Habilidade {
  nome: string;
  instancia: InstanciaKey;
  prerequisito: string;
  custo: string;
  descricao: string;
  teste: string;
  tipo: TipoHabilidade;
}

export const habilidades: Habilidade[] = [
  // ── CORPO ────────────────────────────────────────────────────
  {
    nome: 'Alcance',
    instancia: 'corpo',
    prerequisito: 'REF(2) + Pontaria(+5)',
    custo: '5 SAB',
    tipo: 'reacao',
    descricao: 'Reage com ataque à distância quando o alvo se move em sua direção; em caso de sucesso, impede o avanço — o alvo move apenas metade do deslocamento.',
    teste: 'Impedir [1]: ataque à distância quando alvo avança; sucesso = metade do deslocamento',
  },
  {
    nome: 'Ameaçar',
    instancia: 'corpo',
    prerequisito: 'REF(2) + Furtividade(+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Alvo diretamente engajado não pode usar reações.',
    teste: '— (passiva): alvo engajado não pode reagir',
  },
  {
    nome: 'Atropelar',
    instancia: 'corpo',
    prerequisito: 'FOR(3) + Artes Marciais(+5) ou Esgrima(+5)',
    custo: '5 / 10 / 15 SAB (3 níveis)',
    tipo: 'passiva',
    descricao: 'Acrescenta +1dX de dano ao ataque por nível. O dano extra pode ser distribuído entre criaturas adjacentes ao alvo.',
    teste: '— (passiva): +1dX dano, distribuível em adjacentes',
  },
  {
    nome: 'Destreza',
    instancia: 'corpo',
    prerequisito: 'FOR + Artes Marciais(+2/+4/+6/+8)',
    custo: '2 / 3 / 4 / 5 SAB (4 níveis)',
    tipo: 'passiva',
    descricao: 'Eleva progressivamente o dado de dano desarmado e de bastões: 1d4 → 1d6 → 1d8 → 1d10 → 1d12 (um grau por nível adquirido).',
    teste: '— (passiva): dano desarmado e bastões sobe (1d4 · 1d6 · 1d8 · 1d10 · 1d12)',
  },
  {
    nome: 'Golpe Duplo',
    instancia: 'corpo',
    prerequisito: 'REF(3) + Artes Marciais(+5) ou Esgrima(+5) ou Pontaria(+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Realiza dois ataques consecutivos e independentes na mesma operação de ataque, podendo ser direcionados ao mesmo alvo ou a até dois alvos adjacentes. Não aplicável a armas de duas mãos.',
    teste: '— (passiva): dois ataques consecutivos; até dois alvos adjacentes; não se aplica a armas de duas mãos',
  },
  {
    nome: 'Iniciativa',
    instancia: 'corpo',
    prerequisito: 'REF(2) + Esgrima(+5)',
    custo: '5 SAB',
    tipo: 'reacao',
    descricao: 'Intervém antes que o atacante conclua a ação declarada, atacando primeiro.',
    teste: 'Impugnar [1]: ataca antes do atacante',
  },
  {
    nome: 'Ímpeto',
    instancia: 'corpo',
    prerequisito: 'REF(2) + Atletismo(+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Age automaticamente primeiro em qualquer cena. Pontos de Velocidade tornam-se ações padrão adicionais.',
    teste: '— (passiva): age primeiro + Velocidade para ações padrão',
  },
  {
    nome: 'Vigilância',
    instancia: 'corpo',
    prerequisito: 'REF(2) + qualquer Perícia Corporal(+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Reações não são mais limitadas a 1 por rodada. Cada reação adicional custa 1 ação do turno.',
    teste: '— (passiva): reações ilimitadas (custa 1 ação cada)',
  },

  // ── MENTE ─────────────────────────────────────────────────────
  {
    nome: 'Fetiche',
    instancia: 'mente',
    prerequisito: 'SEN(1) + CON(1) + Criatividade(+5)',
    custo: '5 / 10 / 15 SAB (até 3 fetiches)',
    tipo: 'passiva',
    descricao: 'Vincula um domínio a um objeto físico. Mágicas daquele domínio são reforçadas sem custo de mana. Até 3 fetiches.',
    teste: 'Reforça mágicas de 1 domínio sem custo de mana (até 3 fetiches)',
  },
  {
    nome: 'Grimório',
    instancia: 'mente',
    prerequisito: 'RAZ(1) + CON(1) + Investigação(+5)',
    custo: '5 SAB + 1 (gr.1) / 3 (gr.2) / 6 (gr.3) por magia',
    tipo: 'passiva',
    descricao: 'Aprende mágicas fora dos domínios ativos de forma completamente autodidata, sem precisar de grimórios ou observação.',
    teste: 'Aprende mágicas fora do domínio autodidata',
  },
  {
    nome: 'Mixologia',
    instancia: 'mente',
    prerequisito: 'RAZ(1) + SEN(1) + Alquimia(+5)',
    custo: '5 SAB + 1 / 3 SAB por receita personalizada',
    tipo: 'passiva',
    descricao: 'Cria poções mágicas personalizadas combinando efeitos de múltiplas categorias alquímicas.',
    teste: 'Cria poções mágicas personalizadas',
  },
  {
    nome: 'Modelagem',
    instancia: 'mente',
    prerequisito: 'RAZ(1) + CON(1) + Mecânica(+5)',
    custo: '5 SAB + 1–7 SAB por modelo de criatura',
    tipo: 'passiva',
    descricao: 'Cria e controla uma criatura artefato; quando ela morre, pode ser reativada na mesma cena. Custo por modelo varia pela Classe (f:+1 até A:+7).',
    teste: 'Cria criatura artefato; ao morrer pode ser reativada na mesma cena',
  },
  {
    nome: 'Travessia',
    instancia: 'mente',
    prerequisito: 'SEN(1) + CON(1) + Sobrevivência(+5)',
    custo: '5 / 10 / 15 SAB (até 3 terrenos)',
    tipo: 'passiva',
    descricao: 'Concede vantagem (+1d20) em todos os testes realizados no terreno escolhido. Cada nível desbloqueia 1 terreno.',
    teste: 'Vantagem em todos os testes no terreno escolhido',
  },

  // ── ESPÍRITO ─────────────────────────────────────────────────
  {
    nome: 'Fúria',
    instancia: 'espirito',
    prerequisito: 'VON(3) + Expressão(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Ao sofrer dano, falhar em teste de combate ou presenciar aliado cair, pode entrar em estado de fúria: +1 ação padrão de ataque por turno, mas perde a capacidade de usar reações.',
    teste: 'Enfurecer [1]: aciona ao sofrer dano, falhar em combate ou presenciar aliado cair; +1 ação padrão de ataque/turno, sem reações',
  },
  {
    nome: 'Regenerar',
    instancia: 'espirito',
    prerequisito: 'VON(3) + Comunhão(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Após receber dano, testa VON[Comunhão] vs. o agressor. Sucesso: cura total do dano recebido +Xd6.',
    teste: 'Regenerar [1]: testa VON[COM] vs. agressor; sucesso = cura total +Xd6',
  },
  {
    nome: 'Salvaguarda',
    instancia: 'espirito',
    prerequisito: 'INT(3) + Diplomacia(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Ao ser alvo de uma mágica, testa INT[Diplomacia] vs. o mago. Sucesso: fica imune à mágica.',
    teste: 'Resguardar [1]: testa INT[DIP] vs. mago; sucesso = imune à mágica',
  },
  {
    nome: 'Toque Mortífero',
    instancia: 'espirito',
    prerequisito: 'VON(3) + Intimidação(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Quando for alvo do ataque de uma criatura, destrói instantaneamente uma criatura de Classe B ou menor com um toque carregado de vontade.',
    teste: 'Abater [1]: aciona quando for alvo de ataque; testa VON[INT] vs. criatura ≤ Classe B; destrói',
  },
  {
    nome: 'Vidência',
    instancia: 'espirito',
    prerequisito: 'INT(3) + Lábia(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Prevê a ação declarada de um alvo, impondo desvantagem nela antes de ser executada.',
    teste: 'Antever [1]: testa INT[LAB] vs. IP Esp.; desvantagem na ação declarada',
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
