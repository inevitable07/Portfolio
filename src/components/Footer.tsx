'use client';

import { useEffect, useRef, useState } from 'react';

function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const already = sessionStorage.getItem('_v_seen');

    if (already) {
      fetch('/api/visitors').then(r => r.json()).then(d => setCount(d.count)).catch(() => {});
    } else {
      sessionStorage.setItem('_v_seen', '1');
      fetch('/api/visitors', { method: 'POST' })
        .then(r => r.json())
        .then(d => setCount(d.count))
        .catch(() => {});
    }
  }, []);

  return count;
}

function AnimatedCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1200;
    const from = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(from + (value - from) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const count = useVisitorCount();

  return (
    <footer
      className="py-10 px-6 md:px-12 lg:px-20 relative"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }}
      />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/20 font-light">© {year}</span>
          <span className="text-white/20 font-light">·</span>
          <span className="text-white/20 font-light">
            Designed &amp; built with obsessive attention to detail.
          </span>
        </div>

        {/* Right — visitor counter */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs tracking-widest font-medium"
          style={{
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.025)',
            color: 'rgba(255,255,255,0.38)',
          }}
        >
          {/* Eye icon */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>

          {count === null ? (
            <span style={{ opacity: 0.4 }}>···</span>
          ) : (
            <>
              <AnimatedCount value={count} />
              <span className="uppercase" style={{ letterSpacing: '0.15em', opacity: 0.6 }}>
                visitors
              </span>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
