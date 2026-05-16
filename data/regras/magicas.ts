// §10 Sistema de Mágicas

export interface TipoMagicaRow {
  tipo: string
  simbolo: string
  funcionamento: string
}

export interface GrauMagicaRow {
  grau: string
  nivel: string
  custo: string
}

export interface NotacaoManaRow {
  simbolo: string
  descricao: string
}

export interface ConjuracaoRow {
  acao: string
  descricao: string
}

export const tiposMagicas: TipoMagicaRow[] = [
  { tipo: 'Truque', simbolo: '[T]', funcionamento: 'Grau 0; custo gratuito; 1º truque/turno não gasta ação' },
  { tipo: 'Feitiço', simbolo: '[F]', funcionamento: 'Dissipa após efeito; conjurar [1] + lançar [1]; armazena na Memória' },
  { tipo: 'Encantamento', simbolo: '[E]', funcionamento: 'Permanente em campo; ocupa slot de Foco; conjurar [grau] ações' },
  { tipo: 'Criatura', simbolo: '[C]', funcionamento: 'Permanente em campo; ocupa slot de Foco; 1 invocação por criatura/cena' },
]

export const grausMagicas: GrauMagicaRow[] = [
  { grau: '0 (Truque)', nivel: 'Básico', custo: 'Incluído com o domínio' },
  { grau: 'Grau 1', nivel: 'Padrão', custo: 'Incluído com o domínio' },
  { grau: 'Grau 2', nivel: 'Avançado', custo: '4 pts de Sabedoria' },
  { grau: 'Grau 3', nivel: 'Poderoso', custo: '8 pts de Sabedoria' },
]

export const notacaoMana: NotacaoManaRow[] = [
  { simbolo: '] (gratuito)', descricao: 'Truque' },
  { simbolo: 'a', descricao: '1 mana branco (W)' },
  { simbolo: 'g', descricao: '1 mana verde (G)' },
  { simbolo: 'd', descricao: '1 mana vermelho (R)' },
  { simbolo: 'b', descricao: '1 mana preto (B)' },
  { simbolo: 'u', descricao: '1 mana azul (U)' },
  { simbolo: '1, 2, 3…', descricao: 'mana incolor genérico' },
  { simbolo: 'x', descricao: 'variável — jogador decide quanto pagar' },
]

export const notacaoManaExemplo = '"a" = {W} · "1a" = {1}{W} · "2aa" = {2}{W}{W} · "4aaa" = {4}{W}{W}{W}'

export const conjuracao: ConjuracaoRow[] = [
  { acao: 'Conjurar [1]', descricao: 'Feitiços gastam 1 ação' },
  { acao: 'Conjurar [grau]', descricao: 'Encantamentos/invocações gastam [grau] ações' },
  { acao: 'Lançar [1]', descricao: 'Lança mágica conjurada ou da Memória' },
  { acao: 'Trucar [0]', descricao: '1º truque do turno não gasta ação' },
]
