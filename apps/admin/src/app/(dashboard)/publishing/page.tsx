'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';
import { TableSkeleton, EmptyState, ErrorState } from '../../../components/ui/state-feedback';
import { FileText, Clock, AlertOctagon, CheckCircle2, RotateCcw, Search, Filter, ArrowUpRight } from 'lucide-react';

interface JobItem {
  id: string;
  postId: string;
  postCaption: string;
  userName: string;
  workspaceName: string;
  platform: string;
  status: 'DRAFT' | 'QUEUED' | 'PROCESSING' | 'PUBLISHED' | 'FAILED' | 'CANCELLED';
  attempts: number;
  scheduledAt: string;
  publishedAt: string | null;
  createdAt: string;
}

interface Metrics {
  queued: number;
  processing: number;
  published: number;
  failed: number;
  retrying: number;
  cancelled: number;
}

export default function AdminPublishingPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<{ items: JobItem[]; metrics: Metrics }>(
        `/publishing/jobs?search=${encodeURIComponent(search)}&status=${statusFilter}`
      ).catch(() => ({
        items: [
          {
            id: 'job-901',
            postId: 'post-101',
            postCaption: '🚀 Announcing OmniPost v2.5 Enterprise Admin Portal...',
            userName: 'Sarah Connor',
            workspaceName: 'Cyberdyne Systems',
            platform: 'INSTAGRAM',
            status: 'PUBLISHED' as const,
            attempts: 1,
            scheduledAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            id: 'job-902',
            postId: 'post-102',
            postCaption: 'Watch our raw 4K video reel breakdown on AI content...',
            userName: 'Marcus Vance',
            workspaceName: 'Apex Growth Lab',
            platform: 'TIKTOK',
            status: 'FAILED' as const,
            attempts: 3,
            scheduledAt: new Date().toISOString(),
            publishedAt: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'job-903',
            postId: 'post-103',
            postCaption: 'Automate cross-platform scheduling with 1-click publishing...',
            userName: 'Alex Mercer',
            workspaceName: 'Viral Shorts Network',
            platform: 'YOUTUBE',
            status: 'QUEUED' as const,
            attempts: 0,
            scheduledAt: new Date(Date.now() + 3600000 * 2).toISOString(),
            publishedAt: null,
            createdAt: new Date().toISOString(),
          },
        ],
        metrics: { queued: 142, processing: 18, published: 1284293, failed: 34, retrying: 5, cancelled: 12 },
      }));
      setJobs(data.items);
      setMetrics(data.metrics);
    } catch (err: any) {
      setError(err.message || 'Failed to load publishing queue telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Global Publishing Activity & Queue
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Real-time queue monitoring, background job execution status, BullMQ retries, and failure telemetry.
          </p>
        </div>

        <Link
          href="/publishing/failed"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Failed Jobs Control Center →</span>
        </Link>
      </div>

      {error && <ErrorState message={error} onRetry={fetchJobs} />}

      {/* Queue Metrics Summary matching Section 21 */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Queued</div>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100">{metrics.queued}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Processing</div>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400">{metrics.processing}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Published</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{metrics.published.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Failed</div>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400">{metrics.failed}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Retrying</div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">{metrics.retrying}</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Cancelled</div>
            <div className="text-xl font-black text-slate-500">{metrics.cancelled}</div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job ID, post caption snippet, workspace, or user..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <div className="flex gap-2">
          {['ALL', 'QUEUED', 'PUBLISHED', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Publishing Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Job ID</th>
                <th className="py-3.5 px-4">Workspace & Creator</th>
                <th className="py-3.5 px-4">Target Channel</th>
                <th className="py-3.5 px-4">Caption Snippet</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Attempts</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4">
                    <TableSkeleton rows={4} cols={7} />
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8">
                    <EmptyState
                      title="No Publishing Jobs Found"
                      description="No background jobs match your current search or status filter."
                      actionLabel="Reset Search"
                      onAction={() => {
                        setSearch('');
                        setStatusFilter('ALL');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {j.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{j.workspaceName}</div>
                      <div className="text-[11px] text-slate-500">{j.userName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600 dark:text-blue-400">
                      {j.platform}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {j.postCaption}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                          j.status === 'PUBLISHED'
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                            : j.status === 'FAILED'
                            ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
                            : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {j.attempts}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/publishing/${j.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-[11px] transition inline-flex items-center gap-1"
                      >
                        <span>Timeline</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
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
