import { useQuery } from '@tanstack/react-query';
import { ClipboardList, MessageSquare, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../lib/utils';
import { AssessmentResponsesView } from './AssessmentResponsesView';
import { InterviewFeedbackForm } from './InterviewFeedbackForm';
import { NoteInput } from './NoteInput';

// API function to fetch interview feedback
const fetchFeedback = async (candidateId) => {
  const res = await fetch(`/api/candidates/${candidateId}/feedback`);
  if (!res.ok) throw new Error('Could not fetch feedback.');
  return res.json();
};

export function CandidateProfile({ candidate, timeline }) {
  const [activeTab, setActiveTab] = useState('notes');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Fetch feedback data only when the feedback tab is active
  const { data: feedback = [], isLoading: isLoadingFeedback } = useQuery({
    queryKey: ['feedback', candidate.id],
    queryFn: () => fetchFeedback(candidate.id),
    enabled: activeTab === 'feedback', // This optimizes data fetching
  });

  // Note: The logic for adding a note would need a similar V5 update with useMutation.
  // This placeholder prevents crashes.
  const handleAddNote = (noteData) => {
    alert("Note adding feature needs to be connected to the V5 API.");
    console.log("New note data:", noteData);
  }

  const TABS = [
    { id: 'notes', label: 'Notes', icon: <MessageSquare size={16} /> },
    { id: 'feedback', label: 'Interview Feedback', icon: <Star size={16} /> },
    { id: 'assessment', label: 'Assessment', icon: <ClipboardList size={16} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="md:col-span-1 space-y-6">
        <Card className="text-center">
          <img src={candidate.avatar} alt={candidate.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
          <h2 className="text-2xl font-bold">{candidate.name}</h2>
          <p className="text-gray-600">{candidate.email}</p>
          <p className="mt-4">Current Stage:
            <span className="font-semibold text-blue-600 ml-2">{candidate.stage}</span>
          </p>
        </Card>
        
        <Card>
          <h3 className="font-bold text-lg mb-4">Status Timeline</h3>
          <ul className="space-y-4">
            {timeline?.map((event, index) => (
              <li key={index} className="flex items-center gap-4">
                <div className="bg-blue-500 w-3 h-3 rounded-full"></div>
                <div>
                  <p className="font-semibold">{event.status}</p>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Right Column */}
      <div className="md:col-span-2">
        <Card>
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === tab.id 
                    ? "border-b-2 border-blue-600 text-blue-600" 
                    : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            {activeTab === 'notes' && (
              <div>
                <NoteInput onAddNote={handleAddNote} />
                {/* Note display logic from V4 would go here */}
              </div>
            )}
            
            {activeTab === 'feedback' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Interview Feedback</h3>
                  <Button onClick={() => setIsFeedbackModalOpen(true)}>+ Add Feedback</Button>
                </div>
                {isLoadingFeedback ? <p>Loading feedback...</p> : (
                  <div className="space-y-4">
                    {feedback.length > 0 ? feedback.map(fb => (
                       <div key={fb.id || fb.submittedAt} className="p-4 border rounded-md bg-slate-50">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">{fb.recommendation} (Rating: {fb.rating}/5)</p>
                            <span className="text-xs text-gray-500">{new Date(fb.submittedAt).toLocaleDateString()} by {fb.author}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p><strong>Pros:</strong> {fb.pros}</p>
                            <p><strong>Cons:</strong> {fb.cons}</p>
                          </div>
                       </div>
                    )) : <p className="text-gray-500 text-center py-4">No feedback has been submitted for this candidate.</p>}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'assessment' && (
              <AssessmentResponsesView candidate={candidate} />
            )}
          </div>
        </Card>
      </div>

      {/* Feedback Modal */}
      <Modal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Submit Interview Feedback"
      >
        <InterviewFeedbackForm
          candidateId={candidate.id}
          onSave={() => setIsFeedbackModalOpen(false)}
          onCancel={() => setIsFeedbackModalOpen(false)}
        />
      </Modal>
    </div>
  );
}