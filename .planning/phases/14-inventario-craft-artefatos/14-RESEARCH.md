# Phase 14: Inventário, Craft & Artefatos — Research

**Researched:** 2026-05-17
**Domain:** React Native / Expo Router — extensão da MochilaScreen existente
**Confidence:** HIGH

---

## Summary

Esta fase estende exclusivamente `app/(tabs)/mochila.tsx` — já construída na Phase 13. Nenhum
arquivo de infraestrutura precisa ser criado: o schema (`EquipItem`, `inventarioSlots`), os
setters (`setInventarioSlot`, `setEquipamentoItem`) e os dados do livro (`data/regras/equipamentos.ts`)
estão todos no lugar. O trabalho é de UI pura: grade de inventário, seção de craft dentro dos
cards já colapsáveis, e toggle de artefato no `slotBody` já expandido.

O único gap de dados encontrado é **crítico para CRAFT-02**: `data/regras/equipamentos.ts` exporta
`melhorias` como dois items de texto plano sem estrutura por slot-type ou cor individual — a lista
detalhada completa (Escudos, Acessórios, Vestimentas com subdivisões) existe apenas em
`REQUIREMENTS.md`. Isso significa que a constante de melhorias por tipo e cor **precisa ser criada
como nova estrutura** no arquivo de dados, derivada dos requisitos.

O grid de inventário de 20 slots em 2 colunas se implementa diretamente com `FlatList` (2 colunas)
ou via array manual de pares usando Views — ambos estão disponíveis sem libs externas. O padrão de
TextInput+clear já existe em `foco.entries` e `memoria.entries` (arrays de strings com setter por
índice), exatamente como `inventarioSlots`.

**Recomendação primária:** Todo o trabalho acontece dentro de `mochila.tsx` (grade de inventário e
seção craft/artefato nos cards de equipamento). A única mudança em `equipamentos.ts` é adicionar
uma constante `MELHORIAS_POR_SLOT` tipada que o planner utilizará para o picker de craft.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Grade de inventário (INV-01, INV-02) | Frontend — mochila.tsx | CharacterContext | Renderiza `c.inventarioSlots[0..19]`; mutação via `setInventarioSlot(idx, v)` já disponível |
| Picker de craft / melhorias (CRAFT-01, CRAFT-02, CRAFT-03) | Frontend — mochila.tsx | data/regras/equipamentos.ts | Lista filtrada por SlotKey; dados precisam de nova constante `MELHORIAS_POR_SLOT` |
| Toggle Artefato + campos extras (ARTE-01) | Frontend — mochila.tsx | CharacterContext | Toggle `tipo` em `EquipItem`; setter `setEquipamentoItem` já recebe o objeto inteiro |
| Persistência | CharacterContext | AsyncStorage | `setEquipamentoItem` e `setInventarioSlot` já fazem debounced write; nenhuma mudança de infraestrutura |

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INV-01 | Usuário pode nomear itens em grade de 20 slots de inventário organizados em 2 colunas | `c.inventarioSlots` é `string[]` de 20 elementos; `setInventarioSlot(idx, v)` mutação já existe; layout 2-col via FlatList numColumns={2} ou pares manuais |
| INV-02 | Usuário pode apagar conteúdo de slot individualmente sem apagar outros | `setInventarioSlot(idx, '')` já basta; botão de clear individual por slot |
| CRAFT-01 | Usuário pode adicionar até 3 melhorias a qualquer slot de equipamento, escolhendo de lista filtrada pelo tipo do slot | `EquipItem.melhorias: string[]` já suporta array; guard `melhorias.length < 3` antes de adicionar; filtro por SlotKey via nova constante `MELHORIAS_POR_SLOT` |
| CRAFT-02 | Lista de melhorias segue exatamente o livro por categoria e cor | Exige nova constante `MELHORIAS_POR_SLOT` em equipamentos.ts com 4 tipos × 5 cores (ver seção Data Structures abaixo) |
| CRAFT-03 | Usuário pode remover qualquer melhoria individualmente sem afetar as demais | `setEquipamentoItem(slot, { ...item, melhorias: melhorias.filter((_, i) => i !== idx) })` — imutável, não afeta outros slots |
| ARTE-01 | Usuário pode marcar qualquer item equipado como Artefato, desbloqueando efeito ativável (texto livre) e durabilidade (inteiro) | `EquipItem.tipo` é `'basico' \| 'artefato'`; campos `efeito?: string` e `durabilidade?: number` já existem na interface; toggle muda tipo e exibe dois campos extras |
</phase_requirements>

---

## Standard Stack

### Core — já instalado, nenhuma dependência nova

| Library | Where Used | Purpose |
|---------|-----------|---------|
| React Native `FlatList` ou `View` layout manual | mochila.tsx grid section | Grade 2 colunas de inventário |
| `LayoutAnimation.Presets.easeInEaseOut` | mochila.tsx (já usado) | Animação collapse/expand de cards |
| `TextInput` | mochila.tsx (já usado) | Edição de nome nos slots de inventário e campos artefato |
| `NumericStepper` (`components/rpg/NumericStepper.tsx`) | mochila.tsx craft section | Campo durabilidade (inteiro, min=0) |
| `RPG` (constants/theme.ts) | mochila.tsx styles | Cores de tier de melhoria (ver mapeamento abaixo) |

**Nenhum pacote externo necessário.** Tudo existe no projeto.

### Alternativas Consideradas

| Ao invés de | Poderia usar | Tradeoff |
|-------------|-------------|----------|
| FlatList numColumns={2} | View manual com pares de rows | FlatList é mais correto para listas longas (virtualização), mas 20 slots é pequeno o suficiente para View manual sem custo — qualquer um funciona |
| NumericStepper (já existe) | TextInput keyboardType="numeric" inline | NumericStepper já tem clamp/min/max e estilo RPG; reutilizar é correto |

---

## Package Legitimacy Audit

> Fase sem dependências externas novas — seção não aplicável. Nenhum pacote a instalar.

---

## Data Structures

### 1. `c.inventarioSlots` — Estado Atual

```typescript
// types/character.ts (linha 102)
inventarioSlots: string[]; // 20 strings, default Array(20).fill('')

// defaultCharacter (linha 178)
inventarioSlots: Array(20).fill('') as string[],
```

[VERIFIED: lido do arquivo types/character.ts]

### 2. `EquipItem` — Interface Completa

```typescript
// types/character.ts (linhas 9-15)
export interface EquipItem {
  nome: string;
  tipo: 'basico' | 'artefato';
  melhorias: string[];   // array de labels de melhoria, ex: 'Acurácia+1'
  efeito?: string;       // só modo artefato
  durabilidade?: number; // só modo artefato
}
```

[VERIFIED: lido do arquivo types/character.ts]

**Observação crítica:** `melhorias` é `string[]`. Os valores armazenados serão labels de texto
livre (ex: `'Acurácia+1'`). O planner precisa definir que a constante de melhorias usa exatamente
esses labels como strings — o que é salvo e o que é exibido são a mesma string.

### 3. `melhorias` em equipamentos.ts — Gap Descoberto

O arquivo atual exporta:

```typescript
// data/regras/equipamentos.ts (linhas 82-85) [VERIFIED: lido do arquivo]
export const melhorias: MelhoriaRow[] = [
  { tipo: 'Armas', descricao: 'W=Acurácia+1 · G=Acurácia madeira+1 · R=Dano físico+1 · B=Dado dano+1 · U=Dano mágico+1' },
  { tipo: 'Vestimentas', descricao: 'W=Armadura+1 · G=Manto+1 · R=IP Corp.+1 · B=IP Esp.+1 · U=IP Mental+1' },
]
```

**PROBLEMA:** Esta constante tem apenas 2 tipos (Armas, Vestimentas) em formato de texto plano para
exibição em tabela. Escudos e Acessórios **não estão** na constante `melhorias`. O CRAFT-01 requer
filtragem por slot type, e CRAFT-02 requer exatamente os dados do livro para todos os 4 tipos.

**Solução necessária:** Nova constante `MELHORIAS_POR_SLOT` a ser adicionada em `equipamentos.ts`,
derivada de REQUIREMENTS.md CRAFT-02:

```typescript
// A ser criado em data/regras/equipamentos.ts
export interface MelhoriaItem {
  label: string;   // string que vai em EquipItem.melhorias[]
  cor: 'branco' | 'verde' | 'vermelho' | 'preto' | 'azul';
}

export const MELHORIAS_POR_SLOT: Record<'arma' | 'escudo' | 'vestimenta' | 'acessorio1' | 'acessorio2', MelhoriaItem[]> = {
  arma: [
    { label: 'Acurácia+1',        cor: 'branco'   },
    { label: 'Acurácia madeira+1',cor: 'verde'    },
    { label: 'Dano físico+1',     cor: 'vermelho' },
    { label: 'Dado dano+1',       cor: 'preto'    },
    { label: 'Dano mágico+1',     cor: 'azul'     },
  ],
  escudo: [
    { label: 'IP Esp+1/Armadura+1',   cor: 'branco'   },
    { label: 'IP Corp+1/Manto+1',     cor: 'verde'    },
    { label: 'IP Corp+1/Armadura+1',  cor: 'vermelho' },
    { label: 'IP Esp+1/IP Mental+1',  cor: 'preto'    },
    { label: 'IP Mental+1/Manto+1',   cor: 'azul'     },
  ],
  vestimenta: [
    { label: 'Armadura+1/Diplomacia+1/Esgrima+1',    cor: 'branco'   },
    { label: 'Manto+1/Comunhão+1/Pontaria+1',        cor: 'verde'    },
    { label: 'IP Corp+1/Expressão+1/Atletismo+1',    cor: 'vermelho' },
    { label: 'IP Esp+1/Intimidação+1/Furtividade+1', cor: 'preto'    },
    { label: 'IP Mental+1/Lábia+1/Artes Marciais+1', cor: 'azul'     },
  ],
  acessorio1: [
    { label: 'Foco+1/Mecânica+1',        cor: 'branco'   },
    { label: 'Canalização+1/Sobrevivência+1', cor: 'verde' },
    { label: 'Velocidade+1/Criatividade+1',   cor: 'vermelho' },
    { label: 'Domínio+1/Alquimia+1',          cor: 'preto'    },
    { label: 'Memória+1/Investigação+1',      cor: 'azul'     },
  ],
  acessorio2: [
    { label: 'Foco+1/Mecânica+1',        cor: 'branco'   },
    { label: 'Canalização+1/Sobrevivência+1', cor: 'verde' },
    { label: 'Velocidade+1/Criatividade+1',   cor: 'vermelho' },
    { label: 'Domínio+1/Alquimia+1',          cor: 'preto'    },
    { label: 'Memória+1/Investigação+1',      cor: 'azul'     },
  ],
};
```

[ASSUMED: labels derivados de REQUIREMENTS.md CRAFT-02 — confirmar que são exatamente os textos
do livro físico antes de implementar. Os labels de vestimenta têm múltiplas opções por cor
conforme o livro — os labels acima refletem fielmente o que está em CRAFT-02.]

### 4. Mapeamento de Cor para Token RPG

| Cor da melhoria | Token RPG | Hex |
|----------------|----------|-----|
| `'branco'` | `RPG.branco` | `#e8e0cc` |
| `'verde'` | `RPG.verde` | `#3a8a3a` |
| `'vermelho'` | `RPG.vermelho` | `#b52020` |
| `'preto'` | `RPG.pretoLight` | `#6a5882` (preto puro #2a2030 seria invisível no fundo escuro) |
| `'azul'` | `RPG.azul` | `#1a5ab0` |

[VERIFIED: lido de constants/theme.ts]

**Pitfall de legibilidade:** `RPG.preto` (`#2a2030`) é quase invisível sobre `RPG.surface`
(`#181210`). Usar `RPG.pretoLight` (`#6a5882`) para texto/borda de melhorias cor preta.

---

## Context API — Setters Disponíveis

```typescript
// store/CharacterContext.tsx (linhas 71-72) [VERIFIED]
setInventarioSlot: (idx: number, v: string) => void;
setEquipamentoItem: (slot: keyof Character['equipamentos'], item: EquipItem | null) => void;
```

**Implementação confirmada:**

```typescript
// linha 181-182 (CharacterContext.tsx)
const setInventarioSlot = useCallback((idx: number, v: string) =>
  update(p => { const slots = [...p.inventarioSlots]; slots[idx] = v; return { ...p, inventarioSlots: slots }; }), [update]);

// linha 183-184
const setEquipamentoItem = useCallback((slot: keyof Character['equipamentos'], item: EquipItem | null) =>
  update(p => ({ ...p, equipamentos: { ...p.equipamentos, [slot]: item } })), [update]);
```

Ambos estão em `contextValue` e nos deps do `useMemo`. [VERIFIED: lido de store/CharacterContext.tsx]

### Operações de Craft via setEquipamentoItem

**Adicionar melhoria:**
```typescript
function addMelhoria(slot: SlotKey, label: string) {
  const item = c.equipamentos[slot];
  if (!item || item.melhorias.length >= 3) return;
  setEquipamentoItem(slot, { ...item, melhorias: [...item.melhorias, label] });
}
```

**Remover melhoria (CRAFT-03):**
```typescript
function removeMelhoria(slot: SlotKey, idx: number) {
  const item = c.equipamentos[slot];
  if (!item) return;
  setEquipamentoItem(slot, {
    ...item,
    melhorias: item.melhorias.filter((_, i) => i !== idx),
  });
}
```

**Toggle artefato (ARTE-01):**
```typescript
function toggleTipo(slot: SlotKey) {
  const item = c.equipamentos[slot];
  if (!item) return;
  const novoTipo = item.tipo === 'basico' ? 'artefato' : 'basico';
  setEquipamentoItem(slot, {
    ...item,
    tipo: novoTipo,
    // Limpar campos de artefato ao voltar para básico
    efeito: novoTipo === 'basico' ? undefined : item.efeito,
    durabilidade: novoTipo === 'basico' ? undefined : item.durabilidade,
  });
}
```

[ASSUMED: padrão lógico — não existe implementação prévia de toggleTipo no código]

---

## Architecture Patterns

### System Architecture Diagram

```
c.inventarioSlots[0..19]         c.equipamentos[slot] : EquipItem | null
        |                                    |
        v                                    v
  InventarioGrid                    SlotCard (colapsável — já existe)
  (nova seção em                         |
   mochila.tsx)                   [slotBody expandido]
        |                                   |
  TextInput × 20                  +------------------+
  + clear button                  | craft section    |
        |                         | (melhorias list) |
        v                         | addMelhoria btn  |
setInventarioSlot(idx, v)         | toggle artefato  |
  [CharacterContext]              | efeito/durabil.  |
        |                         +------------------+
        v                                  |
  update() → setAllChars                   v
  debounce 500ms                  setEquipamentoItem(slot, newItem)
        |                                  |
        v                         update() → AsyncStorage
   AsyncStorage                   [debounce 500ms já implementado]
```

### Estrutura de adição ao mochila.tsx

```
mochila.tsx (arquivo existente — apenas adições)
├── imports adicionais: { MELHORIAS_POR_SLOT } from equipamentos.ts
├── funções novas: addMelhoria, removeMelhoria, toggleTipo, editEfeito, editDurabilidade
├── seção nova: <InventarioGrid /> (inline ou componente separado — ver pitfall abaixo)
└── slotBody expandido (existente) — adicionar:
    ├── lista de melhorias com remove button individual
    ├── botão "Adicionar melhoria" (disabled se length >= 3)
    ├── picker de craft (novo modal ou inline list)
    └── toggle "Básico / Artefato" + campos condicionais
```

### Opção A — Picker de Craft como segundo Modal

Criar `crafterSlot: SlotKey | null` análogo a `pickerSlot`. Ao clicar "Adicionar melhoria",
abre modal com lista de 5 melhorias filtradas pelo tipo do slot. Padrão idêntico ao picker
de item já existente.

**Recomendado:** Consistente com o padrão já implementado. Menor risco de layout quebrado.

### Opção B — Lista inline no slotBody

Mostrar as 5 opções diretamente no `slotBody` como botões pequenos. Mais rápido para o
usuário, mas aumenta a altura do card e pode poluir a tela se o usuário abrir múltiplos cards.

**Não recomendado:** O card já tem nome + picker + remover. Adicionar 5 botões inline mais
lista de melhorias aplicadas + toggle artefato + campos extras deixa o card excessivamente
vertical.

---

## Don't Hand-Roll

| Problema | Não construir | Usar existente | Por quê |
|----------|--------------|---------------|---------|
| Stepper numérico para durabilidade | Input manual com +/- | `NumericStepper` (components/rpg/) | Já tem clamp, min, max, estilo RPG |
| Animação collapse do card | Altura animada manual | `LayoutAnimation.configureNext(easeInEaseOut)` | Já usado no mesmo componente |
| Persistência das melhorias | AsyncStorage direto | `setEquipamentoItem` via CharacterContext | Já tem debounce, merge imutável, migrate() |
| Validação de schema de EquipItem | Zod ou assert manual | TypeScript strict — interface garante tipos | Projeto não usa validação em runtime |

---

## Common Pitfalls

### Pitfall 1: Inline component para InventarioGrid causa re-render excessivo

**O que acontece:** Definir `function InventarioGrid()` dentro de `MochilaScreen()` faz React
recriar o componente a cada render do pai — qualquer digitação em qualquer TextInput
(inventario, nome do slot, efeito) re-cria o grid inteiro.

**Por que acontece:** Componentes definidos dentro de outro componente têm identidade nova em
cada render.

**Como evitar:** Ou (a) mover `InventarioGrid` para fora da função `MochilaScreen`, ou (b)
implementar diretamente como JSX inline (sem componente separado) dentro do ScrollView —
ambos evitam o problema. Opção (b) é mais simples e consistente com o padrão já usado no
arquivo (todos os slots são JSX inline, não componentes separados).

### Pitfall 2: `preto` invisível como cor de melhoria

**O que acontece:** `RPG.preto = '#2a2030'` é quase idêntico a `RPG.surface = '#181210'`.
Usar como cor de badge ou borda deixa o elemento invisível.

**Como evitar:** Usar `RPG.pretoLight = '#6a5882'` para elementos de melhoria cor preta.
Para background de badge, usar `RPG.pretoLight` com text `RPG.text`.

### Pitfall 3: `item.melhorias.length >= 3` não verificado antes de push

**O que acontece:** `setEquipamentoItem` não tem guard de capacidade — aceita qualquer array.
Sem guard na função `addMelhoria`, o usuário consegue adicionar mais de 3 melhorias.

**Como evitar:** Guard explícito em `addMelhoria`:
```typescript
if (!item || item.melhorias.length >= 3) return;
```
Além disso, o botão "Adicionar melhoria" deve ficar `disabled` quando `melhorias.length >= 3`.

### Pitfall 4: undefined → 0 em durabilidade no TextInput numérico

**O que acontece:** `EquipItem.durabilidade?: number` começa como `undefined`. Passar `undefined`
para `NumericStepper.value` (prop `number`) causa erro TypeScript e comportamento incorreto.

**Como evitar:** Usar `item.durabilidade ?? 0` ao passar para NumericStepper. Ao salvar,
`onChange: v => editDurabilidade(slot, v)` pode salvar 0 normalmente.

### Pitfall 5: clearSlot não limpa melhorias e efeito

**O que acontece:** A função `clearSlot` existente chama `setEquipamentoItem(slot, null)` —
isso resolve corretamente (null significa slot vazio). Mas se o usuário fizer "Remover item"
com melhorias salvas, o slot vira null e as melhorias somem. Isso é o comportamento CORRETO
(remover item remove tudo). Não é um bug, mas o planner deve verificar se isso é intencional.

**[ASSUMED: comportamento esperado pelo design — se remover o item, melhorias vão junto]**

### Pitfall 6: acessorio1 e acessorio2 têm melhorias idênticas

**O que acontece:** O livro define uma única categoria "Acessórios" para ambos os slots.
A constante `MELHORIAS_POR_SLOT` terá `acessorio1` e `acessorio2` com arrays idênticos.

**Como evitar:** Declarar o array uma vez e referenciar nas duas chaves, ou simplesmente
duplicar (5 itens cada — custo mínimo). O planner deve escolher — recomendo duplicar para
clareza de código.

---

## Code Examples

### Padrão de exibição de slot card expandido (existente em mochila.tsx)

```typescript
// app/(tabs)/mochila.tsx — slotBody já existente (linhas 137-164) [VERIFIED]
{isExpanded && (
  <View style={styles.slotBody}>
    <TextInput
      style={styles.nomeInput}
      value={item?.nome ?? ''}
      onChangeText={v => editNome(slot, v)}
      placeholder="Nome personalizado..."
      placeholderTextColor={RPG.textDark}
    />
    <TouchableOpacity style={styles.pickerBtn} onPress={() => setPickerSlot(slot)}>
      <Text style={styles.pickerBtnText}>Escolher do livro</Text>
    </TouchableOpacity>
    {item != null && (
      <TouchableOpacity style={styles.clearBtn} onPress={() => clearSlot(slot)}>
        <Text style={styles.clearBtnText}>Remover item</Text>
      </TouchableOpacity>
    )}
  </View>
)}
```

Phase 14 expande este `slotBody` — adiciona abaixo do clearBtn.

### Padrão de grid com FlatList

```typescript
// Padrão React Native — sem lib externa [ASSUMED: padrão RN documentado]
<FlatList
  data={c.inventarioSlots}
  numColumns={2}
  keyExtractor={(_, idx) => String(idx)}
  scrollEnabled={false}  // ScrollView pai já gerencia scroll
  renderItem={({ item: slotValue, index }) => (
    <View style={styles.invCell}>
      <TextInput
        style={styles.invInput}
        value={slotValue}
        onChangeText={v => setInventarioSlot(index, v)}
        placeholder={`${index + 1}`}
        placeholderTextColor={RPG.textDark}
      />
      {slotValue.trim() !== '' && (
        <TouchableOpacity onPress={() => setInventarioSlot(index, '')}>
          <Text style={styles.invClear}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  )}
/>
```

**Alternativa sem FlatList** (mais simples, 20 itens é pequeno):
```typescript
// Array de pares — duas células por row
{Array.from({ length: 10 }, (_, row) => (
  <View key={row} style={styles.invRow}>
    {[row * 2, row * 2 + 1].map(idx => (
      <View key={idx} style={styles.invCell}>
        <TextInput
          value={c.inventarioSlots[idx]}
          onChangeText={v => setInventarioSlot(idx, v)}
          placeholder={`${idx + 1}`}
          placeholderTextColor={RPG.textDark}
          style={styles.invInput}
        />
        {c.inventarioSlots[idx].trim() !== '' && (
          <TouchableOpacity onPress={() => setInventarioSlot(idx, '')}>
            <Text style={styles.invClear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    ))}
  </View>
))}
```

[ASSUMED: padrão React Native manual — não verificado em Context7, mas padrão universal]

### Badge de melhoria com cor

```typescript
// Exemplo de exibição de melhoria no slotHeader/slotBody [ASSUMED: padrão de design]
const COR_TOKEN: Record<MelhoriaItem['cor'], string> = {
  branco:   RPG.branco,
  verde:    RPG.verde,
  vermelho: RPG.vermelho,
  preto:    RPG.pretoLight,  // NÃO usar RPG.preto — invisível no fundo
  azul:     RPG.azul,
};

// Badge inline
<View style={[styles.melhoriaBadge, { borderColor: COR_TOKEN[cor] }]}>
  <Text style={[styles.melhoriaLabel, { color: COR_TOKEN[cor] }]}>{label}</Text>
</View>
```

### Campos de artefato condicionais

```typescript
// Dentro do slotBody expandido, após clearBtn
{item != null && (
  <>
    {/* Toggle Artefato */}
    <TouchableOpacity
      style={[styles.tipoToggle, item.tipo === 'artefato' && styles.tipoToggleActive]}
      onPress={() => toggleTipo(slot)}
    >
      <Text style={styles.tipoToggleText}>
        {item.tipo === 'basico' ? 'Básico' : 'Artefato ✦'}
      </Text>
    </TouchableOpacity>

    {/* Campos extras — só modo artefato */}
    {item.tipo === 'artefato' && (
      <>
        <TextInput
          style={styles.nomeInput}
          value={item.efeito ?? ''}
          onChangeText={v => setEquipamentoItem(slot, { ...item, efeito: v })}
          placeholder="Efeito ativável..."
          placeholderTextColor={RPG.textDark}
          multiline
        />
        <NumericStepper
          label="Durabilidade"
          value={item.durabilidade ?? 0}
          onChange={v => setEquipamentoItem(slot, { ...item, durabilidade: v })}
          min={0}
          compact
        />
      </>
    )}
  </>
)}
```

[ASSUMED: estrutura de toggle e campos — padrão baseado no que já existe no slotBody]

---

## State of the Art

| Abordagem Antiga | Abordagem Atual no Projeto | Impacto para Phase 14 |
|-----------------|---------------------------|----------------------|
| `inventario: string` (campo único) | `inventarioSlots: string[]` (20 slots) | Grid já preparado pelo schema; só UI falta |
| `setEquipamento(k, string)` | `setEquipamentoItem(slot, EquipItem \| null)` | Craft e artefato via spread do objeto existente |
| `melhorias: MelhoriaRow[]` (2 tipos, texto plano) | `MELHORIAS_POR_SLOT` (nova constante necessária) | Planner cria essa constante como Task 1 |

---

## Assumptions Log

| # | Claim | Section | Risco se Errado |
|---|-------|---------|-----------------|
| A1 | Labels de melhoria derivados de REQUIREMENTS.md CRAFT-02 refletem exatamente o livro físico | Data Structures §3 | Textos errados → CRAFT-02 falha na verificação com o livro |
| A2 | `clearSlot(slot)` nulificando o EquipItem inteiro (incluindo melhorias) é comportamento desejado | Pitfall 5 | Se desejado preservar melhorias ao remover nome do item, a lógica muda |
| A3 | `toggleTipo` limpa `efeito` e `durabilidade` ao voltar para 'basico' | Code Examples | Se desejado preservar para undo acidental, manter os campos mesmo em modo básico |
| A4 | FlatList `scrollEnabled={false}` dentro do ScrollView pai funciona sem janking no Android | Code Examples | Se problemático, usar array manual de pares (alternativa já documentada) |
| A5 | `RPG.pretoLight` (`#6a5882`) é legível sobre `RPG.surface` como cor de melhoria preta | Data Structures §4 | Pode ainda ser escuro demais — testar em device; alternativa: `RPG.textMuted` (`#a89070`) |

---

## Open Questions

1. **Labels de vestimenta com múltiplas opções por cor**
   - O que sabemos: REQUIREMENTS.md CRAFT-02 lista `'Armadura+1/Diplomacia+1/Esgrima+1'` como uma única melhoria branca de vestimenta
   - O que está incerto: Se é um único item chamado assim (três benefícios em um), ou se o usuário escolhe um dos três
   - Recomendação: Tratar como label único (uma melhoria com nome composto) — o jogador sabe que o livro dá os três benefícios juntos

2. **Ordem das seções em mochila.tsx**
   - O que sabemos: A tela tem "Equipamentos" no topo. Inventário deve ir abaixo ou acima?
   - Recomendação: Inventário abaixo dos Equipamentos — sequência lógica do uso durante a sessão (equipa → verifica inventário)

3. **Melhorias visíveis no slotHeader colapsado**
   - EQP-03 já entregue: card colapsado mostra `{item.melhorias.length} melh.`. Phase 14 pode manter esse badge ou exibir as badges coloridas inline no header colapsado
   - Recomendação: Manter o texto `X melh.` — menos risco de quebra de layout no header estreito

---

## Environment Availability

> Fase é puramente de UI/código — sem dependências externas além do projeto em execução. Seção N/A.

---

## Validation Architecture

`workflow.nyquist_validation: true` em config.json — seção obrigatória.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Nenhum framework de teste instalado no projeto |
| Config file | Não existe (jest.config, vitest.config ausentes) |
| Quick run command | `npx tsc --noEmit` (compilação TypeScript como proxy de sanidade) |
| Full suite command | `npx tsc --noEmit && grep -c 'MELHORIAS_POR_SLOT' data/regras/equipamentos.ts` |

**Obs:** O projeto defere testes automatizados para v2 (STATE.md deferred items). O gate de
verificação padrão do projeto é `npx tsc --noEmit exit 0` + smoke test manual.

### Phase Requirements → Test Map

| Req ID | Comportamento | Tipo | Comando Automatizado | Arquivo |
|--------|------------|------|---------------------|---------|
| INV-01 | `inventarioSlots` tem 20 elementos, mochila.tsx renderiza grid | grep | `grep -c "inventarioSlots" app/(tabs)/mochila.tsx` >= 1 | Existe após implementação |
| INV-02 | Botão clear individual por slot | grep | `grep -c "setInventarioSlot" app/(tabs)/mochila.tsx` >= 1 | Existe após implementação |
| CRAFT-01 | Guard `melhorias.length < 3` presente | grep | `grep -c "melhorias.length" app/(tabs)/mochila.tsx` >= 1 | Existe após implementação |
| CRAFT-02 | `MELHORIAS_POR_SLOT` existe em equipamentos.ts | grep | `grep -c "MELHORIAS_POR_SLOT" data/regras/equipamentos.ts` >= 1 | Existe após Task 1 |
| CRAFT-03 | removeMelhoria usa filter imutável | grep | `grep -c "filter" app/(tabs)/mochila.tsx` >= 1 | Existe após implementação |
| ARTE-01 | Toggle tipo e campos condicionais | grep | `grep -c "artefato" app/(tabs)/mochila.tsx` >= 2 | Existe após implementação |
| Gate | TypeScript sem erros | compile | `npx tsc --noEmit` exit 0 | — |

### Wave 0 Gaps

- [ ] Nenhum arquivo de teste a criar — projeto defere testes para v2
- [ ] `npx tsc --noEmit` deve continuar em exit 0 após cada task
- [ ] Greps de verificação listados acima são os critérios de done por task

---

## Security Domain

Esta fase é local-only, sem network, sem auth, sem input de terceiros. ASVS não aplicável.
`security_enforcement` não definido explicitamente — mas o risco é mínimo: apenas TextInput
e TouchableOpacity em dados locais.

---

## Sources

### Primary (HIGH confidence)
- `types/character.ts` — EquipItem interface, inventarioSlots, defaultCharacter
- `store/CharacterContext.tsx` — setInventarioSlot, setEquipamentoItem, update() pattern
- `app/(tabs)/mochila.tsx` — slotBody pattern, LayoutAnimation, pickItem/clearSlot/editNome
- `data/regras/equipamentos.ts` — melhorias existente (gap confirmado: 2 tipos, texto plano)
- `constants/theme.ts` — todos os tokens RPG de cor
- `.planning/REQUIREMENTS.md` — CRAFT-02 lista completa de melhorias por tipo e cor
- `.planning/phases/12-schema-migration/12-01-SUMMARY.md` — provenance de EquipItem e setters
- `.planning/phases/13-mochila-slots/13-01-SUMMARY.md` — provenance de MochilaScreen e patterns

### Secondary (MEDIUM confidence)
- N/A — toda pesquisa desta fase foi inteiramente no codebase local

### Tertiary (LOW confidence / Assumed)
- Padrão FlatList `numColumns={2}` — training knowledge, não verificado em Context7

---

## Metadata

**Confidence breakdown:**
- Schema e Context API: HIGH — lido diretamente dos arquivos
- Dados de melhorias (MELHORIAS_POR_SLOT): MEDIUM — derivado de REQUIREMENTS.md (fonte autoritativa do projeto, não do livro físico)
- Padrões de UI/layout: HIGH — baseado em código existente em mochila.tsx
- Labels de melhoria (texto exato): ASSUMED — requerem confirmação contra o livro físico

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (schema estável, sem libs externas que possam mudar)
