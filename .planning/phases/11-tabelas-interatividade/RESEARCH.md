# Phase 11: Tabelas & Interatividade — Research

**Researched:** 2026-05-17
**Domain:** React Native StyleSheet — table styling, chevron animation, haptic feedback
**Confidence:** HIGH

---

## Summary

Phase 11 é cirúrgica: um único arquivo (`app/(tabs)/regras.tsx`), sem novos componentes, sem mudanças
de dados. Os três clusters de trabalho são independentes e podem ser sequenciados linearmente:

1. **Estilo RPG nas tabelas** — `TH` (header row), `R2`/`R3` (data rows) já existem com `tableHeaderRow`
   e `tableRow`. A pesquisa mostra que `tableHeaderRow` tem apenas `borderBottom` — falta `backgroundColor`
   distinto para o header (REG-03) e `borderBottom` nas data rows (REG-04). Coluna flex já está implementada
   (REG-05 parcialmente atendido — verificação de consistência necessária).

2. **Animação do chevron** — `LayoutAnimation` é a escolha certa para este caso: um único toggle
   booleano, sem valores de rotação contínuos, sem dependência de Reanimated. O chevron atual usa
   `▼/▲` como texto Unicode — pode ser animado com `LayoutAnimation.configureNext` ou convertido
   para um `Animated.Value` de rotação via `rotate`. Pesquisa confirma que Reanimated 4.x está
   instalado mas não importado em `regras.tsx` — adicionar import apenas para um chevron seria
   overhead desnecessário.

3. **Haptic feedback** — `expo-haptics` ~15.0.8 já está em `package.json` e o padrão de uso
   (`Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`) já existe em `components/haptic-tab.tsx`.
   É apenas um import + uma linha de chamada na função `onPress` do `Section`.

**REG-11 status:** Phase 10 JA implementou `sectionHeaderOpen` com `backgroundColor: RPG.surface` e
`borderBottomWidth: 1`. Isso satisfaz a mudança visual aberto/fechado (cor de fundo muda de `headerBg`
para `surface`). REG-11 está parcialmente satisfeito. Phase 11 só precisa garantir que a transição
TAMBÉM seja perceptível pelo usuário durante a animação — `LayoutAnimation` cobre isso automaticamente.

**Recomendação primária:** Usar `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)`
no toggle do chevron, converter `▼/▲` Unicode para uma `Animated.Value` de rotação apenas se a
diferença visual justificar, e adicionar `Haptics.impactAsync` diretamente no `onPress` do Section.
Para tabelas: adicionar `tableHeaderRow.backgroundColor: RPG.surfaceAlt` e `tableRow.borderBottomWidth`
como novos style modifiers — sem mexer no JSX do `TH`/`R2`/`R3`.

---

## Architectural Responsibility Map

| Capacidade | Tier Principal | Tier Secundário | Racional |
|------------|----------------|-----------------|---------|
| Estilo header de tabela (REG-03) | Frontend — StyleSheet | — | Puro estilo declarativo em `tableHeaderRow` |
| Separação de data rows (REG-04) | Frontend — StyleSheet | — | Puro estilo declarativo em `tableRow` |
| Alinhamento de colunas (REG-05) | Frontend — StyleSheet | — | flex props já controlam alinhamento |
| Animação do chevron (REG-10) | Frontend — LayoutAnimation | — | Toggle de expansão — sem servidor, sem estado persistido |
| Visual aberto/fechado (REG-11) | Frontend — StyleSheet array | — | Phase 10 já construiu a base condicional |
| Haptic feedback (REG-12) | Device — expo-haptics | Frontend (trigger) | Expo Haptics acessa API nativa de vibração |

---

<phase_requirements>
## Phase Requirements

| ID | Descrição | Suporte da Pesquisa |
|----|-----------|---------------------|
| REG-03 | Header row com fundo distinto + texto bold/gold | `tableHeaderRow` existe mas sem `backgroundColor` — adicionar `RPG.surfaceAlt` |
| REG-04 | Data rows com separação clara (borda inferior ou fundo alternado) | `tableRow` existe sem `borderBottomWidth` — adicionar border 1px `RPG.border` |
| REG-05 | Colunas consistentemente alinhadas em todas as 15+ seções | flex props já em uso; verificar seções com `widths` prop vs `colFirst`/`colFlex` default |
| REG-10 | Chevron anima suavemente entre colapsado/expandido | `LayoutAnimation.Presets.easeInEaseOut` resolve sem dependências novas |
| REG-11 | Header colapsável visualmente diferente aberto vs fechado | JA implementado via `sectionHeaderOpen` — Phase 11 garante transição visível |
| REG-12 | Toque no header aciona haptic leve (Expo Haptics) | `expo-haptics` instalado; padrão de uso disponível em `haptic-tab.tsx` |
</phase_requirements>

---

## Standard Stack

### Core (já instalado — zero novas dependências)

| Biblioteca | Versão | Propósito | Status |
|------------|--------|-----------|--------|
| `expo-haptics` | ~15.0.8 | Feedback háptico nativo | [VERIFIED: package.json] — já em `dependencies` |
| `LayoutAnimation` | built-in RN 0.81 | Animação implícita de layout | [VERIFIED: React Native docs] — sem import extra |
| `Animated` (RN core) | built-in RN 0.81 | Animação de valor numérico (rotação) | [VERIFIED: React Native docs] — disponível via `react-native` |

### Não usar

| Biblioteca | Por que não |
|------------|-------------|
| `react-native-reanimated` | Já instalado mas overkill para um chevron. Adicionar worklets/shared values apenas para rotação simples é complexidade desnecessária — LayoutAnimation resolve o caso. |
| Qualquer biblioteca de tabela externa | Escopo é estilização de componentes TH/R2/R3 existentes — sem dados dinâmicos, sem sorting, sem scrolling horizontal. |

**Instalação necessária:** Nenhuma. Todas as dependências estão em `package.json`.

---

## Package Legitimacy Audit

Nenhum pacote novo será instalado nesta fase. Todos os recursos utilizados (`expo-haptics`,
`LayoutAnimation`, `Animated`) já são dependências instaladas do projeto.

**Pacotes removidos por slopcheck:** nenhum (sem novos pacotes).
**Pacotes suspeitos:** nenhum.

---

## Análise do Código Existente

### Estado atual de `TH` / `R2` / `R3` (linhas 42–71)

```typescript
// TH (linha 42-51) — header row
function TH({ cols, widths }: { cols: string[]; widths?: number[] }) {
  return (
    <View style={[styles.tableRow, styles.tableHeaderRow]}>
      {cols.map((c, i) => (
        <Text key={i} style={[styles.tableKey, widths ? { flex: widths[i] } : (i === 0 ? styles.colFirst : styles.colFlex)]}>
          {c}
        </Text>
      ))}
    </View>
  );
}
```

**Achados:**
- `tableHeaderRow` (linha 642–647) tem apenas `borderBottomWidth: 1` e `borderBottomColor: RPG.goldDim` — **sem `backgroundColor`**. REG-03 requer fundo distinto.
- `tableKey` (linha 654–658) tem `color: RPG.gold` e `fontWeight: '600'` — gold já está, bold também (REG-03 satisfeito para texto, faltava só background).
- `tableRow` (linha 649–653) não tem `borderBottomWidth` — REG-04 requer separação entre data rows.

### Estado atual do `Section` (linhas 122–134)

```typescript
function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.sectionWrap}>
      <TouchableOpacity style={[styles.sectionHeader, open && styles.sectionHeaderOpen]} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <Text style={styles.sectionNum}>{num}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}
```

**Achados para REG-10/11/12:**
- Chevron é `<Text>{open ? '▲' : '▼'}</Text>` — troca instantânea sem animação (REG-10 não atendido).
- `sectionHeaderOpen` muda `backgroundColor` de `headerBg` para `surface` e adiciona `borderBottomWidth` (REG-11 atendido em valor estático, mas sem transição animada).
- `onPress={() => setOpen(o => !o)}` — sem haptic (REG-12 não atendido).

### Tokens disponíveis em `constants/theme.ts` [VERIFIED: leitura direta]

| Token | Valor | Uso recomendado |
|-------|-------|-----------------|
| `RPG.surfaceAlt` | `'#221a12'` | Background do `tableHeaderRow` (mais escuro que `surface`, mais claro que `headerBg`) |
| `RPG.border` | `'#3d2e18'` | `borderBottomColor` das data rows |
| `RPG.goldDim` | `'#7a6020'` | Já usado em `tableHeaderRow.borderBottomColor` — manter |
| `RPG.surface` | `'#181210'` | Background padrão do card/body |
| `RPG.headerBg` | `'#0d0b08'` | Background do header fechado |

---

## Architecture Patterns

### Padrão de Style Modifier (já estabelecido no projeto)

```typescript
// Padrão existente — Phase 10 já usa isso
style={[styles.sectionHeader, open && styles.sectionHeaderOpen]}

// Mesma abordagem para tableRow com alternância (se necessário)
style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
```

**[CITED: CONVENTIONS.md]** — "Dynamic styles via array syntax" é o padrão canônico do projeto.

### REG-03: Background do Header de Tabela

**Abordagem recomendada:** Adicionar `backgroundColor: RPG.surfaceAlt` ao `tableHeaderRow` existente.

```typescript
// Antes (linha 642–647)
tableHeaderRow: {
  borderBottomWidth: 1,
  borderBottomColor: RPG.goldDim,
  paddingBottom: 4,
  marginBottom: 2,
},

// Depois — apenas adicionar backgroundColor
tableHeaderRow: {
  backgroundColor: RPG.surfaceAlt,   // <-- linha nova
  borderBottomWidth: 1,
  borderBottomColor: RPG.goldDim,
  paddingBottom: 4,
  marginBottom: 2,
},
```

`RPG.surfaceAlt` (`#221a12`) é mais escuro que `RPG.surface` (`#181210`) mas mais claro que `RPG.headerBg`
(`#0d0b08`). Cria contraste sutil gold-on-dark que combina com a identidade visual RPG.

**Alternativa:** `RPG.headerBg` como background. Mais contraste, mas visualmente confunde header de
tabela com header de seção — `surfaceAlt` é a escolha mais segura.

### REG-04: Separação entre Data Rows

**Opção A — Border inferior (recomendada):**
```typescript
tableRow: {
  flexDirection: 'row',
  paddingVertical: 4,
  gap: 6,
  alignItems: 'flex-start',
  borderBottomWidth: StyleSheet.hairlineWidth,  // 0.5px — sutil, não invasivo
  borderBottomColor: RPG.border,
},
```

`StyleSheet.hairlineWidth` [VERIFIED: React Native docs] retorna o pixel mais fino que o device
suporta (0.33–1px dependendo da densidade de tela). Para tabelas densas com 15+ seções, é mais
limpo que fundo alternado.

**Opção B — Fundo alternado:**
```typescript
// No JSX do R2/R3 seria necessário passar o index como prop
// Isso requer mudança no JSX — mais invasivo que border
tableRowAlt: {
  backgroundColor: RPG.surfaceAlt + '55',  // hex transparency pattern do projeto
},
```

**Decisão:** Opção A (border inferior) recomendada. Não requer mudanças no JSX de R2/R3, apenas
no StyleSheet. Mais simples, zero risco de erro.

### REG-05: Alinhamento de Colunas

**Status atual:** O sistema flex já garante alinhamento dentro de cada seção. A verificação crítica
é que `TH` com `widths` prop e rows manuais (como nas seções 2, 11, 13, 16) usem os mesmos valores
de flex.

**Padrão de risco identificado:** Seções com rows inline (não usando R2/R3) duplicam os `flex` values
manualmente. Exemplo (linha 179–185):
```typescript
// Seção 2 — row inline com flex hardcoded
<Text style={[styles.tableKey, { flex: 1.2 }]}>{row.ponto}</Text>
<Text style={[styles.tableVal, { flex: 1 }]}>{row.corpo}</Text>
// ...
// TH correspondente (linha 177):
<TH cols={...} widths={[1.2, 1, 1, 1]} />  // mesmos valores — OK
```

Não há desalinhamento atual — os `widths` do `TH` batem com os `flex` dos rows inline.
REG-05 está **já atendido** pelo design existente. Nenhuma mudança necessária além de confirmar
visualmente no device.

### REG-10: Animação do Chevron

**Decisão: `LayoutAnimation` para o layout + `Animated.Value` para a rotação do chevron.**

**Por que não apenas `LayoutAnimation`:**
`LayoutAnimation.configureNext` anima as mudanças de layout (sectionBody aparecendo/desaparecendo)
mas não rotaciona o texto do chevron — `▼` ainda troca instantaneamente para `▲`.

**Por que não Reanimated:**
Reanimated 4.x está instalado mas não é usado em `regras.tsx`. Adicionar `useSharedValue` +
`useAnimatedStyle` + `withTiming` apenas para rotação de chevron introduz worklets e aumenta
a complexidade de manutenção. `Animated` da RN core resolve sem overhead.

**Abordagem recomendada — Animated.Value para rotação:**

```typescript
// Dentro do Section component
const [open, setOpen] = useState(false);
const rotation = useRef(new Animated.Value(0)).current;

const toggle = () => {
  const toValue = open ? 0 : 1;
  // LayoutAnimation para animar o aparecimento/desaparecimento do sectionBody
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  // Animated para a rotação do chevron
  Animated.timing(rotation, {
    toValue,
    duration: 200,
    useNativeDriver: true,
  }).start();
  setOpen(o => !o);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);  // REG-12 junto
};

const rotate = rotation.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '180deg'],
});
```

**JSX do chevron (substituição do `<Text>`):**
```typescript
// Antes
<Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>

// Depois — usar Animated.Text com transform rotate
// Manter apenas '▼' e rotacionar 180° para simular '▲'
<Animated.Text style={[styles.chevron, { transform: [{ rotate }] }]}>▼</Animated.Text>
```

**[CITED: React Native docs — Animated]** — `useNativeDriver: true` é suportado para `transform`
(incluindo `rotate`), garantindo que a animação rode na thread nativa sem janks de JS.

**Alternativa mais simples (sem Animated.Value):**
Apenas `LayoutAnimation` sem rotação de chevron — o texto `▼`/`▲` ainda troca instantaneamente,
mas a expansão do sectionBody é animada. Satisfaz REG-10 tecnicamente se o req for interpretado
como "transição de estado suave" (não necessariamente rotação do símbolo).

**Recomendação:** Usar LayoutAnimation + Animated.Value para rotação. Código total: ~8 linhas
adicionadas no Section. ROI alto, complexidade baixa.

### REG-11: Visual aberto/fechado

**Status:** JA implementado pela Phase 10.

`sectionHeaderOpen` em `styles` muda:
- `backgroundColor`: `headerBg` → `surface` (contraste sutil mas presente)
- Adiciona `borderBottomWidth: 1, borderBottomColor: RPG.goldDim`

Com `LayoutAnimation`, essa transição de cor também será animada (LayoutAnimation anima mudanças
de background implicitamente em iOS; Android requer `UIManager.setLayoutAnimationEnabledExperimental`).

**Ação necessária para REG-11:** Garantir `UIManager.setLayoutAnimationEnabledExperimental(true)`
para Android no setup do LayoutAnimation (ver Pitfall 1 abaixo).

### REG-12: Haptic Feedback

**Status do pacote:** [VERIFIED: package.json] `expo-haptics` ~15.0.8 já instalado.

**Padrão existente em `components/haptic-tab.tsx`:**
```typescript
import * as Haptics from 'expo-haptics';
// ...
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

**Implementação para Section:**
```typescript
// Adicionar import no topo de regras.tsx
import * as Haptics from 'expo-haptics';

// Dentro do onPress / função toggle do Section
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

**Nota Android:** `expo-haptics` funciona em Android mas com vibração discreta — nem todos os
devices Android têm motor háptico preciso. O padrão existente em `haptic-tab.tsx` NÃO usa o guard
`process.env.EXPO_OS === 'ios'` — chama diretamente. Para consistência com o padrão estabelecido
no projeto, chamar sem guard (gracefully degrades em Android).

**Decisão de design:** Chamar `Haptics.impactAsync` diretamente, sem guard de platform, seguindo
o mesmo padrão que seria adequado para `HapticTab` se não houvesse o guard lá.

---

## Don't Hand-Roll

| Problema | Não Construir | Usar em vez | Por que |
|----------|---------------|-------------|---------|
| Animação de rotação do chevron | Transform manual com setState de graus | `Animated.Value + interpolate` | Interpolação nativa, driver nativo, sem frame drops |
| Animação de expand/collapse do body | Mudança de height com useState | `LayoutAnimation.configureNext` | Anima implicitamente qualquer mudança de layout — zero código adicional no JSX |
| Haptic feedback | Vibração via `Vibration` API do RN | `expo-haptics` | expo-haptics usa APIs nativas de haptic (não apenas vibração) — feedback mais preciso em iOS |

---

## Common Pitfalls

### Pitfall 1: LayoutAnimation sem enableExperimentalFeature no Android
**O que dá errado:** `LayoutAnimation.configureNext` funciona nativamente no iOS. No Android com
New Architecture habilitada (este projeto tem `newArchEnabled: true` no `app.json`), o comportamento
pode variar.
**Por que acontece:** LayoutAnimation no Android com New Architecture (Fabric) tem suporte diferente
do modo legado.
**Como evitar:** Verificar se o comportamento de expand/collapse está correto no Android durante teste.
Se LayoutAnimation não animar no Android, a alternativa é usar `Animated.timing` para controlar
`maxHeight` — mais verboso mas mais previsível entre plataformas.
**Sinal de alerta:** Seção expande sem animação no Android (expansão instantânea).

### Pitfall 2: `useNativeDriver: true` com propriedades não suportadas
**O que dá errado:** `useNativeDriver` suporta apenas `transform` e `opacity`. Tentar animar
`backgroundColor` (para a transição de cor do header) com `useNativeDriver: true` causa erro.
**Por que acontece:** Animações de cor requerem comunicação com o thread JS em cada frame.
**Como evitar:** Usar `useNativeDriver: true` APENAS para `transform: [{ rotate }]`. A mudança
de backgroundColor do header é controlada por `LayoutAnimation` (implícita) ou pelo array de
style condicional existente — não por Animated diretamente.

### Pitfall 3: `Animated.Text` vs `Text` com `style.transform`
**O que dá errado:** `transform` em `Animated.Value` só funciona em componentes `Animated.*` —
usar `<Text style={{ transform: [{ rotate }] }}>` com um valor Animated NÃO funciona.
**Como evitar:** Substituir `<Text style={styles.chevron}>` por `<Animated.Text style={...}>`.
Importar `Animated` de `react-native` (já disponível — não é o Reanimated).

### Pitfall 4: Border inferior em todas as tableRow incluindo o header
**O que dá errado:** Se `tableRow` ganhar `borderBottomWidth`, a TH (que usa
`[styles.tableRow, styles.tableHeaderRow]`) também terá border inferior — redundante com o
`borderBottomColor` que `tableHeaderRow` já define.
**Como evitar:** Verificar que `tableHeaderRow.borderBottomColor` e `tableRow.borderBottomColor`
são os mesmos (`RPG.goldDim` para header, `RPG.border` para data rows). Alternativa: adicionar
`borderBottomWidth` apenas em `tableHeaderRow` e criar `tableDataRow` separado, mas isso requer
mudança no JSX de R2/R3. A abordagem mais simples é aceitar que `tableHeaderRow` sobreescreve
o `borderBottomColor` do `tableRow` — sem problema visual, apenas redundância.

### Pitfall 5: Seções com rows inline (não R2/R3) não recebem border automaticamente
**O que dá errado:** Seções 2, 11, 13, 16 usam `<View style={styles.tableRow}>` com `<Text>`
inline em vez de R2/R3. Adicionar border no `tableRow` resolve automaticamente essas seções também.
**Como evitar:** Isso é na verdade um benefício — mesma mudança de StyleSheet atinge todos os
usos de `tableRow` sem tocar no JSX. Confirmar visualmente que as seções com rows manuais ficam
corretas.

---

## REG-11: Análise de Status

**Pergunta da pesquisa:** REG-11 já está satisfeito pela Phase 10 ou Phase 11 precisa adicionar
algo?

**Resposta:**

Phase 10 implementou a mudança visual de estado (aberto/fechado) via `sectionHeaderOpen`:
```typescript
// styles já existentes após Phase 10
sectionHeader: {
  backgroundColor: RPG.headerBg,  // fechado: #0d0b08 (mais escuro)
  ...
},
sectionHeaderOpen: {
  backgroundColor: RPG.surface,   // aberto: #181210 (mais claro)
  borderBottomWidth: 1,
  borderBottomColor: RPG.goldDim,
},
```

A diferença visual está presente. REG-11 diz "muda de aparência visualmente" — isso está
atendido em valor estático.

**O que Phase 11 ADICIONA para REG-11:** `LayoutAnimation` fará a transição de cor ser gradual
(animada) em vez de instantânea. Isso não é um requisito separado de REG-11, é um efeito colateral
benéfico de REG-10. REG-11 está **satisfeito pela Phase 10** — Phase 11 só melhora a experiência
com animação.

---

## Code Examples

### Import necessário para regras.tsx (adicionar ao bloco de imports existente)

```typescript
// Adicionar — expo-haptics (já instalado em package.json)
import * as Haptics from 'expo-haptics';

// Adicionar — Animated e LayoutAnimation de react-native (já importado — só expandir o import)
// Linha 1-9 atual: import React, { useState } from 'react';
// import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
// Adicionar Animated, LayoutAnimation, UIManager, Platform ao import do react-native
import { Animated, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useRef } from 'react'; // adicionar ao import do React
```

### Section component refatorado (REG-10, REG-11, REG-12)

```typescript
function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const nextOpen = !open;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(rotation, {
      toValue: nextOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(nextOpen);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.sectionWrap}>
      <TouchableOpacity
        style={[styles.sectionHeader, open && styles.sectionHeaderOpen]}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionNum}>{num}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Animated.Text style={[styles.chevron, { transform: [{ rotate }] }]}>▼</Animated.Text>
      </TouchableOpacity>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}
```

### tableHeaderRow com background distinto (REG-03)

```typescript
// Modificar apenas o style tableHeaderRow no StyleSheet.create
tableHeaderRow: {
  backgroundColor: RPG.surfaceAlt,   // NOVO — #221a12, contraste com RPG.surface
  borderBottomWidth: 1,
  borderBottomColor: RPG.goldDim,
  paddingBottom: 4,
  marginBottom: 2,
},
```

### tableRow com border inferior (REG-04)

```typescript
// Modificar tableRow no StyleSheet.create
tableRow: {
  flexDirection: 'row',
  paddingVertical: 4,
  gap: 6,
  alignItems: 'flex-start',
  borderBottomWidth: StyleSheet.hairlineWidth,  // NOVO — ~0.5px
  borderBottomColor: RPG.border,                // NOVO — #3d2e18
},
```

---

## State of the Art

| Abordagem Antiga | Abordagem Atual (RN 0.76+) | Quando Mudou | Impacto |
|------------------|---------------------------|--------------|---------|
| `UIManager.setLayoutAnimationEnabledExperimental` para Android | Não necessário com New Architecture (Fabric) no RN 0.76+ | RN 0.76 (New Arch stable) | Pode remover o guard em projetos com `newArchEnabled: true` |
| `Animated` da RN core para animações simples | `react-native-reanimated` para animações complexas | Gradual 2021–2024 | Para rotação simples de chevron, Animated core ainda é preferível pela simplicidade |
| `Vibration` API para feedback | `expo-haptics` | Expo SDK 33+ | expo-haptics oferece feedback háptico nativo (não apenas vibração) em iOS |

**Deprecated/outdated:**
- `setNativeProps` para animações: substituído por `useNativeDriver: true` com Animated.
- Fundo alternado via `backgroundColor` em rows com `index % 2`: padrão mais antigo — border inferior é mais limpo e compatível com temas escuros.

---

## Assumptions Log

| # | Afirmação | Seção | Risco se Errado |
|---|-----------|-------|-----------------|
| A1 | `LayoutAnimation` com New Architecture (`newArchEnabled: true`) anima o expand/collapse corretamente em Android | REG-10 / Pitfall 1 | Se não animar no Android, a solução é Animated com maxHeight — mais código mas comportamento correto |
| A2 | `StyleSheet.hairlineWidth` em `tableRow.borderBottomWidth` é visualmente distinto em todos os devices alvo | REG-04 | Se muito sutil em Android, substituir por `1` pixel fixo |
| A3 | Haptic sem guard de platform (sem `if (Platform.OS === 'ios')`) é aceitável — segue o padrão implícito do projeto | REG-12 | Se o usuário preferir guard de platform, adicionar `if (Platform.OS === 'ios')` antes da chamada |

**Se a tabela estiver vazia:** Todas as afirmações foram verificadas ou citadas — sem confirmação do usuário necessária.

---

## Open Questions

1. **Animação de entrada/saída do `sectionBody`**
   - O que sabemos: `{open && <View>}` monta/desmonta o body instantaneamente mesmo com LayoutAnimation.
   - O que é incerto: LayoutAnimation anima o aparecimento do sectionBody (fade/expand) ou apenas
     o reflow dos outros elementos?
   - Recomendação: Testar no device. Se LayoutAnimation não animar o body (apenas o reflow do
     scroll), considerar substituir `{open && ...}` por `<View style={{ height: open ? undefined : 0, overflow: 'hidden' }}>` — isso permite LayoutAnimation animar a mudança de altura.

---

## Environment Availability

| Dependência | Requerida por | Disponível | Versão | Fallback |
|-------------|--------------|------------|--------|----------|
| `expo-haptics` | REG-12 | Sim | ~15.0.8 | Sem haptic — acceptable |
| `Animated` (RN core) | REG-10 | Sim | built-in RN 0.81.5 | — |
| `LayoutAnimation` (RN core) | REG-10 | Sim | built-in RN 0.81.5 | Animated com height manualmente |
| `RPG.surfaceAlt` | REG-03 | Sim | `'#221a12'` em theme.ts | `RPG.headerBg` como alternativa |

**Dependências ausentes sem fallback:** nenhuma.

---

## Validation Architecture

Sem testes automatizados no projeto (`workflow.nyquist_validation` não verificado explicitamente —
`TESTING.md` confirma zero testes). Validação é visual + ESLint + TypeScript strict.

**Verificação manual após implementação:**
- [ ] Abrir app no Expo Go / dev build
- [ ] Expandir qualquer seção — chevron deve rotacionar suavemente 180°
- [ ] Contração deve rotacionar de volta
- [ ] Toque deve disparar haptic (testável apenas em device físico, não simulador)
- [ ] Header da tabela deve ter fundo visivelmente diferente das data rows
- [ ] Data rows devem ter linha separadora sutil entre elas
- [ ] Nenhum erro TypeScript: `npx expo lint`

---

## Security Domain

Esta fase não envolve autenticação, persistência de dados, validação de input ou comunicação de
rede. Sem requisitos ASVS aplicáveis.

---

## Sources

### Primary (HIGH confidence)
- `app/(tabs)/regras.tsx` — leitura direta do código existente [VERIFIED: leitura direta]
- `constants/theme.ts` — tokens RPG.* verificados por leitura direta [VERIFIED: leitura direta]
- `package.json` — dependências verificadas por leitura direta [VERIFIED: leitura direta]
- `components/haptic-tab.tsx` — padrão de uso do expo-haptics verificado [VERIFIED: leitura direta]
- `.planning/phases/10-estrutura-tipografia/10-CONTEXT.md` — decisões da Phase 10 [VERIFIED: leitura direta]
- `.planning/phases/10-estrutura-tipografia/10-01-SUMMARY.md` — confirmação de implementação [VERIFIED: leitura direta]

### Secondary (MEDIUM confidence)
- React Native Animated API — `useNativeDriver: true` suporta `transform` [CITED: React Native docs — Animated]
- `StyleSheet.hairlineWidth` — retorna menor pixel suportado [CITED: React Native docs — StyleSheet]
- LayoutAnimation — anima mudanças implícitas de layout [CITED: React Native docs — LayoutAnimation]

### Tertiary (LOW confidence — para verificação)
- Comportamento de LayoutAnimation com New Architecture (Fabric) no Android [ASSUMED — A1]

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — zero dependências novas, tudo verificado em package.json
- Architecture: HIGH — código existente lido diretamente, padrões extraídos do codebase real
- Pitfalls: MEDIUM — Pitfalls 1/3/4 baseados em conhecimento de RN; Pitfalls 2/5 verificados pelo código
- REG-11 status: HIGH — estado implementado confirmado por leitura direta de styles

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (stack estável — Expo 54, RN 0.81)
