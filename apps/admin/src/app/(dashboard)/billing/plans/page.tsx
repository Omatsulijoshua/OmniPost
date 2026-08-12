'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface Plan {
  id: string;
  name: string;
  priceMonthlyUSD: number;
  maxPostsPerMonth: number;
  maxSocialAccounts: number;
  maxStorageGB: number;
  maxAiCredits: number;
  maxTeamMembers: number;
  analyticsRetentionDays: number;
  apiAccessEnabled: boolean;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    adminApiFetch<Plan[]>('/billing/plans')
      .then((data) => setPlans(data))
      .catch(() => {
        setPlans([
          { id: 'plan-free', name: 'Free Tier', priceMonthlyUSD: 0, maxPostsPerMonth: 30, maxSocialAccounts: 3, maxStorageGB: 2, maxAiCredits: 50, maxTeamMembers: 1, analyticsRetentionDays: 7, apiAccessEnabled: false },
          { id: 'plan-pro', name: 'Pro Growth', priceMonthlyUSD: 79, maxPostsPerMonth: 1000, maxSocialAccounts: 25, maxStorageGB: 100, maxAiCredits: 2500, maxTeamMembers: 8, analyticsRetentionDays: 90, apiAccessEnabled: true },
          { id: 'plan-agency', name: 'Enterprise Agency', priceMonthlyUSD: 299, maxPostsPerMonth: 10000, maxSocialAccounts: 100, maxStorageGB: 1000, maxAiCredits: 20000, maxTeamMembers: 50, analyticsRetentionDays: 365, apiAccessEnabled: true },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <Link href="/billing/subscriptions" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Subscriptions
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Plan Entitlement Tier Manager</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure subscription tier pricing, post quotas, channel limits, storage allocations, and feature flags.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-black text-slate-100">{p.name}</h2>
                <div className="text-xl font-black text-emerald-400">${p.priceMonthlyUSD}<span className="text-xs font-normal text-slate-400">/mo</span></div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/80 py-1.5"><span>Monthly Posts</span><span className="font-mono font-bold text-slate-100">{p.maxPostsPerMonth.toLocaleString()}</span></div>
                <div className="flex justify-between border-b border-slate-800/80 py-1.5"><span>Social Channels</span><span className="font-mono font-bold text-indigo-400">{p.maxSocialAccounts}</span></div>
                <div className="flex justify-between border-b border-slate-800/80 py-1.5"><span>Storage Quota</span><span className="font-mono font-bold text-slate-100">{p.maxStorageGB} GB</span></div>
                <div className="flex justify-between border-b border-slate-800/80 py-1.5"><span>AI Credits</span><span className="font-mono font-bold text-emerald-400">{p.maxAiCredits.toLocaleString()}</span></div>
                <div className="flex justify-between border-b border-slate-800/80 py-1.5"><span>Team Seats</span><span className="font-mono font-bold text-slate-100">{p.maxTeamMembers}</span></div>
                <div className="flex justify-between py-1.5"><span>API Access</span><span className={`font-bold ${p.apiAccessEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>{p.apiAccessEnabled ? 'Enabled' : 'Disabled'}</span></div>
              </div>
            </div>

            <button className="w-full py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition">
              Edit Plan Tier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
