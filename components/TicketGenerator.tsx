'use client';

import { useState } from 'react';
import { generateTicket, validateQuestionCount } from '@/lib/generator';
import { Ticket as TicketType, SUBJECTS } from '@/lib/types';
import Ticket from './Ticket';
import Link from 'next/link';

export default function TicketGenerator() {
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [error, setError] = useState<string>('');

  const handleGenerate = () => {
    try {
      setError('');
      const newTicket = generateTicket(subject);
      setTicket(newTicket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка генерации');
      setTicket(null);
    }
  };

  const handleRegenerate = () => {
    if (!ticket) return;
    try {
      setError('');
      const newTicket = generateTicket(ticket.subject);
      setTicket(newTicket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка генерации');
    }
  };

  const handleCopy = () => {
    if (!ticket) return;
    
    const text = `
БИЛЕТ № ${ticket.number}
Предмет: ${ticket.subject}
Дата: ${ticket.date}

ТЕОРЕТИЧЕСКИЕ ВОПРОСЫ:
${ticket.theory.map((q, i) => `${i + 1}. ${q.text}`).join('\n')}

ПРАКТИЧЕСКИЕ ЗАДАНИЯ:
${ticket.practice.map((q, i) => `${i + 1}. ${q.text}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert('Билет скопирован в буфер обмена');
  };

  const validation = validateQuestionCount(subject);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Панель управления */}
      <div className="bg-white shadow-md p-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Генератор Экзаменационных Билетов</h1>
          
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Предмет:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!validation.valid}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Сгенерировать
            </button>

            {ticket && (
              <>
                <button
                  onClick={handleRegenerate}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Перегенерировать
                </button>

                <button
                  onClick={handleCopy}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Копировать билет
                </button>
              </>
            )}

            <Link
              href="/questions"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Управление вопросами
            </Link>
          </div>

          {!validation.valid && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-800">{validation.message}</p>
              <Link href="/questions" className="text-blue-600 underline">
                Добавить вопросы →
              </Link>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-800">{error}</p>
              <Link href="/questions" className="text-blue-600 underline">
                Добавить вопросы →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Билет */}
      {ticket && <Ticket ticket={ticket} />}
    </div>
  );
}
