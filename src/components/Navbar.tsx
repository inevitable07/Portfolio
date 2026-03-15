'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const navLinks = [
  { label: 'About', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#work' },
  { label: 'Journey', href: '#education' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pastHeroRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      const beyondHero = window.scrollY + window.innerHeight * 0.1 >= heroBottom;

      if (!beyondHero) {
        pastHeroRef.current = false;
        setVisible(false);
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        return;
      }

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
      <nav className="relative flex items-center justify-between px-6 md:px-10 py-4">
        {/* Logo - left — scrolls to hero */}
        <Link href="#hero" className="flex items-center select-none" aria-label="Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav - centered pill */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <div
            className="flex items-center gap-1 px-2 py-2 rounded-full border border-white/[0.08]"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-1.5 text-white/60 hover:text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 z-10"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-white/70 origin-center"
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
            style={{ backgroundColor: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
