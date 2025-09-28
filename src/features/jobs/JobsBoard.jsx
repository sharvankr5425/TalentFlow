import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { DraggableJobCard } from './DraggableJobCard';

// API function to fetch jobs
const fetchJobs = async () => {
  const response = await fetch('/api/jobs');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// API function to update job order
const reorderJobsApi = (variables) => {
  const { id, from, to } = variables;
  return fetch(`/api/jobs/${id}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to }),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to reorder jobs');
    return res.json();
  });
};

// API function to update job status (archive/unarchive)
const updateJobStatusApi = ({ jobId, status }) => {
  return fetch(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to update job status');
    return res.json();
  });
};

export function JobsBoard() {
  const queryClient = useQueryClient();
  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const reorderMutation = useMutation({
    mutationFn: reorderJobsApi,
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const previousJobs = queryClient.getQueryData(['jobs']);
      queryClient.setQueryData(['jobs'], old => {
        const oldJobs = Array.isArray(old) ? old : [];
        return arrayMove(oldJobs, newOrder.from, newOrder.to);
      });
      return { previousJobs };
    },
    onError: (err, newOrder, context) => {
      queryClient.setQueryData(['jobs'], context.previousJobs);
      alert("Failed to reorder jobs. Changes have been rolled back.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
  
  const updateStatusMutation = useMutation({
      mutationFn: updateJobStatusApi,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
      },
      onError: (error) => {
          alert(`Failed to update job: ${error.message}`);
      }
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  // Sort by 'order' property to maintain user-defined order
  const sortedJobs = useMemo(() => {
    return filteredJobs.slice().sort((a, b) => a.order - b.order);
  }, [filteredJobs]);

  const handleArchiveToggle = (jobToToggle) => {
    const newStatus = jobToToggle.status === 'archived' ? 'active' : 'archived';
    updateStatusMutation.mutate({ jobId: jobToToggle.id, status: newStatus });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sortedJobs.findIndex(j => j.id === active.id);
      const newIndex = sortedJobs.findIndex(j => j.id === over.id);
      reorderMutation.mutate({ id: active.id, from: oldIndex, to: newIndex });
    }
  };

  // Animation variants for the container and list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, // Each card animates 0.07s after the previous one
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) return <p>Loading jobs...</p>;
  if (isError) return <p className="text-red-500">Error loading jobs. Please try again.</p>;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Filter by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>active</option>
            <option>archived</option>
          </select>
        </div>
      </Card>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedJobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedJobs.length > 0 ? sortedJobs.map(job => (
              <motion.div key={job.id} variants={itemVariants}>
                <DraggableJobCard job={job} handleArchiveToggle={handleArchiveToggle} />
              </motion.div>
            )) : <p>No jobs match the current filters.</p>}
          </motion.div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

