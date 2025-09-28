import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutGrid } from 'lucide-react';
import React, {useState} from 'react'
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CandidateKanbanBoard } from '../features/candidates/CandidateKanbanBoard';
import { CandidateList } from '../features/candidates/CandidateList';
import { JobsBoard } from '../features/jobs/JobsBoard';
import { JobForm } from '../features/jobs/JobForm';

const createJobApi = (newJob) =>
  fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newJob),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  });

export function JobsBoardPage() {
  const [view, setView] = useState('list'); // 'list' or 'kanban'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: createJobApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(`Failed to create job: ${error.message}`);
    }
  });

  const handleCreateJob = (jobData) => {
    createJobMutation.mutate(jobData);
  };

  if (view === 'kanban') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Candidate Kanban</h1>
          <Button onClick={() => setView('list')}>Show Jobs List</Button>
        </div>
        <CandidateKanbanBoard />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Jobs Board */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Jobs Board</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>+ Create Job</Button>
          </div>
          <JobsBoard />
        </div>
        
        {/* Right Column: Candidates List */}
        <div className="lg:col-span-1">
           <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Candidates</h2>
            <Button 
              onClick={() => setView('kanban')} 
              className="bg-slate-700 hover:bg-slate-800 text-sm"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Kanban View
            </Button>
          </div>
          <CandidateList />
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Job">
        <JobForm onSave={handleCreateJob} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>
    </div>
  );
}

