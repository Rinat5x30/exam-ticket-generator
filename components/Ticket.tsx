'use client';

import { Ticket as TicketType } from '@/lib/types';

interface TicketProps {
  ticket: TicketType;
}

export default function Ticket({ ticket }: TicketProps) {
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

        {/* Теоретические вопросы */}
        <div className="mb-3">
          <div className="font-bold text-sm mb-1">Теоретические вопросы:</div>
          {ticket.theory.map((q, idx) => (
            <div key={q.id} className="text-sm mb-1 ml-2">
              {idx + 1}. {q.text}
            </div>
          ))}
        </div>

        {/* Практические задания */}
        <div className="mb-3">
          <div className="font-bold text-sm mb-1">Практические задания:</div>
          {ticket.practice.map((q, idx) => (
            <div key={q.id} className="text-sm mb-1 ml-2">
              {idx + 1}. {q.text}
            </div>
          ))}
        </div>

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
