import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { CandidateProfile } from '../features/candidates/CandidateProfile';

// Helper functions to fetch data from the mock API
const fetchCandidate = async (candidateId) => {
  const res = await fetch(`/api/candidates/${candidateId}`);
  if (!res.ok) throw new Error('Failed to fetch candidate');
  return res.json();
};

const fetchTimeline = async (candidateId) => {
  const res = await fetch(`/api/candidates/${candidateId}/timeline`);
  if (!res.ok) throw new Error('Failed to fetch timeline');
  return res.json();
};

export default function CandidateProfilePage() {
  const { candidateId } = useParams();

  // Fetch the candidate's main profile data
  const { 
    data: candidate, 
    isLoading: isLoadingCandidate,
    isError: isErrorCandidate,
    error: candidateError
  } = useQuery({
    queryKey: ['candidate', candidateId],
    queryFn: () => fetchCandidate(candidateId),
  });

  // Fetch the candidate's timeline (status changes, notes, etc.)
  const { 
    data: timeline, 
    isLoading: isLoadingTimeline,
    isError: isErrorTimeline,
    error: timelineError
  } = useQuery({
    queryKey: ['timeline', candidateId],
    queryFn: () => fetchTimeline(candidateId),
  });

  if (isLoadingCandidate || isLoadingTimeline) {
    return <div className="text-center p-10">Loading candidate profile...</div>;
  }
  
  if (isErrorCandidate) {
    return <div className="text-center p-10 text-red-500">Error loading candidate: {candidateError.message}</div>;
  }

  if (isErrorTimeline) {
    return <div className="text-center p-10 text-red-500">Error loading timeline: {timelineError.message}</div>;
  }

  if (!candidate) {
    return <div className="text-center p-10">Candidate not found!</div>;
  }

  return <CandidateProfile candidate={candidate} timeline={timeline || []} />;
}

