'use client';

import React from 'react';
import { DashboardStats } from '@omnipost/types';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    { label: 'Total Posts', value: stats.totalPosts, color: 'text-slate-100' },
    { label: 'Scheduled', value: stats.scheduledPosts, color: 'text-amber-400' },
    { label: 'Published', value: stats.publishedPosts, color: 'text-emerald-400' },
    { label: 'Failed', value: stats.failedPosts, color: 'text-rose-400' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'text-indigo-400' },
    { label: 'Engagement', value: stats.totalEngagement.toLocaleString(), color: 'text-sky-400' },
    { label: 'Followers', value: stats.totalFollowers.toLocaleString(), color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {card.label}
          </div>
          <div className={`text-2xl font-black mt-1 ${card.color}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
