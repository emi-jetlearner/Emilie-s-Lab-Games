import React from 'react';
import { GameId } from '../types';
import { FUN_FACTS_DATA } from '../data/funFacts';
import { Lightbulb, HelpCircle, Sparkles } from 'lucide-react';

interface FunFactsSectionProps {
  gameId: GameId;
  onOpenQuiz: () => void;
}

export const FunFactsSection: React.FC<FunFactsSectionProps> = ({ gameId, onOpenQuiz }) => {
  const data = FUN_FACTS_DATA[gameId];

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Fun Facts Container */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-200/80 shadow-xs space-y-5">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-purple-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F3E8FF] text-purple-700 flex items-center justify-center font-bold shadow-xs shrink-0">
            <Lightbulb className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-purple-950 tracking-tight">
              {data.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {data.overview}
            </p>
          </div>
        </div>

        {/* Entertaining, Kid-Friendly Fact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {data.coreFacts.map((fact, idx) => {
            const cardStyles = [
              'bg-[#FAF5FF] border-purple-200 text-purple-950',
              'bg-[#F0F9FF] border-sky-200 text-sky-950',
              'bg-[#FDF2F8] border-pink-200 text-pink-950',
              'bg-[#F0FDF4] border-emerald-200 text-emerald-950',
              'bg-[#FEFCE8] border-amber-200 text-amber-950',
              'bg-[#FAF5FF] border-purple-200 text-purple-950'
            ];
            const badgeStyles = [
              'bg-purple-200 text-purple-800',
              'bg-sky-200 text-sky-800',
              'bg-pink-200 text-pink-800',
              'bg-emerald-200 text-emerald-800',
              'bg-amber-200 text-amber-800',
              'bg-purple-200 text-purple-800'
            ];
            const style = cardStyles[idx % cardStyles.length];
            const bStyle = badgeStyles[idx % badgeStyles.length];

            return (
              <div key={idx} className={`p-4 rounded-2xl border ${style} space-y-1.5 transition-all`}>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${bStyle}`}>
                    Fact {idx + 1}
                  </span>
                  <h4 className="font-extrabold text-xs sm:text-sm leading-snug">
                    {fact.term}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  {fact.simpleExplanation}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exactly one Quiz button placed directly below the Fun Facts section in every game */}
      <div className="flex justify-center pt-1">
        <button
          onClick={onOpenQuiz}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-sky-600 hover:from-purple-700 hover:via-pink-700 hover:to-sky-700 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm hover:shadow-md"
        >
          <HelpCircle className="w-5 h-5 text-white" />
          <span>Ready to Test Your Knowledge? Take the Quiz!</span>
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
