import React, { useEffect, useState, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return { isInstallable: !!deferredPrompt, isInstalled, install };
}

interface SparkleItem {
  id: number;
  x: number;
  y: number;
  tx: string;
  ty: string;
  color: string;
  size: number;
}

export const EngagementEffects: React.FC<{ enableGravityButton?: boolean }> = ({
  enableGravityButton = true,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
  const [gravityOn, setGravityOn] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const sparkleIdRef = useRef(0);
  const konamiIdxRef = useRef(0);

  // Scroll progress listener
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress((doc.scrollTop / total) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Subtle gold cursor sparkles
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.webdriver) return;
    const onMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.12) return;
      const id = ++sparkleIdRef.current;
      const item: SparkleItem = {
        id,
        x: e.clientX - 4,
        y: e.clientY - 4,
        tx: `${(Math.random() - 0.5) * 55}px`,
        ty: `${(Math.random() - 0.5) * 55}px`,
        color: Math.random() > 0.5 ? '#c9a84c' : '#e8c97a',
        size: 4 + Math.random() * 5,
      };
      setSparkles((prev) => [...prev.slice(-7), item]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 580);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Konami code easter egg: ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === konami[konamiIdxRef.current]) {
        konamiIdxRef.current += 1;
        if (konamiIdxRef.current === konami.length) {
          konamiIdxRef.current = 0;
          setGravityOn((prev) => !prev);
        }
      } else {
        konamiIdxRef.current = 0;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Anti-gravity physics effect on landing elements
  useEffect(() => {
    if (!gravityOn) return;
    const selectors = [
      '.gravity-target',
      '.feature-card-item',
      '.step-card-item',
      '.price-card-item',
      '.market-stat-item',
    ];
    const nodes: {
      el: HTMLElement;
      origTransform: string;
      origTransition: string;
      vx: number;
      vy: number;
      x: number;
      y: number;
      rot: number;
      rotV: number;
    }[] = [];

    selectors.forEach((sel) => {
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        nodes.push({
          el,
          origTransform: el.style.transform,
          origTransition: el.style.transition,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          x: 0,
          y: 0,
          rot: 0,
          rotV: (Math.random() - 0.5) * 1.5,
        });
        el.style.transition = 'none';
      });
    });

    let frameId = 0;
    const animate = () => {
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.rot += n.rotV;
        if (Math.abs(n.x) > 45) n.vx *= -0.85;
        if (Math.abs(n.y) > 35) n.vy *= -0.85;
        if (Math.abs(n.rot) > 12) n.rotV *= -0.85;
        n.el.style.transform = `translate(${n.x.toFixed(1)}px, ${n.y.toFixed(1)}px) rotate(${n.rot.toFixed(1)}deg)`;
      });
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      nodes.forEach((n) => {
        n.el.style.transition = n.origTransition || 'transform 0.4s ease';
        n.el.style.transform = n.origTransform || '';
      });
    };
  }, [gravityOn]);

  const particles = [
    { left: '8vw', size: 3, dur: 14, delay: 0 },
    { left: '19vw', size: 4, dur: 18, delay: 2 },
    { left: '34vw', size: 2.5, dur: 12, delay: 4 },
    { left: '52vw', size: 3.5, dur: 16, delay: 1 },
    { left: '68vw', size: 4, dur: 20, delay: 3 },
    { left: '83vw', size: 3, dur: 15, delay: 2.5 },
    { left: '92vw', size: 2.5, dur: 13, delay: 0.8 },
  ];

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[1000] transition-all duration-100 pointer-events-none"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #c9a84c, #e8c97a)',
          boxShadow: '0 0 8px rgba(201,168,76,0.6)',
        }}
      />

      {/* Floating ambient particles */}
      {particles.map((p, idx) => (
        <div
          key={idx}
          className="unisell-particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Cursor Sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="unisell-sparkle"
          style={
            {
              left: `${s.x}px`,
              top: `${s.y}px`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              '--tx': s.tx,
              '--ty': s.ty,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Anti-Gravity Mode Banner & Secret Button */}
      {enableGravityButton && (
        <>
          <button
            type="button"
            onClick={() => setGravityOn((prev) => !prev)}
            title="Toggle Anti-Gravity Mode ✦"
            aria-label="Toggle Anti-Gravity Mode"
            className="fixed bottom-6 left-6 w-9 h-9 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center text-base text-[#c9a84c] z-[500] opacity-50 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
          >
            ✦
          </button>

          {gravityOn && (
            <div
              onClick={() => setGravityOn(false)}
              role="status"
              className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-[#090d18] px-6 py-2 rounded-full text-xs font-bold z-[9998] cursor-pointer shadow-xl whitespace-nowrap"
            >
              🚀 Anti-Gravity Mode! Click here to restore
            </div>
          )}
        </>
      )}

      {/* Offline Toast */}
      {!isOnline && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 rounded-lg bg-[#f6a623] text-[#090d18] px-4 py-2 text-xs font-bold shadow-xl">
          <span>📡</span>
          <span>Offline Mode — Cached UNISELL data is active</span>
        </div>
      )}
    </>
  );
};
