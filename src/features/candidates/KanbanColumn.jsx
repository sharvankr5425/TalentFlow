import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { DraggableCandidateCard } from './DraggableCandidateCard';

export function KanbanColumn({ id, title, candidates }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-72 bg-slate-100 rounded-lg p-3">
      <h3 className="font-bold mb-4 px-2">{title} ({candidates.length})</h3>
      <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1 min-h-[200px] max-h-[60vh] overflow-y-auto">
          {candidates.map(candidate => (
            <DraggableCandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

