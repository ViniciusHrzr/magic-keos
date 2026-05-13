# Magic Kéos — Ficha de Personagem

Aplicativo mobile de ficha de personagem para o RPG de mesa **Magic Kéos**, desenvolvido em React Native com Expo.

## Funcionalidades

### Ficha (`/`)
Ficha completa do personagem com:
- Nome do personagem
- **Sabedoria** — acumulada e disponível
- **Vida** — total, necro, atual, armadura e manto
- **Mana** — 6 cores (incolor, branco, verde, vermelho, preto, azul), cada uma com valor Base e Total
- **Veneno** — tracker de slots
- **Afinidade** — seleção de elemento
- **Instâncias** — Corpo, Mente e Espírito, cada uma com atributos (dados d4–d12), IP base/bônus e perícias
- **Proficiências** e **Habilidades** — campos de texto livre

### Magia (`/magia`)
Ficha de magia com:
- **Velocidade** e **Canalização** (lado a lado) — stepper base/temp + grid de checkboxes
- **Memória** e **Foco** (lado a lado) — stepper base/temp + grid de slots de texto
- **Domínios** — 3 iniciais + slots adicionais; domínios conhecidos do grimório exibem lista expansível de mágicas
- **Mágicas** — 20 slots; mágicas conhecidas do grimório exibem botão de detalhes
- **Receitas** — campo de texto livre para receitas de alquimia
- **Inventário** — campo de texto livre
- **Equipamentos** — arma, escudo, vestimenta, armadura e 2 acessórios

### Grimório (`/grimorio`)
Catálogo completo de mágicas com:
- Lista agrupada por **Domínio**, expansível com toque
- Filtros por **cor** (branco, verde, vermelho, preto, azul), **grau** (1–3) e **tipo**
- Busca por nome
- Modal de detalhe com imagem, efeito completo e atributos da mágica
- Botões para adicionar domínio ou mágica direto à ficha

## Dados
- **736 mágicas** carregadas do grimório oficial de Magic Kéos
- **736 imagens** das mágicas bundled no app (~4.9 MB, média 6.9 KB por imagem)
- Persistência local via **AsyncStorage**

## Stack
- [Expo SDK 54](https://expo.dev) / expo-router v6
- React Native 0.81.5
- TypeScript
- react-native-safe-area-context

## Como rodar

```bash
npm install
npx expo start
```

Abre no Expo Go (Android/iOS) ou gera APK via EAS Build:

```bash
npx eas build --platform android --profile preview
```

## Scripts utilitários

| Script | Descrição |
|--------|-----------|
| `scripts/extract_spell_images.py` | Extrai imagens do `.xlsx` do grimório e comprime com Pillow |
| `scripts/generate_image_map.py` | Gera `data/spellImages.ts` com os `require()` estáticos para o Metro bundler |
