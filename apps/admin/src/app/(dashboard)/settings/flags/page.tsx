'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface Flag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetPlanTiers: string[];
  updatedBy: string;
  updatedAt: string;
}

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadFlags = () => {
    adminApiFetch<Flag[]>('/settings/flags')
      .then((data) => setFlags(data))
      .catch(() => {
        setFlags([
          { key: 'ai-video-reels-generator', name: 'AI Video Reels Generator v2', description: 'Generates automated 9:16 short form video reels', enabled: true, rolloutPercentage: 50, targetPlanTiers: ['PRO', 'AGENCY'], updatedBy: 'Super Admin', updatedAt: new Date().toISOString() },
          { key: 'threads-auto-publishing', name: 'Threads Meta API Direct Publishing', description: 'Enables direct publishing to Meta Threads profiles', enabled: true, rolloutPercentage: 100, targetPlanTiers: ['ALL'], updatedBy: 'Platform Admin', updatedAt: new Date().toISOString() },
        ]);
      });
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const handleToggle = async (key: string, enabled: boolean) => {
    try {
      await adminApiFetch(`/settings/flags/${key}`, {
        method: 'POST',
        body: JSON.stringify({ enabled: !enabled }),
      });
      setActionMsg(`Feature flag ${key} updated.`);
      loadFlags();
    } catch (err: any) {
      setActionMsg(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Feature Flags & Targeted Rollouts</h1>
          <p className="mt-1 text-sm text-slate-400">
            Gradual percentage rollouts, plan tier targeting, workspace whitelists, and kill switches.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/settings/platform" className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-800 transition">
            Platform Settings →
          </Link>
          <Link href="/settings/roles" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition">
            RBAC Roles →
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
          {actionMsg}
        </div>
      )}

      <div className="space-y-4">
        {flags.map((f) => (
          <div key={f.key} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{f.name}</h2>
                <span className="text-xs text-slate-500 font-mono">({f.key})</span>
              </div>
              <p className="text-xs text-slate-400">{f.description}</p>
              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                <span>Rollout: <strong className="text-indigo-400">{f.rolloutPercentage}%</strong></span>
                <span>Tiers: <strong className="text-emerald-400">{f.targetPlanTiers.join(', ')}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(f.key, f.enabled)}
                className={`px-4 py-2 font-bold text-xs rounded-xl shadow-lg transition ${
                  f.enabled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                {f.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
