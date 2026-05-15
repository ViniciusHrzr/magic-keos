# CONCERNS.md
_Last updated: 2026-05-15_

---

## HIGH PRIORITY

### 1. AsyncStorage writes on every keystroke — no debounce

**File:** `store/CharacterContext.tsx` — lines 112–116

Every call to any setter (`setNome`, `setProficiencias`, `setHabilidades`, `setInventario`, `setReceitas`, `setMagica`, `setDominio`, etc.) synchronously triggers `AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next))` inside the `update()` callback. When a user types into a `TextInput`, this fires on every character.

- **Risk:** JSON-serializes the entire `allChars` object (potentially multiple characters) to disk on every keypress. On low-end Android devices this causes noticeable jank and may cause data corruption if two writes race.
- **Fix:** Debounce the `AsyncStorage.setItem` write by ~300–500 ms using `useRef` + `setTimeout`. Keep state updates immediate; only delay the persistence.

---

### 2. Context value object is not memoized — all consumers re-render on any state change

**File:** `store/CharacterContext.tsx` — lines 222–231

The `<CharacterContext.Provider value={{ character, setNome, ... }}>` object is created as a plain object literal on every render. All setter functions (`setNome`, `setSabedoria`, `setVida`, etc. — lines 121–154) are **not wrapped in `useCallback`**, which means they are new function references on every render.

- **Risk:** Any component that consumes the context (`useCharacter()`) re-renders on every state change, even if it only uses `character.nome`. The entire screen tree (FichaScreen, MagiaScreen, GrimorioScreen) re-renders on each character update.
- **Fix:** Wrap the provider `value` in `useMemo`. Wrap all setter functions in `useCallback` (only `update`, `charList`, `switchTo`, `createChar`, `deleteChar`, `exportJson`, `importJson` are currently memoized; all the `set*` functions at lines 121–154 are not).

---

### 3. Font loading result ignored — custom font may render incorrectly on first paint

**File:** `app/_layout.tsx` — lines 14–17

```tsx
useFonts({
  PlanewalkerDings: require('@/assets/fonts/PlanewalkerDings.otf'),
});
```

The return value `[loaded, error]` from `useFonts` is discarded. The app renders immediately regardless of whether `PlanewalkerDings` has loaded. Components that use `fontFamily: 'PlanewalkerDings'` (e.g., spell cost glyphs in `magia.tsx` and `grimorio.tsx`) will fall back to the system font on the first render frame.

There is also no `SplashScreen.preventAutoHideAsync()` / `SplashScreen.hideAsync()` pattern, so the splash screen dismisses before fonts are guaranteed ready.

- **Risk:** Spell cost symbols (encoded in PlanewalkerDings) display as garbage characters until the font loads, which is visible to users on app launch.
- **Fix:** Capture `const [fontsLoaded] = useFonts(...)` and return `null` (or keep splash visible) until `fontsLoaded` is true.

---

### 4. IP base/bonus inputs accept negative numbers — no input clamping

**File:** `app/(tabs)/index.tsx` — lines 228, 239

```tsx
onChangeText={t => onIpChange('ipBase', parseInt(t) || 0)}
onChangeText={t => onIpChange('ipBonus', parseInt(t) || 0)}
```

`parseInt('-5')` returns `-5`, and the `|| 0` fallback only activates on `NaN`. Unlike `NumericStepper` which has a `clamp(min, max)` helper, the raw IP inputs have no minimum enforcement. A user can type `-999` into IP Base or IP Bonus and it persists to storage.

- **Risk:** Corrupted character data with negative IP values that have no valid game meaning.
- **Fix:** Apply `Math.max(0, parseInt(t) || 0)` at minimum, or replace with `NumericStepper`.

---

### 5. No loading state during initial AsyncStorage hydration

**File:** `store/CharacterContext.tsx` — lines 72–108; used in `app/(tabs)/index.tsx`, `app/(tabs)/magia.tsx`, `app/(tabs)/grimorio.tsx`

The `CharacterProvider` loads data asynchronously via `useEffect`, but there is no `isLoaded` boolean exposed. During the first render frame — before the `useEffect` completes — `character` equals `defaultCharacter` (all zeros, empty strings). All screens render with this empty state immediately.

- **Risk:** On a slow device or with large stored data, users briefly see a blank/zeroed character sheet. If a user rapidly edits during this window, their edits may be overwritten when hydration completes (the effect calls `setAllChars` with storage data, clobbering in-progress state).
- **Fix:** Add `const [isLoaded, setIsLoaded] = useState(false)` to the provider; set it to `true` after hydration. Expose it via context and render a loading indicator in screens.

---

### 6. Silent AsyncStorage write failures outside of initial load

**File:** `store/CharacterContext.tsx` — lines 116, 163, 170, 174, 191, 193, 210, 214

All `AsyncStorage.setItem()` calls outside the initial `load` effect (inside `update()`, `switchTo`, `createChar`, `deleteChar`, `importJson`) are fire-and-forget — no `.catch()` handler, no user notification.

- **Risk:** If storage is full or the OS revokes storage access (low memory, permission changes), character data is lost silently. The user sees no error and believes their data is saved.
- **Fix:** Add `.catch(err => { /* show Alert or set error state */ })` to all non-awaited `AsyncStorage.setItem` calls, or centralize in a `safeSave()` utility.

---

## MEDIUM PRIORITY

### 7. `COLOR_HEX` and `GRAU_COLORS` constants duplicated across two files

**Files:** `app/(tabs)/magia.tsx` — lines 327–340; `app/(tabs)/grimorio.tsx` — lines 20–35

Both files independently define:
```ts
const COLOR_HEX: Record<SpellColor, string> = { branco: RPG.branco, verde: RPG.verdeLight, ... }
const GRAU_COLORS = ['#888', RPG.gold, RPG.goldLight, '#fff']
```

- **Risk:** If a mana color or grau color is updated, it must be changed in two places. Drift is likely.
- **Fix:** Move both constants to `data/grimoire.ts` or a new `constants/spell.ts` and import from both screens.

---

### 8. All three screen files are oversized — mixing layout, logic, and sub-components

**Files:**
- `app/(tabs)/magia.tsx` — 766 lines (contains `SpellDetailView`, `DomainView` as inline functions)
- `app/(tabs)/index.tsx` — 510 lines (contains `InstanceBlock` as inline function, `manaTypes`, `vidaIcon`)
- `app/(tabs)/grimorio.tsx` — 516 lines (contains `SpellDetail`, `StatPill` as inline functions)

Sub-components (`SpellDetailView`, `DomainView`, `InstanceBlock`, `SpellDetail`, `StatPill`) are defined inside the screen file rather than extracted to `components/rpg/`. This makes the files hard to navigate and prevents reuse.

- **Fix:** Extract sub-components to `components/rpg/SpellDetail.tsx`, `components/rpg/DomainView.tsx`, `components/rpg/InstanceBlock.tsx`.

---

### 9. `grimoire.ts` uses `as any[]` to cast raw JSON and `as SpellType` to bypass validation

**File:** `data/grimoire.ts` — lines 25, 34

```ts
export const grimoire: Spell[] = (rawSpells as any[])
  .filter(s => s.nome && colorMap[s.cor])
  .map(s => ({
    tipo: (s.tipo as SpellType) || '[F]',
    grau: (s.grau as 0 | 1 | 2 | 3) ?? 0,
  }));
```

The `as any[]` cast bypasses TypeScript's JSON import validation. The `grau` cast is particularly unsafe: if the JSON contains `grau: 5`, it is typed as `0 | 1 | 2 | 3` at compile time but is actually `5` at runtime, leading to `GRAU_COLORS[5]` being `undefined` (rendering as `undefined` color).

- **Fix:** Replace casts with runtime validation using a type guard or `zod`. At minimum, clamp `grau` to `Math.min(3, Math.max(0, s.grau ?? 0)) as 0|1|2|3`.

---

### 10. Hardcoded magic numbers for fixed-length arrays — no named constants

**Files:** `types/character.ts` — lines 163–170; `store/CharacterContext.tsx` — lines 24–28

Array sizes (15 boxes for velocidade/canalizacao, 15 entries for memoria/foco, 12 domínios, 20 mágicas) are hardcoded literals scattered in both the type definition and the migration function.

- **Risk:** Changing any of these capacities requires hunting down every occurrence. The migration at line 24 uses `Array(20).fill('')` which must stay synchronized with `defaultCharacter` at line 170.
- **Fix:** Extract to named constants: `export const SLOTS = { BOXES: 15, MEMO: 15, DOMINIOS: 12, MAGICAS: 20 }` in `types/character.ts` and use throughout.

---

### 11. `migrate()` function has no version field — migration is fragile

**File:** `store/CharacterContext.tsx` — lines 13–31

The `migrate()` function checks for specific field shapes to detect old formats (`magicasReceitas`, numeric mana values), but stored data has no schema version. As the data model evolves, determining which migrations to apply becomes increasingly fragile — a field rename could be misidentified as an old format.

- **Fix:** Add a `schemaVersion: number` field to `Character` type and `defaultCharacter`. Migrations switch on version number. Bump version on each schema change.

---

### 12. `explore.tsx` re-exports `magia.tsx` — confusing dead code

**File:** `app/(tabs)/explore.tsx`

```ts
// This file is intentionally left empty — tab removed from navigation.
export { default } from './magia';
```

The tab is hidden via `href: null` in `_layout.tsx`, but the file still re-exports MagiaScreen. If the tab ever becomes visible again (e.g., `href: null` is accidentally removed), users see a duplicate Magia screen labelled "explore".

- **Fix:** Either delete `explore.tsx` entirely, or replace with a proper placeholder that won't accidentally expose Magia content.

---

### 13. `modal.tsx` is a boilerplate placeholder with no real functionality

**File:** `app/modal.tsx`

The modal screen contains only Expo boilerplate ("This is a modal") and is registered in `_layout.tsx` but never navigated to from any user-facing screen. It is dead code.

- **Fix:** Either implement the modal with real content, or remove it from `_layout.tsx` and delete the file.

---

### 14. Context provider value object recreated on every render

**File:** `store/CharacterContext.tsx` — lines 222–231

The object literal passed to `CharacterContext.Provider`'s `value` prop is created fresh every render because the many un-memoized setter functions are new references each time. This is distinct from issue #2 above but compounding: even if setters were stable, the value object itself would change identity if not wrapped in `useMemo`.

---

## LOW PRIORITY

### 15. Source documents committed to the repository

**Directory:** `magic keos/` (directory name contains a space)

The directory `magic keos/` contains:
- `Ficha Magic Kéos v.0.4.pdf` (2.2 MB)
- `Grimório Total v.0.4.xlsx` (84 MB)
- `Magic no Universo Kéos v.0.4.docx` (3 MB)
- `Planewalker Dings.otf`

An 84 MB Excel file committed to a git repository significantly inflates clone/pull times and repository size. These are reference documents, not build artifacts.

- **Fix:** Add `magic keos/` to `.gitignore` and use git-lfs or external document storage for large binaries.

---

### 16. `app/(tabs)/explore.tsx` is registered in navigation but serves no purpose

Already noted as #12. The `href: null` hides it from tab bar but it still participates in the router's route tree.

---

### 17. Hardcoded color strings outside of the theme system

**Files:** `components/rpg/VenenoTracker.tsx` — lines 74, 80, 85, 86, 89, 90; `app/(tabs)/grimorio.tsx` — line 35

```ts
// VenenoTracker.tsx
borderColor: '#4a1a1a'        // line 74  - not in RPG theme
backgroundColor: '#6b1010'    // line 80  - not in RPG theme
color: '#c87070'              // line 86  - not in RPG theme
color: '#ff4444'              // line 90  - not in RPG theme

// grimorio.tsx
const GRAU_COLORS = ['#888', ...]  // line 35 - '#888' not in RPG theme
```

These colors are defined inline and cannot be themed. The `RPG.red` / `RPG.redLight` constants exist but these files use ad-hoc hex values instead.

- **Fix:** Add `redDark`, `redCritical`, `redText` variants to `constants/theme.ts` and reference them.

---

### 18. `DiceTrack` uses array index as key (`key={i}`) with a mutable list

**File:** `components/rpg/DiceTrack.tsx` — line 26

```tsx
{dice.map((d, i) => (
  <DieBubble key={i} color={d} onChange={c => handleChange(i, c)} />
))}
```

Since dice order is fixed (always 5 slots), this is not a practical bug today, but it is a bad pattern that would cause subtle bugs if dice were ever reordered.

---

### 19. `MemoGrid` uses index as key for TextInput list

**File:** `components/rpg/MemoGrid.tsx` — line 24

```tsx
{entries.map((val, i) => (
  <TextInput key={i} ... />
))}
```

React does not re-use TextInput instances when key changes, so edits mid-list could re-focus incorrect inputs if items were ever inserted/deleted. Currently safe (fixed length), but a fragile pattern.

---

### 20. `grimoire.ts` sorts domains alphabetically — different from game canonical order

**File:** `data/grimoire.ts` — line 38

```ts
export const domains = [...new Set(grimoire.map(s => s.dominio))].sort();
```

Alphabetical sort may not match the game book order. If canonical ordering matters for the grimório view, this silently reorders content.

---

### 21. `spellImages.ts` is auto-generated but included in version control

**File:** `data/spellImages.ts` — 741 lines (auto-generated comment on line 1)

The file is generated by `scripts/generate_image_map.py` but is committed to the repo. This creates drift risk: if images are added/removed and the script is not re-run, the map is stale.

- **Fix:** Add `data/spellImages.ts` to `.gitignore` and regenerate at build time via a `prebuild` npm script.

---

## MISSING PIECES

### Error Boundaries
No React error boundary exists anywhere in the component tree. An uncaught render error in any component (e.g., a `null` spell image reference, a corrupted character field) will crash the entire app with a red screen in development or a blank white screen in production. Wrapping `<CharacterProvider>` children in an `<ErrorBoundary>` would contain crashes to individual screens.

### Offline Handling / Network Status
Not applicable to this app's current feature set (all data is local). But the `expo-updates` OTA update system is configured in `app.json`, and there is no handling for the case where an OTA update fails mid-download (no fallback messaging to the user).

### Input Validation / Character Data Integrity
There is no validation layer between user input and storage. Values like `vida.total: -999`, `mana.azul.base: 10000`, `afinidade.branco: 150` can all be stored. The `setVeneno` and `setAfinidade` setters clamp their values, but `setVida`, `setMana`, `setSabedoria`, and the IP inputs have no bounds.

### Undo / Undo History
Character data is mutated immediately and persisted. There is no undo functionality. A misclick on a dice bubble or a wrong number in a stepper cannot be undone without manual correction.

### No Test Coverage
Zero test files exist in the project. There is no `jest.config.js`, no `vitest.config.ts`, no `*.test.ts` files. The migration logic (`migrate()` in `CharacterContext.tsx`), the grimoire data transformation (`grimoire.ts`), and the character ID generation (`genId()`) are all completely untested. A regression in `migrate()` could silently corrupt all saved characters for existing users on an OTA update.

### Accessibility
Zero accessibility props (`accessibilityLabel`, `accessibilityRole`, `accessibilityHint`) exist anywhere in the codebase. Interactive elements — all `TouchableOpacity` buttons for dice cycling, veneno tracking, domain expansion — are invisible to screen readers. This is a significant gap if accessibility compliance is ever required.

### Character Backup / Cloud Sync
Data is stored only in device AsyncStorage. If the app is uninstalled, all character data is lost. There is no iCloud/Google Drive sync, no server backup, and the only recovery mechanism is the manual JSON export feature in `CharacterManager`.

---

## STRENGTHS

### Clean TypeScript types for domain model
`types/character.ts` defines a complete, strongly-typed `Character` interface with no `any` usage. The `AttrDice`, `SkillValue`, `DieColor` types are precise and reused across components and the store. TypeScript strict mode is enabled in `tsconfig.json`.

### Centralized state in a single Context
All character state lives in `store/CharacterContext.tsx`. There is no prop drilling — every component accesses state via `useCharacter()`. The `update()` functional updater pattern (line 112) correctly handles concurrent React state updates.

### Data migration strategy is in place
The `migrate()` function in `CharacterContext.tsx` handles two historical schema versions (`magicasReceitas` rename, numeric-to-object mana format) and a legacy storage key (`LEGACY_KEY`). Schema evolution has been thought about and partially implemented.

### Grimoire data is cleanly separated from UI
The 736-spell grimoire lives in `data/grimorio.json` with a typed adapter in `data/grimoire.ts` that normalizes color names and provides the `domains` export. Screen components consume `grimoire` and `domains` directly without embedding data inline.

### Component decomposition in `components/rpg/`
Reusable UI primitives (`NumericStepper`, `DiceTrack`, `DieBubble`, `SkillRow`, `CheckboxGrid`, `MemoGrid`, `VenenoTracker`, `AfinidadeSection`, `SectionHeader`, `CharacterManager`) are properly extracted and imported by screens, avoiding copy-paste of common patterns.

### Theme system via `constants/theme.ts`
All colors, with named semantic tokens (`RPG.bg`, `RPG.surface`, `RPG.gold`, `RPG.border`, etc.) are centralized in `constants/theme.ts`. The vast majority of components reference these tokens rather than hardcoding hex values (with the exceptions noted in issue #17).

### Export/import for character portability
`CharacterManager.tsx` exposes JSON export (via native `Share`) and import (via text paste), giving users a way to back up and restore their data without requiring cloud infrastructure.

### Expo New Architecture enabled
`app.json` sets `newArchEnabled: true` and `experiments.reactCompiler: true`, positioning the app to benefit from React 19's compiler optimizations (which partially mitigates the memoization concerns in issues #2 and #14, though not fully).
