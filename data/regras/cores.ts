// §1 As Cinco Cores

export interface CorRow {
  cor: string
  valores: string
  aliadas: string
  inimigas: string
}

export interface GuildaRow {
  combo: string
  nome: string
}

export const cores: CorRow[] = [
  { cor: 'Branco', valores: 'Ordem, lei, proteção, cura, comunidade', aliadas: 'Verde, Azul', inimigas: 'Verm, Preto' },
  { cor: 'Verde', valores: 'Natureza, crescimento, força bruta, instinto', aliadas: 'Branco, Verm', inimigas: 'Azul, Preto' },
  { cor: 'Vermelho', valores: 'Liberdade, fogo, impulso, criatividade', aliadas: 'Verde, Preto', inimigas: 'Branco, Azul' },
  { cor: 'Preto', valores: 'Poder, ambição, morte, individualismo', aliadas: 'Verm, Azul', inimigas: 'Branco, Verde' },
  { cor: 'Azul', valores: 'Conhecimento, lógica, ilusão, manipulação', aliadas: 'Branco, Preto', inimigas: 'Verm, Verde' },
]

export const guildas: GuildaRow[] = [
  { combo: 'B+V', nome: 'Selesnya — Comunidade' },
  { combo: 'V+R', nome: 'Gruul — Autenticidade' },
  { combo: 'R+Pr', nome: 'Rakdos — Independência' },
  { combo: 'Pr+Az', nome: 'Dimir — Crescimento' },
  { combo: 'Az+B', nome: 'Azorius — Estrutura' },
  { combo: 'B+R', nome: 'Boros — Heroísmo' },
  { combo: 'V+Pr', nome: 'Golgari — Profanação' },
  { combo: 'R+Az', nome: 'Izzet — Criatividade' },
  { combo: 'Pr+B', nome: 'Orzhov — Tribalismo' },
  { combo: 'Az+V', nome: 'Simic — Busca pela verdade' },
]
