'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';

interface FlaggedItem {
  id: string;
  postId: string;
  postCaption: string;
  userName: string;
  workspaceName: string;
  reason: string;
  severity: string;
  status: string;
  createdAt: string;
}

export default function AdminModerationPage() {
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadFlagged = () => {
    adminApiFetch<FlaggedItem[]>('/moderation/flagged')
      .then((data) => setItems(data))
      .catch(() => {
        setItems([
          { id: 'flg-101', postId: 'post-901', postCaption: 'WIN $1,000,000 CASH NOW!! Click suspicious link right here http://spam-link.test', userName: 'Bot Account 492', workspaceName: 'Unverified Free Workspace', reason: 'SPAM', severity: 'CRITICAL', status: 'PENDING_REVIEW', createdAt: new Date().toISOString() },
          { id: 'flg-102', postId: 'post-902', postCaption: 'Copyrighted audio soundtrack included in commercial promotional video ad.', userName: 'Marcus Vance', workspaceName: 'Apex Growth Lab', reason: 'COPYRIGHT', severity: 'MEDIUM', status: 'PENDING_REVIEW', createdAt: new Date().toISOString() },
        ]);
      });
  };

  useEffect(() => {
    loadFlagged();
  }, []);

  const handleAction = async (id: string, action: string) => {
    try {
      await adminApiFetch(`/moderation/flagged/${id}/action`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
      setActionMsg(`Enforcement action "${action}" applied to flag ${id}.`);
      loadFlagged();
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <Link href="/support/tickets" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Support Tickets
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Flagged Content Moderation Hub</h1>
        <p className="mt-1 text-sm text-slate-400">
          AI & user reported policy violations, spam detection, copyright flags, and administrative enforcement.
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
          {actionMsg}
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-bold text-rose-400 bg-rose-950 border border-rose-800 rounded-full">
                  {item.reason}
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">Severity: {item.severity}</span>
              </div>
              <p className="text-xs font-semibold text-slate-100">{item.postCaption}</p>
              <div className="text-[11px] text-slate-400 font-mono">
                Workspace: {item.workspaceName} • Author: {item.userName}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAction(item.id, 'APPROVE')}
                className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold text-xs rounded-xl transition"
              >
                Approve Post
              </button>
              <button
                onClick={() => handleAction(item.id, 'BLOCK')}
                className="px-3.5 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs rounded-xl transition"
              >
                Block Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
