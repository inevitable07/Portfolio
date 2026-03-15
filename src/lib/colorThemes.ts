export interface ColorAccent {
  from: string;
  glow: string;
  border: string;
  tag: string;
  line: string;
  ring: string;
}

export const COLOR_THEMES: Record<string, ColorAccent> = {
  sky: {
    from: 'from-sky-500/[0.15]',
    glow: 'hover:shadow-sky-500/[0.12]',
    border: 'hover:border-sky-500/30',
    tag: 'text-sky-400',
    line: 'bg-sky-400',
    ring: 'rgba(56,189,248,0.4)',
  },
  violet: {
    from: 'from-violet-500/[0.15]',
    glow: 'hover:shadow-violet-500/[0.12]',
    border: 'hover:border-violet-500/30',
    tag: 'text-violet-400',
    line: 'bg-violet-400',
    ring: 'rgba(139,92,246,0.4)',
  },
  emerald: {
    from: 'from-emerald-500/[0.15]',
    glow: 'hover:shadow-emerald-500/[0.12]',
    border: 'hover:border-emerald-500/30',
    tag: 'text-emerald-400',
    line: 'bg-emerald-400',
    ring: 'rgba(16,185,129,0.4)',
  },
  rose: {
    from: 'from-rose-500/[0.15]',
    glow: 'hover:shadow-rose-500/[0.12]',
    border: 'hover:border-rose-500/30',
    tag: 'text-rose-400',
    line: 'bg-rose-400',
    ring: 'rgba(244,63,94,0.4)',
  },
  indigo: {
    from: 'from-indigo-500/[0.15]',
    glow: 'hover:shadow-indigo-500/[0.12]',
    border: 'hover:border-indigo-500/30',
    tag: 'text-indigo-400',
    line: 'bg-indigo-400',
    ring: 'rgba(99,102,241,0.4)',
  },
  amber: {
    from: 'from-amber-500/[0.15]',
    glow: 'hover:shadow-amber-500/[0.12]',
    border: 'hover:border-amber-500/30',
    tag: 'text-amber-400',
    line: 'bg-amber-400',
    ring: 'rgba(245,158,11,0.4)',
  },
};

export const THEME_KEYS = Object.keys(COLOR_THEMES);
