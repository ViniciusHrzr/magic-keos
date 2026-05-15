# TESTING.md
_Last updated: 2026-05-15_

# Testing Patterns

**Analysis Date:** 2026-05-15

## Test Framework

**Runner:** None configured.

No test runner is installed. `package.json` contains no `jest`, `vitest`, `@testing-library/react-native`, or any other test framework in either `dependencies` or `devDependencies`:

```json
"devDependencies": {
  "@types/react": "~19.1.0",
  "eslint": "^9.25.0",
  "eslint-config-expo": "~10.0.0",
  "typescript": "~5.9.2"
}
```

**Assertion Library:** None.

**Run Commands:** No test script defined. The `scripts` block contains only:
```json
"scripts": {
  "start": "expo start",
  "reset-project": "node ./scripts/reset-project.js",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint"
}
```

## Test File Organization

**No test files exist.** A recursive search of the entire project found:
- Zero `*.test.ts` files
- Zero `*.test.tsx` files
- Zero `*.spec.ts` files
- Zero `*.spec.tsx` files
- Zero `__tests__/` directories
- Zero `jest.config.*` files
- Zero `vitest.config.*` files

## Test Coverage Level

**None.** The codebase has 0% automated test coverage.

## What Is Tested

Nothing is tested via automated tooling.

## What Is Not Tested

All application logic is untested. The highest-value untested areas:

**Core state logic (`store/CharacterContext.tsx`):**
- `migrate()` function — converts legacy/v1 data formats to current `Character` shape; brittle with `any` parameter, currently has no safety net
- `update()` callback — the central mutation function for all character data; incorrect immutable spread would silently corrupt state
- `importJson()` — parses arbitrary user-supplied JSON, merges via `migrate()`; boolean return makes testing the success/failure paths straightforward
- `exportJson()` — serializes current character; trivial but untested
- `createChar()`, `deleteChar()`, `switchTo()` — multi-character management flows
- AsyncStorage persistence (load on mount, save on update, legacy key migration)
- `genId()` — collision risk on `Date.now()` tie

**Data validation (`types/character.ts`):**
- `defaultCharacter` shape matches `Character` interface — TypeScript catches this at compile time, but runtime default spreading assumptions are untested
- Array length assumptions (e.g., `magicas: Array(20)`, `dominios: Array(12)`, `velocidade.boxes: Array(15)`) — context code mutates these by index without bounds checks

**Business logic in screens:**
- `magia.tsx`: `addToMemoria()`, `addToFoco()` — find first empty slot and insert; edge case: all slots full silently no-ops
- `grimorio.tsx`: `filteredGroups` useMemo — spell filtering by color/grade/type/search; correctness untested
- `grimorio.tsx`: `addDomainToFicha()` — deduplication and slot-finding logic
- `magia.tsx`: `getDomainColor()`, `spellByName()`, `isDomainName()` — helpers that query `grimoire` data array

**Components:**
- `NumericStepper` — clamping behavior, edge inputs (empty string, non-numeric)
- `DiceTrack` / `DieBubble` — color cycling through `COLOR_CYCLE` array, count calculation
- `VenenoTracker` — toggle logic (`i < value ? i : i + 1`), effect threshold rendering
- `CheckboxGrid` — toggle immutability
- `CharacterManager` — export/import/delete flows, Alert confirmation interaction

## Linting (Only Quality Gate)

The only automated quality check in place is ESLint via `expo lint`:

```javascript
// eslint.config.js
const expoConfig = require('eslint-config-expo/flat');
module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*'] },
]);
```

This uses `eslint-config-expo` which bundles `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `@typescript-eslint` rules. TypeScript compilation (`tsc --noEmit`) via the `strict: true` tsconfig provides static type checking.

## Recommendations for Adding Tests

If tests are added, the Expo-recommended setup is:

```bash
npx expo install jest-expo @testing-library/react-native @testing-library/jest-native
```

**Suggested `jest.config.js`:**
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
```

**Highest-priority test targets (by bug risk):**

1. `store/CharacterContext.tsx` — `migrate()` and `importJson()` are pure functions that can be unit-tested without React or AsyncStorage mocks
2. `types/character.ts` — `defaultCharacter` completeness against `Character` interface (TypeScript already enforces this, but runtime shape tests add regression protection)
3. `components/rpg/NumericStepper.tsx` — numeric clamping logic
4. `components/rpg/VenenoTracker.tsx` — toggle and effect threshold logic
5. `app/(tabs)/grimorio.tsx` — `filteredGroups` memo filter logic (exportable as a pure utility)

---

*Testing analysis: 2026-05-15*
