# ARCHITECTURE.md
_Last updated: 2026-05-15_

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│                     Expo Router (file-based routing)                 │
│                          app/_layout.tsx                             │
├───────────────────────────────┬─────────────────────────────────────┤
│       Tab Navigator           │         Stack Navigator              │
│   app/(tabs)/_layout.tsx      │      app/modal.tsx (unused)          │
├──────────┬────────┬───────────┤                                      │
│  index   │ magia  │ grimorio  │                                      │
│ (Ficha)  │(Magia) │(Grimório) │                                      │
└────┬─────┴───┬────┴─────┬─────┘                                     │
     │         │          │                                            │
     └─────────┴──────────┘
           │  all screens consume via hook
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│              CharacterProvider (React Context)                       │
│              store/CharacterContext.tsx                              │
│   State: allChars (Record<id, Character>), currentId                │
│   Persistence: AsyncStorage (@magic_keos_chars_v2 / _current_v2)   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
           ┌─────────────────┴──────────────────────┐
           ▼                                        ▼
┌─────────────────────┐              ┌──────────────────────────────┐
│  types/character.ts │              │  data/grimoire.ts            │
│  Character interface │              │  Spell[], domains[]          │
│  defaultCharacter    │              │  (from grimorio.json)        │
│  AttrDice, SkillValue│              │  ~900 spells, many domains   │
└─────────────────────┘              └──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   RPG Components (components/rpg/)                   │
│  SectionHeader · NumericStepper · DiceTrack · DieBubble             │
│  SkillRow · VenenoTracker · AfinidadeSection · CheckboxGrid         │
│  MemoGrid · CharacterManager                                        │
└─────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   constants/theme.ts (RPG palette)                   │
│   Dark RPG color system, Fonts — consumed by all components/screens  │
└─────────────────────────────────────────────────────────────────────┘
```

## App Architecture Pattern

**File-based routing via Expo Router v6.** The `app/` directory directly maps to navigation routes. No manual route configuration exists. Navigation structure is declared entirely through directory structure and layout files.

**React Context for global state.** There is no Zustand, Redux, MobX, or other state management library. `store/CharacterContext.tsx` is a single React Context provider that holds all character data, all setter functions, and character management operations (create/switch/delete/export/import).

**Flat component model.** Components do not have their own local persistence or store connections. All components receive values and setters as props or call `useCharacter()` directly. No component is "smart" in an independent sense — all business data flows from `CharacterContext`.

## Navigation Structure

```text
app/
├── _layout.tsx            Root Stack — wraps entire app in CharacterProvider + DarkTheme
│   └── (tabs)/            Tab group
│       ├── _layout.tsx    Tab bar with 3 visible tabs (explore hidden via href:null)
│       ├── index.tsx      Tab "Ficha"    — character sheet editor
│       ├── magia.tsx      Tab "Magia"   — magic/spell tracking
│       ├── grimorio.tsx   Tab "Grimório" — full spell reference browser
│       └── explore.tsx    Hidden tab (re-exports magia, was a placeholder)
└── modal.tsx              Stack modal (unused placeholder from Expo template)
```

**Tab bar configuration** (`app/(tabs)/_layout.tsx`):
- "Ficha" — `person.fill` icon — character attributes, stats, skills
- "Magia" — `sparkles` icon — magic tracking, domains, inventory
- "Grimório" — `book.fill` icon — full spell compendium with search/filter
- "Explore" — hidden (`href: null`), not accessible from UI

## State Management

### CharacterContext (`store/CharacterContext.tsx`)

Single global context. State shape:

```typescript
{
  allChars: Record<string, Character>;  // All saved characters keyed by generated ID
  currentId: string;                     // ID of the active character
}
```

Derived from these two: `character` (the active `Character` object) is computed as `allChars[currentId] ?? defaultCharacter`.

**Persistence strategy:**
- `@magic_keos_chars_v2` — AsyncStorage key storing all characters as JSON
- `@magic_keos_current_v2` — AsyncStorage key storing the active character ID
- `@kairos_character_v1` — Legacy key from prior app name, migrated on first load

**Update pattern:**
```typescript
const update = useCallback((patch: (prev: Character) => Character) => {
  setAllChars(prev => {
    const next = { ...prev, [currentId]: patch(prev[currentId]) };
    AsyncStorage.setItem(CHARS_KEY, JSON.stringify(next));  // fire-and-forget
    return next;
  });
}, [currentId]);
```
Every setter calls `update()` with a transform function. Persistence is a side effect of every state update — no explicit save button.

**Migration function** (`migrate()` in `store/CharacterContext.tsx`): Handles schema changes between app versions. Converts legacy numeric mana to `{base, total}` shape, converts string `magicasReceitas` to array `magicas`.

### Context API surface

All setter names follow the `setXxx` convention:
- Simple field setters: `setNome`, `setVeneno`, `setProficiencias`, `setHabilidades`, `setInventario`, `setReceitas`
- Nested field setters: `setSabedoria(k, v)`, `setVida(k, v)`, `setMana(k, field, v)`, `setAfinidade(k, v)`
- Instance (corpo/mente/espirito) setters: `setInstanceIP(instance, field, v)`, `setAttrDice(instance, attr, dice)`, `setSkill(instance, skill, value)`
- Partial update setters: `setVelocidade(patch)`, `setMemoria(patch)`, `setCanalizacao(patch)`, `setFoco(patch)`
- Array index setters: `setDominio(idx, v)`, `setMagica(idx, v)`, `setEquipamento(k, v)`
- Character management: `switchTo(id)`, `createChar()`, `deleteChar(id)`, `exportJson()`, `importJson(json)`

## Data Flow

### Character editing (primary flow)

```
User taps +/- in NumericStepper
  → onChange prop called (defined in screen)
    → setVida('total', newValue) called on context
      → update(p => ({...p, vida: {...p.vida, total: v}}))
        → setAllChars(...) — re-render triggered
          → AsyncStorage.setItem(CHARS_KEY, ...) — fire-and-forget persistence
            → All screens consuming useCharacter() see new value
```

### Grimoire → Character (spell add flow)

```
User browses GrimorioScreen
  → Taps "+ Mágica" on SpellDetail modal
    → onAddMagica(idx, spell.nome) — setMagica from useCharacter()
      → updates magicas[idx] in character state
        → persisted automatically
          → MagiaScreen reflects new spell entry on next render
```

### Domain lookup cross-screen flow

```
MagiaScreen: user types domain name in dominios TextInput
  → setDominio(idx, value) → stored in character.dominios
    → grimoire.some(s => s.dominio === value) checked on render
      → if match: color strip + expand button appear
        → GrimorioScreen: addDomainToFicha() checks c.dominios
          → shows "✓ já está na ficha" if already present
```

### Character switch / multi-character flow

```
FichaScreen: user taps "Fichas" button
  → CharacterManager modal opens (overlay on top of tab navigator)
    → lists charList (derived from allChars)
      → user taps a character name → switchTo(id)
        → setCurrentId(id) + AsyncStorage update
          → All screens re-render with new character data
```

## Key Abstractions

### `Character` type (`types/character.ts`)
The single source of truth for what a character looks like. Contains nested objects: `sabedoria`, `vida`, `mana`, `afinidade`, `corpo`, `mente`, `espirito`, `velocidade`, `memoria`, `canalizacao`, `foco`, and flat arrays/strings for `dominios`, `magicas`, etc.

- `AttrDice` — `[DieColor, DieColor, DieColor, DieColor, DieColor]` — 5-slot array of colored dice
- `SkillValue` — `{ base: number; temp: number }` — skill with base and temporary modifier
- `DieColor` — `'branco' | 'verde' | 'vermelho' | 'preto' | 'azul' | null`

### `Spell` type / grimoire data (`data/grimoire.ts`)
Static read-only data loaded from `data/grimorio.json` (~900 spells across many domains). Exposed as `grimoire: Spell[]` and `domains: string[]`. The grimoire is never mutated — character sheets reference spell names as strings, then look up details by name at render time.

### `RPG` design token object (`constants/theme.ts`)
All colors used across the app. Never use raw hex strings in components — always reference `RPG.gold`, `RPG.surface`, etc. Also exports `Colors` (light/dark) and `Fonts` (platform-specific serif/sans).

### `InstanceBlock` sub-component (`app/(tabs)/index.tsx`, local)
A private sub-component defined within `index.tsx` (not exported). Renders a "Corpo", "Mente", or "Espírito" block with IP inputs, dice tracks, and skill rows. Receives all data and callbacks via props — no direct context access.

## Screen → Component → Store Relationships

### FichaScreen (`app/(tabs)/index.tsx`)

```
FichaScreen
  └── useCharacter() → character data + setters
  ├── CharacterManager (modal) → useCharacter() internally
  ├── SectionHeader (rpg)
  ├── NumericStepper (rpg) — sabedoria, vida, mana values
  ├── VenenoTracker (rpg) — veneno: number (0–10)
  ├── AfinidadeSection (rpg) — afinidade object
  ├── InstanceBlock (local, x3: Corpo/Mente/Espírito)
  │   ├── SectionHeader (rpg)
  │   ├── DiceTrack (rpg) → DieBubble (rpg) — AttrDice per attribute
  │   └── SkillRow (rpg) — SkillValue per skill
  └── TextInput (raw) — proficiencias, habilidades
```

### MagiaScreen (`app/(tabs)/magia.tsx`)

```
MagiaScreen
  └── useCharacter() → character data + setters
  ├── SectionHeader (rpg)
  ├── NumericStepper (rpg) — velocidade, memoria, canalizacao, foco values
  ├── CheckboxGrid (rpg) — velocidade.boxes, canalizacao.boxes (boolean[15])
  ├── MemoGrid (rpg) — memoria.entries, foco.entries (string[15])
  ├── TextInput (raw) — dominios[], magicas[], receitas, inventario
  ├── Equipment grid (raw TextInput) — equipamentos object
  ├── SpellDetailView (local modal) — reads from grimoire by spell name
  └── DomainView (local modal) — reads from grimoire by domain name
```

### GrimorioScreen (`app/(tabs)/grimorio.tsx`)

```
GrimorioScreen
  └── useCharacter() → c.dominios, c.magicas, setDominio, setMagica
  └── grimoire / domains data (static import)
  ├── FlatList of DomainGroup items (computed via useMemo)
  │   └── renderDomain → domain row + spell rows (touchable)
  │       └── "add domain to ficha" writes to character.dominios
  └── SpellDetail (local modal)
      └── "+ Mágica" button writes to character.magicas
```

### CharacterManager (`components/rpg/CharacterManager.tsx`)

```
CharacterManager (Modal overlay)
  └── useCharacter() → charList, currentId, switchTo, createChar, deleteChar, exportJson, importJson
  ├── character list with switch/delete per item
  └── import/export via Share API and JSON text input
```

## Architectural Constraints

- **Threading:** Single-threaded React Native event loop. AsyncStorage calls are fire-and-forget (not awaited in setters) — no loading states for saves.
- **Global state:** `CharacterContext` is the only global state. It is a module-level singleton via React Context. All other state is local `useState` within screens or components.
- **Static data:** The grimoire is loaded once at import time (`data/grimoire.ts`) — it is never fetched or mutated. Spell images are bundled statically via `data/spellImages.ts` (auto-generated require map).
- **No async loading state for character:** On cold start, `allChars` is `{}` and `currentId` is `''` until the `useEffect` in `CharacterProvider` completes. During this brief window, screens render with `defaultCharacter`. No loading spinner exists.
- **No navigation between screens for spell detail:** Spell details open as bottom-sheet `Modal` overlays within each tab screen, not as separate routes.
- **Circular imports:** None detected.

## Anti-Patterns

### Spell detail logic duplicated across screens

**What happens:** `SpellDetailView` and `SpellDetail` are separate implementations of the same UI in `app/(tabs)/magia.tsx` and `app/(tabs)/grimorio.tsx` respectively. The spell detail card (header, stats pills, effect text, image) is written twice.

**Why it's wrong:** Any change to spell detail display must be made in two places. The two implementations have diverged (Grimório adds "+ Mágica" button; Magia adds "Mem"/"Foco" pills to domain view).

**Do this instead:** Extract a shared `SpellDetailCard` into `components/rpg/SpellDetailCard.tsx` with optional action slots.

### `explore.tsx` re-exports `magia.tsx`

**What happens:** `app/(tabs)/explore.tsx` is `export { default } from './magia'` — it is the same screen. The tab is hidden via `href: null`.

**Why it's wrong:** Dead code that creates confusion — a file that appears to be a route but is silently suppressed.

**Do this instead:** Delete `explore.tsx` since the tab is hidden and the screen is never reachable.

### `modal.tsx` is an unused Expo template placeholder

**What happens:** `app/modal.tsx` renders "This is a modal" with a back link. It is never linked to from any tab or component.

**Why it's wrong:** Dead code in the route tree — Expo Router still registers it as a route.

**Do this instead:** Delete `modal.tsx` or repurpose it if a global modal route is ever needed.

## Error Handling

**Strategy:** Minimal. Errors are swallowed at the storage layer.

**Patterns:**
- `CharacterProvider.load()` catches all AsyncStorage errors and creates a fresh character silently — no user notification.
- `importJson()` returns `boolean` (true/false); callers show `Alert` on false.
- No error boundaries in the component tree.
- No toast/snackbar system — feedback is inline text (`feedback` state in `SpellDetail`).

## Cross-Cutting Concerns

**Theming:** Dark-only theme. `RPG` object in `constants/theme.ts` is the design token system. `ThemeProvider` in root layout uses `DarkTheme` from React Navigation. `useThemeColor` hook exists but is minimally used — screens use `RPG.*` directly.

**Safe Area:** All main screens use `SafeAreaView` from `react-native-safe-area-context` with `edges={['top']}`. Modals use `useSafeAreaInsets()` to add `paddingBottom`.

**Keyboard:** All scrollable screens are wrapped in `KeyboardAvoidingView` with platform-aware `behavior`.

**Custom Font:** `PlanewalkerDings.otf` loaded in `app/_layout.tsx` via `expo-font`. Used exclusively for spell cost symbols (the font renders MTG-style mana symbols from custom glyphs).

**Haptics:** Tab bar buttons use `HapticTab` (`components/haptic-tab.tsx`) which triggers `Haptics.impactAsync` on iOS only.

---

*Architecture analysis: 2026-05-15*
