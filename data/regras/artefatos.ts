// §15 Artefatos

export interface TipoArtefatoRow {
  tipo: string
  produzidoPor: string
}

export interface UsoReparoRow {
  acao: string
  descricao: string
}

export const tiposArtefatos: TipoArtefatoRow[] = [
  { tipo: 'Objetos (acessórios, lanternas, joias)', produzidoPor: 'Artesãos' },
  { tipo: 'Condutores (varinhas, cajados)', produzidoPor: 'Feiticeiros' },
  { tipo: 'Equipamentos (armas, escudos, armaduras)', produzidoPor: 'Ferreiros' },
  { tipo: 'Criaturas mecânicas', produzidoPor: 'Moldadores' },
]

export const usoReparo: UsoReparoRow[] = [
  { acao: 'Ativar [1]', descricao: 'Custa mana incolor' },
  { acao: 'Reparar', descricao: 'CON [Mecânica] em descanso: 10+=1 · 15+=2 · 20+=3 · 25+=4 · 30+=5 cargas' },
]
