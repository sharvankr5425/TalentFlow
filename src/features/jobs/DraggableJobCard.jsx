import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Archive, GripVertical } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

export function DraggableJobCard({ job, handleArchiveToggle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="flex items-center gap-4 touch-none">
      {/* Drag handle */}
      <button {...attributes} {...listeners} className="cursor-grab p-2 text-slate-400 hover:text-slate-600">
        <GripVertical size={20} />
      </button>

      {/* Job details */}
      <div className="flex-grow">
        {/* THE FIX IS HERE: Added conditional styling for archived jobs */}
        <Link 
          to={`/jobs/${job.id}`} 
          className={cn(
            "font-bold text-blue-600 hover:underline",
            job.status === 'archived' && "line-through text-slate-400"
          )}
        >
          {job.title}
        </Link>
        <p className={`text-sm capitalize ${job.status === 'active' ? 'text-green-600' : 'text-slate-500'}`}>
          {job.status}
        </p>
      </div>
      
      {/* Archive Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => handleArchiveToggle(job)}
          className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium"
        >
          <Archive size={16} className="mr-2" />
          {job.status === 'archived' ? 'Unarchive' : 'Archive'}
        </Button>
      </div>
    </Card>
  );
}

