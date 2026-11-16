import React from 'react';

export type AppView = 'catalog' | 'builder' | 'history';

interface HeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onQuickStart: () => void;
  isPlaying: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onQuickStart,
  isPlaying,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F4F8FF]/95 backdrop-blur-sm border-b border-sky-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-md px-1 -ml-1 cursor-pointer"
        >
          NalarKuis
        </button>

        {/* Zone 2: Concise single-line nav links */}
        <nav
          aria-label="Navigasi utama"
          className="flex items-center gap-4 sm:gap-7 text-sm font-medium overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-sm ${
              activeView === 'catalog' && !isPlaying
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jelajahi
            {activeView === 'catalog' && !isPlaying && (
              <span className="absolute inset-x-0 -bottom-[19px] h-0.5 bg-[#0284C7]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('builder')}
            className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-sm ${
              activeView === 'builder' && !isPlaying
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buat Kuis
            {activeView === 'builder' && !isPlaying && (
              <span className="absolute inset-x-0 -bottom-[19px] h-0.5 bg-[#0284C7]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('history')}
            className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-sm ${
              activeView === 'history' && !isPlaying
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat
            {activeView === 'history' && !isPlaying && (
              <span className="absolute inset-x-0 -bottom-[19px] h-0.5 bg-[#0284C7]" />
            )}
          </button>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onQuickStart}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] active:translate-y-px rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0284C7]"
          >
            Mulai Cepat
          </button>
        </div>
      </div>
    </header>
  );
};
