import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';

export function AssessmentForm({ questions, onSubmit }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  if (!questions || questions.length === 0) {
    return <p className="text-gray-500">No assessment has been created for this job yet.</p>
  }

  const renderQuestion = (q) => {
    const commonProps = {
      ...register(q.id, { required: q.required && 'This field is required' })
    };
    
    switch (q.type) {
      case 'text':
        return <input {...commonProps} className="w-full p-2 border rounded-md" />;
      case 'long-text':
        return <textarea {...commonProps} rows="4" className="w-full p-2 border rounded-md" />;
      case 'single-choice':
        return q.options.map(opt => (
          <label key={opt} className="flex items-center gap-2">
            <input type="radio" {...commonProps} value={opt} /> {opt}
          </label>
        ));
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {questions.map(q => (
        <div key={q.id}>
          <label className="font-semibold block mb-2">{q.label} {q.required && <span className="text-red-500">*</span>}</label>
          {renderQuestion(q)}
          {errors[q.id] && <p className="text-red-500 text-sm mt-1">{errors[q.id].message}</p>}
        </div>
      ))}
      <Button type="submit">Submit Assessment</Button>
    </form>
  );
}
