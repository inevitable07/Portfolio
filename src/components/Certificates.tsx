'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const certificates = [
  {
    title: 'AWS Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    date: 'Jan 2024',
    credential: 'AWS-SAA-C03',
    color: 'from-amber-500 to-orange-500',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: 'Certified Kubernetes Administrator',
    issuer: 'Cloud Native Computing Foundation',
    date: 'Apr 2024',
    credential: 'CKA-2024',
    color: 'from-sky-500 to-blue-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    title: 'HashiCorp Terraform Associate',
    issuer: 'HashiCorp',
    date: 'Jul 2024',
    credential: 'TF-003',
    color: 'from-violet-500 to-purple-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <polyline points="22 8.5 12 15.5 2 8.5" />
        <line x1="2" y1="15.5" x2="12" y2="8.5" />
        <line x1="12" y1="8.5" x2="22" y2="15.5" />
      </svg>
    ),
  },
  {
    title: 'GitHub Actions CI/CD',
    issuer: 'GitHub',
    date: 'Oct 2023',
    credential: 'GH-ACTIONS-23',
    color: 'from-emerald-500 to-teal-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

const achievements = [
  {
    label: 'Open Source Contributions',
    value: '20+',
    sub: 'merged pull requests',
    color: 'text-sky-400',
  },
  {
    label: 'Cloud Resources Managed',
    value: '500+',
    sub: 'across AWS & GCP',
    color: 'text-violet-400',
  },
  {
    label: 'Deployment Pipelines Built',
    value: '30+',
    sub: 'end-to-end CI/CD',
    color: 'text-emerald-400',
  },
  {
    label: 'Uptime Maintained',
    value: '99.9%',
    sub: 'on production systems',
    color: 'text-amber-400',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Certificate Card ─────────────────────────────────────────────────────────
function CertCard({ cert, index }: { cert: typeof certificates[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 hover:border-white/[0.13] transition-colors duration-300"
    >
      {/* Icon + credential */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cert.color} bg-opacity-10 flex items-center justify-center text-white/70`}
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span className={`bg-gradient-to-br ${cert.color} bg-clip-text text-transparent`}>
            {cert.icon}
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/20 tracking-wider">{cert.credential}</span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-white leading-snug tracking-tight mb-1">
        {cert.title}
      </h3>

      {/* Issuer + date */}
      <p className="text-xs text-white/35 font-light mb-4">{cert.issuer}</p>

      {/* Bottom bar */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
        <span className={`text-[10px] uppercase tracking-[0.3em] font-semibold bg-gradient-to-r ${cert.color} bg-clip-text text-transparent`}>
          Certified
        </span>
        <span className="text-[11px] text-white/30">{cert.date}</span>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Certificates() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const achRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="certificates"
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative py-28 px-6 md:px-12 lg:px-20"
    >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.18), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.07) 0%, transparent 70%)' }}
      />
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div ref={headerRef} className="mb-16 text-center mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          Credentials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Certificates<span className="text-white/15">.</span>
        </motion.h2>
      </div>

      {/* ── Certificate Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-20">
        {certificates.map((cert, i) => (
          <CertCard key={cert.credential} cert={cert} index={i} />
        ))}
      </div>

      {/* ── Achievements ────────────────────────────────────────────────── */}
      <motion.div
        ref={achRef}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="max-w-6xl mx-auto"
      >
        {/* Sub-header */}
        <motion.p
          variants={fadeUp}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-10 font-light text-center"
        >
          Achievements
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 text-center"
            >
              <p className={`text-4xl sm:text-5xl font-black tracking-tight mb-1 ${item.color}`}>
                {item.value}
              </p>
              <p className="text-xs text-white/25 font-light mb-1">{item.sub}</p>
              <p className="text-sm text-white/55 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
