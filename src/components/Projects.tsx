'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const projects = [
  {
    num: '01',
    title: 'Immersive 3D Gallery',
    category: 'WebGL / Interaction Design',
    description:
      'A real-time 3D gallery powered by custom GLSL shaders. Every scroll triggers a physics-based camera transition between exhibits.',
    tags: ['Three.js', 'GLSL', 'Next.js', 'R3F'],
    year: '2025',
    href: '#',
    accent: {
      from: 'from-sky-500/[0.15]',
      glow: 'hover:shadow-sky-500/[0.12]',
      border: 'hover:border-sky-500/30',
      tag: 'text-sky-400',
      line: 'bg-sky-400',
    },
  },
  {
    num: '02',
    title: 'Motion-First App',
    category: 'UI/UX Engineering',
    description:
      'Physics-based micro-interactions and scroll-linked hero sequences. Every element is choreographed to feel alive.',
    tags: ['Framer Motion', 'React', 'TypeScript', 'Radix UI'],
    year: '2025',
    href: '#',
    accent: {
      from: 'from-violet-500/[0.15]',
      glow: 'hover:shadow-violet-500/[0.12]',
      border: 'hover:border-violet-500/30',
      tag: 'text-violet-400',
      line: 'bg-violet-400',
    },
  },
  {
    num: '03',
    title: 'E-Commerce Platform',
    category: 'Full-Stack Development',
    description:
      'Edge-rendered storefront with sub-100ms TTFB, AI-powered search, and a checkout flow that converts 2× better than average.',
    tags: ['Next.js 14', 'Supabase', 'Stripe', 'Vercel'],
    year: '2024',
    href: '#',
    accent: {
      from: 'from-emerald-500/[0.15]',
      glow: 'hover:shadow-emerald-500/[0.12]',
      border: 'hover:border-emerald-500/30',
      tag: 'text-emerald-400',
      line: 'bg-emerald-400',
    },
  },
  {
    num: '04',
    title: 'Brand Identity System',
    category: 'Design Systems',
    description:
      'End-to-end visual identity: logo, motion guidelines, design tokens, and a 200-component library shipped to production.',
    tags: ['Figma', 'Storybook', 'Design Tokens'],
    year: '2024',
    href: '#',
    accent: {
      from: 'from-rose-500/[0.15]',
      glow: 'hover:shadow-rose-500/[0.12]',
      border: 'hover:border-rose-500/30',
      tag: 'text-rose-400',
      line: 'bg-rose-400',
    },
  },
];



// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
      <section
        ref={sectionRef}
        style={{ backgroundColor: '#0a0a0a' }}
        className="relative py-28 px-6 md:px-12 lg:px-20"
      >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.18), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.07) 0%, transparent 70%)' }}
      />
        {/* Section header */}
        <div id="work" className="mb-16 md:mb-20 text-center mx-auto scroll-mt-20">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
          >
            Selected Work
          </motion.p>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
          >
            Projects
            <span className="text-white/15">.</span>
          </motion.h2>
        </div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {projects.map((p) => (
            <ProjectCard key={p.num} project={p} />
          ))}
        </motion.div>
      </section>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const { num, title, category, description, tags, year, href, accent } = project;

  return (
    <motion.a
      href={href}
      variants={fadeUp}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={`
        group relative flex flex-col rounded-2xl overflow-hidden
        border border-white/[0.07] ${accent.border}
        bg-gradient-to-br ${accent.from} to-transparent
        backdrop-blur-sm
        p-7 md:p-8
        shadow-xl ${accent.glow}
        transition-all duration-500
      `}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-7">
        <span className="text-5xl font-black text-white/[0.07] leading-none select-none">
          {num}
        </span>
        <span className={`text-[11px] font-semibold uppercase tracking-widest ${accent.tag}`}>
          {year}
        </span>
      </div>

      {/* Content */}
      <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-2.5 font-light">
        {category}
      </p>
      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight leading-snug">
        {title}
      </h3>
      <p className="text-white/40 text-sm leading-relaxed flex-1">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-1 rounded-md border border-white/[0.08] text-white/35 font-medium tracking-wide"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`
          flex items-center gap-2 mt-6 text-xs font-medium uppercase tracking-widest
          ${accent.tag} opacity-50 group-hover:opacity-100 transition-opacity duration-300
        `}
      >
        <span>View Case Study</span>
        <svg
          className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {/* Hover bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-px
          ${accent.line}
          opacity-0 group-hover:opacity-30 transition-opacity duration-500
        `}
      />
    </motion.a>
  );
}
