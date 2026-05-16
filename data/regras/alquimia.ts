// §14 Matérias-primas e Alquimia

export interface HerbologiaRow {
  cor: string
  tipo: string
}

export interface ReceitaRow {
  combinacao: string
  efeito: string
}

export interface ProporcaoRow {
  proporcao: string
  resultado: string
}

export interface SoroRow {
  cor: string
  mutacoes: string
}

export interface CatalisadorRow {
  cor: string
  efeito: string
}

export interface MineralogiaRow {
  tipo: string
  descricao: string
}

export const herbologia: HerbologiaRow[] = [
  { cor: 'Brancas', tipo: 'Curativos' },
  { cor: 'Verdes', tipo: 'Imunizantes' },
  { cor: 'Vermelhas', tipo: 'Estimulantes' },
  { cor: 'Pretas', tipo: 'Danosos' },
  { cor: 'Azuis', tipo: 'Adaptativos' },
]

export const receitasBasicas: ReceitaRow[] = [
  { combinacao: '2B + 1', efeito: 'Cura 1d8+3 (pura) ou 1d6+2 + remoção de condição' },
  { combinacao: '2V + 1', efeito: 'Resistência a danos' },
  { combinacao: '2R + 1', efeito: 'Bônus em balizadores ou Dano' },
  { combinacao: '2Pr + 1', efeito: 'Causa condições' },
  { combinacao: '2Az + 1', efeito: 'Bônus de IP' },
]

export const proporcoes: ProporcaoRow[] = [
  { proporcao: '1 erva', resultado: 'Efeito brando' },
  { proporcao: '2 ervas (2/0)', resultado: 'Efeito moderado' },
  { proporcao: '2 ervas (1/1)', resultado: 'Poção de mana branda' },
  { proporcao: '3 ervas (3/0/0)', resultado: 'Efeito potente' },
  { proporcao: '3 ervas (2/1/0)', resultado: 'Especializado' },
  { proporcao: '3 ervas (1/1/1)', resultado: 'Mana moderada' },
  { proporcao: '4+ ervas', resultado: 'Efeitos superiores / poções de mana' },
]

export const soros: SoroRow[] = [
  { cor: 'Branco', mutacoes: 'Voar, Vínculo, Iniciativa, Vigilância' },
  { cor: 'Verde', mutacoes: 'Atropelar, Regenerar' },
  { cor: 'Vermelho', mutacoes: 'Ímpeto, Iniciativa' },
  { cor: 'Preto', mutacoes: 'Toque Mortífero, Amedrontar, Regenerar' },
  { cor: 'Azul', mutacoes: 'Mergulhar, Voar, Vidência' },
]

export const catalisadores: CatalisadorRow[] = [
  { cor: 'Branco', efeito: 'Entrelaçar: une efeitos de 2 mágicas' },
  { cor: 'Verde', efeito: 'Reforçar: potencializa dano/alcance/duração' },
  { cor: 'Vermelho', efeito: 'Acelerar: reduz tempo de conjuração' },
  { cor: 'Preto', efeito: 'Recapitular: replica mágica já conjurada' },
  { cor: 'Azul', efeito: 'Reciclar: modifica características da mágica' },
]

export const complexidadeZoologia = 'Complexidade: Insetos < Peixes/Anfíbios < Répteis < Aves < Mamíferos'

export const mineralogia: MineralogiaRow[] = [
  { tipo: 'Bombas', descricao: 'Causam efeitos em área' },
  { tipo: 'Afiadores', descricao: 'Atribuem tipo de dano a armas (ver §13)' },
  { tipo: 'Proteções', descricao: '{WWW/GGG/RRR/BBB/UUU} = Proteção contra cor correspondente' },
]
