import React, { useState, useEffect, useRef } from 'react';
import { Zap, Power } from 'lucide-react';
import { FunFactsSection } from '../../components/FunFactsSection';

type CircuitMode = 'series' | 'parallel';
type PowerSourceType = 'battery' | 'generator';

interface CircuitTestingGameProps {
  onOpenQuiz: () => void;
}

export const CircuitTestingGame: React.FC<CircuitTestingGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Circuit configuration
  const [circuitMode, setCircuitMode] = useState<CircuitMode>('series');
  const [powerSource, setPowerSource] = useState<PowerSourceType>('battery');
  const [mainSwitchClosed, setMainSwitchClosed] = useState<boolean>(true);

  // Component status controls: Working / Broken
  const [comp1Broken, setComp1Broken] = useState<boolean>(false);
  const [comp2Broken, setComp2Broken] = useState<boolean>(false);

  // Voltage Cursor/Slider (1.5V to 12.0V)
  const [generatorVoltage, setGeneratorVoltage] = useState<number>(6.0);
  const [batteryVoltage, setBatteryVoltage] = useState<number>(6.0);

  // Component options: Lamp or Fan on branch 2
  const [useFanOnBranch2, setUseFanOnBranch2] = useState<boolean>(false);

  const electronPhaseRef = useRef<number>(0);
  const fanRotationRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  // Active operating voltage
  const currentVoltage = powerSource === 'battery' ? batteryVoltage : generatorVoltage;
  const isMasterLive = mainSwitchClosed && currentVoltage > 0.5;

  // Series conduction: If any component is broken, the entire series loop stops
  const isSeriesIntact = !comp1Broken && !comp2Broken;
  const isSeriesConducting = circuitMode === 'series' && isMasterLive && isSeriesIntact;

  // Parallel conduction: Both branches permanently connected; each branch operates independently
  const b1Conducting = circuitMode === 'parallel' && isMasterLive && !comp1Broken;
  const b2Conducting = circuitMode === 'parallel' && isMasterLive && !comp2Broken;

  // Render loop
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
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Voltage scaling for brightness and speed
      const voltageScale = Math.max(0.2, currentVoltage / 6.0);
      const isAnyActive = isSeriesConducting || b1Conducting || b2Conducting;

      if (isAnyActive) {
        electronPhaseRef.current = (electronPhaseRef.current + 2.5 * voltageScale) % 1000;
        fanRotationRef.current = (fanRotationRef.current + 0.12 * voltageScale) % (Math.PI * 2);
      }

      // Wooden Pastel Pegboard Base
      const pad = 20;
      const bw = width - pad * 2;
      const bh = height - pad * 2;

      ctx.fillStyle = '#FEFCE8';
      ctx.beginPath();
      ctx.roundRect(pad, pad, bw, bh, 24);
      ctx.fill();
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pegboard grid dots
      ctx.fillStyle = 'rgba(234, 179, 8, 0.18)';
      for (let x = pad + 35; x < pad + bw - 15; x += 35) {
        for (let y = pad + 35; y < pad + bh - 15; y += 35) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Rails and coordinates
      const leftRailX = pad + 95;
      const rightRailX = pad + bw - 75;
      const topRailY = pad + 70;
      const bottomRailY = pad + bh - 70;

      // Parallel branch vertical lines
      const branch1X = leftRailX + (rightRailX - leftRailX) * 0.45;
      const branch2X = leftRailX + (rightRailX - leftRailX) * 0.85;

      // Draw Wire Helper - exactly uniform appearance across all cables!
      const drawWireSegment = (p1: [number, number], p2: [number, number], isConducting: boolean) => {
        ctx.strokeStyle = isConducting ? '#38BDF8' : '#CBD5E1';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();

        ctx.strokeStyle = isConducting ? '#FFFFFF' : '#E2E8F0';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Moving electron sparks
        if (isConducting) {
          ctx.fillStyle = '#FEF08A';
          const dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
          if (dist > 5) {
            const num = Math.floor(dist / 26);
            const dx = (p2[0] - p1[0]) / dist;
            const dy = (p2[1] - p1[1]) / dist;

            for (let d = 0; d < num; d++) {
              const offset = (d * 26 + (electronPhaseRef.current % 26)) % dist;
              ctx.beginPath();
              ctx.arc(p1[0] + dx * offset, p1[1] + dy * offset, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      };

      // Draw Bulb Component Helper with dynamic voltage brightness and broken state
      const drawBulb = (bx: number, by: number, label: string, isBulbLit: boolean, isBroken: boolean = false) => {
        ctx.save();
        ctx.translate(bx, by);

        // Bulb Socket Base
        ctx.fillStyle = '#64748B';
        ctx.beginPath();
        ctx.roundRect(-16, 10, 32, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(-12, 26, 24, 6);

        // Radiant Outer Glow (Scales dynamically with voltage!)
        if (isBulbLit && !isBroken) {
          const glowRadius = 35 + currentVoltage * 5.5;
          const glow = ctx.createRadialGradient(0, -6, 5, 0, -6, glowRadius);
          glow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
          glow.addColorStop(0.4, 'rgba(250, 204, 21, 0.55)');
          glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, -6, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glass Bulb Dome
        ctx.fillStyle = isBroken
          ? 'rgba(248, 113, 113, 0.35)'
          : isBulbLit
          ? '#FEF08A'
          : '#F1F5F9';
        ctx.beginPath();
        ctx.arc(0, -6, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isBroken ? '#EF4444' : isBulbLit ? '#FBBF24' : '#CBD5E1';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Filament
        if (isBroken) {
          // Broken gap in filament
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-7, 8);
          ctx.lineTo(-4, -6);
          ctx.moveTo(4, -3);
          ctx.lineTo(7, 8);
          ctx.stroke();

          // Crack lines
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-2, -14);
          ctx.lineTo(2, -8);
          ctx.lineTo(-1, -4);
          ctx.stroke();
        } else {
          ctx.strokeStyle = isBulbLit ? '#DC2626' : '#94A3B8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-6, 8);
          ctx.lineTo(-3, -8);
          ctx.lineTo(0, -4);
          ctx.lineTo(3, -8);
          ctx.lineTo(6, 8);
          ctx.stroke();
        }

        ctx.restore();

        // Label
        ctx.fillStyle = isBroken ? '#DC2626' : '#475569';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, bx, by + 46);

        if (isBroken) {
          ctx.fillStyle = '#EF4444';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(circuitMode === 'series' ? '⚡ BROKEN (Loop Broken)' : '⚡ BROKEN (Branch Off)', bx, by + 58);
        }
      };

      // Draw Fan Component Helper with broken state
      const drawFan = (fx: number, fy: number, label: string, isFanSpinning: boolean, isBroken: boolean = false) => {
        ctx.save();
        ctx.translate(fx, fy);
        ctx.fillStyle = isBroken ? '#F87171' : '#F472B6';
        ctx.beginPath();
        ctx.roundRect(-20, -20, 40, 40, 10);
        ctx.fill();

        // Guard ring
        ctx.strokeStyle = isBroken ? '#EF4444' : '#FBCFE8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();

        // Blades
        ctx.rotate(!isBroken && isFanSpinning ? fanRotationRef.current : 0);
        ctx.fillStyle = isBroken ? '#94A3B8' : '#38BDF8';
        for (let b = 0; b < 3; b++) {
          ctx.rotate((Math.PI * 2) / 3);
          ctx.beginPath();
          ctx.ellipse(0, -12, 6, 13, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.fillStyle = isBroken ? '#DC2626' : '#475569';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, fx, fy + 42);

        if (isBroken) {
          ctx.fillStyle = '#EF4444';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(circuitMode === 'series' ? '⚡ BROKEN (Loop Broken)' : '⚡ BROKEN (Branch Off)', fx, fy + 54);
        }
      };

      // 1. Render Series vs Parallel Circuit Wires
      if (circuitMode === 'series') {
        // SERIES CIRCUIT: Single continuous perimeter loop
        const sMidX = (leftRailX + rightRailX) / 2;
        drawWireSegment([leftRailX, topRailY], [rightRailX, topRailY], isSeriesConducting);
        drawWireSegment([rightRailX, topRailY], [rightRailX, bottomRailY], isSeriesConducting);
        drawWireSegment([rightRailX, bottomRailY], [leftRailX, bottomRailY], isSeriesConducting);

        // Components in series along top and right
        drawBulb(sMidX, topRailY, 'Bulb 1 (Series)', isSeriesConducting, comp1Broken);
        if (!useFanOnBranch2) {
          drawBulb(rightRailX, (topRailY + bottomRailY) / 2, 'Bulb 2 (Series)', isSeriesConducting, comp2Broken);
        } else {
          drawFan(rightRailX, (topRailY + bottomRailY) / 2, 'Fan Motor', isSeriesConducting, comp2Broken);
        }
      } else {
        // PARALLEL CIRCUIT:
        // Shared power supply on the left feeds top main wire and bottom return wire.
        // Both parallel branches are permanently connected to the main circuit wires!
        const anyBranchConducting = b1Conducting || b2Conducting;

        // Main Top Wire
        drawWireSegment([leftRailX, topRailY], [branch1X, topRailY], anyBranchConducting);
        drawWireSegment([branch1X, topRailY], [branch2X, topRailY], b2Conducting);

        // Main Bottom Wire
        drawWireSegment([branch2X, bottomRailY], [branch1X, bottomRailY], b2Conducting);
        drawWireSegment([branch1X, bottomRailY], [leftRailX, bottomRailY], anyBranchConducting);

        // Permanent Solder Junction Nodes connecting branches to the same two main wires
        ctx.fillStyle = '#0284C7';
        [
          [branch1X, topRailY],
          [branch1X, bottomRailY],
          [branch2X, topRailY],
          [branch2X, bottomRailY]
        ].forEach(([jx, jy]) => {
          ctx.beginPath();
          ctx.arc(jx, jy, 5.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Branch 1: Permanently connected vertical wire through component
        drawWireSegment([branch1X, topRailY], [branch1X, bottomRailY], b1Conducting);
        drawBulb(branch1X, (topRailY + bottomRailY) / 2, 'Branch 1: Bulb', b1Conducting, comp1Broken);

        // Branch 2: Permanently connected vertical wire through component
        drawWireSegment([branch2X, topRailY], [branch2X, bottomRailY], b2Conducting);
        if (!useFanOnBranch2) {
          drawBulb(branch2X, (topRailY + bottomRailY) / 2, 'Branch 2: Bulb', b2Conducting, comp2Broken);
        } else {
          drawFan(branch2X, (topRailY + bottomRailY) / 2, 'Branch 2: Fan', b2Conducting, comp2Broken);
        }
      }

      // 2. Power Supply (Battery or Generator) connected with EXACT SAME WIRE appearance & color!
      const pX = leftRailX;
      const pY = (topRailY + bottomRailY) / 2;
      const powerConducting = isSeriesConducting || b1Conducting || b2Conducting || (isMasterLive && mainSwitchClosed);

      // Top Cable from Power Supply (+) to Top Rail (moves UP towards top rail)
      drawWireSegment([pX, pY - 34], [pX, topRailY], powerConducting);

      // Bottom Cable from Bottom Rail to Power Supply (-) (moves UPWARDS towards negative terminal)
      drawWireSegment([pX, bottomRailY], [pX, pY + 34], powerConducting);

      // Battery / Generator Body
      ctx.save();
      if (powerSource === 'battery') {
        ctx.fillStyle = '#A855F7';
        ctx.beginPath();
        ctx.roundRect(pX - 24, pY - 34, 48, 68, 12);
        ctx.fill();

        // Terminal studs
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(pX - 10, pY - 40, 20, 7);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+', pX, pY - 33);

        ctx.fillStyle = '#1E293B';
        ctx.fillRect(pX - 10, pY + 33, 20, 7);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('-', pX, pY + 39);

        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('BATTERY', pX, pY);
        ctx.fillText(`${currentVoltage.toFixed(1)}V`, pX, pY + 14);
      } else {
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.roundRect(pX - 26, pY - 34, 52, 68, 12);
        ctx.fill();

        // Terminals
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(pX - 10, pY - 40, 20, 7);
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(pX - 10, pY + 33, 20, 7);

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(pX, pY - 6, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0284C7';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GEN', pX, pY - 3);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('GENERATOR', pX, pY + 11);
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`${currentVoltage.toFixed(1)}V`, pX, pY + 23);
      }
      ctx.restore();

      // 3. Main Switch on Bottom Rail (Matching Visual Open / Closed Position)
      const swX = (leftRailX + (circuitMode === 'parallel' ? branch1X : rightRailX)) / 2;
      const swY = bottomRailY;

      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(swX - 28, swY - 14, 56, 28, 8);
      ctx.fill();
      ctx.stroke();

      // Fixed brass contacts
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(swX - 16, swY, 4, 0, Math.PI * 2);
      ctx.arc(swX + 16, swY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Switch knife arm
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(swX - 16, swY);
      if (mainSwitchClosed) {
        // ON: Closed contact bridge
        ctx.lineTo(swX + 16, swY);
      } else {
        // OFF: Open tilted arm at 45 degrees
        ctx.lineTo(swX + 4, swY - 22);
      }
      ctx.stroke();

      // Switch handle knob
      ctx.fillStyle = mainSwitchClosed ? '#22C55E' : '#EF4444';
      ctx.beginPath();
      ctx.arc(mainSwitchClosed ? swX + 16 : swX + 4, mainSwitchClosed ? swY : swY - 22, 5, 0, Math.PI * 2);
      ctx.fill();

      // State label
      ctx.fillStyle = mainSwitchClosed ? '#16A34A' : '#DC2626';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(mainSwitchClosed ? 'SWITCH: ON (Closed)' : 'SWITCH: OFF (Open)', swX, swY + 26);
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      isLive = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [circuitMode, powerSource, mainSwitchClosed, comp1Broken, comp2Broken, currentVoltage, useFanOnBranch2, isSeriesConducting, b1Conducting, b2Conducting, isMasterLive]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FCE7F3] p-5 rounded-3xl border border-pink-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-pink-950 tracking-tight">
              Circuit Testing
            </h2>
            <p className="text-xs sm:text-sm text-pink-800">
              Build series and parallel circuits. Test broken components, adjust voltage, and discover how currents flow!
            </p>
          </div>
        </div>
      </div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage (Breadboard Canvas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-pink-200 shadow-xs flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-lg ${
              isSeriesConducting || b1Conducting || b2Conducting
                ? 'bg-emerald-100 text-emerald-800 font-bold'
                : 'bg-slate-100 text-slate-500 font-bold'
            }`}>
              {isSeriesConducting || b1Conducting || b2Conducting
                ? '⚡ Electricity Flowing!'
                : !mainSwitchClosed
                ? 'Switch is OFF (Path Open)'
                : circuitMode === 'series' && (comp1Broken || comp2Broken)
                ? 'Circuit Stopped (Component Broken)'
                : 'Circuit Idle'}
            </span>

            <span className="text-purple-900 font-bold bg-[#F3E8FF] px-2.5 py-1 rounded-lg">
              Voltage: {currentVoltage.toFixed(1)}V ({currentVoltage < 3.5 ? 'Dim Light' : currentVoltage < 8.5 ? 'Normal Light' : 'Super Bright!'})
            </span>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Master Switch and Component Working / Broken Controls */}
          <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3">
            {/* Clear ON / OFF Switch Control */}
            <button
              onClick={() => setMainSwitchClosed(!mainSwitchClosed)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center gap-2 ${
                mainSwitchClosed
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>Main Switch: {mainSwitchClosed ? 'Turn OFF' : 'Turn ON'}</span>
            </button>

            {/* Individual Broken / Working controls for Bulb 1 and Bulb 2 / Fan */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setComp1Broken(!comp1Broken)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  !comp1Broken
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-rose-100 border-rose-400 text-rose-900'
                }`}
              >
                <span>{circuitMode === 'series' ? 'Bulb 1' : 'Branch 1 Bulb'}: {!comp1Broken ? 'Working' : 'Broken'}</span>
              </button>

              <button
                onClick={() => setComp2Broken(!comp2Broken)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  !comp2Broken
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-rose-100 border-rose-400 text-rose-900'
                }`}
              >
                <span>{useFanOnBranch2 ? 'Fan' : (circuitMode === 'series' ? 'Bulb 2' : 'Branch 2 Bulb')}: {!comp2Broken ? 'Working' : 'Broken'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Configuration Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Voltage Cursor/Slider */}
          <div className="bg-white rounded-3xl p-5 border border-pink-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Voltage Cursor (Slider)
              </h3>
              <span className="font-mono text-purple-700 font-bold text-sm bg-purple-100 px-2.5 py-0.5 rounded-lg">
                {currentVoltage.toFixed(1)}V
              </span>
            </div>

            <input
              type="range"
              min="1.5"
              max="12.0"
              step="0.5"
              value={currentVoltage}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (powerSource === 'generator') {
                  setGeneratorVoltage(val);
                } else {
                  setBatteryVoltage(val);
                }
              }}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-purple-200 rounded-lg"
            />

            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span className="text-amber-700">Dim (1.5V)</span>
              <span className="text-emerald-700">Normal (6V)</span>
              <span className="text-purple-700">Bright (12V)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Slide to increase or decrease {powerSource === 'generator' ? 'generator' : 'battery'} voltage. Notice how bulb brightness scales directly with voltage!
            </p>
          </div>

          {/* Circuit Topology: Series or Parallel */}
          <div className="bg-white rounded-3xl p-5 border border-pink-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Circuit Topology
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCircuitMode('series')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  circuitMode === 'series'
                    ? 'border-pink-500 bg-[#FCE7F3] font-bold text-pink-950'
                    : 'border-slate-200 text-slate-700 hover:border-pink-300'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold">1. Series Circuit</div>
                <div className="text-[11px] text-slate-500 mt-1">Single continuous path (if one breaks, all stop!)</div>
              </button>

              <button
                onClick={() => setCircuitMode('parallel')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  circuitMode === 'parallel'
                    ? 'border-pink-500 bg-[#FCE7F3] font-bold text-pink-950'
                    : 'border-slate-200 text-slate-700 hover:border-pink-300'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold">2. Parallel Circuit</div>
                <div className="text-[11px] text-slate-500 mt-1">Separate independent branches</div>
              </button>
            </div>
          </div>

          {/* Power Supply: Battery or Generator */}
          <div className="bg-white rounded-3xl p-5 border border-pink-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Power Supply
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPowerSource('battery')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  powerSource === 'battery'
                    ? 'border-pink-500 bg-[#FCE7F3] font-bold text-pink-950'
                    : 'border-slate-200 text-slate-700 hover:border-pink-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block">🔋 Battery Cell</span>
                <span className="text-[11px] text-slate-500 leading-snug mt-0.5 block">Chemical DC source</span>
              </button>

              <button
                onClick={() => setPowerSource('generator')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  powerSource === 'generator'
                    ? 'border-pink-500 bg-[#FCE7F3] font-bold text-pink-950'
                    : 'border-slate-200 text-slate-700 hover:border-pink-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block">⚙️ Generator</span>
                <span className="text-[11px] text-slate-500 leading-snug mt-0.5 block">Mechanical spin source</span>
              </button>
            </div>
          </div>

          {/* Component Toggle (Fan vs Bulb) */}
          <div className="bg-white rounded-3xl p-5 border border-pink-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Load Component Type
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setUseFanOnBranch2(false)}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                  !useFanOnBranch2 ? 'bg-pink-100 border-pink-400 text-pink-950' : 'border-slate-200 text-slate-700'
                }`}
              >
                💡 Two Light Bulbs
              </button>
              <button
                onClick={() => setUseFanOnBranch2(true)}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                  useFanOnBranch2 ? 'bg-pink-100 border-pink-400 text-pink-950' : 'border-slate-200 text-slate-700'
                }`}
              >
                💨 Bulb + Spinning Fan
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Fun Facts Area with Quiz Button directly beneath */}
      <FunFactsSection gameId="circuit-testing" onOpenQuiz={onOpenQuiz} />

    </div>
  );
};
