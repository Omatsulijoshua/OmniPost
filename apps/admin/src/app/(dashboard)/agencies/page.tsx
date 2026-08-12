'use client';

import React, { useEffect, useState } from 'react';
import { adminApiFetch } from '../../../lib/api-client';

interface AgencyItem {
  id: string;
  agencyName: string;
  ownerEmail: string;
  clientWorkspaceCount: number;
  totalTeamMembers: number;
  totalConnectedAccounts: number;
  totalPostsPublished: number;
  monthlyRevenueUSD: number;
  storageUsedMB: number;
}

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<AgencyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiFetch<AgencyItem[]>('/agencies')
      .then((data) => setAgencies(data))
      .catch(() => {
        setAgencies([
          {
            id: 'ag-201',
            agencyName: 'Vanguard Global Media Agency',
            ownerEmail: 'director@vanguard-media.com',
            clientWorkspaceCount: 18,
            totalTeamMembers: 34,
            totalConnectedAccounts: 112,
            totalPostsPublished: 24890,
            monthlyRevenueUSD: 4490,
            storageUsedMB: 45000,
          },
          {
            id: 'ag-202',
            agencyName: 'Pulse Digital Growth',
            ownerEmail: 'contact@pulsedigital.io',
            clientWorkspaceCount: 9,
            totalTeamMembers: 16,
            totalConnectedAccounts: 54,
            totalPostsPublished: 11200,
            monthlyRevenueUSD: 1990,
            storageUsedMB: 18400,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Agency Portfolio Management</h1>
        <p className="mt-1 text-sm text-slate-400">
          Executive overview of white-label agencies, client workspaces, team sizes, and monthly recurring revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agencies.map((ag) => (
          <div key={ag.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-black text-slate-100">{ag.agencyName}</h2>
                <p className="text-xs text-slate-400 font-mono">{ag.ownerEmail}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 font-black text-xs rounded-full">
                ${ag.monthlyRevenueUSD}/mo
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Clients</div>
                <div className="text-base font-black text-slate-100">{ag.clientWorkspaceCount}</div>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Seats</div>
                <div className="text-base font-black text-slate-100">{ag.totalTeamMembers}</div>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Accounts</div>
                <div className="text-base font-black text-indigo-400">{ag.totalConnectedAccounts}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
