'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const milestones = [
  {
    year: '2016 â€“ 2019',
    title: 'Higher Secondary Education',
    institution: 'Delhi Public School, Ranchi',
    description:
      'Completed schooling with a focus on Science and Mathematics. Developed a strong analytical foundation and first exposure to programming through computer science electives.',
    side: 'right' as const,
  },
  {
    year: '2019 â€“ 2023',
    title: 'B.Tech â€“ Computer Science & Engineering',
    institution: 'XYZ University of Technology',
    description:
      'Graduated with honours in Computer Science. Specialised in cloud infrastructure and distributed systems. Led the university DevOps club, organising workshops on CI/CD pipelines, containerisation, and infrastructure-as-code.',
    side: 'left' as const,
  },
  {
    year: '2023 â€“ Present',
    title: 'Professional Certification & Growth',
    institution: 'AWS / HashiCorp / CNCF',
    description:
      'Earned AWS Solutions Architect Associate, Terraform Associate, and Certified Kubernetes Administrator (CKA) certifications. Continuously upskilling through hands-on projects and open-source contributions.',
    side: 'right' as const,
  },
];

// Gap between spine and card edge â€” must match Tailwind pl-12/pr-12 (3rem = 48px)
// Connector width = w-12 (3rem) to perfectly bridge spine â†’ card edge

function CardContent({ milestone }: { milestone: (typeof milestones)[0] }) {
  return (
    <>
      <span className="block text-[11px] uppercase tracking-[0.35em] text-white/30 font-light mb-2">
        {milestone.year}
      </span>
      <h3 className="text-base md:text-xl font-bold text-white tracking-tight leading-snug mb-1">
        {milestone.title}
      </h3>
      <p className="text-sm text-white/40 font-medium mb-3 tracking-wide">
        {milestone.institution}
      </p>
      <p className="text-sm text-white/50 font-light leading-relaxed">
        {milestone.description}
      </p>
    </>
  );
}

function TimelineRow({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = milestone.side === 'left';

  return (
    <div ref={ref} className="relative grid grid-cols-2">
      {/* â”€â”€ Left column â”€â”€ */}
      <div className="flex items-center justify-end pr-12">
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            className="relative w-full rounded-xl border border-white/[0.07] bg-white/[0.03] p-6"
          >
            {/*
              Connector: right edge of card â†’ spine
              right-0 + translate-x-full shifts element to start AT right-edge of card
              spanning exactly 3rem (48px, matching pr-12) to reach the spine
            */}
            <div className="absolute right-0 top-1/2 w-12 h-px bg-white/10 translate-x-full -translate-y-1/2" />
            <CardContent milestone={milestone} />
          </motion.div>
        )}
      </div>

      {/* â”€â”€ Right column â”€â”€ */}
      <div className="flex items-center justify-start pl-12">
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            className="relative w-full rounded-xl border border-white/[0.07] bg-white/[0.03] p-6"
          >
            {/*
              Connector: spine â†’ left edge of card
              left-0 + -translate-x-full shifts element leftward from card's left edge
              spanning exactly 3rem (48px, matching pl-12) back to the spine
            */}
            <div className="absolute left-0 top-1/2 w-12 h-px bg-white/10 -translate-x-full -translate-y-1/2" />
            <CardContent milestone={milestone} />
          </motion.div>
        )}
      </div>

      {/* â”€â”€ Spine dot â€” left-1/2 of grid = exactly on the spine â”€â”€ */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.25 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white/30 bg-[#0a0a0a] z-10"
      />
    </div>
  );
}

export default function Education() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="education"
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.18), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(56,189,248,0.07) 0%, transparent 70%)' }}
      />
      {/* â”€â”€ Section header â”€â”€ */}
      <div ref={headerRef} className="mb-20 text-center mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          Background
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Education
          <span className="text-white/15">.</span>
        </motion.h2>
      </div>

      {/* â”€â”€ Timeline â”€â”€ */}
      <div className="relative max-w-5xl mx-auto">

        {/* Vertical spine â€” absolutely fills the full height of the card list */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{ originY: 0 }}
          className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent pointer-events-none"
        />

        {/* Down arrow above cards â€” no negative positioning */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/25">
            <path
              d="M1 1l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-20">
          {milestones.map((m, i) => (
            <TimelineRow key={i} milestone={m} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
