# External Integrations

_Last updated: 2026-05-15_

## APIs & External Services

**No third-party REST/GraphQL APIs are called at runtime.** The app is fully self-contained and offline-capable. All data is stored locally on the device.

**OTA Update Service:**
- Service: Expo Updates (EAS Update)
- SDK: `expo-updates` ~29.0.17
- Endpoint: `https://u.expo.dev/ba3503a8-46a7-46ff-b98a-dd03d77e5f9e`
- Config: `app.json` → `updates.url` and `runtimeVersion.policy: "appVersion"`
- Channel routing defined in `eas.json` (`development`, `preview`, `production`)

## Data Storage

**Local Key-Value Store:**
- Library: `@react-native-async-storage/async-storage` ^2.2.0
- Usage: sole persistence layer for all character data
- Implementation: `store/CharacterContext.tsx`
- Storage keys:
  - `@magic_keos_chars_v2` — map of all character objects (JSON-serialized)
  - `@magic_keos_current_v2` — ID of the active character
  - `@kairos_character_v1` — legacy key read once for migration, then removed
- Data format: JSON strings, written on every state update via `AsyncStorage.setItem`
- Migration logic: inline in `CharacterContext.tsx` (`migrate()` function handles v1 → v2 schema changes)

**File Storage:**
- No cloud file storage.
- Local assets (spell images, fonts) bundled at build time in `assets/`

**Databases:**
- None (no SQLite, Realm, WatermelonDB, or similar)

**Caching:**
- No explicit cache layer beyond AsyncStorage persistence

## Authentication & Identity

**No authentication system.** The app has no user accounts, login flows, or identity providers. Data is local to the device only.

## Sharing / Export

**React Native Share API:**
- Used in `components/rpg/CharacterManager.tsx` (`handleExport`)
- Triggers the native OS share sheet with a JSON string of the current character
- No external service involved — plain text sharing via `Share.share()`

**Import:**
- User pastes a JSON string directly into a `TextInput` in `CharacterManager`
- Parsed and validated locally via `importJson()` in `store/CharacterContext.tsx`

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Bugsnag, Datadog, or similar SDK)

**Analytics:**
- None detected (no Amplitude, Mixpanel, Firebase Analytics, or similar)

**Crash Reporting:**
- None detected beyond what Expo's default error overlay provides in development

**Logs:**
- No structured logging library; native `console.*` only

## Push Notifications

- None detected (no `expo-notifications`, Firebase Cloud Messaging, or APNs integration)

## CI/CD & Deployment

**Build Platform:**
- EAS Build — cloud build service for iOS and Android
- Config: `eas.json`
- Submission config: `submit.production` present (empty — fields to be filled when submitting to stores)

**OTA Delivery:**
- EAS Update — over-the-air JS bundle updates
- Three channels: `development`, `preview`, `production`
- Runtime version tied to `appVersion` (mismatched native builds will not receive OTA)

**Local Dev Scripts:**
- `npm run start` → `expo start`
- `npm run android` → `expo start --android`
- `npm run ios` → `expo start --ios`
- `npm run web` → `expo start --web`
- `npm run reset-project` → `node ./scripts/reset-project.js` (clears app back to scaffold)

## Expo Plugins Configured in app.json

| Plugin | Configuration |
|--------|---------------|
| `expo-router` | Default (no extra options) |
| `expo-splash-screen` | Image: `assets/images/splash-icon.png`, width 200px, contain mode, bg `#0a0806` (light + dark identical) |

## Expo Experiments Enabled

| Experiment | Value | Effect |
|------------|-------|--------|
| `typedRoutes` | `true` | Generates typed route params for expo-router |
| `reactCompiler` | `true` | Enables the React Compiler (auto-memoization) for the entire project |

## Deep Linking

- URL scheme: `magickeos://` (configured via `scheme: "magickeos"` in `app.json`)
- SDK: `expo-linking` ~8.0.11
- No explicit deep link handler routes found in current `app/` screens

## Environment Configuration

**Required environment variables:**
- None at runtime — the app does not read any `process.env` values at runtime beyond `EXPO_OS` (set automatically by Expo) used in `components/haptic-tab.tsx` to gate iOS haptics

**Secrets:**
- No `.env` files present
- EAS project ID (`ba3503a8-46a7-46ff-b98a-dd03d77e5f9e`) is non-secret and committed in `app.json`

## Local Asset Dependencies

| Asset | Path | Used For |
|-------|------|----------|
| Custom font | `assets/fonts/PlanewalkerDings.otf` | Loaded at startup via `expo-font` in `app/_layout.tsx` |
| Spell image map | `data/spell-image-map.json` | Grimoire spell images index |
| Grimoire data | `data/grimorio.json` | Spell/grimoire content data |
| Spell images | `assets/spell-images/` | Bundled spell artwork |

**Python utility scripts** (`scripts/extract_spell_images.py`, `scripts/generate_image_map.py`) are developer tools for generating `data/spell-image-map.json` — they are not part of the app runtime or build pipeline.

---

*Integration audit: 2026-05-15*
