'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { UserCheck, ArrowLeft, Shield, Check, X, ShieldAlert } from 'lucide-react';

interface RoleItem {
  role: string;
  displayName: string;
  description: string;
  permissions: string[];
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<RoleItem[]>('/settings/roles').catch(() => [
        {
          role: 'SUPER_ADMIN',
          displayName: 'Super Administrator',
          description: 'Full unrestricted system access, billing refunds, security policies, and team management.',
          permissions: ['users:*', 'workspaces:*', 'billing:*', 'publishing:*', 'platforms:*', 'system:*', 'ai:*', 'security:*'],
        },
        {
          role: 'OPERATIONS_ADMIN',
          displayName: 'Platform Operations Admin',
          description: 'Platform management, social accounts, failed jobs retries, BullMQ queue management.',
          permissions: ['users:read', 'workspaces:read', 'publishing:*', 'platforms:*', 'system:*', 'media:*', 'ai:routing'],
        },
        {
          role: 'FINANCE_ADMIN',
          displayName: 'Finance & Billing Admin',
          description: 'Subscription management, plan quota configurations, payment transaction history, and refunds.',
          permissions: ['users:read', 'workspaces:read', 'billing:*', 'analytics:read'],
        },
        {
          role: 'SUPPORT_ADMIN',
          displayName: 'Customer Support Admin',
          description: 'Helpdesk ticketing, flagged content moderation, user communication, and account lookup.',
          permissions: ['users:read', 'workspaces:read', 'support:*', 'moderation:*'],
        },
      ]);
      setRoles(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load RBAC roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/settings/platform"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Platform Configuration</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Role-Based Access Control (RBAC) Matrix
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Granular permission scopes governing administrative access across all operational team roles.
          </p>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchRoles} />}

      {/* Role Cards matching Section 51 */}
      <div className="space-y-4">
        {roles.map((r) => (
          <div
            key={r.role}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{r.displayName}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{r.description}</p>
              </div>
              <span className="px-3 py-1 text-xs font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full">
                {r.role}
              </span>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Assigned Permission Scopes:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="px-2.5 py-1 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg inline-flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{perm}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
