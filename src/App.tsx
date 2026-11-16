import React, { useMemo, useState } from 'react';
import { BookOpen, Plus, Search, Shuffle } from 'lucide-react';
import { Header, type AppView } from './components/Header';
import { QuizCard } from './components/QuizCard';
import { QuizSetupModal, type QuizStartConfig } from './components/QuizSetupModal';
import { QuizStage } from './components/QuizStage';
import { QuizResults } from './components/QuizResults';
import { QuizBuilder } from './components/QuizBuilder';
import { QuizHistory } from './components/QuizHistory';
import { BUILT_IN_QUIZZES, createQuickMixQuiz, HERO_ILLUSTRATION } from './data/quizzes';
import type { QuizAttempt, QuizCategory, QuizPack } from './types/quiz';
import {
  clearQuizHistory,
  loadCustomQuizzes,
  loadQuizHistory,
  saveCustomQuizzes,
  saveQuizAttempt,
} from './utils/storage';

type CategoryFilter = 'Semua' | QuizCategory;

interface ActiveSession {
  sessionId: number;
  quiz: QuizPack;
  config: QuizStartConfig;
}

const FILTER_OPTIONS: CategoryFilter[] = [
  'Semua',
  'Sains',
  'Matematika',
  'Sejarah',
  'Geografi',
  'Kustom',
];

const FILTER_ACTIVE_STYLES: Record<CategoryFilter, string> = {
  Semua: 'bg-[#0284C7] text-white shadow-xs',
  Sains: 'bg-emerald-600 text-white shadow-xs',
  Matematika: 'bg-[#0284C7] text-white shadow-xs',
  Sejarah: 'bg-amber-600 text-white shadow-xs',
  Geografi: 'bg-rose-600 text-white shadow-xs',
  Kustom: 'bg-violet-600 text-white shadow-xs',
};

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('catalog');
  const [customQuizzes, setCustomQuizzes] = useState<QuizPack[]>(() => loadCustomQuizzes());
  const [history, setHistory] = useState<QuizAttempt[]>(() => loadQuizHistory());

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const [pendingSetupQuiz, setPendingSetupQuiz] = useState<QuizPack | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizPack | null>(null);

  const allQuizzes = useMemo(
    () => [...customQuizzes, ...BUILT_IN_QUIZZES],
    [customQuizzes]
  );

  const filteredQuizzes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allQuizzes.filter((quiz) => {
      const matchesCategory =
        categoryFilter === 'Semua'
          ? true
          : categoryFilter === 'Kustom'
          ? Boolean(quiz.isCustom) || quiz.category === 'Kustom'
          : quiz.category === categoryFilter;

      const matchesSearch =
        !query ||
        quiz.title.toLowerCase().includes(query) ||
        quiz.description.toLowerCase().includes(query) ||
        quiz.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allQuizzes, categoryFilter, searchQuery]);

  const bestAccuracyByQuizId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of history) {
      if (map[item.quizId] === undefined || item.accuracyPercent > map[item.quizId]) {
        map[item.quizId] = item.accuracyPercent;
      }
    }
    return map;
  }, [history]);

  const totalQuestions = useMemo(
    () => allQuizzes.reduce((acc, q) => acc + q.questions.length, 0),
    [allQuizzes]
  );

  const handleNavigate = (view: AppView) => {
    setActiveSession(null);
    setLatestAttempt(null);
    setPendingSetupQuiz(null);
    if (view !== 'builder') {
      setEditingQuiz(null);
    }
    setActiveView(view);
  };

  const handleQuickStart = () => {
    const quickMix = createQuickMixQuiz(allQuizzes, 8);
    setPendingSetupQuiz(quickMix);
  };

  const handleStartSession = (config: QuizStartConfig) => {
    if (!pendingSetupQuiz) return;
    setLatestAttempt(null);
    setActiveSession({ sessionId: Date.now(), quiz: pendingSetupQuiz, config });
    setPendingSetupQuiz(null);
  };

  const handleCompleteQuiz = (attempt: QuizAttempt) => {
    const updatedHistory = saveQuizAttempt(attempt);
    setHistory(updatedHistory);
    setLatestAttempt(attempt);
  };

  const handleRetryQuiz = () => {
    if (!activeSession) return;
    setLatestAttempt(null);
    setActiveSession({
      sessionId: Date.now(),
      quiz: activeSession.quiz,
      config: { ...activeSession.config },
    });
  };

  const handleSaveCustomQuiz = (quiz: QuizPack, startImmediately: boolean) => {
    setCustomQuizzes((prev) => {
      const exists = prev.some((q) => q.id === quiz.id);
      const next = exists ? prev.map((q) => (q.id === quiz.id ? quiz : q)) : [quiz, ...prev];
      saveCustomQuizzes(next);
      return next;
    });
    setEditingQuiz(null);

    if (startImmediately) {
      setActiveView('catalog');
      setPendingSetupQuiz(quiz);
    } else {
      setActiveView('catalog');
      setCategoryFilter('Semua');
    }
  };

  const handleDeleteCustomQuiz = (quizId: string) => {
    setCustomQuizzes((prev) => {
      const next = prev.filter((q) => q.id !== quizId);
      saveCustomQuizzes(next);
      return next;
    });
  };

  const handleReplayFromHistory = (quizId: string) => {
    const found = allQuizzes.find((q) => q.id === quizId);
    if (found) {
      setPendingSetupQuiz(found);
    }
  };

  const handleClearHistory = () => {
    clearQuizHistory();
    setHistory([]);
  };

  const isPlaying = Boolean(activeSession);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FF] text-[#0F172A]">
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        onQuickStart={handleQuickStart}
        isPlaying={isPlaying}
      />

      <main className="flex-1">
        {activeSession ? (
          latestAttempt ? (
            <QuizResults
              attempt={latestAttempt}
              onRetry={handleRetryQuiz}
              onBackToCatalog={() => {
                setActiveSession(null);
                setLatestAttempt(null);
                setActiveView('catalog');
              }}
            />
          ) : (
            <QuizStage
              key={activeSession.sessionId}
              quiz={activeSession.quiz}
              mode={activeSession.config.mode}
              shuffleQuestions={activeSession.config.shuffleQuestions}
              shuffleOptions={activeSession.config.shuffleOptions}
              onExit={() => {
                setActiveSession(null);
                setLatestAttempt(null);
              }}
              onComplete={handleCompleteQuiz}
            />
          )
        ) : activeView === 'builder' ? (
          <QuizBuilder
            editingQuiz={editingQuiz}
            onCancel={() => {
              setEditingQuiz(null);
              setActiveView('catalog');
            }}
            onSave={handleSaveCustomQuiz}
          />
        ) : activeView === 'history' ? (
          <QuizHistory
            attempts={history}
            onClearHistory={handleClearHistory}
            onReplayQuiz={handleReplayFromHistory}
            onGoExplore={() => setActiveView('catalog')}
          />
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Playful & Balanced 2-Column Hero Split */}
            <section className="bg-white border border-sky-200 rounded-3xl p-6 sm:p-8 lg:p-10 mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-semibold text-[#0284C7] mb-3 tabular-nums">
                  Kuis SD Kelas 3 · {allQuizzes.length} Paket Topik · {totalQuestions} Soal Bergambar
                </p>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 tracking-tight leading-[1.14] text-balance mb-4">
                  Belajar Seru & Main Kuis Penuh Warna Bersama Teman!
                </h1>
                <p className="text-base text-slate-600 leading-relaxed max-w-xl mb-7">
                  Jawab pertanyaan seru tentang hewan, tumbuhan, berhitung cepat, cerita Indonesia, dan alam sekitar. Setiap jawaban dilengkapi penjelasan mudah dimengerti dan bintang penghargaan!
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleQuickStart}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0284C7]"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Main Kuis Campuran</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuiz(null);
                      setActiveView('builder');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200/80 border border-amber-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Kuis Sendiri</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full h-full min-h-[240px] rounded-2xl overflow-hidden border border-amber-200 bg-amber-50">
                  {!heroImgFailed ? (
                    <img
                      src={HERO_ILLUSTRATION}
                      alt="Ilustrasi anak-anak SD kelas 3 belajar bersama penuh semangat"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50">
                      <BookOpen className="w-10 h-10 text-[#0284C7] mb-2" />
                      <span className="font-display text-base font-bold text-slate-800">
                        Ayo Belajar Bersama!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Colorful Filter & Search Toolbar */}
            <section
              aria-label="Filter paket kuis"
              className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl overflow-x-auto max-w-full">
                {FILTER_OPTIONS.map((cat) => {
                  const isActive = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? FILTER_ACTIVE_STYLES[cat]
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-72 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul atau topik kuis..."
                  aria-label="Cari paket kuis"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
                />
              </div>
            </section>

            {/* Quiz Grid */}
            {filteredQuizzes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-1.5">
                  Tidak Ada Paket Kuis yang Cocok
                </h2>
                <p className="text-sm text-slate-600 mb-5">
                  {categoryFilter === 'Kustom' && customQuizzes.length === 0
                    ? 'Kamu belum membuat kuis sendiri. Yuk buat paket soal pertamamu sekarang!'
                    : 'Coba ubah kata pencarian atau pilih kategori yang lain.'}
                </p>
                {categoryFilter === 'Kustom' && customQuizzes.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuiz(null);
                      setActiveView('builder');
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors cursor-pointer"
                  >
                    Buat Kuis Baru
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('Semua');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Lihat Semua Kuis
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    bestAccuracy={bestAccuracyByQuizId[quiz.id]}
                    onSelect={(selected) => setPendingSetupQuiz(selected)}
                    onEdit={(selected) => {
                      setEditingQuiz(selected);
                      setActiveView('builder');
                    }}
                    onDelete={handleDeleteCustomQuiz}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-sky-200/80 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>NalarKuis · Belajar & Bermain Kuis Anak SD Kelas 3</span>
          <span>Kuis buatan sendiri dan riwayat nilaimu tersimpan aman di browser ini</span>
        </div>
      </footer>

      {pendingSetupQuiz && (
        <QuizSetupModal
          quiz={pendingSetupQuiz}
          onClose={() => setPendingSetupQuiz(null)}
          onStart={handleStartSession}
        />
      )}
    </div>
  );
}
