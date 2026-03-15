'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Overlay from './Overlay';

// ─── Frame sequence config ────────────────────────────────────────────────────
const FRAME_COUNT = 166; // frame_000 … frame_165

function getFramePath(index: number): string {
  return `/sequence/frame_${String(index).padStart(3, '0')}_delay-0.041s.png`;
}

// ─── Cover-fit draw helper ────────────────────────────────────────────────────
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
) {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = canvasW / canvasH;

  let drawW: number, drawH: number, drawX: number, drawY: number;

  if (canvasAspect > imgAspect) {
    // Canvas is wider — fit to width
    drawW = canvasW;
    drawH = canvasW / imgAspect;
    drawX = 0;
    drawY = (canvasH - drawH) / 2;
  } else {
    // Canvas is taller — fit to height
    drawH = canvasH;
    drawW = canvasH * imgAspect;
    drawX = (canvasW - drawW) / 2;
    drawY = 0;
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  // Pre-load store
  const imagesRef       = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const loadedRef       = useRef<boolean[]>(new Array(FRAME_COUNT).fill(false));
  const loadedCountRef  = useRef<number>(0);

  // Current state
  const currentFrameRef = useRef<number>(0);
  const rafRef          = useRef<number | null>(null);

  // ── Scroll progress scoped to this container ────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Progress bar width for the top indicator
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // ── Render a single frame ───────────────────────────────────────────────
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !loadedRef.current[index]) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImageCover(ctx, img, canvas.width, canvas.height);
  }, []);

  // ── Preload all frames ──────────────────────────────────────────────────
  useEffect(() => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.onload = () => {
        loadedRef.current[i] = true;
        loadedCountRef.current += 1;
        // Draw immediately on first frame
        if (i === 0) renderFrame(0);
      };
      img.src = getFramePath(i);
      imagesRef.current[i] = img;
    }
  }, [renderFrame]);

  // ── Canvas sizing (DPR-aware) ───────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = Math.floor(window.innerWidth  * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
      renderFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [renderFrame]);

  // ── Scroll-linked frame update (rAF-batched) ────────────────────────────
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.round(
      Math.min(Math.max(latest, 0), 1) * (FRAME_COUNT - 1),
    );
    currentFrameRef.current = index;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      renderFrame(index);
    });
  });

  return (
    <section ref={containerRef} className="relative" style={{ height: '500vh' }}>
      {/* ── Sticky viewport ──────────────────────────────────────────── */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Scroll progress bar — top edge */}
        <div className="absolute top-0 left-0 right-0 h-px z-20" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            className="h-full"
            style={{
              width: progressWidth,
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
            }}
          />
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block"
          style={{ backgroundColor: '#121212' }}
        />

        {/* Vignette — subtle edge darkening for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Overlay text sections */}
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
