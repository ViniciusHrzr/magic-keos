---
phase: 02-qualidade-da-ficha
plan: "01"
subsystem: ficha
tags: [ficha, validation, numeric-input, ip-fields, FICHA-01]
requires: []
provides: [ip-non-negative-enforcement]
affects: [app/(tabs)/index.tsx]
decisions:
  - "Used NumericStepper default min=0 (no explicit min prop) — matches existing component contract and keeps zero new code"
  - "FICHA-02 (veneno clamp) confirmed pre-satisfied by VenenoTracker toggle UI — no work needed"
metrics:
  duration: "~1 minute"
  completed: "2026-05-15T10:02:45Z"
  tasks_completed: 1
  files_changed: 1
---

# Phase 2 Plan 1: IP Validation via NumericStepper Summary

**One-liner:** Replaced raw TextInput IP fields with NumericStepper (min=0 default) to enforce non-negative IP BASE and BÔNUS values, closing FICHA-01 with zero new validation code.

## Tasks Completed

### Task 1: Replace IP TextInputs with NumericStepper in InstanceBlock

**Commit:** `0d8f388`

**Before:**
```tsx
<View style={styles.ipRow}>
  <Text style={styles.ipLabel}>IP BASE</Text>
  <TextInput style={styles.ipInput} value={ipBase === 0 ? '' : String(ipBase)}
    onChangeText={t => onIpChange('ipBase', parseInt(t) || 0)} keyboardType="numeric" ... />
  <Text style={[styles.ipLabel, { marginLeft: 8 }]}>BÔNUS</Text>
  <TextInput style={styles.ipInput} value={ipBonus === 0 ? '' : String(ipBonus)}
    onChangeText={t => onIpChange('ipBonus', parseInt(t) || 0)} keyboardType="numeric" ... />
</View>
```

**After:**
```tsx
<View style={styles.ipRow}>
  <NumericStepper label="IP BASE" value={ipBase} onChange={v => onIpChange('ipBase', v)} compact />
  <NumericStepper label="BÔNUS" value={ipBonus} onChange={v => onIpChange('ipBonus', v)} compact />
</View>
```

**Style rules removed:** `ipLabel` and `ipInput` (orphans after replacement). `ipRow` retained (wrapper still used).

**Net diff:** 10 insertions, 36 deletions in `app/(tabs)/index.tsx`.

## Verification Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Exit 0 — no errors |
| `<NumericStepper` count in `index.tsx` | 7 (5 existing + 2 new — passes ≥6 threshold) |
| `label="IP BASE"` present | Line 231 — confirmed |
| `label="BÔNUS"` present | Line 237 — confirmed |
| `styles.ipInput` absent | Not found — confirmed |
| `styles.ipLabel` absent | Not found — confirmed |
| `ipInput:` style rule absent | Not found — confirmed |
| `ipLabel:` style rule absent | Not found — confirmed |
| `ipRow:` style rule present | Line 473 — confirmed |
| `parseInt(t) \|\| 0` absent in InstanceBlock | Not found — confirmed |
| `TextInput` import intact | Line 3 — confirmed |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all IP fields are wired to live state (`ipBase`, `ipBonus` from InstanceBlock props, connected to `setInstanceIP` in FichaScreen).

## Threat Flags

No new security-relevant surface introduced. T-02-01 mitigation is in place: NumericStepper clamps to [0, 999] before invoking `onChange`, making negative values unreachable from the UI path.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `app/(tabs)/index.tsx` | Modified | Replaced 2 TextInput IP fields with NumericStepper in InstanceBlock; removed ipLabel and ipInput style rules |

## Self-Check: PASSED

- [x] `app/(tabs)/index.tsx` exists and contains `<NumericStepper` with `label="IP BASE"` and `label="BÔNUS"`
- [x] Commit `0d8f388` exists in git log
- [x] `npx tsc --noEmit` exits 0
- [x] `styles.ipInput` not found in `app/(tabs)/index.tsx`
- [x] `styles.ipLabel` not found in `app/(tabs)/index.tsx`
- [x] `ipRow:` style rule still present at line 473
