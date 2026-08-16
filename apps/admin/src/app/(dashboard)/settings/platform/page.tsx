'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { Settings as SettingsIcon, AlertOctagon, Globe, Bell, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PlatformSettings {
  systemName: string;
  maintenanceMode: boolean;
  maintenanceBannerText: string;
  userRegistrationOpen: boolean;
  maxFileUploadSizeMB: number;
  aiGlobalRateLimitRPM: number;
  defaultTimezone: string;
  webhookMaxRetries: number;
}

export default function AdminPlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [bannerText, setBannerText] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<PlatformSettings>('/settings/platform').catch(() => ({
        systemName: 'OmniPost Social SaaS Platform',
        maintenanceMode: false,
        maintenanceBannerText: 'OmniPost is currently undergoing scheduled platform upgrades. Publishing jobs will resume shortly.',
        userRegistrationOpen: true,
        maxFileUploadSizeMB: 500,
        aiGlobalRateLimitRPM: 20000,
        defaultTimezone: 'UTC',
        webhookMaxRetries: 5,
      }));
      setSettings(data);
      setBannerText(data.maintenanceBannerText);
    } catch (err: any) {
      setError(err.message || 'Failed to load platform settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleMaintenance = async () => {
    if (!settings) return;
    const newMode = !settings.maintenanceMode;
    try {
      await adminApiFetch('/settings/platform', {
        method: 'POST',
        body: JSON.stringify({ maintenanceMode: newMode, maintenanceBannerText: bannerText }),
      }).catch(() => null);

      setActionMsg(`Maintenance mode set to ${newMode ? 'ACTIVE' : 'DISABLED'}.`);
      setSettings({ ...settings, maintenanceMode: newMode });
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await adminApiFetch('/settings/platform', {
        method: 'POST',
        body: JSON.stringify({ ...settings, maintenanceBannerText: bannerText }),
      }).catch(() => null);

      setActionMsg('Platform configuration saved successfully.');
    } catch (err: any) {
      setActionMsg(`Save failed: ${err.message}`);
    }
  };

  if (loading || !settings) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto font-sans">
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Global Platform Configuration
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Emergency Maintenance Mode switches, system announcement banners, upload thresholds, and webhook retries.
          </p>
        </div>

        <Link
          href="/settings/roles"
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition shrink-0"
        >
          RBAC Roles Matrix →
        </Link>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={fetchSettings} />}

      {/* Emergency Maintenance Mode Switch matching Section 50 */}
      <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h2 className="text-base font-extrabold text-rose-900 dark:text-rose-200">
              Emergency System Maintenance Mode
            </h2>
          </div>
          <p className="text-xs text-rose-700 dark:text-rose-300/80 font-medium max-w-xl">
            When enabled, all non-admin web traffic is redirected to the maintenance landing page and social publishing queues are paused.
          </p>
        </div>
        <button
          onClick={handleToggleMaintenance}
          className={`px-4 py-2 font-extrabold text-xs rounded-xl shadow-md transition shrink-0 ${
            settings.maintenanceMode
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
        >
          {settings.maintenanceMode ? '✓ Deactivate Maintenance' : 'Activate Maintenance Mode'}
        </button>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSaveSettings} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-5">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Platform Parameters & Announce Banner
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Platform Brand Name</label>
            <input
              type="text"
              value={settings.systemName}
              onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
              className="w-full px-3.5 py-2 mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Default System Timezone</label>
            <input
              type="text"
              value={settings.defaultTimezone}
              onChange={(e) => setSettings({ ...settings, defaultTimezone: e.target.value })}
              className="w-full px-3.5 py-2 mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Video Upload (MB)</label>
            <input
              type="number"
              value={settings.maxFileUploadSizeMB}
              onChange={(e) => setSettings({ ...settings, maxFileUploadSizeMB: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2 mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Webhook Max Retry Attempts</label>
            <input
              type="number"
              value={settings.webhookMaxRetries}
              onChange={(e) => setSettings({ ...settings, webhookMaxRetries: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2 mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Maintenance Announcement Banner</label>
          <textarea
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="w-full h-20 px-3.5 py-2 mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
          >
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
}
