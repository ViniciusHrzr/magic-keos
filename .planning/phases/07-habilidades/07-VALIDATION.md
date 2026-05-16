---
phase: 7
slug: 07-habilidades
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-16
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (built-in) |
| **Config file** | `tsconfig.json` |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx tsc --noEmit`
- **Before `/gsd:verify-work`:** TypeScript clean + all 7 grep checks pass
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | FIDE-12 | — | N/A | manual grep | `grep -n "1d4.*1d6.*1d8" data/habilidades.ts` | ✅ | ⬜ pending |
| 07-01-02 | 01 | 1 | FIDE-13 | — | N/A | manual grep | `grep -n "alvos adjacentes" data/habilidades.ts` | ✅ | ⬜ pending |
| 07-01-03 | 01 | 1 | FIDE-14 | — | N/A | manual grep | `grep -n "metade do deslocamento" data/habilidades.ts` | ✅ | ⬜ pending |
| 07-02-01 | 01 | 1 | FIDE-15 | — | N/A | manual grep | `grep -n "sofrer dano" data/habilidades.ts` | ✅ | ⬜ pending |
| 07-02-02 | 01 | 1 | FIDE-16 | — | N/A | manual grep | `grep -n "sem precisar de grim" data/habilidades.ts` | ✅ | ⬜ pending |
| 07-02-03 | 01 | 1 | FIDE-17 | — | N/A | manual grep | `grep -n "ao morrer" data/habilidades.ts` | ✅ | ⬜ pending |
| 07-02-04 | 01 | 1 | FIDE-18 | — | N/A | manual grep | `grep -n "alvo do ataque" data/habilidades.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test files required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All habilidade text corrections visible in app | FIDE-12–18 | No automated text test harness | Open app → Ficha tab → verify each corrected habilidade description in HabilidadesSection |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
