# Phase 13: Aba Mochila & Slots de Equipamento — Research

**Researched:** 2026-05-17
**Domain:** Expo Router tab navigation, React Native Modal picker, RPG UI cards colapsáveis
**Confidence:** HIGH

---

## Summary

Phase 13 é uma fase de UI pura. O schema já existe (Phase 12 entregou `EquipItem`, `setEquipamentoItem`, `inventarioSlots`). Não há novos pacotes para instalar. O trabalho é: (1) criar `app/(tabs)/mochila.tsx`, (2) registrá-la no `_layout.tsx` com o padrão exato dos 5 tabs existentes, e (3) construir 5 cards de slot de equipamento interativos com picker modal usando o padrão estabelecido em `ProficienciasSection`.

A questão do slot `armadura` — carry-forward da Phase 12 — precisa ser resolvida aqui: EQP-01 especifica 5 slots (Arma, Escudo, Vestimenta, Acessório 1, Acessório 2). O slot `armadura` no schema NÃO deve ser exposto na UI da Mochila. Ele permanece no schema para compatibilidade de migração, mas fica oculto.

O padrão para picker modal existe completamente em `ProficienciasSection.tsx`: `Modal` fullscreen com `SafeAreaView`, `TextInput` de busca, `ScrollView` com lista de opções, `TouchableOpacity` para selecionar. O padrão para modal bottom-sheet existe em `magia.tsx` (spell detail: `transparent animationType="slide"` com `justifyContent: 'flex-end'`). Para o picker de equipamentos a abordagem fullscreen do `ProficienciasSection` é a mais adequada — a lista pode ser longa.

O padrão para nome personalizado já está mapeado: campo `TextInput` inline ou editável no card expandido. MOCH-02 (remover Inventário/Equipamentos da Magia) já foi satisfeito pela Phase 12 — zero trabalho adicional nesse ponto.

**Recomendação primária:** Uma tela (`mochila.tsx`) com `ScrollView`, um `SectionHeader` "Equipamentos", 5 `EquipSlotCard` components (inline ou em arquivo separado), cada um com estado collapsed/expanded, picker modal fullscreen (padrão ProficienciasSection), campo de nome custom, e exibição de melhorias em estado colapsado. Adicionar a tab em `_layout.tsx` com ícone `backpack` do MaterialIcons.

---

<phase_requirements>
## Phase Requirements

| ID | Descrição | Suporte da Research |
|----|-----------|---------------------|
| MOCH-01 | Nova aba "Mochila" aparece na tab bar e navega sem erros | Padrão `_layout.tsx` verificado — adicionar `Tabs.Screen name="mochila"` + criar o arquivo |
| MOCH-02 | Aba Magia não exibe mais Inventário e Equipamentos | JA SATISFEITO pela Phase 12 (Task 3 de 12-01) — verificado em magia.tsx |
| EQP-01 | Picker com lista do livro para cada slot (5 slots) | `data/regras/equipamentos.ts` exporta `armas[]`, `escudos[]`, `vestimentas[]`, `acessorios[]` — fonte verificada |
| EQP-02 | Nome personalizado em qualquer slot | `EquipItem.nome: string` já tipado; `TextInput` editável dentro do card |
| EQP-03 | Card colapsado exibe nome do item + quantidade de melhorias | `item.nome` + `item.melhorias.length` — ambos disponíveis no EquipItem |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Tab registration | Frontend (Expo Router `_layout.tsx`) | — | Expo Router descobre tabs por arquivo + registro em `_layout.tsx` |
| Tela Mochila (scroll container) | Frontend (`app/(tabs)/mochila.tsx`) | — | Arquivo de tela, mesmo padrão das outras abas |
| EquipSlotCard (UI colapsável) | Frontend (componente inline ou `components/rpg/`) | — | Componente de UI puro, sem lógica de negócio |
| Picker Modal (lista do livro) | Frontend (Modal inside mochila.tsx ou componente próprio) | — | Estado `activeSlot` local, sem efeito de persistência |
| Persistência da seleção | Store (`CharacterContext.setEquipamentoItem`) | — | Já implementado na Phase 12 |
| Fonte de dados do picker | Data (`data/regras/equipamentos.ts`) | — | Arrays tipados já existem para cada slot |

---

## Standard Stack

### Core (zero pacotes novos)

| Arquivo/Lib | Versão | Propósito | Por que padrão |
|-------------|--------|-----------|----------------|
| `expo-router` Tabs | já instalado | Tab navigation, descoberta automática de arquivos | Padrão do projeto — 5 tabs já funcionam assim |
| `@expo/vector-icons/MaterialIcons` | já instalado | Ícone da tab "Mochila" | Já usado em `icon-symbol.tsx` para todas as tabs |
| `react-native` Modal | built-in RN | Picker fullscreen de itens do livro | Usado em `magia.tsx` e `ProficienciasSection.tsx` |
| `react-native-safe-area-context` | já instalado | SafeAreaView no modal fullscreen | Padrão do projeto para modais |
| `CharacterContext` (`setEquipamentoItem`) | Phase 12 | Persistir seleção do slot | Setter tipado já existe |
| `data/regras/equipamentos.ts` | — | Listas de itens por slot para o picker | Já exporta `armas[]`, `escudos[]`, `vestimentas[]`, `acessorios[]` |
| `constants/theme.ts` RPG | — | Tokens de cor/tipografia | Único sistema de design do projeto |

**Nenhum pacote npm precisa ser instalado.** [VERIFIED: codebase inspection]

---

## Package Legitimacy Audit

Nenhum pacote externo é instalado nesta fase.

**Pacotes removidos por slopcheck [SLOP]:** nenhum
**Pacotes flagged [SUS]:** nenhum

---

## Architecture Patterns

### System Architecture Diagram

```
Usuário toca tab "Mochila"
        |
        v
app/(tabs)/mochila.tsx (ScrollView)
        |
        ├── SectionHeader "Equipamentos"
        |
        ├── EquipSlotCard[arma]      ─┐
        ├── EquipSlotCard[escudo]    ─┤  cada card:
        ├── EquipSlotCard[vestimenta]─┤  collapsed: nome + count melhorias
        ├── EquipSlotCard[acessorio1]─┤  expanded: TextInput nome + botão picker
        └── EquipSlotCard[acessorio2]─┘  picker: abre Modal fullscreen
                                              |
                                              v
                                    Modal (fullscreen, animationType="slide")
                                       SafeAreaView
                                         ├── Header com título + fechar
                                         ├── TextInput busca (opcional)
                                         └── ScrollView com lista de itens
                                                 |
                                                 v (onPress item)
                                    setEquipamentoItem(slot, {
                                      nome: item.nome,
                                      tipo: 'basico',
                                      melhorias: prev?.melhorias ?? []
                                    })
                                                 |
                                                 v
                                    CharacterContext → AsyncStorage (debounced 500ms)
```

### Recommended Project Structure

```
app/(tabs)/
└── mochila.tsx           # nova tela — tudo inline (cards simples, sem componente separado)

components/rpg/           # somente se card for reutilizado na Phase 14
└── EquipSlotCard.tsx     # opcional — decidir no plano

constants/
└── theme.ts              # sem mudanças

components/ui/
└── icon-symbol.tsx       # adicionar mapeamento 'bag' ou 'briefcase.fill' → MaterialIcons
```

### Pattern 1: Adicionar Tab em _layout.tsx

**O que:** Adicionar `<Tabs.Screen>` + criar arquivo correspondente em `app/(tabs)/`.

**Quando usar:** Qualquer nova aba no projeto.

**Exemplo (padrão existente verificado):**
```typescript
// Source: app/(tabs)/_layout.tsx — padrão das 5 tabs existentes
<Tabs.Screen
  name="mochila"
  options={{
    title: 'Mochila',
    tabBarIcon: ({ color }) => <IconSymbol size={26} name="bag.fill" color={color} />,
  }}
/>
```

**Adicionalmente:** o mapeamento do ícone precisa ser inserido em `components/ui/icon-symbol.tsx`:
```typescript
// Adicionar ao MAPPING:
'bag.fill': 'backpack',   // MaterialIcons tem 'backpack'
```

[VERIFIED: icon-symbol.tsx — MAPPING é um Record TypeScript, adição direta]

### Pattern 2: EquipSlotCard colapsável (baseado em regras.tsx Section)

**O que:** Card com estado `collapsed/expanded`. Colapsado mostra nome e contagem. Expandido mostra TextInput de nome custom + botão "Escolher do livro".

**Quando usar:** Cada um dos 5 slots de equipamento.

**Padrão de referência (regras.tsx Section com LayoutAnimation):**
```typescript
// Source: app/(tabs)/regras.tsx — Section colapsável com LayoutAnimation
const [open, setOpen] = useState(false);
const toggle = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setOpen(v => !v);
};
```

**Card colapsado deve mostrar:**
- Label do slot (ex.: "ARMA") uppercase goldDim
- Nome do item (`item?.nome ?? 'Vazio'`) — gold se preenchido, textDark se vazio
- Contagem de melhorias: `${item?.melhorias.length ?? 0} melhorias` — apenas se item presente

**Card expandido deve mostrar:**
- TextInput para nome personalizado (edita `item.nome` via `setEquipamentoItem`)
- Botão "Escolher do livro" → abre modal picker
- (melhorias são Phase 14 — NÃO incluir aqui)

### Pattern 3: Modal picker fullscreen (padrão ProficienciasSection)

**O que:** `Modal` com `animationType="slide"` fullscreen (não bottom-sheet), `SafeAreaView`, header com título e botão fechar, `ScrollView` com lista de itens tocáveis.

**Quando usar:** Picker de itens do livro por slot.

**Padrão completo verificado em ProficienciasSection.tsx:**
```typescript
// Source: components/rpg/ProficienciasSection.tsx

// Estado
const [activeSlot, setActiveSlot] = useState<keyof Character['equipamentos'] | null>(null);

// Modal
<Modal visible={activeSlot !== null} animationType="slide" onRequestClose={closeModal}>
  <SafeAreaView style={styles.modal}>
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>Escolher {SLOT_LABEL[activeSlot]}</Text>
      <TouchableOpacity onPress={closeModal} hitSlop={12}>
        <Text style={styles.modalClose}>✕</Text>
      </TouchableOpacity>
    </View>
    <ScrollView keyboardShouldPersistTaps="handled">
      {getItemsForSlot(activeSlot).map(item => (
        <TouchableOpacity key={item} onPress={() => pick(activeSlot, item)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </SafeAreaView>
</Modal>
```

[VERIFIED: components/rpg/ProficienciasSection.tsx]

### Pattern 4: Leitura das listas do livro por slot

**O que:** Mapear slot key → array de nomes de itens de `data/regras/equipamentos.ts`.

**Mapeamento verificado:**

```typescript
// Source: data/regras/equipamentos.ts — armas[], escudos[], vestimentas[], acessorios[]

const SLOT_ITEMS: Record<keyof Character['equipamentos'], string[]> = {
  arma:       armas.map(r => r.arma),
  escudo:     escudos.map(r => r.escudo),
  vestimenta: vestimentas.map(r => r.vestimenta),
  acessorio1: acessorios.map(r => r.acessorio),
  acessorio2: acessorios.map(r => r.acessorio),
  armadura:   [],   // slot oculto — não exposto na UI
};
```

Contagens verificadas: `armas` = 13 itens, `escudos` = 3, `vestimentas` = 6, `acessorios` = 5.

[VERIFIED: data/regras/equipamentos.ts]

### Pattern 5: Edição de nome custom com setEquipamentoItem

**O que:** `TextInput` que edita o campo `nome` de um `EquipItem` sem apagar `tipo` e `melhorias`.

**Padrão:**
```typescript
// Ao confirmar nome custom:
const item = c.equipamentos[slot];
setEquipamentoItem(slot, {
  nome: novoNome,
  tipo: item?.tipo ?? 'basico',
  melhorias: item?.melhorias ?? [],
  efeito: item?.efeito,
  durabilidade: item?.durabilidade,
});
```

[VERIFIED: store/CharacterContext.tsx — setEquipamentoItem(slot, item: EquipItem | null)]

### Anti-Patterns a Evitar

- **Criar a tab sem registrar em `_layout.tsx`:** Expo Router descobre automaticamente arquivos em `app/(tabs)/`, mas sem `<Tabs.Screen name="mochila">` o tab item não aparece na barra. Ambas as etapas são obrigatórias.
- **Usar `explore` como template:** `explore` tem `href: null` que o oculta da tab bar — não é um exemplo de tab visível.
- **Expor o slot `armadura` na UI:** EQP-01 especifica 5 slots. `armadura` existe no schema por compatibilidade de migração. Deve ser incluído no `SLOT_ITEMS` map com array vazio e nunca renderizado como card.
- **Usar bottom-sheet modal para o picker:** A lista de armas tem 13 itens com detalhes (`dano`, `especial`). Bottom-sheet (`justifyContent: 'flex-end'`, `maxHeight: '80%'`) limita o espaço. O picker fullscreen de `ProficienciasSection` é o padrão correto para listas longas com contexto.
- **Editar `item.nome` sobrescrevendo `melhorias`:** O setter `setEquipamentoItem` recebe um `EquipItem | null` completo. Sempre preserve `melhorias` existentes ao editar só o nome — Phase 14 precisa desses dados.
- **`LayoutAnimation` sem import correto:** `LayoutAnimation` vem de `react-native` diretamente, não de `expo-*`.

---

## Don't Hand-Roll

| Problema | Não Construir | Usar em vez disso | Por quê |
|----------|---------------|-------------------|---------|
| Picker de itens do livro | Lista custom com estado complexo | Modal + ScrollView + TouchableOpacity (padrão ProficienciasSection) | Padrão já validado no projeto, funciona com teclado persistente |
| Ícone da tab | Imagem custom ou SVG | `MaterialIcons 'backpack'` via `IconSymbol` | Sistema de ícones já configurado; Android/iOS consistente |
| Animação de colapso | `Animated.timing` manual | `LayoutAnimation.configureNext(easeInEaseOut)` | Padrão já usado em regras.tsx para seções colapsáveis |
| Persistência | AsyncStorage direto | `setEquipamentoItem` do CharacterContext | Debounce já implementado; race condition já resolvido |

**Insight chave:** Toda infraestrutura (schema, setters, dados, modal pattern, collapse pattern) já existe. Esta fase é montagem de peças existentes, não invenção.

---

## Decisão: slot `armadura`

**Contexto:** Phase 12 manteve `armadura` no schema (6 slots). EQP-01 especifica 5 slots. O SUMMARY da Phase 12 diz explicitamente: "Phase 13 must resolve whether to expose the armadura slot in the Mochila UI".

**Decisão para o planner:** NÃO expor `armadura` na UI da Mochila. O schema permanece com 6 slots para compatibilidade (não requer migrate() adicional). O `SLOT_ITEMS.armadura = []` e nenhum card é renderizado para ele.

**Justificativa:** REQUIREMENTS.md EQP-01 é explícito em 5 slots. Adicionar `armadura` como 6º slot seria divergência do requisito sem aprovação do usuário.

---

## Decisão: MOCH-02 já satisfeita

**Status verificado:** `app/(tabs)/magia.tsx` foi inspecionado. As seções "INVENTÁRIO" e "EQUIPAMENTOS" foram removidas pela Phase 12 (Task 3, commit `ef41607`). O arquivo atual não contém `setInventario`, `setEquipamento`, nem os blocos JSX correspondentes.

**Para o planner:** MOCH-02 está satisfeito. Não há trabalho de remoção a fazer. O plano pode ignorar essa etapa ou incluir uma task de verificação com `grep` para confirmar.

---

## Common Pitfalls

### Pitfall 1: Ícone da tab não mapeado em icon-symbol.tsx

**O que dá errado:** `IconSymbol` usa um `MAPPING` TypeScript estático. Se `'bag.fill'` não estiver no MAPPING, o TypeScript levanta erro de tipo em `_layout.tsx`.

**Por que acontece:** Cada ícone novo precisa ser adicionado explicitamente ao `MAPPING` em `components/ui/icon-symbol.tsx`.

**Como evitar:** Adicionar `'bag.fill': 'backpack'` ao MAPPING antes de usar em `_layout.tsx`. MaterialIcons tem o ícone `backpack` disponível.

**Sinais de alerta:** `tsc --noEmit` com erro "Type '"bag.fill"' is not assignable to type 'IconSymbolName'".

### Pitfall 2: Tab não aparece na barra apesar do arquivo existir

**O que dá errado:** Criar `mochila.tsx` sem adicionar `<Tabs.Screen name="mochila">` no `_layout.tsx` resulta em tab descoberta pelo Expo Router mas sem configuração de título/ícone — ou aparece com defaults indesejados.

**Por que acontece:** Expo Router auto-descobre arquivos mas não injeta configuração de tab bar automaticamente.

**Como evitar:** Sempre adicionar o `<Tabs.Screen>` no `_layout.tsx` na mesma task de criação do arquivo.

**Sinais de alerta:** Tab aparece sem ícone ou com nome de arquivo como título.

### Pitfall 3: Nome custom apaga melhorias existentes

**O que dá errado:** Se o card editar `nome` e chamar `setEquipamentoItem(slot, { nome: v, tipo: 'basico', melhorias: [] })`, as melhorias adicionadas pela Phase 14 serão perdidas quando o usuário editar o nome.

**Por que acontece:** `setEquipamentoItem` substitui o `EquipItem` inteiro. É um setter de substituição, não patch.

**Como evitar:** Sempre ler o item atual antes de escrever: `const prev = c.equipamentos[slot]; setEquipamentoItem(slot, { ...prev, nome: v })`.

**Sinais de alerta:** Melhorias somem após editar nome do item (bug latente visível só após Phase 14).

### Pitfall 4: `KeyboardAvoidingView` esquecido na tela Mochila

**O que dá errado:** O TextInput de nome custom fica oculto pelo teclado virtual em iOS.

**Por que acontece:** `magia.tsx` (padrão de referência) usa `KeyboardAvoidingView` com `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`. Omitir isso na nova tela causa o problema.

**Como evitar:** Usar exatamente o mesmo wrapper `KeyboardAvoidingView` de `magia.tsx`.

### Pitfall 5: `explore` oculto não precisa ser removido

**O que dá errado:** Desenvolvedor remove `<Tabs.Screen name="explore" options={{ href: null }} />` do `_layout.tsx` por parecer desnecessário. Isso pode fazer o arquivo `explore.tsx` aparecer como tab ativa.

**Por que acontece:** `href: null` é a forma correta de registrar uma rota sem aparecer na tab bar.

**Como evitar:** Não mexer na entrada `explore`. Apenas adicionar `mochila` ao `_layout.tsx`.

---

## Code Examples

### Adicionar tab em _layout.tsx

```typescript
// Source: app/(tabs)/_layout.tsx — padrão das 5 tabs existentes (verificado)
// Inserir ANTES de <Tabs.Screen name="explore" options={{ href: null }} />

<Tabs.Screen
  name="mochila"
  options={{
    title: 'Mochila',
    tabBarIcon: ({ color }) => <IconSymbol size={26} name="bag.fill" color={color} />,
  }}
/>
```

### Adicionar mapeamento de ícone

```typescript
// Source: components/ui/icon-symbol.tsx — MAPPING existente (verificado)
const MAPPING = {
  // ...existentes...
  'bag.fill': 'backpack',   // adicionar esta linha
} as IconMapping;
```

### Estrutura básica de mochila.tsx (scaffold)

```typescript
// Baseado no padrão de magia.tsx (verificado)
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Modal,
         TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCharacter } from '@/store/CharacterContext';
import { RPG } from '@/constants/theme';
import SectionHeader from '@/components/rpg/SectionHeader';
import { EquipItem } from '@/types/character';
import { armas, escudos, vestimentas, acessorios } from '@/data/regras/equipamentos';

const SLOT_LABELS: Record<string, string> = {
  arma: 'Arma',
  escudo: 'Escudo',
  vestimenta: 'Vestimenta',
  acessorio1: 'Acessório 1',
  acessorio2: 'Acessório 2',
};

const SLOT_ITEMS: Record<string, string[]> = {
  arma:       armas.map(r => r.arma),
  escudo:     escudos.map(r => r.escudo),
  vestimenta: vestimentas.map(r => r.vestimenta),
  acessorio1: acessorios.map(r => r.acessorio),
  acessorio2: acessorios.map(r => r.acessorio),
};

const SLOT_KEYS = ['arma', 'escudo', 'vestimenta', 'acessorio1', 'acessorio2'] as const;
type SlotKey = typeof SLOT_KEYS[number];

export default function MochilaScreen() {
  const { character: c, setEquipamentoItem, isLoaded } = useCharacter();
  const [pickerSlot, setPickerSlot] = useState<SlotKey | null>(null);
  const [expandedSlot, setExpandedSlot] = useState<SlotKey | null>(null);

  if (!isLoaded) return <ActivityIndicator size="large" color={RPG.gold} style={{ flex: 1, backgroundColor: RPG.bg }} />;

  const pickItem = (slot: SlotKey, nome: string) => {
    const prev = c.equipamentos[slot];
    setEquipamentoItem(slot, {
      nome,
      tipo: prev?.tipo ?? 'basico',
      melhorias: prev?.melhorias ?? [],
    });
    setPickerSlot(null);
  };

  const clearSlot = (slot: SlotKey) => setEquipamentoItem(slot, null);

  const editNome = (slot: SlotKey, nome: string) => {
    const prev = c.equipamentos[slot];
    if (!prev) return;
    setEquipamentoItem(slot, { ...prev, nome });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.titleBar}>
            <Text style={styles.title}>Mochila</Text>
          </View>

          <SectionHeader title="Equipamentos" />

          {SLOT_KEYS.map(slot => {
            const item = c.equipamentos[slot];
            const isExpanded = expandedSlot === slot;
            // ... card JSX
          })}
        </ScrollView>

        {/* Picker Modal */}
        <Modal visible={pickerSlot !== null} animationType="slide" onRequestClose={() => setPickerSlot(null)}>
          <SafeAreaView style={styles.modal}>
            {/* header + lista */}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
```

### Card de slot colapsado/expandido (lógica central)

```typescript
// Padrão collapsed → mostrar nome + contagem melhorias
// Padrão expanded → TextInput nome + botão picker

<TouchableOpacity
  style={[styles.slotCard, item && styles.slotCardFilled]}
  onPress={() => setExpandedSlot(isExpanded ? null : slot)}
  activeOpacity={0.8}
>
  {/* collapsed header — sempre visível */}
  <View style={styles.slotHeader}>
    <Text style={styles.slotLabel}>{SLOT_LABELS[slot].toUpperCase()}</Text>
    <Text style={[styles.slotNome, !item && styles.slotNomeEmpty]}>
      {item?.nome ?? 'Vazio'}
    </Text>
    {item && item.melhorias.length > 0 && (
      <Text style={styles.slotMelhorias}>{item.melhorias.length} melh.</Text>
    )}
    <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
  </View>

  {/* expanded body */}
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
      {item && (
        <TouchableOpacity style={styles.clearBtn} onPress={() => clearSlot(slot)}>
          <Text style={styles.clearBtnText}>Remover item</Text>
        </TouchableOpacity>
      )}
    </View>
  )}
</TouchableOpacity>
```

---

## Dados do Picker por Slot

### armas[] — 13 itens verificados

| Nome | Dano | Especial |
|------|------|---------|
| Adaga | 1d4 | REF · Esg[Leve]/Pont[Arremesso] |
| Arco Curto | 1d6 | REF · Pont[Arcos] |
| Arco Longo | 1d8 | FOR · Pont[Arcos] |
| Bastão Curto | 1d4* | FOR/REF · AM |
| Bastão Longo | 1d6* | FOR/REF · AM |
| Cajado | 1d6 | RAZ/PRE · Pont[Condutores] |
| Desarmado | 1d3* | FOR · AM |
| Espada | 1d6 | FOR · Esg[Uma Mão] |
| Lança Curta | 1d6 | REF · Esg[Uma Mão] |
| Lança Longa | 1d10 | REF · Esg[Duas Mãos] |
| Machado | 1d6 | FOR · Esg[Leve] |
| Montante | 1d12 | FOR · Esg[Duas Mãos] |
| Varinha | 1d4 | RAZ/PRE · Pont[Condutores] |

[VERIFIED: data/regras/equipamentos.ts]

### Consideração: exibir metadados no picker

O picker de Arma pode exibir `dano` e `especial` como segunda linha (padrão `domainSpellMeta` de magia.tsx). Isso ajuda o jogador a escolher. Para Escudo exibir `ipCorp + especial`. Para Vestimenta exibir IPs. Para Acessório exibir `bonus`. Isso enriquece a UX sem custo de dados.

---

## State of the Art

| Abordagem Antiga | Abordagem Atual | Quando Mudou | Impacto |
|------------------|-----------------|--------------|---------|
| Equipamentos inline em magia.tsx como TextInput simples | Cards de slot dedicados na aba Mochila | Phase 13 | UI separada, interação rica com picker |
| `equipamentos.arma: string` | `equipamentos.arma: EquipItem \| null` | Phase 12 | Picker pode selecionar nome + preservar melhorias |
| Inventário em magia.tsx | Removido de magia.tsx (Phase 12) | Phase 12 | Preparado para mochila.tsx |

**Deprecated/outdated após Phase 12 (já feito):**
- Renderização de Equipamentos em `magia.tsx` — removida (commit `ef41607`)
- `setEquipamento(k, v: string)` — removido do context

---

## Assumptions Log

| # | Claim | Section | Risco se errado |
|---|-------|---------|-----------------|
| A1 | `MaterialIcons` tem o ícone `backpack` disponível | Code Examples | Precisaria escolher ícone diferente (ex.: `luggage`, `inventory-2`) |
| A2 | O slot `armadura` não deve ser exposto na UI (decisão baseada em EQP-01) | Decisão armadura | Se o usuário quiser 6 slots, requer ajuste no plano |
| A3 | Card colapsável inline (não componente separado) é suficiente para Phase 13 | Architecture Patterns | Se Phase 14 reutilizar o card, pode precisar extrair para `EquipSlotCard.tsx` |
| A4 | Picker fullscreen (não bottom-sheet) é a abordagem correta para lista de armas | Architecture Patterns | Bottom-sheet seria adequado apenas se listas fossem muito curtas (< 5 itens) |

---

## Open Questions

1. **O picker de arma deve exibir `dano` e `especial` além do nome?**
   - O que sabemos: `ArmaRow` tem `arma`, `dano`, `especial`. O jogador se beneficia de ver o dano ao escolher.
   - O que está unclear: Requisito EQP-01 diz apenas "lista do livro" — não especifica nível de detalhe.
   - Recomendação: Exibir `dano` e `especial` como segunda linha no picker. Custo zero (dados já existem). Alinha com a UX do picker de domínios em magia.tsx que exibe metadados.

2. **O card expandido deve ter `LayoutAnimation` ou abertura direta?**
   - O que sabemos: `regras.tsx` usa `LayoutAnimation.configureNext(easeInEaseOut)` com resultado suave.
   - O que está unclear: Se a animação adiciona complexidade desnecessária nesta fase.
   - Recomendação: Usar `LayoutAnimation` — o padrão já existe no projeto, é uma linha extra e melhora a UX perceptivelmente.

---

## Environment Availability

Fase de UI pura com zero dependências externas além do já instalado.

| Dependência | Requerida por | Disponível | Versão | Fallback |
|-------------|---------------|------------|--------|----------|
| expo-router (Tabs) | MOCH-01 | sim | já instalado | — |
| @expo/vector-icons MaterialIcons | MOCH-01 (ícone tab) | sim | já instalado | — |
| react-native Modal | EQP-01 (picker) | sim | built-in RN | — |
| expo-haptics | tab HapticTab | sim | já instalado | — |
| data/regras/equipamentos.ts | EQP-01 | sim | — | — |

**Dependências faltantes sem fallback:** nenhuma.

---

## Validation Architecture

`nyquist_validation: true` no config.json.

### Test Framework

| Propriedade | Valor |
|-------------|-------|
| Framework | Nenhum instalado (testes automatizados adiados para v2) |
| Config file | nenhum |
| Quick run command | `npx tsc --noEmit` |
| Full suite command | `npx tsc --noEmit` |

### Phase Requirements → Test Map

| Req ID | Comportamento | Tipo de Teste | Comando | Arquivo Existe? |
|--------|--------------|---------------|---------|-----------------|
| MOCH-01 | Tab "Mochila" aparece na tab bar | smoke manual | — | ❌ manual |
| MOCH-02 | magia.tsx sem seções Inventário/Equipamentos | type-check + grep | `npx tsc --noEmit` + grep negativo | ✅ já satisfeito |
| EQP-01 | Picker abre com lista correta por slot | smoke manual | — | ❌ manual |
| EQP-02 | TextInput de nome custom persiste | smoke manual | — | ❌ manual |
| EQP-03 | Card colapsado exibe nome + contagem melhorias | smoke manual | — | ❌ manual |
| (geral) | Compilação TS sem erros | type-check | `npx tsc --noEmit` | ❌ Wave 0 |

### Sampling Rate

- **Por task commit:** `npx tsc --noEmit`
- **Por wave merge:** `npx tsc --noEmit`
- **Phase gate:** `npx tsc --noEmit` exit 0 + smoke test manual nos 5 critérios

### Wave 0 Gaps

- [ ] `app/(tabs)/mochila.tsx` — criar (Wave 0 desta fase)
- [ ] Mapeamento `'bag.fill': 'backpack'` em `components/ui/icon-symbol.tsx`
- [ ] `<Tabs.Screen name="mochila">` em `app/(tabs)/_layout.tsx`

*(Nenhum arquivo de teste precisa ser criado — projeto não tem infraestrutura de testes em v1.3)*

---

## Security Domain

Esta fase não tem autenticação, I/O de rede, criptografia, ou inputs de fontes externas. Todos os dados são locais (AsyncStorage). Nenhuma categoria ASVS se aplica.

**Security domain: SKIPPED** (UI local-only, sem inputs externos).

---

## Sources

### Primary (HIGH confidence)

- `app/(tabs)/_layout.tsx` — padrão exato de registro de tabs (verificado)
- `components/rpg/ProficienciasSection.tsx` — padrão completo de Modal picker com ScrollView (verificado)
- `app/(tabs)/magia.tsx` — padrão de tela tab, KeyboardAvoidingView, Modal bottom-sheet, MOCH-02 status (verificado)
- `data/regras/equipamentos.ts` — arrays `armas[]`, `escudos[]`, `vestimentas[]`, `acessorios[]` com shapes e contagens (verificado)
- `types/character.ts` — `EquipItem` interface, `Character.equipamentos` com 6 slots, `defaultCharacter` (verificado)
- `store/CharacterContext.tsx` — `setEquipamentoItem` setter, padrão `update()` (verificado)
- `components/ui/icon-symbol.tsx` — MAPPING TypeScript estático, como adicionar ícone (verificado)
- `constants/theme.ts` — todos os tokens RPG disponíveis (verificado)
- `.planning/phases/12-schema-migration/12-01-SUMMARY.md` — decisão `armadura` carry-forward, MOCH-02 status (verificado)

### Secondary (MEDIUM confidence)

- `components/rpg/SectionHeader.tsx` — componente reutilizável para headers de seção (verificado)
- `app/(tabs)/regras.tsx` padrão `LayoutAnimation` — [ASSUMED: padrão mencionado no STATE.md Phase 11; não lido diretamente nesta session]

### Tertiary (LOW confidence)

- Nenhum item de baixa confiança.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero pacotes novos, todos existentes verificados no codebase
- Architecture: HIGH — padrão Modal verificado em ProficienciasSection, padrão tab verificado em _layout.tsx
- Pitfalls: HIGH — identificados por análise estática dos arquivos reais que serão alterados
- Dados do picker: HIGH — `data/regras/equipamentos.ts` lido diretamente

**Research date:** 2026-05-17
**Valid until:** Sem expiração — research interno de codebase estável até Phase 13 ser implementada
