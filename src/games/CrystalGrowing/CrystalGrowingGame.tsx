import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Droplet, RotateCcw, Sparkles, HelpCircle, Eye, Zap, Flame, Thermometer } from 'lucide-react';

interface CrystalFacet {
  x: number;
  y: number;
  baseWidth: number;
  baseHeight: number;
  rotation: number;
  hueShift: number;
  scale: number;
  seed: number;
}

interface Drop {
  x: number;
  y: number;
  vy: number;
  color: string;
  radius: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface Glint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  dAlpha: number;
  rotation: number;
}

const SHAPES = [
  { id: 'quartz', name: 'Prismatic Quartz', description: 'Hexagonal prism with pointed pyramidal facets' },
  { id: 'cluster', name: 'Emerald Cluster', description: 'Grouped prismatic columns with bevelled edges' },
  { id: 'octahedron', name: 'Diamond Octahedron', description: 'Double four-sided pyramid with intense refraction' },
  { id: 'aragonite', name: 'Needle Aragonite', description: 'Fine radiating acicular needles with starburst centers' },
  { id: 'cubic', name: 'Pyrite Isometric', description: 'Interlocking cubic lattices with reflective striations' }
];

const COLORS = [
  { id: 'amethyst', name: 'Amethyst Violet', main: '#8B5CF6', deep: '#5B21B6', light: '#C4B5FD', glow: 'rgba(139, 92, 246, 0.4)' },
  { id: 'emerald', name: 'Emerald Green', main: '#10B981', deep: '#047857', light: '#6EE7B7', glow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'sapphire', name: 'Royal Sapphire', main: '#3B82F6', deep: '#1D4ED8', light: '#93C5FD', glow: 'rgba(59, 130, 246, 0.4)' },
  { id: 'ruby', name: 'Ruby Crimson', main: '#EF4444', deep: '#B91C1C', light: '#FCA5A5', glow: 'rgba(239, 68, 68, 0.4)' },
  { id: 'citrine', name: 'Golden Citrine', main: '#F59E0B', deep: '#B45309', light: '#FDE68A', glow: 'rgba(245, 158, 11, 0.4)' },
  { id: 'rosequartz', name: 'Rose Quartz', main: '#EC4899', deep: '#BE185D', light: '#FBCFE8', glow: 'rgba(236, 72, 153, 0.4)' },
  { id: 'aquamarine', name: 'Aquamarine', main: '#06B6D4', deep: '#0E7490', light: '#A5F3FC', glow: 'rgba(6, 182, 212, 0.4)' }
];

interface CrystalGrowingGameProps {
  onOpenQuiz: () => void;
}

export const CrystalGrowingGame: React.FC<CrystalGrowingGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Experiment state
  const [crystalShape, setCrystalShape] = useState<string>('quartz');
  const [crystalColorId, setCrystalColorId] = useState<string>('amethyst');
  const [growthProgress, setGrowthProgress] = useState<number>(0.25); // 0.1 to 2.5
  const [saturation, setSaturation] = useState<number>(80); // 10% to 100%
  const [temperature, setTemperature] = useState<number>(35); // 15°C to 75°C
  const [autoDrip, setAutoDrip] = useState<boolean>(false);
  const [sparklesEnabled, setSparklesEnabled] = useState<boolean>(true);
  const [dropCount, setDropCount] = useState<number>(12);

  const activeColor = COLORS.find(c => c.id === crystalColorId) || COLORS[0];

  // Dynamic animation entities
  const dropsRef = useRef<Drop[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const glintsRef = useRef<Glint[]>([]);
  const facetsRef = useRef<CrystalFacet[]>([]);
  const animFrameRef = useRef<number>(0);

  // Initialize crystal facets
  const initializeFacets = useCallback(() => {
    const facets: CrystalFacet[] = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = (i % 5) * 22 + Math.random() * 15;
      facets.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.45,
        baseWidth: 24 + Math.random() * 26,
        baseHeight: 40 + Math.random() * 70,
        rotation: (Math.random() - 0.5) * 0.7,
        hueShift: (Math.random() - 0.5) * 25,
        scale: 0.6 + Math.random() * 0.7,
        seed: Math.random()
      });
    }
    // Sort so deeper ones render behind
    facets.sort((a, b) => a.y - b.y);
    facetsRef.current = facets;
  }, []);

  useEffect(() => {
    initializeFacets();
  }, [initializeFacets]);

  // Handle adding a mineral drop
  const addDrop = useCallback((customX?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = customX !== undefined ? customX : rect.width / 2 + (Math.random() - 0.5) * 60;
    const y = 30; // Starts from dropper top

    dropsRef.current.push({
      x,
      y,
      vy: 1.5,
      color: activeColor.main,
      radius: 5 + (saturation / 100) * 4
    });

    setDropCount(prev => prev + 1);

    // Growth increment depends on saturation and temperature
    const growthIncrement = 0.035 * (saturation / 100) * (1 + (temperature - 20) / 100);
    setGrowthProgress(prev => Math.min(prev + growthIncrement, 2.6));
  }, [activeColor.main, saturation, temperature]);

  // Auto drip effect
  useEffect(() => {
    if (!autoDrip) return;
    const interval = setInterval(() => {
      addDrop();
    }, 900);
    return () => clearInterval(interval);
  }, [autoDrip, addDrop]);

  // Main Canvas render loop
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

      // Liquid solution surface line & beaker parameters
      const beakerLeft = width * 0.15;
      const beakerRight = width * 0.85;
      const beakerTop = 70;
      const beakerBottom = height - 40;
      const liquidLevel = height * 0.44;

      // 1. Draw Lab Beaker Outer Glass
      ctx.save();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(beakerLeft - 8, beakerTop);
      ctx.lineTo(beakerLeft, beakerTop + 10);
      ctx.lineTo(beakerLeft, beakerBottom - 20);
      ctx.quadraticCurveTo(beakerLeft, beakerBottom, beakerLeft + 25, beakerBottom);
      ctx.lineTo(beakerRight - 25, beakerBottom);
      ctx.quadraticCurveTo(beakerRight, beakerBottom, beakerRight, beakerBottom - 20);
      ctx.lineTo(beakerRight, beakerTop + 10);
      ctx.lineTo(beakerRight + 8, beakerTop);
      ctx.stroke();

      // Beaker Graduations (measurement ticks)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '10px monospace';
      ctx.lineWidth = 1.5;
      for (let markY = beakerBottom - 40; markY >= liquidLevel - 20; markY -= 45) {
        ctx.beginPath();
        ctx.moveTo(beakerLeft + 8, markY);
        ctx.lineTo(beakerLeft + 22, markY);
        ctx.stroke();
        const ml = Math.round((beakerBottom - markY) * 3);
        ctx.fillText(`${ml} ml`, beakerLeft + 26, markY + 3);
      }
      ctx.restore();

      // 2. Draw Translucent Liquid Solution inside beaker
      ctx.save();
      const liquidGrad = ctx.createLinearGradient(0, liquidLevel, 0, beakerBottom);
      liquidGrad.addColorStop(0, `${activeColor.light}40`);
      liquidGrad.addColorStop(0.6, `${activeColor.main}30`);
      liquidGrad.addColorStop(1, `${activeColor.deep}55`);

      ctx.fillStyle = liquidGrad;
      ctx.beginPath();
      ctx.moveTo(beakerLeft + 2, liquidLevel);
      ctx.lineTo(beakerLeft + 2, beakerBottom - 20);
      ctx.quadraticCurveTo(beakerLeft + 2, beakerBottom - 2, beakerLeft + 25, beakerBottom - 2);
      ctx.lineTo(beakerRight - 25, beakerBottom - 2);
      ctx.quadraticCurveTo(beakerRight - 2, beakerBottom - 2, beakerRight - 2, beakerBottom - 20);
      ctx.lineTo(beakerRight - 2, liquidLevel);
      // Curved meniscus at top of liquid
      ctx.quadraticCurveTo(width / 2, liquidLevel + 6, beakerLeft + 2, liquidLevel);
      ctx.fill();

      // Liquid surface meniscus highlight
      ctx.strokeStyle = `${activeColor.light}80`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(beakerLeft + 2, liquidLevel);
      ctx.quadraticCurveTo(width / 2, liquidLevel + 6, beakerRight - 2, liquidLevel);
      ctx.stroke();
      ctx.restore();

      // 3. Draw Ripples on Liquid Surface
      ctx.save();
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += 1.8;
        r.alpha -= 0.025;

        if (r.alpha <= 0 || r.radius > r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `${r.color}${Math.floor(r.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(r.x, liquidLevel, r.radius, r.radius * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Draw Falling Drops
      ctx.save();
      for (let i = dropsRef.current.length - 1; i >= 0; i--) {
        const drop = dropsRef.current[i];
        drop.vy += 0.35; // gravity
        drop.y += drop.vy;

        // Check if drop hit the liquid surface
        if (drop.y >= liquidLevel) {
          // Trigger ripples & splash particles
          ripplesRef.current.push({
            x: drop.x,
            y: liquidLevel,
            radius: 4,
            maxRadius: 45,
            alpha: 0.9,
            color: activeColor.light
          });
          ripplesRef.current.push({
            x: drop.x,
            y: liquidLevel,
            radius: 2,
            maxRadius: 28,
            alpha: 0.7,
            color: activeColor.main
          });
          dropsRef.current.splice(i, 1);
          continue;
        }

        // Draw tear-drop shaped droplet
        ctx.fillStyle = drop.color;
        ctx.shadowColor = activeColor.glow;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y - drop.radius * 1.6);
        ctx.quadraticCurveTo(drop.x + drop.radius, drop.y, drop.x, drop.y + drop.radius);
        ctx.quadraticCurveTo(drop.x - drop.radius, drop.y, drop.x, drop.y - drop.radius * 1.6);
        ctx.fill();

        // Droplet specular glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(drop.x - drop.radius * 0.3, drop.y - drop.radius * 0.2, drop.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. Draw Growing Crystals at the bottom of the beaker
      const centerX = width / 2;
      const crystalBaseY = beakerBottom - 16;
      const scaleFactor = Math.min(growthProgress, 2.5);

      ctx.save();

      // Pedestal / Seed bed
      const bedGrad = ctx.createRadialGradient(centerX, crystalBaseY, 10, centerX, crystalBaseY, 120);
      bedGrad.addColorStop(0, `${activeColor.main}60`);
      bedGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bedGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, crystalBaseY, 120 * (scaleFactor * 0.5 + 0.5), 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ambient crystal glow
      ctx.shadowColor = activeColor.glow;
      ctx.shadowBlur = 24 * scaleFactor;

      // Render crystal facets based on chosen shape
      facetsRef.current.forEach((facet) => {
        const fx = centerX + facet.x * scaleFactor;
        const fy = crystalBaseY + facet.y * scaleFactor;
        const fw = facet.baseWidth * scaleFactor * facet.scale;
        const fh = facet.baseHeight * scaleFactor * facet.scale;

        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(facet.rotation);

        if (crystalShape === 'quartz') {
          // Elongated Hexagonal Quartz Prisms with Pyramidal tips
          const grad = ctx.createLinearGradient(-fw / 2, -fh, fw / 2, 0);
          grad.addColorStop(0, activeColor.light);
          grad.addColorStop(0.3, activeColor.main);
          grad.addColorStop(0.8, activeColor.deep);
          grad.addColorStop(1, 'rgba(15, 23, 42, 0.8)');

          // Left facet
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -fh); // tip
          ctx.lineTo(-fw / 2, -fh * 0.7);
          ctx.lineTo(-fw * 0.4, 0);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();

          // Right facet (lighter highlight)
          const gradRight = ctx.createLinearGradient(0, -fh, fw / 2, 0);
          gradRight.addColorStop(0, '#FFFFFF');
          gradRight.addColorStop(0.2, activeColor.light);
          gradRight.addColorStop(0.9, activeColor.main);
          ctx.fillStyle = gradRight;
          ctx.beginPath();
          ctx.moveTo(0, -fh);
          ctx.lineTo(fw / 2, -fh * 0.7);
          ctx.lineTo(fw * 0.4, 0);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();

          // Center bevel line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, -fh);
          ctx.lineTo(0, 0);
          ctx.stroke();

        } else if (crystalShape === 'cluster') {
          // Emerald column cluster
          const colGrad = ctx.createLinearGradient(-fw / 2, 0, fw / 2, 0);
          colGrad.addColorStop(0, activeColor.deep);
          colGrad.addColorStop(0.4, activeColor.light);
          colGrad.addColorStop(0.8, activeColor.main);
          colGrad.addColorStop(1, activeColor.deep);

          ctx.fillStyle = colGrad;
          ctx.beginPath();
          ctx.moveTo(-fw / 2, 0);
          ctx.lineTo(-fw / 2, -fh * 0.85);
          ctx.lineTo(0, -fh);
          ctx.lineTo(fw / 2, -fh * 0.85);
          ctx.lineTo(fw / 2, 0);
          ctx.closePath();
          ctx.fill();

          // Hexagonal top cap
          ctx.fillStyle = activeColor.light;
          ctx.beginPath();
          ctx.ellipse(0, -fh * 0.85, fw / 2, fw * 0.25, 0, 0, Math.PI * 2);
          ctx.fill();

        } else if (crystalShape === 'octahedron') {
          // Diamond Octahedron
          const topGrad = ctx.createLinearGradient(0, -fh, 0, 0);
          topGrad.addColorStop(0, '#FFFFFF');
          topGrad.addColorStop(0.5, activeColor.main);
          topGrad.addColorStop(1, activeColor.deep);

          ctx.fillStyle = topGrad;
          ctx.beginPath();
          ctx.moveTo(0, -fh);
          ctx.lineTo(fw / 2, -fh * 0.5);
          ctx.lineTo(0, 0);
          ctx.lineTo(-fw / 2, -fh * 0.5);
          ctx.closePath();
          ctx.fill();

          // Facet dividing cross
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-fw / 2, -fh * 0.5);
          ctx.lineTo(fw / 2, -fh * 0.5);
          ctx.moveTo(0, -fh);
          ctx.lineTo(0, 0);
          ctx.stroke();

        } else if (crystalShape === 'aragonite') {
          // Needle bursts
          ctx.strokeStyle = activeColor.light;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          for (let a = -0.6; a <= 0.6; a += 0.25) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.sin(a) * fw, -Math.cos(a) * fh * 1.2);
            ctx.stroke();
          }
        } else {
          // Cubic Pyrite
          const cubeGrad = ctx.createLinearGradient(-fw / 2, -fw, fw / 2, 0);
          cubeGrad.addColorStop(0, activeColor.light);
          cubeGrad.addColorStop(1, activeColor.deep);
          ctx.fillStyle = cubeGrad;
          ctx.fillRect(-fw / 2, -fw, fw, fw);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-fw / 2, -fw, fw, fw);
        }

        ctx.restore();
      });

      // 6. Draw Animated Sparkle Glints
      if (sparklesEnabled && scaleFactor > 0.4) {
        if (Math.random() < 0.18 && glintsRef.current.length < 10) {
          const randomFacet = facetsRef.current[Math.floor(Math.random() * facetsRef.current.length)];
          glintsRef.current.push({
            x: centerX + randomFacet.x * scaleFactor + (Math.random() - 0.5) * 20,
            y: crystalBaseY + randomFacet.y * scaleFactor - randomFacet.baseHeight * scaleFactor * 0.7,
            size: 6 + Math.random() * 10,
            alpha: 0.1,
            dAlpha: 0.08,
            rotation: Math.random() * Math.PI
          });
        }

        for (let i = glintsRef.current.length - 1; i >= 0; i--) {
          const g = glintsRef.current[i];
          g.alpha += g.dAlpha;
          if (g.alpha >= 1) {
            g.dAlpha = -0.06;
          } else if (g.alpha <= 0) {
            glintsRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(g.x, g.y);
          ctx.rotate(g.rotation);
          ctx.fillStyle = `rgba(255, 255, 255, ${g.alpha})`;
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 10;

          // 4-point sparkle star
          ctx.beginPath();
          ctx.moveTo(0, -g.size);
          ctx.quadraticCurveTo(0, 0, g.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, g.size);
          ctx.quadraticCurveTo(0, 0, -g.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -g.size);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.restore(); // End crystal rendering

      // 7. Dropper Pipette at Top Center
      ctx.save();
      const dropPipetteX = centerX;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.lineWidth = 2;
      // Glass stem
      ctx.beginPath();
      ctx.moveTo(dropPipetteX - 5, 0);
      ctx.lineTo(dropPipetteX - 5, 22);
      ctx.lineTo(dropPipetteX - 2, 28);
      ctx.lineTo(dropPipetteX + 2, 28);
      ctx.lineTo(dropPipetteX + 5, 22);
      ctx.lineTo(dropPipetteX + 5, 0);
      ctx.fill();
      ctx.stroke();

      // Liquid inside dropper tip
      ctx.fillStyle = activeColor.main;
      ctx.beginPath();
      ctx.arc(dropPipetteX, 29, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeColor, crystalShape, growthProgress, sparklesEnabled, saturation, temperature]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    addDrop(clickX);
  };

  const handleReset = () => {
    setGrowthProgress(0.15);
    setDropCount(0);
    dropsRef.current = [];
    ripplesRef.current = [];
    glintsRef.current = [];
    initializeFacets();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quiz Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-50/80 dark:bg-purple-950/20 p-4 sm:p-5 rounded-3xl border border-purple-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Crystal Growing Laboratory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Add mineral solute drops to trigger nucleation and watch 3D faceted crystals crystallize in real time!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuiz}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl text-sm font-bold bg-white text-purple-700 hover:bg-purple-100 border border-purple-200 shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>Mineralogy Quiz</span>
        </button>
      </div>

      {/* Main Two-Zone Sandbox: Left Stage + Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Stage (Canvas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              <span>Click anywhere inside the beaker or use the button to dispense drops</span>
            </span>
            <span className="tabular-nums font-mono text-purple-600 font-bold">
              Drops: {dropCount} · Size: {(growthProgress * 100).toFixed(0)}%
            </span>
          </div>

          <div className="relative w-full h-[400px] sm:h-[480px] bg-gradient-to-b from-slate-50 via-slate-100/50 to-purple-50/30 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner cursor-pointer select-none">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-full block"
            />
            {/* Quick click hint overlay */}
            <div className="absolute top-3 right-3 pointer-events-none bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 shadow-sm border border-slate-200">
              Interactive Glass Beaker
            </div>
          </div>

          {/* Quick Action Ribbon */}
          <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => addDrop()}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm flex items-center gap-2 active:scale-95 transition-all cursor-pointer text-sm"
              >
                <Droplet className="w-4 h-4 fill-white" />
                <span>Add Mineral Drop</span>
              </button>

              <button
                onClick={() => setAutoDrip(!autoDrip)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  autoDrip
                    ? 'bg-purple-100 border-purple-400 text-purple-800'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                {autoDrip ? 'Auto-Drip ON' : 'Auto-Drip OFF'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSparklesEnabled(!sparklesEnabled)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  sparklesEnabled ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Facet Glints</span>
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Control & Parameter Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Crystal Shape Picker */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Crystal Habit & Lattice Shape</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {SHAPES.map(shape => (
                <button
                  key={shape.id}
                  onClick={() => setCrystalShape(shape.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    crystalShape === shape.id
                      ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">{shape.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{shape.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color & Mineral Chemistry */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Mineral Color & Element Impurities
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 gap-2">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCrystalColorId(c.id)}
                  title={c.name}
                  className={`h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    crystalColorId === c.id ? 'ring-2 ring-purple-600 scale-105 shadow-sm' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.main }}
                >
                  {crystalColorId === c.id && (
                    <Sparkles className="w-4 h-4 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
              Active: {activeColor.name}
            </p>
          </div>

          {/* Solution Environmental Controls */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Solution Thermodynamics
            </h3>

            {/* Saturation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" />
                  <span>Solute Saturation</span>
                </span>
                <span className="font-mono text-purple-700">{saturation}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={saturation}
                onChange={e => setSaturation(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Higher saturation yields rapid lattice precipitation per drop.
              </p>
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>Liquid Temperature</span>
                </span>
                <span className="font-mono text-purple-700">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="75"
                value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Warm water increases solubility; cooling precipitates larger gem facets.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
