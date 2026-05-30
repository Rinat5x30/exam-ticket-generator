'use client';

import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Question, SUBJECTS, PHYSICS_LEVELS } from '@/lib/types';
import { ValidationError } from '@/lib/validators';

type QuestionInput = Omit<Question, 'id'>;

export default function BulkImport() {
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [type, setType] = useState<'theory' | 'practice'>('theory');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [text, setText] = useState('');
  const [error, setError] = useState<string>('');

  const isPhysics = subject === 'Физика';

  const handleBulkAdd = () => {
    try {
      setError('');

      if (!text.trim()) {
        throw new ValidationError('Введите текст вопросов');
      }

      const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        throw new ValidationError('Нет корректных строк для импорта');
      }

      const questions: QuestionInput[] = lines.map(line => {
        if (isPhysics) {
          return {
            subject,
            type: 'theory',
            text: line,
            difficulty,
          };
        }

        return {
          subject,
          type,
          text: line,
        };
      });

      storage.addQuestions(questions);
      setText('');
      alert(`✓ Добавлено вопросов: ${questions.length}`);
    } catch (err) {
      const message = err instanceof ValidationError
        ? err.message
        : 'Ошибка при добавлении вопросов';
      setError(message);
      console.error('Ошибка:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Массовое добавление вопросов</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Предмет</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            {SUBJECTS.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {!isPhysics && (
          <div>
            <label className="block text-sm font-medium mb-2">Тип</label>
            <select
              value={type}
              onChange={e =>
                setType(e.target.value as 'theory' | 'practice')
              }
              className="w-full px-3 py-2 border rounded"
            >
              <option value="theory">Теория</option>
              <option value="practice">Практика</option>
            </select>
          </div>
        )}

        {isPhysics && (
          <div>
            <label className="block text-sm font-medium mb-2">Уровень</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            >
              {Array.from({ length: PHYSICS_LEVELS }, (_, i) => i + 1).map(lvl => (
                <option key={lvl} value={lvl}>
                  Уровень {lvl}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={6}
        placeholder="Каждый вопрос с новой строки"
        className="w-full px-3 py-2 border rounded mb-4"
        maxLength={50000}
      />
      <p className="text-xs text-gray-500 mb-4">
        {text.length} / 50000 символов
      </p>

      <button
        onClick={handleBulkAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!text.trim()}
      >
        Добавить
      </button>
    </div>
  );
}
