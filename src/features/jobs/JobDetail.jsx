import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, {useState} from 'react'
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { AssessmentV3 } from '../assessments/AssessmentV3';
import { JobForm } from './JobForm';

// API Functions for this component
const updateJobApi = (jobData) => 
  fetch(`/api/jobs/${jobData.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to update job');
    return res.json();
  });

const fetchAssessment = async (jobId) => {
    const res = await fetch(`/api/assessments/${jobId}`);
    // It's okay if an assessment doesn't exist yet, return a default structure
    if (res.status === 404) return { questions: [] }; 
    if (!res.ok) throw new Error('Failed to fetch assessment');
    return res.json();
};

const saveAssessmentApi = ({ jobId, assessment }) =>
  fetch(`/api/assessments/${jobId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to save assessment');
    return res.json();
  });


export function JobDetail({ job }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch assessment data for the current job
  const { 
    data: assessment, 
    isLoading: isLoadingAssessment 
  } = useQuery({
    queryKey: ['assessment', job.id],
    queryFn: () => fetchAssessment(job.id),
    // Provide a default value to prevent errors before the first fetch
    initialData: { questions: [] }
  });

  // Mutation for updating the job's core details
  const updateJobMutation = useMutation({
    mutationFn: updateJobApi,
    onSuccess: () => {
      // Refetch both the specific job and the main jobs list to keep all data fresh
      queryClient.invalidateQueries({ queryKey: ['job', job.id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsEditing(false);
    },
    onError: (error) => {
      alert(`Failed to update job: ${error.message}`);
    }
  });

  // Mutation for saving the assessment form structure
  const saveAssessmentMutation = useMutation({
    mutationFn: saveAssessmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', job.id] });
      alert('Assessment saved successfully!');
    },
    onError: (error) => {
      alert(`Failed to save assessment: ${error.message}`);
    }
  });

  const handleSaveJob = (jobData) => {
    updateJobMutation.mutate({ ...job, ...jobData });
  };

  const handleSaveAssessment = (questions) => {
    saveAssessmentMutation.mutate({ jobId: job.id, assessment: { questions } });
  };

  return (
    <div>
      <Card className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-lg text-gray-600 capitalize">{job.status}</p>
            <div className="flex gap-2 mt-2">
              {(job.tags || []).map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Job</Button>
        </div>
        <p className="mt-4 text-gray-700">{job.description || "No description provided."}</p>
      </Card>
      
      <Card>
        {isLoadingAssessment ? (
            <p className="text-center p-10">Loading assessment builder...</p>
        ) : (
            <AssessmentV3 
              job={job} 
              initialAssessment={assessment} 
              onSave={handleSaveAssessment} 
            />
        )}
      </Card>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Job">
        <JobForm job={job} onSave={handleSaveJob} onCancel={() => setIsEditing(false)} />
      </Modal>
    </div>
  );
}

