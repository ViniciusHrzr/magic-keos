# STRUCTURE.md
_Last updated: 2026-05-15_

## Directory Layout

```
magic-keos/
├── app/                        # Expo Router route tree (screens)
│   ├── _layout.tsx             # Root layout: CharacterProvider + Stack navigator
│   ├── modal.tsx               # Unused placeholder modal route
│   └── (tabs)/                 # Tab group
│       ├── _layout.tsx         # Tab navigator config (3 visible tabs)
│       ├── index.tsx           # "Ficha" screen — character sheet
│       ├── magia.tsx           # "Magia" screen — magic tracking
│       ├── grimorio.tsx        # "Grimório" screen — spell compendium
│       └── explore.tsx         # Hidden tab (re-exports magia, dead code)
│
├── components/                 # Reusable UI components
│   ├── rpg/                    # RPG-domain components (game-specific)
│   │   ├── AfinidadeSection.tsx
│   │   ├── CharacterManager.tsx
│   │   ├── CheckboxGrid.tsx
│   │   ├── DiceTrack.tsx
│   │   ├── DieBubble.tsx
│   │   ├── MemoGrid.tsx
│   │   ├── NumericStepper.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── SkillRow.tsx
│   │   └── VenenoTracker.tsx
│   └── ui/                     # Generic/platform UI components
│       ├── collapsible.tsx     # Animated collapsible (Expo template, unused in app)
│       ├── external-link.tsx   # Opens URLs in browser (Expo template)
│       ├── haptic-tab.tsx      # Tab bar button with haptic feedback
│       ├── hello-wave.tsx      # Animated wave (Expo template, unused)
│       ├── icon-symbol.tsx     # Cross-platform icon (Android/web via MaterialIcons)
│       ├── icon-symbol.ios.tsx # iOS-specific icon (native SF Symbols)
│       ├── parallax-scroll-view.tsx  # Expo template, unused in app
│       ├── themed-text.tsx     # Themed text wrapper (Expo template)
│       └── themed-view.tsx     # Themed view wrapper (Expo template)
│
├── store/                      # Global state
│   └── CharacterContext.tsx    # React Context: all character state + persistence
│
├── types/                      # TypeScript type definitions
│   └── character.ts            # Character interface, AttrDice, SkillValue, defaultCharacter
│
├── constants/                  # App-wide constants
│   └── theme.ts                # RPG color palette, Colors, Fonts
│
├── data/                       # Static game data
│   ├── grimoire.ts             # Spell[] and domains[] derived from grimorio.json
│   ├── grimorio.json           # Raw spell data (~900 spells, ~7300 lines)
│   ├── spell-image-map.json    # (Likely intermediate; spellImages.ts is the active map)
│   └── spellImages.ts          # Auto-generated require() map: spell name → image asset
│
├── hooks/                      # Custom React hooks
│   ├── use-color-scheme.ts     # Re-exports useColorScheme from react-native
│   ├── use-color-scheme.web.ts # Web override for color scheme
│   └── use-theme-color.ts      # Resolves themed color from Colors constant
│
├── assets/                     # Static assets
│   ├── fonts/
│   │   └── PlanewalkerDings.otf   # Custom font for MTG-style mana cost symbols
│   ├── images/                 # App icons, splash, logos
│   └── spell-images/           # Per-spell JPG artwork (~900 files)
│
├── scripts/                    # Developer utility scripts (not part of app)
│   ├── generate_image_map.py   # Generates data/spellImages.ts from assets/spell-images/
│   ├── extract_spell_images.py # Extracts images from source files
│   └── reset-project.js        # Expo project reset utility
│
├── magic keos/                 # Source design documents (not part of app build)
│   ├── Ficha Magic Kéos v.0.4.pdf
│   ├── Grimório Total v.0.4.xlsx
│   ├── grimorio.json           # Source of truth for grimoire data
│   ├── Magic no Universo Kéos v.0.4.docx
│   └── Planewalker Dings.otf
│
├── .planning/                  # GSD planning documents
│   └── codebase/               # Codebase analysis documents
├── app.json                    # Expo app configuration
├── package.json                # npm dependencies and scripts
└── tsconfig.json               # TypeScript configuration (path alias @/ → root)
```

## Directory Purposes

**`app/`:**
- Purpose: All navigable screens, defined by file name (Expo Router convention)
- Contains: Layout files (`_layout.tsx`) and screen files
- Key files: `_layout.tsx` (root), `(tabs)/_layout.tsx` (tab bar), `(tabs)/index.tsx` (main screen)

**`components/rpg/`:**
- Purpose: Game-specific UI components — all interact with the RPG domain model
- Contains: Stateless presentation components that receive values and onChange callbacks
- Key files: `CharacterManager.tsx` (only component that calls `useCharacter()` directly), all others are pure prop-driven

**`components/ui/`:**
- Purpose: Generic platform-adapter components and Expo template scaffolding
- Contains: Icon abstraction, haptic tab button, and several unused Expo template components
- Key files: `icon-symbol.tsx` / `icon-symbol.ios.tsx` (used in tab bar), `haptic-tab.tsx` (used in tab bar)
- Note: `collapsible.tsx`, `hello-wave.tsx`, `parallax-scroll-view.tsx`, `external-link.tsx`, `themed-text.tsx`, `themed-view.tsx` are Expo template remnants not used by any RPG screen

**`store/`:**
- Purpose: Global application state
- Contains: Single `CharacterContext.tsx` file
- Key files: `CharacterContext.tsx` — exports `CharacterProvider`, `useCharacter`, `CharInfo` type

**`types/`:**
- Purpose: TypeScript interfaces for domain model
- Contains: `character.ts` only
- Key files: `character.ts` — the canonical shape of all character data

**`constants/`:**
- Purpose: App-wide configuration values
- Contains: `theme.ts` only
- Key files: `theme.ts` — the `RPG` object is the single source for all colors

**`data/`:**
- Purpose: Static game data — the spell compendium
- Contains: JSON source, TypeScript module exports, auto-generated image map
- Key files: `grimoire.ts` (typed export), `grimorio.json` (raw data), `spellImages.ts` (generated)

**`hooks/`:**
- Purpose: Reusable React hooks
- Contains: Thin wrappers/re-exports for color scheme and theme utilities
- Note: The domain-specific hook (`useCharacter`) lives in `store/CharacterContext.tsx`, not here

**`assets/spell-images/`:**
- Purpose: JPG artwork for each spell in the grimoire (~900 files)
- Generated: No — manually curated or extracted
- Committed: Yes (bundled into app)
- Note: `scripts/generate_image_map.py` regenerates `data/spellImages.ts` when images are added

**`scripts/`:**
- Purpose: Developer tooling only — not imported by the app
- Generated: No
- Committed: Yes

## Screen Inventory

| Route | File | Tab Label | Purpose |
|-------|------|-----------|---------|
| `/(tabs)/` | `app/(tabs)/index.tsx` | Ficha | Character sheet: name, stats (sabedoria, vida, mana, veneno), afinidade, corpo/mente/espirito blocks (dice + skills), proficiencias, habilidades |
| `/(tabs)/magia` | `app/(tabs)/magia.tsx` | Magia | Magic tracking: velocidade, canalização, memória, foco (with checkbox/memo grids), domains list, magic spells list, receitas, inventário, equipamentos |
| `/(tabs)/grimorio` | `app/(tabs)/grimorio.tsx` | Grimório | Full spell compendium: search, color/grade/type filters, domain accordion list, spell detail modal, add-to-character actions |
| `/(tabs)/explore` | `app/(tabs)/explore.tsx` | (hidden) | Dead — re-exports magia screen, tab is hidden via `href: null` |
| `/modal` | `app/modal.tsx` | (stack modal) | Unused Expo template placeholder |

## Component Inventory

### `components/rpg/` — Game Components

| File | Props | Purpose |
|------|-------|---------|
| `SectionHeader.tsx` | `title: string, rightContent?: ReactNode` | Gold header bar with optional right-side content (used as section divider throughout screens) |
| `NumericStepper.tsx` | `value, onChange, min?, max?, label?, color?, compact?` | +/− stepper with direct text input; supports compact layout mode |
| `DiceTrack.tsx` | `label: string, dice: AttrDice, onChange` | Row of 5 `DieBubble` components for an attribute's dice pool; shows count |
| `DieBubble.tsx` | `color: DieColor, onChange, size?` | Single rotated-square die slot; tap cycles through null → branco → verde → vermelho → preto → azul |
| `SkillRow.tsx` | `label: string, value: SkillValue, onChange` | Skill label with two TextInputs (base / temp values) |
| `VenenoTracker.tsx` | `value: number (0–10), onChange` | 10-bubble track for poison level; shows active effect descriptions below |
| `AfinidadeSection.tsx` | `value: Afinidade, onChange` | 5-color affinity bars with percentage TextInput per color |
| `CheckboxGrid.tsx` | `boxes: boolean[], onChange, cols?` | Grid of toggle squares (used for velocidade/canalização slots) |
| `MemoGrid.tsx` | `entries: string[], onChange, cols?, placeholder?` | Grid of text inputs (used for memória/foco spell slot entries) |
| `CharacterManager.tsx` | `visible: boolean, onClose: () => void` | Modal panel for listing/switching/creating/deleting/exporting/importing characters; calls `useCharacter()` internally |

### `components/ui/` — Platform/Utility Components

| File | Purpose | Used in App |
|------|---------|------------|
| `icon-symbol.tsx` | Cross-platform icon (Android/web) via MaterialIcons | Yes — tab bar |
| `icon-symbol.ios.tsx` | iOS icon via native SF Symbols | Yes — tab bar (iOS only) |
| `haptic-tab.tsx` | Tab bar button with iOS haptic feedback | Yes — tab bar |
| `collapsible.tsx` | Animated expand/collapse | No (Expo template) |
| `external-link.tsx` | Opens URL in system browser | No (Expo template) |
| `hello-wave.tsx` | Animated waving emoji | No (Expo template) |
| `parallax-scroll-view.tsx` | Parallax hero scroll view | No (Expo template) |
| `themed-text.tsx` | Text with theme-aware color | No (only in modal.tsx placeholder) |
| `themed-view.tsx` | View with theme-aware background | No (only in modal.tsx placeholder) |

### Local sub-components (defined within screen files)

| Location | Name | Purpose |
|----------|------|---------|
| `app/(tabs)/index.tsx` | `InstanceBlock` | Renders corpo/mente/espirito block with IP inputs, DiceTrack rows, SkillRow rows |
| `app/(tabs)/magia.tsx` | `SpellDetailView` | Bottom-sheet spell detail card (name, image, stats, effect) |
| `app/(tabs)/magia.tsx` | `DomainView` | Bottom-sheet domain browser showing all spells in a domain with Mem/Foco add buttons |
| `app/(tabs)/grimorio.tsx` | `SpellDetail` | Bottom-sheet spell detail card with "+ Mágica" action button |
| `app/(tabs)/grimorio.tsx` | `StatPill` | Small pill badge for spell stat (grau/tipo/custo) |

## Key File Locations

**Entry Point:**
- `app/_layout.tsx` — Root layout, wraps entire app in `CharacterProvider`

**Global State:**
- `store/CharacterContext.tsx` — All character data, all setters, AsyncStorage persistence

**Domain Model:**
- `types/character.ts` — `Character` interface, `AttrDice`, `SkillValue`, `defaultCharacter`

**Design Tokens:**
- `constants/theme.ts` — `RPG` color palette (single source for all hex values)

**Game Data:**
- `data/grimoire.ts` — Typed export of spell data (`grimoire: Spell[]`, `domains: string[]`)
- `data/grimorio.json` — Raw source spell data (~900 entries)
- `data/spellImages.ts` — Auto-generated `require()` map for spell artwork

**Custom Font:**
- `assets/fonts/PlanewalkerDings.otf` — Registered as `'PlanewalkerDings'` in `app/_layout.tsx`

## Naming Conventions

**Files:**
- Screen files: `kebab-case.tsx` (e.g., `index.tsx`, `magia.tsx`, `grimorio.tsx`)
- Component files: `PascalCase.tsx` for rpg components (e.g., `NumericStepper.tsx`, `DiceTrack.tsx`)
- Utility files: `kebab-case.ts` for hooks/constants (e.g., `use-color-scheme.ts`, `theme.ts`)
- Layout files: `_layout.tsx` (Expo Router convention)

**Components:**
- React components: PascalCase (`SectionHeader`, `NumericStepper`)
- Default exports used for all component files

**Types:**
- Interfaces: PascalCase (`Character`, `Spell`, `SkillValue`, `CharInfo`)
- Type aliases: PascalCase (`DieColor`, `AttrDice`, `SpellColor`, `SpellType`)

**Constants/Tokens:**
- RPG color object: `RPG.tokenName` (e.g., `RPG.gold`, `RPG.surface`)
- All theme colors accessed via `RPG.*`, never inline hex strings

**State setters:**
- All context setter functions: `setXxx` pattern (e.g., `setNome`, `setVida`, `setAttrDice`)

## Where to Add New Code

**New screen/route:**
- Create `app/(tabs)/newscreen.tsx` for a new tab
- Register in `app/(tabs)/_layout.tsx` as `<Tabs.Screen name="newscreen" options={{...}} />`

**New RPG game component:**
- Create `components/rpg/NewComponent.tsx`
- Import `RPG` from `@/constants/theme` for colors
- Accept all data/callbacks via props; call `useCharacter()` only if truly necessary
- Export as default

**New character field:**
- Add to `Character` interface in `types/character.ts`
- Add default value in `defaultCharacter` in `types/character.ts`
- Add setter in `store/CharacterContext.tsx` following the `update()` pattern
- Expose setter in `CharacterContextType` interface
- Include in provider's `value` object

**New static game data:**
- JSON data: add to `data/` directory
- Export via typed `.ts` module (see `data/grimoire.ts` pattern)

**New spell images:**
- Add JPGs to `assets/spell-images/`
- Run `scripts/generate_image_map.py` to regenerate `data/spellImages.ts`

**New constants:**
- Colors: add to `RPG` object in `constants/theme.ts`
- Other constants: add to `constants/theme.ts` or create new file in `constants/`

**New hooks:**
- Create `hooks/use-xxx.ts`
- Note: domain hooks should live in `store/` or with their context if tightly coupled

## Special Directories

**`.planning/`:**
- Purpose: GSD planning system documents
- Generated: Yes (by GSD commands)
- Committed: Per project convention

**`assets/spell-images/`:**
- Purpose: ~900 spell artwork JPGs, one per spell
- Generated: No (manually maintained / extracted)
- Committed: Yes (bundled with app)

**`magic keos/`** (directory with space in name):
- Purpose: Source design documents — PDFs, Excel, Word files used to design the game
- Generated: No
- Committed: Yes
- Note: NOT imported by the app; used only for reference by developers

---

*Structure analysis: 2026-05-15*
