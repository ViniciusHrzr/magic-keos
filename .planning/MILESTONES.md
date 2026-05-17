# Milestones — Magic Kéos App

## v1.0 — MVP (2026-05-15)

**Shipped:** 2026-05-15
**Phases:** 4 | **Plans:** 11 | **Requirements:** 15/16 (FICHA-04 deferred → v1.1)
**Timeline:** 2026-05-15 (single day execution)
**Files changed:** 24 TS/TSX files, 4300 insertions / 658 deletions

### Delivered

Companion digital para Magic no Universo Kéos: estabilização da fundação (persistência, hidratação, error boundaries, memoização), qualidade da ficha (validação, fonte, remoção de dead code), extração de componentes do grimório com persistência de filtros de sessão, e aba "Regras" com referência in-session + seletor estruturado de Proficiências por chips.

### Key Accomplishments

1. **Debounce + memoização** — AsyncStorage writes debounced 500ms; 20 set* functions em useCallback; contextValue em useMemo — fim dos re-renders em cascata
2. **Hydration guard** — isLoaded guard elimina race condition e flash de estado vazio no cold start
3. **Error boundaries** — crashes isolados por aba; app não derruba ao renderizar campo corrompido
4. **IP validation** — NumericStepper (min=0) substitui TextInput nos campos IP BASE/BÔNUS; zero código de validação novo
5. **Font fix** — fontsLoaded guard em _layout.tsx; PlanewalkerDings sem flash no cold start
6. **Component extraction** — StatPill e SpellDetailCard extraídos para components/rpg/; spell-constants.ts deduplica COLOR_HEX e GRAU_COLORS; modal.tsx e explore.tsx mortos removidos
7. **Filter persistence** — filtros do grimório (cor, grau, tipo) persistem via module-level vars durante a sessão
8. **Regras tab** — 4ª aba com 8 seções de referência + Notas persistido via AsyncStorage
9. **Proficiências chips** — ProficienciasSection com chips togláveis por CORPO/MENTE/ESPÍRITO; migration automática string→string[]

### Known Gaps

- **FICHA-04**: index.tsx ainda > 300 linhas; InstanceBlock não extraído (deferred por decisão do usuário)
- **migrate() sem versão de schema**: guard acumulativo por tipo ao invés de versão semântica

### Archive

- Roadmap: `.planning/milestones/v1.0-ROADMAP.md`
- Requirements: `.planning/milestones/v1.0-REQUIREMENTS.md`

---

## v1.1 — Fidelidade ao Livro de Regras (2026-05-16)

**Shipped:** 2026-05-16 | **Phases:** 5–9 | **Requirements:** Phases 5-9 completos

Correção completa de proficiências (CORPO/MENTE/ESPÍRITO), habilidades e documentação para fidelidade total ao docx oficial. Aba Notas extraída. ProficienciasSection collapsível. Regras 100% dinâmicas via data/regras/*.ts.

---

## v1.2 — Tela de Regras: Visual & Estrutura (2026-05-17)

**Shipped:** 2026-05-17 | **Phases:** 10–11 | **Requirements:** REG-01..REG-12

Hierarquia visual (cards, separação), tipografia RPG, tabelas estilizadas, colapsáveis animados com chevron + haptic.

---

## v1.3 — Aba Mochila: Equipamentos & Craft (2026-05-17)

**Shipped:** 2026-05-17 | **Phases:** 12–14 | **Requirements:** MOCH-01/02, EQP-01/02, INV-01/02, CRAFT-01..03, ARTE-01, SCHEMA-01

Schema EquipItem + migration, nova aba Mochila com 5 slots hexagonais drag-to-equip (Reanimated v4 + GestureHandler v2), FlatList híbrida (IQuickNote + IStructuredGear), craft com preview de melhoria, stats inline sempre visíveis.

---

## v1.4 — Nova UI: aRPG & MTG Style (active)

**Started:** 2026-05-17 | **Phases:** 15–20
