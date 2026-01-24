import { Question, Ticket, PHYSICS_LEVELS } from './types';
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
  
  // Special logic for Physics
  if (subject === 'Физика') {
    return generatePhysicsTicket(allQuestions);
  }
  
  // Standard logic for other subjects
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

function generatePhysicsTicket(allQuestions: Question[]): Ticket {
  const physicsQuestions = allQuestions.filter(q => q.subject === 'Физика');
  const selectedQuestions: Question[] = [];
  
  // For each level (1 to PHYSICS_LEVELS), select one random question
  for (let level = 1; level <= PHYSICS_LEVELS; level++) {
    const levelPool = physicsQuestions.filter(q => q.level === level);
    
    if (levelPool.length === 0) {
      throw new Error(`Нет вопросов для уровня ${level} по физике. Добавьте хотя бы один вопрос для каждого уровня (1-${PHYSICS_LEVELS}).`);
    }
    
    const selected = shuffleArray(levelPool)[0];
    selectedQuestions.push(selected);
  }
  
  const ticketNumber = storage.incrementTicketNumber('Физика');
  const date = new Date().toLocaleDateString('ru-RU');
  
  return {
    number: ticketNumber,
    subject: 'Физика',
    date,
    theory: [],
    practice: [],
    physics: selectedQuestions,
  };
}

export function validateQuestionCount(subject: string): { valid: boolean; message?: string } {
  const allQuestions = storage.getQuestions();
  
  // Special validation for Physics
  if (subject === 'Физика') {
    const physicsQuestions = allQuestions.filter(q => q.subject === 'Физика');
    const missingLevels: number[] = [];
    
    for (let level = 1; level <= PHYSICS_LEVELS; level++) {
      const levelCount = physicsQuestions.filter(q => q.level === level).length;
      if (levelCount === 0) {
        missingLevels.push(level);
      }
    }
    
    if (missingLevels.length > 0) {
      return {
        valid: false,
        message: `Недостаточно вопросов по физике. Отсутствуют вопросы для уровней: ${missingLevels.join(', ')}`
      };
    }
    
    return { valid: true };
  }
  
  // Standard validation for other subjects
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
