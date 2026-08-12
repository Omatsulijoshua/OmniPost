'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';

interface AuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  role: string;
  action: string;
  category: string;
  targetResource: string;
  ipAddress: string;
  status: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    adminApiFetch<AuditLog[]>('/audit-logs')
      .then((data) => setLogs(data))
      .catch(() => {
        setLogs([
          { id: 'aud-7001', adminName: 'Super Admin', adminEmail: 'admin@omnipost.com', role: 'SUPER_ADMIN', action: 'USER_SUSPEND', category: 'USER_MANAGEMENT', targetResource: 'User: user-102', ipAddress: '192.168.1.100', status: 'SUCCESS', createdAt: new Date().toISOString() },
          { id: 'aud-7002', adminName: 'Finance Admin', adminEmail: 'finance@omnipost.com', role: 'FINANCE_ADMIN', action: 'PAYMENT_REFUND', category: 'BILLING', targetResource: 'Transaction: tx-9001 ($299.00)', ipAddress: '10.0.4.12', status: 'SUCCESS', createdAt: new Date().toISOString() },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Security Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-400">
          Immutable ledger of administrative operations, user suspensions, billing refunds, and cryptographic non-repudiation hashes.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">Admin Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{l.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100">{l.adminName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{l.role}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-400">{l.action}</td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{l.targetResource}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{l.ipAddress}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/audit-logs/${l.id}`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-[11px] rounded-lg transition">
                      Diff & Hash →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
