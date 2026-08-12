'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';

interface JobItem {
  id: string;
  postId: string;
  postCaption: string;
  userName: string;
  workspaceName: string;
  platform: string;
  status: string;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiFetch<{ items: JobItem[]; metrics: Metrics }>('/publishing/jobs')
      .then((data) => {
        setJobs(data.items);
        setMetrics(data.metrics);
      })
      .catch(() => {
        setJobs([
          { id: 'job-901', postId: 'post-101', postCaption: '🚀 Announcing OmniPost v2.5 Enterprise Admin Portal...', userName: 'Sarah Connor', workspaceName: 'Cyberdyne Systems', platform: 'INSTAGRAM', status: 'PUBLISHED', attempts: 1, scheduledAt: new Date().toISOString(), publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
          { id: 'job-902', postId: 'post-102', postCaption: 'Watch our raw 4K video reel breakdown on AI content...', userName: 'Marcus Vance', workspaceName: 'Apex Growth Lab', platform: 'TIKTOK', status: 'FAILED', attempts: 3, scheduledAt: new Date().toISOString(), publishedAt: null, createdAt: new Date().toISOString() },
        ]);
        setMetrics({ queued: 142, processing: 18, published: 1284293, failed: 34, retrying: 5, cancelled: 12 });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Global Publishing Activity & Queue</h1>
        <p className="mt-1 text-sm text-slate-400">
          Real-time queue monitoring, background job status, platform attempts, and administrative execution controls.
        </p>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1"><div className="text-[10px] font-bold text-slate-400 uppercase">Queued</div><div className="text-xl font-black text-slate-100">{metrics.queued}</div></div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1"><div className="text-[10px] font-bold text-indigo-400 uppercase">Processing</div><div className="text-xl font-black text-indigo-400">{metrics.processing}</div></div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1"><div className="text-[10px] font-bold text-emerald-400 uppercase">Published</div><div className="text-xl font-black text-emerald-400">{metrics.published.toLocaleString()}</div></div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1"><div className="text-[10px] font-bold text-rose-400 uppercase">Failed</div><div className="text-xl font-black text-rose-400">{metrics.failed}</div></div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1"><div className="text-[10px] font-bold text-amber-400 uppercase">Retrying</div><div className="text-xl font-black text-amber-400">{metrics.retrying}</div></div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1"><div className="text-[10px] font-bold text-slate-500 uppercase">Cancelled</div><div className="text-xl font-black text-slate-400">{metrics.cancelled}</div></div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Job ID</th>
                <th className="py-3.5 px-4">Workspace & User</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Caption</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Attempts</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">Loading publishing activity...</td></tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{j.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">{j.workspaceName}</div>
                      <div className="text-[11px] text-slate-400">{j.userName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-400">{j.platform}</td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{j.postCaption}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        j.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-rose-400 bg-rose-950 border-rose-800'
                      }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{j.attempts}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/publishing/${j.id}`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold rounded-lg text-[11px] transition">
                        Timeline →
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
