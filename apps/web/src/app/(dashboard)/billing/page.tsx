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
    { tier: 'FREE', name: 'Free Tier', price: 0, desc: 'For individuals exploring social posting (30-day media auto-wipe)' },
    { tier: 'CREATOR', name: 'Creator', price: 29, desc: 'For growing creators scaling across channels (30-day media auto-wipe)' },
    { tier: 'PRO', name: 'Pro Growth', price: 79, desc: 'For multi-brand teams with Permanent Lifetime Storage included' },
    { tier: 'AGENCY', name: 'Agency Unlimited', price: 199, desc: 'For agencies managing client portfolios with Permanent Storage' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscriptions & Billing</h1>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Manage usage limits, media retention policies, plan tiers, and billing invoices for{' '}
          <span className="font-bold text-blue-600">{activeWorkspace?.name}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Usage Quota Gauges */}
      {sub && (
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">Monthly Usage & Storage Quotas</h2>
            <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs rounded-full">
              ACTIVE PLAN: {sub.tier}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-500">Posts Published</div>
              <div className="text-xl font-extrabold text-slate-900">
                {sub.quota.postsThisMonth} / {sub.quota.maxPostsPerMonth}
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.postsThisMonth / sub.quota.maxPostsPerMonth) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-500">AI Credits Used</div>
              <div className="text-xl font-extrabold text-slate-900">
                {sub.quota.aiCreditsUsed} / {sub.quota.maxAiCredits}
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.aiCreditsUsed / sub.quota.maxAiCredits) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-500">Social Accounts</div>
              <div className="text-xl font-extrabold text-slate-900">
                {sub.quota.connectedAccounts} / {sub.quota.maxConnectedAccounts}
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.connectedAccounts / sub.quota.maxConnectedAccounts) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-500">Media Storage</div>
              <div className="text-xl font-extrabold text-slate-900">
                {sub.quota.storageUsedMB} MB / {sub.quota.maxStorageMB} MB
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.storageUsedMB / sub.quota.maxStorageMB) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Media Auto-Wipe vs Permanent Retention Policy Section */}
          <div className="p-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 border border-blue-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>📦 Media Storage Retention Policy</span>
                  {sub.quota.permanentStorageEnabled ? (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-full">
                      PERMANENT LIFETIME ARCHIVE (Active)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded-full">
                      30-DAY AUTO-WIPE POLICY (Active)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sub.quota.permanentStorageEnabled
                    ? 'Your workspace has Permanent Lifetime Storage active. Heavy videos and photos will never be auto-deleted after 30 days.'
                    : 'Heavy video and photo files are set to auto-wipe after 30 days to save cloud space. Upgrade to Pro/Agency or enable the Permanent Storage Pass to retain media forever.'}
                </p>
              </div>

              {!sub.quota.permanentStorageEnabled && (
                <button
                  onClick={() => handleCheckout('PRO')}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 whitespace-nowrap transition-all"
                >
                  ⚡ Enable Permanent Storage ($15/mo Add-On)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plan Tiers */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900">Choose Subscription Plan</h2>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setBillingInterval('MONTHLY')}
              className={`px-3.5 py-1.5 font-bold rounded-lg transition-all ${
                billingInterval === 'MONTHLY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingInterval('ANNUAL')}
              className={`px-3.5 py-1.5 font-bold rounded-lg transition-all ${
                billingInterval === 'ANNUAL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
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
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                  isCurrent
                    ? 'bg-blue-50/40 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">{t.name}</span>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 text-[9px] font-extrabold text-blue-700 bg-blue-100 border border-blue-300 rounded-full">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ${price}
                    <span className="text-xs text-slate-500 font-normal"> /mo</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{t.desc}</p>
                </div>

                <button
                  onClick={() => handleCheckout(t.tier)}
                  disabled={isCurrent || upgrading}
                  className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                  }`}
                >
                  {isCurrent ? 'Current Active Plan' : `Upgrade to ${t.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Invoice & Billing History</h2>

        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs font-medium">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-3.5 flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">{inv.id}</span>
                <span>${inv.amountUSD} USD</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded text-[10px]">
                  {inv.status}
                </span>
              </div>
              <a
                href={inv.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-600 hover:underline"
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
