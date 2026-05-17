// §13 Equipamentos

export interface ArmaRow {
  arma: string
  dano: string
  especial: string
}

export interface EscudoRow {
  escudo: string
  ipCorp: string
  especial: string
}

export interface VestimentaRow {
  vestimenta: string
  ipCorp: string
  ipMent: string
  ipEsp: string
}

export interface AcessorioRow {
  acessorio: string
  bonus: string
}

export interface MelhoriaRow {
  tipo: string
  descricao: string
}

export interface MelhoriaItem {
  label: string;
  cor: 'branco' | 'verde' | 'vermelho' | 'preto' | 'azul';
}

export interface PropElementalRow {
  cor: string
  propriedade: string
  efeito: string
}

export interface AfiadorRow {
  combo: string
  propriedade: string
}

export const armas: ArmaRow[] = [
  { arma: 'Adaga', dano: '1d4', especial: 'REF · Esg[Leve]/Pont[Arremesso] · alcance curto 9m' },
  { arma: 'Arco Curto', dano: '1d6', especial: 'REF · Pont[Arcos] · alcance médio 18m' },
  { arma: 'Arco Longo', dano: '1d8', especial: 'FOR · Pont[Arcos] · alcance longo 30m' },
  { arma: 'Bastão Curto', dano: '1d4*', especial: 'FOR/REF · AM · *Destreza aumenta dano' },
  { arma: 'Bastão Longo', dano: '1d6*', especial: 'FOR/REF · AM · alcance próximo 3m' },
  { arma: 'Cajado', dano: '1d6', especial: 'RAZ/PRE · Pont[Condutores] duas mãos · dano mágico' },
  { arma: 'Desarmado', dano: '1d3*', especial: 'FOR · AM · *Destreza aumenta dano' },
  { arma: 'Espada', dano: '1d6', especial: 'FOR · Esg[Uma Mão] · 1d8 duas mãos' },
  { arma: 'Lança Curta', dano: '1d6', especial: 'REF · Esg[Uma Mão]/Pont[Arremesso] · 18m' },
  { arma: 'Lança Longa', dano: '1d10', especial: 'REF · Esg[Duas Mãos] · alcance próximo 3m' },
  { arma: 'Machado', dano: '1d6', especial: 'FOR · Esg[Leve]/Pont[Arremesso] · 1d8 duas mãos' },
  { arma: 'Montante', dano: '1d12', especial: 'FOR · Esg[Duas Mãos]' },
  { arma: 'Varinha', dano: '1d4', especial: 'RAZ/PRE · Pont[Condutores] uma mão · dano mágico' },
]

export const escudos: EscudoRow[] = [
  { escudo: 'Escudo de Mão', ipCorp: '+1', especial: 'Permite ataque desarmado' },
  { escudo: 'Escudo de Bronze', ipCorp: '+2', especial: 'Só com armas leves/uma mão' },
  { escudo: 'Escudo Rúnico', ipCorp: '+1M +1E', especial: 'Só com armas leves/uma mão' },
]

export const vestimentas: VestimentaRow[] = [
  { vestimenta: 'Farda de Combatente', ipCorp: '+1', ipMent: '—', ipEsp: '—' },
  { vestimenta: 'Farda de Cavaleiro', ipCorp: '+2', ipMent: '—', ipEsp: '—' },
  { vestimenta: 'Túnica de Aprendiz', ipCorp: '—', ipMent: '+1', ipEsp: '—' },
  { vestimenta: 'Túnica de Sábio', ipCorp: '—', ipMent: '+2', ipEsp: '—' },
  { vestimenta: 'Traje da Nobreza', ipCorp: '—', ipMent: '—', ipEsp: '+1' },
  { vestimenta: 'Traje da Realeza', ipCorp: '—', ipMent: '—', ipEsp: '+2' },
]

export const acessorios: AcessorioRow[] = [
  { acessorio: 'Bracelete de Prata', bonus: '+1 Velocidade' },
  { acessorio: 'Tiara de Prata', bonus: '+1 Memória' },
  { acessorio: 'Colar de Prata', bonus: '+1 Foco' },
  { acessorio: 'Brincos de Prata', bonus: '+1 Canalização' },
  { acessorio: 'Broche de Prata', bonus: '+1 Domínio' },
]

export const melhorias: MelhoriaRow[] = [
  { tipo: 'Armas', descricao: 'W=Acurácia+1 · G=Acurácia madeira+1 · R=Dano físico+1 · B=Dado dano+1 · U=Dano mágico+1' },
  { tipo: 'Vestimentas', descricao: 'W=Armadura+1 · G=Manto+1 · R=IP Corp.+1 · B=IP Esp.+1 · U=IP Mental+1' },
]

export const MELHORIAS_POR_SLOT: Record<'arma' | 'escudo' | 'vestimenta' | 'acessorio1' | 'acessorio2', MelhoriaItem[]> = {
  // 5 melhorias — 1 por cor (D-02)
  arma: [
    { label: 'Acurácia de lâminas+1',  cor: 'branco'   },
    { label: 'Acurácia de madeiras+1', cor: 'verde'    },
    { label: 'Dano físico+1',          cor: 'vermelho' },
    { label: 'Dado de dano+1',         cor: 'preto'    },
    { label: 'Dano mágico+1',          cor: 'azul'     },
  ],
  // 10 melhorias — 2 por cor (D-02)
  escudo: [
    { label: 'IP Esp+1',     cor: 'branco'   },
    { label: 'Armadura+1',   cor: 'branco'   },
    { label: 'IP Corp+1',    cor: 'verde'    },
    { label: 'Manto+1',      cor: 'verde'    },
    { label: 'IP Corp+1',    cor: 'vermelho' },
    { label: 'Armadura+1',   cor: 'vermelho' },
    { label: 'IP Esp+1',     cor: 'preto'    },
    { label: 'IP Mental+1',  cor: 'preto'    },
    { label: 'IP Mental+1',  cor: 'azul'     },
    { label: 'Manto+1',      cor: 'azul'     },
  ],
  // 15 melhorias — 3 por cor (D-02)
  vestimenta: [
    { label: 'Armadura+1',      cor: 'branco'   },
    { label: 'Diplomacia+1',    cor: 'branco'   },
    { label: 'Esgrima+1',       cor: 'branco'   },
    { label: 'Manto+1',         cor: 'verde'    },
    { label: 'Comunhão+1',      cor: 'verde'    },
    { label: 'Pontaria+1',      cor: 'verde'    },
    { label: 'IP Corp+1',       cor: 'vermelho' },
    { label: 'Expressão+1',     cor: 'vermelho' },
    { label: 'Atletismo+1',     cor: 'vermelho' },
    { label: 'IP Esp+1',        cor: 'preto'    },
    { label: 'Intimidação+1',   cor: 'preto'    },
    { label: 'Furtividade+1',   cor: 'preto'    },
    { label: 'IP Mental+1',     cor: 'azul'     },
    { label: 'Lábia+1',         cor: 'azul'     },
    { label: 'Artes Marciais+1',cor: 'azul'     },
  ],
  // 10 melhorias — 2 por cor (D-02)
  acessorio1: [
    { label: 'Foco+1',           cor: 'branco'   },
    { label: 'Mecânica+1',       cor: 'branco'   },
    { label: 'Canalização+1',    cor: 'verde'    },
    { label: 'Sobrevivência+1',  cor: 'verde'    },
    { label: 'Velocidade+1',     cor: 'vermelho' },
    { label: 'Criatividade+1',   cor: 'vermelho' },
    { label: 'Domínio+1',        cor: 'preto'    },
    { label: 'Alquimia+1',       cor: 'preto'    },
    { label: 'Memória+1',        cor: 'azul'     },
    { label: 'Investigação+1',   cor: 'azul'     },
  ],
  acessorio2: [
    { label: 'Foco+1',           cor: 'branco'   },
    { label: 'Mecânica+1',       cor: 'branco'   },
    { label: 'Canalização+1',    cor: 'verde'    },
    { label: 'Sobrevivência+1',  cor: 'verde'    },
    { label: 'Velocidade+1',     cor: 'vermelho' },
    { label: 'Criatividade+1',   cor: 'vermelho' },
    { label: 'Domínio+1',        cor: 'preto'    },
    { label: 'Alquimia+1',       cor: 'preto'    },
    { label: 'Memória+1',        cor: 'azul'     },
    { label: 'Investigação+1',   cor: 'azul'     },
  ],
};

export type SlotMelhorias = typeof MELHORIAS_POR_SLOT;

// Lookup: label → cor (first occurrence wins; same label never has two colors)
export const LABEL_TO_COR: Record<string, MelhoriaItem['cor']> = {};
(Object.values(MELHORIAS_POR_SLOT) as MelhoriaItem[][]).forEach(arr =>
  arr.forEach(m => { if (!(m.label in LABEL_TO_COR)) LABEL_TO_COR[m.label] = m.cor; })
);

export const propriedadesElementais: PropElementalRow[] = [
  { cor: 'Branco', propriedade: 'Sagrado', efeito: '2× dano em profanas; normal em Incorpóreos' },
  { cor: 'Branco', propriedade: 'Vinculado', efeito: 'Recupera 50% do dano causado como vida' },
  { cor: 'Verde', propriedade: 'Ácido', efeito: 'Ignora Armadura e Manto' },
  { cor: 'Verde', propriedade: 'Venenoso', efeito: 'Atribui condição Envenenado' },
  { cor: 'Vermelho', propriedade: 'Elétrico', efeito: 'Não pode ser reagido' },
  { cor: 'Vermelho', propriedade: 'Ígneo', efeito: '30% de chance de Incendiado' },
  { cor: 'Preto', propriedade: 'Necrotizante', efeito: 'Diminui Vida Total (condição Necrosado)' },
  { cor: 'Preto', propriedade: 'Profano', efeito: '2× dano em sagradas; normal em Incorpóreos' },
  { cor: 'Azul', propriedade: 'Gélido', efeito: '30% de chance de Congelado' },
  { cor: 'Azul', propriedade: 'Hídrico', efeito: 'Atribui condição Molhado' },
]

export const afiadores: AfiadorRow[] = [
  { combo: '{WWB}', propriedade: 'Vinculado' },
  { combo: '{WWG}', propriedade: 'Sagrado' },
  { combo: '{GGB}', propriedade: 'Venenoso' },
  { combo: '{GGR}', propriedade: 'Ácido' },
  { combo: '{RRW}', propriedade: 'Ígneo' },
  { combo: '{RRU}', propriedade: 'Elétrico' },
  { combo: '{BBR}', propriedade: 'Profano' },
  { combo: '{BBU}', propriedade: 'Necrotizante' },
  { combo: '{UUW}', propriedade: 'Gélido' },
  { combo: '{UUG}', propriedade: 'Hídrico' },
]
