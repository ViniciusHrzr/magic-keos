---
phase: 14-inventario-craft-artefatos
plan: 05
status: complete
completed: 2026-05-17
requirements: [INV-01, INV-02]
---

# Phase 14 Plan 05 — Summary

## What Was Built

**components/rpg/DraggableGearCard.tsx** (new): GearCard wrapped in GestureDetector with Pan gesture. useSharedValue for translateX/Y/isDragging (0/1 for worklet compatibility). onEnd calls runOnJS(onDropAttempt) with absoluteX/Y, then springs back to 0. animStyle drives opacity, elevation, zIndex. React.memo export.

**components/rpg/DroppableHexSlot.tsx** (new): forwardRef component wrapping HexSlot in a View with `width: '46%'`. useImperativeHandle exposes measureInWindow via viewRef. isDropTarget prop accepted (phase 1: no visual highlight). Exports DroppableHexSlotHandle interface.

**components/rpg/DraggableNoteCard.tsx** (new): Thin wrapper — passes all props through to NoteCard. IQuickNote is not draggable to slots (D-17 compliance).

**components/rpg/HexSlot.tsx** (patch): wrap style changed from `width: '46%'` → `width: '100%'` so HexSlot fills the DroppableHexSlot container (which now owns the 46% constraint). Required for composition to work — HexSlot is only used inside DroppableHexSlot after 14-05.

**app/(tabs)/mochila.tsx** (refactored):
- Wrapped root in GestureHandlerRootView
- Replaced HexSlot → DroppableHexSlot with ref callbacks → hexRefs
- Replaced NoteCard/GearCard in FlatList with DraggableNoteCard/DraggableGearCard
- Added SLOT_ACCEPTS: Record<SlotKey, IStructuredGear['type_equip'][]>
- Added handleDropAttempt: iterates hexRefs, calls measureInWindow, checks hit + category, then setEquipamentoItem + removeInventarioItem

## Key Decisions

- HexSlot.tsx patched (not listed in plan's files_modified) because composition requires HexSlot to fill its parent — DroppableHexSlot owns the width: '46%' constraint
- isDragging uses 0/1 instead of boolean for worklet compatibility
- forwardRef NOT wrapped with React.memo to preserve TypeScript ref type inference cleanly
- isDropTarget={false} for all slots in phase 1 (hover highlight deferred)

## Verification

| Check | Result | Status |
|-------|--------|--------|
| `npx tsc --noEmit` | exit 0 | ✅ |
| `grep -c "GestureDetector" components/rpg/DraggableGearCard.tsx` | 3 | ✅ |
| `grep -c "useSharedValue" components/rpg/DraggableGearCard.tsx` | 4 | ✅ |
| `grep -c "onDropAttempt" components/rpg/DraggableGearCard.tsx` | 3 | ✅ |
| `grep -c "measureInWindow" components/rpg/DroppableHexSlot.tsx` | 3 | ✅ |
| `grep -c "forwardRef" components/rpg/DroppableHexSlot.tsx` | 2 | ✅ |
| `grep -c "GestureHandlerRootView" app/(tabs)/mochila.tsx` | 3 | ✅ |
| `grep -c "DroppableHexSlot" app/(tabs)/mochila.tsx` | 3 | ✅ |
| `grep -c "DraggableGearCard" app/(tabs)/mochila.tsx` | 2 | ✅ |
| `grep -c "handleDropAttempt" app/(tabs)/mochila.tsx` | 2 | ✅ |
| `grep -c "SLOT_ACCEPTS" app/(tabs)/mochila.tsx` | 2 | ✅ |
| `grep -c "hexRefs" app/(tabs)/mochila.tsx` | 4 | ✅ |
