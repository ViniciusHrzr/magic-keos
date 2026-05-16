// §7 Outros Pontos

export interface PontoRow {
  ponto: string
  funcao: string
}

export const pontos: PontoRow[] = [
  { ponto: 'Vida', funcao: 'Pontos de vida total; ao chegar a 0, testa Vigor para resistir à morte' },
  { ponto: 'Necrosado', funcao: 'Redutor permanente da Vida Total (dano necrotizante); não cura com descanso' },
  { ponto: 'Armadura', funcao: 'Reduz 1 pt de dano físico por ponto' },
  { ponto: 'Manto', funcao: 'Reduz 1 pt de dano mágico por ponto' },
  { ponto: 'IP Corporal', funcao: 'Índice de Proteção Corporal (bônus de reação/defesa física)' },
  { ponto: 'IP Mental', funcao: 'Índice de Proteção Mental' },
  { ponto: 'IP Espiritual', funcao: 'Índice de Proteção Espiritual' },
  { ponto: 'Mana', funcao: 'Reserva de mana colorido (W/G/R/B/U) + incolor' },
  { ponto: 'Sabedoria', funcao: 'Pontos para comprar perícias, habilidades e mágicas' },
]
