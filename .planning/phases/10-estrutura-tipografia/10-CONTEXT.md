# Phase 10: Estrutura & Tipografia - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesenhar a hierarquia visual da tela de Regras (`app/(tabs)/regras.tsx`): cards por seção com separação clara do scroll background, cabeçalhos com tipografia maior e divisor visual, sistema tipográfico com escala consistente (tamanhos, pesos, cores, lineHeight). Nenhuma mudança de conteúdo (data/regras/), animações ou háptico — esses ficam para Phase 11.

</domain>

<decisions>
## Implementation Decisions

### Card Anatomy (REG-01)

- **D-01:** `sectionWrap` recebe `backgroundColor: RPG.surface`, `borderTopWidth: 2`, `borderTopColor: RPG.goldDim`, `marginHorizontal: 8`, `marginVertical: 6`. Sem borderRadius, sem borda completa. O fundo escuro (RPG.bg) aparece nas laterais/entre cards como gutter, criando separação visual clara.
- **D-02:** `sectionBody` mantém `backgroundColor: RPG.surface` — mesmo background do card. Sem mudança.
- **D-03:** `sectionHeader` mantém `backgroundColor: RPG.headerBg` (#0d0b08) — mais escuro que RPG.surface (#181210), dando contraste sutil header/body dentro do card.

### Header Redesign (REG-02, REG-06)

- **D-04:** `sectionTitle` sobe de 14px → **16px** bold gold. Mínimo exato do REG-06.
- **D-05:** `sectionNum` sobe de 11px → **12px** goldDim — cresce proporcionalmente, permanece discreto como prefixo.
- **D-06:** Quando seção está aberta, `sectionHeader` recebe `borderBottomWidth: 1, borderBottomColor: RPG.goldDim` para dividir header do body (REG-02). Quando fechado, sem borderBottom — o divisor só aparece quando o conteúdo está visível.
- **D-07:** Fundo do `sectionHeader` quando **aberto** muda para `RPG.surface` (igual ao body) — distinção aberto/fechado via cor de fundo. Quando **fechado** permanece `RPG.headerBg`. Isso prepara o groundwork visual para as animações de Phase 11.

### Hierarquia Tipográfica (REG-07, REG-08, REG-09)

- **D-08:** `Sub` component: **12px semibold goldLight, uppercase** (up de 10px bold goldDim). Mantém uppercase como marca de sub-seção. `letterSpacing: 0.8` para manter a legibilidade uppercase na nova escala.
- **D-09:** `lineHeight: 18` universalmente para todos os body text elements: `sectionIntro`, `profDesc`, `habEfeito`, `tableVal`. Subir de 16 → 18 em todos.
- **D-10:** `profTeste` mantém `color: RPG.azulLight` — cor semântica que distingue a mecânica de teste do nome/descrição. REG-09 se aplica a labels de metadado (PRÉ-REQ, CUSTO, MÁGICA), não a conteúdo de regra.
- **D-11:** Meta labels REG-09 (uppercase ≤10px gold letterSpacing) — `habMagicasLabel` já está em conformidade (9px gold bold letterSpacing 0.6). Ajustar `profReq` de goldDim italic → **10px gold uppercase letterSpacing: 0.5** (sem italic, para consistência com REG-09).

### Claude's Discretion

- Valor exato de `marginHorizontal`: usar 8px (Claude decide dentro do range 8-12px especificado)
- Valor exato de `marginVertical`: usar 6px entre cards (Claude decide dentro do range 6-8px)
- `habPrereq` (Req: ...) segue o mesmo ajuste de D-11 — gold uppercase 10px para consistência
- Font weight `'700'` para sectionTitle (já era bold, confirma o peso exato)
- `fontWeight: '600'` para Sub (semibold — sem native-weight específico para '600' em all platforms, mas é o padrão aceitável)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Tela de Regras (arquivo principal)
- `app/(tabs)/regras.tsx` — arquivo único que contém Section, Sub, TH, R2, R3, ProfBlock, HabBlock e todos os styles. Todo redesign acontece aqui.

### Design Tokens
- `constants/theme.ts` — objeto RPG com todos os tokens de cor. Planner DEVE verificar os valores exatos antes de escrever styles (RPG.surface, RPG.headerBg, RPG.goldDim, RPG.goldLight, RPG.azulLight, etc.)

### Requisitos desta fase
- `.planning/REQUIREMENTS.md` — REG-01, REG-02, REG-06, REG-07, REG-08, REG-09 (valores exatos de pixel/peso/cor por requirement)

### Contexto do projeto
- `.planning/PROJECT.md` — decisões de estilo consolidadas (StyleSheet.create exclusivo, todas cores via RPG.*)
- `.planning/codebase/CONVENTIONS.md` — convenções de styling (StyleSheet.create, dynamic styles via array, hex transparency pattern)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Section` component (regras.tsx linha 122): já tem a estrutura base (`sectionWrap/sectionHeader/sectionNum/sectionTitle/chevron/sectionBody`). Phase 10 modifica os styles — não reescreve a estrutura JSX, apenas ajusta `StyleSheet.create`.
- `Sub` component (linha 73): sub-seção simples, só muda o style.
- `ProfBlock` / `HabBlock`: têm `profReq`, `habPrereq`, `habMagicasLabel` — esses recebem ajuste de REG-09.

### Established Patterns
- `StyleSheet.create` exclusivo — todos os novos styles vão no bloco `const styles` no final do arquivo.
- Cores sempre via `RPG.*` — nunca hex hardcoded (exceção: `backgroundColor: RPG.gold + '22'` para semi-transparentes).
- Dynamic styles via array syntax: `style={[styles.sectionHeader, open && styles.sectionHeaderOpen]}`.
- Sub-components privados dentro do mesmo arquivo — Section pode receber prop `open` para conditional styling sem precisar de extração.

### Integration Points
- `Section` recebe `open` state já via `useState` interno — pode expor via style array sem props adicionais.
- `sectionHeader` precisa condicionar `borderBottomWidth` e `backgroundColor` ao estado `open` — isso requer passar `open` como prop para os styles ou usar inline conditional style.

</code_context>

<specifics>
## Specific Ideas

- Borda superior gold (borderTopWidth: 2, borderTopColor: RPG.goldDim) como identificador visual do card — não borda completa.
- Header quando aberto usa RPG.surface (igual ao body) — fusão visual header+body quando expandido, contraste só na borda superior.
- profTeste mantém azulLight por razão semântica explícita: cor indica "mecânica de teste de atributo", não um label de metadado.

</specifics>

<deferred>
## Deferred Ideas

- Animação do chevron (LayoutAnimation ou Animated) → Phase 11
- Haptic feedback no header colapsável → Phase 11
- Estilo RPG para tabelas (TH/R2/R3 com header row distinto) → Phase 11
- Cabeçalho colapsável com aparência animada aberto vs fechado → Phase 11 (Phase 10 prepara os styles base)

</deferred>

---

*Phase: 10-estrutura-tipografia*
*Context gathered: 2026-05-16*
