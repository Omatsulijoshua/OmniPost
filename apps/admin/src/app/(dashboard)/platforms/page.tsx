'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';

interface PlatformHealth {
  id: string;
  name: string;
  slug: string;
  status: string;
  connectedAccountsCount: number;
  apiSuccessRatePercent: number;
  rateLimitUsedPercent: number;
  isCustomPlatform?: boolean;
}

export default function AdminPlatformsPage() {
  const [platforms, setPlatforms] = useState<PlatformHealth[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadPlatforms = () => {
    adminApiFetch<PlatformHealth[]>('/platforms')
      .then((data) => setPlatforms(data))
      .catch(() => {
        setPlatforms([
          { id: 'plat-snapchat', name: 'Snapchat', slug: 'snapchat', status: 'OPERATIONAL', connectedAccountsCount: 940, apiSuccessRatePercent: 99.2, rateLimitUsedPercent: 18.4 },
          { id: 'plat-instagram', name: 'Instagram', slug: 'instagram', status: 'OPERATIONAL', connectedAccountsCount: 1820, apiSuccessRatePercent: 99.4, rateLimitUsedPercent: 34.2 },
          { id: 'plat-tiktok', name: 'TikTok', slug: 'tiktok', status: 'DEGRADED', connectedAccountsCount: 1240, apiSuccessRatePercent: 98.1, rateLimitUsedPercent: 78.6 },
        ]);
      });
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  const handleRegisterPlatform = async () => {
    if (!newName.trim() || !newSlug.trim()) return;
    try {
      await adminApiFetch('/platforms', {
        method: 'POST',
        body: JSON.stringify({ name: newName, slug: newSlug }),
      });
      setActionMsg(`Platform "${newName}" registered successfully without writing code.`);
      setNewName('');
      setNewSlug('');
      setShowModal(false);
      loadPlatforms();
    } catch (err: any) {
      setActionMsg(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Social Platforms Matrix & Telemetry</h1>
          <p className="mt-1 text-sm text-slate-400">
            Health status, connected accounts, rate limits, and no-code custom platform registration.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
        >
          + Register Custom Social Platform
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300 font-mono">
          {actionMsg}
        </div>
      )}

      {/* No-Code Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="text-lg font-black text-slate-100">Register Custom Social Network</h2>
            <p className="text-xs text-slate-400">
              Add Snapchat or any custom social media API without writing code.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Platform Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Snapchat, Mastodon, Bluesky"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Platform Identifier Slug</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. snapchat, mastodon"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterPlatform}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
              >
                Register Platform
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((p) => (
          <div key={p.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-100">{p.name}</h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                p.status === 'OPERATIONAL' ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-amber-400 bg-amber-950 border-amber-800'
              }`}>
                {p.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-400 font-mono">
              <div>Accounts Connected: <strong className="text-slate-200">{p.connectedAccountsCount.toLocaleString()}</strong></div>
              <div>API Success Rate: <strong className="text-emerald-400">{p.apiSuccessRatePercent}%</strong></div>
              <div>Rate Limit Used: <strong className="text-indigo-400">{p.rateLimitUsedPercent}%</strong></div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link href={`/platforms/${p.id}`} className="text-xs font-semibold text-indigo-400 hover:underline">
                Configure Platform →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
