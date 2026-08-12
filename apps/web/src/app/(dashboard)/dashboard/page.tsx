'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { ConnectedPlatformStatus, DashboardStats, RecentActivityItem } from '@omnipost/types';
import { StatsOverview } from '../../../components/dashboard/stats-overview';
import { ConnectedPlatforms } from '../../../components/dashboard/connected-platforms';
import { RecentActivity } from '../../../components/dashboard/recent-activity';
import { QuickActions } from '../../../components/dashboard/quick-actions';
import { ActivityRowSkeleton, PlatformCardSkeleton, StatCardSkeleton } from '../../../components/dashboard/skeleton-loaders';

export default function DashboardPage() {
  const { user, activeWorkspace } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivityItem[]>([]);
  const [platforms, setPlatforms] = useState<ConnectedPlatformStatus[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [statsData, activityData, platformsData] = await Promise.all([
        apiFetch<DashboardStats>('/dashboard/stats'),
        apiFetch<RecentActivityItem[]>('/dashboard/activity'),
        apiFetch<ConnectedPlatformStatus[]>('/dashboard/connected-platforms'),
      ]);

      setStats(statsData);
      setActivity(activityData);
      setPlatforms(platformsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeWorkspace?.id]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Overview for{' '}
            <span className="font-semibold text-indigo-400">
              {activeWorkspace?.name || 'Personal Workspace'}
            </span>
          </p>
        </div>

        <QuickActions />
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl flex items-center justify-between">
          <div className="text-sm text-rose-300">{error}</div>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1 bg-rose-900 hover:bg-rose-800 text-xs font-semibold text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlatformCardSkeleton key={i} />
            ))}
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ActivityRowSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {stats && <StatsOverview stats={stats} />}
          <ConnectedPlatforms platforms={platforms} />
          <RecentActivity activity={activity} />
        </div>
      )}
    </div>
  );
}
