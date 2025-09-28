import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { JobDetail } from '../features/jobs/JobDetail';

// Helper function to fetch a single job
const fetchJob = async (jobId) => {
  const res = await fetch(`/api/jobs/${jobId}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function JobDetailPage() {
  const { jobId } = useParams();

  const { data: job, isLoading, isError, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJob(jobId),
  });

  if (isLoading) {
    return <div className="text-center p-10">Loading job details...</div>;
  }

  if (isError) {
    return <div className="text-center p-10 text-red-500">Error: {error.message}</div>;
  }

  if (!job) {
    return <div>Job not found!</div>;
  }

  return <JobDetail job={job} />;
}

