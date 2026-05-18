# Phase 17: Vitalidade & Status — Context

**Gathered:** 2026-05-18
**Status:** Ready for planning
**Source:** Roadmap + Requirements analysis

<domain>
## Phase Boundary

Replace the current numeric-only vida row and enhance veneno tracker with proper MTG/aRPG visuals:

1. **VidaBar** — unified layered health bar replacing 5 separate NumericSteppers; layered overlays for Total/Atual/Necro/Armadura/Manto
2. **VenenoTracker enhancement** — add checkmark symbols inside filled slots for visual clarity (MTG aesthetic)
3. **VIT-02 (Sabedoria)** — already fully implemented: `sabedoria.acumulada` + `sabedoria.disponivel` both exist in CharacterContext and have separate NumericSteppers in index.tsx; LegendaryFrame shows both. No work needed.

</domain>

<decisions>
## Implementation Decisions

### VIT-01 — VidaBar layered component

**LOCKED: Layer order and semantics (from REQUIREMENTS.md and ROADMAP.md)**
- Total: gray neutral container — the 100% width background (max HP)
- Atual: green→red gradient fill — proportional to atual/total ratio
- Necro: purple blocking overlay — renders from left, blocks healing visually
- Armadura: shield overlay on the left edge — shows numeric value
- Manto: cyan aura outline — wraps the entire bar as a border/glow

**LOCKED: No Skia shaders for VidaBar** — Skia is reserved for mana (Phase 18). VidaBar uses React Native View + LinearGradient (expo-linear-gradient already available) or fallback to RN-only gradient via View composition.

**LOCKED: NumericSteppers kept for input** — The visual bar shows the state; steppers (compact) remain below or alongside for editing values. The bar is display-only, steppers are the edit controls.

**Implementation approach:**
- Create `components/rpg/VidaBar.tsx` — new component
- In index.tsx: replace `<View style={styles.vidaRow}>` block with `<VidaBar vida={c.vida} onVidaChange={setVida} />`
- VidaBar layout: bar visualization on top, 5 compact NumericSteppers below (labeled)

**Layer rendering (pure RN, no Skia):**
- Container View at full width, height ~20px (styles matching existing card aesthetic)
- Background (Total): `backgroundColor: RPG.textDark` (muted gray)
- Atual fill: `View` absolutely positioned, width = `(atual/total)*100%`, gradient via `backgroundColor` shift (green when high, red when low) — use `interpolateColor` or simple threshold
- Necro overlay: `View` absolutely positioned from left, width = `(necro/total)*100%`, `backgroundColor: 'rgba(100, 0, 160, 0.5)'`
- Armadura badge: `View` on left with numeric text, `backgroundColor: RPG.headerBg`, bordered
- Manto aura: `borderWidth: 2, borderColor: '#00d4ff'` on the container when manto > 0

### VIT-03 — VenenoTracker checkmarks

**LOCKED: Grid of 10 slots stays; add ✓ text inside filled slots**
- Filled bubble: add `<Text style={styles.checkmark}>✓</Text>` inside the bubble View
- Critical (slots 8–10): use different symbol or color (already has `filledCritical` style)
- No structural change — just add checkmark Text child to filled state

**LOCKED: Effect text list stays** — the threshold effects below the grid remain

### VIT-02 — Sabedoria

**Already implemented — no code changes needed.**
- `c.sabedoria.acumulada` and `c.sabedoria.disponivel` exist in CharacterContext
- Two NumericSteppers in index.tsx section "Sabedoria"
- LegendaryFrame shows `SAB: acumulada/disponivel`
- Verified complete.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design system
- `constants/theme.ts` — RPG color palette (RPG.surface, RPG.gold, RPG.red, RPG.bg, etc.)
- `components/rpg/LegendaryFrame.tsx` — Skia chamfer pattern (reference, do not replicate)

### Existing components to modify
- `components/rpg/VenenoTracker.tsx` — add checkmarks to filled bubbles (VIT-03)
- `app/(tabs)/index.tsx` — replace vidaRow block with VidaBar component (VIT-01)

### New component to create
- `components/rpg/VidaBar.tsx` — layered health bar (VIT-01)

### Schema (read-only — no changes)
- `types/character.ts` → `vida: { total, necro, atual, armadura, manto }` — all number fields exist
- `store/CharacterContext.tsx` → `setVida(k, v)` setter exists

### Requirements
- `.planning/REQUIREMENTS.md` → VIT-01, VIT-02, VIT-03

</canonical_refs>

<specifics>
## Specific Details

- VidaBar height: ~20px for the bar itself + stepper row below
- Manto glow: cyan `#00d4ff` — matches MTG cyan (not in RPG palette, add inline)
- Necro color: `rgba(100, 0, 160, 0.5)` — purple semi-transparent
- Armadura badge: left edge, small View with `RPG.textMuted` text
- VenenoTracker checkmark: `✓` character at ~14px, `RPG.text` color, centered inside bubble

</specifics>

<deferred>
## Deferred

- Animated transitions for vida bar (fill animation on change) — v1.5+
- Haptics on veneno slot toggle — v1.5+ (per requirements)
- Glow animation for Manto aura — v1.5+

</deferred>

---

*Phase: 17-vitalidade-status*
*Context gathered: 2026-05-18*
