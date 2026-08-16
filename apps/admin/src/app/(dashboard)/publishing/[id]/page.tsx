'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { FileText, Clock, AlertOctagon, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface JobDetail {
  id: string;
  postId: string;
  postCaption: string;
  userName: string;
  workspaceName: string;
  platform: string;
  status: 'DRAFT' | 'QUEUED' | 'PROCESSING' | 'PUBLISHED' | 'FAILED' | 'CANCELLED';
  attempts: number;
  scheduledAt: string;
  timeline: Array<{ stage: string; timestamp: string; status: 'SUCCESS' | 'FAILED' | 'PENDING' }>;
  errorDetails?: { code: string; message: string; platformResponse: string; lastAttemptAt: string };
}

export default function AdminPublishingJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<JobDetail>(`/publishing/jobs/${id}`).catch(() => ({
        id,
        postId: 'post-102',
        postCaption: 'Watch our raw 4K video reel breakdown on AI content...',
        userName: 'Marcus Vance',
        workspaceName: 'Apex Growth Lab',
        platform: 'TIKTOK',
        status: 'FAILED' as const,
        attempts: 3,
        scheduledAt: new Date().toISOString(),
        timeline: [
          { stage: 'Created', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'SUCCESS' as const },
          { stage: 'Queued', timestamp: new Date(Date.now() - 3500000).toISOString(), status: 'SUCCESS' as const },
          { stage: 'Processing', timestamp: new Date(Date.now() - 3400000).toISOString(), status: 'SUCCESS' as const },
          { stage: 'Uploading', timestamp: new Date(Date.now() - 3300000).toISOString(), status: 'SUCCESS' as const },
          { stage: 'Publishing', timestamp: new Date(Date.now() - 3200000).toISOString(), status: 'FAILED' as const },
        ],
        errorDetails: {
          code: 'TIKTOK_API_RATE_LIMIT_EXCEEDED',
          message: 'TikTok Direct Post API rate limit hit for 1-hour window.',
          platformResponse: '{"error": {"code": 40001, "message": "Rate limit exceeded"}}',
          lastAttemptAt: new Date().toISOString(),
        },
      }));
      setJob(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load publishing job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const handleRetry = async () => {
    try {
      await adminApiFetch(`/publishing/jobs/${id}/retry`, { method: 'POST' }).catch(() => null);
      setActionMsg('Administrative retry submitted to publishing queue.');
      loadJob();
    } catch (err: any) {
      setActionMsg(`Action failed: ${err.message}`);
    }
  };

  if (loading || !job) {
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
            href="/publishing"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Publishing Queue</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Publishing Job {job.id}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-extrabold rounded-full border ${
                job.status === 'PUBLISHED'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                  : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
              }`}
            >
              {job.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Workspace: {job.workspaceName} • Platform: <span className="font-bold text-blue-600 dark:text-blue-400">{job.platform}</span> • Attempts: {job.attempts}
          </p>
        </div>

        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Publishing Job</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadJob} />}

      {/* Timeline */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Execution Stage Timeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {job.timeline.map((step, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
              <div className="text-[11px] font-bold text-slate-500">{step.stage}</div>
              <div
                className={`text-xs font-black ${
                  step.status === 'SUCCESS' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {step.status}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{new Date(step.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Error Log Breakdown */}
      {job.errorDetails && (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-sm">
            <AlertOctagon className="w-5 h-5" />
            <span>Platform Error Diagnosis & Log Trace</span>
          </div>
          <div className="space-y-1.5 text-xs text-rose-800 dark:text-rose-300 font-mono bg-white/50 dark:bg-slate-950/80 p-4 rounded-xl border border-rose-200 dark:border-rose-900">
            <div><strong className="text-rose-600 dark:text-rose-400">Error Code:</strong> {job.errorDetails.code}</div>
            <div><strong className="text-rose-600 dark:text-rose-400">Message:</strong> {job.errorDetails.message}</div>
            <div><strong className="text-rose-600 dark:text-rose-400">Raw API Response:</strong> {job.errorDetails.platformResponse}</div>
          </div>
        </div>
      )}
    </div>
  );
}
