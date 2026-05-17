import React from 'react';
import NoteCard from './NoteCard';
import { IQuickNote, InventoryItem } from '@/types/inventory';

interface DraggableNoteCardProps {
  item: IQuickNote;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<InventoryItem>) => void;
}

export default function DraggableNoteCard(props: DraggableNoteCardProps) {
  return <NoteCard {...props} />;
}
