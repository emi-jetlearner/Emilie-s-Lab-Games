import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Sparkles, HelpCircle, Play, RotateCcw, Compass, ArrowUp, Star } from 'lucide-react';

type ContrailStyle = 'smoke' | 'sparkles' | 'rainbow' | 'stars';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotSpeed: number;
  style: ContrailStyle;
}

const ROCKET_COLORS = [
  { id: 'coral', name: 'Coral Red', main: '#EF4444', accent: '#DC2626' },
  { id: 'mint', name: 'Mint Emerald', main: '#10B981', accent: '#059669' },
  { id: 'cosmic', name: 'Cosmic Purple', main: '#8B5CF6', accent: '#7C3AED' },
  { id: 'solar', name: 'Solar Yellow', main: '#F59E0B', accent: '#D97706' },
  { id: 'ocean', name: 'Ocean Cyan', main: '#06B6D4', accent: '#0891B2' },
  { id: 'pearl', name: 'Pearl White', main: '#F8FAFC', accent: '#CBD5E1' }
];

const CONTRAIL_COLORS = [
  { id: 'white', name: 'Cloud White', hex: '#FFFFFF' },
  { id: 'fire', name: 'Fiery Orange', hex: '#F97316' },
  { id: 'cyan', name: 'Neon Cyan', hex: '#22D3EE' },
  { id: 'pink', name: 'Magic Pink', hex: '#F472B6' },
  { id: 'golden', name: 'Goldenrod', hex: '#FBBF24' },
  { id: 'lavender', name: 'Lavender', hex: '#C084FC' }
];

const CONTRAIL_STYLES: { id: ContrailStyle; name: string; description: string }[] = [
  { id: 'smoke', name: 'Billowing Smoke', description: 'Expansive soft condensation cloud puffs' },
  { id: 'sparkles', name: 'Glitter Sparkles', description: 'Twinkling incandescent diamond embers' },
  { id: 'rainbow', name: 'Rainbow Spectrum', description: 'Vibrant shifting chromatic particles' },
  { id: 'stars', name: 'Twinkling Stars', description: 'Spinning 5-point celestial mini-stars' }
];

interface RocketLaunchingGameProps {
  onOpenQuiz: () => void;
}

export const RocketLaunchingGame: React.FC<RocketLaunchingGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rocket Customization State
  const [rocketColorId, setRocketColorId] = useState<string>('coral');
  const [finColorId, setFinColorId] = useState<string>('ocean');
  const [contrailStyle, setContrailStyle] = useState<ContrailStyle>('smoke');
  const [contrailColorId, setContrailColorId] = useState<string>('fire');
  const [thrustPower, setThrustPower] = useState<number>(85); // 50 to 100%
  const [fuelCapacity, setFuelCapacity] = useState<number>(80); // 30 to 100

  // Launch Status State
  const [launchStatus, setLaunchStatus] = useState<'pad' | 'launching' | 'apogee' | 'orbit'>('pad');
  const [altitude, setAltitude] = useState<number>(0); // in meters / km
  const [velocity, setVelocity] = useState<number>(0); // km/h
  const [maxApogee, setMaxApogee] = useState<number>(0);
  const [fuelRemaining, setFuelRemaining] = useState<number>(fuelCapacity);

  const activeRocketColor = ROCKET_COLORS.find(c => c.id === rocketColorId) || ROCKET_COLORS[0];
  const activeFinColor = ROCKET_COLORS.find(c => c.id === finColorId) || ROCKET_COLORS[4];
  const activeContrailColor = CONTRAIL_COLORS.find(c => c.id === contrailColorId) || CONTRAIL_COLORS[1];

  // Particle tracking
  const particlesRef = useRef<Particle[]>([]);
  const rocketPosRef = useRef<{ x: number; y: number; vy: number; altitude: number }>({
    x: 0,
    y: 0,
    vy: 0,
    altitude: 0
  });
  const animFrameRef = useRef<number>(0);
  const colorCycleRef = useRef<number>(0);

  // Launch trigger
  const handleLaunch = () => {
    // Clear old particles when starting a new launch
    particlesRef.current = [];
    setLaunchStatus('launching');
    setAltitude(0);
    setVelocity(0);
    setMaxApogee(0);
    setFuelRemaining(fuelCapacity);

    const canvas = canvasRef.current;
    if (canvas) {
      rocketPosRef.current = {
        x: canvas.clientWidth / 2,
        y: canvas.clientHeight - 100,
        vy: -0.5,
        altitude: 0
      };
    }
  };

  // Reset launchpad
  const handleReset = () => {
    // Clear all particles
    particlesRef.current = [];
    setLaunchStatus('pad');
    setAltitude(0);
    setVelocity(0);
    setFuelRemaining(fuelCapacity);

    const canvas = canvasRef.current;
    if (canvas) {
      rocketPosRef.current = {
        x: canvas.clientWidth / 2,
        y: canvas.clientHeight - 100,
        vy: 0,
        altitude: 0
      };
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        if (launchStatus === 'pad') {
          rocketPosRef.current.x = width / 2;
          rocketPosRef.current.y = height - 100;
        }
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const alt = rocketPosRef.current.altitude;

      // 1. Sky Gradient Shifting with Altitude (Troposphere -> Space)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (alt < 15000) {
        // Lower Troposphere
        const factor = alt / 15000;
        skyGrad.addColorStop(0, '#38BDF8');
        skyGrad.addColorStop(1, '#E0F2FE');
      } else if (alt < 50000) {
        // Stratosphere
        skyGrad.addColorStop(0, '#1E3A8A');
        skyGrad.addColorStop(0.7, '#3B82F6');
        skyGrad.addColorStop(1, '#93C5FD');
      } else if (alt < 100000) {
        // Mesosphere into Kármán Line
        skyGrad.addColorStop(0, '#0F172A');
        skyGrad.addColorStop(0.6, '#1E293B');
        skyGrad.addColorStop(1, '#1E3A8A');
      } else {
        // Space Orbit
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(1, '#0F172A');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield in upper atmosphere and space
      if (alt > 20000) {
        const starAlpha = Math.min((alt - 20000) / 40000, 0.9);
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        for (let s = 0; s < 50; s++) {
          const sx = (s * 47) % width;
          const sy = (s * 31) % (height * 0.7);
          ctx.beginPath();
          ctx.arc(sx, sy, (s % 3) + 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Launchpad Ground & Gantry (visible at low altitudes)
      if (alt < 3000) {
        const groundScreenY = height - 70 + (alt / 15);
        // Concrete Pad
        ctx.fillStyle = '#64748B';
        ctx.fillRect(0, groundScreenY, width, height);

        // Pad markings
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(width / 2 - 40, groundScreenY, 80, 6);

        // Gantry Launch Tower
        const gantryX = width / 2 - 70;
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(gantryX, groundScreenY - 140, 24, 140);
        // Cross bracing
        for (let gy = groundScreenY - 140; gy < groundScreenY; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(gantryX, gy);
          ctx.lineTo(gantryX + 24, gy + 24);
          ctx.moveTo(gantryX + 24, gy);
          ctx.lineTo(gantryX, gy + 24);
          ctx.stroke();
        }
      }

      // 3. CONTRAIL PARTICLES ANIMATION & RENDERING
      // Update and draw existing particles
      colorCycleRef.current += 0.08;

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.016; // gradual natural fade

        if (p.alpha <= 0 || p.y > height + 50) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.style === 'smoke') {
          // Billowing soft expanding smoke
          p.size += 0.45;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.style === 'sparkles') {
          // Glittering Diamond Cross Sparkles
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(0, 0, p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.size);
          ctx.quadraticCurveTo(0, 0, -p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.size);
          ctx.fill();
        } else if (p.style === 'rainbow') {
          // Chromatic soft glowing circles
          p.size += 0.35;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 5-Point Twinkling Star
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          const spikes = 5;
          const outerR = p.size;
          const innerR = p.size * 0.45;
          for (let s = 0; s < spikes * 2; s++) {
            const rad = (s * Math.PI) / spikes;
            const r = s % 2 === 0 ? outerR : innerR;
            const x = Math.sin(rad) * r;
            const y = -Math.cos(rad) * r;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // 4. ROCKET POSITION & LAUNCH SIMULATION
      const rx = width / 2;
      let ry = rocketPosRef.current.y;

      if (launchStatus === 'launching') {
        // Accelerate rocket upward
        const thrustAccel = (thrustPower / 100) * 0.45;
        rocketPosRef.current.vy -= thrustAccel;

        // Update fuel
        setFuelRemaining(prev => {
          const nextFuel = prev - 0.2;
          if (nextFuel <= 0) {
            setLaunchStatus(rocketPosRef.current.altitude > 80000 ? 'orbit' : 'apogee');
            return 0;
          }
          return nextFuel;
        });

        // Advance Altitude & Velocity
        const currentSpeedKmh = Math.abs(rocketPosRef.current.vy) * 280;
        setVelocity(currentSpeedKmh);

        rocketPosRef.current.altitude += Math.abs(rocketPosRef.current.vy) * 45;
        setAltitude(Math.round(rocketPosRef.current.altitude));
        setMaxApogee(prev => Math.max(prev, Math.round(rocketPosRef.current.altitude)));

        // Camera tracking: keep rocket comfortably centered in view
        if (ry > height * 0.45) {
          rocketPosRef.current.y += rocketPosRef.current.vy * 0.4;
          ry = rocketPosRef.current.y;
        }

        // SPAWN CONTRAIL PARTICLES BEHIND ROCKET NOZZLE
        const nozzleX = rx;
        const nozzleY = ry + 42; // bottom of rocket

        // Determine particle color based on contrail style and color selection
        let spawnColor = activeContrailColor.hex;
        if (contrailStyle === 'rainbow') {
          const rainbowColors = ['#EF4444', '#F97316', '#FBBF24', '#10B981', '#06B6D4', '#8B5CF6', '#EC4899'];
          const colIdx = Math.floor(colorCycleRef.current) % rainbowColors.length;
          spawnColor = rainbowColors[colIdx];
        }

        // Emit particles
        const particleCount = contrailStyle === 'smoke' ? 3 : 4;
        for (let k = 0; k < particleCount; k++) {
          particlesRef.current.push({
            x: nozzleX + (Math.random() - 0.5) * 8,
            y: nozzleY + Math.random() * 6,
            vx: (Math.random() - 0.5) * 2.5,
            vy: Math.random() * 3 + 2, // flow backward/downward
            size: contrailStyle === 'smoke' ? 8 + Math.random() * 5 : 5 + Math.random() * 4,
            color: spawnColor,
            alpha: 0.9,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.15,
            style: contrailStyle
          });
        }
      }

      // 5. DRAW DETAILED ROCKET MODEL
      ctx.save();
      ctx.translate(rx, ry);

      // Rocket Engine Flame (when engines are firing)
      if (launchStatus === 'launching' && fuelRemaining > 0) {
        ctx.save();
        const flameLength = 28 + Math.random() * 18 * (thrustPower / 100);
        const flameGrad = ctx.createLinearGradient(0, 36, 0, 36 + flameLength);
        flameGrad.addColorStop(0, '#FFFFFF');
        flameGrad.addColorStop(0.3, '#FEF08A');
        flameGrad.addColorStop(0.7, '#F97316');
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-10, 38);
        ctx.quadraticCurveTo(0, 38 + flameLength * 1.3, 0, 38 + flameLength);
        ctx.quadraticCurveTo(0, 38 + flameLength * 1.3, 10, 38);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Left & Right Aerodynamic Fins
      ctx.fillStyle = activeFinColor.main;
      ctx.beginPath();
      ctx.moveTo(-14, 15);
      ctx.lineTo(-30, 38);
      ctx.lineTo(-14, 34);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(14, 15);
      ctx.lineTo(30, 38);
      ctx.lineTo(14, 34);
      ctx.closePath();
      ctx.fill();

      // Main Cylindrical Rocket Body
      const bodyGrad = ctx.createLinearGradient(-15, 0, 15, 0);
      bodyGrad.addColorStop(0, activeRocketColor.accent);
      bodyGrad.addColorStop(0.3, activeRocketColor.main);
      bodyGrad.addColorStop(0.7, '#FFFFFF');
      bodyGrad.addColorStop(1, activeRocketColor.accent);

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-14, -25, 28, 62, [0, 0, 4, 4]);
      ctx.fill();

      // Conical Aerodynamic Nosecone
      ctx.fillStyle = activeFinColor.main;
      ctx.beginPath();
      ctx.moveTo(-14, -25);
      ctx.quadraticCurveTo(0, -56, 0, -58);
      ctx.quadraticCurveTo(0, -56, 14, -25);
      ctx.closePath();
      ctx.fill();

      // Mission Decal / Porthole
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(0, -6, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Engine Nozzle Bell
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(-8, 37);
      ctx.lineTo(-11, 44);
      ctx.lineTo(11, 44);
      ctx.lineTo(8, 37);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [launchStatus, contrailStyle, activeContrailColor, activeRocketColor, activeFinColor, thrustPower, fuelRemaining, fuelCapacity]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/80 p-4 sm:p-5 rounded-3xl border border-blue-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Rocket className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rocket Launching & Contrail Physics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Customize rocket stages, choose contrails (smoke, sparkles, rainbow, or stars), and launch into orbit!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuiz}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl text-sm font-bold bg-white text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Aerospace Quiz</span>
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage (Launchpad Canvas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col items-center">
          
          {/* Telemetry Dashboard */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Altitude</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 tabular-nums">
                {(altitude / 1000).toFixed(1)} km
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Velocity</span>
              <span className="text-sm sm:text-base font-extrabold text-blue-600 tabular-nums">
                {velocity.toFixed(0)} km/h
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Apogee Record</span>
              <span className="text-sm sm:text-base font-extrabold text-purple-600 tabular-nums">
                {(maxApogee / 1000).toFixed(1)} km
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Fuel Remaining</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-600 tabular-nums">
                {fuelRemaining.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[380px] sm:h-[460px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Atmospheric Layer Badge Overlay */}
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
              Layer: {altitude < 12000 ? 'Troposphere' : altitude < 50000 ? 'Stratosphere' : altitude < 85000 ? 'Mesosphere' : 'Kármán Line / Space Orbit'}
            </div>
          </div>

          {/* Controls Ribbon */}
          <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {launchStatus === 'pad' ? (
                <button
                  onClick={handleLaunch}
                  className="px-6 py-2.5 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Rocket!</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-slate-700 hover:bg-slate-800 shadow flex items-center gap-2 active:scale-95 transition-all cursor-pointer text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Return to Launchpad</span>
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Contrail: <strong className="text-blue-700 capitalize">{contrailStyle}</strong> ({activeContrailColor.name})
            </div>
          </div>
        </div>

        {/* Right Configuration Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Contrail Style Customizer (Smoke, Sparkles, Rainbow, Stars) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Contrail Style (Exhaust Physics)</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {CONTRAIL_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setContrailStyle(style.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    contrailStyle === style.id
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{style.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{style.description}</div>
                </button>
              ))}
            </div>

            {/* Contrail Color Palette */}
            {contrailStyle !== 'rainbow' ? (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700">Contrail Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {CONTRAIL_COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setContrailColorId(c.id)}
                      title={c.name}
                      className={`h-9 rounded-xl border-2 transition-transform cursor-pointer ${
                        contrailColorId === c.id ? 'border-blue-600 scale-110 shadow-sm' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-purple-700 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                Rainbow mode automatically shifts through the full visible light spectrum!
              </p>
            )}
          </div>

          {/* Rocket Aesthetic Customizer */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-500" />
              <span>Rocket Fuselage & Fin Colors</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Fuselage Body Color</label>
              <div className="grid grid-cols-6 gap-2">
                {ROCKET_COLORS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setRocketColorId(c.id)}
                    title={c.name}
                    className={`h-8 rounded-xl border-2 transition-transform cursor-pointer ${
                      rocketColorId === c.id ? 'border-blue-600 scale-110 shadow' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: c.main }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700">Stabilizer Fins & Nosecone</label>
              <div className="grid grid-cols-6 gap-2">
                {ROCKET_COLORS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFinColorId(c.id)}
                    title={c.name}
                    className={`h-8 rounded-xl border-2 transition-transform cursor-pointer ${
                      finColorId === c.id ? 'border-blue-600 scale-110 shadow' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: c.main }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Engine Propulsion Settings */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Propulsion & Fuel Dynamics
            </h3>

            {/* Thrust */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Engine Thrust Throttle</span>
                <span className="font-mono text-blue-600">{thrustPower}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={thrustPower}
                onChange={e => setThrustPower(Number(e.target.value))}
                disabled={launchStatus === 'launching'}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Fuel Mass */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Liquid Propellant Mass</span>
                <span className="font-mono text-indigo-600">{fuelCapacity}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={fuelCapacity}
                onChange={e => {
                  setFuelCapacity(Number(e.target.value));
                  setFuelRemaining(Number(e.target.value));
                }}
                disabled={launchStatus === 'launching'}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
