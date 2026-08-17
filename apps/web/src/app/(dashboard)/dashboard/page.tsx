'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch, DEFAULT_STATS, DEFAULT_ACTIVITY, DEFAULT_CONNECTED_PLATFORMS } from '../../../lib/api-client';
import { ConnectedPlatformStatus, DashboardStats, RecentActivityItem } from '@omnipost/types';
import { StatsOverview } from '../../../components/dashboard/stats-overview';
import { ConnectedPlatforms } from '../../../components/dashboard/connected-platforms';
import { RecentActivity } from '../../../components/dashboard/recent-activity';
import { QuickActions } from '../../../components/dashboard/quick-actions';
import { ActivityRowSkeleton, PlatformCardSkeleton, StatCardSkeleton } from '../../../components/dashboard/skeleton-loaders';

export default function DashboardPage() {
  const { user, activeWorkspace } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [activity, setActivity] = useState<RecentActivityItem[]>(DEFAULT_ACTIVITY);
  const [platforms, setPlatforms] = useState<ConnectedPlatformStatus[]>(DEFAULT_CONNECTED_PLATFORMS);

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsData, activityData, platformsData] = await Promise.all([
        apiFetch<DashboardStats>('/dashboard/stats').catch(() => DEFAULT_STATS),
        apiFetch<RecentActivityItem[]>('/dashboard/activity').catch(() => DEFAULT_ACTIVITY),
        apiFetch<ConnectedPlatformStatus[]>('/dashboard/connected-platforms').catch(() => DEFAULT_CONNECTED_PLATFORMS),
      ]);

      if (statsData) setStats(statsData);
      if (activityData) setActivity(activityData);
      if (platformsData) setPlatforms(platformsData);
    } catch {
      // Retain state smoothly
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
              {activeWorkspace?.name || "Joshua's Publishing Workspace"}
            </span>
          </p>
        </div>

        <QuickActions />
      </div>

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
          <StatsOverview stats={stats} />
          <ConnectedPlatforms platforms={platforms} />
          <RecentActivity activity={activity} />
        </div>
      )}
    </div>
  );
}
