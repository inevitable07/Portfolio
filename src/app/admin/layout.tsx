'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecked(true);
      return;
    }

    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setChecked(true);
        } else {
          router.replace('/admin/login');
        }
      })
      .catch(() => router.replace('/admin/login'));
  }, [pathname, router]);

  // Login page renders directly without the admin shell
  if (pathname === '/admin/login') return <>{children}</>;

  if (!checked) return null;

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/[0.07] px-6 py-4 flex items-center justify-between">
        <h1 className="text-sm font-bold tracking-wide">Portfolio Admin</h1>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Back to Site
          </a>
          <button
            onClick={handleLogout}
            className="text-xs text-white/40 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
