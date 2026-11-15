import React, { useState, useEffect, useRef } from 'react';
import { Compass, Play, RotateCcw } from 'lucide-react';
import { FunFactsSection } from '../../components/FunFactsSection';

interface GravityObject {
  id: string;
  name: string; // Exact requested names: Apple, Feather, Bricks, Piano, Bowling Ball, Beach Ball, Anvil
  icon: string;
  massKg: number;
  dragCoeff: number;
  areaM2: number;
}

const AVAILABLE_OBJECTS: GravityObject[] = [
  { id: 'apple', name: 'Apple', icon: '🍎', massKg: 0.18, dragCoeff: 0.47, areaM2: 0.005 },
  { id: 'feather', name: 'Feather', icon: '🪶', massKg: 0.003, dragCoeff: 1.3, areaM2: 0.008 },
  { id: 'bricks', name: 'Bricks', icon: '🧱', massKg: 10.0, dragCoeff: 0.8, areaM2: 0.02 },
  { id: 'piano', name: 'Piano', icon: '🎹', massKg: 280.0, dragCoeff: 1.1, areaM2: 1.5 },
  { id: 'bowling', name: 'Bowling Ball', icon: '🎳', massKg: 7.2, dragCoeff: 0.47, areaM2: 0.038 },
  { id: 'beachball', name: 'Beach Ball', icon: '🏐', massKg: 0.1, dragCoeff: 0.47, areaM2: 0.08 },
  { id: 'anvil', name: 'Anvil', icon: '⚒️', massKg: 50.0, dragCoeff: 0.9, areaM2: 0.07 }
];

interface PlanetInfo {
  id: string;
  name: string;
  g: number;
  icon: string;
  pastelBg: string;
  airDensity: number;
}

const PLANETS: PlanetInfo[] = [
  { id: 'earth', name: 'Earth', g: 9.81, icon: '🌍', pastelBg: '#F0FDF4', airDensity: 1.2 },
  { id: 'moon', name: 'The Moon', g: 1.62, icon: '🌙', pastelBg: '#F8FAFC', airDensity: 0.0 },
  { id: 'mars', name: 'Mars', g: 3.72, icon: '🪐', pastelBg: '#FFF1F2', airDensity: 0.02 },
  { id: 'jupiter', name: 'Jupiter', g: 24.79, icon: '⚡', pastelBg: '#FEF3C7', airDensity: 1.8 },
  { id: 'sun', name: 'The Sun', g: 274.0, icon: '☀️', pastelBg: '#FEF9C3', airDensity: 0.5 },
  { id: 'space', name: 'Zero-G Space', g: 0.0, icon: '🛰️', pastelBg: '#F3E8FF', airDensity: 0.0 }
];

interface DefyingGravityGameProps {
  onOpenQuiz: () => void;
}

export const DefyingGravityGame: React.FC<DefyingGravityGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Planet selection
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [dropHeightMeters, setDropHeightMeters] = useState<number>(50); // 20m, 50m, 100m

  // Active objects (up to 4 objects)
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>(['apple', 'feather', 'bowling', 'bricks']);

  // Simulation run state
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [results, setResults] = useState<Record<string, { time: number; distance: number; speedKmh: number }>>({});

  const activePlanet = PLANETS.find(p => p.id === selectedPlanetId) || PLANETS[0];
  const activeObjects = AVAILABLE_OBJECTS.filter(o => selectedObjectIds.includes(o.id));

  // Physics state for each active object
  const physicsRef = useRef<{
    [id: string]: {
      yMeters: number; // 0 to dropHeightMeters
      v: number;
      finished: boolean;
      finishTime: number;
    };
  }>({});

  const timerRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  // Toggle object in drop experiment (up to 4)
  const toggleObject = (id: string) => {
    if (selectedObjectIds.includes(id)) {
      if (selectedObjectIds.length > 1) {
        setSelectedObjectIds(selectedObjectIds.filter(item => item !== id));
      }
    } else {
      if (selectedObjectIds.length < 4) {
        setSelectedObjectIds([...selectedObjectIds, id]);
      }
    }
    handleReset();
  };

  const handleStartDrop = () => {
    setIsDropping(true);
    setResults({});
    timerRef.current = 0;

    const initPhysics: typeof physicsRef.current = {};
    activeObjects.forEach(obj => {
      initPhysics[obj.id] = {
        yMeters: 0,
        v: 0,
        finished: false,
        finishTime: 0
      };
    });
    physicsRef.current = initPhysics;
  };

  const handleReset = () => {
    setIsDropping(false);
    setResults({});
    timerRef.current = 0;
    const initPhysics: typeof physicsRef.current = {};
    activeObjects.forEach(obj => {
      initPhysics[obj.id] = {
        yMeters: 0,
        v: 0,
        finished: false,
        finishTime: 0
      };
    });
    physicsRef.current = initPhysics;
  };

  // Main Canvas Render and Drop Kinematics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isLive = true;
    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isLive) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // CHANGE BACKGROUND COLOR WHEN PLANET CHANGES (Pastel aesthetic maintained)
      ctx.fillStyle = activePlanet.pastelBg;
      ctx.fillRect(0, 0, width, height);

      // Frame parameters
      const scaleLeftX = 65;
      const stageTopY = 40;
      const groundY = height - 45;
      const stageHeightPx = groundY - stageTopY;

      // 1. MEASURING SCALE ON THE LEFT SIDE OF SCREEN
      // STARTS AT 0 AT THE BOTTOM, WITH HIGHEST NUMBER AT THE TOP!
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(scaleLeftX, stageTopY);
      ctx.lineTo(scaleLeftX, groundY);
      ctx.stroke();

      // Tick marks from 0 at bottom to dropHeightMeters at top
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'right';

      const tickSteps = 5;
      for (let i = 0; i <= tickSteps; i++) {
        // py: i=0 is bottom (0m), i=tickSteps is top (dropHeightMeters)
        const py = groundY - (i / tickSteps) * stageHeightPx;
        const meterVal = Math.round((i / tickSteps) * dropHeightMeters);

        ctx.beginPath();
        ctx.moveTo(scaleLeftX - 8, py);
        ctx.lineTo(scaleLeftX + 4, py);
        ctx.stroke();

        ctx.fillText(`${meterVal}m`, scaleLeftX - 12, py + 3.5);
      }

      // Ground Base Line
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(scaleLeftX, groundY, width - scaleLeftX - 20, 10);
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GROUND (0 meters)', (scaleLeftX + width - 20) / 2, groundY + 24);

      // Drop Release Beam at top
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(scaleLeftX, stageTopY - 8, width - scaleLeftX - 20, 8);

      // 2. KINEMATIC INTEGRATION
      if (isDropping && activePlanet.g > 0) {
        timerRef.current += dt;

        activeObjects.forEach(obj => {
          const state = physicsRef.current[obj.id];
          if (!state || state.finished) return;

          // Drag force Fd = 0.5 * rho * v^2 * Cd * A
          const v = state.v;
          const drag = 0.5 * activePlanet.airDensity * (v * v) * obj.dragCoeff * obj.areaM2;
          const netForce = (obj.massKg * activePlanet.g) - drag;
          const a = netForce / obj.massKg;

          state.v += a * dt;
          state.yMeters += state.v * dt;

          if (state.yMeters >= dropHeightMeters) {
            state.yMeters = dropHeightMeters;
            state.finished = true;
            state.finishTime = timerRef.current;

            setResults(prev => ({
              ...prev,
              [obj.id]: {
                time: timerRef.current,
                distance: dropHeightMeters,
                speedKmh: Math.round(state.v * 3.6)
              }
            }));
          }
        });
      }

      // 3. DRAW OBJECTS (Up to 4 objects spaced horizontally)
      const objAreaWidth = (width - scaleLeftX - 40);
      const colStep = objAreaWidth / (activeObjects.length + 1);

      activeObjects.forEach((obj, idx) => {
        const objX = scaleLeftX + 30 + (idx + 1) * colStep - (colStep / 2);
        const state = physicsRef.current[obj.id] || { yMeters: 0, v: 0 };

        // Position on screen: Top starts at stageTopY (yMeters = 0), falls down to groundY (yMeters = dropHeightMeters)
        const fallRatio = Math.min(state.yMeters / dropHeightMeters, 1);
        const objScreenY = stageTopY + fallRatio * stageHeightPx - 16;

        ctx.save();
        ctx.translate(objX, objScreenY);

        // Icon
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.icon, 0, 0);

        // Name tag
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(obj.name, 0, 24);

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      isLive = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDropping, activePlanet, dropHeightMeters, activeObjects]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner (Clean, no duplicate quiz button) */}
      <div className="bg-[#F3E8FF] p-5 rounded-3xl border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
              Defying Gravity
            </h2>
            <p className="text-xs sm:text-sm text-purple-800">
              Drop objects on different planets! Compare falling times and speeds with a clear vertical height scale.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-purple-200 shadow-xs flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 text-xs font-semibold text-slate-700">
            <span className="font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              {activePlanet.icon} {activePlanet.name} · Gravity: {activePlanet.g} m/s²
            </span>
            <span>Height: {dropHeightMeters}m</span>
          </div>

          {/* Canvas Viewport with scale on left (0m at bottom, top at max) */}
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Single Drop / Reset Button */}
          <div className="w-full mt-4 flex items-center justify-between gap-3">
            <button
              onClick={handleStartDrop}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-xs text-xs sm:text-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Drop Objects!</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Height</span>
            </button>
          </div>

          {/* Fall Results Display Cards (Time, Distance, Speed) */}
          <div className="w-full mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {activeObjects.map(obj => {
              const res = results[obj.id];
              return (
                <div key={obj.id} className="p-3 rounded-2xl border border-purple-100 bg-[#FAF5FF] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{obj.icon}</span>
                    <span className="font-extrabold text-xs text-slate-900">{obj.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                    <div>Time: <strong className="text-purple-700">{res ? `${res.time.toFixed(2)}s` : '—'}</strong></div>
                    <div>Distance: <strong className="text-sky-700">{res ? `${res.distance}m` : `${dropHeightMeters}m`}</strong></div>
                    <div>Speed: <strong className="text-pink-700">{res ? `${res.speedKmh} km/h` : '—'}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Configuration Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Planet Selection */}
          <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Select Planet
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {PLANETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPlanetId(p.id); handleReset(); }}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                    selectedPlanetId === p.id
                      ? 'border-purple-600 bg-[#F3E8FF] text-purple-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300'
                  }`}
                >
                  <div className="text-base">{p.icon}</div>
                  <div className="text-[11px] mt-0.5">{p.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{p.g} m/s²</div>
                </button>
              ))}
            </div>
          </div>

          {/* Choose Objects (Up to 4 Objects) */}
          <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Choose Objects (Up to 4)
              </h3>
              <span className="text-xs text-purple-700 font-bold">
                {selectedObjectIds.length}/4 Selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_OBJECTS.map(obj => {
                const isSelected = selectedObjectIds.includes(obj.id);
                return (
                  <button
                    key={obj.id}
                    onClick={() => toggleObject(obj.id)}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'border-purple-500 bg-[#F3E8FF] text-purple-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-purple-200'
                    }`}
                  >
                    <span className="text-lg">{obj.icon}</span>
                    <span className="truncate">{obj.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drop Tower Height */}
          <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Drop Height
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[20, 50, 100].map(h => (
                <button
                  key={h}
                  onClick={() => { setDropHeightMeters(h); handleReset(); }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    dropHeightMeters === h
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {h} meters
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Fun Facts Area with Quiz Answers */}
      <FunFactsSection gameId="defying-gravity" onOpenQuiz={onOpenQuiz} />

    </div>
  );
};
