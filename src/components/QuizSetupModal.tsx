import React, { useState } from 'react';
import { Clock, BookOpenCheck, Shuffle, X } from 'lucide-react';
import type { QuizMode, QuizPack } from '../types/quiz';

export interface QuizStartConfig {
  mode: QuizMode;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

interface QuizSetupModalProps {
  quiz: QuizPack;
  onClose: () => void;
  onStart: (config: QuizStartConfig) => void;
}

export const QuizSetupModal: React.FC<QuizSetupModalProps> = ({
  quiz,
  onClose,
  onStart,
}) => {
  const [mode, setMode] = useState<QuizMode>('practice');
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-quiz-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5 tabular-nums">
              <span>{quiz.category}</span>
              <span aria-hidden="true">·</span>
              <span>{quiz.questions.length} Soal</span>
              <span aria-hidden="true">·</span>
              <span>{quiz.difficulty}</span>
            </div>
            <h2
              id="setup-quiz-title"
              className="font-display text-xl font-bold text-slate-900 text-balance"
            >
              {quiz.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan kuis"
            className="p-2 -mr-2 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6">
          {/* Mode selection */}
          <div>
            <span className="block text-sm font-semibold text-slate-900 mb-3">
              Pilih Mode Permainan
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                  mode === 'practice'
                    ? 'border-[#0284C7] bg-sky-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpenCheck
                    className={`w-4 h-4 ${
                      mode === 'practice' ? 'text-[#0284C7]' : 'text-slate-500'
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-900">Mode Latihan</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tanpa batas waktu. Pembahasan tampil langsung setelah menjawab.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('timed')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                  mode === 'timed'
                    ? 'border-[#0284C7] bg-sky-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock
                    className={`w-4 h-4 ${
                      mode === 'timed' ? 'text-[#0284C7]' : 'text-slate-500'
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-900">Tantangan Waktu</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  20 detik per soal. Jawaban cepat memberi bonus skor tambahan.
                </p>
              </button>
            </div>
          </div>

          {/* Shuffle toggles */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Shuffle className="w-4 h-4 text-slate-500" />
              Opsi Pengacakan
            </span>

            <label className="flex items-center justify-between gap-4 py-1 cursor-pointer select-none">
              <span className="text-sm text-slate-700">Acak urutan pertanyaan</span>
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="w-4 h-4 accent-[#0284C7] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-4 py-1 cursor-pointer select-none">
              <span className="text-sm text-slate-700">Acak urutan pilihan jawaban</span>
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(e) => setShuffleOptions(e.target.checked)}
                className="w-4 h-4 accent-[#0284C7] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onStart({ mode, shuffleQuestions, shuffleOptions })}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0284C7]"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
