import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, HelpCircle, RotateCcw } from 'lucide-react';
import { FunFactsSection } from '../../components/FunFactsSection';

interface CrystalFacet {
  x: number;
  y: number;
  baseWidth: number;
  baseHeight: number;
  rotation: number;
  scale: number;
}

interface Glint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  dAlpha: number;
}

const SHAPES = [
  { id: 'quartz', name: 'Quartz Prism', description: 'Tall pointy crystal towers' },
  { id: 'cluster', name: 'Gem Cluster', description: 'Group of shiny mineral pillars' },
  { id: 'octahedron', name: 'Diamond Gem', description: 'Double four-sided shiny diamond' },
  { id: 'geode', name: 'Geode', description: 'Rocky shell with sparkling crystal cave' },
  { id: 'cubic', name: 'Pyrite Cubes', description: 'Cool blocky square cubes' }
];

const COLORS = [
  { id: 'amethyst', name: 'Pastel Purple', main: '#A855F7', deep: '#7E22CE', light: '#E9D5FF' },
  { id: 'sapphire', name: 'Pastel Blue', main: '#38BDF8', deep: '#0284C7', light: '#BAE6FD' },
  { id: 'rosequartz', name: 'Pastel Pink', main: '#F472B6', deep: '#DB2777', light: '#FBCFE8' },
  { id: 'emerald', name: 'Pastel Green', main: '#4ADE80', deep: '#16A34A', light: '#BBF7D0' },
  { id: 'citrine', name: 'Pastel Yellow', main: '#FBBF24', deep: '#D97706', light: '#FEF08A' }
];

interface CrystalGrowingGameProps {
  onOpenQuiz: () => void;
}

export const CrystalGrowingGame: React.FC<CrystalGrowingGameProps> = ({ onOpenQuiz }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clean, kid-friendly state
  const [crystalShape, setCrystalShape] = useState<string>('quartz');
  const [crystalColorId, setCrystalColorId] = useState<string>('amethyst');
  const [crystalSize, setCrystalSize] = useState<number>(1.2); // 0.4 to 2.2 size cursor
  const [sparklesOn, setSparklesOn] = useState<boolean>(true);

  const activeColor = COLORS.find(c => c.id === crystalColorId) || COLORS[0];

  const facetsRef = useRef<CrystalFacet[]>([]);
  const glintsRef = useRef<Glint[]>([]);
  const animFrameRef = useRef<number>(0);

  // Initialize crystal facets
  const generateFacets = useCallback(() => {
    const facets: CrystalFacet[] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = (i % 4) * 26 + Math.random() * 12;
      facets.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.45,
        baseWidth: 26 + Math.random() * 24,
        baseHeight: 45 + Math.random() * 65,
        rotation: (Math.random() - 0.5) * 0.6,
        scale: 0.7 + Math.random() * 0.6
      });
    }
    facets.sort((a, b) => a.y - b.y);
    facetsRef.current = facets;
  }, []);

  useEffect(() => {
    generateFacets();
  }, [generateFacets]);

  // Main Canvas render loop: NO container, NO water, NO dropper!
  // Just beautiful, colorful, faceted, 3D crystals with soft glow and animated sparkles!
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

      // Clean Pastel Display Pedestal Base
      const centerX = width / 2;
      const centerY = height * 0.75;
      const scale = crystalSize;

      // Soft Pedestal Shadow
      ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 8, 140 * scale, 30 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Display Pedestal Ring
      ctx.fillStyle = '#FAF5FF';
      ctx.strokeStyle = '#E9D5FF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 130 * scale, 24 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Gentle Radiant Crystal Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY - 60 * scale, 10, centerX, centerY - 60 * scale, 160 * scale);
      glowGrad.addColorStop(0, `${activeColor.light}66`);
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - 40 * scale, 180 * scale, 130 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Helper for a single realistic, natural Geode specimen
      const drawRealisticGeode = (gx: number, gy: number, gScale: number) => {
        ctx.save();
        ctx.translate(gx, gy);

        const rx = 125 * gScale;
        const ry = 95 * gScale;

        // 1. Natural Craggy Outer Rock Shell (Irregular volcanic rock matrix)
        const numPoints = 48;
        const rockPoints: [number, number][] = [];
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          // Organic wobble using harmonics
          const wobble = 1 + Math.sin(angle * 3) * 0.05 + Math.cos(angle * 5) * 0.03 + Math.sin(angle * 7) * 0.02;
          rockPoints.push([Math.cos(angle) * rx * wobble, Math.sin(angle) * ry * wobble]);
        }

        // Drop shadow for the heavy rock
        ctx.fillStyle = 'rgba(28, 25, 23, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, ry * 0.85, rx * 1.05, 22 * gScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Outer Dark Basalt Rock Rind
        const rockGrad = ctx.createRadialGradient(-rx * 0.2, -ry * 0.3, 10, 0, 0, rx * 1.1);
        rockGrad.addColorStop(0, '#57534E');
        rockGrad.addColorStop(0.5, '#44403C');
        rockGrad.addColorStop(1, '#1C1917');

        ctx.fillStyle = rockGrad;
        ctx.beginPath();
        rockPoints.forEach(([px, py], idx) => {
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();

        // Rocky texture grain / fissures
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 2 * gScale;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(120, 113, 108, 0.4)';
        ctx.lineWidth = 1.5 * gScale;
        for (let k = 0; k < 7; k++) {
          const kAngle = (k / 7) * Math.PI * 2 + 0.3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(kAngle) * rx * 0.95, Math.sin(kAngle) * ry * 0.95);
          ctx.lineTo(Math.cos(kAngle) * rx * 0.85, Math.sin(kAngle) * ry * 0.85);
          ctx.stroke();
        }

        // 2. Weathered Sandstone Transition Ring
        ctx.fillStyle = '#78716C';
        ctx.beginPath();
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const wobble = 1 + Math.sin(angle * 3) * 0.04 + Math.cos(angle * 5) * 0.02;
          const px = Math.cos(angle) * rx * 0.90 * wobble;
          const py = Math.sin(angle) * ry * 0.90 * wobble;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // 3. Concentric Chalcedony / Agate Banding
        ctx.fillStyle = '#CBD5E1';
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.84, ry * 0.84, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F8FAFC'; // White agate band
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.80, ry * 0.80, 0, 0, Math.PI * 2);
        ctx.fill();

        // Faint pastel agate tint band
        ctx.fillStyle = `${activeColor.light}AA`;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.76, ry * 0.76, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. Hollow Deep Crystal Cave Interior
        const cavityGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, rx * 0.75);
        cavityGrad.addColorStop(0, '#020617'); // Pitch dark cave depth
        cavityGrad.addColorStop(0.45, activeColor.deep);
        cavityGrad.addColorStop(0.85, activeColor.main);
        cavityGrad.addColorStop(1, activeColor.light);

        ctx.fillStyle = cavityGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.74, ry * 0.74, 0, 0, Math.PI * 2);
        ctx.fill();

        // 5. Druzy Micro-Crystals Border (Fine shimmering crystal crust)
        ctx.fillStyle = '#FFFFFF';
        for (let d = 0; d < 36; d++) {
          const dAng = (d / 36) * Math.PI * 2;
          const dDist = rx * 0.72 + (Math.sin(d * 4) * 2);
          ctx.beginPath();
          ctx.arc(Math.cos(dAng) * dDist, Math.sin(dAng) * (ry * 0.72 / rx * dDist), 1.2 * gScale, 0, Math.PI * 2);
          ctx.fill();
        }

        // 6. Multi-Faceted Crystal Points Pointing Inward
        const crystalCount = 38;
        for (let c = 0; c < crystalCount; c++) {
          const ang = (c / crystalCount) * Math.PI * 2;
          // Natural variations in crystal depth and reach
          const lengthVar = 0.65 + ((c * 7) % 5) * 0.08;
          const outerR_x = rx * 0.72;
          const outerR_y = ry * 0.72;
          const innerR_x = rx * (0.35 + (1 - lengthVar) * 0.25);
          const innerR_y = ry * (0.35 + (1 - lengthVar) * 0.25);

          const ox = Math.cos(ang) * outerR_x;
          const oy = Math.sin(ang) * outerR_y;
          const tipX = Math.cos(ang) * innerR_x;
          const tipY = Math.sin(ang) * innerR_y;

          // Tangent width vector
          const tangX = -Math.sin(ang) * 5.5 * gScale;
          const tangY = Math.cos(ang) * 5.5 * gScale;

          // Left Highlight Facet
          const leftGrad = ctx.createLinearGradient(ox, oy, tipX, tipY);
          leftGrad.addColorStop(0, '#FFFFFF');
          leftGrad.addColorStop(0.35, activeColor.light);
          leftGrad.addColorStop(1, activeColor.main);

          ctx.fillStyle = leftGrad;
          ctx.beginPath();
          ctx.moveTo(ox - tangX, oy - tangY);
          ctx.lineTo(tipX, tipY);
          ctx.lineTo(ox, oy);
          ctx.closePath();
          ctx.fill();

          // Right Shadow Facet
          const rightGrad = ctx.createLinearGradient(ox, oy, tipX, tipY);
          rightGrad.addColorStop(0, activeColor.main);
          rightGrad.addColorStop(1, activeColor.deep);

          ctx.fillStyle = rightGrad;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(tipX, tipY);
          ctx.lineTo(ox + tangX, oy + tangY);
          ctx.closePath();
          ctx.fill();

          // Shiny Center Ridge Line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 0.8 * gScale;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
        }

        // 7. Prominent Foreground Crystals in Cavity Base
        const fgCrystals: [number, number, number, number][] = [
          [-rx * 0.18, ry * 0.2, 22 * gScale, 36 * gScale],
          [rx * 0.12, ry * 0.24, 25 * gScale, 40 * gScale],
          [-rx * 0.02, ry * 0.32, 28 * gScale, 45 * gScale],
          [rx * 0.26, ry * 0.15, 18 * gScale, 30 * gScale]
        ];

        fgCrystals.forEach(([cx, cy, cw, ch]) => {
          ctx.save();
          ctx.translate(cx, cy);

          // Left facet
          ctx.fillStyle = activeColor.light;
          ctx.beginPath();
          ctx.moveTo(0, -ch);
          ctx.lineTo(-cw / 2, -ch * 0.2);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();

          // Right facet
          ctx.fillStyle = activeColor.deep;
          ctx.beginPath();
          ctx.moveTo(0, -ch);
          ctx.lineTo(cw / 2, -ch * 0.2);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();

          // Specular highlight line
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.2 * gScale;
          ctx.beginPath();
          ctx.moveTo(0, -ch);
          ctx.lineTo(0, 0);
          ctx.stroke();

          ctx.restore();
        });

        // 8. Dynamic Facet Sparkles on the Crystals
        if (sparklesOn) {
          ctx.fillStyle = '#FFFFFF';
          const glintOffsets = [
            [-rx * 0.3, -ry * 0.2],
            [rx * 0.28, -ry * 0.32],
            [-rx * 0.15, ry * 0.1],
            [rx * 0.22, ry * 0.2],
            [0, -ry * 0.35],
            [-rx * 0.25, ry * 0.25]
          ];
          glintOffsets.forEach(([gxOff, gyOff], gIdx) => {
            const timePhase = (Date.now() * 0.003 + gIdx * 1.5) % (Math.PI * 2);
            const gSize = (1.5 + Math.sin(timePhase) * 1.5) * gScale;
            if (gSize > 0.8) {
              ctx.beginPath();
              ctx.arc(gxOff, gyOff, gSize, 0, Math.PI * 2);
              ctx.fill();

              // Star glint cross
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(gxOff - gSize * 2, gyOff);
              ctx.lineTo(gxOff + gSize * 2, gyOff);
              ctx.moveTo(gxOff, gyOff - gSize * 2);
              ctx.lineTo(gxOff, gyOff + gSize * 2);
              ctx.stroke();
            }
          });
        }

        ctx.restore();
      };

      // Draw Crystals: exactly ONE geode if geode is selected, otherwise draw facet cluster!
      if (crystalShape === 'geode') {
        drawRealisticGeode(centerX, centerY - 65 * scale, scale);
      } else {
        facetsRef.current.forEach((facet) => {
          const fx = centerX + facet.x * scale;
          const fy = centerY + facet.y * scale;
          const fw = facet.baseWidth * scale * facet.scale;
          const fh = facet.baseHeight * scale * facet.scale;

          ctx.save();
          ctx.translate(fx, fy);
          ctx.rotate(facet.rotation);

          if (crystalShape === 'quartz') {
            // Pointy Quartz Prisms
            const gradLeft = ctx.createLinearGradient(-fw / 2, -fh, 0, 0);
            gradLeft.addColorStop(0, activeColor.light);
            gradLeft.addColorStop(0.5, activeColor.main);
            gradLeft.addColorStop(1, activeColor.deep);

            ctx.fillStyle = gradLeft;
            ctx.beginPath();
            ctx.moveTo(0, -fh); // tip
            ctx.lineTo(-fw / 2, -fh * 0.7);
            ctx.lineTo(-fw * 0.4, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();

            const gradRight = ctx.createLinearGradient(0, -fh, fw / 2, 0);
            gradRight.addColorStop(0, '#FFFFFF');
            gradRight.addColorStop(0.3, activeColor.light);
            gradRight.addColorStop(1, activeColor.main);

            ctx.fillStyle = gradRight;
            ctx.beginPath();
            ctx.moveTo(0, -fh);
            ctx.lineTo(fw / 2, -fh * 0.7);
            ctx.lineTo(fw * 0.4, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();

            // Shiny Center Ridge
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -fh);
            ctx.lineTo(0, 0);
            ctx.stroke();

          } else if (crystalShape === 'cluster') {
            // Sturdy Columns
            const gradCol = ctx.createLinearGradient(-fw / 2, 0, fw / 2, 0);
            gradCol.addColorStop(0, activeColor.deep);
            gradCol.addColorStop(0.4, activeColor.light);
            gradCol.addColorStop(0.8, activeColor.main);
            gradCol.addColorStop(1, activeColor.deep);

            ctx.fillStyle = gradCol;
            ctx.beginPath();
            ctx.moveTo(-fw / 2, 0);
            ctx.lineTo(-fw / 2, -fh * 0.85);
            ctx.lineTo(0, -fh);
            ctx.lineTo(fw / 2, -fh * 0.85);
            ctx.lineTo(fw / 2, 0);
            ctx.closePath();
            ctx.fill();

            // Top Bevel
            ctx.fillStyle = activeColor.light;
            ctx.beginPath();
            ctx.ellipse(0, -fh * 0.85, fw / 2, fw * 0.25, 0, 0, Math.PI * 2);
            ctx.fill();

          } else if (crystalShape === 'octahedron') {
            // Double Diamond
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

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-fw / 2, -fh * 0.5);
            ctx.lineTo(fw / 2, -fh * 0.5);
            ctx.moveTo(0, -fh);
            ctx.lineTo(0, 0);
            ctx.stroke();

          } else {
            // Blocky 3D Cubes
            const cubeGrad = ctx.createLinearGradient(-fw / 2, -fw, fw / 2, 0);
            cubeGrad.addColorStop(0, activeColor.light);
            cubeGrad.addColorStop(1, activeColor.deep);
            ctx.fillStyle = cubeGrad;
            ctx.fillRect(-fw / 2, -fw, fw, fw);

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(-fw / 2, -fw, fw, fw);
          }

          ctx.restore();
        });
      }

      // Animated Sparkles
      if (sparklesOn) {
        if (Math.random() < 0.2 && glintsRef.current.length < 8) {
          const randomFacet = facetsRef.current[Math.floor(Math.random() * facetsRef.current.length)];
          glintsRef.current.push({
            x: centerX + (crystalShape === 'geode' ? (Math.random() - 0.5) * 80 * scale : randomFacet.x * scale),
            y: centerY - (crystalShape === 'geode' ? 65 * scale + (Math.random() - 0.5) * 50 * scale : randomFacet.y * scale),
            size: 5 + Math.random() * 8,
            alpha: 0.1,
            dAlpha: 0.08
          });
        }

        for (let i = glintsRef.current.length - 1; i >= 0; i--) {
          const g = glintsRef.current[i];
          g.alpha += g.dAlpha;
          if (g.alpha >= 1) g.dAlpha = -0.06;
          else if (g.alpha <= 0) {
            glintsRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(g.x, g.y);
          ctx.fillStyle = `rgba(255, 255, 255, ${g.alpha})`;
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8;
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

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [crystalShape, activeColor, crystalSize, sparklesOn]);

  const handleReset = () => {
    setCrystalSize(1.0);
    setCrystalShape('quartz');
    setCrystalColorId('amethyst');
    generateFacets();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F3E8FF] p-5 rounded-3xl border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
              Crystal Lab
            </h2>
            <p className="text-xs sm:text-sm text-purple-800">
              Grow colorful, sparkling crystals! Change their shape, color, and size.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stage: Pure Crystal Viewport */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-purple-200 shadow-xs flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 text-xs font-semibold text-purple-900">
            <span>3D Sparkling Mineral Display</span>
            <span className="font-mono bg-[#F3E8FF] px-2.5 py-1 rounded-lg">
              Size: {Math.round(crystalSize * 50)} mm
            </span>
          </div>

          {/* Clean Canvas Stage - NO beaker, NO water, NO dropper */}
          <div className="relative w-full h-[360px] sm:h-[420px] bg-gradient-to-b from-[#FAF5FF] via-white to-[#F3E8FF]/40 rounded-2xl overflow-hidden border border-purple-100 shadow-inner flex items-center justify-center select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Size Cursor (Slider) directly under canvas */}
          <div className="w-full mt-5 bg-[#FAF5FF] p-4 rounded-2xl border border-purple-100 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-purple-950">
              <span>Crystal Size Cursor</span>
              <span className="text-purple-700 font-mono">{Math.round(crystalSize * 50)}% Growth</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={crystalSize}
              onChange={(e) => setCrystalSize(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-purple-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-semibold text-purple-600">
              <span>Tiny Seed Crystal</span>
              <span>Medium Gem</span>
              <span>Giant Sparkling Geode</span>
            </div>
          </div>
        </div>

        {/* Right Settings Deck */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Crystal Shape */}
          <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Crystal Shape
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {SHAPES.map(shape => (
                <button
                  key={shape.id}
                  onClick={() => setCrystalShape(shape.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    crystalShape === shape.id
                      ? 'border-purple-600 bg-[#F3E8FF] font-bold text-purple-950'
                      : 'border-slate-200 hover:border-purple-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs sm:text-sm">{shape.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{shape.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette (Order: Purple, Blue, Pink, Green, Yellow) */}
          <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Mineral Color
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCrystalColorId(c.id)}
                  title={c.name}
                  className={`h-11 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                    crystalColorId === c.id ? 'ring-3 ring-purple-600 scale-105 shadow-xs' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.main }}
                >
                  {crystalColorId === c.id && <Sparkles className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-purple-800 bg-[#F3E8FF] px-3 py-1.5 rounded-xl border border-purple-100">
              Color: {activeColor.name}
            </p>
          </div>

          {/* Simple controls: Sparkles toggle & Reset */}
          <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Sparkle Glints</span>
              <button
                onClick={() => setSparklesOn(!sparklesOn)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sparklesOn ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {sparklesOn ? 'Sparkles ON' : 'Sparkles OFF'}
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Crystal</span>
            </button>
          </div>

        </div>

      </div>

      {/* Fun Facts Area with Quiz Answers */}
      <FunFactsSection gameId="crystal-growing" onOpenQuiz={onOpenQuiz} />

    </div>
  );
};
