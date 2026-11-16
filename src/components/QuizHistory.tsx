import React, { useState } from 'react';
import { History, Play, Trash2 } from 'lucide-react';
import type { QuizAttempt } from '../types/quiz';

interface QuizHistoryProps {
  attempts: QuizAttempt[];
  onClearHistory: () => void;
  onReplayQuiz: (quizId: string) => void;
  onGoExplore: () => void;
}

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({
  attempts,
  onClearHistory,
  onReplayQuiz,
  onGoExplore,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  const totalSessions = attempts.length;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.accuracyPercent, 0) / totalSessions
        )
      : 0;
  const highestScore =
    totalSessions > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Riwayat & Statistik Belajar
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Catatan hasil sesi kuis yang telah Anda selesaikan pada perangkat ini.
          </p>
        </div>

        {totalSessions > 0 && (
          <div className="shrink-0">
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">
                  Hapus semua riwayat?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setConfirmClear(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
                >
                  Ya, Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md cursor-pointer"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan Riwayat</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 tabular-nums">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <span className="block text-xs font-medium text-slate-500 mb-1">
            Total Sesi Selesai
          </span>
          <span className="font-display text-2xl font-bold text-slate-900">
            {totalSessions}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <span className="block text-xs font-medium text-slate-500 mb-1">
            Rata-rata Akurasi
          </span>
          <span className="font-display text-2xl font-bold text-slate-900">
            {avgAccuracy}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <span className="block text-xs font-medium text-slate-500 mb-1">
            Skor Tertinggi
          </span>
          <span className="font-display text-2xl font-bold text-slate-900">
            {highestScore}
          </span>
        </div>
      </div>

      {/* History List */}
      {totalSessions === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6 text-slate-500" />
          </div>
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-1.5">
            Belum Ada Riwayat Kuis
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            Selesaikan satu paket kuis untuk mulai melacak perkembangan akurasi, waktu jawab, dan skor terbaik Anda.
          </p>
          <button
            type="button"
            onClick={onGoExplore}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors cursor-pointer"
          >
            Jelajahi Paket Kuis
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50/70">
                  <th className="py-3.5 px-5">Paket Kuis</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Benar</th>
                  <th className="py-3.5 px-4">Akurasi</th>
                  <th className="py-3.5 px-4">Skor</th>
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm tabular-nums">
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-medium text-slate-900">{attempt.quizTitle}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {attempt.category} · {formatDateTime(attempt.completedAt)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {attempt.mode === 'timed' ? 'Tantangan Waktu' : 'Latihan'}
                    </td>
                    <td className="py-4 px-4 text-slate-700 whitespace-nowrap">
                      {attempt.correctCount} / {attempt.totalQuestions}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {attempt.accuracyPercent}%
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {attempt.score}
                    </td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {attempt.averageTimeSeconds} dtk/soal
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      {!attempt.quizId.startsWith('quick-mix-') && (
                        <button
                          type="button"
                          onClick={() => onReplayQuiz(attempt.quizId)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0284C7] hover:bg-sky-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Ulangi</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
