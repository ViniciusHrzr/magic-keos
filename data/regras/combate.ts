// §18 Combate + §19 Descanso + §20 Evolução

export interface AcaoRow {
  acao: string
  custo: string
  efeito: string
}

export interface DescansaRow {
  acao: string
  teste: string
  resultado: string
}

export interface CenaRow {
  cena: string
  dificuldade: string
  afinidade: string
}

export interface CorComportRow {
  cor: string
  comportamento: string
}

export const combateMovimentacao: AcaoRow[] = [
  { acao: 'Deslocar-se', custo: '[1]', efeito: 'Move até 9m' },
  { acao: 'Esconder-se', custo: '[1]', efeito: 'REF [Furtividade]; necessário para ataque surpresa' },
  { acao: 'Pegar', custo: '[1]', efeito: 'Sacar arma, pegar item, entregar objeto' },
]

export const combateOperacoes: AcaoRow[] = [
  { acao: 'Atacar', custo: '[1]', efeito: 'Golpe físico' },
  { acao: 'Usar Item', custo: '[1]', efeito: 'Poções, bombas, outros itens' },
  { acao: 'Movimentar-se', custo: '[1]', efeito: 'Substitui operação por movimento extra' },
]

export const combateReacoes: AcaoRow[] = [
  { acao: 'Aparar', custo: '[1]', efeito: 'REF [Artes Marciais] oposto; sucesso = metade dano + manobra' },
  { acao: 'Contra-atacar', custo: '[1]', efeito: 'Se atacante falhar: ataque de REF [Esgrima]' },
  { acao: 'Esquivar-se', custo: '[1]', efeito: 'REF [Furtividade] oposto; sucesso = zero dano' },
  { acao: 'Disparar', custo: '[1]', efeito: 'Movimentação extra com teste de [Atletismo]' },
  { acao: 'Mirar', custo: '[1]', efeito: 'Bônus ao próximo teste de [Pontaria]' },
]

export const combateManifestacoes: AcaoRow[] = [
  { acao: 'Ativar', custo: '[1]', efeito: 'Ativa efeito de artefato' },
  { acao: 'Canalizar', custo: '[3]', efeito: 'Canaliza mana colorida; gasta 1 Canalização' },
  { acao: 'Comandar', custo: '[1]', efeito: 'Ativa habilidade de criatura' },
  { acao: 'Conjurar', custo: '[1]/[grau]', efeito: 'Feitiço=[1]; Encantamento/Invocação=[grau] ações' },
  { acao: 'Lançar', custo: '[1]', efeito: 'Lança mágica conjurada ou da Memória' },
  { acao: 'Trucar', custo: '[0]', efeito: 'Lança truque; 1º por turno = gratuito' },
]

export const descansaAcoes: DescansaRow[] = [
  { acao: 'Repousar', teste: 'VIG [Atletismo]', resultado: '10+=20% vida · 15+=40% · 20+=60% · 25+=80% · 30+=100%' },
  { acao: 'Praticar', teste: 'CON [AM/Inv/Lábia]', resultado: '10+=1 SAB · 15+=2 · 20+=3 · 25+=4 · 30+=5' },
  { acao: 'Canalizar', teste: 'VON [Comunhão]', resultado: '10+=1d4 mana · 15+=1d6 · 20+=1d8 · 25+=1d10 · 30+=1d12' },
  { acao: 'Coletar', teste: 'RAZ [Sobrevivência]', resultado: '10+=1 matéria · 15+=2 · 20+=3 · 25+=4 · 30+=5' },
  { acao: 'Produzir', teste: 'RAZ [Alquimia]', resultado: 'falha=efeito reduzido · 10+=pretendido · 20+=potencializado' },
  { acao: 'Improvisar', teste: 'RAZ [Criatividade]', resultado: 'falha=instável/1 cena · 10+=1 cena · 20+=3 cenas' },
  { acao: 'Inscrever', teste: 'RAZ [Investigação]', resultado: 'falha=reduzido · 10+=pretendido · 20+=potencializado' },
  { acao: 'Fabricar', teste: 'RAZ [Mecânica]', resultado: 'falha=0,5 etapa · 10+=1 etapa · 20+=2 etapas' },
  { acao: 'Reparar', teste: 'CON [Mecânica]', resultado: '10+=1 carga · 15+=2 · 20+=3 · 25+=4 · 30+=5' },
]

export const evolucaoCenas: CenaRow[] = [
  { cena: 'CORPO', dificuldade: 'Fácil (1–3 turnos)', afinidade: '20% ou 3d10' },
  { cena: 'CORPO', dificuldade: 'Moderada (4–8)', afinidade: '50% ou 7d10' },
  { cena: 'CORPO', dificuldade: 'Difícil (9+)', afinidade: '80% ou 10d10' },
  { cena: 'MENTE', dificuldade: 'Simples (1 cena)', afinidade: '20% ou 3d10' },
  { cena: 'MENTE', dificuldade: 'Complexa (1+ cenas)', afinidade: '50% ou 7d10' },
  { cena: 'MENTE', dificuldade: 'Desafiadora (1+ sessões)', afinidade: '80% ou 10d10' },
  { cena: 'ESPÍRITO', dificuldade: 'Tranquila', afinidade: '20% ou 3d10' },
  { cena: 'ESPÍRITO', dificuldade: 'Tensa', afinidade: '50% ou 7d10' },
  { cena: 'ESPÍRITO', dificuldade: 'Turbulenta', afinidade: '80% ou 10d10' },
]

export const evolucaoComportamentos: CorComportRow[] = [
  { cor: 'Branco', comportamento: 'Estratégico, protetor, líder, autoritário' },
  { cor: 'Verde', comportamento: 'Linha de frente, resistente, instintivo, brutal' },
  { cor: 'Vermelho', comportamento: 'Rápido, impulsivo, emocional, sem cautela' },
  { cor: 'Preto', comportamento: 'Furtivo, oportunista, priorizou sobrevivência' },
  { cor: 'Azul', comportamento: 'Evitou confronto direto, explorou fraquezas, tático' },
]
