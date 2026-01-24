import { Question } from './types';

const STORAGE_KEYS = {
  QUESTIONS: 'exam_questions',
  TICKET_NUMBERS: 'exam_last_ticket_numbers',
} as const;

export const storage = {
  getQuestions: (): Question[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return data ? JSON.parse(data) : [];
  },

  saveQuestions: (questions: Question[]): void => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  addQuestion: (question: Omit<Question, 'id'>): Question => {
    const questions = storage.getQuestions();
    const newQuestion = { ...question, id: crypto.randomUUID() };
    questions.push(newQuestion);
    storage.saveQuestions(questions);
    return newQuestion;
  },

  addQuestions: (questions: Omit<Question, 'id'>[]): Question[] => {
    const existing = storage.getQuestions();
    const newQuestions = questions.map(q => ({
      ...q,
      id: crypto.randomUUID(),
    }));
    storage.saveQuestions([...existing, ...newQuestions]);
    return newQuestions;
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
    return JSON.stringify(storage.getQuestions(), null, 2);
  },

  importQuestions: (jsonString: string): void => {
    const questions = JSON.parse(jsonString) as Question[];
    storage.saveQuestions(questions);
  },
};
