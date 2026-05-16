---
phase: 6
slug: proficiencias-mente-espirito
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-16
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (npx tsc --noEmit) |
| **Config file** | tsconfig.json |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx tsc --noEmit`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | FIDE-06, FIDE-07, FIDE-08, FIDE-09, FIDE-10 | — | N/A | compile | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 06-01-02 | 01 | 1 | FIDE-11 | — | N/A | compile | `npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. TypeScript compiler is already installed — no Wave 0 setup needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Proficiências MENTE display in Regras tab | FIDE-06 to FIDE-10 | Visual check only | Open Regras tab → §5 → verify Alquimia/Criatividade/Investigação/Mecânica/Sobrevivência descriptions match docx |
| Proficiências ESPÍRITO display in Regras tab | FIDE-11 | Visual check only | Open Regras tab → §5 → verify Provocar/Coordenar/Inspirar/Amedrontar/Distrair mechanics match docx |
| Investigação nome rename chips | FIDE-08 / D-01 | UI label check | Open Ficha → Proficiências → Investigação → verify chips show "Selo de Encantamento" and "Selo de Invocação" |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
