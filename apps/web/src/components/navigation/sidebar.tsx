'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WorkspaceSwitcher } from './workspace-switcher';
import { useAuthStore } from '../../lib/auth-store';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Create', href: '/create' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Content', href: '/content' },
  { label: 'Media Library', href: '/media' },
  { label: 'Social Accounts', href: '/social-accounts' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'AI Studio', href: '/ai-studio' },
  { label: 'Templates', href: '/templates' },
  { label: 'Brand Kit', href: '/brand-kit' },
  { label: 'Team', href: '/settings/team' },
  { label: 'Billing', href: '/billing' },
  { label: 'Settings', href: '/settings/profile' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black">
          OP
        </div>
        <span className="font-bold text-lg text-slate-100 tracking-tight">OmniPost</span>
      </div>

      <div className="mb-6">
        <WorkspaceSwitcher />
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="truncate">
          <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'User'}</div>
          <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
        </div>
        <button
          onClick={logout}
          className="text-xs text-rose-400 hover:underline ml-2"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
