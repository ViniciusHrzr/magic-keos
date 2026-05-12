import rawSpells from './grimorio.json';

export type SpellColor = 'branco' | 'verde' | 'vermelho' | 'preto' | 'azul';
export type SpellType = '[T]' | '[E]' | '[F]' | '[C]';

export interface Spell {
  nome: string;
  cor: SpellColor;
  dominio: string;
  atributo: string;
  grau: 0 | 1 | 2 | 3;
  custo: string;
  tipo: SpellType;
  efeito: string;
}

const colorMap: Record<string, SpellColor> = {
  white: 'branco',
  green: 'verde',
  red: 'vermelho',
  black: 'preto',
  blue: 'azul',
};

export const grimoire: Spell[] = (rawSpells as any[])
  .filter(s => s.nome && colorMap[s.cor])
  .map(s => ({
    nome: s.nome,
    cor: colorMap[s.cor],
    dominio: s.dominio || '',
    atributo: s.atributo || '',
    grau: (s.grau as 0 | 1 | 2 | 3) ?? 0,
    custo: s.custo || '',
    tipo: (s.tipo as SpellType) || '[F]',
    efeito: s.efeito || '',
  }));

export const domains = [...new Set(grimoire.map(s => s.dominio))].sort();
