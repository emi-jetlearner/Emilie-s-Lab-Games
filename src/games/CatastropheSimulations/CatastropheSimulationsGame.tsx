import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { FunFactsSection } from '../../components/FunFactsSection';
import { Tsunami3DSimulation } from './Tsunami3DSimulation';
import { Volcano3DSimulation } from './Volcano3DSimulation';
import { Earthquake3DSimulation } from './Earthquake3DSimulation';

type DisasterType = 'volcano' | 'tsunami' | 'earthquake';

interface CatastropheSimulationsGameProps {
  onOpenQuiz: () => void;
}

export const CatastropheSimulationsGame: React.FC<CatastropheSimulationsGameProps> = ({ onOpenQuiz }) => {
  // Active Disaster tab
  const [disaster, setDisaster] = useState<DisasterType>('volcano');

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#DCFCE7] p-5 rounded-3xl border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
              Catastrophe Simulations
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800">
              Discover how volcanoes erupt, how tsunamis flood coasts, and how earthquakes shake our planet in interactive 3D!
            </p>
          </div>
        </div>
      </div>

      {/* Catastrophe Selector Tabs */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-emerald-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">
          Choose Catastrophe:
        </span>
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
          <button
            onClick={() => setDisaster('volcano')}
            className={`px-4 py-2.5 rounded-2xl text-center border text-xs font-black transition-all cursor-pointer ${
              disaster === 'volcano'
                ? 'bg-[#DCFCE7] border-emerald-400 text-emerald-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            🌋 Volcano (3D)
          </button>

          <button
            onClick={() => setDisaster('tsunami')}
            className={`px-4 py-2.5 rounded-2xl text-center border text-xs font-black transition-all cursor-pointer ${
              disaster === 'tsunami'
                ? 'bg-sky-100 border-sky-400 text-sky-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            🌊 Tsunami (3D)
          </button>

          <button
            onClick={() => setDisaster('earthquake')}
            className={`px-4 py-2.5 rounded-2xl text-center border text-xs font-black transition-all cursor-pointer ${
              disaster === 'earthquake'
                ? 'bg-purple-100 border-purple-400 text-purple-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            ⚡ Earthquake (3D)
          </button>
        </div>
      </div>

      {/* 3D Catastrophe Simulations */}
      {disaster === 'volcano' && <Volcano3DSimulation />}
      {disaster === 'tsunami' && <Tsunami3DSimulation />}
      {disaster === 'earthquake' && <Earthquake3DSimulation />}

      {/* Fun Facts Section with single Quiz Button underneath */}
      <FunFactsSection gameId="catastrophe-simulations" onOpenQuiz={onOpenQuiz} />

    </div>
  );
};
