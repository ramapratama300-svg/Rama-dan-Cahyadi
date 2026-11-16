import React, { useState } from 'react';
import { ArrowRight, BookOpen, Calculator, Globe2, Landmark, Pencil, Trash2 } from 'lucide-react';
import type { QuizCategory, QuizPack } from '../types/quiz';
import { getCategoryTheme } from '../utils/categoryTheme';

interface QuizCardProps {
  quiz: QuizPack;
  bestAccuracy?: number;
  onSelect: (quiz: QuizPack) => void;
  onEdit?: (quiz: QuizPack) => void;
  onDelete?: (quizId: string) => void;
}

const CategoryFallbackIcon: React.FC<{ category: QuizCategory; className?: string }> = ({
  category,
  className = 'w-7 h-7',
}) => {
  switch (category) {
    case 'Sains':
      return <BookOpen className={className} strokeWidth={1.7} />;
    case 'Sejarah':
      return <Landmark className={className} strokeWidth={1.7} />;
    case 'Matematika':
      return <Calculator className={className} strokeWidth={1.7} />;
    case 'Geografi':
      return <Globe2 className={className} strokeWidth={1.7} />;
    default:
      return <BookOpen className={className} strokeWidth={1.7} />;
  }
};

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  bestAccuracy,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const showImage = Boolean(quiz.coverImage) && !imgFailed;
  const theme = getCategoryTheme(quiz.category);

  return (
    <article className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-slate-300">
      {/* Subtle colorful category accent bar */}
      <div className={`h-1.5 w-full ${theme.topStripBg}`} />

      {/* 4:3 Visual Cover */}
      <div className={`aspect-[4/3] w-full ${theme.surfaceBg} border-b border-slate-200 overflow-hidden relative`}>
        {showImage ? (
          <img
            src={quiz.coverImage}
            alt={`Ilustrasi paket kuis ${quiz.title}`}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center px-6 text-center ${theme.surfaceBg}`}>
            <div className={`w-14 h-14 rounded-2xl bg-white border ${theme.borderColor} flex items-center justify-center mb-3 ${theme.labelColor}`}>
              <CategoryFallbackIcon category={quiz.category} />
            </div>
            <span className={`font-display text-sm font-semibold ${theme.labelColor} line-clamp-1`}>
              {quiz.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold mb-2 tabular-nums">
          <span className={theme.labelColor}>{quiz.category}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500">{quiz.questions.length} Soal</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500">Kelas 3 SD</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500">~{quiz.estimatedMinutes} Menit</span>
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-2 text-balance">
          {quiz.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-5 flex-1">
          {quiz.description}
        </p>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 tabular-nums">
            {bestAccuracy !== undefined ? (
              <span>
                Nilai terbaik:{' '}
                <strong className="font-semibold text-slate-900">{bestAccuracy}%</strong>
              </span>
            ) : (
              <span>{quiz.isCustom ? 'Kuis buatan sendiri' : 'Siap dimainkan'}</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {quiz.isCustom && onEdit && !confirmingDelete && (
              <button
                type="button"
                onClick={() => onEdit(quiz)}
                aria-label={`Edit kuis ${quiz.title}`}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}

            {quiz.isCustom && onDelete && (
              confirmingDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDelete(quiz.id)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
                  >
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-md cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  aria-label={`Hapus kuis ${quiz.title}`}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )
            )}

            {!confirmingDelete && (
              <button
                type="button"
                onClick={() => onSelect(quiz)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white ${theme.buttonBg} ${theme.buttonHover} rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0284C7]`}
              >
                <span>Main Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
