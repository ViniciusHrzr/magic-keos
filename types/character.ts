export type DieColor = 'branco' | 'verde' | 'vermelho' | 'preto' | 'azul' | null;
export type AttrDice = [DieColor, DieColor, DieColor, DieColor, DieColor];

export interface SkillValue {
  base: number;
  temp: number;
}

export interface Character {
  nome: string;

  sabedoria: {
    acumulada: number;
    disponivel: number;
  };

  vida: {
    total: number;
    necro: number;
    atual: number;
    armadura: number;
    manto: number;
  };

  mana: {
    incolor: number;
    branco: number;
    verde: number;
    vermelho: number;
    preto: number;
    azul: number;
  };

  veneno: number;

  afinidade: {
    branco: number;
    verde: number;
    vermelho: number;
    preto: number;
    azul: number;
  };

  corpo: {
    ipBase: number;
    ipBonus: number;
    forca: AttrDice;
    reflexos: AttrDice;
    vigor: AttrDice;
    artesMarciais: SkillValue;
    atletismo: SkillValue;
    esgrima: SkillValue;
    furtividade: SkillValue;
    pontaria: SkillValue;
  };

  mente: {
    ipBase: number;
    ipBonus: number;
    razao: AttrDice;
    sentidos: AttrDice;
    concentracao: AttrDice;
    alquimia: SkillValue;
    criatividade: SkillValue;
    investigacao: SkillValue;
    mecanica: SkillValue;
    sobrevivencia: SkillValue;
  };

  espirito: {
    ipBase: number;
    ipBonus: number;
    presenca: AttrDice;
    intuicao: AttrDice;
    vontade: AttrDice;
    comunhao: SkillValue;
    diplomacia: SkillValue;
    expressao: SkillValue;
    intimidacao: SkillValue;
    labia: SkillValue;
  };

  proficiencias: string;
  habilidades: string;

  velocidade: { base: number; temp: number; boxes: boolean[] };
  memoria: { base: number; temp: number; entries: string[] };
  canalizacao: { base: number; temp: number; boxes: boolean[] };
  foco: { base: number; temp: number; entries: string[] };

  dominios: string[];

  inventario: string;

  equipamentos: {
    arma: string;
    escudo: string;
    vestimenta: string;
    armadura: string;
    acessorio1: string;
    acessorio2: string;
  };

  magicasReceitas: string;
}

const emptyDice: AttrDice = [null, null, null, null, null];
const emptySkill: SkillValue = { base: 0, temp: 0 };

export const defaultCharacter: Character = {
  nome: '',
  sabedoria: { acumulada: 0, disponivel: 0 },
  vida: { total: 0, necro: 0, atual: 0, armadura: 0, manto: 0 },
  mana: { incolor: 0, branco: 0, verde: 0, vermelho: 0, preto: 0, azul: 0 },
  veneno: 0,
  afinidade: { branco: 0, verde: 0, vermelho: 0, preto: 0, azul: 0 },
  corpo: {
    ipBase: 0,
    ipBonus: 0,
    forca: [...emptyDice],
    reflexos: [...emptyDice],
    vigor: [...emptyDice],
    artesMarciais: { ...emptySkill },
    atletismo: { ...emptySkill },
    esgrima: { ...emptySkill },
    furtividade: { ...emptySkill },
    pontaria: { ...emptySkill },
  },
  mente: {
    ipBase: 0,
    ipBonus: 0,
    razao: [...emptyDice],
    sentidos: [...emptyDice],
    concentracao: [...emptyDice],
    alquimia: { ...emptySkill },
    criatividade: { ...emptySkill },
    investigacao: { ...emptySkill },
    mecanica: { ...emptySkill },
    sobrevivencia: { ...emptySkill },
  },
  espirito: {
    ipBase: 0,
    ipBonus: 0,
    presenca: [...emptyDice],
    intuicao: [...emptyDice],
    vontade: [...emptyDice],
    comunhao: { ...emptySkill },
    diplomacia: { ...emptySkill },
    expressao: { ...emptySkill },
    intimidacao: { ...emptySkill },
    labia: { ...emptySkill },
  },
  proficiencias: '',
  habilidades: '',
  velocidade: { base: 0, temp: 0, boxes: Array(15).fill(false) },
  memoria: { base: 0, temp: 0, entries: Array(15).fill('') },
  canalizacao: { base: 0, temp: 0, boxes: Array(15).fill(false) },
  foco: { base: 0, temp: 0, entries: Array(15).fill('') },
  dominios: Array(12).fill(''),
  inventario: '',
  equipamentos: { arma: '', escudo: '', vestimenta: '', armadura: '', acessorio1: '', acessorio2: '' },
  magicasReceitas: '',
};
