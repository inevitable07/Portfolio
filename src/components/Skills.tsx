'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const skillGroups = [
  {
    heading: 'Cloud & Infrastructure',
    color: 'from-sky-500 to-blue-600',
    skills: [
      { name: 'AWS', level: 90 },
      { name: 'Terraform', level: 85 },
      { name: 'Kubernetes', level: 80 },
      { name: 'Docker', level: 92 },
    ],
  },
  {
    heading: 'CI/CD & Automation',
    color: 'from-violet-500 to-purple-600',
    skills: [
      { name: 'GitHub Actions', level: 88 },
      { name: 'Jenkins', level: 78 },
      { name: 'ArgoCD', level: 72 },
      { name: 'Ansible', level: 75 },
    ],
  },
  {
    heading: 'Observability & Security',
    color: 'from-emerald-500 to-teal-600',
    skills: [
      { name: 'Prometheus / Grafana', level: 82 },
      { name: 'ELK Stack', level: 74 },
      { name: 'Vault', level: 68 },
      { name: 'Datadog', level: 70 },
    ],
  },
];

// ─── Single bar ───────────────────────────────────────────────────────────────
function SkillBar({
  name,
  level,
  color,
  index,
  inView,
}: {
  name: string;
  level: number;
  color: string;
  index: number;
  inView: boolean;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm text-white/70 font-medium">{name}</span>
        <motion.span
          className="text-xs text-white/35 font-light tabular-nums"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.3 }}
        >
          {level}%
        </motion.span>
      </div>

      {/* Track */}
      <div className="w-full h-1 rounded-full bg-white/[0.07] overflow-hidden">
        {/* Fill */}
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{
            duration: 1.0,
            delay: index * 0.08 + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ willChange: 'width' }}
        />
      </div>
    </div>
  );
}

// ─── Skill group card ─────────────────────────────────────────────────────────
function SkillGroup({
  group,
  cardIndex,
}: {
  group: (typeof skillGroups)[number];
  cardIndex: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: cardIndex * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7"
    >
      <p
        className={`text-xs uppercase tracking-[0.35em] font-semibold bg-gradient-to-r ${group.color} bg-clip-text text-transparent mb-6`}
      >
        {group.heading}
      </p>
      {group.skills.map((skill, i) => (
        <SkillBar
          key={skill.name}
          name={skill.name}
          level={skill.level}
          color={group.color}
          index={i}
          inView={inView}
        />
      ))}
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Skills() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="skills"
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative py-28 px-6 md:px-12 lg:px-20"
    >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.18), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.07) 0%, transparent 70%)' }}
      />
      {/* Header */}
      <div ref={headerRef} className="mb-16 text-center mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          Expertise
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Skills
          <span className="text-white/15">.</span>
        </motion.h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {skillGroups.map((group, i) => (
          <SkillGroup key={group.heading} group={group} cardIndex={i} />
        ))}
      </div>
    </section>
  );
}
