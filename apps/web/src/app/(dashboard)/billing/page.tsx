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

  const tiers: {
    tier: SubscriptionTier;
    name: string;
    price: number;
    channelsLimit: string;
    postsLimit: string;
    desc: string;
    features: string[];
    badge?: string;
  }[] = [
    {
      tier: 'FREE',
      name: 'Free Starter',
      price: 0,
      channelsLimit: '3 Social Channels',
      postsLimit: '10 Posts / mo',
      desc: 'For individuals exploring social channel management',
      features: ['3 Connected Social Channels', '10 Posts per month', '30-Day Media Retention', 'Basic Analytics'],
    },
    {
      tier: 'CREATOR',
      name: 'Creator Tier',
      price: 29,
      channelsLimit: '10 Social Channels',
      postsLimit: '100 Posts / mo',
      desc: 'For growing creators publishing across up to 10 channels',
      features: ['10 Connected Social Channels', '100 Posts per month', '1,000 AI Studio Credits', '3 Team Collaborator Seats'],
      badge: 'POPULAR FOR CREATORS',
    },
    {
      tier: 'PRO',
      name: 'Pro Growth',
      price: 79,
      channelsLimit: '25 Social Channels',
      postsLimit: '500 Posts / mo',
      desc: 'For multi-brand teams needing high channel capacity & permanent media storage',
      features: [
        '25 Connected Social Channels',
        '500 Posts per month',
        'Permanent Lifetime Media Storage',
        '5,000 AI Studio Credits',
        '10 Team Seats & Approval Queues',
      ],
      badge: 'RECOMMENDED',
    },
    {
      tier: 'AGENCY',
      name: 'Agency Unlimited',
      price: 199,
      channelsLimit: 'UNLIMITED Socials',
      postsLimit: 'UNLIMITED Posts',
      desc: 'For agencies managing massive multi-brand client portfolios',
      features: [
        'UNLIMITED Connected Social Channels',
        'UNLIMITED Posts per month',
        'Permanent Lifetime Media Storage',
        '25,000 AI Credits',
        'Unlimited Collaborators & Client Approvals',
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Social Accounts & Subscription Plans</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
          Choose a plan based on the number of connected social channels your workspace requires (3 Channels, 10 Channels, 25 Channels, or Unlimited).
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Current Quota Progress Gauges */}
      {sub && (
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">Current Workspace Channel & Usage Quotas</h2>
            <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs rounded-full">
              ACTIVE PLAN: {sub.tier}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
              <div className="text-xs font-extrabold text-blue-700 uppercase">Connected Social Channels</div>
              <div className="text-2xl font-black text-slate-900">
                {sub.quota.connectedAccounts} / {sub.quota.maxConnectedAccounts > 500 ? '∞' : sub.quota.maxConnectedAccounts}
              </div>
              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.connectedAccounts / (sub.quota.maxConnectedAccounts > 500 ? 100 : sub.quota.maxConnectedAccounts)) * 100)}%`,
                  }}
                />
              </div>
              <div className="text-[10px] text-blue-700 font-bold">
                {sub.tier === 'FREE' && 'Upgrade to Creator for 10 Channels'}
                {sub.tier === 'CREATOR' && 'Upgrade to Pro for 25 Channels'}
                {sub.tier === 'PRO' && 'Upgrade to Agency for Unlimited Channels'}
                {sub.tier === 'AGENCY' && 'Unlimited Social Channels Active'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Posts Published</div>
              <div className="text-xl font-extrabold text-slate-900">
                {sub.quota.postsThisMonth} / {sub.quota.maxPostsPerMonth > 50000 ? '∞' : sub.quota.maxPostsPerMonth}
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full"
                  style={{
                    width: `${Math.min(100, (sub.quota.postsThisMonth / (sub.quota.maxPostsPerMonth > 50000 ? 1000 : sub.quota.maxPostsPerMonth)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">AI Credits Used</div>
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
              <div className="text-xs font-bold text-slate-500 uppercase">Media Storage</div>
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
        </div>
      )}

      {/* Subscription Tier Matrix */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Select Plan by Social Channel Capacity</h2>
            <p className="text-xs text-slate-500">Pick the plan that accommodates your target social accounts</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setBillingInterval('MONTHLY')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                billingInterval === 'MONTHLY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingInterval('ANNUAL')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                billingInterval === 'ANNUAL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Annual (Save 20%)
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
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all relative ${
                  isCurrent
                    ? 'bg-blue-50/40 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                {t.badge && !isCurrent && (
                  <span className="absolute -top-3 left-4 px-2.5 py-0.5 text-[9px] font-extrabold text-white bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full shadow-xs">
                    {t.badge}
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900">{t.name}</span>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 text-[9px] font-extrabold text-blue-700 bg-blue-100 border border-blue-300 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-center">
                    <div className="text-sm font-black text-blue-700">{t.channelsLimit}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{t.postsLimit}</div>
                  </div>

                  <div className="text-2xl font-black text-slate-900">
                    ${price}
                    <span className="text-xs text-slate-500 font-normal"> /mo</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{t.desc}</p>

                  <div className="pt-2 space-y-1.5 border-t border-slate-100">
                    {t.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700 font-semibold">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCheckout(t.tier)}
                  disabled={isCurrent || upgrading}
                  className={`w-full py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-98'
                  }`}
                >
                  {isCurrent ? 'Current Active Plan' : `Upgrade to ${t.channelsLimit}`}
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
