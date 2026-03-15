'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ─── Icons ────────────────────────────────────────────────────────────────────
function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.5 2.22 2 2 0 012.49.04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.04-1.04a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

const contactInfo = [
  { icon: <EmailIcon />,    label: 'Email',    value: 'imaashishbhaskar@gmail.com', href: 'mailto:imaashishbhaskar@gmail.com' },
  { icon: <PhoneIcon />,    label: 'Phone',    value: '+91-9570929270', href: 'tel:+919570929270' },
  { icon: <LinkedInIcon />, label: 'LinkedIn', value: 'linkedin.com/in/aashishbhaskar', href: 'https://www.linkedin.com/in/aashishbhaskar/' },
  { icon: <GitHubIcon />,   label: 'GitHub',   value: 'github.com/inevitable07',   href: 'https://github.com/inevitable07' },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Contact() {
  const headerRef  = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.2), transparent)' }}
      />
      {/* Ambient glow */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }}
      />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div id="contact" ref={headerRef} className="mb-16 text-center mx-auto scroll-mt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          Let&apos;s Talk
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em] mb-4"
        >
          Get In Touch<span className="text-white/15">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="text-white/35 text-sm font-light leading-relaxed max-w-lg mx-auto"
        >
          Have a question or want to work together? Fill out the form below or reach out directly through my contact information.
        </motion.p>
      </div>

      {/* ── Two-column body ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">

        {/* ── Contact Form ────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 md:p-9"
        >
          <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col items-center justify-center gap-4 py-12 text-center"
            >
              <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Message sent!</p>
              <p className="text-white/35 text-sm">I&apos;ll get back to you as soon as possible.</p>
              <button
                onClick={() => { setSent(false); setError(''); }}
                className="mt-2 text-xs text-white/30 hover:text-white/60 underline underline-offset-2 transition-colors"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              variants={stagger}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200"
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200"
                />
              </motion.div>

              {/* Message */}
              <motion.div variants={fadeUp}>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Your message..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200 resize-none"
                />
              </motion.div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400/80 bg-red-500/[0.08] border border-red-500/20 rounded-lg px-4 py-3"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.div variants={fadeUp}>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-50 transition-all duration-300"
                >
                  {sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <SendIcon />
                      Send Message
                    </>
                  )}
                </button>
              </motion.div>
            </form>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>

        {/* ── Contact Info ─────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col gap-4"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7"
          >
            <p className="text-xs uppercase tracking-[0.35em] font-semibold text-white/30 mb-6">
              Contact Information
            </p>
            <div className="flex flex-col gap-5">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3.5"
                >
                  <span className="mt-0.5 text-white/30 group-hover:text-white/70 transition-colors duration-200 shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/25 font-medium mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm text-white/55 group-hover:text-white/80 transition-colors duration-200 break-all">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-widest text-white/25 font-medium mb-4">
                Follow Me
              </p>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Tagline card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-7 py-5 text-center"
          >
            <p className="text-xs text-white/30 font-light leading-relaxed">
              Looking forward to hearing from you!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
