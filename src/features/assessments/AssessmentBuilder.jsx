import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function AssessmentBuilder({ job, onSave }) {
  const [questions, setQuestions] = useState(job.assessment?.questions || []);

  const addQuestion = (type) => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      label: 'New Question',
      type,
      required: false,
      options: type.includes('choice') ? ['Option 1', 'Option 2'] : [],
      // Conditional logic properties
      conditional: {
        show: 'always', // 'always' or 'if'
        questionId: '',
        value: ''
      }
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };
  
  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  }

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  
  const addOption = (qIndex) => {
     const newQuestions = [...questions];
     newQuestions[qIndex].options.push('New Option');
     setQuestions(newQuestions);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Assessment Builder</h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => addQuestion('text')} variant="secondary">Add Short Text</Button>
        <Button onClick={() => addQuestion('long-text')} variant="secondary">Add Long Text</Button>
        <Button onClick={() => addQuestion('single-choice')} variant="secondary">Add Single Choice</Button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {questions.map((q, qIndex) => (
          <div key={q.id} className="p-4 border rounded-md space-y-2 bg-slate-50">
            <div className="flex justify-between items-center">
                <Input value={q.label} onChange={(e) => updateQuestion(qIndex, 'label', e.target.value)} className="font-bold flex-grow"/>
                <Button onClick={() => removeQuestion(qIndex)} variant="danger" className="ml-4"><Trash2 size={16}/></Button>
            </div>
            
            {q.type.includes('choice') && (
              <div className="pl-4 space-y-2">
                {q.options.map((opt, oIndex) => (
                    <Input key={oIndex} value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} />
                ))}
                <Button onClick={() => addOption(qIndex)} size="sm" variant="secondary">Add Option</Button>
              </div>
            )}
             <div>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={q.required} onChange={e => updateQuestion(qIndex, 'required', e.target.checked)}/> Required
                </label>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={() => onSave(questions)}>Save Assessment</Button>
    </div>
  );
}
