---
phase: 15
slug: 15-fundacao-visual-mtg
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — project has no automated test suite |
| **Config file** | none |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npx expo lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx tsc --noEmit && npx expo lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 1 | UI-01 | Package install only — no network calls from app code | smoke (node_modules + tsc) | `node -e "require('./node_modules/@shopify/react-native-skia/package.json')" && npx tsc --noEmit` | ❌ Wave 0 | ⬜ pending |
| 15-01-02 | 01 | 1 | UI-02 | Theme constants — no user input, no runtime eval | lint/type | `npx tsc --noEmit` | ❌ Wave 0 | ⬜ pending |
| 15-02-01 | 02 | 2 | UI-03 | Skia Canvas renders statically — no user data exposed | smoke (tsc) + manual | `npx tsc --noEmit` | ❌ Wave 0 | ⬜ pending |
| 15-02-02 | 02 | 2 | UI-03 | index.tsx wires LegendaryFrame — existing nome/sabedoria props | smoke (tsc) + manual | `npx tsc --noEmit && npx expo lint` | ✅ exists | ⬜ pending |
| 15-02-03 | 02 | 2 | UI-03 | Visual checkpoint — manual only | manual | (visual inspection in Expo Go) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `components/rpg/LegendaryFrame.tsx` — covers UI-01 (Skia import) + UI-03 (chamfered frame component)
- [ ] `constants/theme.ts` MTG hex update — covers UI-02

*No new test framework needed — ESLint + tsc are the only validators per CLAUDE.md.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| LegendaryFrame renders in header sem quebrar layout | UI-03 | Expo Go visual rendering não verificável via CLI | Abrir Expo Go → aba Ficha → confirmar: (1) borda chanfrada visível, (2) nome do personagem editável, (3) sabedoria "SAB: {acumulada}/{disponivel}" exibida, (4) botão Fichas funcional |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
