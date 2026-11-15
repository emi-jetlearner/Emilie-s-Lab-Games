import React from 'react';
import { GameMetadata } from '../types';
import { ArrowRight } from 'lucide-react';

interface GameCardProps {
  game: GameMetadata;
  onSelect: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  const renderCardIllustration = (id: string) => {
    switch (id) {
      case 'crystal-growing':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xs">
            {/* Sparkling Pastel 3D Crystals */}
            <polygon points="100,28 118,60 110,118 90,118 82,60" fill="#A855F7" />
            <polygon points="100,28 118,60 100,118" fill="#C084FC" />
            <polygon points="72,62 86,80 80,118 68,118 64,80" fill="#38BDF8" />
            <polygon points="128,58 138,76 132,118 120,118 116,76" fill="#F472B6" />
            <polygon points="85,85 100,70 100,118 85,118" fill="#4ADE80" opacity="0.8" />
            {/* Sparkle glints */}
            <circle cx="100" cy="40" r="3" fill="#FFFFFF" />
            <circle cx="76" cy="70" r="2.5" fill="#FFFFFF" />
            <circle cx="126" cy="65" r="2.5" fill="#FFFFFF" />
          </svg>
        );

      case 'dna-creatures':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xs">
            {/* Cute Kitty/Unicorn Head */}
            <circle cx="100" cy="75" r="38" fill="#F472B6" />
            <polygon points="96,38 104,38 100,14" fill="#FDE047" />
            {/* Ears */}
            <polygon points="68,55 76,26 90,48" fill="#F472B6" />
            <polygon points="72,50 78,32 86,46" fill="#FBCFE8" />
            <polygon points="132,55 124,26 110,48" fill="#F472B6" />
            <polygon points="128,50 122,32 114,46" fill="#FBCFE8" />
            {/* Friendly Eyes with Thin Band */}
            <circle cx="86" cy="74" r="7.5" fill="#1E293B" stroke="#0F172A" strokeWidth="0.5" />
            <circle cx="86" cy="74" r="6" fill="#38BDF8" />
            <circle cx="84" cy="72" r="2.5" fill="#FFFFFF" />
            <circle cx="114" cy="74" r="7.5" fill="#1E293B" stroke="#0F172A" strokeWidth="0.5" />
            <circle cx="114" cy="74" r="6" fill="#38BDF8" />
            <circle cx="112" cy="72" r="2.5" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="74" cy="85" r="5" fill="#FB7185" opacity="0.5" />
            <circle cx="126" cy="85" r="5" fill="#FB7185" opacity="0.5" />
            <path d="M 96 82 Q 100 86 104 82" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'circuit-testing':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xs">
            {/* Board Base */}
            <rect x="35" y="28" width="130" height="88" rx="16" fill="#FEF9C3" stroke="#FEF08A" strokeWidth="2" />
            {/* Connected Wire Loop */}
            <path d="M 60 72 L 60 48 L 140 48 L 140 96 L 60 96 Z" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            {/* Glowing Bulb */}
            <circle cx="140" cy="48" r="16" fill="#FEF08A" opacity="0.9" />
            <circle cx="140" cy="48" r="9" fill="#FBBF24" />
            {/* Switch */}
            <line x1="88" y1="96" x2="112" y2="96" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />
            {/* Battery */}
            <rect x="48" y="60" width="24" height="28" rx="6" fill="#A855F7" />
            <rect x="56" y="56" width="8" height="4" fill="#FBBF24" />
          </svg>
        );

      case 'catastrophe-simulations':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xs">
            {/* Volcano & Land */}
            <polygon points="40,115 85,45 115,45 160,115" fill="#64748B" />
            <ellipse cx="100" cy="45" rx="15" ry="6" fill="#EF4444" />
            <path d="M 96 46 Q 90 75 80 115" stroke="#F97316" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 104 46 Q 115 70 125 115" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Tsunami Water Wall */}
            <path d="M 140 115 L 180 90 L 180 115 Z" fill="#38BDF8" />
          </svg>
        );

      case 'rocket-launching':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xs">
            <g transform="translate(100, 55)">
              {/* Flame */}
              <polygon points="-6,25 6,25 0,42" fill="#F97316" />
              <polygon points="-3,25 3,25 0,35" fill="#FEF08A" />
              {/* Fins */}
              <polygon points="-8,10 -18,25 -8,22" fill="#38BDF8" />
              <polygon points="8,10 18,25 8,22" fill="#38BDF8" />
              {/* Body */}
              <rect x="-8" y="-15" width="16" height="38" rx="4" fill="#A855F7" />
              {/* Nosecone */}
              <polygon points="-8,-15 8,-15 0,-32" fill="#F472B6" />
              <circle cx="0" cy="-3" r="4" fill="#FFFFFF" />
            </g>
            {/* Contrail Stars */}
            <circle cx="95" cy="115" r="4" fill="#FDE047" />
            <circle cx="106" cy="125" r="3.5" fill="#38BDF8" />
          </svg>
        );

      case 'defying-gravity':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xs">
            <rect x="45" y="20" width="110" height="100" rx="14" fill="#F3E8FF" stroke="#E9D5FF" strokeWidth="2" />
            {/* Left measurement ruler */}
            <line x1="55" y1="30" x2="55" y2="110" stroke="#A855F7" strokeWidth="2" />
            <line x1="55" y1="30" x2="62" y2="30" stroke="#A855F7" strokeWidth="2" />
            <line x1="55" y1="70" x2="60" y2="70" stroke="#A855F7" strokeWidth="2" />
            <line x1="55" y1="110" x2="62" y2="110" stroke="#A855F7" strokeWidth="2" />
            {/* Apple */}
            <circle cx="90" cy="55" r="10" fill="#EF4444" />
            {/* Feather */}
            <ellipse cx="125" cy="65" rx="5" ry="14" fill="#38BDF8" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
      
      {/* Illustration Area */}
      <div className="h-40 bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF]/60 flex items-center justify-center p-4">
        {renderCardIllustration(game.id)}
      </div>

      {/* Card Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-black text-purple-950 leading-snug">
            {game.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Exactly one clear button to open the game */}
        <button
          onClick={onSelect}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Open Game</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
