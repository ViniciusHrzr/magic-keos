// §16 Criaturas + §17 Condições

export interface ClasseCriaturaRow {
  cls: string
  grau: string
  custo: string
  vida: string
  res: string
  poder: string
  dano: string
  dur: string
}

export interface MecanicaAtaqueRow {
  acao: string
  descricao: string
}

export interface HabilidadeCriaturaRow {
  habilidade: string
  descricao: string
}

export interface CondicaoRow {
  condicao: string
  efeito: string
}

export interface VenenoRow {
  marcadores: string
  efeito: string
}

export const classesCriaturas: ClasseCriaturaRow[] = [
  { cls: 'f', grau: '1', custo: '{1}', vida: '1–4', res: '10', poder: '1d20', dano: '1d2', dur: '1' },
  { cls: 'E', grau: '1', custo: '{2}', vida: '4–8', res: '11', poder: '1d20+1', dano: '1d4', dur: '2–3' },
  { cls: 'D', grau: '1–2', custo: '{3}', vida: '8–14', res: '12', poder: '2d20+1', dano: '1d6', dur: '4–5' },
  { cls: 'C', grau: '2', custo: '{4–5}', vida: '14–20', res: '13', poder: '2d20+3', dano: '1d8', dur: '6–7' },
  { cls: 'B', grau: '3', custo: '{6–7}', vida: '20–26', res: '14', poder: '3d20+3', dano: '1d10', dur: '8–9' },
  { cls: 'A', grau: '3', custo: '{8–9}', vida: '26–32', res: '15', poder: '3d20+5', dano: '1d12', dur: '10' },
  { cls: 'S', grau: '—', custo: '—', vida: '?', res: '?', poder: '?', dano: '?', dur: '?' },
]

export const mecanicaAtaque: MecanicaAtaqueRow[] = [
  { acao: 'Atacar', descricao: 'Controlador rola 1d20 ≤ valor de Poder da criatura' },
  { acao: 'Defender', descricao: 'Alvo rola 1d20 ≥ Resistência da criatura' },
]

export const habilidadesCriaturas: HabilidadeCriaturaRow[] = [
  { habilidade: 'Alcance', descricao: 'Atinge criaturas com Voar' },
  { habilidade: 'Amedrontar', descricao: 'Criaturas não atacam espontaneamente; bônus de dano por Classe' },
  { habilidade: 'Atropelar', descricao: 'Excesso de dano vai ao controlador' },
  { habilidade: 'Ímpeto', descricao: 'Sem enjoo de invocação' },
  { habilidade: 'Incorpóreo', descricao: 'Imune a físico + condições; vulnerável a sagrado/profano' },
  { habilidade: 'Iniciativa', descricao: 'Sempre ataca primeiro em confrontos' },
  { habilidade: 'Toque Mortífero', descricao: 'Destrói criaturas de mesma classe ou inferior' },
  { habilidade: 'Vínculo c/ vida', descricao: 'Controlador cura = dano causado pela criatura' },
  { habilidade: 'Voar', descricao: 'Condição Alado; só atacável por quem tiver Voar/Alcance' },
]

export const condicoes: CondicaoRow[] = [
  { condicao: 'Alado', efeito: 'Pode voar; imune a corpo a corpo de criaturas sem Voar/Alcance' },
  { condicao: 'Congelado', efeito: 'Imóvel; teste dificílimo (25) de Vigor [Atletismo]; a cada rodada que falhar, dificuldade diminui 1 nível' },
  { condicao: 'Envenenado', efeito: 'Acumula marcadores de veneno (efeitos progressivos 2/4/6/8/10)' },
  { condicao: 'Incendiado', efeito: '1d6 dano ígneo/turno; acumula se repetido' },
  { condicao: 'Molhado', efeito: 'Desvantagem em testes corporais; vulnerável a elétrico' },
  { condicao: 'Morrendo', efeito: 'Com 0 vida; 3 testes de Vigor [Atletismo] para sobreviver' },
  { condicao: 'Necrosado', efeito: 'Vida Total reduzida pelo dano; não cura com descanso' },
]

export const venenoMarcadores: VenenoRow[] = [
  { marcadores: '2 marcadores', efeito: 'Curas recuperam 50%' },
  { marcadores: '4 marcadores', efeito: 'Descanso: 1 ação a menos' },
  { marcadores: '6 marcadores', efeito: 'Desvantagem (-1d20) em todos os testes' },
  { marcadores: '8 marcadores', efeito: 'Combate: 1 ação a menos/turno' },
  { marcadores: '10 marcadores', efeito: 'Cai imediatamente (condição Morrendo)' },
]
