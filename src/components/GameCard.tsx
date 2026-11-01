import React from 'react';
import { GameMetadata } from '../types';
import { ArrowRight, HelpCircle, Play } from 'lucide-react';

interface GameCardProps {
  game: GameMetadata;
  onSelect: () => void;
  onOpenQuiz: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect, onOpenQuiz }) => {
  const renderCardIllustration = (id: string) => {
    switch (id) {
      case 'crystal-growing':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-sm">
            {/* Beaker & Translucent Crystals */}
            <path d="M 60 25 L 60 115 Q 60 125 75 125 L 125 125 Q 140 125 140 115 L 140 25" fill="none" stroke="#CBD5E1" strokeWidth="3" />
            <path d="M 62 70 Q 100 74 138 70 L 138 115 Q 138 123 125 123 L 75 123 Q 62 123 62 115 Z" fill="#DDD6FE" opacity="0.6" />
            {/* Main Purple Crystal */}
            <polygon points="100,45 115,70 110,118 90,118 85,70" fill="#8B5CF6" />
            <polygon points="100,45 115,70 100,118 100,45" fill="#A78BFA" opacity="0.7" />
            {/* Emerald Side Crystal */}
            <polygon points="76,68 88,85 82,120 70,120 66,85" fill="#10B981" />
            {/* Citrine Right Crystal */}
            <polygon points="124,65 134,82 128,120 116,120 112,82" fill="#F59E0B" />
            {/* Falling Droplet */}
            <path d="M 100 20 C 97 26 95 30 100 35 C 105 30 103 26 100 20 Z" fill="#8B5CF6" />
            {/* Sparkles */}
            <circle cx="106" cy="55" r="2.5" fill="#FFFFFF" />
            <circle cx="75" cy="78" r="2" fill="#FFFFFF" />
            <circle cx="120" cy="72" r="2" fill="#FFFFFF" />
          </svg>
        );

      case 'dna-creatures':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-sm">
            {/* Cute Kitty/Unicorn Head */}
            <circle cx="100" cy="75" r="38" fill="#F472B6" />
            {/* Unicorn Horn */}
            <polygon points="95,40 105,40 100,15" fill="#FBBF24" />
            {/* Ears */}
            <polygon points="68,55 76,26 90,48" fill="#F472B6" />
            <polygon points="72,50 78,32 86,46" fill="#FBCFE8" />
            <polygon points="132,55 124,26 110,48" fill="#F472B6" />
            <polygon points="128,50 122,32 114,46" fill="#FBCFE8" />
            {/* Big Eyes */}
            <circle cx="86" cy="74" r="8" fill="#1E293B" />
            <circle cx="84" cy="72" r="3" fill="#FFFFFF" />
            <circle cx="114" cy="74" r="8" fill="#1E293B" />
            <circle cx="112" cy="72" r="3" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="75" cy="85" r="5" fill="#FB7185" opacity="0.6" />
            <circle cx="125" cy="85" r="5" fill="#FB7185" opacity="0.6" />
            {/* Smile */}
            <path d="M 96 82 Q 100 86 104 82" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* DNA Strand Accent */}
            <path d="M 30 30 Q 40 50 30 70 T 30 110" stroke="#C084FC" strokeWidth="2.5" fill="none" />
            <path d="M 40 30 Q 30 50 40 70 T 40 110" stroke="#F472B6" strokeWidth="2.5" fill="none" />
          </svg>
        );

      case 'circuit-testing':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-sm">
            {/* Breadboard Base */}
            <rect x="35" y="30" width="130" height="85" rx="16" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2" />
            {/* Connecting Wire Loop */}
            <path d="M 60 70 L 60 48 L 140 48 L 140 98 L 60 98 Z" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            {/* Glowing Bulb */}
            <circle cx="140" cy="48" r="18" fill="#FEF08A" opacity="0.8" />
            <circle cx="140" cy="48" r="10" fill="#FBBF24" />
            {/* Switch */}
            <line x1="90" y1="98" x2="110" y2="85" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
            <circle cx="90" cy="98" r="4" fill="#D97706" />
            <circle cx="115" cy="98" r="4" fill="#D97706" />
            {/* Battery */}
            <rect x="48" y="58" width="24" height="28" rx="6" fill="#3B82F6" />
            <rect x="56" y="54" width="8" height="4" fill="#F59E0B" />
          </svg>
        );

      case 'catastrophe-simulations':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-sm">
            {/* Volcano Cone */}
            <polygon points="40,115 85,45 115,45 160,115" fill="#475569" />
            {/* Glowing Caldera */}
            <ellipse cx="100" cy="45" rx="15" ry="6" fill="#EF4444" />
            {/* Lava Flow */}
            <path d="M 96 46 Q 90 75 80 115" stroke="#F97316" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 96 46 Q 90 75 80 115" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 104 46 Q 115 70 125 115" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Tsunami Wave on Right */}
            <path d="M 140 115 Q 165 95 180 85 Q 170 115 155 115 Z" fill="#0284C7" />
            {/* Ash Smoke Plume */}
            <circle cx="95" cy="25" r="14" fill="#64748B" opacity="0.6" />
            <circle cx="112" cy="18" r="12" fill="#94A3B8" opacity="0.5" />
          </svg>
        );

      case 'rocket-launching':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-sm">
            {/* Contrail Stars & Rainbow Sparks */}
            <path d="M 100 85 Q 100 115 95 130" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
            <circle cx="95" cy="100" r="4" fill="#F472B6" />
            <circle cx="105" cy="115" r="5" fill="#FBBF24" />
            <circle cx="92" cy="125" r="3.5" fill="#A855F7" />
            {/* Rocket Body */}
            <g transform="translate(100, 50)">
              {/* Exhaust Flame */}
              <polygon points="-6,25 6,25 0,42" fill="#F97316" />
              <polygon points="-3,25 3,25 0,36" fill="#FEF08A" />
              {/* Fins */}
              <polygon points="-8,10 -18,25 -8,22" fill="#3B82F6" />
              <polygon points="8,10 18,25 8,22" fill="#3B82F6" />
              {/* Fuselage */}
              <rect x="-8" y="-15" width="16" height="38" rx="4" fill="#EF4444" />
              {/* Nosecone */}
              <polygon points="-8,-15 8,-15 0,-32" fill="#3B82F6" />
              {/* Porthole */}
              <circle cx="0" cy="-3" r="4" fill="#FFFFFF" />
            </g>
          </svg>
        );

      case 'defying-gravity':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-sm">
            {/* Vacuum Chamber Outline */}
            <rect x="50" y="20" width="100" height="100" rx="14" fill="#1E293B" stroke="#334155" strokeWidth="2" />
            {/* Dividing Lane */}
            <line x1="100" y1="25" x2="100" y2="115" stroke="#475569" strokeDasharray="3 3" />
            {/* Apple in Lane 1 */}
            <circle cx="75" cy="55" r="10" fill="#EF4444" />
            <path d="M 75 45 Q 78 40 82 42" stroke="#15803D" strokeWidth="2" fill="none" />
            {/* Feather in Lane 2 */}
            <g transform="translate(125, 55) rotate(25)">
              <ellipse cx="0" cy="0" rx="4" ry="14" fill="#F8FAFC" />
              <line x1="0" y1="-14" x2="0" y2="18" stroke="#CBD5E1" strokeWidth="1.5" />
            </g>
            {/* Fall motion vectors */}
            <line x1="75" y1="70" x2="75" y2="90" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
            <line x1="125" y1="70" x2="125" y2="90" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Card Header Illustration Stage */}
      <div 
        onClick={onSelect}
        className="h-44 bg-gradient-to-b from-slate-50 to-slate-100/60 flex items-center justify-center p-4 cursor-pointer relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
      >
        {renderCardIllustration(game.id)}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-slate-700 shadow-sm border border-slate-200/60">
          {game.badge}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata clean unboxed text */}
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <span>{game.category}</span>
          </div>

          <h3 
            onClick={onSelect}
            className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors cursor-pointer leading-snug"
          >
            {game.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Card Actions Ribbon */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
          <button
            onClick={onOpenQuiz}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>

          <button
            onClick={onSelect}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-purple-600 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <span>Play Game</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
