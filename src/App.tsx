import React, { useState } from 'react';
import { GameId } from './types';
import { GAMES } from './data/games';
import { Header } from './components/Header';
import { DecorativeScienceObjects } from './components/DecorativeScienceObjects';
import { GameCard } from './components/GameCard';
import { QuizModal } from './components/QuizModal';
import { CrystalGrowingGame } from './games/CrystalGrowing/CrystalGrowingGame';
import { DnaCreaturesGame } from './games/DnaCreatures/DnaCreaturesGame';
import { CircuitTestingGame } from './games/CircuitTesting/CircuitTestingGame';
import { CatastropheSimulationsGame } from './games/CatastropheSimulations/CatastropheSimulationsGame';
import { RocketLaunchingGame } from './games/RocketLaunching/RocketLaunchingGame';
import { DefyingGravityGame } from './games/DefyingGravity/DefyingGravityGame';
import { Sparkles, ArrowLeft, FlaskConical, Atom, Compass, Zap } from 'lucide-react';

export default function App() {
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [quizGameId, setQuizGameId] = useState<GameId | null>(null);

  // Open quiz for specific game
  const handleOpenQuiz = (gameId: GameId) => {
    setQuizGameId(gameId);
  };

  // Close quiz (preserves current game experiment state)
  const handleCloseQuiz = () => {
    setQuizGameId(null);
  };

  const renderActiveGame = () => {
    switch (activeGameId) {
      case 'crystal-growing':
        return <CrystalGrowingGame onOpenQuiz={() => handleOpenQuiz('crystal-growing')} />;
      case 'dna-creatures':
        return <DnaCreaturesGame onOpenQuiz={() => handleOpenQuiz('dna-creatures')} />;
      case 'circuit-testing':
        return <CircuitTestingGame onOpenQuiz={() => handleOpenQuiz('circuit-testing')} />;
      case 'catastrophe-simulations':
        return <CatastropheSimulationsGame onOpenQuiz={() => handleOpenQuiz('catastrophe-simulations')} />;
      case 'rocket-launching':
        return <RocketLaunchingGame onOpenQuiz={() => handleOpenQuiz('rocket-launching')} />;
      case 'defying-gravity':
        return <DefyingGravityGame onOpenQuiz={() => handleOpenQuiz('defying-gravity')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-purple-200 selection:text-purple-900">
      
      {/* Decorative Rotating Science Objects along outer edges */}
      <DecorativeScienceObjects />

      {/* Main Top Bar Navigation */}
      <Header
        activeGameId={activeGameId}
        onSelectGame={(id) => setActiveGameId(id)}
        onOpenQuiz={() => activeGameId && handleOpenQuiz(activeGameId)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 z-10">
        {activeGameId ? (
          /* Game Sandbox View */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Back Button Ribbon */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveGameId(null)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-purple-700 bg-white hover:bg-purple-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Lab Games</span>
              </button>
            </div>

            {/* Active Game Component */}
            {renderActiveGame()}
          </div>
        ) : (
          /* Homepage View */
          <div className="space-y-12">
            
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 text-purple-800 text-xs font-bold border border-purple-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Interactive Scientific Wonderlab</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 text-balance">
                Emilie's Lab Games
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
                Discover these entertaining scientific games. Enjoy!
              </p>

              {/* Subject Tag Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-purple-500" />
                  <span>Mineralogy</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Atom className="w-4 h-4 text-pink-500" />
                  <span>Genetics</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Electronics</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-500" />
                  <span>Astrophysics</span>
                </span>
              </div>
            </section>

            {/* Six Science Game Cards Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Featured Laboratory Games
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Select any experiment below to begin your hands-on scientific adventure
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {GAMES.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelect={() => setActiveGameId(game.id)}
                    onOpenQuiz={() => handleOpenQuiz(game.id)}
                  />
                ))}
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-sm py-6 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-slate-700">
            Emilie's Lab Games · Hands-on Interactive Science
          </p>
          <p className="text-slate-400">
            Inspiring curiosity in mineralogy, genetics, circuits, earth hazards, aerospace & mechanics.
          </p>
        </div>
      </footer>

      {/* Quiz Modal (Shared across any game or card) */}
      {quizGameId && (
        <QuizModal
          gameId={quizGameId}
          isOpen={true}
          onClose={handleCloseQuiz}
        />
      )}
    </div>
  );
}
