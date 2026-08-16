'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-slate-200 dark:bg-slate-800 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 animate-pulse">
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
    </div>
  );
}

export function EmptyState({
  title = 'No Records Found',
  description = 'No items match your current filter criteria.',
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
        <Inbox className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  message = 'An unexpected error occurred while fetching system data.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-3xl space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-rose-900 dark:text-rose-200">System Error Encountered</h3>
        <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
}
