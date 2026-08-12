'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import {
  SubscriptionPlanDetail,
  InvoiceItem,
  SubscriptionTier,
} from '@omnipost/types';

export default function BillingPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [sub, setSub] = useState<SubscriptionPlanDetail | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [billingInterval, setBillingInterval] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBillingData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [subData, invoicesData] = await Promise.all([
        apiFetch<SubscriptionPlanDetail>('/billing/subscription'),
        apiFetch<InvoiceItem[]>('/billing/invoices'),
      ]);
      setSub(subData);
      setInvoices(invoicesData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription billing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, [activeWorkspace?.id]);

  const handleCheckout = async (targetTier: SubscriptionTier) => {
    setUpgrading(true);
    try {
      const data = await apiFetch<{ checkoutUrl: string }>('/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ targetTier, billingInterval }),
      });
      if (data?.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (err: any) {
      alert(err.message || 'Checkout failed');
    } finally {
      setUpgrading(false);
    }
  };

  const tiers: { tier: SubscriptionTier; name: string; price: number; desc: string }[] = [
    { tier: 'FREE', name: 'Free Tier', price: 0, desc: 'For individuals exploring social posting' },
    { tier: 'CREATOR', name: 'Creator', price: 29, desc: 'For growing creators scaling across channels' },
    { tier: 'PRO', name: 'Pro Growth', price: 79, desc: 'For multi-brand teams and power creators' },
    { tier: 'AGENCY', name: 'Agency Unlimited', price: 199, desc: 'For agencies managing client portfolios' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Subscriptions & Billing</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage usage limits, plan tiers, and billing invoices for{' '}
          <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Usage Quota Gauges */}
      {sub && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">Monthly Usage Quotas</h2>
            <span className="px-3 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold text-xs rounded-full">
              ACTIVE PLAN: {sub.tier}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-slate-400">Posts Published</div>
              <div className="text-lg font-black text-slate-100">
                {sub.quota.postsThisMonth} / {sub.quota.maxPostsPerMonth}
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.postsThisMonth / sub.quota.maxPostsPerMonth) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-slate-400">AI Credits Used</div>
              <div className="text-lg font-black text-slate-100">
                {sub.quota.aiCreditsUsed} / {sub.quota.maxAiCredits}
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.aiCreditsUsed / sub.quota.maxAiCredits) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-slate-400">Social Accounts</div>
              <div className="text-lg font-black text-slate-100">
                {sub.quota.connectedAccounts} / {sub.quota.maxConnectedAccounts}
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.connectedAccounts / sub.quota.maxConnectedAccounts) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-slate-400">Media Storage</div>
              <div className="text-lg font-black text-slate-100">
                {sub.quota.storageUsedMB} MB / {sub.quota.maxStorageMB} MB
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.storageUsedMB / sub.quota.maxStorageMB) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plan Tiers */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-100">Choose Subscription Plan</h2>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setBillingInterval('MONTHLY')}
              className={`px-3 py-1 font-semibold rounded-lg ${
                billingInterval === 'MONTHLY' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingInterval('ANNUAL')}
              className={`px-3 py-1 font-semibold rounded-lg ${
                billingInterval === 'ANNUAL' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Annual Billing (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t) => {
            const isCurrent = sub?.tier === t.tier;
            const price = billingInterval === 'ANNUAL' ? Math.round(t.price * 0.8) : t.price;

            return (
              <div
                key={t.tier}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-100">{t.name}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 rounded-full">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-100">
                    ${price}
                    <span className="text-xs text-slate-500 font-normal"> /mo</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                </div>

                <button
                  onClick={() => handleCheckout(t.tier)}
                  disabled={isCurrent || upgrading}
                  className={`w-full py-2 text-xs font-bold rounded-xl transition ${
                    isCurrent
                      ? 'bg-slate-900 text-slate-500 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${t.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Invoice & Billing History</h2>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-xs">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-3.5 flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-100">{inv.id}</span>
                <span>${inv.amountUSD} USD</span>
                <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold rounded text-[10px]">
                  {inv.status}
                </span>
              </div>
              <a
                href={inv.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-indigo-400 hover:underline"
              >
                📄 Download PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
