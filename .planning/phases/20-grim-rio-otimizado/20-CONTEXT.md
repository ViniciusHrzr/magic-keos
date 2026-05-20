# Phase 20: Grimório Otimizado — Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Refactor `app/(tabs)/grimorio.tsx` for three focused improvements:

1. **GRIM-01** — Replace FlatList with FlashList for 60fps scroll on 3700+ entries. Keep collapse/expand UX via flat typed-item array.
2. **GRIM-02** — Replace text color filter labels (Branco/Verde/etc.) with PlanewalkerDings mana pip characters. No new assets.
3. **GRIM-03** — Replace Modal slide with route-based navigation + Reanimated shared element transition (expand from card position).

</domain>

<decisions>
## Implementation Decisions

### GRIM-01 — FlashList Data Architecture

- **D-01:** Keep collapse/expand domain UX — domains toggle open/closed as before.
- **D-02:** Pre-flatten data into a typed flat array consumed by FlashList:
  ```ts
  type FlatItem =
    | { type: 'domain-header'; domain: DomainGroup }
    | { type: 'add-domain';    domain: DomainGroup }
    | { type: 'spell';         spell: Spell; domainColor: SpellColor }
  ```
  `expanded` Set state drives which domains show their child items. `useMemo` recomputes flat array when `expanded` or `filteredGroups` changes.
- **D-03:** `estimatedItemSize={56}` — single estimate, FlashList corrects at runtime. No `overrideItemLayout`.
- **D-04:** Empty domain headers disappear when filtered — current behavior preserved. Domain header only appears if it has ≥1 matching spell.
- **D-05:** `keyExtractor` by item type: domain headers use domain name, spells use `spell.nome + domain name`.

### GRIM-02 — MTG Mana Filter Symbols

- **D-06 (Claude's Discretion):** Use PlanewalkerDings single characters for color filter buttons:
  - `a` → Branco (W), `g` → Verde (G), `d` → Vermelho (R), `b` → Preto (B), `u` → Azul (U)
  - Source: `data/regras/magicas.ts` `notacaoMana` table — confirmed mapping.
  - Keep existing `COLOR_HEX` for border/background tint. Replace `COLOR_LABELS[c]` text with the pip character in `fontFamily: 'PlanewalkerDings'`.
  - Filter button becomes a larger pip icon (fontSize ~20) centered in a 36×36 circular button.

### GRIM-03 — Shared Element Transition

- **D-07:** Replace Modal with route-based navigation — push to a new spell detail screen instead of `setSelected(spell)`.
- **D-08:** Expand-from-card-position animation via Reanimated `sharedTransitionTag` (Reanimated 4.x feature). The tapped spell card in the list and the detail screen view share matching tags — Reanimated animates the card expanding to fill the screen.
- **D-09:** Detail screen closes with X/close button only — no back navigation header, no swipe-to-dismiss. SpellDetailCard's existing `onClose` prop handles it via `router.back()`.
- **D-10:** Spell detail screen at `app/(tabs)/spell/[nome].tsx` or as a modal screen in the router layout. Receives spell data via route params or a module-level selected-spell ref (avoid route param serialization of large spell objects).

### Claude's Discretion

- GRIM-02: pip character size, filter button dimensions, exact padding — follow existing `filterBtn` style proportions.
- GRIM-03: exact Reanimated API syntax for shared element in v4.1.1 — researcher to confirm.
- GRIM-03: spell data passing strategy (route param vs. module-level ref) — pick whichever avoids serializing the full Spell object.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Grimório screen
- `app/(tabs)/grimorio.tsx` — full current implementation; FlatList, filter state, domain groups, Modal, all styles

### Design system
- `constants/theme.ts` — RPG color palette
- `constants/spell-constants.ts` — `COLOR_HEX` (color→hex), `GRAU_COLORS`

### PlanewalkerDings font mapping
- `data/regras/magicas.ts` — `notacaoMana` array, lines 39–48; character-to-color mapping (`a`=W, `g`=G, `d`=R, `b`=B, `u`=U)

### Existing components
- `components/rpg/SpellDetailCard.tsx` — reuse as-is in new detail screen
- `components/rpg/ErrorBoundary.tsx` — wrap new screen

### Requirements
- `.planning/REQUIREMENTS.md` → GRIM-01, GRIM-02, GRIM-03

### Data
- `data/grimoire.ts` — grimoire array + domains export + Spell/SpellColor/SpellType types

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `SpellDetailCard` — drop into new detail screen unchanged; accepts `spell`, `onClose`, `magicas`, `onAddMagica`
- Module-level filter vars `_search`, `_activeColor`, `_activeGrau`, `_activeType` — keep pattern for filter persistence
- `COLOR_HEX` from spell-constants — reuse for pip button colors
- `filteredGroups` useMemo logic — reuse unchanged; just feed output into flattener instead of FlatList

### Established Patterns
- Module-level vars for process-lifetime persistence (not Context) — used for filters; keep
- `useCallback` on `renderItem` equivalent — critical for FlashList performance
- `StyleSheet.create` exclusive — no inline styles
- `ErrorBoundary` wrap on tab screens

### Integration Points
- `useCharacter()` → `setMagica`, `setDominio` — passed to SpellDetailCard; must remain accessible from detail screen (needs `useCharacter` in detail screen too)
- `@shopify/flash-list` — NOT yet installed; needs `npx expo install @shopify/flash-list`
- `react-native-reanimated` ~4.1.1 — installed; researcher must confirm exact `sharedTransitionTag` API for v4

</code_context>

<specifics>
## Specific Ideas

- Filter pip button: ~36×36 circular, single PlanewalkerDings character fontSize ~20, border = `COLOR_HEX[c]`, fill = `COLOR_HEX[c] + '33'` when active (same as current filterBtn active state)
- Expand animation: the spell row card in the list should feel like it "grows" to fill the screen — not a separate element sliding in from bottom
- No back nav header on detail screen — full-screen card with X in top-right corner, matching current SpellDetailCard layout

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 20-grim-rio-otimizado*
*Context gathered: 2026-05-19*
