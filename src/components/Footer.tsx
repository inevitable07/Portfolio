const socials = [
  { label: 'GitHub',   href: 'https://github.com' },
  { label: 'Twitter',  href: 'https://twitter.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-10 px-6 md:px-12 lg:px-20 relative"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }}
      />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/20 font-light">
            © {year}
          </span>
          <span className="text-white/20 font-light">·</span>
          <span className="text-white/20 font-light">
            Designed &amp; built with obsessive attention to detail.
          </span>
        </div>

        {/* Right — socials */}
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/25 hover:text-white/70 uppercase tracking-widest font-medium transition-colors duration-200"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
