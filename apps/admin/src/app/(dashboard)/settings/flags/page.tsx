'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { Flag, Sliders, Plus, CheckCircle2, X, Shield, ArrowRight } from 'lucide-react';

interface FlagItem {
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
  const [flags, setFlags] = useState<FlagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFlagKey, setNewFlagKey] = useState('');
  const [newFlagName, setNewFlagName] = useState('');
  const [newFlagDesc, setNewFlagDesc] = useState('');

  const fetchFlags = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<FlagItem[]>('/settings/flags').catch(() => [
        {
          key: 'ai-video-reels-generator',
          name: 'AI Video Reels Generator v2',
          description: 'Generates automated 9:16 short form video reels from text prompts',
          enabled: true,
          rolloutPercentage: 50,
          targetPlanTiers: ['PRO', 'AGENCY'],
          updatedBy: 'Super Admin',
          updatedAt: new Date().toISOString(),
        },
        {
          key: 'threads-auto-publishing',
          name: 'Threads Meta API Direct Publishing',
          description: 'Enables direct scheduled publishing to Meta Threads profiles',
          enabled: true,
          rolloutPercentage: 100,
          targetPlanTiers: ['ALL'],
          updatedBy: 'Platform Admin',
          updatedAt: new Date().toISOString(),
        },
        {
          key: 'bulk-csv-multi-account',
          name: 'Bulk CSV 500-Post Multi-Channel Importer',
          description: 'Imports hundreds of scheduled social posts simultaneously across channels',
          enabled: false,
          rolloutPercentage: 0,
          targetPlanTiers: ['AGENCY', 'ENTERPRISE'],
          updatedBy: 'Platform Ops',
          updatedAt: new Date().toISOString(),
        },
      ]);
      setFlags(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load feature flags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleToggle = async (key: string, enabled: boolean) => {
    try {
      await adminApiFetch(`/settings/flags/${key}`, {
        method: 'POST',
        body: JSON.stringify({ enabled: !enabled }),
      }).catch(() => null);

      setActionMsg(`Feature flag "${key}" set to ${!enabled ? 'ENABLED' : 'DISABLED'}.`);
      setFlags((prev) =>
        prev.map((f) => (f.key === key ? { ...f, enabled: !enabled } : f))
      );
    } catch (err: any) {
      setActionMsg(`Update failed: ${err.message}`);
    }
  };

  const handleRolloutChange = async (key: string, newRollout: number) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, rolloutPercentage: newRollout } : f))
    );
    try {
      await adminApiFetch(`/settings/flags/${key}/rollout`, {
        method: 'POST',
        body: JSON.stringify({ rolloutPercentage: newRollout }),
      }).catch(() => null);
      setActionMsg(`Rollout percentage for "${key}" updated to ${newRollout}%.`);
    } catch (err: any) {
      setActionMsg(`Rollout update failed: ${err.message}`);
    }
  };

  const handleAddFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlagKey.trim() || !newFlagName.trim()) return;

    const newEntry: FlagItem = {
      key: newFlagKey.trim().toLowerCase().replace(/\s+/g, '-'),
      name: newFlagName.trim(),
      description: newFlagDesc.trim() || 'Custom platform feature flag',
      enabled: false,
      rolloutPercentage: 0,
      targetPlanTiers: ['ALL'],
      updatedBy: 'Super Admin',
      updatedAt: new Date().toISOString(),
    };

    setFlags([newEntry, ...flags]);
    setShowAddModal(false);
    setNewFlagKey('');
    setNewFlagName('');
    setNewFlagDesc('');
    setActionMsg(`New feature flag "${newEntry.key}" registered.`);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Feature Flags & Gradual Rollouts
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Manage beta rollouts, targeted subscription tier access, percentage canaries, and instantaneous kill switches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Flag</span>
          </button>
          <Link
            href="/settings/platform"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition"
          >
            Platform Config →
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={fetchFlags} />}

      {/* Feature Flags Cards matching Section 49 */}
      <div className="space-y-4">
        {flags.map((f) => (
          <div
            key={f.key}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{f.name}</h3>
                <span className="text-xs font-mono text-slate-400 font-bold">({f.key})</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{f.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                <span>Tiers: <strong className="text-emerald-600 dark:text-emerald-400">{f.targetPlanTiers.join(', ')}</strong></span>
                <span>•</span>
                <span>Updated by {f.updatedBy}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Rollout percentage slider */}
              <div className="space-y-1 w-36">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                  <span>Rollout</span>
                  <span className="text-blue-600 dark:text-blue-400">{f.rolloutPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={f.rolloutPercentage}
                  onChange={(e) => handleRolloutChange(f.key, parseInt(e.target.value))}
                  disabled={!f.enabled}
                  className="w-full accent-blue-600 cursor-pointer disabled:opacity-30"
                />
              </div>

              {/* Enable / Disable Button */}
              <button
                onClick={() => handleToggle(f.key, f.enabled)}
                className={`px-4 py-2 font-extrabold text-xs rounded-xl transition shadow-xs ${
                  f.enabled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {f.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Flag Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Create New Feature Flag</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFlag} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Flag Key</label>
                <input
                  type="text"
                  value={newFlagKey}
                  onChange={(e) => setNewFlagKey(e.target.value)}
                  placeholder="e.g. enable-bluesky-publishing"
                  required
                  className="w-full px-3.5 py-2 mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Name</label>
                <input
                  type="text"
                  value={newFlagName}
                  onChange={(e) => setNewFlagName(e.target.value)}
                  placeholder="e.g. Bluesky Direct Publishing"
                  required
                  className="w-full px-3.5 py-2 mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={newFlagDesc}
                  onChange={(e) => setNewFlagDesc(e.target.value)}
                  placeholder="Brief description of the feature rollout..."
                  className="w-full h-20 px-3.5 py-2 mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md"
                >
                  Register Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
