import { type DieColor } from '@/types/character';

export interface IQuickNote {
  id: string;
  type: 'note';
  text: string;
  qty: number;
}

export interface IStructuredGear {
  id: string;
  type: 'gear';
  name: string;
  type_equip: 'arma' | 'escudo' | 'vestimenta' | 'acessorio' | 'outro';
  damage?: string;
  defense?: string;
  affinity?: DieColor;
  melhorias: string[];
  lore?: string;
}

export type InventoryItem = IQuickNote | IStructuredGear;

export function isQuickNote(item: InventoryItem): item is IQuickNote {
  return item.type === 'note';
}

export function isStructuredGear(item: InventoryItem): item is IStructuredGear {
  return item.type === 'gear';
}
