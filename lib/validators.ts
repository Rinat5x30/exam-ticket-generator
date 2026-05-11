// Validator для данных
import { Question } from './types';

export const LIMITS = {
  MAX_QUESTION_LENGTH: 5000,
  MAX_QUESTIONS_PER_BULK: 1000,
  MAX_QUESTIONS_TOTAL: 10000,
  MAX_IMPORT_SIZE: 1048576, // 1MB
  MAX_SUBJECT_LENGTH: 100,
} as const;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Валидация текста вопроса
 */
export function validateQuestionText(text: string): void {
  if (!text || typeof text !== 'string') {
    throw new ValidationError('Текст вопроса должен быть строкой');
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('Текст вопроса не может быть пустым');
  }

  if (trimmed.length > LIMITS.MAX_QUESTION_LENGTH) {
    throw new ValidationError(
      `Текст вопроса не может превышать ${LIMITS.MAX_QUESTION_LENGTH} символов`
    );
  }

  // Проверка на потенциальные injection атаки
  if (containsMaliciousPatterns(trimmed)) {
    throw new ValidationError('Текст содержит недопустимые символы');
  }
}

/**
 * Валидация предмета
 */
export function validateSubject(subject: string, validSubjects: string[]): void {
  if (!subject || typeof subject !== 'string') {
    throw new ValidationError('Предмет должен быть строкой');
  }

  if (subject.length > LIMITS.MAX_SUBJECT_LENGTH) {
    throw new ValidationError('Название предмета слишком длинное');
  }

  if (!validSubjects.includes(subject)) {
    throw new ValidationError(`Неизвестный предмет: ${subject}`);
  }
}

/**
 * Валидация массива вопросов
 */
export function validateQuestions(questions: unknown[]): void {
  if (!Array.isArray(questions)) {
    throw new ValidationError('Данные должны быть массивом вопросов');
  }

  if (questions.length === 0) {
    throw new ValidationError('Массив вопросов не может быть пустым');
  }

  if (questions.length > LIMITS.MAX_QUESTIONS_PER_BULK) {
    throw new ValidationError(
      `Нельзя импортировать более ${LIMITS.MAX_QUESTIONS_PER_BULK} вопросов за раз`
    );
  }

  questions.forEach((q, index) => {
    if (!q || typeof q !== 'object') {
      throw new ValidationError(`Вопрос ${index} имеет неверный формат`);
    }

    const question = q as Record<string, unknown>;

    // Проверка обязательных полей
    if (!question.subject || typeof question.subject !== 'string') {
      throw new ValidationError(`Вопрос ${index}: отсутствует или неверный предмет`);
    }

    if (!question.text || typeof question.text !== 'string') {
      throw new ValidationError(`Вопрос ${index}: отсутствует или неверный текст`);
    }

    if (!question.type || !['theory', 'practice'].includes(question.type as string)) {
      throw new ValidationError(`Вопрос ${index}: неверный тип вопроса`);
    }

    try {
      validateQuestionText(question.text);
    } catch (error) {
      throw new ValidationError(`Вопрос ${index}: ${(error as Error).message}`);
    }
  });
}

/**
 * Валидация JSON строки
 */
export function validateJsonString(jsonString: string): unknown {
  if (!jsonString || typeof jsonString !== 'string') {
    throw new ValidationError('JSON должен быть строкой');
  }

  if (jsonString.length > LIMITS.MAX_IMPORT_SIZE) {
    throw new ValidationError(
      `Размер файла превышает ${LIMITS.MAX_IMPORT_SIZE / 1048576}MB`
    );
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new ValidationError(`Неверный JSON формат: ${(error as Error).message}`);
  }
}

/**
 * Проверка на потенциально вредоносные паттерны
 */
function containsMaliciousPatterns(text: string): boolean {
  // Проверяем на строки, которые могут быть injection vector'ами
  const maliciousPatterns = [
    /<script\b/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc
    /eval\(/i,
    /expression\s*\(/i,
    /<iframe\b/i,
    /<embed\b/i,
    /<object\b/i,
  ];

  return maliciousPatterns.some(pattern => pattern.test(text));
}

/**
 * Санитизация текста для безопасного отображения
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Удаляем потенциально опасные символы
  return text
    .trim()
    .replace(/[<>]/g, '') // Удаляем < и >
    .substring(0, LIMITS.MAX_QUESTION_LENGTH);
}

/**
 * Безопасная очистка объекта Question
 */
export function sanitizeQuestion(question: any): Partial<Question> {
  return {
    subject: sanitizeText(question.subject),
    text: sanitizeText(question.text),
    type: ['theory', 'practice'].includes(question.type) ? question.type : 'theory',
    difficulty: Number.isInteger(question.difficulty) && question.difficulty > 0
      ? question.difficulty
      : 1,
  };
}
