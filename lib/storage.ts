import { Question, SUBJECTS } from './types';
import {
  validateQuestionText,
  validateQuestions,
  validateJsonString,
  sanitizeQuestion,
  LIMITS,
  ValidationError,
} from './validators';

const STORAGE_KEYS = {
  QUESTIONS: 'exam_questions',
  TICKET_NUMBERS: 'exam_last_ticket_numbers',
} as const;

export const storage = {
  getQuestions: (): Question[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      
      return parsed;
    } catch {
      console.error('Ошибка при чтении вопросов из localStorage');
      return [];
    }
  },

  saveQuestions: (questions: Question[]): void => {
    try {
      // Проверяем общее количество вопросов
      if (questions.length > LIMITS.MAX_QUESTIONS_TOTAL) {
        throw new ValidationError(
          `Максимум вопросов: ${LIMITS.MAX_QUESTIONS_TOTAL}`
        );
      }

      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (error) {
      throw new ValidationError(
        `Ошибка при сохранении: ${(error as Error).message}`
      );
    }
  },

  addQuestion: (question: Omit<Question, 'id'>): Question => {
    try {
      validateQuestionText(question.text);
    } catch (error) {
      throw error;
    }

    const questions = storage.getQuestions();
    const newQuestion = { ...question, id: crypto.randomUUID() };
    questions.push(newQuestion);
    storage.saveQuestions(questions);
    return newQuestion;
  },

  addQuestions: (questions: Omit<Question, 'id'>[]): Question[] => {
    try {
      // Валидация каждого вопроса перед добавлением
      questions.forEach(q => {
        validateQuestionText(q.text);
      });

      const existing = storage.getQuestions();
      
      // Проверка общего лимита
      if (existing.length + questions.length > LIMITS.MAX_QUESTIONS_TOTAL) {
        throw new ValidationError(
          `Будет превышено максимальное количество вопросов (${LIMITS.MAX_QUESTIONS_TOTAL})`
        );
      }

      const newQuestions = questions.map(q => ({
        ...q,
        id: crypto.randomUUID(),
      }));
      storage.saveQuestions([...existing, ...newQuestions]);
      return newQuestions;
    } catch (error) {
      throw error;
    }
  },

  deleteQuestion: (id: string): void => {
    const questions = storage.getQuestions().filter(q => q.id !== id);
    storage.saveQuestions(questions);
  },

  getTicketNumber: (subject: string): number => {
    if (typeof window === 'undefined') return 0;
    const data = localStorage.getItem(STORAGE_KEYS.TICKET_NUMBERS);
    const numbers = data ? JSON.parse(data) : {};
    return numbers[subject] || 0;
  },

  incrementTicketNumber: (subject: string): number => {
    if (typeof window === 'undefined') return 1;
    const data = localStorage.getItem(STORAGE_KEYS.TICKET_NUMBERS);
    const numbers = data ? JSON.parse(data) : {};
    numbers[subject] = (numbers[subject] || 0) + 1;
    localStorage.setItem(
      STORAGE_KEYS.TICKET_NUMBERS,
      JSON.stringify(numbers)
    );
    return numbers[subject];
  },

  exportQuestions: (): string => {
    const questions = storage.getQuestions();
    if (questions.length === 0) {
      throw new ValidationError('Нет вопросов для экспорта');
    }
    return JSON.stringify(questions, null, 2);
  },

  importQuestions: (jsonString: string): void => {
    try {
      // Валидация JSON
      const data = validateJsonString(jsonString);
      
      // Валидация структуры
      validateQuestions(data as unknown[]);

      // Санитизация каждого вопроса
      const questions = (data as any[]).map(q => sanitizeQuestion(q)) as Question[];

      storage.saveQuestions(questions);
    } catch (error) {
      throw error;
    }
  },
};
