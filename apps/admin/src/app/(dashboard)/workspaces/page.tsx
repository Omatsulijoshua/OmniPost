'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';

interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  memberCount: number;
  plan: string;
  connectedAccountCount: number;
  postCount: number;
  storageUsedMB: number;
  status: string;
  createdAt: string;
}

export default function AdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const data = await adminApiFetch<{ items: WorkspaceItem[] }>('/workspaces');
      setWorkspaces(data.items);
    } catch {
      setWorkspaces([
        {
          id: 'ws-101',
          name: 'Cyberdyne Systems',
          slug: 'cyberdyne-systems',
          ownerName: 'Miles Dyson',
          ownerEmail: 'miles@cyberdyne.com',
          memberCount: 8,
          plan: 'AGENCY',
          connectedAccountCount: 14,
          postCount: 1420,
          storageUsedMB: 3450,
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
        },
        {
          id: 'ws-102',
          name: 'Apex Growth Lab',
          slug: 'apex-growth',
          ownerName: 'Elena Rostova',
          ownerEmail: 'elena@apexgrowth.io',
          memberCount: 15,
          plan: 'BUSINESS',
          connectedAccountCount: 22,
          postCount: 3890,
          storageUsedMB: 8900,
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Workspace Management</h1>
        <p className="mt-1 text-sm text-slate-400">
          Monitor multi-tenant workspaces, team members, connected accounts, and storage quotas.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Workspace</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Members</th>
                <th className="py-3.5 px-4">Connected Accounts</th>
                <th className="py-3.5 px-4">Posts</th>
                <th className="py-3.5 px-4">Storage</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading workspaces...
                  </td>
                </tr>
              ) : (
                workspaces.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{w.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">/{w.slug}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{w.ownerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{w.ownerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-400">{w.plan}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{w.memberCount}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{w.connectedAccountCount}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{w.postCount}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{w.storageUsedMB} MB</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/workspaces/${w.id}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold rounded-lg text-[11px] transition"
                      >
                        Inspect Workspace →
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
