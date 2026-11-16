export type QuizCategory = 'Sains' | 'Matematika' | 'Sejarah' | 'Geografi' | 'Kustom';

export type QuizDifficulty = 'Dasar' | 'Menengah' | 'Lanjut';

export type QuizMode = 'practice' | 'timed';

export interface QuizQuestion {
  id: string;
  prompt: string;
  image?: string;
  imageAlt?: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface QuizPack {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  estimatedMinutes: number;
  coverImage?: string;
  isCustom?: boolean;
  createdAt?: string;
  questions: QuizQuestion[];
}

export interface QuestionResult {
  questionId: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  category: QuizCategory;
  mode: QuizMode;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  accuracyPercent: number;
  bestStreak: number;
  averageTimeSeconds: number;
  completedAt: string;
  results: QuestionResult[];
}
