'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

/** Thin horizontal rule separator */
function Rule() {
  return <div className="w-10 h-px bg-white/20 mb-5" />;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  // ── Section 1 — center hero ──────────────────────────────────────────────
  // Fade in fast, hold, fade out by 26%
  const s1Opacity = useTransform(scrollYProgress, [0, 0.04, 0.2, 0.27], [0, 1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0, 0.27], ['0%', '-4%']);

  // ── Section 2 — left ────────────────────────────────────────────────────
  const s2Opacity = useTransform(scrollYProgress, [0.27, 0.36, 0.48, 0.56], [0, 1, 1, 0]);
  const s2X = useTransform(scrollYProgress, [0.27, 0.37], ['-2%', '0%']);

  // ── Section 3 — right ───────────────────────────────────────────────────
  const s3Opacity = useTransform(scrollYProgress, [0.56, 0.65, 0.78, 0.87], [0, 1, 1, 0]);
  const s3X = useTransform(scrollYProgress, [0.56, 0.66], ['2%', '0%']);

  // ── Scroll hint — fades out early ───────────────────────────────────────
  const hintOpacity = useTransform(scrollYProgress, [0, 0.03, 0.12], [0, 1, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">

      {/* ── Section 1: center intro ──────────────────────────────────────── */}
      <motion.div
        style={{ opacity: s1Opacity, y: s1Y }}
        className="absolute inset-0 flex flex-col items-start justify-center px-5 sm:px-8 md:px-20"
      >
        <div>
          <motion.p
            className="text-xs uppercase tracking-[0.4em] text-white/35 mb-6 font-light"
          >
            Hello, I&apos;m
          </motion.p>

          <h1 className="text-[clamp(2rem,10vw,8rem)] font-black text-white tracking-[-0.03em] leading-none mb-4">
            Aashish Bhaskar
            <span className="text-white/20">.</span>
          </h1>

          <div className="flex items-center gap-3 mt-2">
            <span className="w-6 h-px bg-white/30" />
            <p className="text-sm md:text-lg text-white/55 font-light tracking-[0.15em] uppercase">
              DevOps Engineer
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Section 2: left ─────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: s2Opacity, x: s2X }}
        className="absolute inset-0 flex items-center justify-start px-5 sm:px-8 md:px-20"
      >
        <div className="max-w-md">
          <Rule />
          <p className="text-xs uppercase tracking-[0.35em] text-white/30 mb-4 font-light">
            What I do
          </p>
          <h2 className="text-[clamp(1.6rem,6vw,5.5rem)] font-black text-white leading-[0.95] tracking-tight">
            I build<br />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              digital
            </span>
            <br />
            experiences.
          </h2>
        </div>
      </motion.div>

      {/* ── Section 3: right ────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: s3Opacity, x: s3X }}
        className="absolute inset-0 flex items-center justify-start px-5 sm:px-8 md:px-20"
      >
        <div className="max-w-md">
          <Rule />
          <p className="text-xs uppercase tracking-[0.35em] text-white/30 mb-4 font-light">
            My approach
          </p>
          <h2 className="text-[clamp(1.6rem,6vw,5.5rem)] font-black text-white leading-[0.95] tracking-tight">
            Bridging<br />
            <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent">
              design
            </span>
            <br />
            &amp; engineering.
          </h2>
        </div>
      </motion.div>

      {/* ── Scroll hint ─────────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/25 font-light">
          Scroll
        </span>
        <div className="relative w-px h-10 bg-white/10 overflow-hidden rounded-full">
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 top-0 h-1/2 bg-white/50 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
