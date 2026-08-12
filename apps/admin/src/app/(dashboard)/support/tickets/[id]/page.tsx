'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../../lib/api-client';

interface TicketDetail {
  id: string;
  userEmail: string;
  workspaceName: string;
  subject: string;
  priority: string;
  status: string;
  assignedAdmin: string | null;
  messages: Array<{ sender: string; role: string; text: string; timestamp: string }>;
}

export default function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadTicket = () => {
    adminApiFetch<TicketDetail>(`/support/tickets/${id}`)
      .then((data) => setTicket(data))
      .catch(() => {
        setTicket({
          id,
          userEmail: 'miles@cyberdyne.com',
          workspaceName: 'Cyberdyne Systems',
          subject: 'Custom Webhook Payload schema validation question',
          priority: 'HIGH',
          status: 'OPEN',
          assignedAdmin: 'Sarah Connor',
          messages: [
            { sender: 'miles@cyberdyne.com', role: 'USER', text: 'Hi, our custom webhook integration is failing signature verification. Can you check secret keys?', timestamp: new Date().toISOString() },
          ],
        });
      });
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      await adminApiFetch(`/support/tickets/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: replyText }),
      });
      setReplyText('');
      loadTicket();
    } catch {}
  };

  if (!ticket) return <div className="p-8 text-center text-slate-500">Loading ticket thread...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link href="/support/tickets" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Support Ticket Center
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">{ticket.subject}</h1>
        <p className="text-xs text-slate-400">Ticket ID: {ticket.id} • Workspace: {ticket.workspaceName} ({ticket.userEmail})</p>
      </div>

      <div className="space-y-4">
        {ticket.messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border space-y-1 ${
              m.role === 'SUPPORT_ADMIN' ? 'bg-indigo-950/40 border-indigo-800/60 ml-8' : 'bg-slate-900 border-slate-800 mr-8'
            }`}
          >
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-100">{m.sender}</span>
              <span className="text-slate-500 font-mono">{new Date(m.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs text-slate-300">{m.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type official admin support reply..."
          className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSendReply}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
          >
            Send Admin Reply
          </button>
        </div>
      </div>
    </div>
  );
}
