# Phase 20: Grimório Otimizado — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 20-grim-rio-otimizado
**Areas discussed:** FlashList data structure, Shared element transition

---

## FlashList Data Structure

### Q1: Keep collapse/expand UX or always-expanded?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep collapse/expand | Pre-flatten to typed items array (header/spell/add-domain) | ✓ |
| Always expanded | Remove collapse, all spells always visible, simpler code | |

**User's choice:** Keep collapse/expand
**Notes:** Preserve existing domain collapse/expand UX for familiarity.

---

### Q2: estimatedItemSize — single estimate or overrideItemLayout per type?

| Option | Description | Selected |
|--------|-------------|----------|
| Single estimate (56px) | estimatedItemSize={56}, FlashList corrects at runtime | ✓ |
| overrideItemLayout | Exact heights per type (header=48, spell=56, add-domain=38) | |

**User's choice:** Single estimate (56px)
**Notes:** Simpler, negligible performance difference for this list size.

---

### Q3: Empty domain headers when filtered — disappear or stay?

| Option | Description | Selected |
|--------|-------------|----------|
| Disappear (current behavior) | Domain header only appears if it has matching spells | ✓ |
| Always show headers | Show all domain headers even when filtered to 0 spells | |

**User's choice:** Disappear (current behavior)

---

## Shared Element Transition

### Q1: Keep Modal or navigate to new screen?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Modal, add animation | Modal with Reanimated entering animation. No new package. | |
| New screen route | router.push to spell detail. Enables true shared element. | ✓ |

**User's choice:** "faça como ficar mais bonito" (do whatever looks nicest)
**Notes:** Claude selected new screen route as the more polished option.

---

### Q2: Animation feel

| Option | Description | Selected |
|--------|-------------|----------|
| Expand from card position | Card grows from list position to fill screen | ✓ |
| Zoom from center | Scale 0.8→1.0 fade-in from center | |

**User's choice:** Expand from card position

---

### Q3: Navigation controls on detail screen

| Option | Description | Selected |
|--------|-------------|----------|
| X/close button only | Matches current SpellDetailCard layout | ✓ |
| Back button + swipe dismiss | Native iOS swipe-to-dismiss | |

**User's choice:** X/close button only

---

## Claude's Discretion

- **GRIM-02 (MTG filter symbols):** User skipped this area — Claude decided to use PlanewalkerDings single characters (`a`=W, `g`=G, `d`=R, `b`=B, `u`=U) already in the app. No new assets needed.
- **Filter pip button dimensions:** ~36×36 circular, fontSize ~20 for the pip character.
- **Spell data passing strategy for detail screen:** Researcher to determine best approach (route param vs. module-level ref).

## Deferred Ideas

None.
