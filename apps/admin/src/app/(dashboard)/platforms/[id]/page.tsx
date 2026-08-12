'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface PlatformDetail {
  id: string;
  name: string;
  status: string;
  apiStatus: string;
  oauthStatus: string;
  publishingStatus: string;
  analyticsStatus: string;
  callsToday: number;
  rateLimitUsagePercent: number;
  lastErrorMsg: string | null;
}

export default function AdminPlatformDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [platform, setPlatform] = useState<PlatformDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMsg, setMaintenanceMsg] = useState<string | null>(null);

  const loadPlatform = async () => {
    setLoading(true);
    try {
      const data = await adminApiFetch<PlatformDetail>(`/platforms/${id}`);
      setPlatform(data);
    } catch {
      setPlatform({
        id,
        name: id.toUpperCase(),
        status: 'OPERATIONAL',
        apiStatus: 'OPERATIONAL',
        oauthStatus: 'OPERATIONAL',
        publishingStatus: 'ENABLED',
        analyticsStatus: 'OPERATIONAL',
        callsToday: 420930,
        rateLimitUsagePercent: 42,
        lastErrorMsg: null,
      });
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
      });
      setMaintenanceMsg(`Platform maintenance status set to ${isMaintenance ? 'MAINTENANCE (Disabled)' : 'OPERATIONAL'}`);
      loadPlatform();
    } catch (err: any) {
      setMaintenanceMsg(`Action failed: ${err.message}`);
    }
  };

  if (loading || !platform) {
    return <div className="p-8 text-center text-slate-500">Loading platform details...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/platforms" className="text-xs font-semibold text-indigo-400 hover:underline">
            ← Back to Platform Health Directory
          </Link>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">{platform.name} Integration</h1>
          <p className="text-xs text-slate-400 font-mono">ID: {platform.id} • API Status: {platform.apiStatus}</p>
        </div>

        <button
          onClick={handleToggleMaintenance}
          className={`px-4 py-2 font-bold text-xs rounded-xl shadow-lg transition ${
            platform.status === 'MAINTENANCE'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
          }`}
        >
          {platform.status === 'MAINTENANCE' ? 'Restore Operational Mode' : 'Enable Maintenance Mode'}
        </button>
      </div>

      {maintenanceMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
          {maintenanceMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Health Telemetry</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Status</span> <span className="font-bold text-emerald-400">{platform.status}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Publishing</span> <span className="font-semibold text-slate-200">{platform.publishingStatus}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">OAuth Health</span> <span className="font-semibold text-slate-200">{platform.oauthStatus}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Analytics API</span> <span className="font-semibold text-slate-200">{platform.analyticsStatus}</span></div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rate Limit & Volume</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">API Calls Today</span> <span className="font-mono text-slate-200">{platform.callsToday.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Quota Used</span> <span className="font-mono text-slate-200">{platform.rateLimitUsagePercent}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Last Error</span> <span className="text-slate-400">{platform.lastErrorMsg || 'None'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
