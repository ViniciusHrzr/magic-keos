import type { InventoryItem } from '@/types/inventory';

export type DieColor = 'branco' | 'verde' | 'vermelho' | 'preto' | 'azul' | null;
export type AttrDice = [DieColor, DieColor, DieColor, DieColor, DieColor];

export interface SkillValue {
  base: number;
  temp: number;
}

export interface EquipItem {
  nome: string;
  tipo: 'basico' | 'artefato';
  melhorias: string[];
  efeito?: string;
  durabilidade?: number;
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
    incolor:  { base: number; total: number };
    branco:   { base: number; total: number };
    verde:    { base: number; total: number };
    vermelho: { base: number; total: number };
    preto:    { base: number; total: number };
    azul:     { base: number; total: number };
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

  proficiencias: string[];
  habilidades: string[];
  notas: string;

  velocidade: { base: number; temp: number; boxes: boolean[] };
  memoria: { base: number; temp: number; entries: string[] };
  canalizacao: { base: number; temp: number; boxes: boolean[] };
  foco: { base: number; temp: number; entries: string[] };

  dominios: string[];

  /** @deprecated kept only for migrate() Guard C — use inventarioItems */
  inventarioSlots?: string[];
  inventarioItems: InventoryItem[];

  equipamentos: {
    arma: EquipItem | null;
    escudo: EquipItem | null;
    vestimenta: EquipItem | null;
    armadura: EquipItem | null;
    acessorio1: EquipItem | null;
    acessorio2: EquipItem | null;
  };

  magicas: string[];
  receitas: string;
}

const emptyDice: AttrDice = [null, null, null, null, null];
const emptySkill: SkillValue = { base: 0, temp: 0 };

export const defaultCharacter: Character = {
  nome: '',
  sabedoria: { acumulada: 0, disponivel: 0 },
  vida: { total: 0, necro: 0, atual: 0, armadura: 0, manto: 0 },
  mana: {
    incolor:  { base: 0, total: 0 },
    branco:   { base: 0, total: 0 },
    verde:    { base: 0, total: 0 },
    vermelho: { base: 0, total: 0 },
    preto:    { base: 0, total: 0 },
    azul:     { base: 0, total: 0 },
  },
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
  proficiencias: [],
  habilidades: [],
  notas: '',
  velocidade: { base: 0, temp: 0, boxes: Array(15).fill(false) },
  memoria: { base: 0, temp: 0, entries: Array(15).fill('') },
  canalizacao: { base: 0, temp: 0, boxes: Array(15).fill(false) },
  foco: { base: 0, temp: 0, entries: Array(15).fill('') },
  dominios: Array(12).fill(''),
  inventarioItems: [],
  equipamentos: { arma: null, escudo: null, vestimenta: null, armadura: null, acessorio1: null, acessorio2: null },
  magicas: Array(20).fill(''),
  receitas: '',
};
