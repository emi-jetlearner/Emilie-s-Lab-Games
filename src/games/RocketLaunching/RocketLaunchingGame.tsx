import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Sparkles, Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { FunFactsSection } from '../../components/FunFactsSection';

type ContrailStyle = 'smoke' | 'sparkles' | 'rainbow' | 'stars';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  style: ContrailStyle;
}

const ROCKET_COLORS = [
  { id: 'purple', name: 'Pastel Purple', main: '#A855F7', accent: '#7E22CE' },
  { id: 'blue', name: 'Pastel Blue', main: '#38BDF8', accent: '#0284C7' },
  { id: 'pink', name: 'Pastel Pink', main: '#F472B6', accent: '#DB2777' },
  { id: 'green', name: 'Pastel Green', main: '#4ADE80', accent: '#16A34A' },
  { id: 'yellow', name: 'Pastel Yellow', main: '#FBBF24', accent: '#D97706' }
];

const CONTRAIL_STYLES: { id: ContrailStyle; name: string }[] = [
  { id: 'smoke', name: 'Smoke Puffs' },
  { id: 'sparkles', name: 'Sparkles' },
  { id: 'rainbow', name: 'Rainbow' },
  { id: 'stars', name: 'Stars' }
];

interface RocketLaunchingGameProps {
  onOpenQuiz: () => void;
}

export const RocketLaunchingGame: React.FC<RocketLaunchingGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Customization state
  const [rocketColorId, setRocketColorId] = useState<string>('purple');
  const [contrailStyle, setContrailStyle] = useState<ContrailStyle>('rainbow');
  
  // Propulsion and fuel dynamics: 100% fuel = exactly 20.0 seconds burn!
  const [propulsionThrust, setPropulsionThrust] = useState<number>(80); // 40 to 100
  const [fuelCapacity, setFuelCapacity] = useState<number>(80); // 20 to 100

  // Flight state
  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  const [altitude, setAltitude] = useState<number>(0);
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [apogee, setApogee] = useState<number>(0);
  const [fuelLeft, setFuelLeft] = useState<number>(80);
  const [flightStatus, setFlightStatus] = useState<'ready' | 'burning' | 'coasting' | 'apogee'>('ready');

  const activeRocketColor = ROCKET_COLORS.find(c => c.id === rocketColorId) || ROCKET_COLORS[0];

  const particlesRef = useRef<Particle[]>([]);
  const rocketPosRef = useRef<{ x: number; y: number; vy: number; alt: number }>({
    x: 0,
    y: 0,
    vy: 0,
    alt: 0
  });
  const launchTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const rainbowCycleRef = useRef<number>(0);

  // Total burn duration: 100% = 20.0 seconds = 20,000 ms
  const totalBurnDurationMs = (fuelCapacity / 100) * 20000;

  // Single Launch function
  const handleLaunch = () => {
    particlesRef.current = [];
    launchTimeRef.current = performance.now();
    setIsLaunched(true);
    setFlightStatus('burning');
    setAltitude(0);
    setSpeedKmh(0);
    setApogee(0);
    setFuelLeft(fuelCapacity);

    const canvas = canvasRef.current;
    if (canvas) {
      rocketPosRef.current = {
        x: canvas.clientWidth / 2,
        y: canvas.clientHeight - 90,
        vy: -0.8,
        alt: 0
      };
    }
  };

  // Single Reset function
  const handleReset = () => {
    particlesRef.current = [];
    setIsLaunched(false);
    setFlightStatus('ready');
    setAltitude(0);
    setSpeedKmh(0);
    setFuelLeft(fuelCapacity);

    const canvas = canvasRef.current;
    if (canvas) {
      rocketPosRef.current = {
        x: canvas.clientWidth / 2,
        y: canvas.clientHeight - 90,
        vy: 0,
        alt: 0
      };
    }
  };

  // Main Canvas Render and Flight Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isLive = true;

    const render = () => {
      if (!isLive) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        if (!isLaunched) {
          rocketPosRef.current.x = width / 2;
          rocketPosRef.current.y = height - 90;
        }
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const curAlt = rocketPosRef.current.alt;

      // Sky changes from pastel blue to deep starry sky with altitude
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (curAlt < 20000) {
        skyGrad.addColorStop(0, '#7DD3FC');
        skyGrad.addColorStop(1, '#E0F2FE');
      } else if (curAlt < 60000) {
        skyGrad.addColorStop(0, '#1E3A8A');
        skyGrad.addColorStop(1, '#38BDF8');
      } else {
        skyGrad.addColorStop(0, '#0F172A');
        skyGrad.addColorStop(1, '#1E293B');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars in high sky
      if (curAlt > 25000) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 40; i++) {
          const sx = (i * 53) % width;
          const sy = (i * 37) % (height * 0.8);
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 2) + 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Launchpad Base (visible at start)
      if (curAlt < 3000) {
        const padY = height - 60 + (curAlt / 15);
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(0, padY, width, height);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(width / 2 - 35, padY, 70, 6);
      }

      // ROCKET FLIGHT TIMING & PHYSICS
      let isEngineFiring = false;

      if (isLaunched) {
        const elapsed = performance.now() - launchTimeRef.current;

        if (elapsed < totalBurnDurationMs) {
          // ENGINE BURNING PHASE
          isEngineFiring = true;
          const remainingFraction = 1 - (elapsed / totalBurnDurationMs);
          const currentFuel = Math.max(0, Math.round(remainingFraction * fuelCapacity));
          setFuelLeft(currentFuel);
          setFlightStatus('burning');

          // Acceleration based on thrust
          const thrustAccel = (propulsionThrust / 100) * 0.22;
          rocketPosRef.current.vy = Math.max(-14, rocketPosRef.current.vy - thrustAccel);
        } else {
          // FUEL RUN OUT: COASTING TO APOGEE
          setFuelLeft(0);

          if (rocketPosRef.current.vy < -0.1) {
            setFlightStatus('coasting');
            // Gravity deceleration
            rocketPosRef.current.vy += 0.09;
          } else {
            rocketPosRef.current.vy = 0;
            setFlightStatus('apogee');
          }
        }

        // Speed calculation
        const currentSpeed = Math.round(Math.abs(rocketPosRef.current.vy) * 220);
        setSpeedKmh(currentSpeed);

        // Climb altitude
        rocketPosRef.current.alt += Math.abs(rocketPosRef.current.vy) * 45;
        const roundedAlt = Math.round(rocketPosRef.current.alt);
        setAltitude(roundedAlt);
        setApogee(prev => Math.max(prev, roundedAlt));

        // Camera scroll
        if (rocketPosRef.current.y > height * 0.45) {
          rocketPosRef.current.y += rocketPosRef.current.vy * 0.25;
        }

        // SPAWN CONTRAIL PARTICLES (Only while engine is firing!)
        if (isEngineFiring) {
          rainbowCycleRef.current += 0.12;
          const rainbowColors = ['#F472B6', '#C084FC', '#60A5FA', '#4ADE80', '#FDE047'];
          const chosenColor = contrailStyle === 'rainbow'
            ? rainbowColors[Math.floor(rainbowCycleRef.current) % rainbowColors.length]
            : activeRocketColor.main;

          const nozzleX = width / 2;
          const nozzleY = rocketPosRef.current.y + 40;

          for (let p = 0; p < 3; p++) {
            particlesRef.current.push({
              x: nozzleX + (Math.random() - 0.5) * 6,
              y: nozzleY + Math.random() * 4,
              vx: (Math.random() - 0.5) * 2,
              vy: Math.random() * 3 + 2,
              size: contrailStyle === 'smoke' ? 8 + Math.random() * 5 : 5 + Math.random() * 4,
              color: chosenColor,
              alpha: 0.9,
              style: contrailStyle
            });
          }
        }
      }

      // Render Contrail Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.018;

        if (p.alpha <= 0 || p.y > height + 20) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.style === 'smoke') {
          p.size += 0.3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.style === 'stars') {
          ctx.beginPath();
          for (let s = 0; s < 10; s++) {
            const rad = (s * Math.PI) / 5;
            const r = s % 2 === 0 ? p.size : p.size * 0.45;
            const sx = p.x + Math.sin(rad) * r;
            const sy = p.y - Math.cos(rad) * r;
            if (s === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Rocket
      const rx = width / 2;
      const ry = rocketPosRef.current.y;

      ctx.save();
      ctx.translate(rx, ry);

      // Rocket Engine Flame (Only when engine is firing!)
      if (isEngineFiring) {
        const flameLen = 25 + Math.random() * 15 * (propulsionThrust / 100);
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.moveTo(-8, 36);
        ctx.lineTo(0, 36 + flameLen);
        ctx.lineTo(8, 36);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.moveTo(-5, 36);
        ctx.lineTo(0, 36 + flameLen * 0.6);
        ctx.lineTo(5, 36);
        ctx.closePath();
        ctx.fill();
      }

      // Fins
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(-12, 16);
      ctx.lineTo(-26, 36);
      ctx.lineTo(-12, 32);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(12, 16);
      ctx.lineTo(26, 36);
      ctx.lineTo(12, 32);
      ctx.closePath();
      ctx.fill();

      // Body Fuselage
      ctx.fillStyle = activeRocketColor.main;
      ctx.beginPath();
      ctx.roundRect(-12, -22, 24, 58, [0, 0, 4, 4]);
      ctx.fill();

      // Nosecone
      ctx.fillStyle = activeRocketColor.accent;
      ctx.beginPath();
      ctx.moveTo(-12, -22);
      ctx.lineTo(0, -48);
      ctx.lineTo(12, -22);
      ctx.closePath();
      ctx.fill();

      // Porthole Window
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, -5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(0, -5, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      isLive = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isLaunched, propulsionThrust, contrailStyle, activeRocketColor, fuelCapacity, totalBurnDurationMs]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner (Clean, no duplicate quiz button) */}
      <div className="bg-[#FEF9C3] p-5 rounded-3xl border border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">
              Rocket Launching
            </h2>
            <p className="text-xs sm:text-sm text-amber-800">
              Customize your rocket, choose your contrail style, and launch into the sky!
            </p>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs flex flex-col items-center">
          
          {/* Telemetry Dashboard */}
          <div className="w-full grid grid-cols-4 gap-2 mb-3">
            <div className="bg-[#FEFCE8] p-2.5 rounded-xl border border-amber-100 text-center">
              <span className="text-[10px] text-amber-700 font-bold block">ALTITUDE</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {(altitude / 1000).toFixed(1)} km
              </span>
            </div>
            <div className="bg-[#FEFCE8] p-2.5 rounded-xl border border-amber-100 text-center">
              <span className="text-[10px] text-amber-700 font-bold block">SPEED</span>
              <span className="text-xs sm:text-sm font-black text-purple-700">
                {speedKmh} km/h
              </span>
            </div>
            <div className="bg-[#FEFCE8] p-2.5 rounded-xl border border-amber-100 text-center">
              <span className="text-[10px] text-amber-700 font-bold block">FUEL LEFT</span>
              <span className="text-xs sm:text-sm font-black text-amber-600">
                {fuelLeft}%
              </span>
            </div>
            <div className="bg-[#FEFCE8] p-2.5 rounded-xl border border-amber-100 text-center">
              <span className="text-[10px] text-amber-700 font-bold block">PEAK APOGEE</span>
              <span className="text-xs sm:text-sm font-black text-sky-700">
                {(apogee / 1000).toFixed(1)} km
              </span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Flight status banner overlay */}
            {isLaunched && (
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-amber-200 shadow-md text-xs font-bold flex items-center gap-2">
                {flightStatus === 'burning' && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-amber-900 font-black">Engines Firing! ({((totalBurnDurationMs / 1000) * (fuelLeft / fuelCapacity)).toFixed(1)}s burn left)</span>
                  </>
                )}
                {flightStatus === 'coasting' && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-purple-900 font-black">Fuel Depleted · Coasting to Apogee...</span>
                  </>
                )}
                {flightStatus === 'apogee' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-900 font-black">Apogee Reached! Peak Altitude Achieved!</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Single Launch / Reset Button */}
          <div className="w-full mt-4 flex items-center justify-between gap-3">
            {!isLaunched ? (
              <button
                onClick={handleLaunch}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-xs text-xs sm:text-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Rocket!</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Back to Launchpad</span>
              </button>
            )}

            <span className="text-xs text-slate-500">
              Contrail: <strong className="text-purple-700 capitalize">{contrailStyle}</strong>
            </span>
          </div>
        </div>

        {/* Right Configuration Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Propulsion & Fuel Dynamics */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Propulsion & Fuel Dynamics
            </h3>

            {/* Thrust Power */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Engine Propulsion (Thrust)</span>
                <span className="font-mono text-amber-700">{propulsionThrust}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={propulsionThrust}
                onChange={(e) => setPropulsionThrust(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Higher propulsion accelerates your rocket faster into high orbit!
              </p>
            </div>

            {/* Fuel Mass - fully draggable slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Fuel Tank Size</span>
                <span className="font-mono text-purple-700">
                  {fuelCapacity}% ({(20 * (fuelCapacity / 100)).toFixed(1)}s burn)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={fuelCapacity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFuelCapacity(val);
                  if (!isLaunched) {
                    setFuelLeft(val);
                  }
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                100% fuel burns for exactly 20 seconds. Lower fuel cuts engines sooner!
              </p>
            </div>
          </div>

          {/* Contrail Style */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Contrail Style
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CONTRAIL_STYLES.map(st => (
                <button
                  key={st.id}
                  onClick={() => setContrailStyle(st.id)}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                    contrailStyle === st.id
                      ? 'border-amber-500 bg-[#FEF9C3] text-amber-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rocket Color */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Rocket Color
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {ROCKET_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setRocketColorId(c.id)}
                  className={`h-9 rounded-xl transition-all cursor-pointer ${
                    rocketColorId === c.id ? 'ring-3 ring-amber-500 scale-105' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.main }}
                />
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Fun Facts Area with Quiz Button directly beneath */}
      <FunFactsSection gameId="rocket-launching" onOpenQuiz={onOpenQuiz} />

    </div>
  );
};

