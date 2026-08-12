'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface WorkspaceDetail {
  id: string;
  name: string;
  slug: string;
  status: string;
  plan: string;
  owner: { id: string; name: string; email: string };
  members: Array<{ id: string; name: string; role: string; email: string }>;
  socialAccounts: Array<{ platform: string; accountName: string; status: string }>;
  usage: { postsPublished: number; storageUsedMB: number; aiTokensUsed: number };
}

export default function AdminWorkspaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ws, setWs] = useState<WorkspaceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiFetch<WorkspaceDetail>(`/workspaces/${id}`)
      .then((data) => setWs(data))
      .catch(() => {
        setWs({
          id,
          name: 'Cyberdyne Systems',
          slug: 'cyberdyne-systems',
          status: 'ACTIVE',
          plan: 'AGENCY',
          owner: { id: 'usr-miles', name: 'Miles Dyson', email: 'miles@cyberdyne.com' },
          members: [
            { id: 'usr-1', name: 'Miles Dyson', role: 'OWNER', email: 'miles@cyberdyne.com' },
            { id: 'usr-2', name: 'John Connor', role: 'ADMIN', email: 'john@resistance.org' },
          ],
          socialAccounts: [
            { platform: 'INSTAGRAM', accountName: '@cyberdyne_tech', status: 'CONNECTED' },
            { platform: 'LINKEDIN', accountName: 'Cyberdyne Systems Inc', status: 'CONNECTED' },
          ],
          usage: { postsPublished: 1420, storageUsedMB: 3450, aiTokensUsed: 890000 },
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !ws) {
    return <div className="p-8 text-center text-slate-500">Loading workspace details...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <Link href="/workspaces" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Workspaces Directory
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">{ws.name}</h1>
        <p className="text-xs text-slate-400 font-mono">/{ws.slug} • Plan: {ws.plan}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Members ({ws.members.length})</h2>
          <div className="divide-y divide-slate-800">
            {ws.members.map((m) => (
              <div key={m.id} className="py-2 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-200">{m.name}</div>
                  <div className="text-[10px] text-slate-500">{m.email}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 rounded-full">{m.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Connected Accounts ({ws.socialAccounts.length})</h2>
          <div className="divide-y divide-slate-800">
            {ws.socialAccounts.map((sa, i) => (
              <div key={i} className="py-2 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-200">{sa.accountName}</div>
                  <div className="text-[10px] text-slate-500">{sa.platform}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">{sa.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
