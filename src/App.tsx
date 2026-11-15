import React, { useState } from 'react';
import { GameId } from './types';
import { GAMES } from './data/games';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { QuizModal } from './components/QuizModal';
import { CrystalGrowingGame } from './games/CrystalGrowing/CrystalGrowingGame';
import { DnaCreaturesGame } from './games/DnaCreatures/DnaCreaturesGame';
import { CircuitTestingGame } from './games/CircuitTesting/CircuitTestingGame';
import { CatastropheSimulationsGame } from './games/CatastropheSimulations/CatastropheSimulationsGame';
import { RocketLaunchingGame } from './games/RocketLaunching/RocketLaunchingGame';
import { DefyingGravityGame } from './games/DefyingGravity/DefyingGravityGame';
import { Sparkles } from 'lucide-react';

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
    // The homepage background must be pastel purple as requested: bg-[#FAF5FF]
    <div className="min-h-screen flex flex-col bg-[#FAF5FF] text-slate-800 antialiased selection:bg-purple-200 selection:text-purple-900">
      
      {/* Header */}
      <Header
        activeGameId={activeGameId}
        onSelectGame={(id) => setActiveGameId(id)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeGameId ? (
          /* Active Game View */
          <div className="space-y-6 animate-in fade-in duration-150">
            {renderActiveGame()}
          </div>
        ) : (
          /* Homepage View */
          <div className="space-y-8 sm:space-y-10">
            
            {/* Hero Section */}
            <section className="text-center max-w-2xl mx-auto space-y-3 pt-3 sm:pt-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Fun Science for Kids</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-purple-950">
                Emilie's Lab Games
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                Discover these entertaining scientific games. Enjoy!
              </p>
            </section>

            {/* Six Science Game Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAMES.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelect={() => setActiveGameId(game.id)}
                />
              ))}
            </section>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-purple-200/60 bg-white/70 py-5 text-center text-xs text-slate-500">
        <p className="font-semibold text-purple-900">
          Emilie's Lab Games · Fun, Simple & Educational Science
        </p>
      </footer>

      {/* Quiz Modal (Shared across any game) */}
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
