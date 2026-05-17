import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import GearCard from './GearCard';
import { IStructuredGear, InventoryItem } from '@/types/inventory';

interface DraggableGearCardProps {
  item: IStructuredGear;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<InventoryItem>) => void;
  onDropAttempt: (payload: { item: IStructuredGear; absoluteX: number; absoluteY: number }) => void;
}

function DraggableGearCard({ item, onRemove, onUpdate, onDropAttempt }: DraggableGearCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      isDragging.value = 1;
    })
    .onUpdate(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(e => {
      runOnJS(onDropAttempt)({ item, absoluteX: e.absoluteX, absoluteY: e.absoluteY });
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      isDragging.value = 0;
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: isDragging.value ? 0.9 : 1,
    elevation: isDragging.value ? 8 : 1,
    zIndex: isDragging.value ? 999 : 1,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animStyle}>
        <GearCard item={item} onRemove={onRemove} onUpdate={onUpdate} />
      </Animated.View>
    </GestureDetector>
  );
}

export default React.memo(DraggableGearCard);
