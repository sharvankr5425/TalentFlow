import { GripVertical, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';

export function QuestionEditor({ question, updateQuestion, removeQuestion, allQuestions }) {
    const handleInputChange = (field, value) => {
        updateQuestion({ ...question, [field]: value });
    };

    const handleValidationChange = (field, value) => {
        const newValidation = { ...question.validation, [field]: value };
        if (field === 'required' && !value) delete newValidation.required;
        if (field === 'minLength' && !value) delete newValidation.minLength;
        if (field === 'maxLength' && !value) delete newValidation.maxLength;
        if (field === 'min' && !value) delete newValidation.min;
        if (field === 'max' && !value) delete newValidation.max;
        updateQuestion({ ...question, validation: newValidation });
    };
    
    const handleOptionChange = (index, value) => {
        const newOptions = [...question.options];
        newOptions[index] = value;
        updateQuestion({ ...question, options: newOptions });
    };

    const addOption = () => {
        const newOptions = [...(question.options || []), `Option ${question.options.length + 1}`];
        updateQuestion({ ...question, options: newOptions });
    };

    const removeOption = (index) => {
        const newOptions = question.options.filter((_, i) => i !== index);
        updateQuestion({ ...question, options: newOptions });
    };

    const handleConditionalChange = (field, value) => {
        const newConditional = { ...question.conditional, [field]: value };
        // Clear value if the question target changes
        if (field === 'questionId') {
            newConditional.value = '';
        }
        if (!newConditional.questionId) {
             updateQuestion({ ...question, conditional: undefined });
        } else {
             updateQuestion({ ...question, conditional: newConditional });
        }
    };

    const questionHasOptions = ['single-choice', 'multi-choice'].includes(question.type);
    const precedingQuestions = allQuestions.filter(q => q.id !== question.id);

    return (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <GripVertical className="cursor-grab text-slate-400" />
                    <Input
                        value={question.label}
                        onChange={(e) => handleInputChange('label', e.target.value)}
                        placeholder="Question Label"
                        className="text-md font-semibold"
                    />
                </div>
                <Button onClick={removeQuestion} variant="ghost" size="icon" className="text-red-500 hover:bg-red-100">
                    <Trash2 size={16} />
                </Button>
            </div>

            {/* --- Options for Choice Questions --- */}
            {questionHasOptions && (
                <div className="space-y-2 pl-6">
                    {question.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                            />
                             <button onClick={() => removeOption(index)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <Button onClick={addOption} variant="outline" size="sm" className="mt-2">
                        <Plus size={14} className="mr-2" /> Add Option
                    </Button>
                </div>
            )}
            
            {/* --- Validation Rules --- */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id={`required-${question.id}`} checked={!!question.validation?.required} onChange={e => handleValidationChange('required', e.target.checked)}/>
                    <label htmlFor={`required-${question.id}`}>Required</label>
                </div>
                 {question.type === 'short-text' || question.type === 'long-text' ? (
                    <>
                        <Input type="number" placeholder="Min Length" value={question.validation?.minLength || ''} onChange={e => handleValidationChange('minLength', e.target.value)} />
                        <Input type="number" placeholder="Max Length" value={question.validation?.maxLength || ''} onChange={e => handleValidationChange('maxLength', e.target.value)} />
                    </>
                 ) : null}
                 {question.type === 'numeric' ? (
                    <>
                        <Input type="number" placeholder="Min Value" value={question.validation?.min || ''} onChange={e => handleValidationChange('min', e.target.value)} />
                        <Input type="number" placeholder="Max Value" value={question.validation?.max || ''} onChange={e => handleValidationChange('max', e.target.value)} />
                    </>
                 ) : null}
            </div>

            {/* --- Conditional Logic --- */}
             <div className="pt-2 border-t">
                <label className="text-sm font-medium">Conditional Logic</label>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">Show if</span>
                    <select
                        value={question.conditional?.questionId || ''}
                        onChange={(e) => handleConditionalChange('questionId', e.target.value)}
                        className="flex-grow p-2 border rounded-md bg-white border-slate-300"
                    >
                        <option value="">(No Condition)</option>
                        {precedingQuestions.map(q => <option key={q.id} value={q.id}>{q.label || `Question ${q.id}`}</option>)}
                    </select>
                    <span className="text-sm">is</span>
                    <Input
                        placeholder="Required value (e.g., 'Yes')"
                        value={question.conditional?.value || ''}
                        onChange={(e) => handleConditionalChange('value', e.target.value)}
                        disabled={!question.conditional?.questionId}
                        className="flex-grow"
                    />
                </div>
             </div>
        </div>
    );
}
