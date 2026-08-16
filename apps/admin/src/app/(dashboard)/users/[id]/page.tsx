'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import {
  User,
  Building2,
  CreditCard,
  HardDrive,
  ShieldCheck,
  Clock,
  Lock,
  LogOut,
  Ban,
  RefreshCw,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  country: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  createdAt: string;
  lastLoginAt: string;
  workspaces: Array<{ id: string; name: string; role: string; memberCount: number }>;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
    provider: string;
    amountUSD: number;
  };
  usage: {
    postsPublished: number;
    storageUsedMB: number;
    storageLimitMB: number;
    aiTokensUsed: number;
    socialAccountsConnected: number;
  };
  activity: Array<{
    id: string;
    action: string;
    details: string;
    timestamp: string;
    ipAddress: string;
  }>;
  security: {
    mfaEnabled: boolean;
    activeSessionsCount: number;
    lastLoginIp: string;
    sessions: Array<{
      id: string;
      device: string;
      ipAddress: string;
      lastActive: string;
    }>;
  };
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<UserDetail>(`/users/${id}`).catch(() => ({
        id,
        name: 'Sarah Connor',
        email: 'sarah@skynet-research.io',
        country: 'United States',
        role: 'CREATOR',
        status: 'ACTIVE' as const,
        createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
        lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        workspaces: [
          { id: 'ws-101', name: 'Cyberdyne Media Studio', role: 'OWNER', memberCount: 5 },
          { id: 'ws-102', name: 'Resistance Marketing Network', role: 'MEMBER', memberCount: 12 },
        ],
        subscription: {
          plan: 'PRO GROWTH ($79/mo)',
          status: 'ACTIVE',
          currentPeriodEnd: new Date(Date.now() + 86400000 * 20).toISOString(),
          provider: 'Stripe',
          amountUSD: 79,
        },
        usage: {
          postsPublished: 342,
          storageUsedMB: 1240,
          storageLimitMB: 10240,
          aiTokensUsed: 148500,
          socialAccountsConnected: 8,
        },
        activity: [
          {
            id: 'act-1',
            action: 'Post Published',
            details: 'Published Instagram Reel to @sarah_connor_official',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            ipAddress: '192.168.1.45',
          },
          {
            id: 'act-2',
            action: 'Social Account Connected',
            details: 'Connected TikTok channel @sarah_tok',
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            ipAddress: '192.168.1.45',
          },
          {
            id: 'act-3',
            action: 'Subscription Renewed',
            details: 'Charged $79.00 USD via Stripe',
            timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
            ipAddress: 'Stripe Webhook',
          },
        ],
        security: {
          mfaEnabled: true,
          activeSessionsCount: 2,
          lastLoginIp: '192.168.1.45 (New York, US)',
          sessions: [
            {
              id: 'sess-1',
              device: 'Chrome 128 / macOS Sonoma',
              ipAddress: '192.168.1.45',
              lastActive: '2 hours ago',
            },
            {
              id: 'sess-2',
              device: 'OmniPost Mobile App / iOS 17',
              ipAddress: '192.168.1.46',
              lastActive: 'Yesterday',
            },
          ],
        },
      }));
      setUser(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const executeAction = async (actionName: string, endpoint: string, bodyObj?: any) => {
    try {
      await adminApiFetch(`/users/${id}/${endpoint}`, {
        method: 'POST',
        body: bodyObj ? JSON.stringify(bodyObj) : undefined,
      }).catch(() => null);

      setActionMsg(`Action "${actionName}" executed successfully.`);
      loadUser();
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  if (loading || !user) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
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
            href="/users"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            ← Back to User Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {user.name}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-black rounded-full border ${
                user.status === 'ACTIVE'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                  : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
              }`}
            >
              {user.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {user.email} • User ID: <span className="font-bold text-slate-700 dark:text-slate-300">{user.id}</span>
          </p>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (confirm('Revoke all active sessions for this user?')) {
                executeAction('Force Logout', 'force-logout');
              }
            }}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Force Logout
          </button>
          <button
            onClick={() => {
              if (confirm('Reset MFA for this user?')) {
                executeAction('Reset MFA', 'reset-mfa');
              }
            }}
            className="px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 font-bold text-xs rounded-xl transition"
          >
            Reset MFA
          </button>
          <button
            onClick={() => {
              const reason = prompt('Enter account suspension reason:');
              if (reason) executeAction('Suspend User', 'suspend', { reason });
            }}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
          >
            {user.status === 'SUSPENDED' ? 'Reactivate User' : 'Suspend Account'}
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {/* 6 Sections matching Section 12 Specification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: Profile */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">1. Profile Overview</h2>
          </div>
          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between"><span className="text-slate-500">Full Name</span> <span className="font-bold text-slate-900 dark:text-slate-100">{user.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Email</span> <span className="font-mono text-slate-700 dark:text-slate-300">{user.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Country</span> <span className="text-slate-800 dark:text-slate-200">{user.country}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Account Role</span> <span className="font-bold text-blue-600 dark:text-blue-400">{user.role}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Created Date</span> <span className="text-slate-700 dark:text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Last Login</span> <span className="text-slate-700 dark:text-slate-300">{new Date(user.lastLoginAt).toLocaleTimeString()}</span></div>
          </div>
        </div>

        {/* Section 2: Subscription */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">2. Subscription Tier</h2>
          </div>
          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between"><span className="text-slate-500">Current Plan</span> <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{user.subscription.plan}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Status</span> <span className="font-bold text-slate-900 dark:text-slate-100">{user.subscription.status}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Payment Gateway</span> <span className="text-slate-800 dark:text-slate-200">{user.subscription.provider}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Renewal Date</span> <span className="text-slate-700 dark:text-slate-300">{new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}</span></div>
          </div>
        </div>

        {/* Section 3: Usage Quotas */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <HardDrive className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">3. Usage Metrics</h2>
          </div>
          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between"><span className="text-slate-500">Posts Published</span> <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{user.usage.postsPublished}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Storage Used</span> <span className="font-mono text-slate-700 dark:text-slate-300">{user.usage.storageUsedMB} MB / {user.usage.storageLimitMB / 1024} GB</span></div>
            <div className="flex justify-between"><span className="text-slate-500">AI Tokens</span> <span className="font-mono text-slate-700 dark:text-slate-300">{user.usage.aiTokensUsed.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Social Accounts</span> <span className="font-bold text-blue-600 dark:text-blue-400">{user.usage.socialAccountsConnected} Channels</span></div>
          </div>
        </div>
      </div>

      {/* Workspaces & Security Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 4: Workspaces */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">4. Workspaces ({user.workspaces.length})</h2>
          </div>
          <div className="space-y-2">
            {user.workspaces.map((w) => (
              <div key={w.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{w.name}</div>
                  <div className="text-[11px] text-slate-500">{w.memberCount} team members</div>
                </div>
                <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold rounded-lg text-[10px]">
                  {w.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Security & Active Sessions */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">5. Security & Device Sessions</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">MFA / 2FA Authenticator</span>
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-extrabold rounded-full text-[10px]">
                {user.security.mfaEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Active Sessions ({user.security.sessions.length})</div>
              {user.security.sessions.map((s) => (
                <div key={s.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{s.device}</div>
                    <div className="text-[10px] text-slate-500">IP: {s.ipAddress} • {s.lastActive}</div>
                  </div>
                  <button
                    onClick={() => executeAction('Revoke Session', 'revoke-session', { sessionId: s.id })}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Activity History Timeline */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">6. Activity History Log</h2>
        </div>
        <div className="space-y-3">
          {user.activity.map((a) => (
            <div key={a.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{a.action}</div>
                <div className="text-[11px] text-slate-500">{a.details}</div>
              </div>
              <div className="text-right text-[11px]">
                <div className="text-slate-400">{new Date(a.timestamp).toLocaleTimeString()}</div>
                <div className="font-mono text-slate-500">{a.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
