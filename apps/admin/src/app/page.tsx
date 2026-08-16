'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '../stores/admin-auth-store';

export default function AdminLandingPage() {
  const router = useRouter();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
          OP
        </div>
        <p className="text-sm font-bold text-slate-300 animate-pulse">Loading OmniPost Admin Platform...</p>
      </div>
      <div className="fixed bottom-4 right-4 text-[10px] text-slate-600 font-mono">
        v1.0.0-build.2024
      </div>
    </div>
  );
}
