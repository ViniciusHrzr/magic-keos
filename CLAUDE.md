# Magic Kéos — Project Instructions

## Stack
Expo 54 · React Native 0.81 · TypeScript strict · Expo Router · AsyncStorage

## Required Skills — Use Always

### context7 (library docs)
When touching any library API (Expo, React Native, AsyncStorage, Expo Router, etc.) fetch live docs first:
- `mcp__plugin_context7_context7__resolve-library-id` → get library ID
- `mcp__plugin_context7_context7__query-docs` → fetch relevant docs

Never rely on training-data knowledge for library APIs in this project.

### frontend-design
Invoke `frontend-design:frontend-design` skill when:
- Planning or implementing any new screen, component, or UI section
- Reviewing visual consistency, spacing, or color usage
- Deciding on component structure for new features

### Expo skills
Use the appropriate Expo skill for Expo-specific tasks:
- `expo:expo-dev-client` — dev client config/troubleshooting
- `expo:expo-deployment` — EAS build/submit
- `expo:eas-update-insights` — OTA updates
- `expo:building-native-ui` — native UI patterns in RN
- `expo:native-data-fetching` — data fetching patterns
- `expo:upgrading-expo` — SDK upgrades
- `expo:expo-api-routes` — API routes
- `expo:expo-cicd-workflows` — CI/CD

## GSD Workflow Notes
- UI phases: run `gsd-ui-phase` (invokes frontend-design + context7 automatically)
- Before coding any component: resolve library docs via context7
- TypeScript must stay clean (`npx tsc --noEmit` passes) after every change
- No automated tests; ESLint + tsc are the only validators
