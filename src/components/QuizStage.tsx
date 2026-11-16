import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { QuestionResult, QuizAttempt, QuizMode, QuizPack, QuizQuestion } from '../types/quiz';
import { getCategoryTheme } from '../utils/categoryTheme';

interface QuizStageProps {
  quiz: QuizPack;
  mode: QuizMode;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  onExit: () => void;
  onComplete: (attempt: QuizAttempt) => void;
}

const SECONDS_PER_QUESTION = 20;
const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

const OPTION_BADGE_COLORS = [
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-rose-100 text-rose-800 border-rose-200',
] as const;

function prepareQuestions(
  questions: QuizQuestion[],
  shuffleQuestions: boolean,
  shuffleOptions: boolean
): QuizQuestion[] {
  const cloned = questions.map((q) => {
    if (!shuffleOptions) return { ...q };
    const indexed = q.options.map((text, idx) => ({
      text,
      isCorrect: idx === q.correctIndex,
    }));
    const shuffled = [...indexed].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffled.findIndex((item) => item.isCorrect) as 0 | 1 | 2 | 3;
    return {
      ...q,
      options: shuffled.map((item) => item.text) as [string, string, string, string],
      correctIndex: newCorrectIndex,
    };
  });

  if (shuffleQuestions) {
    return [...cloned].sort(() => Math.random() - 0.5);
  }
  return cloned;
}

export const QuizStage: React.FC<QuizStageProps> = ({
  quiz,
  mode,
  shuffleQuestions,
  shuffleOptions,
  onExit,
  onComplete,
}) => {
  const preparedQuestions = useMemo(
    () => prepareQuestions(quiz.questions, shuffleQuestions, shuffleOptions),
    [quiz, shuffleQuestions, shuffleOptions]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const questionStartRef = useRef<number>(Date.now());
  const currentQuestion = preparedQuestions[currentIndex];
  const totalQuestions = preparedQuestions.length;
  const theme = getCategoryTheme(quiz.category);

  const submitAnswer = useCallback(
    (optionIndex: number | null, wasTimeout = false) => {
      if (isLocked || !currentQuestion) return;

      const elapsedSeconds = Math.max(
        1,
        Math.round((Date.now() - questionStartRef.current) / 100) / 10
      );
      const isCorrect = optionIndex !== null && optionIndex === currentQuestion.correctIndex;

      let pointsEarned = 0;
      if (isCorrect) {
        const basePoints = 100;
        const timeBonus =
          mode === 'timed' ? Math.max(0, Math.round((timeLeft / SECONDS_PER_QUESTION) * 50)) : 0;
        pointsEarned = basePoints + timeBonus;
      }

      const nextStreak = isCorrect ? streak + 1 : 0;
      const nextBestStreak = Math.max(bestStreak, nextStreak);

      setSelectedOption(optionIndex);
      setTimedOut(wasTimeout);
      setIsLocked(true);
      setScore((prev) => prev + pointsEarned);
      setStreak(nextStreak);
      setBestStreak(nextBestStreak);

      const record: QuestionResult = {
        questionId: currentQuestion.id,
        prompt: currentQuestion.prompt,
        options: currentQuestion.options,
        correctIndex: currentQuestion.correctIndex,
        selectedIndex: optionIndex,
        isCorrect,
        timeSpentSeconds: wasTimeout ? SECONDS_PER_QUESTION : elapsedSeconds,
        explanation: currentQuestion.explanation,
      };

      setResults((prev) => [...prev, record]);
    },
    [isLocked, currentQuestion, mode, timeLeft, streak, bestStreak]
  );

  useEffect(() => {
    if (mode !== 'timed' || isLocked) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [mode, isLocked, currentIndex]);

  useEffect(() => {
    if (mode === 'timed' && timeLeft === 0 && !isLocked) {
      submitAnswer(null, true);
    }
  }, [mode, timeLeft, isLocked, submitAnswer]);

  const handleNext = useCallback(() => {
    if (!isLocked) return;

    if (currentIndex + 1 >= totalQuestions) {
      const correctCount = results.filter((r) => r.isCorrect).length;
      const totalTime = results.reduce((acc, r) => acc + r.timeSpentSeconds, 0);
      const maxPointsPerQ = mode === 'timed' ? 150 : 100;

      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        quizId: quiz.id,
        quizTitle: quiz.title,
        category: quiz.category,
        mode,
        score,
        maxScore: totalQuestions * maxPointsPerQ,
        correctCount,
        totalQuestions,
        accuracyPercent: Math.round((correctCount / totalQuestions) * 100),
        bestStreak,
        averageTimeSeconds: Math.round((totalTime / totalQuestions) * 10) / 10,
        completedAt: new Date().toISOString(),
        results,
      };
      onComplete(attempt);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setIsLocked(false);
    setTimedOut(false);
    setImgFailed(false);
    setTimeLeft(SECONDS_PER_QUESTION);
    questionStartRef.current = Date.now();
  }, [isLocked, currentIndex, totalQuestions, results, mode, quiz, score, bestStreak, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (confirmQuit) return;
      const key = e.key.toUpperCase();

      if (!isLocked) {
        if (key === '1' || key === 'A') submitAnswer(0);
        else if (key === '2' || key === 'B') submitAnswer(1);
        else if (key === '3' || key === 'C') submitAnswer(2);
        else if (key === '4' || key === 'D') submitAnswer(3);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, confirmQuit, submitAnswer, handleNext]);

  if (!currentQuestion) return null;

  const progressPercent = Math.round(((currentIndex + (isLocked ? 1 : 0)) / totalQuestions) * 100);
  const timerPercent = Math.round((timeLeft / SECONDS_PER_QUESTION) * 100);
  const isLastQuestion = currentIndex + 1 === totalQuestions;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Top control bar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        {confirmQuit ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-700 font-medium">Keluar dari kuis ini?</span>
            <button
              type="button"
              onClick={onExit}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
            >
              Ya, Keluar
            </button>
            <button
              type="button"
              onClick={() => setConfirmQuit(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md cursor-pointer"
            >
              Lanjut Main
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmQuit(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        )}

        <div className="flex items-center gap-4 text-sm tabular-nums">
          {streak >= 2 && (
            <span className="text-xs font-semibold text-amber-700">
              Beruntun {streak}x!
            </span>
          )}
          <span className="text-slate-600">
            Skor: <strong className="font-bold text-slate-900">{score}</strong>
          </span>
          <span className="font-mono text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Overall colorful progress bar */}
      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full ${theme.topStripBg} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className={`h-1.5 w-full ${theme.topStripBg}`} />

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="text-xs font-semibold">
              <span className={theme.labelColor}>{quiz.title}</span>
              <span aria-hidden="true" className="text-slate-300"> · </span>
              <span className="text-slate-500">
                {mode === 'timed' ? 'Tantangan Waktu' : 'Mode Latihan'}
              </span>
            </div>

            {mode === 'timed' && (
              <div
                className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold tabular-nums ${
                  timeLeft <= 5 ? 'text-red-600' : 'text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft} dtk</span>
              </div>
            )}
          </div>

          {mode === 'timed' && (
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div
                className={`h-full transition-all duration-500 linear ${
                  timeLeft <= 5 ? 'bg-red-500' : 'bg-amber-500'
                }`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>
          )}

          {/* Optional Question Picture */}
          {currentQuestion.image && !imgFailed && (
            <div className={`mb-6 rounded-xl overflow-hidden border ${theme.borderColor} ${theme.surfaceBg}`}>
              <img
                src={currentQuestion.image}
                alt={currentQuestion.imageAlt || 'Gambar pendukung pertanyaan'}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-44 sm:h-56 object-cover"
              />
            </div>
          )}

          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-6 text-balance">
            {currentQuestion.prompt}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3" role="radiogroup" aria-label="Pilihan jawaban">
            {currentQuestion.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = currentQuestion.correctIndex === idx;

              let containerStyle =
                'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40 text-slate-800';
              let labelBadgeStyle: string = OPTION_BADGE_COLORS[idx];
              let statusLabel: React.ReactNode = null;

              if (isLocked) {
                if (isCorrectOption) {
                  containerStyle = 'border-emerald-500 bg-emerald-50 text-slate-900';
                  labelBadgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                  statusLabel = (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Benar!</span>
                    </span>
                  );
                } else if (isSelected) {
                  containerStyle = 'border-red-400 bg-red-50 text-slate-900';
                  labelBadgeStyle = 'bg-red-600 text-white border-red-600';
                  statusLabel = (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 shrink-0">
                      <XCircle className="w-4 h-4" />
                      <span>Belum Tepat</span>
                    </span>
                  );
                } else {
                  containerStyle = 'border-slate-200 bg-slate-50/40 text-slate-400';
                  labelBadgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isLocked}
                  onClick={() => submitAnswer(idx)}
                  className={`w-full min-h-[60px] px-4 py-3.5 rounded-xl border-2 text-left flex items-center justify-between gap-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                    isLocked ? 'cursor-default' : 'cursor-pointer'
                  } ${containerStyle}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-lg border text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${labelBadgeStyle}`}
                    >
                      {OPTION_LABELS[idx]}
                    </span>
                    <span className="text-sm sm:text-base font-medium leading-snug">
                      {optionText}
                    </span>
                  </div>
                  {statusLabel}
                </button>
              );
            })}
          </div>

          {/* Immediate explanation & Next action */}
          {isLocked && (
            <div className="mt-7 pt-6 border-t border-slate-100 space-y-5">
              <div
                className={`rounded-xl p-4 sm:p-5 border ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : timedOut
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-sky-50/70 border-sky-200'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold mb-1.5">
                  {timedOut ? (
                    <>
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-800">Waktu Habis! Yuk Lihat Jawabannya</span>
                    </>
                  ) : selectedOption === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-800">Hebat! Jawabanmu Benar</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-slate-900">Hampir Tepat! Yuk Belajar Bareng</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {currentQuestion.explanation ||
                    `Jawaban yang benar adalah ${OPTION_LABELS[currentQuestion.correctIndex]}: ${
                      currentQuestion.options[currentQuestion.correctIndex]
                    }.`}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="hidden sm:inline text-xs text-slate-400">
                  Tekan tombol Enter untuk lanjut
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`ml-auto inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white ${theme.buttonBg} ${theme.buttonHover} rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0284C7]`}
                >
                  <span>{isLastQuestion ? 'Lihat Hasil & Bintangmu' : 'Soal Berikutnya'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isLocked && (
        <p className="mt-4 text-center text-xs text-slate-400">
          Tips: kamu juga bisa menekan huruf A, B, C, atau D di keyboard
        </p>
      )}
    </section>
  );
};
