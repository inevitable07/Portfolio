'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

interface SkillData {
  _id: string;
  name: string;
  icon: string;
  order: number;
  category: 'technical' | 'soft';
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Skill Card ──────────────────────────────────────────────────────────────
function SkillCard({ skill }: { skill: SkillData }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 text-center hover:border-white/[0.13] transition-colors duration-300"
    >
      <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-white/[0.05] flex items-center justify-center">
        {skill.icon ? (
          <Image
            src={skill.icon}
            alt={skill.name}
            width={64}
            height={64}
            className="object-cover"
          />
        ) : (
          <span className="text-white/20 text-xs">--</span>
        )}
      </div>
      <p className="text-sm text-white/70 font-medium">{skill.name}</p>
    </motion.div>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 animate-pulse">
      <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/[0.05]" />
      <div className="h-4 w-20 mx-auto rounded bg-white/[0.05]" />
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export default function Skills() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  const [skills, setSkills] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  // Re-fetch when returning from admin panel
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchSkills();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchSkills]);

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
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16 text-white/25">
          <p className="text-lg">No skills yet</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-14">
          {(['technical', 'soft'] as const).map((cat) => {
            const group = skills.filter((s) => (s.category ?? 'technical') === cat);
            if (group.length === 0) return null;
            return (
              <div key={cat}>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="text-[11px] uppercase tracking-[0.35em] text-white/30 mb-6 font-light"
                >
                  {cat === 'technical' ? 'Technical Skills' : 'Soft Skills'}
                </motion.p>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {group.map((skill) => (
                    <SkillCard key={skill._id} skill={skill} />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
