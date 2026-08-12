'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface PlatformSettings {
  systemName: string;
  maintenanceMode: boolean;
  userRegistrationOpen: boolean;
  maxFileUploadSizeMB: number;
  aiGlobalRateLimitRPM: number;
  storageQuotaPerWorkspaceGB: number;
}

export default function AdminPlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadSettings = () => {
    adminApiFetch<PlatformSettings>('/settings/platform')
      .then((data) => setSettings(data))
      .catch(() => {
        setSettings({
          systemName: 'OmniPost Social Enterprise Engine',
          maintenanceMode: false,
          userRegistrationOpen: true,
          maxFileUploadSizeMB: 500,
          aiGlobalRateLimitRPM: 20000,
          storageQuotaPerWorkspaceGB: 100,
        });
      });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggleMaintenance = async () => {
    if (!settings) return;
    try {
      await adminApiFetch('/settings/platform', {
        method: 'POST',
        body: JSON.stringify({ maintenanceMode: !settings.maintenanceMode }),
      });
      setActionMsg(`Maintenance mode updated to ${!settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}.`);
      loadSettings();
    } catch (err: any) {
      setActionMsg(`Update failed: ${err.message}`);
    }
  };

  if (!settings) return <div className="p-8 text-center text-slate-500">Loading platform settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link href="/settings/flags" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Feature Flags
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Global Platform Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Emergency Maintenance Mode switch, registration controls, upload file size limits, and AI quota ceilings.
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
          {actionMsg}
        </div>
      )}

      {/* Emergency Maintenance Mode Banner */}
      <div className="p-6 bg-rose-950/40 border border-rose-800/60 rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-black text-rose-200">Emergency System Maintenance Switch</h2>
          <p className="text-xs text-rose-300/80">
            Enabling maintenance mode blocks incoming non-admin requests and pauses publishing background workers.
          </p>
        </div>
        <button
          onClick={handleToggleMaintenance}
          className={`px-4 py-2 font-bold text-xs rounded-xl shadow-lg transition ${
            settings.maintenanceMode
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
          }`}
        >
          {settings.maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
        </button>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Default System Thresholds</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 font-bold">Max Video Upload Size</div>
            <div className="text-lg font-black text-indigo-400 font-mono">{settings.maxFileUploadSizeMB} MB</div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 font-bold">Global AI Rate Limit</div>
            <div className="text-lg font-black text-emerald-400 font-mono">{settings.aiGlobalRateLimitRPM.toLocaleString()} RPM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
