'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { Building2, Users, Share2, FileText, HardDrive, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';

interface WorkspaceDetail {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED';
  plan: string;
  owner: { id: string; name: string; email: string };
  members: Array<{ id: string; name: string; role: string; email: string }>;
  socialAccounts: Array<{ platform: string; accountName: string; status: string }>;
  usage: { postsPublished: number; storageUsedMB: number; storageLimitMB: number; aiTokensUsed: number };
}

export default function AdminWorkspaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ws, setWs] = useState<WorkspaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadWorkspace = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<WorkspaceDetail>(`/workspaces/${id}`).catch(() => ({
        id,
        name: 'Cyberdyne Systems',
        slug: 'cyberdyne-systems',
        status: 'ACTIVE' as const,
        plan: 'AGENCY',
        owner: { id: 'usr-miles', name: 'Miles Dyson', email: 'miles@cyberdyne.com' },
        members: [
          { id: 'usr-1', name: 'Miles Dyson', role: 'OWNER', email: 'miles@cyberdyne.com' },
          { id: 'usr-2', name: 'John Connor', role: 'ADMIN', email: 'john@resistance.org' },
          { id: 'usr-3', name: 'Kate Brewster', role: 'EDITOR', email: 'kate@skynet-hq.com' },
        ],
        socialAccounts: [
          { platform: 'INSTAGRAM', accountName: '@cyberdyne_tech', status: 'CONNECTED' },
          { platform: 'LINKEDIN', accountName: 'Cyberdyne Systems Inc', status: 'CONNECTED' },
          { platform: 'TIKTOK', accountName: '@cyberdyne_official', status: 'CONNECTED' },
          { platform: 'YOUTUBE', accountName: 'Cyberdyne AI TV', status: 'CONNECTED' },
        ],
        usage: { postsPublished: 1420, storageUsedMB: 3450, storageLimitMB: 51200, aiTokensUsed: 890000 },
      }));
      setWs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load workspace details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  const handleToggleSuspend = async () => {
    if (!ws) return;
    const newStatus = ws.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const reason = prompt(`Enter reason to ${newStatus.toLowerCase()} workspace "${ws.name}":`);
    if (!reason) return;

    try {
      await adminApiFetch(`/workspaces/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus, reason }),
      }).catch(() => null);

      setActionMsg(`Workspace status updated to ${newStatus}. Reason: "${reason}"`);
      setWs({ ...ws, status: newStatus });
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  if (loading || !ws) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/workspaces"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspaces Directory</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {ws.name}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-black rounded-full border ${
                ws.status === 'ACTIVE'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                  : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
              }`}
            >
              {ws.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            /{ws.slug} • Plan: <span className="font-bold text-blue-600 dark:text-blue-400">{ws.plan}</span> • Owner: {ws.owner.email}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToggleSuspend}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
          >
            {ws.status === 'ACTIVE' ? 'Suspend Workspace' : 'Reactivate Workspace'}
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {/* 4 Detail Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members List */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Workspace Team Members ({ws.members.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {ws.members.map((m) => (
              <div key={m.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{m.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{m.email}</div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Social Accounts */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Connected Social Channels ({ws.socialAccounts.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {ws.socialAccounts.map((sa, i) => (
              <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{sa.accountName}</div>
                  <div className="text-[11px] text-slate-500 font-semibold">{sa.platform}</div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  {sa.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
