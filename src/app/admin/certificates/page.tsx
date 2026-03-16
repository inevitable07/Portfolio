'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CertificateItem {
  _id: string;
  name: string;
  thumbnail: string;
  certificateLink: string;
  order: number;
  featured?: boolean;
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCertificates(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCertificates((prev) => prev.filter((c) => c._id !== id));
      }
    } catch {
      console.error('Failed to delete certificate');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Certificates</h2>
        <Link
          href="/admin/certificates/new"
          className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all"
        >
          + Add Certificate
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg mb-2">No certificates yet</p>
          <p className="text-sm">Click &ldquo;+ Add Certificate&rdquo; to create your first certificate.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {certificates.map((c) => (
            <div
              key={c._id}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-16 h-10 rounded-md overflow-hidden bg-white/[0.05] flex-shrink-0">
                {c.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                    No img
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  {(c.featured ?? true) && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 bg-amber-500/10 text-amber-400/70">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {c.certificateLink && (
                    <span className="text-[10px] text-white/30 truncate max-w-[200px]">{c.certificateLink}</span>
                  )}
                  <span className="text-[10px] text-white/25">Order: {c.order}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/certificates/${c._id}/edit`}
                  className="px-3 py-1.5 rounded-md text-xs border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 transition-all"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(c._id, c.name)}
                  className="px-3 py-1.5 rounded-md text-xs border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
