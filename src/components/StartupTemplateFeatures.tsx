import React, { useEffect, useRef, useState } from 'react';
import {
  HeartHandshake,
  Globe,
  BarChart2,
  ShieldCheck,
  Zap,
  FileText,
  ChevronRight,
} from 'lucide-react';

/**
 * 1. Interactive Magnetic Particles Canvas (from startup-template-sage.vercel.app Module 4894)
 * Renders floating particles that magnetically respond to mouse movement across the landing page.
 */
interface MagneticParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  color?: string;
  vx?: number;
  vy?: number;
}

interface ParticleCircle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const intVal = parseInt(clean, 16);
  return [(intVal >> 16) & 255, (intVal >> 8) & 255, intVal & 255];
}

export const MagneticParticlesCanvas: React.FC<MagneticParticlesProps> = ({
  className = '',
  quantity = 90,
  staticity = 50,
  ease = 50,
  size = 0.6,
  color = '#c9a84c',
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const circlesRef = useRef<ParticleCircle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const isWebdriver = typeof navigator !== 'undefined' && navigator.webdriver;
    const dpr = isWebdriver ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const effectiveQuantity = isWebdriver ? 28 : quantity;
    const rgb = hexToRgb(color);
    let animationFrameId: number;

    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d');
    }

    const remapValue = (
      value: number,
      start1: number,
      end1: number,
      start2: number,
      end2: number
    ): number => {
      const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
      return remapped > 0 ? remapped : 0;
    };

    const circleParams = (): ParticleCircle => {
      const x = Math.floor(Math.random() * canvasSizeRef.current.w);
      const y = Math.floor(Math.random() * canvasSizeRef.current.h);
      const pSize = Math.floor(Math.random() * 2) + size;
      return {
        x,
        y,
        translateX: 0,
        translateY: 0,
        size: pSize,
        alpha: 0,
        targetAlpha: parseFloat((Math.random() * 0.55 + 0.15).toFixed(2)),
        dx: (Math.random() - 0.5) * 0.14,
        dy: (Math.random() - 0.5) * 0.14,
        magnetism: 0.1 + Math.random() * 4,
      };
    };

    const drawCircle = (circle: ParticleCircle, update = false) => {
      const ctx = contextRef.current;
      if (!ctx) return;
      const { x, y, translateX, translateY, size: cSize, alpha } = circle;
      ctx.translate(translateX, translateY);
      ctx.beginPath();
      ctx.arc(x, y, cSize, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
      ctx.fill();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!update) {
        circlesRef.current.push(circle);
      }
    };

    const clearContext = () => {
      const ctx = contextRef.current;
      if (ctx) {
        ctx.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h);
      }
    };

    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current && contextRef.current) {
        circlesRef.current.length = 0;
        canvasSizeRef.current.w = containerRef.current.offsetWidth || window.innerWidth;
        canvasSizeRef.current.h = containerRef.current.offsetHeight || window.innerHeight;
        canvasRef.current.width = canvasSizeRef.current.w * dpr;
        canvasRef.current.height = canvasSizeRef.current.h * dpr;
        canvasRef.current.style.width = `${canvasSizeRef.current.w}px`;
        canvasRef.current.style.height = `${canvasSizeRef.current.h}px`;
        contextRef.current.scale(dpr, dpr);
        clearContext();
        for (let i = 0; i < effectiveQuantity; i++) {
          drawCircle(circleParams());
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSizeRef.current;
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      }
    };

    const animate = () => {
      clearContext();
      circlesRef.current.forEach((circle, i) => {
        const edge = [
          circle.x + circle.translateX - circle.size,
          canvasSizeRef.current.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSizeRef.current.h - circle.y - circle.translateY - circle.size,
        ];
        const closestEdge = edge.reduce((a, b) => Math.min(a, b));
        const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
        if (remapClosestEdge > 1) {
          circle.alpha += 0.02;
          if (circle.alpha > circle.targetAlpha) {
            circle.alpha = circle.targetAlpha;
          }
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge;
        }
        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX +=
          (mouseRef.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
        circle.translateY +=
          (mouseRef.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;
        drawCircle(circle, true);

        if (
          circle.x < -circle.size ||
          circle.x > canvasSizeRef.current.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSizeRef.current.h + circle.size
        ) {
          circlesRef.current.splice(i, 1);
          drawCircle(circleParams());
        }
      });
      animationFrameId = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [color, ease, quantity, size, staticity, vx, vy]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-testid="magnetic-particles-canvas"
      className={`pointer-events-none ${className}`}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

/**
 * 2. BorderBeam Component (from startup-template-sage.vercel.app Module 2778)
 * Travels smoothly along the rounded border of the 3D Hero Showcase container.
 */
interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  size = 220,
  duration = 12,
  delay = 0,
  colorFrom = '#c9a84c',
  colorTo = '#9c40ff',
  borderWidth = 1.5,
}) => {
  return (
    <div
      style={
        {
          '--border-beam-width': `${borderWidth}px`,
        } as React.CSSProperties
      }
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <div
        style={
          {
            width: `${size}px`,
            height: `${size}px`,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            '--color-from': colorFrom,
            '--color-to': colorTo,
            '--beam-duration': `${duration}s`,
            animationDelay: `-${delay}s`,
          } as React.CSSProperties
        }
        className="animate-border-beam absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent"
      />
    </div>
  );
};

/**
 * 3. SphereMask Horizon Arc Component (from startup-template-sage.vercel.app)
 * Creates the glowing curved planetary horizon arc between Trusted Ecosystem and Core Features.
 */
export const SphereMask: React.FC<{ reverse?: boolean }> = ({ reverse = false }) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative mx-auto h-[32rem] sm:h-[42rem] overflow-hidden [mask-image:radial-gradient(ellipse_at_center_center,#000,transparent_55%)] ${
        reverse ? 'my-[-14rem] rotate-180' : 'my-[-14rem] sm:my-[-16rem]'
      } before:absolute before:inset-0 before:h-full before:w-full before:opacity-45 before:[background-image:radial-gradient(circle_at_bottom_center,#c9a84c,transparent_70%)] after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-t after:border-[#c9a84c]/35 after:bg-[#0b0f1a]`}
    />
  );
};

/**
 * 4. 5-Row Animated Marquee Tile Matrix CTA Section (from startup-template-sage.vercel.app Module 1001)
 */
interface TileSpec {
  id: string;
  label: string;
  icon: React.ReactNode;
  bgClass: string;
}

const TILE_ITEMS: TileSpec[] = [
  {
    id: 'handshake',
    label: 'Unified Onboarding',
    icon: <HeartHandshake className="size-full text-[#e8e6e0]" />,
    bgClass: 'from-orange-600 via-rose-600 to-violet-600',
  },
  {
    id: 'globe',
    label: 'Pan-India ONDC & Marketplaces',
    icon: <Globe className="size-full text-[#e8e6e0]" />,
    bgClass: 'from-cyan-500 via-blue-500 to-indigo-500',
  },
  {
    id: 'chart',
    label: 'Predictive ML Analytics',
    icon: <BarChart2 className="size-full text-[#e8e6e0]" />,
    bgClass: 'from-green-500 via-teal-500 to-emerald-600',
  },
  {
    id: 'shield',
    label: 'Inventory Protection',
    icon: <ShieldCheck className="size-full text-[#e8e6e0]" />,
    bgClass: 'from-yellow-400 via-orange-500 to-yellow-600',
  },
  {
    id: 'zap',
    label: 'Instant AI Listing Sync',
    icon: <Zap className="size-full text-[#e8e6e0]" />,
    bgClass: 'from-orange-600 via-rose-600 to-violet-600',
  },
  {
    id: 'file',
    label: 'Automated GST & Catalogs',
    icon: <FileText className="size-full text-[#e8e6e0]" />,
    bgClass: 'from-amber-500 via-yellow-500 to-orange-400',
  },
];

// Deterministic permutations for the 5 rows so SSR/hydration and screenshots are rock-solid
const ROW_PERMUTATIONS: TileSpec[][] = [
  [TILE_ITEMS[0], TILE_ITEMS[1], TILE_ITEMS[2], TILE_ITEMS[3], TILE_ITEMS[4], TILE_ITEMS[5]],
  [TILE_ITEMS[2], TILE_ITEMS[4], TILE_ITEMS[0], TILE_ITEMS[5], TILE_ITEMS[1], TILE_ITEMS[3]],
  [TILE_ITEMS[3], TILE_ITEMS[0], TILE_ITEMS[5], TILE_ITEMS[1], TILE_ITEMS[2], TILE_ITEMS[4]],
  [TILE_ITEMS[1], TILE_ITEMS[5], TILE_ITEMS[3], TILE_ITEMS[4], TILE_ITEMS[0], TILE_ITEMS[2]],
  [TILE_ITEMS[4], TILE_ITEMS[2], TILE_ITEMS[1], TILE_ITEMS[0], TILE_ITEMS[5], TILE_ITEMS[3]],
];

const MarqueeRow: React.FC<{
  tiles: TileSpec[];
  durationClass: string;
  delayClass?: string;
}> = ({ tiles, durationClass, delayClass = '' }) => {
  return (
    <div
      className={`group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row ${durationClass} ${delayClass}`}
    >
      {Array.from({ length: 4 }).map((_, groupIdx) => (
        <div
          key={groupIdx}
          className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-reverse flex-row group-hover:[animation-play-state:paused]"
        >
          {tiles.map((tile, idx) => (
            <div
              key={`${tile.id}-${idx}`}
              title={tile.label}
              className="relative size-20 cursor-pointer overflow-hidden rounded-2xl border border-white/10 p-4 bg-[#111827]/70 [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] transition-transform duration-200 hover:scale-105 hover:border-[#c9a84c]/50"
            >
              <div className="relative z-10 size-full">{tile.icon}</div>
              <div
                className={`pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r ${tile.bgClass} opacity-70 blur-[20px] filter`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const MarqueeTileMatrixCTA: React.FC<{
  onStartTrial: () => void;
  onOpenCommandCenter: () => void;
}> = ({ onStartTrial, onOpenCommandCenter }) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  return (
    <section
      id="cta"
      data-testid="marquee-cta-section"
      className="relative z-10 border-t border-[#c9a84c]/20 bg-[#0b0f1a] py-16 overflow-hidden"
    >
      <div className="flex w-full flex-col items-center justify-center">
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
          {/* 5-Row Animated Marquee Matrix from startup-template-sage.vercel.app */}
          <MarqueeRow
            tiles={ROW_PERMUTATIONS[0]}
            durationClass="[--duration:20s]"
            delayClass="-delay-[200ms]"
          />
          <MarqueeRow tiles={ROW_PERMUTATIONS[1]} durationClass="[--duration:30s]" />
          <MarqueeRow
            tiles={ROW_PERMUTATIONS[2]}
            durationClass="[--duration:20s]"
            delayClass="-delay-[200ms]"
          />
          <MarqueeRow tiles={ROW_PERMUTATIONS[3]} durationClass="[--duration:30s]" />
          <MarqueeRow tiles={ROW_PERMUTATIONS[4]} durationClass="[--duration:26s]" />

          {/* Centered Floating Frosted Glass CTA Overlay */}
          <div className="absolute z-20 px-4 flex flex-col items-center">
            <div className="mx-auto size-24 rounded-[2rem] border border-[#c9a84c]/40 bg-[#0b0f1a]/65 p-3 shadow-2xl backdrop-blur-md lg:size-32 flex items-center justify-center">
              <HeartHandshake className="mx-auto size-14 text-[#c9a84c] lg:size-20" />
            </div>

            <div className="z-10 mt-5 flex flex-col items-center text-center max-w-xl">
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e8e6e0] leading-tight">
                Stop wasting time on manual listings.
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#a8aab8]">
                Start your 14-day free trial. List once across Amazon, Flipkart, Meesho &amp; ONDC — no credit card required.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onStartTrial}
                  onMouseEnter={() => setHoveredMetric('trial')}
                  onMouseLeave={() => setHoveredMetric(null)}
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all duration-200 border border-[#c9a84c] bg-[#c9a84c] hover:bg-[#e8c97a] text-[#0b0f1a] shadow-[0_0_30px_rgba(201,168,76,0.35)] h-11 group rounded-[2rem] px-7 cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ChevronRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={onOpenCommandCenter}
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border border-[#c9a84c]/35 bg-[#0b0f1a]/80 hover:bg-[#1a2236] hover:border-[#c9a84c] text-[#e8e6e0] h-11 group rounded-[2rem] px-6 backdrop-blur-md cursor-pointer"
                >
                  <span>Explore Command Center</span>
                  <ChevronRight className="ml-1 size-4 text-[#c9a84c] transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </button>
              </div>

              {hoveredMetric === 'trial' && (
                <div className="mt-2 text-xs text-[#c9a84c] font-mono-code">
                  Instant OAuth setup in under 120 seconds · Cancel anytime
                </div>
              )}
            </div>

            {/* Radial backdrop blur behind text */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#0b0f1a] opacity-75 blur-2xl" />
          </div>

          {/* Bottom Gradient Fade Mask */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent via-[#0b0f1a]/35 to-[#0b0f1a] to-80%" />
        </div>
      </div>
    </section>
  );
};
