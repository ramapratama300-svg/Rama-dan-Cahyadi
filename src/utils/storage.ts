import type { QuizAttempt, QuizPack } from '../types/quiz';

const CUSTOM_QUIZZES_KEY = 'nalarkuis_custom_quizzes_v1';
const QUIZ_HISTORY_KEY = 'nalarkuis_history_v1';

export function loadCustomQuizzes(): QuizPack[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZZES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomQuizzes(quizzes: QuizPack[]): void {
  try {
    localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(quizzes));
  } catch {
    // Ignore storage quota errors safely
  }
}

export function loadQuizHistory(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveQuizAttempt(attempt: QuizAttempt): QuizAttempt[] {
  const existing = loadQuizHistory();
  const updated = [attempt, ...existing].slice(0, 50);
  try {
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors safely
  }
  return updated;
}

export function clearQuizHistory(): void {
  try {
    localStorage.removeItem(QUIZ_HISTORY_KEY);
  } catch {
    // Ignore errors safely
  }
}
