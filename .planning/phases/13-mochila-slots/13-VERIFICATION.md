---
phase: 13-mochila-slots
verified: 2026-05-17T08:00:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Abrir o app no simulador, tocar na aba Mochila e verificar que a tela carrega sem erros"
    expected: "Tela Mochila exibe 5 cards colapsáveis (Arma, Escudo, Vestimenta, Acessório 1, Acessório 2) com título dourado 'Mochila' e seção 'Equipamentos'"
    why_human: "Navegação, renderização e animações LayoutAnimation não são verificáveis por grep"
  - test: "Tocar em qualquer card para expandir, tocar em 'Escolher do livro', selecionar um item da lista"
    expected: "Modal fullscreen abre com lista de itens do slot correspondente; ao tocar num item, o modal fecha e o card colapsado exibe o nome escolhido"
    why_human: "Fluxo de picker modal e atualização de estado requer execução real"
  - test: "Expandir um card, digitar um nome personalizado no TextInput"
    expected: "Nome digitado é salvo e exibido no cabeçalho colapsado do card"
    why_human: "Comportamento de editNome e persistência requer execução real"
  - test: "Abrir a aba Magia e rolar toda a tela"
    expected: "Nenhuma seção de Inventário ou Equipamentos aparece — apenas Velocidade, Canalização, Memória, Foco, Domínios, Mágicas e Receitas"
    why_human: "Ausência de seções visuais requer inspeção visual real"
---

# Phase 13: Aba Mochila & Slots de Equipamento — Verification Report

**Phase Goal:** Usuário acessa uma aba dedicada "Mochila" com 5 slots de equipamento interativos e a aba Magia não exibe mais Inventário/Equipamentos.
**Verified:** 2026-05-17T08:00:00Z
**Status:** HUMAN_NEEDED — todas as verificações automatizadas passaram; 4 itens requerem validação visual/interativa
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Ícone "Mochila" aparece na tab bar e navega para a nova tela sem erros | VERIFIED | `_layout.tsx:64-69` — `<Tabs.Screen name="mochila" options={{ title: 'Mochila', tabBarIcon: ... name="bag.fill" }}>`; `icon-symbol.tsx:26` — `'bag.fill': 'backpack'` no MAPPING; `mochila.tsx` exporta `MochilaScreen` válida |
| 2 | A aba Magia não exibe mais as seções de Inventário e Equipamentos | VERIFIED | grep em `magia.tsx` para INVENTÁRIO, EQUIPAMENTOS, equipGrid, Inventário, Equipamentos — **zero matches**; arquivo tem 740 linhas contendo somente Velocidade, Canalização, Memória, Foco, Domínios, Mágicas, Receitas |
| 3 | Usuário pode tocar em qualquer slot e escolher item da lista do livro via picker/modal | VERIFIED | `mochila.tsx:112-165` — SLOT_KEYS.map renderiza 5 cards; `mochila.tsx:145-151` — botão "Escolher do livro" chama `setPickerSlot(slot)`; `mochila.tsx:168-199` — Modal fullscreen com `ScrollView` iterando `SLOT_ITEMS[activePickerSlot]` vindos de `data/regras/equipamentos.ts`; `pickItem()` em linha 60 chama `setEquipamentoItem` |
| 4 | Usuário pode inserir ou editar um nome personalizado em qualquer slot | VERIFIED | `mochila.tsx:138-144` — `TextInput` com `value={item?.nome ?? ''}` e `onChangeText={v => editNome(slot, v)}`; `editNome()` em linha 76 chama `setEquipamentoItem` com nome atualizado; cria item novo se slot vazio e nome não-vazio |
| 5 | O card do slot exibe em estado colapsado o nome do item selecionado e a quantidade de melhorias aplicadas | VERIFIED | `mochila.tsx:127-128` — header colapsado mostra `item.nome`; `mochila.tsx:131-133` — exibe `{item.melhorias.length} melh.` quando `item.melhorias.length > 0`; card header sempre visível (fora do `{isExpanded && ...}`) |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/(tabs)/mochila.tsx` | Tela Mochila com 5 cards colapsáveis e Modal picker | VERIFIED | 353 linhas; exporta `MochilaScreen`; `SLOT_KEYS` tuple com 5 slots; Modal picker; `editNome`/`pickItem`/`clearSlot`; wired to `useCharacter` |
| `components/ui/icon-symbol.tsx` | Mapeamento `bag.fill` → `backpack` no MAPPING | VERIFIED | Linha 26: `'bag.fill': 'backpack'` presente no MAPPING object |
| `app/(tabs)/_layout.tsx` | Registro da tab mochila na Tabs bar | VERIFIED | Linhas 63-69: `<Tabs.Screen name="mochila" ... tabBarIcon={... name="bag.fill"} />` registrado antes do tab `explore` hidden |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `_layout.tsx` | `icon-symbol.tsx` | `IconSymbol name='bag.fill'` | WIRED | `_layout.tsx:67` usa `name="bag.fill"`; `icon-symbol.tsx:26` tem o mapeamento no MAPPING |
| `mochila.tsx` | `store/CharacterContext.tsx` | `setEquipamentoItem(slot, item)` | WIRED | `mochila.tsx:56` desestrutura `setEquipamentoItem` de `useCharacter()`; chamado em 4 pontos (linhas 62, 71, 79, 81); `CharacterContext.tsx:183` — implementação real via `update()` com AsyncStorage |
| `mochila.tsx` | `data/regras/equipamentos.ts` | `armas/escudos/vestimentas/acessorios` | WIRED | `mochila.tsx:21` — `import { armas, escudos, vestimentas, acessorios } from '@/data/regras/equipamentos'`; usados em `SLOT_ITEMS` e `SLOT_META` para popular o picker |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `mochila.tsx` (slot cards) | `c.equipamentos[slot]` | `useCharacter()` → `CharacterContext` → `AsyncStorage` | Sim — `setEquipamentoItem` escreve via `update()` que persiste em AsyncStorage | FLOWING |
| `mochila.tsx` (picker list) | `SLOT_ITEMS[activePickerSlot]` | `data/regras/equipamentos.ts` exporta arrays de dados reais do livro | Sim — dados estáticos do livro, não hardcoded empty | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript compila sem erros | `npx tsc --noEmit` | "TypeScript: No errors found" (exit 0) | PASS |
| Tab mochila registrada no layout | `grep -c "mochila" _layout.tsx` | Corresponde (name="mochila" presente) | PASS |
| Ícone bag.fill mapeado | `grep -c "bag.fill" icon-symbol.tsx` | 1 ocorrência confirmada | PASS |
| MochilaScreen existe | `grep -c "MochilaScreen" mochila.tsx` | 1 ocorrência confirmada | PASS |
| magia.tsx sem Inventário/Equipamentos | `grep -c "INVENTÁRIO\|EQUIPAMENTOS\|equipGrid" magia.tsx` | 0 matches | PASS |
| setEquipamentoItem em mochila.tsx | `grep -c "setEquipamentoItem" mochila.tsx` | 5 ocorrências (import + 4 calls) | PASS |

---

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|------------|-------------|--------|---------|
| MOCH-01 | Aba Mochila na tab bar com ícone | SATISFIED | `_layout.tsx` registra tab, `icon-symbol.tsx` mapeia ícone |
| MOCH-02 | Aba Magia não exibe mais Inventário/Equipamentos | SATISFIED | grep em `magia.tsx` retorna 0 para todos os termos relevantes |
| EQP-01 | 5 slots de equipamento na Mochila | SATISFIED | `SLOT_KEYS = ['arma', 'escudo', 'vestimenta', 'acessorio1', 'acessorio2']` |
| EQP-02 | Picker do livro por tipo de slot | SATISFIED | `SLOT_ITEMS` e `SLOT_META` por tipo; Modal com lista filtrada por slot |
| EQP-03 | Nome personalizado por slot | SATISFIED | `editNome()` + `TextInput` wired to `setEquipamentoItem` |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `mochila.tsx` | 142-143 | `placeholder="Nome personalizado..."` | Info | TextInput prop nativa — não é stub |

Nenhum marcador TBD/FIXME/XXX encontrado. Nenhum `return null` ou implementação vazia. Nenhum dado hardcoded empty fluindo para renderização.

---

### Human Verification Required

#### 1. Navegação para a aba Mochila

**Test:** Abrir o app no simulador/dispositivo, tocar no ícone "Mochila" na tab bar
**Expected:** Tela carrega sem erros com 5 cards colapsáveis (Arma, Escudo, Vestimenta, Acessório 1, Acessório 2), título "Mochila" em dourado e seção "Equipamentos"
**Why human:** Navegação, renderização e LayoutAnimation não são verificáveis por grep

#### 2. Picker modal e seleção de item

**Test:** Tocar em qualquer card para expandir, tocar em "Escolher do livro", selecionar um item da lista
**Expected:** Modal fullscreen abre com lista do tipo do slot; ao selecionar um item, modal fecha e o header colapsado do card exibe o nome escolhido
**Why human:** Fluxo de estado picker e atualização visual requerem execução real

#### 3. Nome personalizado

**Test:** Expandir qualquer card, digitar um nome no TextInput de nome personalizado
**Expected:** Nome digitado é persistido e aparece no header colapsado do card ao recolher
**Why human:** Comportamento de `editNome` e persistência via AsyncStorage requerem execução real

#### 4. Aba Magia limpa

**Test:** Navegar para a aba Magia e rolar a tela inteira
**Expected:** Somente as seções Velocidade, Canalização, Memória, Foco, Domínios, Mágicas e Receitas aparecem — nenhum rastro de Inventário ou Equipamentos
**Why human:** Ausência de seções visuais exige inspeção visual para confirmação final

---

### Gaps Summary

Nenhum gap bloqueante identificado. Todos os 5 critérios de sucesso do ROADMAP.md estão verificados no código. Os 4 itens acima são verificações de comportamento em tempo de execução que confirmam a entrega completa da fase.

---

_Verified: 2026-05-17T08:00:00Z_
_Verifier: Claude (gsd-verifier)_
