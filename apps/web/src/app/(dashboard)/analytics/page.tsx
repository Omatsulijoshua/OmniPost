'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import {
  AnalyticsOverview,
  PlatformMetricsBreakdown,
  TopPostMetric,
} from '@omnipost/types';

export default function AnalyticsPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [timeframe, setTimeframe] = useState<string>('30d');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [breakdown, setBreakdown] = useState<PlatformMetricsBreakdown[]>([]);
  const [topPosts, setTopPosts] = useState<TopPostMetric[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [overviewData, breakdownData, topPostsData] = await Promise.all([
        apiFetch<AnalyticsOverview>('/analytics/overview'),
        apiFetch<PlatformMetricsBreakdown[]>('/analytics/platforms'),
        apiFetch<TopPostMetric[]>('/analytics/top-posts'),
      ]);

      setOverview(overviewData);
      setBreakdown(breakdownData || []);
      setTopPosts(topPostsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [activeWorkspace?.id, timeframe]);

  const handleExportCsv = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/analytics/export', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('omnipost_access_token')}`,
          'x-workspace-id': activeWorkspace?.id || '',
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omnipost_analytics_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV report');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Analytics & Intelligence</h1>
          <p className="mt-1 text-sm text-slate-400">
            Cross-platform metric normalization and performance benchmarks for{' '}
            <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
            {['7d', '30d', '90d', 'all'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  timeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 shadow-sm"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      {loading || !overview ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Views & Impressions</div>
            <div className="text-2xl font-black text-slate-100">{overview.totalViews.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">↑ 14.2% vs previous period</div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Estimated Total Reach</div>
            <div className="text-2xl font-black text-slate-100">{overview.totalReach.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">↑ 9.8% unique audience</div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Avg Engagement Rate</div>
            <div className="text-2xl font-black text-indigo-400">{overview.averageEngagementRate}%</div>
            <div className="text-[11px] text-indigo-300 font-semibold">Industry Benchmark: 3.5%</div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Interactions</div>
            <div className="text-2xl font-black text-slate-100">
              {(overview.totalLikes + overview.totalComments + overview.totalShares).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              {overview.totalLikes.toLocaleString()} Likes • {overview.totalComments.toLocaleString()} Comments
            </div>
          </div>
        </div>
      )}

      {/* Platform Comparison Breakdown */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Cross-Platform Comparative Metrics</h2>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          <div className="px-5 py-3 grid grid-cols-6 text-xs font-bold text-slate-500 uppercase">
            <div>Platform</div>
            <div>Views</div>
            <div>Likes</div>
            <div>Comments</div>
            <div>Shares</div>
            <div>Engagement Rate</div>
          </div>

          {breakdown.map((b) => (
            <div key={b.platformType} className="px-5 py-3.5 grid grid-cols-6 text-xs text-slate-200 items-center">
              <div className="font-bold text-indigo-400">{b.platformType}</div>
              <div>{b.views.toLocaleString()}</div>
              <div>{b.likes.toLocaleString()}</div>
              <div>{b.comments.toLocaleString()}</div>
              <div>{b.shares.toLocaleString()}</div>
              <div className="font-bold text-emerald-400">{b.engagementRate}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Top Performing Content</h2>

        <div className="space-y-3">
          {topPosts.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-100">{p.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{p.universalCaption}</p>
                <div className="flex gap-2 text-[10px] text-slate-500 pt-1">
                  {p.platformTypes.map((pt) => (
                    <span key={pt} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">
                      {pt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Views</span>
                  <span className="font-bold text-slate-200">{p.views.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Likes</span>
                  <span className="font-bold text-slate-200">{p.likes.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Engagement</span>
                  <span className="font-bold text-emerald-400">{p.engagementRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
