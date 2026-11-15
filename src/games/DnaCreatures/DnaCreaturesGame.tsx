import React, { useState } from 'react';
import { Dna, Wand2, RefreshCw } from 'lucide-react';
import { FunFactsSection } from '../../components/FunFactsSection';

type CreatureSpecies = 'cat' | 'dog' | 'dove' | 'unicorn';

interface TraitConfig {
  species: CreatureSpecies;
  furColor: string;
  pattern: 'solid' | 'spotted' | 'striped' | 'starry';
  eyeColor: string;
  earWingType: 'ears' | 'floppy' | 'wings' | 'horn';
  name: string;
}

const SPECIES_PRESETS: Record<CreatureSpecies, { name: string; icon: string; defaultFur: string; defaultEye: string; feature: 'ears' | 'floppy' | 'wings' | 'horn' }> = {
  cat: { name: 'Playful Kitty', icon: '🐱', defaultFur: '#FEF08A', defaultEye: '#7DD3FC', feature: 'ears' },
  dog: { name: 'Puppy Dog', icon: '🐶', defaultFur: '#BAE6FD', defaultEye: '#A855F7', feature: 'floppy' },
  dove: { name: 'Gentle Dove', icon: '🕊️', defaultFur: '#FBCFE8', defaultEye: '#38BDF8', feature: 'wings' },
  unicorn: { name: 'Magic Unicorn', icon: '🦄', defaultFur: '#E9D5FF', defaultEye: '#C084FC', feature: 'horn' }
};

// Soft, light pastel palette: Pastel Purple, Blue, Pink, Green, Yellow, Cream
const COLOR_PALETTE = ['#E9D5FF', '#BAE6FD', '#FBCFE8', '#BBF7D0', '#FEF08A', '#F8FAFC'];

// Helper to draw a crisp 5-pointed star
const renderStar = (cx: number, cy: number, r: number, color: string) => {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return <polygon points={points.join(' ')} fill={color} />;
};

interface DnaCreaturesGameProps {
  onOpenQuiz: () => void;
}

export const DnaCreaturesGame: React.FC<DnaCreaturesGameProps> = ({ onOpenQuiz }) => {
  // Parent 1 State
  const [parent1, setParent1] = useState<TraitConfig>({
    species: 'cat',
    furColor: '#FEF08A',
    pattern: 'striped',
    eyeColor: '#BAE6FD',
    earWingType: 'ears',
    name: 'Parent Cat'
  });

  // Parent 2 State
  const [parent2, setParent2] = useState<TraitConfig>({
    species: 'unicorn',
    furColor: '#E9D5FF',
    pattern: 'starry',
    eyeColor: '#E9D5FF',
    earWingType: 'horn',
    name: 'Parent Unicorn'
  });

  // Offspring State: MUST NOT SHOW AT THE BEGINNING!
  const [offspring, setOffspring] = useState<TraitConfig | null>(null);
  const [isCombining, setIsCombining] = useState(false);
  const [inheritedFrom, setInheritedFrom] = useState<{ [key: string]: string }>({});

  // Combine DNA action
  const handleBreed = () => {
    setIsCombining(true);
    setTimeout(() => {
      const speciesChoice = Math.random() > 0.5 ? parent1.species : parent2.species;
      const furChoice = Math.random() > 0.5 ? parent1.furColor : parent2.furColor;
      const patternChoice = Math.random() > 0.5 ? parent1.pattern : parent2.pattern;
      const eyeChoice = Math.random() > 0.5 ? parent1.eyeColor : parent2.eyeColor;
      
      let earChoice: TraitConfig['earWingType'] = parent1.earWingType;
      if (parent1.earWingType === 'horn' || parent2.earWingType === 'horn') {
        earChoice = Math.random() > 0.35 ? 'horn' : (Math.random() > 0.5 ? parent1.earWingType : parent2.earWingType);
      } else if (parent1.earWingType === 'wings' || parent2.earWingType === 'wings') {
        earChoice = Math.random() > 0.35 ? 'wings' : parent1.earWingType;
      } else {
        earChoice = Math.random() > 0.5 ? parent1.earWingType : parent2.earWingType;
      }

      const randomNames = ['Sparkle Baby', 'Cloud Paws', 'Starlight', 'Sunny Feather', 'Buttercup', 'Luna'];
      const babyName = randomNames[Math.floor(Math.random() * randomNames.length)];

      setOffspring({
        species: speciesChoice,
        furColor: furChoice,
        pattern: patternChoice,
        eyeColor: eyeChoice,
        earWingType: earChoice,
        name: babyName
      });

      setInheritedFrom({
        species: speciesChoice === parent1.species ? 'Parent 1' : 'Parent 2',
        furColor: furChoice === parent1.furColor ? 'Parent 1' : 'Parent 2',
        pattern: patternChoice === parent1.pattern ? 'Parent 1' : 'Parent 2',
        eyeColor: eyeChoice === parent1.eyeColor ? 'Parent 1' : 'Parent 2',
        earWingType: earChoice === parent1.earWingType ? 'Parent 1' : 'Parent 2'
      });

      setIsCombining(false);
    }, 700);
  };

  // Render Cute Vector Creature with exact circular stomach patch stripes
  const renderCreature = (traits: TraitConfig, idPrefix: string) => {
    const clipId = `stomach-clip-${idPrefix}`;
    // When the creature's fur is yellow (#FEF08A), make the stars white so they remain visible!
    const starColor = traits.furColor === '#FEF08A' ? '#FFFFFF' : (traits.furColor === '#F8FAFC' ? '#F59E0B' : '#FEF08A');

    return (
      <div className="relative flex flex-col items-center justify-center py-2">
        <svg width={150} height={150} viewBox="0 0 200 200" className="drop-shadow-xs">
          <defs>
            {/* Exact circular clipping path for stomach */}
            <clipPath id={clipId}>
              <circle cx="100" cy="140" r="26" />
            </clipPath>
          </defs>

          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="55" ry="12" fill="rgba(148, 163, 184, 0.18)" />

          {/* Horn or Wings or Ears */}
          {traits.earWingType === 'horn' && (
            <polygon points="94,48 106,48 100,10" fill="#FEF08A" stroke="#FDE047" strokeWidth="1.5" />
          )}

          {traits.earWingType === 'wings' && (
            <g>
              <path d="M 52 110 C 25 80 20 50 45 42 C 60 55 55 90 62 110" fill="#FFFFFF" stroke={traits.furColor} strokeWidth="2.5" />
              <path d="M 148 110 C 175 80 180 50 155 42 C 140 55 145 90 138 110" fill="#FFFFFF" stroke={traits.furColor} strokeWidth="2.5" />
            </g>
          )}

          {traits.earWingType === 'ears' && (
            <g>
              <polygon points="52,68 64,32 84,60" fill={traits.furColor} />
              <polygon points="56,64 64,40 78,58" fill="#FBCFE8" />
              <polygon points="148,68 136,32 116,60" fill={traits.furColor} />
              <polygon points="144,64 136,40 122,58" fill="#FBCFE8" />
            </g>
          )}

          {traits.earWingType === 'floppy' && (
            <g>
              <ellipse cx="46" cy="80" rx="15" ry="24" transform="rotate(22 46 80)" fill={traits.furColor} />
              <ellipse cx="154" cy="80" rx="15" ry="24" transform="rotate(-22 154 80)" fill={traits.furColor} />
            </g>
          )}

          {/* Chubby Body & Head - Soft pastel fur */}
          <ellipse cx="100" cy="135" rx="52" ry="40" fill={traits.furColor} />
          <circle cx="100" cy="90" r="46" fill={traits.furColor} />

          {/* Non-stripe patterns (spots or actual 5-pointed stars) */}
          {traits.pattern === 'spotted' && (
            <g fill="rgba(255, 255, 255, 0.75)">
              <circle cx="72" cy="78" r="5" />
              <circle cx="128" cy="75" r="4.5" />
              <circle cx="68" cy="135" r="5" />
              <circle cx="132" cy="138" r="5" />
            </g>
          )}

          {/* Starry Pattern: Actual 5-point stars, white when fur is yellow */}
          {traits.pattern === 'starry' && (
            <g>
              {renderStar(74, 74, 5.5, starColor)}
              {renderStar(126, 70, 5.5, starColor)}
              {renderStar(68, 134, 5.0, starColor)}
              {renderStar(132, 138, 5.0, starColor)}
              {renderStar(100, 68, 4.5, starColor)}
            </g>
          )}

          {/* Circular patch on creature's stomach */}
          <circle cx="100" cy="140" r="26" fill="#FFFFFF" opacity="0.9" />

          {/* STRIPES: Appear ONLY inside the circular stomach patch, layered on top and clipped to its exact shape */}
          {traits.pattern === 'striped' && (
            <g clipPath={`url(#${clipId})`}>
              <line x1="60" y1="124" x2="140" y2="124" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="60" y1="132" x2="140" y2="132" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="60" y1="140" x2="140" y2="140" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="60" y1="148" x2="140" y2="148" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="60" y1="156" x2="140" y2="156" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
            </g>
          )}

          {/* Rosy Cheeks */}
          <circle cx="70" cy="102" r="7" fill="#F472B6" opacity="0.45" />
          <circle cx="130" cy="102" r="7" fill="#F472B6" opacity="0.45" />

          {/* Friendly Eyes with THIN black band as requested */}
          <circle cx="78" cy="90" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="78" cy="90" r="8.2" fill={traits.eyeColor} />
          <circle cx="75" cy="87" r="3.2" fill="#FFFFFF" />
          <circle cx="80" cy="92" r="1.5" fill="#FFFFFF" />

          <circle cx="122" cy="90" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="122" cy="90" r="8.2" fill={traits.eyeColor} />
          <circle cx="119" cy="87" r="3.2" fill="#FFFFFF" />
          <circle cx="124" cy="92" r="1.5" fill="#FFFFFF" />

          {/* Nose and Smile */}
          <ellipse cx="100" cy="98" rx="3" ry="2" fill="#334155" />
          <path d="M 95 102 Q 100 107 105 102" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Little Front Paws */}
          <ellipse cx="80" cy="165" rx="12" ry="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <ellipse cx="120" cy="165" rx="12" ry="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        </svg>

        <p className="font-extrabold text-slate-800 text-xs sm:text-sm mt-1">{traits.name}</p>
        <p className="text-[11px] text-slate-500 capitalize">{traits.species} · {traits.pattern}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner (Clean, no duplicate quiz button) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#E0F2FE] p-5 rounded-3xl border border-sky-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-sky-950 tracking-tight">
              DNA Lab
            </h2>
            <p className="text-xs sm:text-sm text-sky-800">
              Pick two parents, customize their traits, and press Create Offspring to see their baby!
            </p>
          </div>
        </div>
      </div>

      {/* Main Breeding Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Parent 1 Customizer (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-sky-200 shadow-xs space-y-4">
          <div className="border-b border-sky-100 pb-2">
            <h3 className="font-extrabold text-slate-900 text-sm">Parent 1</h3>
          </div>

          <div className="bg-[#F0F9FF] rounded-2xl p-2 flex justify-center">
            {renderCreature(parent1, 'parent1')}
          </div>

          {/* Species */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Animal Species</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(SPECIES_PRESETS) as CreatureSpecies[]).map(sp => (
                <button
                  key={sp}
                  onClick={() => setParent1(prev => ({
                    ...prev,
                    species: sp,
                    earWingType: SPECIES_PRESETS[sp].feature,
                    furColor: SPECIES_PRESETS[sp].defaultFur,
                    name: `Parent ${sp.charAt(0).toUpperCase() + sp.slice(1)}`
                  }))}
                  className={`p-1.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                    parent1.species === sp ? 'border-sky-500 bg-sky-100 text-sky-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="text-base">{SPECIES_PRESETS[sp].icon}</div>
                  <div className="text-[10px] capitalize">{sp}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fur Color (Renamed from Soft Fur Color) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Fur Color</label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map(col => (
                <button
                  key={col}
                  onClick={() => setParent1(prev => ({ ...prev, furColor: col }))}
                  className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                    parent1.furColor === col ? 'border-sky-600 scale-110 shadow-xs ring-2 ring-sky-300' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Eye Color (Requested Feature: Same palette as Fur Color) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Eye Color</label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map(col => (
                <button
                  key={col}
                  onClick={() => setParent1(prev => ({ ...prev, eyeColor: col }))}
                  className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                    parent1.eyeColor === col ? 'border-sky-600 scale-110 shadow-xs ring-2 ring-sky-300' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Pattern (Stripes on Stomach)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['solid', 'striped', 'spotted', 'starry'] as const).map(pat => (
                <button
                  key={pat}
                  onClick={() => setParent1(prev => ({ ...prev, pattern: pat }))}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    parent1.pattern === pat ? 'bg-sky-100 text-sky-900 border-sky-400' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Offspring Display (MUST BE EMPTY INITIALLY!) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#F0F9FF] to-white rounded-3xl p-5 border-2 border-sky-200 shadow-sm space-y-4">
          <div className="text-center pb-2 border-b border-sky-100">
            <h3 className="font-extrabold text-slate-900 text-base">Baby Offspring</h3>
            <p className="text-[11px] text-slate-500">Combines genes from both parents</p>
          </div>

          {/* Visual Container */}
          <div className="bg-white rounded-2xl p-4 border border-sky-100 min-h-[200px] flex flex-col items-center justify-center">
            {isCombining ? (
              <div className="text-center space-y-2 py-8">
                <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
                <p className="text-xs font-bold text-sky-800">Mixing DNA Alleles...</p>
              </div>
            ) : offspring ? (
              renderCreature(offspring, 'baby')
            ) : (
              <div className="text-center py-10 px-4 space-y-2">
                <div className="text-3xl">🥚</div>
                <p className="text-xs font-bold text-slate-700">No offspring yet!</p>
                <p className="text-[11px] text-slate-400">
                  Pick your parents on the left and right, then press the button below to create a baby!
                </p>
              </div>
            )}
          </div>

          {/* Exactly one Create Offspring button */}
          <button
            onClick={handleBreed}
            disabled={isCombining}
            className="w-full py-3 rounded-2xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-sm"
          >
            <Wand2 className="w-4 h-4" />
            <span>Create Offspring</span>
          </button>

          {/* Inherited Traits Card */}
          {offspring && !isCombining && (
            <div className="bg-white rounded-2xl p-3 border border-sky-100 text-xs space-y-1">
              <span className="font-bold text-slate-800 block text-[11px]">Inherited Traits:</span>
              <div className="flex justify-between text-slate-600 py-0.5 border-b border-slate-50">
                <span>Species:</span>
                <span className="font-semibold text-sky-800">{inheritedFrom.species}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5 border-b border-slate-50">
                <span>Fur Color:</span>
                <span className="font-semibold text-sky-800">{inheritedFrom.furColor}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5 border-b border-slate-50">
                <span>Eye Color:</span>
                <span className="font-semibold text-sky-800">{inheritedFrom.eyeColor}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>Pattern:</span>
                <span className="font-semibold text-sky-800">{inheritedFrom.pattern}</span>
              </div>
            </div>
          )}
        </div>

        {/* Parent 2 Customizer (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-sky-200 shadow-xs space-y-4">
          <div className="border-b border-sky-100 pb-2">
            <h3 className="font-extrabold text-slate-900 text-sm">Parent 2</h3>
          </div>

          <div className="bg-[#F0F9FF] rounded-2xl p-2 flex justify-center">
            {renderCreature(parent2, 'parent2')}
          </div>

          {/* Species */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Animal Species</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(SPECIES_PRESETS) as CreatureSpecies[]).map(sp => (
                <button
                  key={sp}
                  onClick={() => setParent2(prev => ({
                    ...prev,
                    species: sp,
                    earWingType: SPECIES_PRESETS[sp].feature,
                    furColor: SPECIES_PRESETS[sp].defaultFur,
                    name: `Parent ${sp.charAt(0).toUpperCase() + sp.slice(1)}`
                  }))}
                  className={`p-1.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                    parent2.species === sp ? 'border-sky-500 bg-sky-100 text-sky-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="text-base">{SPECIES_PRESETS[sp].icon}</div>
                  <div className="text-[10px] capitalize">{sp}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fur Color (Renamed from Soft Fur Color) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Fur Color</label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map(col => (
                <button
                  key={col}
                  onClick={() => setParent2(prev => ({ ...prev, furColor: col }))}
                  className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                    parent2.furColor === col ? 'border-sky-600 scale-110 shadow-xs ring-2 ring-sky-300' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Eye Color (Requested Feature: Same palette as Fur Color) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Eye Color</label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map(col => (
                <button
                  key={col}
                  onClick={() => setParent2(prev => ({ ...prev, eyeColor: col }))}
                  className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer ${
                    parent2.eyeColor === col ? 'border-sky-600 scale-110 shadow-xs ring-2 ring-sky-300' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Pattern (Stripes on Stomach)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['solid', 'striped', 'spotted', 'starry'] as const).map(pat => (
                <button
                  key={pat}
                  onClick={() => setParent2(prev => ({ ...prev, pattern: pat }))}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    parent2.pattern === pat ? 'bg-sky-100 text-sky-900 border-sky-400' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Fun Facts Area with Quiz Button directly below */}
      <FunFactsSection gameId="dna-creatures" onOpenQuiz={onOpenQuiz} />

    </div>
  );
};
