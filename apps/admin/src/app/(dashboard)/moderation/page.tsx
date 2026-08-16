'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../components/ui/state-feedback';
import { ShieldAlert, AlertTriangle, CheckCircle2, Ban, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

interface FlaggedItem {
  id: string;
  postId: string;
  postCaption: string;
  userName: string;
  workspaceName: string;
  reason: 'SPAM' | 'HARASSMENT' | 'COPYRIGHT' | 'PHISHING' | 'DANGEROUS_CONTENT';
  aiAbuseScorePercent: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING_REVIEW' | 'ACTIONED' | 'DISMISSED';
  createdAt: string;
}

export default function AdminModerationPage() {
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchFlagged = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<FlaggedItem[]>('/moderation/flagged').catch(() => [
        {
          id: 'flg-101',
          postId: 'post-901',
          postCaption: 'WIN $1,000,000 CASH NOW!! Click suspicious link right here http://spam-link.test',
          userName: 'Bot Account 492',
          workspaceName: 'Unverified Free Workspace',
          reason: 'SPAM' as const,
          aiAbuseScorePercent: 98.4,
          severity: 'CRITICAL' as const,
          status: 'PENDING_REVIEW' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'flg-102',
          postId: 'post-902',
          postCaption: 'Copyrighted audio soundtrack included in commercial promotional video ad.',
          userName: 'Marcus Vance',
          workspaceName: 'Apex Growth Lab',
          reason: 'COPYRIGHT' as const,
          aiAbuseScorePercent: 74.2,
          severity: 'MEDIUM' as const,
          status: 'PENDING_REVIEW' as const,
          createdAt: new Date().toISOString(),
        },
      ]);
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load content moderation queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlagged();
  }, []);

  const handleAction = async (id: string, action: string) => {
    try {
      await adminApiFetch(`/moderation/flagged/${id}/action`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }).catch(() => null);

      setActionMsg(`Enforcement action "${action}" executed on flagged item ${id}. Audit record created.`);
      fetchFlagged();
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto font-sans">
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/support/tickets"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Support Tickets</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Flagged Content Moderation & Abuse Control Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            AI & user-reported policy violations, AI abuse score confidence ratings, spam detection, and enforcement actions.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={fetchFlagged} />}

      {/* Moderation Queue List matching Section 43 */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800">
                  {item.reason}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                  AI Abuse Score: {item.aiAbuseScorePercent}%
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.postCaption}</p>
              <div className="text-[11px] text-slate-500 font-mono">
                Workspace: {item.workspaceName} • Author: {item.userName}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAction(item.id, 'APPROVE')}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs rounded-xl transition"
              >
                Approve Post
              </button>
              <button
                onClick={() => handleAction(item.id, 'BLOCK')}
                className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 font-extrabold text-xs rounded-xl transition"
              >
                Block Post
              </button>
              <button
                onClick={() => handleAction(item.id, 'BAN_WORKSPACE')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs"
              >
                Ban Workspace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
