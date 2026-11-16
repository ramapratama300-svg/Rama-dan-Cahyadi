import React, { useState } from 'react';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import type { QuizCategory, QuizDifficulty, QuizPack, QuizQuestion } from '../types/quiz';

interface QuizBuilderProps {
  editingQuiz?: QuizPack | null;
  onCancel: () => void;
  onSave: (quiz: QuizPack, startImmediately: boolean) => void;
}

const CATEGORIES: QuizCategory[] = ['Sains', 'Matematika', 'Sejarah', 'Geografi', 'Kustom'];
const DIFFICULTIES: QuizDifficulty[] = ['Dasar', 'Menengah', 'Lanjut'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

function createEmptyQuestion(index: number): QuizQuestion {
  return {
    id: `custom-q-${Date.now()}-${index}`,
    prompt: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
  };
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({
  editingQuiz,
  onCancel,
  onSave,
}) => {
  const [title, setTitle] = useState(editingQuiz?.title ?? '');
  const [description, setDescription] = useState(editingQuiz?.description ?? '');
  const [category, setCategory] = useState<QuizCategory>(editingQuiz?.category ?? 'Kustom');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(
    editingQuiz?.difficulty ?? 'Dasar'
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    editingQuiz?.questions.length
      ? editingQuiz.questions.map((q) => ({ ...q, options: [...q.options] as [string, string, string, string] }))
      : [createEmptyQuestion(1), createEmptyQuestion(2)]
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateQuestion = (qIndex: number, patch: Partial<QuizQuestion>) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === qIndex ? { ...q, ...patch } : q))
    );
    setErrorMessage(null);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIndex) return q;
        const nextOptions = [...q.options] as [string, string, string, string];
        nextOptions[optIndex] = value;
        return { ...q, options: nextOptions };
      })
    );
    setErrorMessage(null);
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion(prev.length + 1)]);
  };

  const removeQuestion = (qIndex: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
  };

  const validateAndSubmit = (startImmediately: boolean) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Judul kuis wajib diisi.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt.trim()) {
        setErrorMessage(`Pertanyaan pada Soal ${i + 1} belum diisi.`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        setErrorMessage(`Semua pilihan jawaban (A–D) pada Soal ${i + 1} harus diisi.`);
        return;
      }
    }

    const sanitizedQuestions: QuizQuestion[] = questions.map((q, idx) => ({
      id: q.id || `custom-q-${Date.now()}-${idx}`,
      prompt: q.prompt.trim(),
      options: q.options.map((o) => o.trim()) as [string, string, string, string],
      correctIndex: q.correctIndex,
      explanation: q.explanation.trim(),
    }));

    const quizPack: QuizPack = {
      id: editingQuiz?.id ?? `custom-${Date.now()}`,
      title: trimmedTitle,
      description:
        description.trim() ||
        `Kuis kustom kategori ${category} berisi ${sanitizedQuestions.length} pertanyaan.`,
      category,
      difficulty,
      estimatedMinutes: Math.max(1, Math.ceil(sanitizedQuestions.length * 0.5)),
      isCustom: true,
      createdAt: editingQuiz?.createdAt ?? new Date().toISOString(),
      questions: sanitizedQuestions,
    };

    onSave(quizPack, startImmediately);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {editingQuiz ? 'Sunting Kuis Kustom' : 'Buat Kuis Baru'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Susun pertanyaan, tentukan kunci jawaban, dan tambahkan pembahasan untuk disimpan di perangkat Anda.
          </p>
        </div>
      </div>

      {/* Quiz Metadata Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 space-y-5">
        <h2 className="font-display text-lg font-semibold text-slate-900 pb-3 border-b border-slate-100">
          Informasi Paket Kuis
        </h2>

        <div>
          <label htmlFor="quiz-title" className="block text-sm font-medium text-slate-800 mb-1.5">
            Judul Kuis
          </label>
          <input
            id="quiz-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="Contoh: Dasar-Dasar Astronomi Modern"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quiz-category" className="block text-sm font-medium text-slate-800 mb-1.5">
              Kategori
            </label>
            <select
              id="quiz-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as QuizCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quiz-difficulty" className="block text-sm font-medium text-slate-800 mb-1.5">
              Tingkat Kesulitan
            </label>
            <select
              id="quiz-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as QuizDifficulty)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="quiz-desc" className="block text-sm font-medium text-slate-800 mb-1.5">
            Deskripsi Singkat (Opsional)
          </label>
          <textarea
            id="quiz-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan topik atau cakupan soal dalam paket kuis ini..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 resize-none"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-slate-900 tabular-nums">
            Daftar Pertanyaan ({questions.length})
          </h2>
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#0284C7] bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal</span>
          </button>
        </div>

        {questions.map((question, qIndex) => (
          <div
            key={question.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5"
          >
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <span className="font-display text-sm font-semibold text-slate-900 tabular-nums">
                Soal {qIndex + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Soal</span>
                </button>
              )}
            </div>

            <div>
              <label
                htmlFor={`q-prompt-${qIndex}`}
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Pertanyaan
              </label>
              <input
                id={`q-prompt-${qIndex}`}
                type="text"
                value={question.prompt}
                onChange={(e) => updateQuestion(qIndex, { prompt: e.target.value })}
                placeholder="Tuliskan pertanyaan yang jelas dan spesifik..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-slate-800 mb-2">
                Pilihan Jawaban (klik huruf untuk menandai kunci jawaban)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((opt, optIdx) => {
                  const isCorrect = question.correctIndex === optIdx;
                  return (
                    <div key={optIdx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuestion(qIndex, { correctIndex: optIdx as 0 | 1 | 2 | 3 })
                        }
                        aria-label={`Tandai pilihan ${OPTION_LABELS[optIdx]} sebagai jawaban benar`}
                        className={`w-9 h-9 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isCorrect
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {isCorrect ? <Check className="w-4 h-4" /> : OPTION_LABELS[optIdx]}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(qIndex, optIdx, e.target.value)}
                        placeholder={`Pilihan ${OPTION_LABELS[optIdx]}`}
                        className={`flex-1 px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 ${
                          isCorrect ? 'border-emerald-400' : 'border-slate-300'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor={`q-exp-${qIndex}`}
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Pembahasan (Opsional)
              </label>
              <input
                id={`q-exp-${qIndex}`}
                type="text"
                value={question.explanation}
                onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
                placeholder="Penjelasan singkat mengapa jawaban tersebut benar..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
              />
            </div>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 text-sm font-medium text-red-800 bg-red-50 border border-red-200 rounded-xl"
        >
          {errorMessage}
        </div>
      )}

      {/* Save Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={addQuestion}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Soal Lagi</span>
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => validateAndSubmit(false)}
            className="px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Simpan Kuis
          </button>
          <button
            type="button"
            onClick={() => validateAndSubmit(true)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors cursor-pointer"
          >
            Simpan & Mulai Kuis
          </button>
        </div>
      </div>
    </section>
  );
};
