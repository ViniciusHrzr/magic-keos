import { RPG } from '@/constants/theme';
import { SpellColor } from '@/data/grimoire';

export const COLOR_HEX: Record<SpellColor, string> = {
  branco: RPG.branco,
  verde: RPG.verdeLight,
  vermelho: RPG.vermelhoLight,
  preto: RPG.pretoLight,
  azul: RPG.azulLight,
};

export const GRAU_COLORS = ['#888', RPG.gold, RPG.goldLight, '#fff'];
