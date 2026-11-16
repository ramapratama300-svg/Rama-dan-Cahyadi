import type { QuizCategory } from '../types/quiz';

export interface CategoryTheme {
  accentHex: string;
  surfaceBg: string;
  borderColor: string;
  labelColor: string;
  buttonBg: string;
  buttonHover: string;
  topStripBg: string;
}

export const CATEGORY_THEMES: Record<QuizCategory, CategoryTheme> = {
  Sains: {
    accentHex: '#059669',
    surfaceBg: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    labelColor: 'text-emerald-700',
    buttonBg: 'bg-emerald-600',
    buttonHover: 'hover:bg-emerald-700',
    topStripBg: 'bg-emerald-500',
  },
  Matematika: {
    accentHex: '#0284C7',
    surfaceBg: 'bg-sky-50/70',
    borderColor: 'border-sky-200',
    labelColor: 'text-sky-700',
    buttonBg: 'bg-[#0284C7]',
    buttonHover: 'hover:bg-[#0369A1]',
    topStripBg: 'bg-[#0284C7]',
  },
  Sejarah: {
    accentHex: '#D97706',
    surfaceBg: 'bg-amber-50/70',
    borderColor: 'border-amber-200',
    labelColor: 'text-amber-700',
    buttonBg: 'bg-amber-600',
    buttonHover: 'hover:bg-amber-700',
    topStripBg: 'bg-amber-500',
  },
  Geografi: {
    accentHex: '#E11D48',
    surfaceBg: 'bg-rose-50/70',
    borderColor: 'border-rose-200',
    labelColor: 'text-rose-700',
    buttonBg: 'bg-rose-600',
    buttonHover: 'hover:bg-rose-700',
    topStripBg: 'bg-rose-500',
  },
  Kustom: {
    accentHex: '#7C3AED',
    surfaceBg: 'bg-violet-50/70',
    borderColor: 'border-violet-200',
    labelColor: 'text-violet-700',
    buttonBg: 'bg-violet-600',
    buttonHover: 'hover:bg-violet-700',
    topStripBg: 'bg-violet-500',
  },
};

export function getCategoryTheme(category: string): CategoryTheme {
  if (category in CATEGORY_THEMES) {
    return CATEGORY_THEMES[category as QuizCategory];
  }
  return CATEGORY_THEMES.Matematika;
}
