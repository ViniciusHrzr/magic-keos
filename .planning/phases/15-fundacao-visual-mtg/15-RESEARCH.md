# Phase 15: Fundação Visual MTG - Research

**Researched:** 2026-05-17
**Domain:** React Native Skia installation · MTG color system · Custom path shapes in RN
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UI-01 | @shopify/react-native-skia instalado e configurado sem quebrar build Expo 54 | Verified install command, peer deps, known SDK 54 issue + status, slopcheck OK |
| UI-02 | Paleta MTG hex exata em constants/theme.ts: Branco/#F8F2E2, Verde/#00733E, Vermelho/#D3202A, Preto/#150B00, Azul/#0E68AB, Incolor/#A6ADB5 | Current theme.ts fully read; exact hex codes captured from design doc; no downstream color consumers break |
| UI-03 | LegendaryFrame component disponível no header do personagem (nome + sabedoria, borda chanfrada MTG) | Header location pinpointed (index.tsx titleBar); chamfered path via Skia.PathBuilder documented |
</phase_requirements>

---

## Summary

Phase 15 installs one new dependency (`@shopify/react-native-skia`), updates six color tokens in `constants/theme.ts`, and introduces one new component (`LegendaryFrame`) replacing the existing flat `titleBar` in `index.tsx`.

The Expo SDK in this project is `~54.0.33` with React Native `0.81.5` and React `19.1.0`. Skia 2.6.2 (latest as of 2026-04-16) requires `react-native >= 0.78` and `react >= 19.0` — both are satisfied. [VERIFIED: npm registry] It is listed as included in Expo Go (no `expo-dev-client` build required for dev). [CITED: docs.expo.dev/versions/latest/sdk/skia]

There was a known import-ordering bug in Expo SDK 54's Metro `experimentalImportSupport` that broke Skia's `NativeSetup` initialization. The react-native-skia team patched their own package (the workaround is self-contained inside the npm package); no user-side metro.config.js changes are required. [CITED: github.com/expo/expo/issues/39277] The issue is marked "outdated" and the Expo docs list Skia as fully supported.

For the LegendaryFrame, a chamfered (diagonal-corner) rectangle must be drawn with Skia's `PathBuilder` — no standard RN `StyleSheet.create` can produce clipped diagonal corners natively. This is a 40–60 line component, not a complex subsystem.

**Primary recommendation:** Install via `npx expo install @shopify/react-native-skia`, update the six RPG mana color keys in `theme.ts` to MTG hex values, and create `components/rpg/LegendaryFrame.tsx` as a Skia `Canvas` + `PathBuilder` component used in `index.tsx`'s header section.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Skia install & native module setup | Build/Native | — | Native module wired at `npx expo install` time; no server layer |
| MTG palette tokens | Frontend (constants) | All screens | theme.ts is global — all screens consume RPG.* tokens |
| LegendaryFrame rendering | Frontend (component) | — | Pure visual component; reads nome+sabedoria from parent props |
| Character name display (UI-03) | Frontend screen (index.tsx) | LegendaryFrame | index.tsx owns useCharacter(); passes nome+sabedoria as props |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @shopify/react-native-skia | 2.6.2 | GPU-accelerated 2D graphics, chamfered path rendering | Only production-grade Skia binding for RN; Expo-blessed; already in Expo Go |

### Supporting

No additional libraries needed for Phase 15. Existing `react-native-reanimated ~4.1.1` (already installed) is the peer required by Skia and is already present.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Skia PathBuilder for chamfer | SVG via react-native-svg | SVG is heavier; RN-Skia already chosen for Phases 17–18 shaders; installing now avoids double install later |
| Skia PathBuilder for chamfer | Pure StyleSheet (borderRadius) | Cannot produce 45° diagonal corner cuts — only rounded circles |
| Skia PathBuilder for chamfer | Polygon clip via `overflow:hidden` + rotation hack | Fragile, breaks on all screen widths without math |

**Installation:**
```bash
npx expo install @shopify/react-native-skia
```

**Version verification:**
```
npm view @shopify/react-native-skia version  →  2.6.2   (verified 2026-05-17)
```

---

## Package Legitimacy Audit

> Package Legitimacy Gate run 2026-05-17.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| @shopify/react-native-skia | npm | ~4 yrs (2022-04-06) | Very high (Shopify-maintained) | github.com/Shopify/react-native-skia | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none

**Postinstall script:** `node scripts/install-libs.js` — copies prebuilt Skia C++ binaries into place. This is the official Shopify distribution mechanism. [CITED: github.com/Shopify/react-native-skia/issues/780] Safe.

---

## Architecture Patterns

### System Architecture Diagram

```
index.tsx (FichaScreen)
  └── useCharacter() → c.nome, c.sabedoria
  └── LegendaryFrame (new component)
        ├── Canvas (Skia)  ← chamfered border drawn via PathBuilder
        └── TextInput (nome) + Text (sabedoria) overlaid inside frame
              ↳ style reads RPG.branco / RPG.preto (new MTG tokens)

constants/theme.ts
  └── RPG object  ← 6 mana keys updated to MTG hex
        └── consumed by all screens + LegendaryFrame
```

### Recommended Project Structure

```
components/rpg/
├── LegendaryFrame.tsx    # NEW — chamfered Skia frame component
└── ... (existing)

constants/
└── theme.ts              # MODIFY — update 6 mana color values

app/(tabs)/
└── index.tsx             # MODIFY — replace titleBar View with LegendaryFrame
```

### Pattern 1: Skia Canvas with PathBuilder (Chamfered Rectangle)

**What:** Draw an MTG-style chamfered (45° diagonal corner) border using Skia's imperative path API.
**When to use:** Whenever a diagonal-corner polygon shape is needed — cannot be done with StyleSheet.

```typescript
// Source: shopify.github.io/react-native-skia/docs/shapes/path
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

const CHAMFER = 12; // px — size of diagonal cut

function makeChamferPath(w: number, h: number, c: number) {
  const p = Skia.Path.Make();
  p.moveTo(c, 0);
  p.lineTo(w - c, 0);
  p.lineTo(w, c);
  p.lineTo(w, h - c);
  p.lineTo(w - c, h);
  p.lineTo(c, h);
  p.lineTo(0, h - c);
  p.lineTo(0, c);
  p.close();
  return p;
}

// Usage inside component:
<Canvas style={{ width: frameW, height: frameH }}>
  <Path
    path={makeChamferPath(frameW, frameH, CHAMFER)}
    color="transparent"
    style="stroke"
    strokeWidth={2}
  >
    <Color color={RPG.gold} />
  </Path>
</Canvas>
```

### Pattern 2: Theme Token Update (Non-Breaking)

**What:** Change existing mana color values in `RPG` object; all consumers auto-update.
**When to use:** Palette identity correction — old values were approx, new values are MTG-spec.

Current → New mapping (delta only):
```typescript
// constants/theme.ts — BEFORE (approximate dark-mode values)
branco:   '#e8e0cc'   // warm ivory
verde:    '#3a8a3a'   // mid green
vermelho: '#b52020'   // dark red
preto:    '#2a2030'   // very dark purple
azul:     '#1a5ab0'   // mid blue
incolor:  '#888070'   // warm grey

// constants/theme.ts — AFTER (MTG canonical hex)
branco:   '#F8F2E2'   // marfim MTG
verde:    '#00733E'   // floresta profunda MTG
vermelho: '#D3202A'   // carmesim MTG
preto:    '#150B00'   // ônix MTG
azul:     '#0E68AB'   // safira MTG
incolor:  '#A6ADB5'   // pedra cinza MTG
```

> **Downstream risk:** `brancoLight`, `verdeLight`, `vermelhoLight`, `pretoLight`, `azulLight` are companion tokens derived conceptually (not programmatically) from the base colors. They should be reviewed when the base colors change, but they are ONLY used for mana steppers in `index.tsx`. Since the new base colors are brighter/more saturated, the Light variants may need slight tweaking — but this is not a breaking change, just a visual refinement that the planner may defer.

### Pattern 3: LegendaryFrame as Overlay-Composite

**What:** `LegendaryFrame` renders a fixed-height Canvas below and Text/TextInput absolutely positioned on top. Avoids nesting React Native Text inside a Skia Canvas (unsupported).

```typescript
// Source: [ASSUMED] — standard RN compositing pattern
// Canvas is the background, RN children are overlaid with position:absolute
<View style={{ position: 'relative', height: FRAME_H }}>
  <Canvas style={StyleSheet.absoluteFill}>
    <Path path={borderPath} ... />
    <Path path={fillPath} color={RPG.headerBg} />
  </Canvas>
  <View style={[StyleSheet.absoluteFill, styles.frameContent]}>
    <TextInput value={nome} ... />
    <Text>{`SAB: ${sabedoria.acumulada} / ${sabedoria.disponivel}`}</Text>
  </View>
</View>
```

### Anti-Patterns to Avoid

- **Nesting RN Text inside Skia Canvas:** Canvas has its own renderer — RN components are not children. Always composite via absolute positioning.
- **Hardcoding hex in component styles:** New MTG colors must go into `constants/theme.ts` and be referenced as `RPG.branco` etc. — not inline hex strings (per project CONVENTIONS.md).
- **Updating `*Light` companion tokens blindly:** They are used as mana stepper text colors. Too-dark or too-light companions cause contrast failure. Verify each visually.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Chamfered (diagonal corner) border | Custom RN View clipping, rotation hack | Skia `PathBuilder` | PathBuilder is GPU-native, pixel-perfect, zero layout hacks |
| GPU-composited gradient fill | LinearGradient from expo-linear-gradient | Skia `LinearGradient` shader (Phase 18) | Skia already installed; expo-linear-gradient adds a dependency for Phase 18's work |

**Key insight:** Phase 15 installs Skia *only* to unlock the chamfered frame. Full shader work (mana VFX) is Phase 18 — don't implement shaders in Phase 15.

---

## Common Pitfalls

### Pitfall 1: Skia PathBuilder — wrong import
**What goes wrong:** `Skia.PathBuilder.Make()` fails with "Skia.PathBuilder is undefined" at runtime.
**Why it happens:** There are two APIs — `Skia.Path.Make()` (imperative) vs the higher-level SVG string approach. `PathBuilder` exists in some Skia versions but the primary API in 2.x is `Skia.Path.Make()` with chained methods.
**How to avoid:** Use `Skia.Path.Make()` then call `.moveTo()`, `.lineTo()`, `.close()` — verified from official docs path page. [CITED: shopify.github.io/react-native-skia/docs/shapes/path]
**Warning signs:** Runtime error mentioning `undefined is not an object (evaluating 'Skia.PathBuilder')`.

### Pitfall 2: SDK 54 import ordering (legacy risk, now self-patched)
**What goes wrong:** `SkiaViewApi doesn't exist` or blank Canvas on SDK 54.
**Why it happens:** Expo SDK 54's `experimentalImportSupport` Metro plugin reordered Skia's internal imports, breaking NativeSetup initialization. [CITED: github.com/expo/expo/issues/39277]
**How to avoid:** The react-native-skia package self-patched this. With `npx expo install @shopify/react-native-skia` (which installs 2.6.2), the fix is included. No metro.config.js changes needed.
**Warning signs:** If blank Canvas appears, check that installed version is >= the patched version (~1.6+ for this specific issue).

### Pitfall 3: MTG hex colors — contrast with existing dark backgrounds
**What goes wrong:** `RPG.branco = '#F8F2E2'` (near-white) is used as text color against `RPG.bg = '#0a0806'` — high contrast, fine. But `RPG.preto = '#150B00'` (near-black) used as text on a dark surface becomes invisible.
**Why it happens:** MTG card physical colors are designed for light card stock. On dark UI they need different role assignment.
**How to avoid:** Treat the 6 MTG hex values as **identity/accent colors** (borders, glows, mana symbols) — not as universal text/background colors. Dark UI backgrounds remain `RPG.bg`/`RPG.surface`. MTG palette is additive.
**Warning signs:** Any text with `color: RPG.preto` in the dark theme renders invisible.

### Pitfall 4: Canvas dimension before layout
**What goes wrong:** `Skia.Path.Make()` is called with `width=0, height=0` before the View has measured.
**Why it happens:** `useCanvasSize()` returns `{width:0, height:0}` on first render.
**How to avoid:** Use `onLayout` to measure the container width, then pass known dimensions to `LegendaryFrame` via props, OR use `useCanvasSize` hook inside Canvas and recompute path reactively.
**Warning signs:** Frame appears as a tiny dot or zero-size canvas.

### Pitfall 5: `*Light` companion tokens after palette shift
**What goes wrong:** After updating `RPG.verde` to `#00733E`, the companion `RPG.verdeLight = '#4aaa4a'` is now visually inconsistent (wrong shade family).
**Why it happens:** The Light variants were hand-tuned for the old darker base values.
**How to avoid:** After updating base tokens, visually inspect the mana stepper row in index.tsx. Adjust Light variants if they no longer look like tinted versions of the new base.

---

## Code Examples

### Verified: Basic Skia Canvas + Path import

```typescript
// Source: docs.expo.dev/versions/latest/sdk/skia/
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
```

### Verified: Chamfered path construction

```typescript
// Source: shopify.github.io/react-native-skia/docs/shapes/path
function makeChamferPath(w: number, h: number, chamfer: number) {
  const p = Skia.Path.Make();
  p.moveTo(chamfer, 0);
  p.lineTo(w - chamfer, 0);
  p.lineTo(w, chamfer);
  p.lineTo(w, h - chamfer);
  p.lineTo(w - chamfer, h);
  p.lineTo(chamfer, h);
  p.lineTo(0, h - chamfer);
  p.lineTo(0, chamfer);
  p.close();
  return p;
}
```

### Verified: Canvas as view background with RN overlay

```typescript
// Source: shopify.github.io/react-native-skia/docs/canvas/overview
// Canvas is a standard RN view — compositing with position:absolute children works normally
<View style={{ height: FRAME_HEIGHT }}>
  <Canvas style={StyleSheet.absoluteFill}>
    <Path path={path} color={RPG.headerBg} style="fill" />
    <Path path={path} color={RPG.gold} style="stroke" strokeWidth={2} />
  </Canvas>
  {/* RN children laid over Canvas normally */}
  <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
    <TextInput style={styles.nameInput} value={nome} onChangeText={onNomeChange} />
  </View>
</View>
```

### Verified: Current header structure to replace

```typescript
// Source: app/(tabs)/index.tsx lines 39–54 (read 2026-05-17)
// This is the titleBar block that LegendaryFrame replaces:
<View style={styles.titleBar}>
  <View style={styles.titleRow}>
    <Text style={styles.gameTitle}>Magic Kéos</Text>
    <TouchableOpacity style={styles.fichasBtn} onPress={() => setShowManager(true)}>
      <Text style={styles.fichasBtnText}>Fichas</Text>
    </TouchableOpacity>
  </View>
  <TextInput
    style={styles.nameInput}
    value={c.nome}
    onChangeText={setNome}
    placeholder="Nome do personagem"
    placeholderTextColor={RPG.textDark}
  />
</View>
// LegendaryFrame must preserve: nome input, "Fichas" button, game title
// It adds: chamfered border, MTG visual identity
// It reads sabedoria from props (Phase 15 spec: nome + sabedoria in frame)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Skia 1.x (RN 0.71–0.78) | Skia 2.x (requires RN >= 0.78, React >= 19) | 2025 | 2.x is not backward-compatible with old RN |
| expo-dev-client required for Skia | Included in Expo Go | ~SDK 51+ | No separate build needed for development |

**Deprecated:**
- `Skia 1.x`: not compatible with React 19 / RN 0.79+. This project is on RN 0.81.5 + React 19.1 — must use 2.x.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Compositing Skia Canvas + RN absolutePosition overlay works as described | Code Examples / Pattern 3 | LegendaryFrame implementation must change — e.g. use Skia text primitives instead |
| A2 | `RPG.*Light` companion tokens only used in mana stepper row (index.tsx) | Pitfall 5 | Other consumers also affected; need broader audit before updating Light variants |
| A3 | SDK 54 Skia import-ordering issue is fully resolved in 2.6.2 without metro changes | Pitfall 2 | May need metro.config.js workaround (disable experimentalImportSupport) |

---

## Open Questions (RESOLVED)

1. **Should `LegendaryFrame` show sabedoria inline or only nome?**
   - What we know: UI-03 spec says "nome + sabedoria" in header.
   - What's unclear: Does "sabedoria" mean Acumulada only, or Acumulada/Disponível split?
   - Recommendation: Show both counters (Acumulada / Disponível) as the design doc specifies a "dual counter" for sabedoria. Keep compact (e.g., "SAB 12/8").
   - RESOLVED: LegendaryFrame shows sabedoria as "SAB: {acumulada}/{disponivel}" — both counters displayed, aligning with PATTERNS.md interface (sabedoriaAcumulada + sabedoriaDisponivel props) and RESEARCH.md recommendation.

2. **Does the `fichasBtnText` ("Fichas") button stay inside LegendaryFrame or move outside?**
   - What we know: Currently in `titleBar`, which LegendaryFrame replaces.
   - What's unclear: MTG legendary frame typically has no utility button.
   - Recommendation: Keep "Fichas" button inside the frame (top-right corner), within the absolutePosition overlay layer, for continuity of existing UX.
   - RESOLVED: fichasBtnText button stays inside LegendaryFrame in the absolutePosition overlay (top-right corner), preserving existing UX continuity.

3. **Should `*Light` companion tokens be updated in Phase 15 or deferred?**
   - What we know: They are only used in mana steppers in index.tsx. Changing base mana colors makes them visually inconsistent.
   - Recommendation: Update Light variants in Phase 15 alongside base tokens to avoid a visual regression. The risk is low (6 additional hex values in theme.ts).
   - RESOLVED: *Light companion tokens are updated in Phase 15 alongside the 6 base mana tokens to prevent visual regression in the mana stepper row.

---

## Environment Availability

> Step 2.6: No external services or CLIs beyond npm are required for this phase.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| npm | Package install | ✓ | (project uses npm lockfile) | — |
| Expo Go | Dev testing (no dev client needed) | ✓ | Included in Expo Go | expo-dev-client if Expo Go unavailable |
| @shopify/react-native-skia | UI-01, UI-03 | Not yet installed | 2.6.2 available | — |

**Missing dependencies with no fallback:**
- `@shopify/react-native-skia` — must be installed (Phase 15 wave 0 task)

---

## Validation Architecture

> `nyquist_validation: true` in config.json — section required.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (project has no automated tests) |
| Config file | none |
| Quick run command | `npx tsc --noEmit && npx expo lint` |
| Full suite command | `npx tsc --noEmit && npx expo lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-01 | @shopify/react-native-skia importable in a component | smoke (import) | `npx tsc --noEmit` — import errors surface as TS errors | ❌ Wave 0: add import in LegendaryFrame.tsx |
| UI-02 | theme.ts contains 6 MTG hex values | smoke (lint) | `npx tsc --noEmit` — value mis-type fails | ❌ Wave 0: update theme.ts |
| UI-03 | LegendaryFrame renders in header without breaking layout | manual-only | Visual inspection in Expo Go | ❌ Wave 0: create component |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit`
- **Per wave merge:** `npx tsc --noEmit && npx expo lint`
- **Phase gate:** TypeScript clean + Expo Go smoke test (manual) before marking complete

### Wave 0 Gaps
- [ ] `components/rpg/LegendaryFrame.tsx` — covers UI-01 (Skia import) + UI-03 (chamfered frame)
- [ ] `constants/theme.ts` MTG hex update — covers UI-02
- [ ] No new test framework needed — ESLint + tsc are the only validators per CLAUDE.md

---

## Security Domain

> Phase installs one dependency and modifies theme constants. No authentication, session, user input beyond existing character name field, or network calls involved.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no (existing TextInput unchanged) | — |
| V6 Cryptography | no | — |

**Threat pattern relevant to this phase:** Postinstall script in `@shopify/react-native-skia` (`node scripts/install-libs.js`) copies prebuilt native binaries. This is the Shopify-maintained distribution mechanism, present since 2022, [CITED: github.com/Shopify/react-native-skia] and confirmed [OK] by slopcheck. No additional security concern.

---

## Sources

### Primary (HIGH confidence)
- [docs.expo.dev/versions/latest/sdk/skia/](https://docs.expo.dev/versions/latest/sdk/skia/) — Expo official Skia page; confirmed "Included in Expo Go", install command
- [shopify.github.io/react-native-skia/docs/getting-started/installation/](https://shopify.github.io/react-native-skia/docs/getting-started/installation/) — Skia install; peer deps (RN >= 0.78, React >= 19)
- [shopify.github.io/react-native-skia/docs/shapes/path](https://shopify.github.io/react-native-skia/docs/shapes/path) — Path API, SVG path commands, chamfered rect example
- [shopify.github.io/react-native-skia/docs/canvas/overview](https://shopify.github.io/react-native-skia/docs/canvas/overview) — Canvas component structure, import pattern
- npm registry: `npm view @shopify/react-native-skia version` → `2.6.2` (2026-05-17)
- `constants/theme.ts` — read directly (2026-05-17): all 11 RPG color tokens, 5 mana base + 5 mana light + incolor
- `app/(tabs)/index.tsx` — read directly (2026-05-17): titleBar structure, lines 39–54
- Design doc: `magic keos/NOVA UI APP/Blueprint Visual...txt` — MTG hex palette specification

### Secondary (MEDIUM confidence)
- [github.com/expo/expo/issues/39277](https://github.com/expo/expo/issues/39277) — SDK 54 Skia import-ordering issue; status "outdated" (self-patched in skia package)
- [expo.dev/changelog/sdk-54](https://expo.dev/changelog/sdk-54) — SDK 54 release notes; RN 0.81, React 19.1, last SDK to allow legacy arch

### Tertiary (LOW confidence)
- None.

---

## Metadata

**Confidence breakdown:**
- Skia install mechanics: HIGH — verified via official Expo docs + npm registry
- SDK 54 compatibility: HIGH — specific issue tracked and self-patched in library; Expo docs show "Included in Expo Go"
- Chamfered path approach: HIGH — verified from official Skia Path docs
- MTG hex values: HIGH — sourced directly from project's own design documents
- `*Light` companion token risk: MEDIUM — assumed they're only used in mana steppers (quick grep would confirm)
- LegendaryFrame compositing pattern (RN overlay on Canvas): [ASSUMED] — standard RN compositing; no explicit doc statement

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (Skia is stable; Expo SDK moves slowly)
