import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { Link } from 'react-router-dom';

export function DraggableCandidateCard({ candidate }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: candidate.id, data: {type: 'CANDIDATE'} }); // Add data type for context

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Link to={`/candidates/${candidate.id}`} className="block p-4 bg-white rounded-md border shadow-sm hover:shadow-md mb-3 cursor-grab">
                 <div className="flex items-center gap-3">
                    <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold text-sm">{candidate.name}</p>
                        <p className="text-xs text-gray-500">{candidate.email}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

