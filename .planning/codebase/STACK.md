# Technology Stack

_Last updated: 2026-05-15_

## Languages

**Primary:**
- TypeScript ~5.9.2 — all application source files (`.ts`, `.tsx`)

**Secondary:**
- Python — utility scripts in `scripts/` (`extract_spell_images.py`, `generate_image_map.py`); not part of the app runtime
- JavaScript — config files (`eslint.config.js`, `scripts/reset-project.js`)

## Runtime

**Environment:**
- React Native 0.81.5 — mobile runtime for iOS and Android
- Web support via `react-native-web` ~0.21.0 and Expo's static web output

**Package Manager:**
- npm (lockfile: `package-lock.json` — present)

## Frameworks

**Core:**
- Expo ~54.0.33 — managed workflow, module system, dev tooling
- React 19.1.0 — UI rendering
- React Native 0.81.5 — native mobile platform layer
- expo-router ~6.0.23 — file-based routing (entry point: `expo-router/entry` in `package.json`)

**Navigation:**
- `@react-navigation/native` ^7.1.8 — navigation container and theming (`DarkTheme`, `ThemeProvider`)
- `@react-navigation/bottom-tabs` ^7.4.0 — tab bar navigator
- `@react-navigation/elements` ^2.6.3 — `PlatformPressable` used in haptic tab button

**Animation & Gestures:**
- `react-native-reanimated` ~4.1.1 — animation engine (imported globally in root `_layout.tsx`)
- `react-native-gesture-handler` ~2.28.0 — gesture recognition
- `react-native-worklets` 0.5.1 — worklet runtime (peer of Reanimated)

**Build/Dev:**
- EAS (Expo Application Services) — build and submission pipeline (`eas.json`, CLI >= 18.12.1)
- Expo Metro bundler — bundler (managed via Expo, no explicit metro.config.js found)
- Expo Router static web output — `web.output: "static"` in `app.json`

## Key Dependencies

**Critical:**
- `expo` ~54.0.33 — SDK base; pins all `expo-*` module versions
- `expo-router` ~6.0.23 — entire navigation/routing system; app entry point
- `@react-native-async-storage/async-storage` ^2.2.0 — sole persistence layer; all character data stored here
- `react-native-safe-area-context` ~5.6.0 — `useSafeAreaInsets` used in `CharacterManager` modal

**Expo Modules:**
- `expo-constants` ~18.0.13 — app metadata access
- `expo-font` ~14.0.11 — custom font loading (`PlanewalkerDings.otf` loaded in root layout)
- `expo-haptics` ~15.0.8 — haptic feedback on tab presses (iOS only)
- `expo-image` ~3.0.11 — optimized image component
- `expo-linking` ~8.0.11 — deep link / URL handling
- `expo-splash-screen` ~31.0.13 — splash screen management
- `expo-status-bar` ~3.0.9 — status bar control
- `expo-symbols` ~1.0.8 — SF Symbols integration
- `expo-system-ui` ~6.0.9 — system UI background color
- `expo-updates` ~29.0.17 — OTA update delivery
- `expo-web-browser` ~15.0.10 — in-app browser for external links

**Icons:**
- `@expo/vector-icons` ^15.0.3 — icon set library (wraps Ionicons, MaterialIcons, etc.)

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Extends: `expo/tsconfig.base`
- Strict mode: enabled (`"strict": true`)
- JSON imports: enabled (`"resolveJsonModule": true`)
- Path alias: `@/*` maps to `./*` (repo root) — used throughout the codebase
- Typed routes: enabled via `experiments.typedRoutes: true` in `app.json`
- React Compiler: enabled via `experiments.reactCompiler: true` in `app.json`

**Linting:**
- ESLint ^9.25.0 with flat config (`eslint.config.js`)
- Config preset: `eslint-config-expo` ~10.0.0
- Ignores: `dist/*`
- Run via: `npm run lint` → `expo lint`

**Build (EAS):**
- Config: `eas.json`
- CLI version: >= 18.12.1
- App version source: `remote` (managed by EAS)
- Profiles:
  - `development` — internal distribution, dev client, channel: `development`
  - `preview` — internal distribution, channel: `preview`
  - `production` — auto-increment build number, channel: `production`

**App:**
- Config: `app.json`
- Scheme: `magickeos` (deep link URL scheme)
- New Architecture: enabled (`newArchEnabled: true`)
- Orientation: portrait only
- User interface style: automatic (light/dark)
- Runtime version policy: `appVersion`

## Platform Requirements

**Development:**
- Node.js (version not pinned — no `.nvmrc` or `.node-version` found)
- Expo Go or a development client build for device testing
- EAS CLI >= 18.12.1 for builds

**Production:**
- iOS: supports iPhone and iPad (`supportsTablet: true`)
- Android: package `com.harusklan.magickeos`, edge-to-edge enabled, predictive back gesture disabled
- Web: static output (can be deployed to any static host)
- OTA updates delivered via `https://u.expo.dev/ba3503a8-46a7-46ff-b98a-dd03d77e5f9e`

---

*Stack analysis: 2026-05-15*
