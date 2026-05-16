// §6 Balizadores

export interface BalizadorRow {
  balizador: string
  cor: string
  funcao: string
}

export const balizadores: BalizadorRow[] = [
  { balizador: 'Foco', cor: 'Branco', funcao: 'Máximo de permanentes (encantamentos + criaturas) em campo' },
  { balizador: 'Canalização', cor: 'Verde', funcao: 'Vezes/dia que pode canalizar mana colorido' },
  { balizador: 'Domínios', cor: 'Preto', funcao: 'Domínios mágicos conhecidos' },
  { balizador: 'Memória', cor: 'Azul', funcao: 'Feitiços memorizados (prontos para lançar sem conjurar)' },
  { balizador: 'Velocidade', cor: 'Vermelho', funcao: 'Ações bônus por cena (restauradas no início de cada cena)' },
]
