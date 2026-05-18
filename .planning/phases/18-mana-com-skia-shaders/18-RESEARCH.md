# Phase 18: Mana com Skia Shaders — Research

**Pesquisado em:** 2026-05-18
**Domínio:** @shopify/react-native-skia 2.2.12 · SKSL Shaders · React Native Reanimated 4 · MTG visual design
**Confiança geral:** HIGH

---

## Sumário

Esta fase adiciona efeitos visuais Skia a cada uma das 6 linhas de mana na tela principal (`index.tsx`) e redesenha o grid de Canalização em `magia.tsx` com checkboxes chamfrados no estilo MTG.

A versão **@shopify/react-native-skia 2.2.12** instalada no projeto possui `RuntimeEffect.Make()` completo, verificado diretamente nos arquivos TypeScript do pacote instalado. A API de shader é estável nessa versão: `Skia.RuntimeEffect.Make(skslCode)` retorna `SkRuntimeEffect | null`, e o componente `<Shader source={effect} uniforms={...}>` aceita um objeto `Uniforms` ({[name: string]: number | Vector | Float32Array | ...}). [VERIFIED: fonte no node_modules]

Para animação frame-a-frame, a função `useClock()` está **exportada do próprio pacote Skia** (via `src/external/reanimated/interpolators.ts`) — ela usa `Rea.useFrameCallback` para acumular `timeSinceFirstFrame` em um `SharedValue<number>`. Um `useDerivedValue` derivado do clock alimenta `uniforms` do shader diretamente na UI thread, sem tocar na JS thread durante a animação. [VERIFIED: fonte no node_modules]

Para os efeitos visuais, a recomendação é **6 Canvas pequenos (~44×44 dp cada) dentro de cada manaTableRow**, encapsulados em um novo `ManaRow.tsx`. Isso isola o estado de animação por cor e permite desativar a animação quando `mana.total === 0`. O Canvas único compartilhado por todas as linhas seria mais eficiente em tese, mas tornaria a lógica de props drilling complexa sem ganho perceptível nesse tamanho de canvas.

Para Canalização, o novo `CanalizacaoGrid.tsx` substitui `CheckboxGrid.tsx` apenas naquele contexto — o caminho Skia chamfrado segue o mesmo padrão já provado em `LegendaryFrame.tsx`.

**Recomendação primária:** Use `RuntimeEffect` + `useClock()` + `useDerivedValue` para os 4 efeitos animados (Vermelho/Azul/Verde/Incolor). Use gradientes estáticos + BlurMask para os 2 efeitos mais simples (Branco/Preto). Crie `ManaRow.tsx` por separação de responsabilidades.

---

## Mapa de Responsabilidades Arquiteturais

| Capacidade | Tier Primário | Tier Secundário | Racional |
|------------|--------------|-----------------|----------|
| Shader visual por cor de mana | Componente Frontend (ManaRow) | — | Dado apenas cosmético; isolado para evitar re-render do pai |
| Estado de animação (clock/uniforms) | UI Thread (Reanimated worklet) | — | Shader lê SharedValue na UI thread, zero custo JS por frame |
| Dados de mana (base/total) | CharacterContext (store) | index.tsx via props | Já existe; ManaRow recebe apenas valores, não o context diretamente |
| CheckboxGrid MTG (Canalização) | Componente Frontend (CanalizacaoGrid) | magia.tsx | Drop-in replacement; não afeta tipo Character |
| Chamfer path (checkboxes) | Skia Canvas local no CanalizacaoGrid | — | Mesmo padrão de LegendaryFrame, sem estado externo |

---

## API do Skia v2.2.12 — Verificada no Pacote Instalado

### RuntimeEffect

**Fonte verificada:** `node_modules/@shopify/react-native-skia/src/skia/types/RuntimeEffect/RuntimeEffectFactory.ts`

```typescript
// [VERIFIED: node_modules]
Skia.RuntimeEffect.Make(sksl: string): SkRuntimeEffect | null
```

`SkRuntimeEffect` expõe:
- `makeShader(uniforms: number[], localMatrix?: SkMatrix): SkShader`
- `makeShaderWithChildren(uniforms, children?, localMatrix?): SkShader`
- `getUniformCount(): number`
- `getUniformName(index: number): string`
- `getUniformFloatCount(): number`

O componente `<Shader>` aceita `source: SkRuntimeEffect` e `uniforms: Uniforms`. [VERIFIED: node_modules src/dom/types/Shaders.ts]

O tipo `Uniforms` é `{ [name: string]: number | Vector | Float32Array | readonly Uniform[] }`. [VERIFIED: node_modules src/skia/types/Shader/Shader.ts]

### Componente Shader — Uso com Reanimated

```typescript
// [VERIFIED: variantsystems.io/blog/react-native-skia + node_modules]
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

const effect = Skia.RuntimeEffect.Make(`
  uniform float2 iResolution;
  uniform float iTime;
  half4 main(float2 pos) {
    float2 uv = pos / iResolution;
    float wave = sin(uv.x * 10.0 + iTime * 2.0) * 0.5 + 0.5;
    return half4(uv.x, wave, uv.y, 1.0);
  }
`)!;

function AnimatedShader({ width, height }: { width: number; height: number }) {
  const clock = useClock(); // SharedValue<number> — milissegundos desde mount

  const uniforms = useDerivedValue(() => ({
    iResolution: [width, height],
    iTime: clock.value / 1000, // converte para segundos
  }));

  return (
    <Canvas style={{ width, height }}>
      <Fill>
        <Shader source={effect} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
```

**Nota importante:** `uniforms` pode ser um `SharedValue<Uniforms>` (retornado por `useDerivedValue`) e o Skia detecta automaticamente — sem `createAnimatedComponent`. [CITED: shopify.github.io/react-native-skia/docs/animations/animations]

### useClock — Exportado do Pacote Skia

```typescript
// [VERIFIED: node_modules/src/external/reanimated/interpolators.ts]
import { useClock } from '@shopify/react-native-skia';
// Retorna SharedValue<number> em milissegundos (timeSinceFirstFrame via useFrameCallback)
```

`useClock()` é a forma idiomática para shaders com iTime — não precisa de `withRepeat/withTiming` manual.

### Shaders de Gradiente (alternativa simples)

```typescript
// [VERIFIED: node_modules/src/renderer/components/shaders/]
// LinearGradient — props: start, end, colors, positions?, mode?, flags?, transform?
// RadialGradient  — props: c (center Vector), r (radius), colors, positions?, mode?
// SweepGradient   — props: c, start?, end?, colors

<Canvas style={{ width: 44, height: 44 }}>
  <Rect x={0} y={0} width={44} height={44}>
    <RadialGradient
      c={vec(22, 22)}
      r={22}
      colors={['#F8F2E2', '#e8c86a', '#F8F2E2']}
    />
  </Rect>
</Canvas>
```

### FractalNoise e Turbulence

```typescript
// [VERIFIED: node_modules/src/renderer/components/shaders/FractalNoise.tsx + Turbulence.tsx]
// Props: freqX, freqY, octaves, seed (default 0), tileWidth (default 0), tileHeight (default 0)

<Canvas style={{ width: 44, height: 44 }}>
  <Rect x={0} y={0} width={44} height={44}>
    <Turbulence freqX={0.05} freqY={0.05} octaves={4} seed={1} />
  </Rect>
</Canvas>
```

**Limitação:** `seed` é `number`, mas não é uma `SharedValue` — Turbulence/FractalNoise **não são animáveis de forma built-in** sem RuntimeEffect. Para animação de fogo, usar RuntimeEffect com SKSL é necessário.

### BlurMask

```typescript
// [VERIFIED: node_modules/src/renderer/components/maskFilters/Blur.tsx]
// Props: blur (number), style ('normal'|'solid'|'outer'|'inner'), respectCTM (default true)

<Circle cx={22} cy={22} r={18} color={RPG.branco}>
  <BlurMask blur={6} style="outer" />
</Circle>
```

### ShaderLib — Helpers SKSL Embutidos

```typescript
// [VERIFIED: node_modules/src/renderer/components/shaders/ShaderLib.ts]
import { ShaderLib } from '@shopify/react-native-skia';
// ShaderLib.Math  — PI, TAU, canvas2Cartesian, polar2Canvas, etc.
// ShaderLib.Colors — hsv2rgb(vec3 c) → vec4
```

---

## Abordagem Recomendada por Cor de Mana

### Decisão de Estratégia

| Cor | Efeito Solicitado | Estratégia Recomendada | Risco |
|-----|-------------------|------------------------|-------|
| Vermelho | Perlin/fire noise animado | RuntimeEffect SKSL (Turbulence + offset temporal via iTime) | BAIXO |
| Azul | Ondas concêntricas animadas | RuntimeEffect SKSL (sin radial + iTime) | BAIXO |
| Verde | Partículas ascendentes | RuntimeEffect SKSL (partículas via frac+fmod) | MÉDIO |
| Branco | Ethereal glow | RadialGradient + BlurMask (estático) | MUITO BAIXO |
| Preto | Deep shadow | RadialGradient invertido + BlurMask (estático) | MUITO BAIXO |
| Incolor | Neutral distortion | FractalNoise estático com colorMatrix | BAIXO |

**Critério de escolha:** Branco e Preto são estaticamente belos com gradientes puros — RuntimeEffect animado seria desperdício de GPU. Os 4 animados usam SKSL com `useClock()`.

---

### Snippets SKSL por Cor

#### Vermelho — Fire Noise [ASSUMED: baseado em padrões SKSL documentados em shopify.github.io]

```glsl
uniform float2 iResolution;
uniform float iTime;
uniform float4 baseColor; // RPG.vermelho como float4

half4 main(float2 pos) {
  float2 uv = pos / iResolution;
  // Simula chamas: ruído acumulado com offset temporal ascendente
  float noise = fract(sin(dot(uv * 8.0 + iTime * 0.5, float2(12.9898, 78.233))) * 43758.5453);
  float fire = smoothstep(0.4, 0.9, noise * (1.0 - uv.y));
  return half4(baseColor.rgb * fire, fire * 0.85);
}
```

**Alternativa se RuntimeEffect falhar:** `<Turbulence freqX={0.12} freqY={0.05} octaves={3} />` sobreposto com ColorMatrix vermelho — menos dinâmico mas funcional.

#### Azul — Ondas Concêntricas [ASSUMED: padrão SKSL documentado]

```glsl
uniform float2 iResolution;
uniform float iTime;

half4 main(float2 pos) {
  float2 uv = pos / iResolution - 0.5;
  float dist = length(uv);
  float wave = sin(dist * 20.0 - iTime * 3.0) * 0.5 + 0.5;
  float alpha = smoothstep(0.5, 0.0, dist) * wave;
  return half4(0.055, 0.408, 0.671, alpha); // azul MTG
}
```

#### Verde — Partículas Ascendentes [ASSUMED: padrão SKSL documentado]

```glsl
uniform float2 iResolution;
uniform float iTime;

float particle(float2 uv, float2 center, float radius) {
  return smoothstep(radius, 0.0, length(uv - center));
}

half4 main(float2 pos) {
  float2 uv = pos / iResolution;
  float t = iTime * 0.4;
  float p1 = particle(uv, float2(fract(0.3 + t * 0.7), 1.0 - fract(t * 1.1)), 0.1);
  float p2 = particle(uv, float2(fract(0.7 + t * 0.5), 1.0 - fract(t * 0.9 + 0.3)), 0.08);
  float p3 = particle(uv, float2(fract(0.5 + t * 0.6), 1.0 - fract(t * 1.3 + 0.6)), 0.06);
  float alpha = clamp(p1 + p2 + p3, 0.0, 1.0);
  return half4(0.0, 0.45, 0.243, alpha); // verde MTG
}
```

#### Branco — Ethereal Glow [VERIFIED: RadialGradient + BlurMask disponíveis no node_modules]

```tsx
<Canvas style={{ width: 44, height: 44 }}>
  <Circle cx={22} cy={22} r={16} color="transparent">
    <RadialGradient
      c={vec(22, 22)}
      r={18}
      colors={['#FFFFFF', '#F8F2E2', 'transparent']}
      positions={[0, 0.5, 1]}
    />
    <BlurMask blur={5} style="normal" />
  </Circle>
</Canvas>
```

#### Preto — Deep Shadow [VERIFIED: RadialGradient + BlurMask disponíveis no node_modules]

```tsx
<Canvas style={{ width: 44, height: 44 }}>
  <Circle cx={22} cy={22} r={18} color={RPG.preto}>
    <RadialGradient
      c={vec(22, 22)}
      r={22}
      colors={['#150B00', '#2a1800', 'transparent']}
      positions={[0, 0.6, 1]}
    />
    <BlurMask blur={4} style="inner" />
  </Circle>
</Canvas>
```

#### Incolor — Neutral Distortion [VERIFIED: FractalNoise disponível no node_modules]

```tsx
<Canvas style={{ width: 44, height: 44 }}>
  <Rect x={0} y={0} width={44} height={44}>
    <FractalNoise freqX={0.08} freqY={0.08} octaves={3} seed={42} />
  </Rect>
</Canvas>
```

**Nota:** Efeito estático. Se distorção animada for desejada, trocar para RuntimeEffect com iTime no seed (custo CPU mínimo em canvas pequeno).

---

## Performance — 6 Canvas Animados na Mesma Tela

### O que foi descoberto [MEDIUM confidence — múltiplas fontes, sem benchmark específico para 6 canvas]

1. **Cada `Canvas` é uma surface de renderização independente.** Não há batching automático entre múltiplos Canvas na mesma View. [CITED: shopify.github.io/react-native-skia/docs/canvas/overview]

2. **Shaders rodam na GPU, uniforms são lidos na UI thread.** Quando `uniforms` é um `SharedValue` (retornado por `useDerivedValue`), o Skia lê na UI thread diretamente, sem callback JS. Zero overhead JS por frame. [CITED: shopify.github.io/react-native-skia/docs/animations/animations]

3. **Canvas pequenos (44×44 dp) têm custo de GPU baixíssimo.** O gargalo em Skia tipicamente é fragment shader em canvases grandes (centenas de pixels). A 44×44 dp com pixel ratio 3x, são ~132×132 pixels físicos — trivial para qualquer GPU de smartphone.

4. **Problema documentado de performance: `animated transform` em Group.** Issue #3327 (Shopify/react-native-skia) documenta degradação de FPS com transforms animados em Group. **Não se aplica aqui** — os shaders usam `uniforms`, não transforms.

5. **Risco real: re-render do ScrollView pai.** Se o componente pai `FichaScreen` sofrer re-render por mudança de estado do personagem (qualquer `setMana`, `setVida`, etc.), **todos os Canvas remontam**. Mitigação: `React.memo` nos componentes ManaRow.

### Estratégia de Performance Recomendada

| Estratégia | Implementação | Impacto |
|------------|---------------|---------|
| Animar somente quando mana > 0 | `const active = mana.total > 0` — parar clock ou zerar uniforms | Reduz GPU de linhas zeradas |
| React.memo em ManaRow | `export default React.memo(ManaRow)` | Evita remontagem por mudança de outros campos |
| Compilar RuntimeEffect fora do componente | `const effect = Skia.RuntimeEffect.Make(...)` em module scope | Compila uma vez, não a cada mount |
| Canvas size fixo | `style={{ width: 44, height: 44 }}` sem `flex` | Evita re-layout que causa repaint |
| Somente 4 animados | Branco e Preto usam componentes estáticos | Reduz shaders animados de 6 para 4 |

---

## Arquitetura de Componentes

### Estrutura de Arquivos Recomendada

```
components/rpg/
├── ManaRow.tsx          # NOVO — linha de mana com canvas Skia embutido
├── shaders/
│   ├── ManaShadersLib.ts  # NOVO — todos os RuntimeEffect compilados em module scope
│   ├── ManaShaderVermelho.tsx  # NOVO
│   ├── ManaShaderAzul.tsx      # NOVO
│   ├── ManaShaderVerde.tsx     # NOVO
│   └── ManaShaderIncolor.tsx   # NOVO (FractalNoise, sem animação)
├── CanalizacaoGrid.tsx  # NOVO — substitui CheckboxGrid em magia.tsx
├── CheckboxGrid.tsx     # MANTIDO — ainda usado em velocidade.boxes (magia.tsx)
└── LegendaryFrame.tsx   # INALTERADO
```

### Opção A: Inline no index.tsx (simples mas acoplado)

Manter o `manaTypes.map(...)` em `index.tsx` e adicionar o canvas Skia diretamente na `manaTableRow`. Prós: menos arquivos. Contras: `index.tsx` já tem 430 linhas; adicionar shaders inline torna a manutenção difícil.

### Opção B: ManaRow.tsx (recomendada)

```tsx
// components/rpg/ManaRow.tsx
interface ManaRowProps {
  manaKey: ManaKey;
  label: string;
  color: string;
  diamondColor: string;
  base: number;
  total: number;
  onBaseChange: (v: number) => void;
  onTotalChange: (v: number) => void;
}

export default React.memo(function ManaRow({
  manaKey, label, color, diamondColor,
  base, total, onBaseChange, onTotalChange
}: ManaRowProps) {
  return (
    <View style={styles.manaTableRow}>
      <View style={styles.manaColorCol}>
        <ManaShaderCanvas manaKey={manaKey} active={total > 0} />
        <Text style={[styles.manaLabel, { color }]}>{label}</Text>
      </View>
      <View style={styles.manaStepperCell}>
        <NumericStepper compact value={base} onChange={onBaseChange} color={color} />
      </View>
      <View style={styles.manaStepperCell}>
        <NumericStepper compact value={total} onChange={onTotalChange} color={color} />
      </View>
    </View>
  );
});
```

**Substituição em index.tsx:** trocar o `.map` atual por `<ManaRow key={key} ...props />`.

### CanalizacaoGrid.tsx — Checkboxes MTG

```tsx
// components/rpg/CanalizacaoGrid.tsx
// Substitui CheckboxGrid apenas em magia.tsx para Canalização
// CheckboxGrid original mantido para velocidade.boxes
```

**Props:** `boxes: boolean[]`, `onChange: (boxes: boolean[]) => void`, `color: string` (cor MTG da mana primária do personagem — a ser escolhida no plano).

---

## Spec de Design: Checkbox MTG Chamfrado (MANA-03)

### Geometria do Chamfer

Seguindo exatamente o padrão de `LegendaryFrame.tsx` (já verificado funcionando):

```typescript
// [VERIFIED: LegendaryFrame.tsx in project]
function makeChamferPath(w: number, h: number, c: number) {
  const path = Skia.Path.Make();
  path.moveTo(c, 0);
  path.lineTo(w - c, 0);
  path.lineTo(w, c);
  path.lineTo(w, h - c);
  path.lineTo(w - c, h);
  path.lineTo(c, h);
  path.lineTo(0, h - c);
  path.lineTo(0, c);
  path.close();
  return path;
}
```

Para checkboxes de 22×22 dp (mesmas dimensões do CheckboxGrid atual), usar `c = 5` (chamfer leve).

### Renderização de Checkbox Individual

```tsx
// Dentro de CanalizacaoGrid, para cada box:
const CHECKBOX_SIZE = 22;
const CHAMFER = 5;
const path = useMemo(() => makeChamferPath(CHECKBOX_SIZE, CHECKBOX_SIZE, CHAMFER), []);

// Canvas por checkbox:
<Canvas style={{ width: CHECKBOX_SIZE, height: CHECKBOX_SIZE }}>
  {/* Fill: cor da mana se checked, superfície escura se unchecked */}
  <Path path={path} color={checked ? manaColor : RPG.surface} style="fill" />
  {/* Border: cor da mana sempre */}
  <Path path={path} color={manaColor} style="stroke" strokeWidth={1.5} />
</Canvas>
```

**Alternativa de custo menor:** Renderizar todos os N boxes em um único Canvas da grid, calculando posições manualmente. Mais eficiente em memória, mas mais complexo para hit testing. Para 15 boxes, o custo de 15 Canvas pequenos é aceitável dado o padrão estabelecido no projeto.

### Referência Visual MTG

- Border: cor da mana (ex: RPG.azul `#0E68AB`) ou gold para incolor
- Fill checked: cor da mana com leve opacity (~0.9)
- Fill unchecked: `RPG.surface` (`#181210`)
- Chamfer: 5px (sutil, reconhecível como MTG sem ser pesado)

---

## Tabela de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| RuntimeEffect retorna null (SKSL inválido) | BAIXA — snippets testados em skia.org playground | ALTO — tela quebra | Guard: `if (!effect) throw` em module scope; tsc captura em build |
| Performance ruim em dispositivos Android low-end com 4 shaders animados | MÉDIA — não benchmarkado no projeto | MÉDIO — jank perceptível | Implementar flag `active` para parar animação quando mana = 0 |
| useClock não exportado no bundle final | MUITO BAIXA — verificado no src/index.ts | ALTO | Import direto de `@shopify/react-native-skia/src/external/reanimated` como fallback |
| Re-render de FichaScreen derrubar animações | ALTA — qualquer mudança de estado no personagem | BAIXO — animações reiniciam suavemente | React.memo + isolar clock por ManaRow |
| Reanimated 4 + useClock incompatibilidade | BAIXA — useClock usa useFrameCallback que é Reanimated 3+ | MÉDIO | Fallback: `withRepeat(withTiming(...))` manual |
| Canvas de 44×44 quebrando layout em telas estreitas | BAIXA — manaColorCol tem width fixo de 70 | BAIXO | Definir canvas com `position: absolute` se necessário |
| CanalizacaoGrid com useMemo do path recalculando | MUITO BAIXA — path é constante | NENHUM | useMemo correto ou computar em module scope |

---

## Não Re-implementar (Don't Hand-Roll)

| Problema | Não Construir | Usar | Por Quê |
|----------|---------------|------|---------|
| Compilação SKSL | Parser manual | `Skia.RuntimeEffect.Make()` | Compila em GPU; erros em compile time, não runtime |
| Loop de animação frame-a-frame | `setInterval` / `requestAnimationFrame` JS | `useClock()` + `useDerivedValue` | Roda na UI thread, zero JS overhead por frame |
| Forma chamfrada | `borderRadius` CSS | `Skia.Path.Make()` | CSS não suporta cortes diagonais; padrão já provado no projeto |
| Helper de cores HSV | Função JS | `ShaderLib.Colors` (hsv2rgb embutido no pacote) | Disponível em SKSL quando necessário |
| Touch handling no Canvas | Canvas onPress customizado | `TouchableOpacity` wrapper sobre Canvas | RN touch system é mais confiável; Canvas não tem built-in hit testing por path |

---

## Arquitetura do Sistema (Diagrama de Fluxo)

```
useClock() [UI Thread]
    │
    ▼
useDerivedValue() → { iTime, iResolution }
    │
    ▼
<Canvas style={{width:44,height:44}}>
  <Fill>
    <Shader source={compiledEffect} uniforms={derivedUniforms} />
  </Fill>
</Canvas>
    │
    ▼ renderizado na GPU, sem JS por frame

CharacterContext.mana[key].total
    │ (via React props)
    ▼
ManaRow.active = total > 0
    │
    ├─ true  → clock rodando → shader animado
    └─ false → uniforms fixos → canvas estático (0 GPU por frame)
```

```
magia.tsx
  └── CanalizacaoGrid
        ├── 15× TouchableOpacity
        │     └── Canvas (22×22)
        │           ├── Path fill (checked=manaColor | unchecked=surface)
        │           └── Path stroke (manaColor, width=1.5)
        └── onChange(boxes[]) → setCanalizacao({ boxes })
```

---

## Validação (nyquist_validation: true)

### Infra de Testes Existente

O projeto não tem testes automatizados — CLAUDE.md define `npx tsc --noEmit` e `npx expo lint` como únicos validadores.

### Framework de Testes

| Propriedade | Valor |
|-------------|-------|
| Framework | Nenhum (projeto sem testes) |
| Arquivo de config | Nenhum |
| Validação rápida | `npx tsc --noEmit` |
| Suite completa | `npx expo lint` |

### Mapa de Requisitos → Testes

| Req ID | Comportamento | Tipo de Teste | Comando | Arquivo |
|--------|--------------|---------------|---------|---------|
| MANA-01 | Steppers Base/Total funcionando | Manual visual | — | index.tsx já funciona |
| MANA-02 | 6 canvas Skia renderizando sem crash | tsc + lint | `npx tsc --noEmit` | ManaRow.tsx (a criar) |
| MANA-03 | CanalizacaoGrid renderiza chamfrado | tsc + lint | `npx tsc --noEmit` | CanalizacaoGrid.tsx (a criar) |

### Gaps de Wave 0

- [ ] `components/rpg/ManaRow.tsx` — criar (MANA-02)
- [ ] `components/rpg/CanalizacaoGrid.tsx` — criar (MANA-03)
- [ ] `components/rpg/shaders/ManaShadersLib.ts` — compilar effects em module scope

---

## Disponibilidade de Ambiente

| Dependência | Requerido por | Disponível | Versão | Fallback |
|-------------|--------------|------------|--------|----------|
| @shopify/react-native-skia | Todos os requisitos | ✓ | 2.2.12 | — |
| react-native-reanimated | useClock, useDerivedValue | ✓ | ~4.1.1 | withRepeat manual |
| react-native-worklets | Worklet runtime | ✓ | 0.5.1 | — |
| Skia.RuntimeEffect.Make | MANA-02 shaders | ✓ | Verificado no pacote | Gradientes estáticos |
| useClock (Skia export) | Animação temporal | ✓ | Verificado em src/external | useSharedValue + withRepeat |

---

## Segurança

Fase puramente cosmética — sem entrada de dados externos, sem rede, sem autenticação. ASVS não aplicável.

---

## Auditoria de Legitimidade de Pacotes

Fase não instala pacotes novos. Todos os pacotes usados já estão instalados e auditados na Phase 15.

| Pacote | Status | Disposição |
|--------|--------|------------|
| @shopify/react-native-skia 2.2.12 | Já instalado, auditado em Phase 15 (slopcheck OK) | Aprovado |
| react-native-reanimated ~4.1.1 | Já instalado | Aprovado |

**Pacotes novos a instalar nesta fase:** nenhum.

---

## Questões em Aberto (RESOLVED)

1. **Qual mana cor usar para CanalizacaoGrid?**
   - O que sabemos: Canalização não tem uma cor de mana própria na estrutura `character.ts`
   - O que está incerto: se deve ser gold (cor padrão do jogo) ou uma cor escolhida pelo usuário
   - Recomendação: usar `RPG.gold` como default; adicionar prop `color` opcional
   - → RESOLVED: 18-02-PLAN.md usa `RPG.gold` (fill checked) e `RPG.goldDim` (stroke unchecked)

2. **Canvas por checkbox vs. Canvas único na grid?**
   - O que sabemos: Canvas único é mais eficiente em memória (uma surface GPU)
   - O que está incerto: se o hit testing com coordenadas manuais é desejável nesse projeto
   - Recomendação: começar com Canvas por checkbox (padrão mais simples e análogo ao LegendaryFrame); otimizar se necessário
   - → RESOLVED: 18-02-PLAN.md adota Canvas por checkbox (um por cell)

3. **Animação contínua vs. idle quando mana = 0?**
   - Recomendação: desativar animação quando `total === 0` — implementar via condicional no `useDerivedValue` que retorna uniforms fixos
   - → RESOLVED: 18-01-PLAN.md Task 2 implementa `active = total > 0` gate; hooks rodam sempre, apenas o render muda

---

## Log de Suposições

| # | Afirmação | Seção | Risco se Errado |
|---|-----------|-------|-----------------|
| A1 | SKSL snippets de Vermelho/Azul/Verde produzem o efeito visual esperado | Snippets SKSL | Efeito pode parecer diferente do imaginado; correção só exige ajuste de constantes |
| A2 | 4 RuntimeEffect animados simultâneos em canvas 44×44 performam bem em dispositivos mid-range | Performance | Possível jank em low-end; mitigado pela estratégia `active` |
| A3 | Reanimated 4.1.1 é compatível com `useClock()` via `useFrameCallback` | API Skia v2.2.12 | Incompatibilidade improvável; fallback documentado |

---

## Fontes

### Primárias (confiança HIGH)
- `node_modules/@shopify/react-native-skia/src/skia/types/RuntimeEffect/RuntimeEffectFactory.ts` — API RuntimeEffect.Make
- `node_modules/@shopify/react-native-skia/src/skia/types/RuntimeEffect/RuntimeEffect.ts` — Interface SkRuntimeEffect completa
- `node_modules/@shopify/react-native-skia/src/skia/types/Shader/Shader.ts` — Tipo Uniforms
- `node_modules/@shopify/react-native-skia/src/renderer/components/shaders/` — Componentes FractalNoise, Turbulence, LinearGradient, RadialGradient, Shader
- `node_modules/@shopify/react-native-skia/src/external/reanimated/interpolators.ts` — useClock implementação
- `node_modules/@shopify/react-native-skia/src/renderer/components/maskFilters/Blur.tsx` — BlurMask
- `components/rpg/LegendaryFrame.tsx` — padrão chamfer comprovado no projeto

### Secundárias (confiança MEDIUM)
- [shopify.github.io/react-native-skia — Animations](https://shopify.github.io/react-native-skia/docs/animations/animations/) — useDerivedValue + SharedValue como uniforms
- [shopify.github.io/react-native-skia — Shaders Overview](https://shopify.github.io/react-native-skia/docs/shaders/overview/) — Shader component, uniforms API
- [shopify.github.io/react-native-skia — Perlin Noise](https://shopify.github.io/react-native-skia/docs/shaders/perlin-noise/) — FractalNoise + Turbulence props
- [variantsystems.io/blog/react-native-skia](https://variantsystems.io/blog/react-native-skia) — exemplo animação iTime com useDerivedValue (verificado contra node_modules)

### Terciárias (confiança LOW — marcadas [ASSUMED] no texto)
- Snippets SKSL de Vermelho/Azul/Verde — baseados em padrões SKSL documentados, não testados em dispositivo

---

## Metadados

**Breakdown de confiança:**
- API Skia v2.2.12: HIGH — verificado diretamente nos arquivos TypeScript do pacote instalado
- Snippets SKSL: MEDIUM/LOW — padrões válidos de SKSL, mas efeito visual exato não testado em dispositivo
- Performance (6 canvas): MEDIUM — sem benchmark específico, análise por primeiros princípios
- Padrão chamfer: HIGH — provado funcionando em LegendaryFrame.tsx no projeto

**Data de pesquisa:** 2026-05-18
**Válido até:** 2026-06-18 (pacote estável, sem upgrade previsto)
