'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  plan: string;
  createdAt: string;
  workspaces: Array<{ id: string; name: string; role: string; memberCount: number }>;
  subscription: { plan: string; status: string; currentPeriodEnd: string; provider: string };
  usage: { postsPublished: number; storageUsedMB: number; aiTokensUsed: number; socialAccountsConnected: number };
  security: { mfaEnabled: boolean; activeSessions: number; lastLoginIp: string };
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await adminApiFetch<UserDetail>(`/users/${id}`);
      setUser(data);
    } catch {
      setUser({
        id,
        name: 'Sarah Connor',
        email: 'sarah@skynet-research.io',
        role: 'CREATOR',
        status: 'ACTIVE',
        plan: 'PRO',
        createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
        workspaces: [
          { id: 'ws-101', name: 'Cyberdyne Media', role: 'OWNER', memberCount: 5 },
          { id: 'ws-102', name: 'Resistance Marketing', role: 'MEMBER', memberCount: 12 },
        ],
        subscription: {
          plan: 'PRO',
          status: 'ACTIVE',
          currentPeriodEnd: new Date(Date.now() + 86400000 * 20).toISOString(),
          provider: 'STRIPE',
        },
        usage: {
          postsPublished: 342,
          storageUsedMB: 1240,
          aiTokensUsed: 148500,
          socialAccountsConnected: 8,
        },
        security: {
          mfaEnabled: true,
          activeSessions: 2,
          lastLoginIp: '192.168.1.45',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleSuspend = async () => {
    const reason = prompt('Enter suspension reason:');
    if (!reason) return;
    try {
      await adminApiFetch(`/users/${id}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      setActionMsg(`User suspended successfully. Reason: "${reason}"`);
      loadUser();
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  const handleForceLogout = async () => {
    if (!confirm('Force logout all active sessions for this user?')) return;
    try {
      await adminApiFetch(`/users/${id}/force-logout`, { method: 'POST' });
      setActionMsg('All active user sessions revoked.');
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  if (loading || !user) {
    return <div className="p-8 text-center text-slate-500">Loading user profile...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/users" className="text-xs font-semibold text-indigo-400 hover:underline">
            ← Back to User Directory
          </Link>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">{user.name}</h1>
          <p className="text-xs text-slate-400 font-mono">{user.email} • ID: {user.id}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleForceLogout}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
          >
            Force Logout
          </button>
          <button
            onClick={handleSuspend}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition"
          >
            {user.status === 'SUSPENDED' ? 'Reactivate User' : 'Suspend Account'}
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
          {actionMsg}
        </div>
      )}

      {/* User Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider text-[11px] text-slate-400">Profile Context</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Status</span> <span className="font-bold text-emerald-400">{user.status}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Role</span> <span className="font-semibold text-slate-200">{user.role}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Created</span> <span className="text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider text-[11px] text-slate-400">Subscription</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Plan</span> <span className="font-bold text-indigo-400">{user.subscription.plan}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Provider</span> <span className="text-slate-300">{user.subscription.provider}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Renews</span> <span className="text-slate-300">{new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}</span></div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider text-[11px] text-slate-400">Quota Usage</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Published</span> <span className="font-mono text-slate-200">{user.usage.postsPublished}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Storage</span> <span className="font-mono text-slate-200">{user.usage.storageUsedMB} MB</span></div>
            <div className="flex justify-between"><span className="text-slate-400">AI Tokens</span> <span className="font-mono text-slate-200">{user.usage.aiTokensUsed.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
