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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 font-black text-xl shadow-lg shadow-blue-600/30 animate-pulse">
          OP
        </div>
        <p className="text-xs text-slate-400 font-medium">Entering OmniPost Admin Portal...</p>
      </div>
    </div>
  );
}
