'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const navLinks = [
  { label: 'About', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#work' },
  { label: 'Journey', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [inHero, setInHero] = useState(true);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pastHeroRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      const beyondHero = window.scrollY + window.innerHeight * 0.1 >= heroBottom;

      // Track whether we're still in the hero section (for mobile bottom nav)
      setInHero(!beyondHero);

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

  // Track which section is currently in view
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace('#', ''));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection('#' + entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Desktop top navbar ─────────────────────────────────────────── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
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
          <div className="flex absolute left-1/2 -translate-x-1/2">
            <div
              className="flex items-center gap-1 px-2 py-2 rounded-full border border-white/[0.08]"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                    activeSection === link.href
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile bottom nav bar — always visible EXCEPT during hero ── */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inHero ? 0 : 1, y: inHero ? 20 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{
          pointerEvents: inHero ? 'none' : 'auto',
          backgroundColor: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/45 hover:text-white/70'
                }`}
              >
                <NavIcon label={link.label} active={isActive} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}

/* ── Simple icon set for the mobile bottom nav ─────────────────────── */
function NavIcon({ label, active }: { label: string; active: boolean }) {
  const stroke = active ? 'currentColor' : 'currentColor';
  const sw = active ? '2' : '1.5';
  const cls = 'w-5 h-5';

  switch (label) {
    case 'About':
      return (
        <svg className={cls} fill="none" stroke={stroke} strokeWidth={sw} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
    case 'Skills':
      return (
        <svg className={cls} fill="none" stroke={stroke} strokeWidth={sw} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    case 'Projects':
      return (
        <svg className={cls} fill="none" stroke={stroke} strokeWidth={sw} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      );
    case 'Journey':
      return (
        <svg className={cls} fill="none" stroke={stroke} strokeWidth={sw} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
      );
    case 'Contact':
      return (
        <svg className={cls} fill="none" stroke={stroke} strokeWidth={sw} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    default:
      return null;
  }
}
