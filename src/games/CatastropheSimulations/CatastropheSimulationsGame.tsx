import React, { useState, useEffect, useRef } from 'react';
import { Flame, Waves, Activity, HelpCircle, Play, RotateCcw, AlertTriangle, Wind, Gauge } from 'lucide-react';

type DisasterType = 'volcano' | 'tsunami' | 'earthquake';

interface AshParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

interface LavaDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  temperature: number;
}

interface DebrisParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  color: string;
}

interface CatastropheSimulationsGameProps {
  onOpenQuiz: () => void;
}

export const CatastropheSimulationsGame: React.FC<CatastropheSimulationsGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Disaster
  const [disaster, setDisaster] = useState<DisasterType>('volcano');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Volcano Parameters
  const [magmaViscosity, setMagmaViscosity] = useState<number>(65); // 10 (low/runny) to 100 (high/explosive)
  const [gasPressure, setGasPressure] = useState<number>(75); // 10 to 100
  const [lavaProgress, setLavaProgress] = useState<number>(0);

  // Tsunami Parameters
  const [tsunamiMagnitude, setTsunamiMagnitude] = useState<number>(8.2); // 6.5 to 9.5
  const [oceanDepth, setOceanDepth] = useState<number>(4000); // meters
  const [wavePhase, setWavePhase] = useState<number>(0); // 0 to 1

  // Earthquake Parameters
  const [richterMagnitude, setRichterMagnitude] = useState<number>(7.5); // 3.0 to 9.5
  const [faultDepth, setFaultDepth] = useState<number>(12); // km
  const [soilType, setSoilType] = useState<'bedrock' | 'sand' | 'clay'>('clay');
  const [shakeIntensity, setShakeIntensity] = useState<number>(0);

  // Animation particles
  const particlesRef = useRef<AshParticle[]>([]);
  const lavaDropsRef = useRef<LavaDrop[]>([]);
  const debrisRef = useRef<DebrisParticle[]>([]);
  const crackProgressRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const simTimerRef = useRef<number>(0);

  const startSimulation = () => {
    setIsRunning(true);
    simTimerRef.current = 0;
    setLavaProgress(0);
    setWavePhase(0);
    crackProgressRef.current = 0;
    particlesRef.current = [];
    lavaDropsRef.current = [];
    debrisRef.current = [];
  };

  const resetSimulation = () => {
    setIsRunning(false);
    simTimerRef.current = 0;
    setLavaProgress(0);
    setWavePhase(0);
    setShakeIntensity(0);
    crackProgressRef.current = 0;
    particlesRef.current = [];
    lavaDropsRef.current = [];
    debrisRef.current = [];
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const render = () => {
      if (!active) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Camera Shake for Earthquake
      let shakeOffsetX = 0;
      let shakeOffsetY = 0;
      if (isRunning && disaster === 'earthquake') {
        const soilMultiplier = soilType === 'clay' ? 1.6 : soilType === 'sand' ? 1.3 : 0.8;
        const currentShake = Math.sin(simTimerRef.current * 0.4) * (richterMagnitude - 2) * soilMultiplier;
        setShakeIntensity(Math.abs(currentShake));
        shakeOffsetX = (Math.random() - 0.5) * currentShake * 3;
        shakeOffsetY = (Math.random() - 0.5) * currentShake * 3;
      } else {
        setShakeIntensity(0);
      }

      ctx.translate(shakeOffsetX, shakeOffsetY);
      ctx.clearRect(-10, -10, width + 20, height + 20);

      // 1. Sky & Atmospheric Backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (disaster === 'volcano' && isRunning) {
        skyGrad.addColorStop(0, '#451A03');
        skyGrad.addColorStop(0.5, '#78350F');
        skyGrad.addColorStop(1, '#FEF3C7');
      } else if (disaster === 'tsunami' && isRunning) {
        skyGrad.addColorStop(0, '#1E293B');
        skyGrad.addColorStop(0.6, '#334155');
        skyGrad.addColorStop(1, '#94A3B8');
      } else {
        skyGrad.addColorStop(0, '#BAE6FD');
        skyGrad.addColorStop(0.7, '#E0F2FE');
        skyGrad.addColorStop(1, '#F0FDF4');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(-10, -10, width + 20, height + 20);

      // Landscape Geometry Points
      const volcanoPeakX = width * 0.32;
      const volcanoPeakY = height * 0.35;
      const coastlineX = width * 0.68;
      const groundY = height * 0.72;

      // 2. Distant Hills & Mountains
      ctx.fillStyle = '#A7F3D0';
      ctx.beginPath();
      ctx.moveTo(0, groundY - 40);
      ctx.quadraticCurveTo(width * 0.15, groundY - 90, width * 0.3, groundY - 40);
      ctx.lineTo(width * 0.3, groundY);
      ctx.lineTo(0, groundY);
      ctx.fill();

      // 3. Volcanic Mountain Cone
      ctx.save();
      const mountainGrad = ctx.createLinearGradient(volcanoPeakX, volcanoPeakY, volcanoPeakX, groundY);
      mountainGrad.addColorStop(0, '#334155');
      mountainGrad.addColorStop(0.4, '#475569');
      mountainGrad.addColorStop(1, '#1E293B');
      ctx.fillStyle = mountainGrad;
      ctx.beginPath();
      ctx.moveTo(volcanoPeakX - 110, groundY);
      ctx.lineTo(volcanoPeakX - 35, volcanoPeakY + 8);
      // Caldera Crater Rim
      ctx.lineTo(volcanoPeakX + 35, volcanoPeakY + 8);
      ctx.lineTo(volcanoPeakX + 130, groundY);
      ctx.closePath();
      ctx.fill();

      // Caldera Glow inside rim
      if (disaster === 'volcano') {
        const glowGrad = ctx.createRadialGradient(volcanoPeakX, volcanoPeakY + 12, 4, volcanoPeakX, volcanoPeakY + 12, 40);
        glowGrad.addColorStop(0, '#FEF08A');
        glowGrad.addColorStop(0.5, '#EF4444');
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.ellipse(volcanoPeakX, volcanoPeakY + 8, 36, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Ground Terrain (Coastal Plains & Beach)
      ctx.save();
      const terrainGrad = ctx.createLinearGradient(0, groundY, 0, height);
      terrainGrad.addColorStop(0, '#86EFAC'); // lush grass
      terrainGrad.addColorStop(0.5, '#4ADE80');
      terrainGrad.addColorStop(1, '#22C55E');
      ctx.fillStyle = terrainGrad;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(coastlineX, groundY);
      // Sandy Beach Slope
      ctx.quadraticCurveTo(coastlineX + 30, groundY + 15, coastlineX + 60, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Sand Beach Strip
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.moveTo(coastlineX - 15, groundY);
      ctx.lineTo(coastlineX, groundY);
      ctx.quadraticCurveTo(coastlineX + 35, groundY + 15, coastlineX + 70, height);
      ctx.lineTo(coastlineX + 30, height);
      ctx.quadraticCurveTo(coastlineX + 10, groundY + 15, coastlineX - 15, groundY);
      ctx.fill();
      ctx.restore();

      // 5. Earthquake Fault Fissure Line
      if (disaster === 'earthquake' && crackProgressRef.current > 0) {
        ctx.save();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = Math.min(crackProgressRef.current * 0.1, 8);
        ctx.beginPath();
        ctx.moveTo(width * 0.42, groundY);
        ctx.lineTo(width * 0.46, groundY + 25);
        ctx.lineTo(width * 0.44, groundY + 55);
        ctx.lineTo(width * 0.50, groundY + 90);
        ctx.lineTo(width * 0.48, height);
        ctx.stroke();

        // Secondary jagged cracks
        ctx.lineWidth = Math.min(crackProgressRef.current * 0.05, 4);
        ctx.beginPath();
        ctx.moveTo(width * 0.46, groundY + 25);
        ctx.lineTo(width * 0.52, groundY + 35);
        ctx.moveTo(width * 0.44, groundY + 55);
        ctx.lineTo(width * 0.38, groundY + 70);
        ctx.stroke();
        ctx.restore();
      }

      // 6. 3D Isometric-styled Trees and Coastal Buildings
      const drawHouse = (hx: number, hy: number, color: string, roofColor: string, damageFactor: number = 0) => {
        ctx.save();
        ctx.translate(hx, hy);
        if (damageFactor > 0.4) {
          ctx.rotate((Math.random() - 0.5) * damageFactor * 0.3);
        }

        // Base box
        ctx.fillStyle = color;
        ctx.fillRect(-18, -26, 36, 26);

        // Door & Window
        ctx.fillStyle = '#475569';
        ctx.fillRect(-6, -16, 12, 16);
        ctx.fillStyle = '#93C5FD';
        ctx.fillRect(-14, -22, 6, 6);
        ctx.fillRect(8, -22, 6, 6);

        // Roof
        ctx.fillStyle = roofColor;
        ctx.beginPath();
        ctx.moveTo(-22, -26);
        ctx.lineTo(0, -42 - (damageFactor > 0.6 ? 5 : 0));
        ctx.lineTo(22, -26);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      const drawTree = (tx: number, ty: number) => {
        ctx.save();
        ctx.fillStyle = '#78350F';
        ctx.fillRect(tx - 3, ty - 12, 6, 12);
        ctx.fillStyle = '#15803D';
        ctx.beginPath();
        ctx.arc(tx, ty - 18, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      // Draw peaceful settlement objects
      const eqDamage = disaster === 'earthquake' && isRunning ? (richterMagnitude - 4) / 5 : 0;
      drawHouse(width * 0.18, groundY, '#FFFFFF', '#EF4444', eqDamage);
      drawHouse(width * 0.52, groundY, '#FEF08A', '#3B82F6', eqDamage);
      drawHouse(width * 0.60, groundY + 12, '#FFFFFF', '#10B981', eqDamage);

      drawTree(width * 0.12, groundY);
      drawTree(width * 0.24, groundY);
      drawTree(width * 0.48, groundY);
      drawTree(width * 0.56, groundY + 6);

      // Lighthouse at Coastal Edge
      const lhX = coastlineX + 15;
      const lhY = groundY;
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(lhX - 10, lhY);
      ctx.lineTo(lhX - 6, lhY - 45);
      ctx.lineTo(lhX + 6, lhY - 45);
      ctx.lineTo(lhX + 10, lhY);
      ctx.closePath();
      ctx.fill();
      // Red stripes
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(lhX - 8, lhY - 32, 16, 7);
      ctx.fillRect(lhX - 9, lhY - 14, 18, 7);
      // Lantern
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(lhX, lhY - 48, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. OCEAN & TSUNAMI SIMULATION
      const seaBedY = groundY + 10;
      const oceanWidth = width - coastlineX;

      if (disaster === 'tsunami' && isRunning) {
        // Tsunami Wave Physics
        // Stage 1: Drawback (water recedes from beach)
        // Stage 2: Towering Surge floods inland
        const phase = wavePhase; // 0 to 1
        let waterLevelX = coastlineX + 45;
        let waveCrestHeight = 0;

        if (phase < 0.3) {
          // Drawback! Sea pulls back, exposing seabed
          waterLevelX = coastlineX + 45 + (phase / 0.3) * 60;
        } else {
          // Surge! Massive wave rushes left over the beach and houses
          const surgeRatio = (phase - 0.3) / 0.7;
          waterLevelX = (coastlineX + 105) - surgeRatio * (width * 0.45);
          waveCrestHeight = Math.sin(surgeRatio * Math.PI) * (tsunamiMagnitude * 7);
        }

        // Draw Water Body
        ctx.save();
        const waterGrad = ctx.createLinearGradient(waterLevelX, groundY, width, height);
        waterGrad.addColorStop(0, '#0284C7');
        waterGrad.addColorStop(0.5, '#0369A1');
        waterGrad.addColorStop(1, '#075985');
        ctx.fillStyle = waterGrad;

        ctx.beginPath();
        ctx.moveTo(width + 10, groundY - waveCrestHeight);
        // Tsunami Wave Crest Curve
        ctx.quadraticCurveTo(waterLevelX + 30, groundY - waveCrestHeight * 1.3, waterLevelX, groundY + 15);
        ctx.lineTo(waterLevelX, height);
        ctx.lineTo(width + 10, height);
        ctx.closePath();
        ctx.fill();

        // White Sea Foam & Spray along the leading wave edge
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(waterLevelX + 10, groundY - waveCrestHeight * 0.9, 20, 8, -0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

      } else {
        // Normal Calm Ocean
        ctx.save();
        const seaGrad = ctx.createLinearGradient(coastlineX, seaBedY, width, height);
        seaGrad.addColorStop(0, '#38BDF8');
        seaGrad.addColorStop(1, '#0284C7');
        ctx.fillStyle = seaGrad;
        ctx.beginPath();
        ctx.moveTo(coastlineX + 35, seaBedY);
        ctx.quadraticCurveTo(coastlineX + 45, seaBedY + 15, coastlineX + 60, height);
        ctx.lineTo(width + 10, height);
        ctx.lineTo(width + 10, seaBedY);
        ctx.closePath();
        ctx.fill();

        // Gentle shore ripples
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(coastlineX + 40, seaBedY + 15);
        ctx.lineTo(coastlineX + 70, seaBedY + 25);
        ctx.stroke();
        ctx.restore();
      }

      // 8. VOLCANO ERUPTION SIMULATION: Glowing Branching Lava & Ash
      if (disaster === 'volcano' && isRunning) {
        ctx.save();

        // Advance lava progress down slope
        const flowSpeed = (1 - magmaViscosity / 150) * 0.005;
        setLavaProgress(prev => Math.min(prev + flowSpeed, 1));

        // Draw Molten Branching Lava Rivers
        const maxLavaY = volcanoPeakY + 8 + lavaProgress * (groundY - volcanoPeakY);

        const drawLavaBranch = (startX: number, startY: number, endX: number, endY: number, width: number) => {
          ctx.strokeStyle = '#EF4444';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 14;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo((startX + endX) / 2 + 10, (startY + endY) / 2, endX, endY);
          ctx.stroke();

          // Core Hot Yellow/White Stream
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = width * 0.4;
          ctx.stroke();
        };

        // Main Lava Channel Down Left Flank
        drawLavaBranch(volcanoPeakX - 10, volcanoPeakY + 8, volcanoPeakX - 50 * lavaProgress, maxLavaY, 8);
        // Branch 2 Down Right Flank
        if (lavaProgress > 0.3) {
          drawLavaBranch(volcanoPeakX + 10, volcanoPeakY + 12, volcanoPeakX + 40 * lavaProgress, maxLavaY - 10, 6);
        }

        // Spawn Eruption Ash & Smoke Plumes
        if (Math.random() < (gasPressure / 100) * 0.9) {
          particlesRef.current.push({
            x: volcanoPeakX + (Math.random() - 0.5) * 20,
            y: volcanoPeakY + 5,
            vx: (Math.random() - 0.5) * 3 + 1.2, // slight wind drift to right
            vy: -(Math.random() * 4 + 3),
            size: 6 + Math.random() * 12,
            color: Math.random() > 0.3 ? '#475569' : '#1E293B',
            alpha: 0.8,
            life: 0
          });
        }

        // Spawn Volcanic Incandescent Bombs (sparks)
        if (Math.random() < 0.4) {
          lavaDropsRef.current.push({
            x: volcanoPeakX + (Math.random() - 0.5) * 16,
            y: volcanoPeakY + 5,
            vx: (Math.random() - 0.5) * 5,
            vy: -(Math.random() * 6 + 5),
            radius: 2.5 + Math.random() * 2,
            temperature: 1200
          });
        }

        // Render Ash Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.size += 0.4;
          p.alpha -= 0.008;
          p.life++;

          if (p.alpha <= 0 || p.y < -20) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Render Incandescent Lava Bombs
        for (let i = lavaDropsRef.current.length - 1; i >= 0; i--) {
          const b = lavaDropsRef.current[i];
          b.vy += 0.2; // gravity
          b.x += b.vx;
          b.y += b.vy;

          if (b.y > groundY) {
            lavaDropsRef.current.splice(i, 1);
            continue;
          }

          ctx.fillStyle = '#F59E0B';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Update simulation timers and phases
      if (isRunning) {
        simTimerRef.current++;
        if (disaster === 'tsunami') {
          setWavePhase(prev => {
            if (prev >= 1) return 1;
            return prev + 0.004;
          });
        }
        if (disaster === 'earthquake') {
          crackProgressRef.current = Math.min(crackProgressRef.current + 0.8, 60);
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [disaster, isRunning, magmaViscosity, gasPressure, tsunamiMagnitude, richterMagnitude, soilType, lavaProgress, wavePhase]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-50/80 p-4 sm:p-5 rounded-3xl border border-rose-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Catastrophe Simulations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Simulate dynamic volcanoes with glowing branching lava, ocean tsunamis flooding the shore, and seismic earthquake tremors!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuiz}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl text-sm font-bold bg-white text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-rose-600" />
          <span>Geology Quiz</span>
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage (3D Isometric Environment Canvas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col items-center">
          
          {/* Telemetry Indicator */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="capitalize px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                Mode: {disaster}
              </span>
              {isRunning && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 animate-pulse font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>SIMULATION ACTIVE</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 font-mono text-slate-600">
              {disaster === 'volcano' && (
                <span>Lava Temp: <strong>~1,150°C</strong> · Viscosity: <strong>{magmaViscosity}%</strong></span>
              )}
              {disaster === 'tsunami' && (
                <span>Shoaling Speed: <strong>720 km/h</strong> · Mag: <strong>M{tsunamiMagnitude}</strong></span>
              )}
              {disaster === 'earthquake' && (
                <span>Intensity: <strong>{shakeIntensity.toFixed(2)}G</strong> · Richter: <strong>M{richterMagnitude}</strong></span>
              )}
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[380px] sm:h-[460px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Controls Ribbon */}
          <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!isRunning ? (
                <button
                  onClick={startSimulation}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Trigger {disaster.toUpperCase()}</span>
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-slate-700 hover:bg-slate-800 shadow flex items-center gap-2 active:scale-95 transition-all cursor-pointer text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Environment</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Select Hazard:</span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => { setDisaster('volcano'); resetSimulation(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    disaster === 'volcano' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Volcano
                </button>
                <button
                  onClick={() => { setDisaster('tsunami'); resetSimulation(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    disaster === 'tsunami' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Tsunami
                </button>
                <button
                  onClick={() => { setDisaster('earthquake'); resetSimulation(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    disaster === 'earthquake' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Earthquake
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Parameter Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {disaster === 'volcano' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Volcano Physical Parameters</span>
              </h3>

              {/* Viscosity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Magma Viscosity (Silica SiO2)</span>
                  <span className="font-mono text-rose-600">{magmaViscosity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={magmaViscosity}
                  onChange={e => setMagmaViscosity(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Low viscosity (basaltic) produces runny lava flows. High viscosity traps steam and gases explosively.
                </p>
              </div>

              {/* Gas Pressure */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Dissolved Volatiles Gas Pressure</span>
                  <span className="font-mono text-amber-600">{gasPressure}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={gasPressure}
                  onChange={e => setGasPressure(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Expelling water vapor and CO2 propels ash plumes high into the stratosphere.
                </p>
              </div>
            </div>
          )}

          {disaster === 'tsunami' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-500" />
                <span>Tsunami Hydrodynamics</span>
              </h3>

              {/* Magnitude */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Undersea Earthquake Magnitude</span>
                  <span className="font-mono text-blue-600">M {tsunamiMagnitude.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="6.5"
                  max="9.5"
                  step="0.1"
                  value={tsunamiMagnitude}
                  onChange={e => setTsunamiMagnitude(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Ocean Depth */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Abyssal Trench Water Depth</span>
                  <span className="font-mono text-cyan-600">{oceanDepth} m</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="7000"
                  step="500"
                  value={oceanDepth}
                  onChange={e => setOceanDepth(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Deep water wave speed obeys v = √(g · h) (over 800 km/h in 4,000 m deep ocean).
                </p>
              </div>
            </div>
          )}

          {disaster === 'earthquake' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <span>Seismology Parameters</span>
              </h3>

              {/* Richter Scale */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Moment Magnitude (Richter)</span>
                  <span className="font-mono text-amber-600">M {richterMagnitude.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="9.5"
                  step="0.1"
                  value={richterMagnitude}
                  onChange={e => setRichterMagnitude(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Logarithmic scale: each +1 magnitude releases ~32 times more mechanical energy!
                </p>
              </div>

              {/* Soil Substrate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Foundation Geology</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['bedrock', 'sand', 'clay'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSoilType(s)}
                      className={`py-1.5 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                        soilType === s ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Soft clay and sand amplify seismic waves and risk soil liquefaction.
                </p>
              </div>
            </div>
          )}

          {/* Educational Quick Fact Callout */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <span>💡</span>
              <span>Scientific Note</span>
            </h4>
            <p className="leading-relaxed">
              Geoscientists study the interactions between tectonic subduction, magma conduits, and coastal ocean shoaling to design early warning safety systems and earthquake-resistant architecture.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
