'use client';

import React, { useEffect, useState } from 'react';
import { adminApiFetch } from '../../../lib/api-client';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  userGrowthPercent: number;
  totalWorkspaces: number;
  activeWorkspaces: number;
  workspaceGrowthPercent: number;
  postsPublished: number;
  postsGrowthPercent: number;
  publishingSuccessRate: number;
  monthlyRecurringRevenueUSD: number;
  mrrGrowthPercent: number;
  aiTokensUsed: number;
}

interface SystemHealth {
  api: string;
  database: string;
  redis: string;
  mediaProcessing: string;
  publishingQueue: string;
  aiServices: string;
  storage: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, healthData] = await Promise.all([
        adminApiFetch<Stats>('/dashboard/stats'),
        adminApiFetch<SystemHealth>('/dashboard/health'),
      ]);
      setStats(statsData);
      setHealth(healthData);
    } catch (err: any) {
      setError(err.message || 'Failed to load executive admin stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Executive Operations Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Real-time metrics, platform publishing success rates, revenue MRR, and live system health status.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Top Executive KPI Cards */}
      {loading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Users</div>
            <div className="text-2xl font-black text-slate-100">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              ↑ {stats.userGrowthPercent}% vs last month • {stats.activeUsers.toLocaleString()} active
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Workspaces</div>
            <div className="text-2xl font-black text-slate-100">{stats.totalWorkspaces.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              ↑ {stats.workspaceGrowthPercent}% • {stats.activeWorkspaces.toLocaleString()} active
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Posts Published</div>
            <div className="text-2xl font-black text-indigo-400">{stats.postsPublished.toLocaleString()}</div>
            <div className="text-[11px] text-indigo-300 font-semibold">
              Success Rate: {stats.publishingSuccessRate}%
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Monthly Revenue (MRR)</div>
            <div className="text-2xl font-black text-emerald-400">${stats.monthlyRecurringRevenueUSD.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-300 font-semibold">
              ↑ {stats.mrrGrowthPercent}% • {(stats.aiTokensUsed / 1000000).toFixed(1)}M AI tokens
            </div>
          </div>
        </div>
      )}

      {/* Real-Time System Status Panel */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Live System Infrastructure Status</h2>

        {health && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(health).map(([service, status]) => (
              <div key={service} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold capitalize text-slate-300">{service.replace(/([A-Z])/g, ' $1')}</span>
                <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
                  {status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform Distribution Bar Breakdown */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Cross-Platform Publishing Distribution</h2>

        <div className="space-y-3">
          {[
            { platform: 'Instagram', count: 420000, percent: 32 },
            { platform: 'TikTok', count: 310000, percent: 24 },
            { platform: 'X / Twitter', count: 240000, percent: 18 },
            { platform: 'YouTube', count: 180000, percent: 14 },
            { platform: 'LinkedIn', count: 134293, percent: 12 },
          ].map((item) => (
            <div key={item.platform} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>{item.platform}</span>
                <span className="font-mono text-slate-400">{item.count.toLocaleString()} posts ({item.percent}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
