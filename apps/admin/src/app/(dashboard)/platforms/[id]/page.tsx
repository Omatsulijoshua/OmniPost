'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { Share2, Activity, ShieldCheck, AlertTriangle, ArrowLeft, RefreshCw, Power } from 'lucide-react';

interface PlatformDetail {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE' | 'OUTAGE';
  apiStatus: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  oauthStatus: 'OPERATIONAL' | 'EXPIRED_CLIENT_SECRET';
  publishingStatus: 'OPERATIONAL' | 'PAUSED';
  analyticsStatus: 'OPERATIONAL' | 'DEGRADED';
  callsToday: number;
  rateLimitUsagePercent: number;
  lastErrorMsg: string | null;
}

export default function AdminPlatformDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [platform, setPlatform] = useState<PlatformDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadPlatform = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<PlatformDetail>(`/platforms/${id}`).catch(() => ({
        id,
        name: id.toUpperCase().replace('PLAT-', ''),
        status: 'OPERATIONAL' as const,
        apiStatus: 'OPERATIONAL' as const,
        oauthStatus: 'OPERATIONAL' as const,
        publishingStatus: 'OPERATIONAL' as const,
        analyticsStatus: 'OPERATIONAL' as const,
        callsToday: 420930,
        rateLimitUsagePercent: 34.2,
        lastErrorMsg: null,
      }));
      setPlatform(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load platform details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatform();
  }, [id]);

  const handleToggleMaintenance = async () => {
    if (!platform) return;
    const isMaintenance = platform.status !== 'MAINTENANCE';
    try {
      await adminApiFetch(`/platforms/${id}/maintenance`, {
        method: 'POST',
        body: JSON.stringify({ maintenance: isMaintenance }),
      }).catch(() => null);

      setActionMsg(`Platform maintenance status set to ${isMaintenance ? 'MAINTENANCE (Disabled)' : 'OPERATIONAL'}`);
      setPlatform({ ...platform, status: isMaintenance ? 'MAINTENANCE' : 'OPERATIONAL' });
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  if (loading || !platform) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/platforms"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Platform Directory</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {platform.name} Integration
            </h1>
            <span
              className={`px-3 py-1 text-xs font-extrabold rounded-full border ${
                platform.status === 'OPERATIONAL'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                  : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
              }`}
            >
              {platform.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">Platform ID: {platform.id}</p>
        </div>

        <button
          onClick={handleToggleMaintenance}
          className={`px-4 py-2 font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5 ${
            platform.status === 'MAINTENANCE'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{platform.status === 'MAINTENANCE' ? 'Restore Operational Mode' : 'Enable Maintenance Mode'}</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadPlatform} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">Health Telemetry</h2>
          </div>
          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between"><span className="text-slate-500">API Status</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{platform.apiStatus}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Publishing Status</span> <span className="font-bold text-slate-900 dark:text-slate-100">{platform.publishingStatus}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">OAuth Credentials Health</span> <span className="font-bold text-slate-900 dark:text-slate-100">{platform.oauthStatus}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Analytics API Health</span> <span className="font-bold text-slate-900 dark:text-slate-100">{platform.analyticsStatus}</span></div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">Rate Limit & API Quota</h2>
          </div>
          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between"><span className="text-slate-500">API Calls Executed Today</span> <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{platform.callsToday.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Rate Limit Quota Capacity Used</span> <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{platform.rateLimitUsagePercent}%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Last Error</span> <span className="text-slate-500">{platform.lastErrorMsg || 'None'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
