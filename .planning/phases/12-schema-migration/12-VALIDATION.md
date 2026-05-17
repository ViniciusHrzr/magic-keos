---
phase: 12
slug: schema-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed (testes automatizados deferred per STATE.md) |
| **Config file** | none |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx tsc --noEmit`
- **Before `/gsd:verify-work`:** Full suite must be green + manual smoke test
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 1 | SCHEMA-01 (SC-1) | — | N/A | type-check | `npx tsc --noEmit` | ❌ Wave 0 | ⬜ pending |
| 12-01-02 | 01 | 1 | SCHEMA-01 (SC-2) | — | N/A | type-check | `npx tsc --noEmit` | ❌ | ⬜ pending |
| 12-01-03 | 01 | 1 | SCHEMA-01 (SC-3) | — | N/A | manual | App cold-start with legacy ficha | ❌ manual | ⬜ pending |
| 12-01-04 | 01 | 1 | SCHEMA-01 (SC-4) | — | N/A | manual | App cold-start with legacy ficha | ❌ manual | ⬜ pending |
| 12-01-05 | 01 | 1 | SCHEMA-01 (SC-5) | — | N/A | manual smoke | Run app, check no error overlay | ❌ manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all automated checks — `npx tsc --noEmit` is available without installation.

*Manual verifications require app cold-start with a legacy character ficha (see Manual-Only Verifications).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| String→EquipItem migration preserves nome | SCHEMA-01 (SC-3) | No test framework; requires runtime state read from AsyncStorage | 1. Load app with ficha that has `equipamentos.arma = "Espada"`. 2. Verify slot shows nome "Espada" without crash. |
| inventario→inventarioSlots migration | SCHEMA-01 (SC-4) | Requires runtime AsyncStorage read | 1. Load app with ficha that has `inventario = "Corda, Tocha"`. 2. Verify slot 0 shows "Corda, Tocha" and remaining 19 slots are empty strings. |
| App cold-starts without crash | SCHEMA-01 (SC-5) | End-to-end runtime check | 1. Kill and reopen app. 2. Verify no error overlay appears. 3. Verify character tab loads normally. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
