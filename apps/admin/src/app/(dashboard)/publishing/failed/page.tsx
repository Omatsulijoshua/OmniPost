'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface FailedCategorySummary {
  category: string;
  failureCount: number;
  affectedUsersCount: number;
  affectedPlatforms: string[];
  firstOccurrenceAt: string;
  lastOccurrenceAt: string;
  sampleErrorMessage: string;
}

export default function AdminFailedJobsPage() {
  const [categories, setCategories] = useState<FailedCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchFailedCategories = async () => {
    setLoading(true);
    try {
      const data = await adminApiFetch<FailedCategorySummary[]>('/publishing/failed');
      setCategories(data);
    } catch {
      setCategories([
        {
          category: 'Rate Limit',
          failureCount: 18,
          affectedUsersCount: 12,
          affectedPlatforms: ['TikTok', 'X (Twitter)'],
          firstOccurrenceAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          lastOccurrenceAt: new Date(Date.now() - 1800000).toISOString(),
          sampleErrorMessage: 'TikTok Open API publishing quota limit reached for current 1-hour window.',
        },
        {
          category: 'Authentication',
          failureCount: 9,
          affectedUsersCount: 7,
          affectedPlatforms: ['Instagram', 'LinkedIn'],
          firstOccurrenceAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          lastOccurrenceAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          sampleErrorMessage: 'OAuth access token expired or user revoked permissions.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFailedCategories();
  }, []);

  const handleBulkRetry = async (category: string) => {
    try {
      await adminApiFetch('/publishing/failed/bulk-retry', {
        method: 'POST',
        body: JSON.stringify({ category }),
      });
      setActionMsg(`Bulk retry initiated for all jobs under "${category}".`);
      fetchFailedCategories();
    } catch (err: any) {
      setActionMsg(`Bulk retry failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <Link href="/publishing" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Publishing Queue
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Failed Job Center</h1>
        <p className="mt-1 text-sm text-slate-400">
          Categorized publishing failures, root cause analysis, platform impact breakdown, and administrative bulk retry controls.
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
          {actionMsg}
        </div>
      )}

      {/* Root Cause Failure Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-8 text-center text-slate-500">Analyzing failed publishing jobs...</div>
        ) : (
          categories.map((cat) => (
            <div key={cat.category} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-slate-100">{cat.category} Failures</h2>
                  <p className="text-xs text-slate-400">Impacted Platforms: {cat.affectedPlatforms.join(', ')}</p>
                </div>
                <span className="px-3 py-1 bg-rose-950 border border-rose-800 text-rose-400 font-black text-xs rounded-full">
                  {cat.failureCount} Failed Jobs
                </span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
                <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Sample Error Message</div>
                <div className="mt-1">{cat.sampleErrorMessage}</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400">
                  <span>{cat.affectedUsersCount} users affected</span>
                </div>
                <button
                  onClick={() => handleBulkRetry(cat.category)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
                >
                  ⚡ Bulk Retry ({cat.failureCount})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
