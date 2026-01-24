'use client';

import { useState } from 'react';
import { storage } from '@/lib/storage';
import { SUBJECTS, PHYSICS_LEVELS } from '@/lib/types';

export default function BulkImport() {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [type, setType] = useState<'theory' | 'practice'>('theory');
  const [level, setLevel] = useState(1);

  const isPhysics = subject === 'Физика';

  const handleBulkAdd = () => {
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      alert('Введите вопросы (по одному на строке)');
      return;
    }

    const questions = lines.map(line => ({
      subject,
      type: isPhysics ? 'theory' as const : type, // Physics doesn't use type
      text: line.trim(),
      ...(isPhysics && { level }), // Add level only for Physics
    }));

    storage.addQuestions(questions);
    alert(`Добавлено ${questions.length} вопросов`);
    setText('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Массовое добавление</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Предмет:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            {SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {isPhysics ? (
          <div>
            <label className="block text-sm font-medium mb-2">Уровень сложности (1-{PHYSICS_LEVELS}):</label>
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              {Array.from({ length: PHYSICS_LEVELS }, (_, i) => i + 1).map(lvl => (
                <option key={lvl} value={lvl}>Уровень {lvl}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Тип:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'theory' | 'practice')}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="theory">Теория</option>
              <option value="practice">Практика</option>
            </select>
          </div>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isPhysics 
          ? `Вставьте вопросы уровня ${level}, по одному на строке...`
          : "Вставьте вопросы, по одному на строке..."
        }
        className="w-full h-40 px-3 py-2 border border-gray-300 rounded mb-4"
      />

      <button
        onClick={handleBulkAdd}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Добавить все
      </button>
    </div>
  );
}
