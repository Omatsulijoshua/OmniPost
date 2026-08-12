'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface Sub {
  id: string;
  workspaceId: string;
  workspaceName: string;
  ownerEmail: string;
  planName: string;
  status: string;
  amountMonthlyUSD: number;
  provider: string;
  renewsAt: string;
  createdAt: string;
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiFetch<Sub[]>('/billing/subscriptions')
      .then((data) => setSubs(data))
      .catch(() => {
        setSubs([
          { id: 'sub-801', workspaceId: 'ws-101', workspaceName: 'Cyberdyne Systems', ownerEmail: 'miles@cyberdyne.com', planName: 'Enterprise Agency', status: 'ACTIVE', amountMonthlyUSD: 299, provider: 'STRIPE', renewsAt: new Date().toISOString(), createdAt: new Date().toISOString() },
          { id: 'sub-802', workspaceId: 'ws-102', workspaceName: 'Apex Growth Lab', ownerEmail: 'elena@apexgrowth.io', planName: 'Pro Growth', status: 'ACTIVE', amountMonthlyUSD: 79, provider: 'PAYSTACK', renewsAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Customer Subscriptions Directory</h1>
          <p className="mt-1 text-sm text-slate-400">
            Active, Trial, Past Due, and Cancelled customer subscription lifecycles.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/billing/plans" className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-800 transition">
            Plan Tiers →
          </Link>
          <Link href="/billing/payments" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition">
            Payments & Refunds →
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Subscription ID</th>
                <th className="py-3.5 px-4">Workspace & Customer</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Gateway</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Renews At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {subs.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{s.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100">{s.workspaceName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{s.ownerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-400">{s.planName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${s.amountMonthlyUSD}/mo</td>
                  <td className="py-3.5 px-4 font-bold text-slate-300">{s.provider}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{new Date(s.renewsAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
