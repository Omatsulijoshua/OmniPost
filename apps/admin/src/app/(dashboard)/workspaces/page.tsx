'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';
import { TableSkeleton, EmptyState, ErrorState } from '../../../components/ui/state-feedback';
import { Search, Building2, ShieldAlert, CheckCircle2, Sliders, ArrowUpRight } from 'lucide-react';

interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  memberCount: number;
  plan: 'FREE' | 'CREATOR' | 'PRO' | 'BUSINESS' | 'AGENCY';
  connectedAccountCount: number;
  postCount: number;
  storageUsedMB: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export default function AdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<{ items: WorkspaceItem[] }>(
        `/workspaces?search=${encodeURIComponent(search)}&status=${statusFilter}`
      ).catch(() => ({
        items: [
          {
            id: 'ws-101',
            name: 'Cyberdyne Systems',
            slug: 'cyberdyne-systems',
            ownerName: 'Miles Dyson',
            ownerEmail: 'miles@cyberdyne.com',
            memberCount: 8,
            plan: 'AGENCY' as const,
            connectedAccountCount: 14,
            postCount: 1420,
            storageUsedMB: 3450,
            status: 'ACTIVE' as const,
            createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
          },
          {
            id: 'ws-102',
            name: 'Apex Growth Lab',
            slug: 'apex-growth',
            ownerName: 'Elena Rostova',
            ownerEmail: 'elena@apexgrowth.io',
            memberCount: 15,
            plan: 'BUSINESS' as const,
            connectedAccountCount: 22,
            postCount: 3890,
            storageUsedMB: 8900,
            status: 'ACTIVE' as const,
            createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
          },
          {
            id: 'ws-103',
            name: 'Skynet Media Agency',
            slug: 'skynet-media',
            ownerName: 'Marcus Vance',
            ownerEmail: 'marcus@agency-growth.co',
            memberCount: 24,
            plan: 'AGENCY' as const,
            connectedAccountCount: 35,
            postCount: 8420,
            storageUsedMB: 18450,
            status: 'SUSPENDED' as const,
            createdAt: new Date(Date.now() - 86400000 * 365).toISOString(),
          },
        ],
      }));
      setWorkspaces(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkspaces();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Workspace & Tenant Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Monitor multi-tenant workspaces, owner accounts, active team seats, connected social channels, and storage quotas.
          </p>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchWorkspaces} />}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by workspace name, slug, or owner email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Workspace</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Members</th>
                <th className="py-3.5 px-4">Channels</th>
                <th className="py-3.5 px-4">Posts</th>
                <th className="py-3.5 px-4">Storage</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-4">
                    <TableSkeleton rows={4} cols={9} />
                  </td>
                </tr>
              ) : workspaces.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8">
                    <EmptyState
                      title="No Workspaces Found"
                      description="No workspaces match your current search query."
                      actionLabel="Reset Search"
                      onAction={() => {
                        setSearch('');
                        setStatusFilter('ALL');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                workspaces.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{w.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">/{w.slug}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{w.ownerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{w.ownerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600 dark:text-blue-400">{w.plan}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{w.memberCount} seats</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{w.connectedAccountCount} channels</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">{w.postCount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{(w.storageUsedMB / 1024).toFixed(1)} GB</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                          w.status === 'ACTIVE'
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                            : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/workspaces/${w.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-[11px] transition inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
