export interface Question {
  id: string;
  subject: string;
  type: 'theory' | 'practice';
  text: string;
  tags?: string[];
}

export interface Ticket {
  number: number;
  subject: string;
  date: string;
  theory: Question[];
  practice: Question[];
}

export const SUBJECTS = [
  'Анализ Алгоритмов',
  'Комплексный Анализ',
  'Диференциальные уравнения',
  'Численные методы',
] as const;
