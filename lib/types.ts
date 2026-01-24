export interface Question {
  id: string;
  subject: string;
  type: 'theory' | 'practice';
  text: string;
  tags?: string[];
  difficulty?: number; // 1–5 (for Physics)
}

export interface Ticket {
  number: number;
  subject: string;
  date: string;
  theory: Question[];
  practice: Question[];
  physics?: Question[]; // optional, if you use level-based physics tickets
}

export const SUBJECTS = [
  'Анализ Алгоритмов',
  'Комплексный Анализ',
  'Диференциальные уравнения',
  'Численные методы',
  'Физика',
] as const;

export const PHYSICS_LEVELS = 5;
