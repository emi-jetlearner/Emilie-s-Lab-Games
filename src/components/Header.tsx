import React from 'react';
import { GameId } from '../types';
import { GAMES } from '../data/games';
import { Sparkles, ArrowLeft, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeGameId: GameId | null;
  onSelectGame: (id: GameId | null) => void;
  onOpenQuiz: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeGameId,
  onSelectGame,
  onOpenQuiz
}) => {
  const activeGame = activeGameId ? GAMES.find(g => g.id === activeGameId) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectGame(null)}
            className="flex items-center gap-2.5 text-left group transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-lg md:text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 bg-clip-text text-transparent whitespace-nowrap">
                Emilie's Lab Games
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links or Active Breadcrumb */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {activeGame ? (
            <div className="flex items-center gap-2 text-slate-700">
              <button
                onClick={() => onSelectGame(null)}
                className="hover:text-purple-600 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Games</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-900 whitespace-nowrap">{activeGame.title}</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => onSelectGame('crystal-growing')}
                className="hover:text-purple-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Crystals
              </button>
              <button
                onClick={() => onSelectGame('dna-creatures')}
                className="hover:text-pink-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Genetics
              </button>
              <button
                onClick={() => onSelectGame('circuit-testing')}
                className="hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Circuits
              </button>
              <button
                onClick={() => onSelectGame('catastrophe-simulations')}
                className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Catastrophes
              </button>
              <button
                onClick={() => onSelectGame('rocket-launching')}
                className="hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Rockets
              </button>
              <button
                onClick={() => onSelectGame('defying-gravity')}
                className="hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Gravity
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action (Take Quiz or Explore) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {activeGame ? (
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 active:scale-95 rounded-xl border border-purple-200/80 transition-all shadow-sm whitespace-nowrap cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Take Quiz</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectGame('crystal-growing')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Start Playing
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
