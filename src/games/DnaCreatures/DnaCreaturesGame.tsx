import React, { useState } from 'react';
import { Sparkles, Dna, HelpCircle, Heart, RefreshCw, Wand2, ShieldCheck, Check } from 'lucide-react';

type CreatureSpecies = 'cat' | 'dog' | 'dove' | 'unicorn';

interface TraitConfig {
  species: CreatureSpecies;
  furColor: string;
  pattern: 'solid' | 'spotted' | 'striped' | 'starry';
  eyeColor: string;
  earWingType: 'ears' | 'floppy' | 'wings' | 'horn';
  aura: 'none' | 'hearts' | 'stardust' | 'sparkles' | 'bubbles';
  name: string;
}

const SPECIES_PRESETS: Record<CreatureSpecies, { name: string; icon: string; defaultFur: string; defaultEye: string; feature: 'ears' | 'floppy' | 'wings' | 'horn' }> = {
  cat: { name: 'Feline Kitty', icon: '🐱', defaultFur: '#FDBA74', defaultEye: '#06B6D4', feature: 'ears' },
  dog: { name: 'Golden Puppy', icon: '🐶', defaultFur: '#FCD34D', defaultEye: '#78350F', feature: 'floppy' },
  dove: { name: 'Cloud Dove', icon: '🕊️', defaultFur: '#E0F2FE', defaultEye: '#3B82F6', feature: 'wings' },
  unicorn: { name: 'Mystic Unicorn', icon: '🦄', defaultFur: '#F472B6', defaultEye: '#8B5CF6', feature: 'horn' }
};

const COLOR_PALETTE = ['#F472B6', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#38BDF8', '#E2E8F0'];
const EYE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#0F172A'];

interface DnaCreaturesGameProps {
  onOpenQuiz: () => void;
}

export const DnaCreaturesGame: React.FC<DnaCreaturesGameProps> = ({ onOpenQuiz }) => {
  // Parent 1 State
  const [parent1, setParent1] = useState<TraitConfig>({
    species: 'cat',
    furColor: '#FDBA74',
    pattern: 'striped',
    eyeColor: '#06B6D4',
    earWingType: 'ears',
    aura: 'sparkles',
    name: 'Cleo the Cat'
  });

  // Parent 2 State
  const [parent2, setParent2] = useState<TraitConfig>({
    species: 'unicorn',
    furColor: '#F472B6',
    pattern: 'starry',
    eyeColor: '#8B5CF6',
    earWingType: 'horn',
    aura: 'stardust',
    name: 'Celeste the Unicorn'
  });

  // Offspring State
  const [offspring, setOffspring] = useState<TraitConfig | null>({
    species: 'unicorn',
    furColor: '#F472B6',
    pattern: 'starry',
    eyeColor: '#06B6D4',
    earWingType: 'horn',
    aura: 'stardust',
    name: 'Starlight Kitten-Corn'
  });

  const [isCombining, setIsCombining] = useState(false);
  const [inheritedFrom, setInheritedFrom] = useState<{ [key: string]: 'Parent 1' | 'Parent 2' | 'Blended' }>({
    species: 'Parent 2',
    furColor: 'Parent 2',
    pattern: 'Parent 2',
    eyeColor: 'Parent 1',
    earWingType: 'Parent 2',
    aura: 'Parent 2'
  });

  // Helper to mix colors
  const blendHexColors = (c1: string, c2: string) => {
    return Math.random() > 0.5 ? c1 : c2;
  };

  // Breed / Combine DNA
  const handleBreed = () => {
    setIsCombining(true);
    setTimeout(() => {
      // Mendelian-style trait inheritance determination
      const speciesChoice = Math.random() > 0.5 ? parent1.species : parent2.species;
      const furChoice = blendHexColors(parent1.furColor, parent2.furColor);
      const patternChoice = Math.random() > 0.5 ? parent1.pattern : parent2.pattern;
      const eyeChoice = Math.random() > 0.5 ? parent1.eyeColor : parent2.eyeColor;
      
      // Dominant / Recessive trait resolution: Unicorn Horn and Wings are dominant fun traits!
      let earChoice: TraitConfig['earWingType'] = parent1.earWingType;
      if (parent1.earWingType === 'horn' || parent2.earWingType === 'horn') {
        earChoice = Math.random() > 0.3 ? 'horn' : (Math.random() > 0.5 ? parent1.earWingType : parent2.earWingType);
      } else if (parent1.earWingType === 'wings' || parent2.earWingType === 'wings') {
        earChoice = Math.random() > 0.3 ? 'wings' : parent1.earWingType;
      } else {
        earChoice = Math.random() > 0.5 ? parent1.earWingType : parent2.earWingType;
      }

      const auraChoice = Math.random() > 0.5 ? parent1.aura : parent2.aura;

      const randomNames = [
        'Buttercup Blossom', 'Stardust Whiskers', 'Luna Paws', 'Mochi Sparkle',
        'Nimbus Sky', 'Pip Pip', 'Aurora Glow', 'Peaches Dream'
      ];
      const babyName = randomNames[Math.floor(Math.random() * randomNames.length)];

      setOffspring({
        species: speciesChoice,
        furColor: furChoice,
        pattern: patternChoice,
        eyeColor: eyeChoice,
        earWingType: earChoice,
        aura: auraChoice,
        name: babyName
      });

      setInheritedFrom({
        species: speciesChoice === parent1.species ? 'Parent 1' : 'Parent 2',
        furColor: furChoice === parent1.furColor ? 'Parent 1' : 'Parent 2',
        pattern: patternChoice === parent1.pattern ? 'Parent 1' : 'Parent 2',
        eyeColor: eyeChoice === parent1.eyeColor ? 'Parent 1' : 'Parent 2',
        earWingType: earChoice === parent1.earWingType ? 'Parent 1' : 'Parent 2',
        aura: auraChoice === parent1.aura ? 'Parent 1' : 'Parent 2'
      });

      setIsCombining(false);
    }, 800);
  };

  // Render Cute Adopt-Me Style Vector Creature
  const renderCreature = (traits: TraitConfig, isBaby: boolean = false) => {
    const scale = isBaby ? 0.9 : 1.1;

    return (
      <div className="relative flex flex-col items-center justify-center py-2 group">
        
        {/* Floating Aura Elements */}
        {traits.aura !== 'none' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {traits.aura === 'hearts' && (
              <>
                <Heart className="w-5 h-5 text-pink-400 absolute top-2 left-6 animate-bounce" fill="#F472B6" />
                <Heart className="w-4 h-4 text-pink-300 absolute bottom-6 right-6 animate-pulse" fill="#F472B6" />
              </>
            )}
            {traits.aura === 'stardust' && (
              <>
                <Sparkles className="w-6 h-6 text-amber-300 absolute top-3 right-6 animate-pulse" />
                <Sparkles className="w-4 h-4 text-purple-300 absolute bottom-4 left-6 animate-bounce" />
              </>
            )}
            {traits.aura === 'sparkles' && (
              <>
                <Sparkles className="w-5 h-5 text-cyan-400 absolute top-4 left-4 animate-spin" />
                <Sparkles className="w-5 h-5 text-pink-400 absolute bottom-4 right-4 animate-ping" />
              </>
            )}
          </div>
        )}

        {/* SVG Creature Character */}
        <svg
          width={180 * scale}
          height={180 * scale}
          viewBox="0 0 200 200"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Soft Drop Shadow under feet */}
          <ellipse cx="100" cy="180" rx="60" ry="14" fill="rgba(148, 163, 184, 0.25)" />

          {/* Ears or Horns or Wings */}
          {traits.earWingType === 'horn' && (
            <g transform="translate(100, 48) rotate(-10)">
              {/* Golden Pearlescent Unicorn Horn */}
              <polygon points="-8,0 8,0 0,-38" fill="url(#goldHornGrad)" />
              <line x1="-5" y1="-8" x2="5" y2="-12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="-4" y1="-18" x2="3" y2="-22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          )}

          {traits.earWingType === 'wings' && (
            <g>
              {/* Left Feather Wing */}
              <path
                d="M 50 110 C 20 80 15 50 40 40 C 55 55 50 90 60 110"
                fill="#FFFFFF"
                stroke={traits.furColor}
                strokeWidth="3"
                className="animate-pulse"
              />
              {/* Right Feather Wing */}
              <path
                d="M 150 110 C 180 80 185 50 160 40 C 145 55 150 90 140 110"
                fill="#FFFFFF"
                stroke={traits.furColor}
                strokeWidth="3"
                className="animate-pulse"
              />
            </g>
          )}

          {traits.earWingType === 'ears' && (
            <g>
              {/* Pointy Cat Ears */}
              <polygon points="50,68 62,30 84,60" fill={traits.furColor} stroke="#E2E8F0" strokeWidth="2" />
              <polygon points="55,64 63,38 78,58" fill="#FBCFE8" />

              <polygon points="150,68 138,30 116,60" fill={traits.furColor} stroke="#E2E8F0" strokeWidth="2" />
              <polygon points="145,64 137,38 122,58" fill="#FBCFE8" />
            </g>
          )}

          {traits.earWingType === 'floppy' && (
            <g>
              {/* Cute Floppy Dog Ears */}
              <ellipse cx="45" cy="80" rx="16" ry="26" transform="rotate(25 45 80)" fill={traits.furColor} />
              <ellipse cx="155" cy="80" rx="16" ry="26" transform="rotate(-25 155 80)" fill={traits.furColor} />
            </g>
          )}

          {/* Chubby Cute Head & Body (Adopt-Me Style) */}
          {/* Main Body */}
          <ellipse cx="100" cy="135" rx="55" ry="42" fill={traits.furColor} />

          {/* Head */}
          <circle cx="100" cy="90" r="48" fill={traits.furColor} />

          {/* Fur Patterns (Spots / Stripes / Stars) */}
          {traits.pattern === 'striped' && (
            <g opacity="0.4">
              <path d="M 85 55 Q 100 62 115 55" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 90 63 Q 100 69 110 63" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 60 130 Q 75 133 90 130" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 110 130 Q 125 133 140 130" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          )}

          {traits.pattern === 'spotted' && (
            <g opacity="0.4" fill="#475569">
              <circle cx="70" cy="80" r="7" />
              <circle cx="128" cy="76" r="5" />
              <circle cx="80" cy="140" r="9" />
              <circle cx="120" cy="145" r="7" />
            </g>
          )}

          {traits.pattern === 'starry' && (
            <g opacity="0.7" fill="#FEF08A">
              <circle cx="72" cy="74" r="3" />
              <circle cx="128" cy="70" r="3.5" />
              <circle cx="95" cy="138" r="4" />
              <circle cx="75" cy="145" r="2.5" />
              <circle cx="125" cy="135" r="3" />
            </g>
          )}

          {/* Fluffy Belly Patch */}
          <ellipse cx="100" cy="142" rx="34" ry="24" fill="#FFFFFF" opacity="0.85" />

          {/* Rosy Blush Cheeks */}
          <circle cx="68" cy="104" r="8" fill="#F472B6" opacity="0.6" />
          <circle cx="132" cy="104" r="8" fill="#F472B6" opacity="0.6" />

          {/* Big Expressive Sparkling Anime Eyes */}
          {/* Left Eye */}
          <circle cx="78" cy="90" r="13" fill="#1E293B" />
          <circle cx="78" cy="90" r="10" fill={traits.eyeColor} />
          <circle cx="75" cy="86" r="4.5" fill="#FFFFFF" />
          <circle cx="81" cy="93" r="2" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="122" cy="90" r="13" fill="#1E293B" />
          <circle cx="122" cy="90" r="10" fill={traits.eyeColor} />
          <circle cx="119" cy="86" r="4.5" fill="#FFFFFF" />
          <circle cx="125" cy="93" r="2" fill="#FFFFFF" />

          {/* Cute Tiny Nose and Smile */}
          <ellipse cx="100" cy="100" rx="3.5" ry="2.5" fill="#334155" />
          <path d="M 94 104 Q 100 110 106 104" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Little Front Paws */}
          <ellipse cx="78" cy="165" rx="14" ry="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <ellipse cx="122" cy="165" rx="14" ry="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="goldHornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>

        {/* Creature Name Badge */}
        <div className="mt-2 text-center">
          <p className="font-extrabold text-slate-800 text-sm">{traits.name}</p>
          <p className="text-xs text-slate-500 capitalize">
            {traits.species} · {traits.pattern}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-pink-50/80 p-4 sm:p-5 rounded-3xl border border-pink-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-md">
            <Dna className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              DNA Creatures & Genetics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Select two magical parents, customize genetic alleles, and discover unique inherited offspring traits!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuiz}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl text-sm font-bold bg-white text-pink-700 hover:bg-pink-100 border border-pink-200 shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-pink-600" />
          <span>Genetics Quiz</span>
        </button>
      </div>

      {/* Main Breeding Workshop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Parent 1 Customizer (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="text-lg">🧬</span>
              <span>Parent 1 (Maternal Alleles)</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Parent A
            </span>
          </div>

          {/* Visual Showcase */}
          <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 flex justify-center">
            {renderCreature(parent1)}
          </div>

          {/* Species Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Species</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(SPECIES_PRESETS) as CreatureSpecies[]).map(sp => (
                <button
                  key={sp}
                  onClick={() => setParent1(prev => ({
                    ...prev,
                    species: sp,
                    earWingType: SPECIES_PRESETS[sp].feature,
                    furColor: SPECIES_PRESETS[sp].defaultFur,
                    name: `${SPECIES_PRESETS[sp].name}`
                  }))}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                    parent1.species === sp ? 'border-pink-500 bg-pink-50 text-pink-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="text-lg">{SPECIES_PRESETS[sp].icon}</div>
                  <div className="capitalize text-[10px] mt-0.5">{sp}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Coat Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Fur / Feather Pigment</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  onClick={() => setParent1(prev => ({ ...prev, furColor: color }))}
                  className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                    parent1.furColor === color ? 'border-pink-600 scale-110 shadow-sm' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Eye Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Eye Color</label>
            <div className="flex gap-2">
              {EYE_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setParent1(prev => ({ ...prev, eyeColor: color }))}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    parent1.eyeColor === color ? 'border-pink-600 scale-125' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Fur Pattern</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['solid', 'striped', 'spotted', 'starry'] as const).map(pat => (
                <button
                  key={pat}
                  onClick={() => setParent1(prev => ({ ...prev, pattern: pat }))}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    parent1.pattern === pat ? 'bg-pink-100 text-pink-900 border-pink-400' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Offspring Laboratory (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-purple-50/50 via-white to-pink-50/50 rounded-3xl p-5 border-2 border-pink-200 shadow-md space-y-4">
          <div className="text-center pb-2 border-b border-pink-100">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Baby Offspring (F1 Generation)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Combination of Parent 1 & 2 chromosomes
            </p>
          </div>

          {/* Offspring Presentation */}
          <div className="bg-white/80 rounded-2xl p-4 border border-pink-100 shadow-inner flex flex-col items-center justify-center min-h-[220px]">
            {isCombining ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-10 animate-pulse">
                <RefreshCw className="w-10 h-10 text-pink-500 animate-spin" />
                <p className="text-sm font-bold text-pink-700">Recombining Genetic Alleles...</p>
                <div className="text-xs font-mono text-purple-600">Crossing over chromosomes</div>
              </div>
            ) : offspring ? (
              renderCreature(offspring, true)
            ) : null}
          </div>

          {/* Breed Action Button */}
          <button
            onClick={handleBreed}
            disabled={isCombining}
            className="w-full py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
          >
            <Wand2 className="w-5 h-5" />
            <span>Combine DNA & Hatch Baby</span>
          </button>

          {/* Genetic Trait Inheritance Breakdown */}
          {offspring && !isCombining && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mendelian Inheritance Breakdown</span>
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                  <span className="font-medium">Species Origin:</span>
                  <span className="font-bold text-purple-700">{inheritedFrom.species} ({offspring.species})</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                  <span className="font-medium">Pigment Allele:</span>
                  <span className="font-bold text-pink-700">{inheritedFrom.furColor}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                  <span className="font-medium">Pattern Expression:</span>
                  <span className="font-bold text-indigo-700">{inheritedFrom.pattern} ({offspring.pattern})</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium">Eye Pigmentation:</span>
                  <span className="font-bold text-blue-700">{inheritedFrom.eyeColor}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Parent 2 Customizer (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="text-lg">🧬</span>
              <span>Parent 2 (Paternal Alleles)</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
              Parent B
            </span>
          </div>

          {/* Visual Showcase */}
          <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 flex justify-center">
            {renderCreature(parent2)}
          </div>

          {/* Species Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Species</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(SPECIES_PRESETS) as CreatureSpecies[]).map(sp => (
                <button
                  key={sp}
                  onClick={() => setParent2(prev => ({
                    ...prev,
                    species: sp,
                    earWingType: SPECIES_PRESETS[sp].feature,
                    furColor: SPECIES_PRESETS[sp].defaultFur,
                    name: `${SPECIES_PRESETS[sp].name}`
                  }))}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                    parent2.species === sp ? 'border-purple-500 bg-purple-50 text-purple-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="text-lg">{SPECIES_PRESETS[sp].icon}</div>
                  <div className="capitalize text-[10px] mt-0.5">{sp}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Coat Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Fur / Feather Pigment</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  onClick={() => setParent2(prev => ({ ...prev, furColor: color }))}
                  className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                    parent2.furColor === color ? 'border-purple-600 scale-110 shadow-sm' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Eye Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Eye Color</label>
            <div className="flex gap-2">
              {EYE_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setParent2(prev => ({ ...prev, eyeColor: color }))}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    parent2.eyeColor === color ? 'border-purple-600 scale-125' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Fur Pattern</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['solid', 'striped', 'spotted', 'starry'] as const).map(pat => (
                <button
                  key={pat}
                  onClick={() => setParent2(prev => ({ ...prev, pattern: pat }))}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    parent2.pattern === pat ? 'bg-purple-100 text-purple-900 border-purple-400' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
