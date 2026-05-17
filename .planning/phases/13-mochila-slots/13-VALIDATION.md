---
phase: 13
slug: mochila-slots
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Nenhum (testes automatizados adiados para v2) |
| **Config file** | nenhum |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit` |
| **Estimated runtime** | ~5 segundos |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx tsc --noEmit`
- **Before `/gsd:verify-work`:** Full suite must be green + smoke manual nos 5 critérios
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | MOCH-01 | — | N/A | type-check | `npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 13-01-02 | 01 | 1 | EQP-01 | — | N/A | type-check | `npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 13-01-03 | 01 | 1 | EQP-01/02 | — | N/A | type-check | `npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 13-01-04 | 01 | 1 | EQP-03 | — | N/A | type-check | `npx tsc --noEmit` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing `npx tsc --noEmit` covers all automated gates — no new test files needed.

*Existing infrastructure covers all automated phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Tab "Mochila" aparece na tab bar | MOCH-01 | Sem test runner no projeto | Iniciar app, verificar ícone Mochila na tab bar |
| magia.tsx sem seções Inventário/Equipamentos | MOCH-02 | Já satisfeito pela Phase 12 | `grep -n "Inventário\|Equipamentos" app/(tabs)/magia.tsx` deve retornar zero linhas |
| Picker abre com lista correta por slot | EQP-01 | Interação UI | Tocar slot Arma → confirmar lista de armas do livro; tocar slot Escudo → confirmar lista de escudos |
| Nome custom persiste após fechar app | EQP-02 | Requer AsyncStorage real | Inserir nome custom em slot → fechar app → reabrir → confirmar persistência |
| Card colapsado exibe nome + count melhorias | EQP-03 | Renderização visual | Equipar item com 0 melhorias → confirmar card colapsado mostra nome; Phase 14 adicionará melhorias |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
