# Phase 3: Qualidade do Grimório - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Duas entregas independentes no grimório:

1. **GRIM-01** — Extrair `SpellDetail` e `StatPill` de `grimorio.tsx` para `components/rpg/` como um componente compartilhado (`SpellDetailCard`) usado também em `magia.tsx`, eliminando a duplicação de implementação.
2. **GRIM-02** — Persistir os filtros de cor, grau, tipo e busca do grimório durante a sessão (atualmente resetam ao navegar entre abas).

**Fora de escopo nesta fase:**
- Quaisquer novas features no grimório (novos filtros, novas ações nos spells)
- Alterações em `magia.tsx` além da substituição de `SpellDetailView` por `SpellDetailCard`
- Extração de outros sub-componentes de `magia.tsx` (DomainView, etc.)
- Proficiências — nova capability, deferred

</domain>

<decisions>
## Implementation Decisions

### SpellDetailCard — Componente compartilhado (GRIM-01)

- **D-01:** Criar `components/rpg/SpellDetailCard.tsx` extraindo a lógica de `SpellDetail` de `grimorio.tsx`. Props: `spell: Spell`, `onClose: () => void`, e opcionalmente `magicas?: string[]` + `onAddMagica?: (idx: number, name: string) => void`. Quando `onAddMagica` não é fornecido, o botão "+ Mágica" não é renderizado — o usuário confirmou que a tela de Magia **não deve ter o botão + Mágica**.
- **D-02:** O estado de feedback ("Todos os slots cheios!", "adicionada às mágicas!") permanece encapsulado dentro de `SpellDetailCard`.
- **D-03:** Substituir `SpellDetailView` em `magia.tsx` pelo `SpellDetailCard` importado, sem passar `onAddMagica` (view-only).
- **D-04:** Remover `SpellDetailView` inline de `magia.tsx` após substituição.

### StatPill — Extração independente (GRIM-01)

- **D-05:** Criar `components/rpg/StatPill.tsx` com props `label: string`, `value: string`, `isSymbol?: boolean`. Usado internamente por `SpellDetailCard` e importável por outras telas no futuro.
- **D-06:** Remover `function StatPill` inline de `grimorio.tsx` após extração.

### Filter Persistence — Módulo-level state (GRIM-02)

- **D-07:** Persistir os filtros via variáveis module-level em `grimorio.tsx` (fora do componente). Variáveis: `_search`, `_activeColor`, `_activeGrau`, `_activeType` inicializadas com os valores padrão (`''`, `null`, `null`, `null`). O componente inicializa `useState` a partir dessas variáveis e as atualiza a cada mudança via handlers wrapper.
- **D-08:** Incluir `search` na persistência junto com `activeColor`, `activeGrau` e `activeType` — comportamento natural sem custo adicional.
- **D-09:** Não usar AsyncStorage para filtros (overkill — persistência apenas na sessão é suficiente). Não usar novo Context (UI state não pertence ao CharacterContext).

### Claude's Discretion

- Nomes exatos das variáveis module-level (`_search` vs `filterSearch`, etc.) — a critério do executor
- Se extrair ou não os helpers `TYPE_LABELS`, `COLOR_LABELS`, `COLORS`, `TYPES` para fora do arquivo — a critério (não são duplicados em outros arquivos)
- Estrutura interna de `SpellDetailCard.tsx` (ordem de imports, seção de styles) deve seguir as convenções existentes de `components/rpg/`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos e Critérios
- `.planning/REQUIREMENTS.md` — GRIM-01 e GRIM-02 com descrições
- `.planning/ROADMAP.md` — Phase 3 success criteria (3 critérios verificáveis)

### Arquivos a Modificar
- `app/(tabs)/grimorio.tsx` — remover `SpellDetail` e `StatPill` inline; adicionar import de `SpellDetailCard` e `StatPill`; adicionar variáveis module-level para filtros
- `app/(tabs)/magia.tsx` — substituir `SpellDetailView` inline por import de `SpellDetailCard` (sem `onAddMagica`)

### Arquivos a Criar
- `components/rpg/SpellDetailCard.tsx` — componente extraído de `grimorio.tsx`, com `onAddMagica` opcional
- `components/rpg/StatPill.tsx` — badge de stat extraído de `grimorio.tsx`

### Padrões de Referência
- `components/rpg/NumericStepper.tsx` — padrão de componente `components/rpg/` com `interface Props`, default export, `StyleSheet.create`
- `constants/spell-constants.ts` — importar `COLOR_HEX`, `GRAU_COLORS` (já disponível, criado na Phase 2)
- `data/grimoire.ts` — tipos `Spell`, `SpellColor`, `SpellType` (importar nos novos componentes)
- `data/spellImages.ts` — `spellImages[spell.nome]` para imagem do spell (usar em `SpellDetailCard`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `SpellDetail` em `grimorio.tsx:216` — fonte do `SpellDetailCard`; tem ScrollView, header com image+name+close, StatPill stats, effect text, importRow com "+ Mágica"
- `SpellDetailView` em `magia.tsx:340` — versão sem ações; layout idêntico mas pills inline (sem `StatPill`) e sem botão. A ser substituída.
- `StatPill` em `grimorio.tsx:267` — 8 linhas, props `label`, `value`, `isSymbol?`; usa `fontFamily: 'PlanewalkerDings'` para custo de mana
- `COLOR_HEX`, `GRAU_COLORS` já em `constants/spell-constants.ts` (Phase 2)

### Established Patterns
- Componentes em `components/rpg/` são prop-driven (não chamam `useCharacter()` diretamente) — `SpellDetailCard` precisa receber `magicas` e `onAddMagica` como props, não acessar o contexto diretamente
- `interface Props` local em cada arquivo de componente — não importar tipos de props entre componentes
- Variáveis module-level já usadas para dados estáticos (`equipSlots` em `magia.tsx:444`) — mesmo padrão para filter state
- `StyleSheet.create` + `RPG.*` para todos os estilos — sem inline hex, sem NativeWind

### Integration Points
- `GrimorioScreen` monta `SpellDetail` dentro de `<Modal>` com `onClose={() => setSelected(null)}` e passa `magicas={c.magicas}` e `onAddMagica={setMagica}` — esses props continuam iguais em `SpellDetailCard`
- `MagiaScreen` monta `SpellDetailView` dentro de `<Modal>` com apenas `spell` e `onClose` — ao usar `SpellDetailCard`, simplesmente omitir `onAddMagica` e `magicas`
- `_layout.tsx` raiz não precisa de alterações — filtros são session-state, não requerem novo Provider

</code_context>

<specifics>
## Specific Ideas

- Na tela Magia, ao ver detalhes de uma mágica, **não deve aparecer o botão "+ Mágica"** — usuário confirmou explicitamente. O `SpellDetailCard` sem `onAddMagica` é a forma correta.
- Filtros devem persistir apenas durante a sessão (não entre reinicializações do app) — module-level variables são suficientes.

</specifics>

<deferred>
## Deferred Ideas

- **Proficiências** — Nova feature mencionada pelo usuário. Não está no escopo das fases 3 ou 4 do roadmap atual. Registrar como ideia para Phase 5+ ou milestone v2. Nenhuma decisão de design capturada ainda.
- **DomainView em magia.tsx** — Sub-componente `DomainView` (linhas 374–442) também é candidato à extração, mas não está no escopo de GRIM-01 (que especifica SpellDetail e StatPill). Deixar para fase futura se necessário.
- **FICHA-04** — Extração do `InstanceBlock` de `index.tsx` — diferido desde Phase 2, permanece deferred.

</deferred>

---

*Phase: 3-Qualidade-do-Grimório*
*Context gathered: 2026-05-15*
