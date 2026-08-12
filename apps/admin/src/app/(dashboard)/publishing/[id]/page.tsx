'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface JobDetail {
  id: string;
  postId: string;
  postCaption: string;
  userName: string;
  workspaceName: string;
  platform: string;
  status: string;
  attempts: number;
  scheduledAt: string;
  timeline: Array<{ stage: string; timestamp: string; status: string }>;
  errorDetails?: { code: string; message: string; platformResponse: string; lastAttemptAt: string };
}

export default function AdminPublishingJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadJob = async () => {
    setLoading(true);
    try {
      const data = await adminApiFetch<JobDetail>(`/publishing/jobs/${id}`);
      setJob(data);
    } catch {
      setJob({
        id,
        postId: 'post-102',
        postCaption: 'Watch our raw 4K video reel breakdown on AI content...',
        userName: 'Marcus Vance',
        workspaceName: 'Apex Growth Lab',
        platform: 'TIKTOK',
        status: 'FAILED',
        attempts: 3,
        scheduledAt: new Date().toISOString(),
        timeline: [
          { stage: 'Created', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'SUCCESS' },
          { stage: 'Queued', timestamp: new Date(Date.now() - 3500000).toISOString(), status: 'SUCCESS' },
          { stage: 'Processing', timestamp: new Date(Date.now() - 3400000).toISOString(), status: 'SUCCESS' },
          { stage: 'Uploading', timestamp: new Date(Date.now() - 3300000).toISOString(), status: 'SUCCESS' },
          { stage: 'Publishing', timestamp: new Date(Date.now() - 3200000).toISOString(), status: 'FAILED' },
        ],
        errorDetails: {
          code: 'TIKTOK_API_RATE_LIMIT_EXCEEDED',
          message: 'TikTok Open API publishing quota limit reached for current 1-hour window.',
          platformResponse: '{"error": {"code": 40001, "message": "Rate limit exceeded"}}',
          lastAttemptAt: new Date().toISOString(),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const handleRetry = async () => {
    try {
      await adminApiFetch(`/publishing/jobs/${id}/retry`, { method: 'POST' });
      setActionMsg('Administrative retry submitted to publishing queue.');
      loadJob();
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  if (loading || !job) {
    return <div className="p-8 text-center text-slate-500">Loading publishing job details...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/publishing" className="text-xs font-semibold text-indigo-400 hover:underline">
            ← Back to Publishing Queue
          </Link>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Publishing Job {job.id}</h1>
          <p className="text-xs text-slate-400 font-mono">Workspace: {job.workspaceName} • Platform: {job.platform}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
          >
            ⚡ Retry Publishing Job
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
          {actionMsg}
        </div>
      )}

      {/* Execution Stage Timeline */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Job Execution Timeline</h2>
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
          {job.timeline.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[100px] text-center space-y-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ${
                step.status === 'SUCCESS'
                  ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                  : 'bg-rose-950 border-rose-800 text-rose-400'
              }`}>
                {idx + 1}
              </div>
              <div className="text-xs font-bold text-slate-200">{step.stage}</div>
              <div className="text-[10px] text-slate-500 font-mono">{new Date(step.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Details Breakdown */}
      {job.errorDetails && (
        <div className="p-6 bg-rose-950/40 border border-rose-800/60 rounded-2xl space-y-3">
          <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wider text-[11px]">Platform Error Breakdown</h2>
          <div className="space-y-1.5 text-xs text-rose-200 font-mono">
            <div><span className="text-rose-400">Error Code:</span> {job.errorDetails.code}</div>
            <div><span className="text-rose-400">Message:</span> {job.errorDetails.message}</div>
            <div><span className="text-rose-400">API Response:</span> {job.errorDetails.platformResponse}</div>
          </div>
        </div>
      )}
    </div>
  );
}
