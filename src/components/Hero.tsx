'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

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

// ─── Inner component — receives the already-detected videoSrc ────────────────
function HeroContent({ videoSrc }: { videoSrc: string }) {
  const hasVideo = Boolean(videoSrc);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRevealedRef = useRef(false);
  const [textVisible, setTextVisible] = useState(!hasVideo);
  const [scrollHint, setScrollHint] = useState(false);

  useEffect(() => {
    if (!hasVideo) return;

    const video = videoRef.current;
    if (!video) return;

    video.loop = false;

    const onTimeUpdate = () => {
      if (video.currentTime >= 1.3 && !textRevealedRef.current) {
        textRevealedRef.current = true;
        video.playbackRate = 0.8;
        setTextVisible(true);
      }
    };

    const onEnded = () => {
      setScrollHint(true);
      // Ensure text is visible even if video was shorter than 1.3 s
      if (!textRevealedRef.current) {
        textRevealedRef.current = true;
        setTextVisible(true);
      }
      video.loop = true;
      video.play().catch(() => {});
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    const fallbackTimer = setTimeout(() => {
      setScrollHint(true);
      if (!textRevealedRef.current) {
        textRevealedRef.current = true;
        setTextVisible(true);
      }
    }, 6000);

    const tryPlay = () => {
      video.play().catch(() => {
        textRevealedRef.current = true;
        setTextVisible(true);
        setScrollHint(true);
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('canplay', tryPlay);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative"
      style={{ backgroundColor: '#121212' }}
    >
      {/* Logo */}
      <a
        href="/admin"
        className="absolute top-6 left-6 sm:left-8 lg:left-10 z-20"
        aria-label="Admin Portal"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
      </a>

      {/*
       * VIDEO ELEMENT
       * ─ Mobile  (<lg): in normal flow, h-screen — sits above the text section
       * ─ Desktop (lg+): absolute, covers the right 55% column behind the text
       */}
      {hasVideo && (
        <div className="relative h-screen lg:absolute lg:inset-y-0 lg:left-[45%] lg:right-0 lg:h-auto z-0 overflow-hidden">
          {/* Mobile: fade the bottom of the video into the page background */}
          <div
            className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-10 lg:hidden"
            style={{ background: 'linear-gradient(to top, #121212 0%, transparent 100%)' }}
          />
          {/* Desktop: fade the left edge of the right column */}
          <div
            className="absolute inset-0 pointer-events-none z-10 hidden lg:block"
            style={{ background: 'linear-gradient(to right, #121212 0%, transparent 18%, transparent 100%)' }}
          />
          <video
            ref={videoRef}
            muted
            playsInline
            poster="/hero-poster.png"
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[90%_top]"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Scroll hint — mobile only, sits at the bottom of the video viewport */}
          <AnimatePresence>
            {scrollHint && (
              <motion.div
                key="scroll-hint-mobile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="lg:hidden absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/25 font-light">Scroll</span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-5 h-5 flex items-center justify-center"
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/30">
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/*
       * HERO TEXT
       * ─ Mobile: flows naturally below the video block, centred, padded
       * ─ Desktop: h-screen tall, left 45% column, left-aligned
       */}
      <div className={`relative z-10 lg:h-screen flex items-center ${hasVideo ? 'lg:justify-start' : 'justify-center'}`}>
        <div
          className={`${hasVideo ? 'lg:w-[45%]' : ''} w-full flex flex-col items-center lg:items-start justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-14 lg:py-0`}
        >
          <AnimatePresence>
            {textVisible && (
              <motion.div
                key="hero-text"
                variants={containerVariants}
                initial={hasVideo ? 'hidden' : 'visible'}
                animate="visible"
                className="text-center lg:text-left"
              >
                <motion.p
                  variants={lineVariants}
                  className="text-xs uppercase tracking-[0.45em] text-white/35 mb-4 font-light"
                >
                  Hello, I&apos;m
                </motion.p>

                <motion.h1
                  variants={lineVariants}
                  className="text-[clamp(2.2rem,8vw,6rem)] font-black text-white tracking-[-0.03em] leading-[0.95] mb-6"
                >
                  Aashish
                  <br />
                  Bhaskar
                  <span className="text-white/20">.</span>
                </motion.h1>

                <motion.div
                  variants={lineVariants}
                  className="flex items-center justify-center lg:justify-start gap-3 mb-5"
                >
                  <span className="w-6 h-px bg-white/30" />
                  <p className="text-sm text-white/55 font-light tracking-[0.18em] uppercase">
                    DevOps Engineer
                  </p>
                </motion.div>

                <motion.p
                  variants={lineVariants}
                  className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 font-light mb-8"
                >
                  I design, build&nbsp;&amp;&nbsp;ship infrastructure that moves
                  as fast as the teams that use it.
                </motion.p>

                <motion.div
                  variants={lineVariants}
                  className="flex flex-wrap justify-center lg:justify-start gap-3"
                >
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors duration-300"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
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
      </div>

      {/* Bottom vignette — desktop only (section = h-screen, so this blends into next section) */}
      <div
        className="hidden lg:block absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #121212 0%, transparent 100%)' }}
      />

      {/* Scroll hint — desktop only */}
      <AnimatePresence>
        {scrollHint && (
          <motion.div
            key="scroll-hint-desktop"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/25 font-light">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-5 flex items-center justify-center"
            >
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/30">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Exported component — shows loader first, then hero ─────────────────────
export default function Hero() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  return (
    <>
      {videoSrc !== null && <HeroContent videoSrc={videoSrc} />}

      <AnimatePresence>
        {videoSrc === null && (
          <LoadingScreen onComplete={setVideoSrc} />
        )}
      </AnimatePresence>
    </>
  );
}
