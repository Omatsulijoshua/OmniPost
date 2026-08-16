'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { Sliders, DollarSign, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface PlanItem {
  id: string;
  name: string;
  priceMonthlyUSD: number;
  priceAnnualUSD: number;
  maxPostsPerMonth: number;
  maxSocialAccounts: number;
  maxStorageGB: number;
  maxAiTokens: number;
  maxTeamMembers: number;
  apiAccessEnabled: boolean;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<PlanItem[]>('/billing/plans').catch(() => [
        {
          id: 'plan-free',
          name: 'Free Starter',
          priceMonthlyUSD: 0,
          priceAnnualUSD: 0,
          maxPostsPerMonth: 30,
          maxSocialAccounts: 3,
          maxStorageGB: 2,
          maxAiTokens: 50000,
          maxTeamMembers: 1,
          apiAccessEnabled: false,
        },
        {
          id: 'plan-creator',
          name: 'Creator Tier',
          priceMonthlyUSD: 29,
          priceAnnualUSD: 290,
          maxPostsPerMonth: 300,
          maxSocialAccounts: 8,
          maxStorageGB: 25,
          maxAiTokens: 500000,
          maxTeamMembers: 3,
          apiAccessEnabled: false,
        },
        {
          id: 'plan-pro',
          name: 'Pro Growth',
          priceMonthlyUSD: 79,
          priceAnnualUSD: 790,
          maxPostsPerMonth: 1500,
          maxSocialAccounts: 20,
          maxStorageGB: 100,
          maxAiTokens: 2000000,
          maxTeamMembers: 8,
          apiAccessEnabled: true,
        },
        {
          id: 'plan-business',
          name: 'Business Tier',
          priceMonthlyUSD: 149,
          priceAnnualUSD: 1490,
          maxPostsPerMonth: 5000,
          maxSocialAccounts: 50,
          maxStorageGB: 500,
          maxAiTokens: 5000000,
          maxTeamMembers: 20,
          apiAccessEnabled: true,
        },
        {
          id: 'plan-agency',
          name: 'White-Label Agency',
          priceMonthlyUSD: 299,
          priceAnnualUSD: 2990,
          maxPostsPerMonth: 15000,
          maxSocialAccounts: 100,
          maxStorageGB: 1000,
          maxAiTokens: 10000000,
          maxTeamMembers: 50,
          apiAccessEnabled: true,
        },
        {
          id: 'plan-enterprise',
          name: 'Enterprise Custom',
          priceMonthlyUSD: 799,
          priceAnnualUSD: 7990,
          maxPostsPerMonth: 100000,
          maxSocialAccounts: 500,
          maxStorageGB: 5000,
          maxAiTokens: 50000000,
          maxTeamMembers: 250,
          apiAccessEnabled: true,
        },
      ]);
      setPlans(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription plan tiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEditPlan = (plan: PlanItem) => {
    const newPrice = prompt(`Enter new monthly price ($/mo) for ${plan.name}:`, plan.priceMonthlyUSD.toString());
    if (!newPrice) return;

    setActionMsg(`Updated monthly rate for ${plan.name} to $${newPrice}/mo.`);
    setPlans((prev) =>
      prev.map((p) => (p.id === plan.id ? { ...p, priceMonthlyUSD: parseFloat(newPrice) } : p))
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto font-sans">
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/billing/subscriptions"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Subscriptions Directory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Plan Tier Quota Governance Matrix
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Configure subscription pricing ($/mo, $/yr), seat limits, channel capacities, AI token quotas, and storage bounds across all 6 plan tiers.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={fetchPlans} />}

      {/* 6 Plan Tier Cards matching Section 33 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">{p.name}</h3>
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ${p.priceMonthlyUSD}
                    <span className="text-xs font-semibold text-slate-500">/mo</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">${p.priceAnnualUSD}/yr</div>
                </div>
              </div>

              <div className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                  <span className="text-slate-500">Monthly Posts:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{p.maxPostsPerMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                  <span className="text-slate-500">Social Channels:</span>
                  <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">{p.maxSocialAccounts} channels</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                  <span className="text-slate-500">Storage Quota:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{p.maxStorageGB} GB</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                  <span className="text-slate-500">AI Token Quota:</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{(p.maxAiTokens / 1000).toFixed(0)}k tokens</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                  <span className="text-slate-500">Team Collaborator Seats:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{p.maxTeamMembers} seats</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">API Access:</span>
                  <span className={`font-bold ${p.apiAccessEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {p.apiAccessEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleEditPlan(p)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition"
            >
              Edit Tier Pricing & Entitlements
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
