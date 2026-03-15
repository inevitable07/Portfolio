'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCertificate() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [certificateLink, setCertificateLink] = useState('');
  const [order, setOrder] = useState(1);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('certificateLink', certificateLink);
      formData.append('order', String(order));
      if (thumbnail) formData.append('thumbnail', thumbnail);

      const res = await fetch('/api/certificates', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create certificate');
      }

      router.push('/admin/certificates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200';

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-8">New Certificate</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="Certificate name" />
        </div>

        {/* Certificate Link */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Certificate Link</label>
          <input type="url" value={certificateLink} onChange={(e) => setCertificateLink(e.target.value)} className={inputCls} placeholder="https://..." />
        </div>

        {/* Order */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Math.max(1, Number(e.target.value)))} min={1} className={inputCls} />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/[0.08] file:text-sm file:font-medium file:bg-white/[0.04] file:text-white/60 hover:file:bg-white/[0.08] file:cursor-pointer file:transition-all"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-40 transition-all"
          >
            {saving ? 'Creating...' : 'Create Certificate'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg border border-white/[0.08] text-white/60 text-sm hover:text-white hover:border-white/20 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
