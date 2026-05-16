// §2 Construção de Personagens + §3 Atributos

export interface InstanciaRow {
  instancia: string
  conceito: string
  atributos: string
}

export interface PontosIdentidadeRow {
  ponto: string
  corpo: string
  mente: string
  espirito: string
}

export interface AtributoRow {
  sigla: string
  descricao: string
}

export const instancias: InstanciaRow[] = [
  { instancia: 'CORPO', conceito: 'Físico, combate', atributos: 'FOR · REF · VIG' },
  { instancia: 'MENTE', conceito: 'Inteligência, percepção', atributos: 'RAZ · SEN · CON' },
  { instancia: 'ESPÍRITO', conceito: 'Social, emocional', atributos: 'PRE · INT · VON' },
]

export const pontosIdentidade: PontosIdentidadeRow[] = [
  { ponto: 'Vida', corpo: '+10', mente: '+5', espirito: '+6' },
  { ponto: 'Sabedoria', corpo: '+6', mente: '+10', espirito: '+8' },
  { ponto: 'Mana incolor', corpo: '+1', mente: '+2', espirito: '+3' },
]

export const atributosCORPO: AtributoRow[] = [
  { sigla: 'FOR', descricao: 'Força — levantar peso, corpo a corpo, atletismo' },
  { sigla: 'REF', descricao: 'Reflexos — velocidade, movimentação, reações' },
  { sigla: 'VIG', descricao: 'Vigor — resistir dor, condições físicas, venenos' },
]

export const atributosMENTE: AtributoRow[] = [
  { sigla: 'RAZ', descricao: 'Razão — aprender, raciocínio lógico, conjuração mental' },
  { sigla: 'SEN', descricao: 'Sentidos — perceber o mundo pelos cinco sentidos' },
  { sigla: 'CON', descricao: 'Concentração — foco, ações preparatórias, resistência mental' },
]

export const atributosESPIRITO: AtributoRow[] = [
  { sigla: 'PRE', descricao: 'Presença — notoriedade, intimidação, inspiração, camuflagem social' },
  { sigla: 'INT', descricao: 'Intuição — perceber emoções, intenções, o mundo mágico' },
  { sigla: 'VON', descricao: 'Vontade — resistir à influência alheia' },
]
