import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, RotateCcw, Star, XCircle } from 'lucide-react';
import type { QuizAttempt } from '../types/quiz';
import { getCategoryTheme } from '../utils/categoryTheme';

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetry: () => void;
  onBackToCatalog: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export const QuizResults: React.FC<QuizResultsProps> = ({
  attempt,
  onRetry,
  onBackToCatalog,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect'>('all');
  const theme = getCategoryTheme(attempt.category);

  const incorrectCount = attempt.totalQuestions - attempt.correctCount;
  const visibleResults =
    filter === 'incorrect'
      ? attempt.results.filter((r) => !r.isCorrect)
      : attempt.results;

  const earnedStars =
    attempt.accuracyPercent >= 85 ? 3 : attempt.accuracyPercent >= 60 ? 2 : 1;

  const getPerformanceHeadline = (accuracy: number) => {
    if (accuracy >= 85) return 'Hebat Sekali! Kamu Bintang Kuis!';
    if (accuracy >= 60) return 'Bagus! Terus Berlatih Ya!';
    return 'Tetap Semangat! Yuk Coba Lagi!';
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8">
        <div className={`h-2 w-full ${theme.topStripBg}`} />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mb-3" aria-label={`Meraih ${earnedStars} dari 3 bintang`}>
                {[1, 2, 3].map((starIndex) => {
                  const active = starIndex <= earnedStars;
                  return (
                    <Star
                      key={starIndex}
                      className={`w-6 h-6 ${
                        active
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  );
                })}
                <span className="ml-2 text-xs font-semibold text-amber-700 tabular-nums">
                  {earnedStars} / 3 Bintang
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold mb-1.5">
                <span className={theme.labelColor}>{attempt.quizTitle}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">
                  {attempt.mode === 'timed' ? 'Tantangan Waktu' : 'Mode Latihan'}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                {getPerformanceHeadline(attempt.accuracyPercent)}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onBackToCatalog}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Pilih Kuis Lain</span>
              </button>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Lagi</span>
              </button>
            </div>
          </div>

          {/* 4-column colorful metric strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 tabular-nums">
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
              <span className="block text-xs font-semibold text-sky-700 mb-1">Skor Kamu</span>
              <span className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {attempt.score}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ {attempt.maxScore}</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="block text-xs font-semibold text-emerald-700 mb-1">Ketepatan</span>
              <span className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {attempt.accuracyPercent}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="block text-xs font-semibold text-amber-700 mb-1">Jawaban Benar</span>
              <span className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {attempt.correctCount}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ {attempt.totalQuestions} soal</span>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="block text-xs font-semibold text-rose-700 mb-1">
                Kecepatan
              </span>
              <span className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {attempt.averageTimeSeconds}
              </span>
              <span className="text-xs text-slate-500 ml-1">dtk/soal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Pembahasan Jawaban
        </h2>

        <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({attempt.totalQuestions})
          </button>
          <button
            type="button"
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'incorrect'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perlu Dipelajari ({incorrectCount})
          </button>
        </div>
      </div>

      {/* Review List */}
      {visibleResults.length === 0 ? (
        <div className="bg-white border border-emerald-200 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-900 mb-1">
            Wah, Semua Jawabanmu Benar!
          </p>
          <p className="text-xs text-slate-500">
            Tidak ada jawaban salah pada kuis ini. Pertahankan semangat belajarmu!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleResults.map((item) => {
            const originalIndex = attempt.results.findIndex(
              (r) => r.questionId === item.questionId
            );

            return (
              <article
                key={item.questionId}
                className="bg-white border border-slate-200 rounded-xl p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-xs font-medium tabular-nums">
                    <span className="text-slate-500">Soal {originalIndex + 1}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{item.timeSpentSeconds} detik</span>
                  </div>

                  {item.isCorrect ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Benar</span>
                    </span>
                  ) : item.selectedIndex === null ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                      <Clock className="w-4 h-4" />
                      <span>Waktu Habis</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
                      <XCircle className="w-4 h-4" />
                      <span>Belum Tepat</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base sm:text-lg font-semibold text-slate-900 mb-4">
                  {item.prompt}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                    <span className="block text-xs text-slate-500 mb-1">Jawabanmu</span>
                    <span
                      className={`font-medium ${
                        item.isCorrect
                          ? 'text-emerald-800'
                          : item.selectedIndex === null
                          ? 'text-amber-800'
                          : 'text-red-800'
                      }`}
                    >
                      {item.selectedIndex !== null
                        ? `${OPTION_LABELS[item.selectedIndex]}. ${item.options[item.selectedIndex]}`
                        : 'Tidak dijawab'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                    <span className="block text-xs text-emerald-700 mb-1">Jawaban Benar</span>
                    <span className="font-medium text-slate-900">
                      {OPTION_LABELS[item.correctIndex]}. {item.options[item.correctIndex]}
                    </span>
                  </div>
                </div>

                {item.explanation && (
                  <p className="text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                    <strong className="font-semibold text-slate-800">Penjelasan: </strong>
                    {item.explanation}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
