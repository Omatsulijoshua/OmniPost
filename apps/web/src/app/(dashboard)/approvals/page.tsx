'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import {
  ApprovalRequestDetail,
  ApprovalCommentDetail,
  AuditLogItem,
} from '@omnipost/types';

export default function ApprovalsPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [requests, setRequests] = useState<ApprovalRequestDetail[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<ApprovalCommentDetail[]>([]);
  const [newComment, setNewComment] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [reqs, logs] = await Promise.all([
        apiFetch<ApprovalRequestDetail[]>('/approvals/pending'),
        apiFetch<AuditLogItem[]>('/approvals/audit-logs'),
      ]);
      setRequests(reqs || []);
      setAuditLogs(logs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load approvals data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeWorkspace?.id]);

  const loadComments = async (postId: string) => {
    setSelectedPostId(postId);
    try {
      const data = await apiFetch<ApprovalCommentDetail[]>(`/approvals/comments/${postId}`);
      setComments(data || []);
    } catch (err: any) {
      alert(err.message || 'Failed to load comments');
    }
  };

  const handleAction = async (requestId: string, action: 'APPROVE' | 'REJECT') => {
    const feedback = prompt(
      action === 'APPROVE'
        ? 'Optional approval note:'
        : 'Reason for rejection (feedback for author):',
    );
    if (action === 'REJECT' && feedback === null) return;

    try {
      await apiFetch(`/approvals/act/${requestId}`, {
        method: 'POST',
        body: JSON.stringify({ action, comment: feedback || undefined }),
      });
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to process approval action');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !newComment) return;

    try {
      const added = await apiFetch<ApprovalCommentDetail>('/approvals/comments', {
        method: 'POST',
        body: JSON.stringify({ postId: selectedPostId, content: newComment }),
      });
      setComments((prev) => [...prev, added]);
      setNewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to add comment');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Team Approvals & Governance</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review pending post drafts, discuss internal feedback, and inspect audit logs for{' '}
          <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Pending Approvals Grid */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center justify-between">
          <span>Pending Review Requests ({requests.length})</span>
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-950 border border-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
            No posts currently awaiting approval!
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">{req.postTitle}</h3>
                    <span className="px-2 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-950 border border-amber-800 rounded-full">
                      PENDING
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {req.universalCaption}
                  </p>

                  <div className="text-[10px] text-slate-500 pt-0.5">
                    Author: {req.authorName} • Submitted {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadComments(req.postId)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-lg"
                  >
                    💬 Discuss
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'APPROVE')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-600/20"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'REJECT')}
                    className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal Discussion Panel */}
      {selectedPostId && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-100">Internal Post Discussion</h2>
            <button
              onClick={() => setSelectedPostId(null)}
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              Close Thread ✕
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto p-3 bg-slate-950 border border-slate-800 rounded-xl">
            {comments.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-4">No internal notes yet.</div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-900 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span className="font-bold text-indigo-400">{c.authorName}</span>
                    <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-200">{c.content}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write feedback comment..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newComment}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Workspace Audit Logs */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Governance Audit Trail</h2>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                <span className="font-bold text-slate-100">{log.actorName}</span>
                <span>performed</span>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold text-indigo-400">
                  {log.action}
                </span>
                <span>on {log.entity}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
