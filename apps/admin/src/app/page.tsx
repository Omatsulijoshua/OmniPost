import React from 'react';

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-100">OmniPost Admin Control Panel</h1>
      <p className="mt-2 text-slate-400">
        System health, tenant metrics, publishing engine queues, security audit logs, and subscriptions.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">Workspaces</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">0</div>
        </div>
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">Publishing Queue</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">0 Active</div>
        </div>
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">Failed Jobs</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">0</div>
        </div>
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">System Status</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">HEALTHY</div>
        </div>
      </div>
    </div>
  );
}
