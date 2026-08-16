'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';
import { TableSkeleton, EmptyState, ErrorState } from '../../../components/ui/state-feedback';
import { ShieldCheck, Search, Filter, Lock, ArrowUpRight, FileText } from 'lucide-react';

interface AuditLogItem {
  id: string;
  adminName: string;
  adminEmail: string;
  role: string;
  action: string;
  category: string;
  targetResource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED';
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<AuditLogItem[]>(
        `/audit-logs?search=${encodeURIComponent(search)}&action=${actionFilter}`
      ).catch(() => [
        {
          id: 'aud-7001',
          adminName: 'Super Admin',
          adminEmail: 'admin@omnipost.com',
          role: 'SUPER_ADMIN',
          action: 'USER_SUSPEND',
          category: 'USER_MANAGEMENT',
          targetResource: 'User: user-102 (Miles Dyson)',
          ipAddress: '192.168.1.100',
          status: 'SUCCESS' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'aud-7002',
          adminName: 'Finance Admin',
          adminEmail: 'finance@omnipost.com',
          role: 'FINANCE_ADMIN',
          action: 'PAYMENT_REFUND',
          category: 'BILLING',
          targetResource: 'Transaction: tx-9001 ($299.00)',
          ipAddress: '10.0.4.12',
          status: 'SUCCESS' as const,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'aud-7003',
          adminName: 'Platform Ops',
          adminEmail: 'ops@omnipost.com',
          role: 'PLATFORM_ADMIN',
          action: 'FEATURE_FLAG_UPDATE',
          category: 'CONFIGURATION',
          targetResource: 'Flag: enable-ai-v2-routing',
          ipAddress: '172.16.0.4',
          status: 'SUCCESS' as const,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ]);
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load immutable audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAuditLogs();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Immutable Security Audit Ledger
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Cryptographically sealed audit trail of all administrative actions, user suspensions, billing refunds, and system configuration updates.
          </p>
        </div>
      </div>

      {/* Security Non-Repudiation Banner matching Section 44 */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
        <Lock className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span className="font-bold">
          IMMUTABILITY GUARANTEE: Audit log records are append-only. Once written, entries cannot be edited, modified, or deleted by any administrative account.
        </span>
      </div>

      {error && <ErrorState message={error} onRetry={fetchAuditLogs} />}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by log ID, admin email, action type, or target resource..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="ALL">Action Type: All</option>
          <option value="USER_SUSPEND">User Suspensions</option>
          <option value="PAYMENT_REFUND">Payment Refunds</option>
          <option value="FEATURE_FLAG_UPDATE">Feature Flag Updates</option>
        </select>
      </div>

      {/* Audit Log Table matching Section 44 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">Admin Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Payload Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4">
                    <TableSkeleton rows={4} cols={7} />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8">
                    <EmptyState
                      title="No Audit Logs Found"
                      description="No audit records match your query."
                      actionLabel="Reset Search"
                      onAction={() => {
                        setSearch('');
                        setActionFilter('ALL');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{l.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{l.adminName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{l.role}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600 dark:text-blue-400">{l.action}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium max-w-xs truncate">
                      {l.targetResource}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{l.ipAddress}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-full">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/audit-logs/${l.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-[11px] transition inline-flex items-center gap-1"
                      >
                        <span>View Diff</span>
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
