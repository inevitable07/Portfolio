'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const navLinks = [
  { label: 'Work', href: '#work' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pastHeroRef = useRef(false);

  // Only show navbar after the user has scrolled past the hero section.
  // Once past hero: show on scroll, hide 1.5 s after scrolling stops.
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      const beyondHero = window.scrollY + window.innerHeight * 0.1 >= heroBottom;

      if (!beyondHero) {
        // Still inside hero — keep hidden, clear any pending timer
        pastHeroRef.current = false;
        setVisible(false);
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        return;
      }

      // Past hero — show and start idle-hide timer
      pastHeroRef.current = true;
      setVisible(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setVisible(false), 1500);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <nav className="relative flex items-center justify-between px-6 md:px-10 py-5">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-1 text-white font-bold text-lg tracking-tight select-none"
          aria-label="Home"
        >
          <span style={{ color: '#f97316' }}>A</span>
          <span className="text-white">ashish</span>
          <span style={{ color: '#f97316' }}>.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative text-white/50 hover:text-white text-sm tracking-wide font-medium transition-colors duration-200"
            >
              {link.label}
              {/* Animated underline */}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300 ease-out" />
            </Link>
          ))}
          <Link
            href="#contact"
            className="relative px-5 py-2 text-sm font-medium text-white/80 hover:text-white border border-white/15 hover:border-white/35 rounded-full transition-all duration-300"
          >
            Contact
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 z-10"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-white/70 origin-center transition-colors"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            className="block w-5 h-px bg-white/70"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-white/70 origin-center"
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-0 right-0 top-full overflow-hidden backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex flex-col gap-0 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-white/60 hover:text-white text-base font-medium border-b border-white/[0.04] last:border-none transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-4 mb-2 py-2.5 text-center text-sm font-medium text-white border border-white/15 rounded-full transition-all"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
