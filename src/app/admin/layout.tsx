'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Skip auth check on the login page
    if (pathname === '/admin/login') {
      setChecked(true);
      return;
    }

    const token = document.cookie
      .split('; ')
      .find((c) => c.startsWith('admin_token='))
      ?.split('=')[1];

    if (!token) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  // Login page renders directly without the admin shell
  if (pathname === '/admin/login') return <>{children}</>;

  // Show nothing while checking auth
  if (!checked) return null;

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0';
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
