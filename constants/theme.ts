import { Platform } from 'react-native';

export const RPG = {
  bg: '#0a0806',
  surface: '#181210',
  surfaceAlt: '#221a12',
  border: '#3d2e18',
  borderLight: '#5a4422',
  gold: '#c9a84c',
  goldLight: '#e8c96a',
  goldDim: '#7a6020',
  text: '#f0e6d3',
  textMuted: '#a89070',
  textDark: '#6a5540',
  headerBg: '#0d0b08',
  headerText: '#f0e6d3',
  red: '#c0392b',
  redLight: '#e74c3c',

  // Mana & identity colors
  branco: '#e8e0cc',
  verde: '#3a8a3a',
  vermelho: '#b52020',
  preto: '#2a2030',
  azul: '#1a5ab0',

  brancoLight: '#f5f0e0',
  verdeLight: '#4aaa4a',
  vermelhoLight: '#e03030',
  pretoLight: '#6a5882',
  azulLight: '#2878e0',

  incolor: '#888070',
};

export const Colors = {
  light: {
    text: RPG.text,
    background: RPG.bg,
    tint: RPG.gold,
    icon: RPG.textMuted,
    tabIconDefault: RPG.textDark,
    tabIconSelected: RPG.gold,
  },
  dark: {
    text: RPG.text,
    background: RPG.bg,
    tint: RPG.gold,
    icon: RPG.textMuted,
    tabIconDefault: RPG.textDark,
    tabIconSelected: RPG.gold,
  },
};

export const Fonts = Platform.select({
  ios: { serif: 'ui-serif', sans: 'system-ui' },
  default: { serif: 'serif', sans: 'normal' },
  web: { serif: "Georgia, 'Times New Roman', serif", sans: 'system-ui' },
});
