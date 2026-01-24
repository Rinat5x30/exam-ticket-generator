export interface Question {
  id: string;
  subject: string;
  type: 'theory' | 'practice';
  text: string;
  tags?: string[];
  level?: number; // For Physics: 1-5 levels
}

export interface Ticket {
  number: number;
  subject: string;
  date: string;
  theory: Question[];
  practice: Question[];
  physics?: Question[]; // For Physics level-based questions
}

export const SUBJECTS = [
  'Анализ Алгоритмов',
  'Комплексный Анализ',
  'Диференциальные уравнения',
  'Численные методы',
  'Физика', // New subject with custom logic
] as const;

export const PHYSICS_LEVELS = 5; // Number of levels for Physics
