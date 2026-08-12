'use client';

import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Executive Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-400">
          Real-time operational metrics, platform health, publishing queues, and revenue statistics.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <h2 className="text-base font-bold text-slate-100">OmniPost Executive Operational Shell</h2>
        <p className="text-xs text-slate-400 mt-1">
          Sidebar navigation and layout shell configured for Admin Phase C.
        </p>
      </div>
    </div>
  );
}
