import { Question, Ticket } from './types';
import { storage } from './storage';
import { PHYSICS_LEVELS } from './types';

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

  // Physics logic
  if (subject === 'Физика') {
    const physicsQuestions = allQuestions.filter(
      q => q.subject === 'Физика'
    );

    if (physicsQuestions.length === 0) {
      throw new Error('Нет вопросов по физике.');
    }

    const selected: Question[] = [];

    // For each difficulty (1..PHYSICS_LEVELS) select one random question
    for (let difficulty = 1; difficulty <= PHYSICS_LEVELS; difficulty++) {
      const pool = physicsQuestions.filter(
        q => q.difficulty === difficulty
      );

      if (pool.length === 0) {
        throw new Error(
          `Нет вопросов для уровня ${difficulty} по физике. Добавьте хотя бы один вопрос для каждого уровня (1-${PHYSICS_LEVELS}).`
        );
      }

      selected.push(shuffleArray(pool)[0]);
    }

    const ticketNumber = storage.incrementTicketNumber(subject);
    const date = new Date().toLocaleDateString('ru-RU');

    return {
      number: ticketNumber,
      subject,
      date,
      theory: [],
      practice: [],
      physics: selected,
    };
  }

  // Default logic for other subjects
  const theoryPool = allQuestions.filter(
    q => q.subject === subject && q.type === 'theory'
  );
  const practicePool = allQuestions.filter(
    q => q.subject === subject && q.type === 'practice'
  );

  if (theoryPool.length < 2) {
    throw new Error(
      `Недостаточно теоретических вопросов по предмету "${subject}".`
    );
  }

  if (practicePool.length < 3) {
    throw new Error(
      `Недостаточно практических заданий по предмету "${subject}".`
    );
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
