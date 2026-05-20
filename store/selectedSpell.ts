import { Spell } from '@/data/grimoire';

let _spell: Spell | null = null;

export const selectedSpell = {
  get: (): Spell | null => _spell,
  set: (s: Spell): void => { _spell = s; },
};
