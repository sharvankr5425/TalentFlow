import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus } from 'lucide-react';
import { QuestionEditor } from './QuestionEditor';

// --- LIVE PREVIEW COMPONENT ---
function AssessmentPreview({ assessment }) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = (data) => alert("Preview Submitted!\n" + JSON.stringify(data, null, 2));

    const renderQuestion = (question) => {
        // --- Conditional Logic Check ---
        if (question.conditional?.questionId) {
            const watchedValue = watch(question.conditional.questionId);
            if (watchedValue !== question.conditional.value) {
                return null; // Don't render if condition is not met
            }
        }
        
        const registerOptions = {
            required: question.validation?.required ? "This field is required" : false,
            minLength: question.validation?.minLength && { value: parseInt(question.validation.minLength), message: `Minimum length is ${question.validation.minLength}` },
            maxLength: question.validation?.maxLength && { value: parseInt(question.validation.maxLength), message: `Maximum length is ${question.validation.maxLength}` },
            min: question.validation?.min && { value: parseInt(question.validation.min), message: `Minimum value is ${question.validation.min}` },
            max: question.validation?.max && { value: parseInt(question.validation.max), message: `Maximum value is ${question.validation.max}` },
        };

        let inputField;
        switch (question.type) {
            case 'short-text':
                inputField = <Input {...register(question.id, registerOptions)} />;
                break;
            case 'long-text':
                inputField = <textarea {...register(question.id, registerOptions)} className="w-full p-2 border rounded-md" rows={4} />;
                break;
            case 'numeric':
                inputField = <Input type="number" {...register(question.id, registerOptions)} />;
                break;
            case 'single-choice':
                inputField = question.options.map(opt => (
                    <div key={opt}><label><input type="radio" {...register(question.id, registerOptions)} value={opt} /> {opt}</label></div>
                ));
                break;
            case 'multi-choice':
                inputField = question.options.map(opt => (
                    <div key={opt}><label><input type="checkbox" {...register(`${question.id}.${opt}`, registerOptions)} /> {opt}</label></div>
                ));
                break;
            case 'file-upload':
                inputField = <Input type="file" {...register(question.id, registerOptions)} />;
                break;
            default: return null;
        }

        return (
            <div key={question.id} className="mb-4">
                <label className="font-semibold block mb-2">{question.label}{question.validation?.required && <span className="text-red-500">*</span>}</label>
                {inputField}
                {errors[question.id] && <p className="text-red-500 text-sm mt-1">{errors[question.id].message}</p>}
            </div>
        );
    };

    return (
        <div className="p-6 border-l h-full overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Live Assessment Preview</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                 {assessment.questions.map(q => renderQuestion(q))}
                 <Button type="submit">Submit Assessment</Button>
            </form>
        </div>
    );
}


// --- MAIN BUILDER COMPONENT ---
export function AssessmentV3({ job, onSave }) {
    const [assessment, setAssessment] = useState(job.assessment || { questions: [] });
    
    const addQuestion = (type) => {
        const newQuestion = {
            id: `q_${crypto.randomUUID()}`,
            type,
            label: 'New Question',
            options: type.includes('choice') ? ['Option 1', 'Option 2'] : [],
            validation: {},
        };
        setAssessment(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
    };

    const updateQuestion = (updatedQuestion) => {
        setAssessment(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
        }));
    };

    const removeQuestion = (questionId) => {
        setAssessment(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== questionId)
        }));
    };
    
    const questionTypes = [
        { id: 'short-text', label: 'Short Text' }, { id: 'long-text', label: 'Long Text' },
        { id: 'numeric', label: 'Numeric' }, { id: 'single-choice', label: 'Single Choice' },
        { id: 'multi-choice', label: 'Multi Choice' }, { id: 'file-upload', label: 'File Upload' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            {/* --- BUILDER PANE --- */}
            <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Assessment Builder</h2>
                    <Button onClick={() => onSave(assessment)} className="bg-green-600 hover:bg-green-700">Save Assessment</Button>
                </div>
                
                <div className="space-y-4 mb-6">
                    {assessment.questions.map((q) => (
                        <QuestionEditor 
                            key={q.id} 
                            question={q}
                            updateQuestion={updateQuestion}
                            removeQuestion={() => removeQuestion(q.id)}
                            allQuestions={assessment.questions}
                        />
                    ))}
                </div>

                <div className="p-4 border-2 border-dashed rounded-lg">
                    <p className="text-center font-medium mb-2">Add New Question</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {questionTypes.map(type => (
                            <Button key={type.id} onClick={() => addQuestion(type.id)} variant="outline" className="justify-start">
                                <Plus size={14} className="mr-2"/> {type.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- PREVIEW PANE --- */}
            <AssessmentPreview assessment={assessment} />
        </div>
    );
}
