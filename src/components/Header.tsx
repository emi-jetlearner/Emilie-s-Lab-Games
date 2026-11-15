import React from 'react';
import { GameId } from '../types';
import { GAMES } from '../data/games';
import { Sparkles, Home } from 'lucide-react';

interface HeaderProps {
  activeGameId: GameId | null;
  onSelectGame: (id: GameId | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeGameId,
  onSelectGame
}) => {
  const activeGame = activeGameId ? GAMES.find(g => g.id === activeGameId) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-200/80 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectGame(null)}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl p-1 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-purple-900">
                Emilie's Lab Games
              </span>
            </div>
          </button>
        </div>

        {/* Right side: Single Home navigation button if inside a game */}
        <div>
          {activeGame ? (
            <button
              onClick={() => onSelectGame(null)}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-purple-900 bg-[#F3E8FF] hover:bg-purple-200 rounded-xl border border-purple-200/80 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Home className="w-4 h-4 text-purple-700" />
              <span>Back to Home</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-purple-700 bg-[#F3E8FF] px-3.5 py-1.5 rounded-full border border-purple-200">
              <span>Interactive Science Lab</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
