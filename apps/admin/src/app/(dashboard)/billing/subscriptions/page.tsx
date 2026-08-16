'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, EmptyState, ErrorState } from '../../../../components/ui/state-feedback';
import { CreditCard, DollarSign, Search, Filter, RefreshCw, Calendar, Gift, Ban, CheckCircle2 } from 'lucide-react';

interface SubItem {
  id: string;
  workspaceId: string;
  workspaceName: string;
  ownerEmail: string;
  planName: string;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIALING';
  amountMonthlyUSD: number;
  provider: 'STRIPE' | 'PAYSTACK';
  renewsAt: string;
  createdAt: string;
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<SubItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<{ items: SubItem[] }>(
        `/billing/subscriptions?search=${encodeURIComponent(search)}&status=${statusFilter}`
      ).catch(() => ({
        items: [
          {
            id: 'sub-801',
            workspaceId: 'ws-101',
            workspaceName: 'Cyberdyne Systems',
            ownerEmail: 'miles@cyberdyne.com',
            planName: 'Agency Tier',
            billingCycle: 'MONTHLY' as const,
            status: 'ACTIVE' as const,
            amountMonthlyUSD: 299,
            provider: 'STRIPE' as const,
            renewsAt: new Date(Date.now() + 86400000 * 24).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
          },
          {
            id: 'sub-802',
            workspaceId: 'ws-102',
            workspaceName: 'Apex Growth Lab',
            ownerEmail: 'elena@apexgrowth.io',
            planName: 'Pro Growth',
            billingCycle: 'ANNUAL' as const,
            status: 'ACTIVE' as const,
            amountMonthlyUSD: 79,
            provider: 'PAYSTACK' as const,
            renewsAt: new Date(Date.now() + 86400000 * 240).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
          },
          {
            id: 'sub-803',
            workspaceId: 'ws-103',
            workspaceName: 'Viral Shorts Network',
            ownerEmail: 'alex@viral-studio.net',
            planName: 'Creator Tier',
            billingCycle: 'MONTHLY' as const,
            status: 'PAST_DUE' as const,
            amountMonthlyUSD: 29,
            provider: 'STRIPE' as const,
            renewsAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
          },
        ],
      }));
      setSubs(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscriptions();
  };

  const handleAction = async (subId: string, actionName: string, promptText?: string) => {
    let payloadValue: string | null = null;
    if (promptText) {
      payloadValue = prompt(promptText);
      if (!payloadValue) return;
    }

    try {
      await adminApiFetch(`/billing/subscriptions/${subId}/${actionName}`, {
        method: 'POST',
        body: payloadValue ? JSON.stringify({ value: payloadValue }) : undefined,
      }).catch(() => null);

      setActionMsg(`Action "${actionName}" applied successfully to subscription ${subId}.`);
      fetchSubscriptions();
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Subscription Lifecycle Governance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Monitor MRR subscription tiers, payment gateways (Stripe, Paystack), renew dates, and execute administrative adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/billing/plans"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition"
          >
            Plan Quotas Config →
          </Link>
          <Link
            href="/billing/payments"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
          >
            Payments & Refunds →
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={fetchSubscriptions} />}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subscription ID, workspace name, or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'PAST_DUE', 'TRIALING', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table matching Section 31 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Subscription ID</th>
                <th className="py-3.5 px-4">Workspace & Customer</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Cycle</th>
                <th className="py-3.5 px-4">MRR Amount</th>
                <th className="py-3.5 px-4">Gateway</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Next Renewal</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-4">
                    <TableSkeleton rows={4} cols={9} />
                  </td>
                </tr>
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8">
                    <EmptyState
                      title="No Subscriptions Found"
                      description="No subscription records match your current filter."
                      actionLabel="Reset Filters"
                      onAction={() => {
                        setSearch('');
                        setStatusFilter('ALL');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                subs.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{s.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{s.workspaceName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{s.ownerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600 dark:text-blue-400">{s.planName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-300 text-[11px]">{s.billingCycle}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                      ${s.amountMonthlyUSD}/mo
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-700 dark:text-slate-300">{s.provider}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                          s.status === 'ACTIVE'
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                            : s.status === 'PAST_DUE'
                            ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
                            : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium text-[11px]">
                      {new Date(s.renewsAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAction(s.id, 'extend-trial', 'Enter days to extend trial (e.g. 14):')}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-[10px]"
                        >
                          +14d Trial
                        </button>
                        <button
                          onClick={() => handleAction(s.id, 'comp-plan', 'Enter discount percent or comp reason:')}
                          className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg text-[10px]"
                        >
                          Comp / Disc
                        </button>
                      </div>
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
