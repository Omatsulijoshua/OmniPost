'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLegacyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100 font-sans">
      <p className="text-xs text-slate-400 animate-pulse">Redirecting to OmniPost Admin Dashboard...</p>
    </div>
  );
}
