import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { arrayMove } from '@dnd-kit/sortable';
import React, { useEffect, useMemo, useState } from 'react';
import { DraggableCandidateCard } from './DraggableCandidateCard';
import { KanbanColumn } from './KanbanColumn';

// API function to fetch ALL candidates for the board view
const fetchAllCandidatesApi = async () => {
  // We now call the new, dedicated endpoint for all candidates
  const response = await fetch('/api/candidates/all');
  if (!response.ok) throw new Error('Failed to fetch candidates');
  // This endpoint returns a simple array, which is what the board needs
  return response.json(); 
};

// API function to update a candidate's stage
const updateCandidateStageApi = ({ candidateId, newStage }) => {
  return fetch(`/api/candidates/${candidateId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage: newStage }),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to update stage');
    return res.json();
  });
};

export function CandidateKanbanBoard() {
  const queryClient = useQueryClient();
  const { data: serverCandidates = [], isLoading, isError } = useQuery({
    queryKey: ['allCandidates'], // Using a unique key for this fetch
    queryFn: fetchAllCandidatesApi,
  });

  const [activeCandidates, setActiveCandidates] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // This useEffect now correctly syncs the server data (a simple array)
  // with the local state, preventing any infinite loops.
  useEffect(() => {
    if (serverCandidates && serverCandidates.length > 0) {
      setActiveCandidates(serverCandidates);
    }
  }, [serverCandidates]);

  const stages = useMemo(() => ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'], []);
  
  const candidatesByStage = useMemo(() => {
    const grouped = {};
    stages.forEach(stage => {
      grouped[stage] = activeCandidates.filter(c => c.stage === stage);
    });
    return grouped;
  }, [activeCandidates, stages]);

  const updateStageMutation = useMutation({
    mutationFn: updateCandidateStageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCandidates'] });
      // Also invalidate the paginated list to keep it in sync
      queryClient.invalidateQueries({ queryKey: ['candidates'] }); 
    },
    onError: (error) => {
      alert(`Failed to move candidate: ${error.message}`);
      setActiveCandidates(serverCandidates); // Rollback on error
    },
  });

  const findContainerForId = (id) => {
    if (stages.includes(id)) return id;
    const candidate = activeCandidates.find(c => c.id === id);
    return candidate?.stage;
  };
  
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const sourceContainer = findContainerForId(active.id);
    const destinationContainer = findContainerForId(over.id);

    if (!sourceContainer || !destinationContainer) return;

    if (sourceContainer === destinationContainer) {
      const activeIndex = activeCandidates.findIndex(c => c.id === active.id);
      const overIndex = activeCandidates.findIndex(c => c.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        setActiveCandidates(current => arrayMove(current, activeIndex, overIndex));
      }
    } else {
      const draggedCandidateId = active.id;
      const newStage = destinationContainer;
      setActiveCandidates(current => current.map(c => c.id === draggedCandidateId ? { ...c, stage: newStage } : c));
      updateStageMutation.mutate({ candidateId: draggedCandidateId, newStage });
    }
  };
  
  const activeCandidate = useMemo(() => activeCandidates.find(c => c.id === activeId), [activeId, activeCandidates]);
  
  if (isLoading) return <p className="text-center p-10">Loading Kanban board...</p>;
  if (isError) return <p className="text-center p-10 text-red-500">Error loading candidates.</p>;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto p-4">
        {stages.map(stage => (
          <KanbanColumn
            key={stage}
            id={stage}
            title={stage}
            candidates={candidatesByStage[stage]}
          />
        ))}
      </div>
      <DragOverlay>
        {activeId && activeCandidate ? <DraggableCandidateCard candidate={activeCandidate} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

