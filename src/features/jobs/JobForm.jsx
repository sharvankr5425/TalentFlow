import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function JobForm({ job, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: job || { title: '', status: 'active', tags: '' }
  });

  useEffect(() => {
    // When the job prop changes, reset the form
    reset({
        ...job,
        tags: Array.isArray(job?.tags) ? job.tags.join(', ') : ''
    });
  }, [job, reset]);

  const onSubmit = (data) => {
    const jobData = {
      ...data,
      tags: typeof data.tags === 'string' 
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [],
    };
    onSave(jobData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
        <Input 
          id="title"
          {...register('title', { required: 'Job title is required' })} 
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select 
          id="status" 
          {...register('status')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
       <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
        <Input 
          id="tags"
          {...register('tags')} 
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
        <Button type="submit">Save Job</Button>
      </div>
    </form>
  );
}

