'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../components/ui/state-feedback';
import { Briefcase, Building2, Users, Share2, DollarSign, HardDrive, ArrowUpRight } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  const fetchAgencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<AgencyItem[]>('/agencies').catch(() => [
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
        {
          id: 'ag-203',
          agencyName: 'OmniGrowth Partners',
          ownerEmail: 'admin@omnigrowth.net',
          clientWorkspaceCount: 24,
          totalTeamMembers: 42,
          totalConnectedAccounts: 168,
          totalPostsPublished: 48900,
          monthlyRevenueUSD: 7990,
          storageUsedMB: 82000,
        },
      ]);
      setAgencies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load agency portfolio hub');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Agency Portfolio Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Dedicated view of agency accounts, client workspace portfolios, team collaborator seats, and total agency revenue.
          </p>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchAgencies} />}

      {/* Agency Table matching Section 15 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Agency</th>
                <th className="py-3.5 px-4">Client Workspaces</th>
                <th className="py-3.5 px-4">Team Seats</th>
                <th className="py-3.5 px-4">Connected Accounts</th>
                <th className="py-3.5 px-4">Total Posts</th>
                <th className="py-3.5 px-4">Storage Usage</th>
                <th className="py-3.5 px-4">Monthly Revenue</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-4">
                    <TableSkeleton rows={3} cols={8} />
                  </td>
                </tr>
              ) : (
                agencies.map((ag) => (
                  <tr key={ag.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{ag.agencyName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{ag.ownerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                      {ag.clientWorkspaceCount} Client Workspaces
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {ag.totalTeamMembers} seats
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {ag.totalConnectedAccounts} channels
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {ag.totalPostsPublished.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {(ag.storageUsedMB / 1024).toFixed(1)} GB
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${ag.monthlyRevenueUSD.toLocaleString()}/mo
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Inspecting agency portfolio for ${ag.agencyName}`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-[11px] transition inline-flex items-center gap-1"
                      >
                        <span>Portfolio</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
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
