'use client';

import React from 'react';
import { useAuthStore } from '../../../lib/auth-store';

export default function DashboardPage() {
  const { user, activeWorkspace } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">
          Welcome back, {user?.name || 'Creator'}!
        </h1>
        <p className="mt-1 text-slate-400">
          Active Workspace:{' '}
          <span className="font-semibold text-indigo-400">
            {activeWorkspace?.name || 'Default Workspace'}
          </span>{' '}
          ({activeWorkspace?.role || 'OWNER'})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Posts</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">0</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Scheduled</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">0</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Published</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">0</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Failed</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">0</div>
        </div>
      </div>
    </div>
  );
}
