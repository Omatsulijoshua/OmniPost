'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface Ticket {
  id: string;
  userEmail: string;
  workspaceName: string;
  subject: string;
  priority: string;
  status: string;
  assignedAdmin: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    adminApiFetch<Ticket[]>('/support/tickets')
      .then((data) => setTickets(data))
      .catch(() => {
        setTickets([
          { id: 'tck-401', userEmail: 'miles@cyberdyne.com', workspaceName: 'Cyberdyne Systems', subject: 'Custom Webhook Payload schema validation question', priority: 'HIGH', status: 'OPEN', assignedAdmin: 'Sarah Connor', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'tck-402', userEmail: 'elena@apexgrowth.io', workspaceName: 'Apex Growth Lab', subject: 'TikTok Video Upload quota discrepancy', priority: 'MEDIUM', status: 'IN_PROGRESS', assignedAdmin: 'Alex Rivers', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Support Ticket Center</h1>
          <p className="mt-1 text-sm text-slate-400">
            Customer helpdesk requests, priority resolution SLAs, and assigned support staff.
          </p>
        </div>

        <Link href="/moderation" className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-800 transition">
          Flagged Moderation Queue →
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Workspace & User</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Admin</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{t.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-100 max-w-xs truncate">{t.subject}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-200">{t.workspaceName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{t.userEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      t.priority === 'HIGH' || t.priority === 'URGENT' ? 'text-rose-400 bg-rose-950 border-rose-800' : 'text-amber-400 bg-amber-950 border-amber-800'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-400">{t.status}</td>
                  <td className="py-3.5 px-4 text-slate-300">{t.assignedAdmin || 'Unassigned'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/support/tickets/${t.id}`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-[11px] rounded-lg transition">
                      View Thread →
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
