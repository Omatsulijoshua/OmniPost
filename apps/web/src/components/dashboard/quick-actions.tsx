'use client';

import React from 'react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    { label: '+ Create Post', href: '/create', primary: true },
    { label: 'Upload Media', href: '/media', primary: false },
    { label: 'Connect Account', href: '/social-accounts', primary: false },
    { label: 'View Calendar', href: '/calendar', primary: false },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm ${
            action.primary
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700'
          }`}
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}
