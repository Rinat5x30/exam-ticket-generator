'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Question, SUBJECTS, PHYSICS_LEVELS } from '@/lib/types';
import BulkImport from '@/components/BulkImport';
import Link from 'next/link';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState({ subject: '', type: '', level: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    setQuestions(storage.getQuestions());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Удалить вопрос?')) {
      storage.deleteQuestion(id);
      setQuestions(storage.getQuestions());
    }
  };

  const handleExport = () => {
    const data = storage.exportQuestions();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions-${Date.now()}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        storage.importQuestions(event.target?.result as string);
        setQuestions(storage.getQuestions());
        alert('Импорт выполнен');
      } catch (err) {
        alert('Ошибка импорта: ' + (err instanceof Error ? err.message : 'неизвестная ошибка'));
      }
    };
    reader.readAsText(file);
  };

  const filteredQuestions = questions.filter(q => {
    if (filter.subject && q.subject !== filter.subject) return false;
    if (filter.type && q.type !== filter.type) return false;
    if (filter.level && q.level !== Number(filter.level)) return false;
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = questions.reduce((acc, q) => {
    if (q.subject === 'Физика') {
      // For Physics, count by level
      const key = `${q.subject}-level${q.level || 0}`;
      acc[key] = (acc[key] || 0) + 1;
    } else {
      // For other subjects, count by type
      const key = `${q.subject}-${q.type}`;
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const isPhysicsFilter = filter.subject === 'Физика';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Управление Вопросами</h1>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ← Генератор
          </Link>
        </div>

        {/* Статистика */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-bold mb-2">Статистика:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {SUBJECTS.map(subject => {
              if (subject === 'Физика') {
                const levelCounts = Array.from({ length: PHYSICS_LEVELS }, (_, i) => {
                  const level = i + 1;
                  return stats[`${subject}-level${level}`] || 0;
                });
                return (
                  <div key={subject} className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">{subject}</div>
                    {levelCounts.map((count, idx) => (
                      <div key={idx}>Уровень {idx + 1}: {count}</div>
                    ))}
                  </div>
                );
              } else {
                const theory = stats[`${subject}-theory`] || 0;
                const practice = stats[`${subject}-practice`] || 0;
                return (
                  <div key={subject} className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">{subject}</div>
                    <div>Теория: {theory}</div>
                    <div>Практика: {practice}</div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* Массовое добавление */}
        <BulkImport />

        {/* Импорт/Экспорт */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Импорт/Экспорт</h2>
          <div className="flex gap-4">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Экспорт JSON
            </button>
            <label className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer">
              Импорт JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Фильтры */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Предмет:</label>
              <select
                value={filter.subject}
                onChange={(e) => setFilter({ ...filter, subject: e.target.value, type: '', level: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Все</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {isPhysicsFilter ? (
              <div>
                <label className="block text-sm font-medium mb-2">Уровень:</label>
                <select
                  value={filter.level}
                  onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Все</option>
                  {Array.from({ length: PHYSICS_LEVELS }, (_, i) => i + 1).map(lvl => (
                    <option key={lvl} value={lvl}>Уровень {lvl}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Тип:</label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  disabled={!filter.subject || filter.subject === 'Физика'}
                >
                  <option value="">Все</option>
                  <option value="theory">Теория</option>
                  <option value="practice">Практика</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Поиск:</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по тексту..."
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Список вопросов */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Вопросы ({filteredQuestions.length})</h2>
          
          <div className="space-y-2">
            {filteredQuestions.map(q => (
              <div key={q.id} className="flex items-start gap-4 p-3 border border-gray-200 rounded hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">{q.subject}</span>
                    {q.subject === 'Физика' ? (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                        Уровень {q.level}
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 text-xs rounded ${q.type === 'theory' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                        {q.type === 'theory' ? 'Теория' : 'Практика'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm">{q.text}</div>
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
