// §8 Mecânica de Dados + §9 Testes

export interface DadoRow {
  dado: string
  cor: string
  especial: string
}

export interface ResultadoRow {
  resultado: string
  descricao: string
}

export interface DificuldadeRow {
  dificuldade: string
  valor: string
  modificador: string
}

export const dados: DadoRow[] = [
  { dado: 'dW', cor: 'Branco', especial: 'Progressão: todos ≥ 14 → dobra bônus (2dW=13, 3dW=12, 4dW=11, 5dW=10)' },
  { dado: 'dG', cor: 'Verde', especial: 'Rola 2d10 em vez de d20; pares livres entre dados; cada dG extra +1d10' },
  { dado: 'dR', cor: 'Vermelho', especial: 'Crítico em 19–20 (expande: 2dR=18–20 e 1–2, 3dR=17–20 e 1–2, 4dR=16–20 e 1–3, 5dR=15–20 e 1–3)' },
  { dado: 'dB', cor: 'Preto', especial: 'Para cada dado ≤ 5: recebe +1d4 ao resultado' },
  { dado: 'dU', cor: 'Azul', especial: 'Resultado múltiplo de 5: rerrola o dado azul enquanto continuar ×5' },
]

export const resultados: ResultadoRow[] = [
  { resultado: 'SUCESSO', descricao: '> dificuldade — realiza a ação' },
  { resultado: 'FRACASSO', descricao: '< dificuldade — não realiza a ação' },
  { resultado: 'SUC. CRÍTICO', descricao: '20 com vantagem — realiza perfeitamente + bonificação' },
  { resultado: 'FRAC. CRÍTICO', descricao: '1 com desvantagem — realiza terrivelmente + consequência' },
  { resultado: 'SUCESSO, MAS…', descricao: '> dificuldade com vantagem + 1 nos dados — realiza, mas algo dá errado' },
  { resultado: 'FRAC., MAS…', descricao: '< dificuldade com desvantagem + 20 nos dados — não realiza, mas algo dá certo' },
]

export const dificuldades: DificuldadeRow[] = [
  { dificuldade: 'Facílimo', valor: '5', modificador: 'Bônus positivo [+X] no resultado' },
  { dificuldade: 'Fácil', valor: '10', modificador: 'Vantagem (+1d20)' },
  { dificuldade: 'Normal', valor: '15', modificador: '—' },
  { dificuldade: 'Difícil', valor: '20', modificador: 'Penalidade [-X] no resultado' },
  { dificuldade: 'Dificílimo', valor: '25', modificador: 'Desvantagem (-1d20)' },
  { dificuldade: 'Excepcional', valor: '30', modificador: '—' },
]
