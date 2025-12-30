import { Question, Ticket } from './types';
import { storage } from './storage';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateTicket(subject: string): Ticket {
  const allQuestions = storage.getQuestions();
  
  const theoryPool = allQuestions.filter(
    q => q.subject === subject && q.type === 'theory'
  );
  const practicePool = allQuestions.filter(
    q => q.subject === subject && q.type === 'practice'
  );

  if (theoryPool.length < 2) {
    throw new Error(`Недостаточно теоретических вопросов по предмету "${subject}". Требуется минимум 2, найдено: ${theoryPool.length}`);
  }

  if (practicePool.length < 3) {
    throw new Error(`Недостаточно практических заданий по предмету "${subject}". Требуется минимум 3, найдено: ${practicePool.length}`);
  }

  const selectedTheory = shuffleArray(theoryPool).slice(0, 2);
  const selectedPractice = shuffleArray(practicePool).slice(0, 3);

  const ticketNumber = storage.incrementTicketNumber(subject);
  const date = new Date().toLocaleDateString('ru-RU');

  return {
    number: ticketNumber,
    subject,
    date,
    theory: selectedTheory,
    practice: selectedPractice,
  };
}

export function validateQuestionCount(subject: string): { valid: boolean; message?: string } {
  const allQuestions = storage.getQuestions();
  const theoryCount = allQuestions.filter(q => q.subject === subject && q.type === 'theory').length;
  const practiceCount = allQuestions.filter(q => q.subject === subject && q.type === 'practice').length;

  if (theoryCount < 2 || practiceCount < 3) {
    return {
      valid: false,
      message: `Недостаточно вопросов: теория ${theoryCount}/2, практика ${practiceCount}/3`
    };
  }

  return { valid: true };
}
