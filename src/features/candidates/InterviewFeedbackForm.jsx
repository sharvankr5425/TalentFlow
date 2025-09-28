import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';

// API function to post new feedback
const postFeedbackApi = ({ candidateId, feedbackData }) => {
  return fetch(`/api/candidates/${candidateId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedbackData),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
  });
};

export function InterviewFeedbackForm({ candidateId, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postFeedbackApi,
    onSuccess: () => {
      // Invalidate the feedback query to refetch and show the new entry
      queryClient.invalidateQueries({ queryKey: ['feedback', candidateId] });
      onSave(); // This will typically close the modal
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate({ candidateId, feedbackData: data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Overall Rating (1-5)</label>
        <input
          id="rating"
          type="number"
          min="1"
          max="5"
          {...register('rating', { required: 'Rating is required', min: 1, max: 5 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
      </div>
      <div>
        <label htmlFor="pros" className="block text-sm font-medium text-gray-700">Pros</label>
        <textarea
          id="pros"
          rows={3}
          {...register('pros', { required: 'Pros are required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.pros && <p className="text-red-500 text-xs mt-1">{errors.pros.message}</p>}
      </div>
       <div>
        <label htmlFor="cons" className="block text-sm font-medium text-gray-700">Cons</label>
        <textarea
          id="cons"
          rows={3}
          {...register('cons', { required: 'Cons are required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.cons && <p className="text-red-500 text-xs mt-1">{errors.cons.message}</p>}
      </div>
      <div>
        <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">Recommendation</label>
        <select
          id="recommendation"
          {...register('recommendation', { required: 'Recommendation is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select...</option>
          <option value="Strong Hire">Strong Hire</option>
          <option value="Hire">Hire</option>
          <option value="No Hire">No Hire</option>
        </select>
        {errors.recommendation && <p className="text-red-500 text-xs mt-1">{errors.recommendation.message}</p>}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </form>
  );
}
