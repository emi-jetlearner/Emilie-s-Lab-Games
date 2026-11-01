import React, { useState, useEffect, useRef } from 'react';
import { Compass, HelpCircle, Play, RotateCcw, Wind, ShieldCheck, Check, Clock, Scale } from 'lucide-react';

interface DroppableObject {
  id: string;
  name: string;
  icon: string;
  massKg: number;
  dragCoeff: number; // aerodynamic drag
  areaM2: number;
  color: string;
}

const OBJECTS: DroppableObject[] = [
  { id: 'apple', name: "Emilie's Apple", icon: '🍎', massKg: 0.18, dragCoeff: 0.47, areaM2: 0.005, color: '#EF4444' },
  { id: 'feather', name: 'Falcon Feather', icon: '🪶', massKg: 0.002, dragCoeff: 1.2, areaM2: 0.008, color: '#F8FAFC' },
  { id: 'bowling', name: 'Bowling Ball', icon: '🎳', massKg: 7.25, dragCoeff: 0.47, areaM2: 0.038, color: '#334155' },
  { id: 'gold', name: 'Solid Gold Bar', icon: '🧱', massKg: 12.4, dragCoeff: 0.8, areaM2: 0.015, color: '#F59E0B' },
  { id: 'beachball', name: 'Beach Ball', icon: '🏐', massKg: 0.1, dragCoeff: 0.47, areaM2: 0.09, color: '#38BDF8' },
  { id: 'anvil', name: 'Blacksmith Anvil', icon: '⚒️', massKg: 50.0, dragCoeff: 0.9, areaM2: 0.08, color: '#64748B' },
  { id: 'piano', name: 'Grand Piano', icon: '🎹', massKg: 300.0, dragCoeff: 1.05, areaM2: 1.8, color: '#1E293B' }
];

interface PlanetGravity {
  id: string;
  name: string;
  g: number;
  icon: string;
  atmosphereDensity: number; // kg/m3 (Earth is ~1.225)
}

const PLANETS: PlanetGravity[] = [
  { id: 'space', name: 'Zero-G Space', g: 0.0, icon: '🛰️', atmosphereDensity: 0.0 },
  { id: 'moon', name: 'The Moon', g: 1.62, icon: '🌙', atmosphereDensity: 0.0 },
  { id: 'mars', name: 'Mars', g: 3.72, icon: '🪐', atmosphereDensity: 0.02 },
  { id: 'earth', name: 'Earth', g: 9.81, icon: '🌍', atmosphereDensity: 1.225 },
  { id: 'jupiter', name: 'Jupiter', g: 24.79, icon: '⚡', atmosphereDensity: 2.0 },
  { id: 'sun', name: 'The Sun (Surface)', g: 274.0, icon: '☀️', atmosphereDensity: 0.5 }
];

interface DefyingGravityGameProps {
  onOpenQuiz: () => void;
}

export const DefyingGravityGame: React.FC<DefyingGravityGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Experiment parameters
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [customG, setCustomG] = useState<number>(9.81);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [fallHeightMeters, setFallHeightMeters] = useState<number>(50); // 10m to 200m
  const [hasAirResistance, setHasAirResistance] = useState<boolean>(true);

  // Lane selection
  const [lane1ObjectId, setLane1ObjectId] = useState<string>('bowling');
  const [lane2ObjectId, setLane2ObjectId] = useState<string>('feather');

  // Simulation running state
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [lane1Time, setLane1Time] = useState<number | null>(null);
  const [lane2Time, setLane2Time] = useState<number | null>(null);
  const [lane1Velocity, setLane1Velocity] = useState<number>(0);
  const [lane2Velocity, setLane2Velocity] = useState<number>(0);

  const activePlanet = PLANETS.find(p => p.id === selectedPlanetId) || PLANETS[3];
  const gValue = isCustomMode ? customG : activePlanet.g;
  const airDensity = hasAirResistance ? (isCustomMode ? 1.225 : activePlanet.atmosphereDensity) : 0.0;

  const obj1 = OBJECTS.find(o => o.id === lane1ObjectId) || OBJECTS[2];
  const obj2 = OBJECTS.find(o => o.id === lane2ObjectId) || OBJECTS[1];

  // Simulation physics positions (in meters)
  const simStateRef = useRef<{
    t: number;
    y1: number;
    v1: number;
    hit1: boolean;
    y2: number;
    v2: number;
    hit2: boolean;
  }>({
    t: 0,
    y1: 0,
    v1: 0,
    hit1: false,
    y2: 0,
    v2: 0,
    hit2: false
  });

  const animFrameRef = useRef<number>(0);

  const startDrop = () => {
    setIsDropping(true);
    setLane1Time(null);
    setLane2Time(null);
    setLane1Velocity(0);
    setLane2Velocity(0);

    simStateRef.current = {
      t: 0,
      y1: 0,
      v1: 0,
      hit1: false,
      y2: 0,
      v2: 0,
      hit2: false
    };
  };

  const resetDrop = () => {
    setIsDropping(false);
    setLane1Time(null);
    setLane2Time(null);
    setLane1Velocity(0);
    setLane2Velocity(0);

    simStateRef.current = {
      t: 0,
      y1: 0,
      v1: 0,
      hit1: false,
      y2: 0,
      v2: 0,
      hit2: false
    };
  };

  // Main Canvas Render and Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      if (!isRunning) return;

      const dt = Math.min((now - lastTimestamp) / 1000, 0.05); // seconds
      lastTimestamp = now;

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

      // Background Chamber
      const chamberGrad = ctx.createLinearGradient(0, 0, 0, height);
      chamberGrad.addColorStop(0, '#0F172A');
      chamberGrad.addColorStop(1, '#1E293B');
      ctx.fillStyle = chamberGrad;
      ctx.fillRect(0, 0, width, height);

      // Measurement Ruler Grid lines along center
      const chamberTop = 50;
      const chamberBottom = height - 50;
      const chamberHeightPx = chamberBottom - chamberTop;

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px monospace';

      const tickCount = 10;
      for (let i = 0; i <= tickCount; i++) {
        const py = chamberTop + (i / tickCount) * chamberHeightPx;
        const m = ((i / tickCount) * fallHeightMeters).toFixed(0);
        ctx.beginPath();
        ctx.moveTo(width / 2 - 20, py);
        ctx.lineTo(width / 2 + 20, py);
        ctx.stroke();
        ctx.fillText(`${m}m`, width / 2 + 24, py + 3);
      }

      // Dividing Lane line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(width / 2, chamberTop);
      ctx.lineTo(width / 2, chamberBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Top Release Gantry Beam
      ctx.fillStyle = '#475569';
      ctx.fillRect(40, chamberTop - 12, width - 80, 12);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(width * 0.25 - 20, chamberTop - 8, 40, 8);
      ctx.fillRect(width * 0.75 - 20, chamberTop - 8, 40, 8);

      // Bottom Impact Platform
      ctx.fillStyle = '#334155';
      ctx.fillRect(40, chamberBottom, width - 80, 16);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(width * 0.25 - 35, chamberBottom, 70, 6);
      ctx.fillRect(width * 0.75 - 35, chamberBottom, 70, 6);

      // Physics Integration if Dropping
      if (isDropping && gValue > 0) {
        simStateRef.current.t += dt;

        // Lane 1 Integration
        if (!simStateRef.current.hit1) {
          // Downward gravity force: Fg = m * g
          // Upward drag force: Fd = 0.5 * rho * v^2 * Cd * A
          const v = simStateRef.current.v1;
          const dragForce = 0.5 * airDensity * (v * v) * obj1.dragCoeff * obj1.areaM2;
          const netForce = (obj1.massKg * gValue) - dragForce;
          const a = netForce / obj1.massKg;

          simStateRef.current.v1 += a * dt;
          simStateRef.current.y1 += simStateRef.current.v1 * dt;

          if (simStateRef.current.y1 >= fallHeightMeters) {
            simStateRef.current.y1 = fallHeightMeters;
            simStateRef.current.hit1 = true;
            setLane1Time(simStateRef.current.t);
            setLane1Velocity(simStateRef.current.v1 * 3.6); // km/h
          }
        }

        // Lane 2 Integration
        if (!simStateRef.current.hit2) {
          const v = simStateRef.current.v2;
          const dragForce = 0.5 * airDensity * (v * v) * obj2.dragCoeff * obj2.areaM2;
          const netForce = (obj2.massKg * gValue) - dragForce;
          const a = netForce / obj2.massKg;

          simStateRef.current.v2 += a * dt;
          simStateRef.current.y2 += simStateRef.current.v2 * dt;

          if (simStateRef.current.y2 >= fallHeightMeters) {
            simStateRef.current.y2 = fallHeightMeters;
            simStateRef.current.hit2 = true;
            setLane2Time(simStateRef.current.t);
            setLane2Velocity(simStateRef.current.v2 * 3.6); // km/h
          }
        }
      }

      // Convert Meters to Screen Y
      const meterToPx = (m: number) => {
        return chamberTop + (m / fallHeightMeters) * chamberHeightPx;
      };

      // Draw Object 1 in Lane 1
      const lane1X = width * 0.25;
      const lane1Y = meterToPx(simStateRef.current.y1);

      ctx.save();
      ctx.translate(lane1X, lane1Y);
      // Soft glow
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 12;
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj1.icon, 0, 0);

      // Trailing velocity streak
      if (simStateRef.current.v1 > 1 && !simStateRef.current.hit1) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, -15 - Math.min(simStateRef.current.v1 * 2, 45));
        ctx.stroke();
      }
      ctx.restore();

      // Draw Object 2 in Lane 2
      const lane2X = width * 0.75;
      const lane2Y = meterToPx(simStateRef.current.y2);

      ctx.save();
      ctx.translate(lane2X, lane2Y);
      ctx.shadowColor = '#F472B6';
      ctx.shadowBlur = 12;
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj2.icon, 0, 0);

      if (simStateRef.current.v2 > 1 && !simStateRef.current.hit2) {
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, -15 - Math.min(simStateRef.current.v2 * 2, 45));
        ctx.stroke();
      }
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDropping, gValue, airDensity, fallHeightMeters, obj1, obj2]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/80 p-4 sm:p-5 rounded-3xl border border-emerald-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Defying Gravity Experiment
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Recreate Galileo's Tower of Pisa & Apollo 15 Moon drops! Compare free-fall kinematics across planets and vacuum.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuiz}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl text-sm font-bold bg-white text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Gravity Quiz</span>
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage (Dual Lane Drop Chamber Canvas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col items-center">
          
          {/* Comparison Scoreboard Header */}
          <div className="w-full grid grid-cols-2 gap-3 mb-3">
            {/* Lane 1 Card */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{obj1.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{obj1.name}</h4>
                  <p className="text-[10px] text-slate-500">{obj1.massKg} kg</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-extrabold text-blue-600">
                  {lane1Time !== null ? `${lane1Time.toFixed(3)} s` : isDropping ? 'Falling...' : 'Ready'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lane1Velocity > 0 ? `${lane1Velocity.toFixed(1)} km/h` : '0 km/h'}
                </div>
              </div>
            </div>

            {/* Lane 2 Card */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{obj2.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{obj2.name}</h4>
                  <p className="text-[10px] text-slate-500">{obj2.massKg} kg</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-extrabold text-pink-600">
                  {lane2Time !== null ? `${lane2Time.toFixed(3)} s` : isDropping ? 'Falling...' : 'Ready'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lane2Velocity > 0 ? `${lane2Velocity.toFixed(1)} km/h` : '0 km/h'}
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Environment Badge */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
              <span>{isCustomMode ? '🧪 Custom' : `${activePlanet.icon} ${activePlanet.name}`}</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400">{gValue.toFixed(2)} m/s²</span>
              <span className="text-slate-400">·</span>
              <span className={hasAirResistance ? 'text-amber-300' : 'text-cyan-300'}>
                {hasAirResistance ? 'Atmosphere Air' : 'Pure Vacuum'}
              </span>
            </div>
          </div>

          {/* Controls Ribbon */}
          <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={startDrop}
                disabled={isDropping && lane1Time === null && lane2Time === null}
                className="px-6 py-2.5 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer text-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Drop Both Objects!</span>
              </button>

              <button
                onClick={resetDrop}
                className="px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Height</span>
              </button>
            </div>

            {/* Vacuum Toggle */}
            <button
              onClick={() => { setHasAirResistance(!hasAirResistance); resetDrop(); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer ${
                !hasAirResistance
                  ? 'bg-cyan-100 border-cyan-400 text-cyan-900 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>{hasAirResistance ? 'Air Drag: ON' : 'Vacuum Chamber: ON'}</span>
            </button>
          </div>
        </div>

        {/* Right Parameter Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Gravitational Body Presets */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-500" />
              <span>Planetary Gravity Field</span>
            </h3>

            <div className="grid grid-cols-3 gap-1.5">
              {PLANETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPlanetId(p.id); setIsCustomMode(false); resetDrop(); }}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    !isCustomMode && selectedPlanetId === p.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-base">{p.icon}</div>
                  <div className="text-[11px] mt-0.5 truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{p.g} m/s²</div>
                </button>
              ))}
            </div>

            {/* Custom Gravity Input */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Custom Gravity Acceleration (g)</span>
                <span className="font-mono text-emerald-700">{customG.toFixed(2)} m/s²</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.1"
                value={customG}
                onChange={e => {
                  setCustomG(Number(e.target.value));
                  setIsCustomMode(true);
                  resetDrop();
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Lane Object Selectors */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Select Comparison Objects
            </h3>

            {/* Lane 1 Object */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-700">Lane 1 Object</label>
              <div className="grid grid-cols-4 gap-1.5">
                {OBJECTS.map(obj => (
                  <button
                    key={obj.id}
                    onClick={() => { setLane1ObjectId(obj.id); resetDrop(); }}
                    className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      lane1ObjectId === obj.id
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl">{obj.icon}</div>
                    <div className="text-[10px] text-slate-700 truncate">{obj.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lane 2 Object */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-pink-700">Lane 2 Object</label>
              <div className="grid grid-cols-4 gap-1.5">
                {OBJECTS.map(obj => (
                  <button
                    key={obj.id}
                    onClick={() => { setLane2ObjectId(obj.id); resetDrop(); }}
                    className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      lane2ObjectId === obj.id
                        ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-400'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl">{obj.icon}</div>
                    <div className="text-[10px] text-slate-700 truncate">{obj.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drop Chamber Height */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Drop Tower Height</span>
              <span className="font-mono text-emerald-700">{fallHeightMeters} meters</span>
            </div>
            <div className="flex gap-2">
              {[10, 25, 50, 100, 200].map(h => (
                <button
                  key={h}
                  onClick={() => { setFallHeightMeters(h); resetDrop(); }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    fallHeightMeters === h ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {h}m
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
