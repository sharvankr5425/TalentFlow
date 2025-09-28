import { useQuery } from '@tanstack/react-query';
import React from 'react';

// API function to fetch assessment responses
const fetchAssessmentResponses = async (candidateId) => {
  const res = await fetch(`/api/candidates/${candidateId}/assessment-responses`);
  if (!res.ok) throw new Error('Could not fetch assessment responses.');
  return res.json();
};

// API function to fetch the assessment structure
const fetchAssessmentStructure = async (jobId) => {
  if (!jobId) return null;
  const res = await fetch(`/api/assessments/${jobId}`);
  if (!res.ok) throw new Error('Could not fetch assessment structure.');
  return res.json();
};

export function AssessmentResponsesView({ candidate }) {
  const { data: responses, isLoading: isLoadingResponses } = useQuery({
    queryKey: ['assessmentResponses', candidate.id],
    queryFn: () => fetchAssessmentResponses(candidate.id),
    enabled: !!candidate.id,
  });

  const { data: assessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: ['assessment', candidate.jobId],
    queryFn: () => fetchAssessmentStructure(candidate.jobId),
    enabled: !!candidate.jobId,
  });

  if (isLoadingResponses || isLoadingAssessment) {
    return <p className="text-gray-500">Loading assessment responses...</p>;
  }

  if (!assessment || !responses) {
    return <p className="text-gray-500">No assessment has been submitted by this candidate.</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Assessment Responses</h3>
      {assessment.questions.map((question) => (
        <div key={question.id} className="p-4 border rounded-md bg-slate-50">
          <p className="font-semibold text-gray-800">{question.label}</p>
          <div className="mt-2 text-gray-600 pl-4 border-l-2 border-blue-500">
            <p>{responses.responses[question.id] || <em>No answer provided</em>}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
