import React, { useState, useEffect, useRef } from 'react';
import { Zap, HelpCircle, RotateCcw, Power, Lightbulb, Fan, BatteryCharging, AlertTriangle, ShieldCheck } from 'lucide-react';

type CircuitMode = 'series' | 'parallel' | 'fan-bulb' | 'generator-loop';
type PowerSourceType = 'battery' | 'generator';

interface CircuitTestingGameProps {
  onOpenQuiz: () => void;
}

export const CircuitTestingGame: React.FC<CircuitTestingGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Circuit configuration state
  const [circuitMode, setCircuitMode] = useState<CircuitMode>('series');
  const [powerSource, setPowerSource] = useState<PowerSourceType>('battery');
  const [batteryVoltage, setBatteryVoltage] = useState<number>(6); // 1.5V, 3V, 6V, 9V, 12V
  const [generatorRpm, setGeneratorRpm] = useState<number>(0);
  const [isGeneratorCranking, setIsGeneratorCranking] = useState<boolean>(false);
  const [mainSwitchClosed, setMainSwitchClosed] = useState<boolean>(true);
  const [branchSwitchClosed, setBranchSwitchClosed] = useState<boolean>(true);

  // Components in circuit
  const [bulb1Resistance, setBulb1Resistance] = useState<number>(10); // ohms
  const [bulb2Resistance, setBulb2Resistance] = useState<number>(10); // ohms
  const [fanResistance, setFanResistance] = useState<number>(15); // ohms

  // Animated pulse phase
  const electronPhaseRef = useRef<number>(0);
  const fanRotationRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  // Compute Active Voltage
  const activeVoltage = powerSource === 'battery' ? batteryVoltage : (generatorRpm / 100) * 12;

  // Circuit analysis calculations (Ohm's Law)
  const isCircuitActive = (mainSwitchClosed && activeVoltage > 0);

  let currentTotal = 0;
  let bulb1Current = 0;
  let bulb2Current = 0;
  let fanCurrent = 0;
  let equivalentResistance = 0;
  let isShortCircuit = false;

  if (isCircuitActive) {
    if (circuitMode === 'series') {
      equivalentResistance = bulb1Resistance + bulb2Resistance;
      currentTotal = activeVoltage / equivalentResistance;
      bulb1Current = currentTotal;
      bulb2Current = currentTotal;
    } else if (circuitMode === 'parallel') {
      const r1 = bulb1Resistance;
      const r2 = branchSwitchClosed ? bulb2Resistance : Infinity;
      equivalentResistance = (r1 * r2) / (r1 + r2);
      if (!branchSwitchClosed) equivalentResistance = r1;
      currentTotal = activeVoltage / equivalentResistance;
      bulb1Current = activeVoltage / r1;
      bulb2Current = branchSwitchClosed ? activeVoltage / r2 : 0;
    } else if (circuitMode === 'fan-bulb') {
      equivalentResistance = bulb1Resistance + fanResistance;
      currentTotal = activeVoltage / equivalentResistance;
      bulb1Current = currentTotal;
      fanCurrent = currentTotal;
    } else {
      // generator loop
      equivalentResistance = bulb1Resistance + fanResistance;
      currentTotal = activeVoltage / equivalentResistance;
      bulb1Current = currentTotal;
      fanCurrent = currentTotal;
    }

    if (equivalentResistance <= 0.5) {
      isShortCircuit = true;
    }
  }

  // Handle hand-crank generator spin
  const crankGenerator = () => {
    setGeneratorRpm(prev => Math.min(prev + 25, 120));
    setIsGeneratorCranking(true);
  };

  useEffect(() => {
    if (powerSource !== 'generator') return;
    const interval = setInterval(() => {
      setGeneratorRpm(prev => {
        if (prev <= 1) {
          setIsGeneratorCranking(false);
          return 0;
        }
        return Math.max(0, prev - 4); // spin down friction
      });
    }, 100);
    return () => clearInterval(interval);
  }, [powerSource]);

  // Main 2D Canvas rendering loop with 3D toy styling
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
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Advance electron phase and fan angle
      if (isCircuitActive && currentTotal > 0.01) {
        electronPhaseRef.current = (electronPhaseRef.current + currentTotal * 5) % 1000;
        fanRotationRef.current = (fanRotationRef.current + (fanCurrent > 0 ? fanCurrent * 18 : 0)) % (Math.PI * 2);
      }

      // Draw Wooden / Pastel Toy Breadboard Base
      const pad = 24;
      const bWidth = width - pad * 2;
      const bHeight = height - pad * 2;

      // Board drop shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.beginPath();
      ctx.roundRect(pad + 4, pad + 6, bWidth, bHeight, 28);
      ctx.fill();

      // Board Surface (Cute Soft Creamy Wood)
      const woodGrad = ctx.createLinearGradient(pad, pad, pad, pad + bHeight);
      woodGrad.addColorStop(0, '#FFFDF8');
      woodGrad.addColorStop(1, '#F6EEDB');
      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(pad, pad, bWidth, bHeight, 28);
      ctx.fill();

      // Board rim bevel
      ctx.strokeStyle = '#E2D5BA';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Grid peg holes (Montessori pegboard style)
      ctx.fillStyle = 'rgba(180, 160, 130, 0.35)';
      for (let gx = pad + 40; gx < pad + bWidth - 20; gx += 32) {
        for (let gy = pad + 40; gy < pad + bHeight - 20; gy += 32) {
          ctx.beginPath();
          ctx.arc(gx, gy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Coordinates for standard circuit loop nodes
      const leftX = pad + 90;
      const rightX = pad + bWidth - 90;
      const topY = pad + 75;
      const bottomY = pad + bHeight - 75;
      const midY = (topY + bottomY) / 2;

      // Helper to draw realistic 3D toy wire with moving electrons
      const drawToyWire = (path: [number, number][], isLive: boolean, flowSpeed: number) => {
        // Wire Shadow
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        path.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px + 2, py + 3) : ctx.lineTo(px + 2, py + 3)));
        ctx.stroke();

        // Outer Rubber Insulation (Mint Teal or Pastel Coral)
        ctx.strokeStyle = isLive ? '#38BDF8' : '#94A3B8';
        ctx.lineWidth = 8;
        ctx.beginPath();
        path.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
        ctx.stroke();

        // Top Gloss Highlight
        ctx.strokeStyle = isLive ? '#BAE6FD' : '#CBD5E1';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Flowing Electrons / Sparkle Pulses
        if (isLive && flowSpeed > 0.05) {
          ctx.fillStyle = '#FEF08A';
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 8;

          // Compute length and place dots
          for (let pIdx = 0; pIdx < path.length - 1; pIdx++) {
            const [x1, y1] = path[pIdx];
            const [x2, y2] = path[pIdx + 1];
            const segDist = Math.hypot(x2 - x1, y2 - y1);
            const numDots = Math.floor(segDist / 28);
            const dx = (x2 - x1) / segDist;
            const dy = (y2 - y1) / segDist;

            for (let d = 0; d < numDots; d++) {
              const offset = ((d * 28 + (electronPhaseRef.current % 28)) % segDist);
              const dotX = x1 + dx * offset;
              const dotY = y1 + dy * offset;
              ctx.beginPath();
              ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.shadowBlur = 0;
        }
      };

      // Draw Main Loop Wires
      if (circuitMode === 'series' || circuitMode === 'fan-bulb' || circuitMode === 'generator-loop') {
        const loopPath: [number, number][] = [
          [leftX, topY],
          [rightX, topY],
          [rightX, bottomY],
          [leftX, bottomY],
          [leftX, topY]
        ];
        drawToyWire(loopPath, isCircuitActive, currentTotal);
      } else {
        // Parallel Circuit with 2 rungs
        const mainRung: [number, number][] = [
          [leftX, topY],
          [rightX, topY],
          [rightX, bottomY],
          [leftX, bottomY],
          [leftX, topY]
        ];
        drawToyWire(mainRung, isCircuitActive, bulb1Current);

        // Center Parallel Bridge
        const bridgeRung: [number, number][] = [
          [leftX + 70, midY],
          [rightX - 70, midY]
        ];
        drawToyWire(bridgeRung, isCircuitActive && branchSwitchClosed, bulb2Current);
      }

      // Draw Component 1: Power Source (Left Side Center)
      const pSrcX = leftX;
      const pSrcY = midY;

      ctx.save();
      // Power Source 3D Box
      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.roundRect(pSrcX - 32, pSrcY - 45, 64, 90, 16);
      ctx.fill();

      if (powerSource === 'battery') {
        // Pastel Yellow / Cyan 3D Toy Battery
        const batGrad = ctx.createLinearGradient(pSrcX - 30, pSrcY, pSrcX + 30, pSrcY);
        batGrad.addColorStop(0, '#38BDF8');
        batGrad.addColorStop(0.3, '#7DD3FC');
        batGrad.addColorStop(0.8, '#0284C7');
        ctx.fillStyle = batGrad;
        ctx.beginPath();
        ctx.roundRect(pSrcX - 30, pSrcY - 40, 60, 80, 14);
        ctx.fill();

        // Brass Top Terminal (+)
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(pSrcX - 10, pSrcY - 47, 20, 8);

        // Battery Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${batteryVoltage}V DC`, pSrcX, pSrcY + 4);
        ctx.font = 'bold 10px monospace';
        ctx.fillText('+', pSrcX, pSrcY - 26);
        ctx.fillText('-', pSrcX, pSrcY + 32);
      } else {
        // Hand Crank Dynamo
        ctx.fillStyle = '#F472B6';
        ctx.beginPath();
        ctx.roundRect(pSrcX - 30, pSrcY - 40, 60, 80, 14);
        ctx.fill();

        // Crank knob
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(pSrcX, pSrcY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DYNAMO', pSrcX, pSrcY - 20);
        ctx.fillText(`${activeVoltage.toFixed(1)}V`, pSrcX, pSrcY + 28);
      }
      ctx.restore();

      // Draw Component 2: Main Knife Switch (Bottom Center)
      const swX = (leftX + rightX) / 2;
      const swY = bottomY;

      ctx.save();
      // Switch ceramic base
      ctx.fillStyle = '#F1F5F9';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(swX - 45, swY - 20, 90, 40, 12);
      ctx.fill();
      ctx.stroke();

      // Brass Contact Terminals
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(swX - 25, swY, 6, 0, Math.PI * 2);
      ctx.arc(swX + 25, swY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Switch Blade Lever
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(swX - 25, swY);
      if (mainSwitchClosed) {
        ctx.lineTo(swX + 25, swY); // Closed
      } else {
        ctx.lineTo(swX + 10, swY - 32); // Open
      }
      ctx.stroke();

      // Handle Knob
      ctx.fillStyle = mainSwitchClosed ? '#10B981' : '#EF4444';
      ctx.beginPath();
      ctx.arc(mainSwitchClosed ? swX + 25 : swX + 10, mainSwitchClosed ? swY : swY - 32, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Component 3: Bulb 1 (Top Center or Top Right)
      const bulb1X = circuitMode === 'parallel' ? (leftX + rightX) / 2 : rightX;
      const bulb1Y = circuitMode === 'parallel' ? topY : (topY + midY) / 2;

      ctx.save();
      // Bulb Socket Base
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.roundRect(bulb1X - 24, bulb1Y - 14, 48, 28, 8);
      ctx.fill();

      // Glow Bloom if lit
      const isBulb1Lit = isCircuitActive && bulb1Current > 0.05;
      const brightness = Math.min(bulb1Current * 1.5, 1.4);

      if (isBulb1Lit) {
        const glowGrad = ctx.createRadialGradient(bulb1X, bulb1Y - 25, 5, bulb1X, bulb1Y - 25, 55 * brightness);
        glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        glowGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.5)');
        glowGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(bulb1X, bulb1Y - 25, 55 * brightness, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glass Dome
      ctx.fillStyle = isBulb1Lit ? `rgba(254, 240, 138, ${0.7 + brightness * 0.3})` : 'rgba(226, 232, 240, 0.4)';
      ctx.strokeStyle = isBulb1Lit ? '#FBBF24' : '#94A3B8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(bulb1X, bulb1Y - 25, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Filament
      ctx.strokeStyle = isBulb1Lit ? '#FFFFFF' : '#64748B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bulb1X - 6, bulb1Y - 10);
      ctx.lineTo(bulb1X - 4, bulb1Y - 25);
      ctx.lineTo(bulb1X + 4, bulb1Y - 25);
      ctx.lineTo(bulb1X + 6, bulb1Y - 10);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Lamp A (${bulb1Resistance}Ω)`, bulb1X, bulb1Y + 28);
      ctx.restore();

      // Draw Component 4: Bulb 2 or Spinning Fan (Right/Mid)
      if (circuitMode === 'series') {
        // Bulb 2 on right bottom half
        const bulb2X = rightX;
        const bulb2Y = (midY + bottomY) / 2;

        ctx.save();
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(bulb2X - 24, bulb2Y - 14, 48, 28, 8);
        ctx.fill();

        const isBulb2Lit = isCircuitActive && bulb2Current > 0.05;
        const b2Bright = Math.min(bulb2Current * 1.5, 1.4);

        if (isBulb2Lit) {
          const glow2 = ctx.createRadialGradient(bulb2X, bulb2Y - 25, 5, bulb2X, bulb2Y - 25, 55 * b2Bright);
          glow2.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
          glow2.addColorStop(0.5, 'rgba(250, 204, 21, 0.5)');
          glow2.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = glow2;
          ctx.beginPath();
          ctx.arc(bulb2X, bulb2Y - 25, 55 * b2Bright, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isBulb2Lit ? `rgba(254, 240, 138, ${0.7 + b2Bright * 0.3})` : 'rgba(226, 232, 240, 0.4)';
        ctx.strokeStyle = isBulb2Lit ? '#FBBF24' : '#94A3B8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(bulb2X, bulb2Y - 25, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Lamp B (${bulb2Resistance}Ω)`, bulb2X, bulb2Y + 28);
        ctx.restore();

      } else if (circuitMode === 'parallel') {
        // Center branch Bulb 2
        const b2X = (leftX + rightX) / 2;
        const b2Y = midY;

        ctx.save();
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(b2X - 24, b2Y - 14, 48, 28, 8);
        ctx.fill();

        const isB2Lit = isCircuitActive && branchSwitchClosed && bulb2Current > 0.05;
        const b2Bright = Math.min(bulb2Current * 1.5, 1.4);

        if (isB2Lit) {
          const glow = ctx.createRadialGradient(b2X, b2Y - 25, 5, b2X, b2Y - 25, 55 * b2Bright);
          glow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
          glow.addColorStop(0.5, 'rgba(250, 204, 21, 0.5)');
          glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(b2X, b2Y - 25, 55 * b2Bright, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isB2Lit ? `rgba(254, 240, 138, ${0.7 + b2Bright * 0.3})` : 'rgba(226, 232, 240, 0.4)';
        ctx.strokeStyle = isB2Lit ? '#FBBF24' : '#94A3B8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(b2X, b2Y - 25, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Branch Lamp (${bulb2Resistance}Ω)`, b2X, b2Y + 28);
        ctx.restore();

      } else {
        // Spinning Fan Motor
        const fanX = rightX;
        const fanY = (topY + bottomY) / 2;

        ctx.save();
        ctx.translate(fanX, fanY);

        // Fan Motor Casing
        ctx.fillStyle = '#A78BFA';
        ctx.beginPath();
        ctx.roundRect(-25, -25, 50, 50, 14);
        ctx.fill();

        // Outer Protective Fan Guard Cage
        ctx.strokeStyle = '#DDD6FE';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();

        // 3 Spinning Pastel Blades
        ctx.rotate(fanRotationRef.current);
        ctx.fillStyle = '#38BDF8';
        for (let b = 0; b < 3; b++) {
          ctx.rotate((Math.PI * 2) / 3);
          ctx.beginPath();
          ctx.ellipse(0, -18, 9, 18, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center hub
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.fillStyle = '#334155';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Fan Motor (${fanResistance}Ω)`, fanX, fanY + 50);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [circuitMode, powerSource, batteryVoltage, generatorRpm, mainSwitchClosed, branchSwitchClosed, bulb1Resistance, bulb2Resistance, fanResistance, isCircuitActive, currentTotal, bulb1Current, bulb2Current, fanCurrent]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Toggle switch if clicked near switch
    const swX = canvas.clientWidth / 2;
    const swY = canvas.clientHeight - 40;
    if (Math.hypot(x - swX, y - swY) < 55) {
      setMainSwitchClosed(!mainSwitchClosed);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/80 p-4 sm:p-5 rounded-3xl border border-amber-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Circuit Testing Laboratory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Build realistic 3D series and parallel circuits. Wire batteries, hand generators, lamps, and spinning fans!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuiz}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl text-sm font-bold bg-white text-amber-700 hover:bg-amber-100 border border-amber-200 shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Electronics Quiz</span>
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage (Breadboard Canvas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col items-center">
          
          {/* Telemetry Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                isCircuitActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
              }`}>
                <Power className="w-3.5 h-3.5" />
                <span>{isCircuitActive ? 'Circuit CLOSED (Live)' : 'Circuit OPEN (Halted)'}</span>
              </span>

              {isShortCircuit && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 border border-rose-300 animate-pulse font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>SHORT CIRCUIT!</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 font-mono text-slate-700">
              <span>V: <strong className="text-amber-600">{activeVoltage.toFixed(1)}V</strong></span>
              <span>I: <strong className="text-blue-600">{currentTotal.toFixed(2)}A</strong></span>
              <span>Req: <strong className="text-purple-600">{equivalentResistance.toFixed(1)}Ω</strong></span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-full block cursor-pointer"
            />
          </div>

          {/* Quick Hardware Controls below Breadboard */}
          <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMainSwitchClosed(!mainSwitchClosed)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                  mainSwitchClosed
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{mainSwitchClosed ? 'Open Switch (Cut Power)' : 'Close Switch (Connect)'}</span>
              </button>

              {circuitMode === 'parallel' && (
                <button
                  onClick={() => setBranchSwitchClosed(!branchSwitchClosed)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    branchSwitchClosed
                      ? 'bg-purple-100 border-purple-300 text-purple-800'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Branch 2: {branchSwitchClosed ? 'Connected' : 'Disconnected'}
                </button>
              )}
            </div>

            {powerSource === 'generator' && (
              <button
                onClick={crankGenerator}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 shadow-sm flex items-center gap-2 active:scale-95 transition-all cursor-pointer text-sm"
              >
                <BatteryCharging className="w-4 h-4" />
                <span>Crank Generator! ({generatorRpm} RPM)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Configuration Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Circuit Architecture Presets */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Circuit Topology Preset
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setCircuitMode('series'); setPowerSource('battery'); }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  circuitMode === 'series' && powerSource === 'battery'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400 font-bold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs text-amber-900">Series Dual Lamps</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Single loop; voltages add</div>
              </button>

              <button
                onClick={() => { setCircuitMode('parallel'); setPowerSource('battery'); }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  circuitMode === 'parallel'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400 font-bold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs text-amber-900">Parallel Dual Lamps</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Independent branches</div>
              </button>

              <button
                onClick={() => { setCircuitMode('fan-bulb'); setPowerSource('battery'); }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  circuitMode === 'fan-bulb'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400 font-bold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs text-amber-900">Lamp & Motor Fan</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Light + kinetic output</div>
              </button>

              <button
                onClick={() => { setCircuitMode('generator-loop'); setPowerSource('generator'); }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  powerSource === 'generator'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400 font-bold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs text-amber-900">Hand Dynamo Loop</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Crank to generate volts</div>
              </button>
            </div>
          </div>

          {/* Power Source Settings */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Power Supply Source
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPowerSource('battery')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  powerSource === 'battery' ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200'
                }`}
              >
                DC Battery Pack
              </button>
              <button
                onClick={() => setPowerSource('generator')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  powerSource === 'generator' ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200'
                }`}
              >
                Hand Dynamo
              </button>
            </div>

            {powerSource === 'battery' ? (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Battery Potential</span>
                  <span className="font-mono text-amber-700">{batteryVoltage} Volts</span>
                </div>
                <div className="flex gap-1.5">
                  {[1.5, 3.0, 6.0, 9.0, 12.0].map(v => (
                    <button
                      key={v}
                      onClick={() => setBatteryVoltage(v)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        batteryVoltage === v ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <p>Click the <strong>"Crank Generator"</strong> button repeatedly to turn the dynamo coil through the magnetic field.</p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-amber-500 transition-all"
                    style={{ width: `${(generatorRpm / 120) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Component Resistances (Ohm values) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Component Resistances (Load)
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Lamp A Filament Resistance</span>
                <span className="font-mono text-blue-600">{bulb1Resistance} Ω</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={bulb1Resistance}
                onChange={e => setBulb1Resistance(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {circuitMode === 'series' || circuitMode === 'parallel' ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Lamp B Filament Resistance</span>
                  <span className="font-mono text-purple-600">{bulb2Resistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={bulb2Resistance}
                  onChange={e => setBulb2Resistance(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Fan Motor Armature Resistance</span>
                  <span className="font-mono text-emerald-600">{fanResistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={fanResistance}
                  onChange={e => setFanResistance(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
