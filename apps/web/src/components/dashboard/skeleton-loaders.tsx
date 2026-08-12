import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl animate-pulse space-y-2">
      <div className="h-3 w-24 bg-slate-800 rounded" />
      <div className="h-8 w-16 bg-slate-800 rounded" />
    </div>
  );
}

export function PlatformCardSkeleton() {
  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl animate-pulse flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800" />
        <div className="space-y-1">
          <div className="h-3 w-20 bg-slate-800 rounded" />
          <div className="h-2 w-28 bg-slate-800 rounded" />
        </div>
      </div>
      <div className="h-5 w-16 bg-slate-800 rounded-full" />
    </div>
  );
}

export function ActivityRowSkeleton() {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl animate-pulse flex justify-between items-center">
      <div className="space-y-2 flex-1 mr-4">
        <div className="h-4 w-48 bg-slate-800 rounded" />
        <div className="h-3 w-72 bg-slate-800 rounded" />
      </div>
      <div className="h-6 w-20 bg-slate-800 rounded-full" />
    </div>
  );
}
