'use client';

import React from 'react';
import { PostStatus, RecentActivityItem } from '@omnipost/types';

interface RecentActivityProps {
  activity: RecentActivityItem[];
}

export function RecentActivity({ activity }: RecentActivityProps) {
  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 rounded-full">PUBLISHED</span>;
      case 'SCHEDULED':
        return <span className="px-2 py-0.5 text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/50 rounded-full">SCHEDULED</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800/50 rounded-full">FAILED</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded-full">DRAFT</span>;
    }
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Recent Activity</h2>
          <p className="text-xs text-slate-400">Recently created, scheduled, and published posts</p>
        </div>
      </div>

      {activity.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
          No recent activity found. Create your first post to get started!
        </div>
      ) : (
        <div className="divide-y divide-slate-800/80">
          {activity.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              <div className="space-y-1 max-w-xl">
                <div className="text-sm font-semibold text-slate-200 truncate">{item.title}</div>
                <div className="text-xs text-slate-400 line-clamp-1">{item.universalCaption}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.platformTypes.length > 0 && (
                    <span>• {item.platformTypes.join(', ')}</span>
                  )}
                </div>
              </div>

              <div>{getStatusBadge(item.status)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
