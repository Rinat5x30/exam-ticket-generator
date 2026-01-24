'use client';

import { Ticket as TicketType } from '@/lib/types';

interface TicketProps {
  ticket: TicketType;
}

export default function Ticket({ ticket }: TicketProps) {
  const isPhysics = ticket.subject === 'Физика';
  
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-200 pt-8">
      {/* A6 landscape: 148mm x 105mm */}
      <div className="bg-white shadow-lg" style={{ 
        width: '250mm', 
        height: '135mm',
        padding: '18mm',
        fontFamily: 'Times New Roman, serif'
      }}>
        {/* Шапка */}
        <div className="text-center border-b-2 border-gray-800 pb-2 mb-3">
          <div className="text-sm mb-1">МИНИСТЕРСТВО ОБРАЗОВАНИЯ</div>
          <div className="text-sm mb-1">Азербайджанский Государственный Университет Нефти и Промышленности</div>
          <div className="text-sm mb-2">Кафедра Общей и Прикладной Математики</div>
          <div className="font-bold text-base">{ticket.subject}</div>
          <div className="text-sm mt-1">Билет № {ticket.number}</div>
        </div>

        {isPhysics && ticket.physics && ticket.physics.length > 0 ? (
          /* Физика - только вопросы без заголовков уровней */
          <div className="mb-3">
            {ticket.physics.map((q, idx) => (
              <div key={q.id} className="text-sm mb-1.5">
                {idx + 1}. {q.text}
              </div>
            ))}
          </div>
        ) : !isPhysics ? (
          /* Стандартные предметы - только вопросы без заголовков теория/практика */
          <>
            {ticket.theory.map((q, idx) => (
              <div key={q.id} className="text-sm mb-1.5">
                {idx + 1}. {q.text}
              </div>
            ))}
            {ticket.practice.map((q, idx) => (
              <div key={q.id} className="text-sm mb-1.5">
                {ticket.theory.length + idx + 1}. {q.text}
              </div>
            ))}
          </>
        ) : null}

        {/* Подпись студента */}
        <div className="mt-4 pt-2 border-t border-gray-400">
          <div className="text-sm flex justify-between items-center">
            <span>Подпись студента: _______________</span>
            <span className="text-gray-600">{ticket.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
