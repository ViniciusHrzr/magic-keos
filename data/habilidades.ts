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
    descricao: 'Permite atacar criaturas com Voar ou em movimento. Cancela projéteis disparados contra aliados adjacentes.',
    teste: 'Impedir [1]: REF [Pontaria] — ataque à distância quando alvo se move ou voa',
  },
  {
    nome: 'Ameaçar',
    instancia: 'corpo',
    prerequisito: 'REF(2) + Furtividade(+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Alvo diretamente engajado não pode usar reações enquanto você estiver ameaçando ativamente.',
    teste: 'Passiva — o alvo perde acesso a reações enquanto engajado',
  },
  {
    nome: 'Atropelar',
    instancia: 'corpo',
    prerequisito: 'FOR(3) + Artes Marciais(+5) ou Esgrima(+5)',
    custo: '5 / 10 / 15 SAB (3 níveis)',
    tipo: 'passiva',
    descricao: 'Excesso de dano que ultrapassa os pontos de vida do alvo transborda para criaturas adjacentes. Cada nível aumenta o multiplicador.',
    teste: 'Passiva — dano excedente (+1dX por nível) distribuído automaticamente',
  },
  {
    nome: 'Destreza',
    instancia: 'corpo',
    prerequisito: 'FOR + Artes Marciais(+2/+4/+6/+8)',
    custo: '2 / 3 / 4 / 5 SAB (4 níveis)',
    tipo: 'passiva',
    descricao: 'Eleva progressivamente o dado de dano desarmado: dW I → dW II → dW III → dW IV → dW V.',
    teste: 'Passiva — dado de dano desarmado aumenta por nível da habilidade',
  },
  {
    nome: 'Golpe Duplo',
    instancia: 'corpo',
    prerequisito: 'REF(3) + Artes Marciais(+5) ou Esgrima(+5) ou Pontaria(+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Permite realizar dois ataques consecutivos e independentes na mesma operação de ataque.',
    teste: 'Passiva — dois ataques na mesma ação de Atacar, cada um com seu teste',
  },
  {
    nome: 'Iniciativa',
    instancia: 'corpo',
    prerequisito: 'REF(2) + Esgrima(+5)',
    custo: '5 SAB',
    tipo: 'reacao',
    descricao: 'Intervém antes que um atacante conclua a ação declarada, atacando antes mesmo de ser atingido.',
    teste: 'Impugnar [1]: FOR/REF [Esgrima] oposto ao atacante — sucesso: ataca antes',
  },
  {
    nome: 'Ímpeto',
    instancia: 'corpo',
    prerequisito: 'REF(2) + Atletismo(+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Age automaticamente primeiro em qualquer cena e converte pontos de Velocidade em ações padrão adicionais.',
    teste: 'Passiva — age primeiro; cada ponto de Velocidade = 1 ação padrão extra',
  },
  {
    nome: 'Vigilância',
    instancia: 'corpo',
    prerequisito: 'REF(2) + qualquer Perícia Corporal(+5)',
    custo: '5 SAB',
    tipo: 'passiva',
    descricao: 'Reações deixam de ser limitadas a 1 por rodada. Cada reação adicional custa 1 ação do turno.',
    teste: 'Passiva — reações ilimitadas, cada extra custa 1 ação',
  },

  // ── MENTE ─────────────────────────────────────────────────────
  {
    nome: 'Fetiche',
    instancia: 'mente',
    prerequisito: 'SEN(1) + CON(1) + Criatividade(+5)',
    custo: '5 / 10 / 15 SAB (até 3 fetiches)',
    tipo: 'passiva',
    descricao: 'Vincula um domínio a um objeto físico (fetiche). Mágicas daquele domínio são reforçadas sem custo de mana adicional.',
    teste: 'Passiva — mágicas do domínio vinculado recebem reforço automático',
  },
  {
    nome: 'Grimório',
    instancia: 'mente',
    prerequisito: 'RAZ(1) + CON(1) + Investigação(+5)',
    custo: '5 SAB + 1 (gr.1) / 3 (gr.2) / 6 (gr.3) por magia',
    tipo: 'passiva',
    descricao: 'Permite aprender mágicas fora dos domínios ativos através de estudo autônomo em grimórios ou observação.',
    teste: 'RAZ [Investigação] — custo em SAB varia por grau da mágica aprendida',
  },
  {
    nome: 'Mixologia',
    instancia: 'mente',
    prerequisito: 'RAZ(1) + SEN(1) + Alquimia(+5)',
    custo: '5 SAB + 1 / 3 SAB por receita personalizada',
    tipo: 'passiva',
    descricao: 'Cria poções mágicas personalizadas combinando efeitos de múltiplas categorias alquímicas.',
    teste: 'RAZ [Alquimia] no descanso — cria poção com efeito combinado customizado',
  },
  {
    nome: 'Modelagem',
    instancia: 'mente',
    prerequisito: 'RAZ(1) + CON(1) + Mecânica(+5)',
    custo: '5 SAB + 1–7 SAB por modelo de criatura',
    tipo: 'passiva',
    descricao: 'Cria e controla uma criatura artefato que ressurge automaticamente no início de cada nova cena.',
    teste: 'RAZ [Mecânica] — custo por modelo varia por Classe da criatura (f:+1 até A:+7)',
  },
  {
    nome: 'Travessia',
    instancia: 'mente',
    prerequisito: 'SEN(1) + CON(1) + Sobrevivência(+5)',
    custo: '5 / 10 / 15 SAB (até 3 terrenos)',
    tipo: 'passiva',
    descricao: 'Concede vantagem (+1d20) em todos os testes realizados no terreno escolhido. Cada nível desbloqueia 1 terreno.',
    teste: 'Passiva — vantagem automática em todos os testes no terreno declarado',
  },

  // ── ESPÍRITO ─────────────────────────────────────────────────
  {
    nome: 'Fúria',
    instancia: 'espirito',
    prerequisito: 'VON(3) + Expressão(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Entra em estado de fúria que concede +1 ação padrão de ataque por turno, mas remove a capacidade de usar reações.',
    teste: 'Enfurecer [1]: VON [Expressão] — dura até fim do combate; sem reações enquanto ativo',
  },
  {
    nome: 'Regenerar',
    instancia: 'espirito',
    prerequisito: 'VON(3) + Comunhão(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Após receber dano, realiza um teste para se curar completamente e ganhar vida bônus.',
    teste: 'Regenerar [1]: VON [Comunhão] vs. resultado do atacante — sucesso: cura total do dano +Xd6',
  },
  {
    nome: 'Salvaguarda',
    instancia: 'espirito',
    prerequisito: 'INT(3) + Diplomacia(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Ao ser alvo de uma mágica, testa para se tornar completamente imune a ela neste turno.',
    teste: 'Resguardar [1]: INT [Diplomacia] vs. grau da mágica — sucesso: imune à mágica neste turno',
  },
  {
    nome: 'Toque Mortífero',
    instancia: 'espirito',
    prerequisito: 'VON(3) + Intimidação(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Destrói instantaneamente uma criatura de Classe B ou menor com um toque carregado de vontade.',
    teste: 'Abater [1]: VON [Intimidação] vs. Resistência da criatura — só funciona em Classe B ou menor',
  },
  {
    nome: 'Vidência',
    instancia: 'espirito',
    prerequisito: 'INT(3) + Lábia(+6)',
    custo: '6 SAB',
    tipo: 'reacao',
    descricao: 'Prevê a ação declarada de um alvo, impondo desvantagem nela antes de ser executada.',
    teste: 'Antever [1]: INT [Lábia] vs. IP Espiritual do alvo — sucesso: desvantagem na ação declarada',
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
