import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

// A simple renderer for @mentions
const renderNote = (text) => {
  return text.split(/(@\w+)/g).map((part, i) => {
    if (part.startsWith('@')) {
      return <strong key={i} className="text-blue-600 bg-blue-100 rounded-sm px-1">{part}</strong>;
    }
    return part;
  });
};


export function NoteInput({ onAddNote }) {
  const [note, setNote] = useState('');
  
  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote(note);
      setNote('');
    }
  };

  return (
    <div className="mt-4">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note... use @ to mention someone"
        className="w-full p-2 border rounded-md"
        rows={3}
      />
      <div className="mt-2 text-right">
        <Button onClick={handleAddNote}>Add Note</Button>
      </div>
      <div className="mt-2 p-2 bg-gray-50 border rounded-md min-h-[50px]">
        <p className="text-gray-500">Preview: {renderNote(note)}</p>
      </div>
    </div>
  );
}

