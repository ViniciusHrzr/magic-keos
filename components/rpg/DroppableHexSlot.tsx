import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import HexSlot, { HexSlotProps } from './HexSlot';

export interface DroppableHexSlotHandle {
  measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => void;
}

interface DroppableHexSlotProps extends HexSlotProps {
  isDropTarget: boolean;
}

const DroppableHexSlot = forwardRef<DroppableHexSlotHandle, DroppableHexSlotProps>(
  function DroppableHexSlot({ isDropTarget: _isDropTarget, ...props }, ref) {
    const viewRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      measureInWindow: (cb) => {
        viewRef.current?.measureInWindow(cb);
      },
    }), []);

    return (
      <View ref={viewRef} style={{ width: '46%' }}>
        <HexSlot {...props} />
      </View>
    );
  }
);

export default DroppableHexSlot;
