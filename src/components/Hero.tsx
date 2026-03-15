'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Text reveal variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.05 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRevealedRef = useRef(false);
  const [textVisible, setTextVisible] = useState(false);
  const [scrollHint, setScrollHint] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      // Reveal text at 1.3 s, only once
      if (video.currentTime >= 1.3 && !textRevealedRef.current) {
        textRevealedRef.current = true;
        video.playbackRate = 0.8; // cinematic slow-down
        setTextVisible(true);
      }
    };

    // Show scroll hint after the first loop completes
    const onLoop = () => {
      setScrollHint(true);
      video.removeEventListener('ended', onLoop);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    // `loop` is set on the element; fire once when the first cycle wraps
    // We detect this via a one-time 'ended' listener before the loop restarts.
    // We temporarily remove `loop` so `ended` fires, then re-add it.
    video.loop = false;
    const onEnded = () => {
      setScrollHint(true);
      video.loop = true;
      video.play().catch(() => {});
    };
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen"
      style={{ backgroundColor: '#121212' }}
    >
      {/* ── Two-column grid ────────────────────────────────────────────── */}
      {/*
        h-screen gives the grid a definite height so lg:h-full on the right
        column resolves correctly. min-h-screen lets it grow on small screens.
        No overflow-hidden on the section — nothing should be clipped.
      */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[45%_55%] h-screen min-h-screen">

        {/* ── LEFT — intro text ──────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-20 lg:py-0">
          <AnimatePresence>
            {textVisible && (
              <motion.div
                key="hero-text"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.p
                  variants={lineVariants}
                  className="text-xs uppercase tracking-[0.45em] text-white/35 mb-4 font-light"
                >
                  Hello, I&apos;m
                </motion.p>

                <motion.h1
                  variants={lineVariants}
                  className="text-[clamp(2.8rem,7vw,6rem)] font-black text-white tracking-[-0.03em] leading-[0.95] mb-6"
                >
                  Aashish
                  <br />
                  Bhaskar
                  <span className="text-white/20">.</span>
                </motion.h1>

                <motion.div
                  variants={lineVariants}
                  className="flex items-center gap-3 mb-5"
                >
                  <span className="w-6 h-px bg-white/30" />
                  <p className="text-sm text-white/55 font-light tracking-[0.18em] uppercase">
                    DevOps Engineer
                  </p>
                </motion.div>

                <motion.p
                  variants={lineVariants}
                  className="text-white/40 text-sm leading-relaxed max-w-sm font-light mb-8"
                >
                  I design, build&nbsp;&amp;&nbsp;ship infrastructure that moves
                  as fast as the teams that use it.
                </motion.p>

                <motion.div
                  variants={lineVariants}
                  className="flex flex-wrap gap-3"
                >
                  {/* Resume — triggers a file download */}
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors duration-300"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"
                      />
                    </svg>
                    Resume
                  </a>
                  <a
                    href="#contact"
                    className="px-6 py-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-medium transition-all duration-300"
                  >
                    Contact
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT — video ──────────────────────────────────────────── */}
        {/*
          h-[55vw] gives the stacked column a visible height on mobile.
          lg:h-full resolves against the grid's definite h-screen on desktop.
          No overflow-hidden — the video must not be clipped.
        */}
        <div className="relative w-full h-[55vw] lg:h-full">
          {/* subtle inner vignette on the left edge to blend into the text column */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, #121212 0%, transparent 18%, transparent 100%)',
            }}
          />
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            poster="/hero-poster.png"
            className="absolute inset-0 w-full h-full object-cover object-[90%_top]"
            preload="auto"
          >
            <source src="/animation.webm" type="video/webm" />
            <source src="/animation1.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* ── Bottom vignette ────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #121212 0%, transparent 100%)',
        }}
      />

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <AnimatePresence>
        {scrollHint && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/25 font-light">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-5 flex items-center justify-center"
            >
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                className="text-white/30"
              >
                <path
                  d="M1 1l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
