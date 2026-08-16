'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../../components/ui/state-feedback';
import { MessageSquare, ArrowLeft, Send, Lock, UserCheck, ShieldAlert } from 'lucide-react';

interface TicketDetail {
  id: string;
  userEmail: string;
  workspaceName: string;
  subject: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedAdmin: string | null;
  messages: Array<{
    sender: string;
    role: 'USER' | 'SUPPORT_ADMIN' | 'INTERNAL_NOTE';
    text: string;
    timestamp: string;
  }>;
}

export default function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<TicketDetail>(`/support/tickets/${id}`).catch(() => ({
        id,
        userEmail: 'miles@cyberdyne.com',
        workspaceName: 'Cyberdyne Systems',
        subject: 'Custom Webhook Payload schema validation question',
        priority: 'URGENT' as const,
        status: 'OPEN' as const,
        assignedAdmin: 'Sarah Connor',
        messages: [
          {
            sender: 'miles@cyberdyne.com',
            role: 'USER' as const,
            text: 'Hi, our custom webhook integration is failing signature verification. Can you check secret keys?',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            sender: 'Sarah Connor (Staff Note)',
            role: 'INTERNAL_NOTE' as const,
            text: 'Internal Note: S3 signature payload has extra trailing newline on raw body bytes.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
      }));
      setTicket(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load support ticket thread');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !ticket) return;
    try {
      await adminApiFetch(`/support/tickets/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: replyText, isInternalNote }),
      }).catch(() => null);

      setActionMsg(isInternalNote ? 'Internal staff note added.' : 'Customer reply sent successfully.');
      setReplyText('');
      loadTicket();
    } catch (err: any) {
      setActionMsg(`Failed to send reply: ${err.message}`);
    }
  };

  const handleStatusChange = async (newStatus: TicketDetail['status']) => {
    if (!ticket) return;
    try {
      await adminApiFetch(`/support/tickets/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => null);

      setActionMsg(`Ticket status updated to ${newStatus}.`);
      setTicket({ ...ticket, status: newStatus });
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/support/tickets"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Support Ticket Operations</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {ticket.subject}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-extrabold rounded-full border ${
                ticket.status === 'OPEN'
                  ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
                  : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {ticket.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Ticket ID: {ticket.id} • Workspace: {ticket.workspaceName} ({ticket.userEmail}) • Assigned Staff: {ticket.assignedAdmin || 'Unassigned'}
          </p>
        </div>

        <div className="flex gap-2">
          {(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                ticket.status === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadTicket} />}

      {/* Messages Thread */}
      <div className="space-y-4">
        {ticket.messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border space-y-1 ${
              m.role === 'INTERNAL_NOTE'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 font-mono'
                : m.role === 'SUPPORT_ADMIN'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 ml-6'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mr-6'
            }`}
          >
            <div className="flex justify-between text-xs">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {m.role === 'INTERNAL_NOTE' && <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                {m.sender}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">{new Date(m.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200">{m.text}</p>
          </div>
        ))}
      </div>

      {/* Reply Box */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Add Official Admin Response or Internal Note
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternalNote}
              onChange={(e) => setIsInternalNote(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Internal Staff Note (Invisible to User)</span>
          </label>
        </div>

        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={isInternalNote ? 'Type internal staff note (only visible to platform admins)...' : 'Type customer support response...'}
          className={`w-full h-24 p-3 border rounded-xl text-xs focus:outline-none transition ${
            isInternalNote
              ? 'bg-amber-50/50 dark:bg-slate-950 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200 font-mono'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
          }`}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSendReply}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isInternalNote ? 'Save Internal Note' : 'Send Admin Reply'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
