'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WorkspaceSwitcher } from './workspace-switcher';
import { useAuthStore } from '../../lib/auth-store';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Create Post', href: '/create', icon: '✍️' },
  { label: 'Content Queue', href: '/content', icon: '📁' },
  { label: 'Calendar', href: '/calendar', icon: '📅' },
  { label: 'Media Library', href: '/media', icon: '🖼️' },
  { label: 'Social Accounts', href: '/social-accounts', icon: '🌐' },
  { label: 'AI Studio', href: '/ai-studio', icon: '✨' },
  { label: 'Approvals & Team', href: '/approvals', icon: '🛡️' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
  { label: 'Brand Kit', href: '/brand-kit', icon: '🎨' },
  { label: 'Team Members', href: '/settings/team', icon: '👥' },
  { label: 'Billing & Plans', href: '/billing', icon: '💳' },
  { label: 'Settings', href: '/settings/profile', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col p-4 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
          OP
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
            OmniPost
          </span>
          <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest mt-0.5">
            SaaS Platform
          </span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="mb-6">
        <WorkspaceSwitcher />
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 truncate">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          <div className="truncate">
            <div className="text-xs font-bold text-slate-800 truncate">{user?.name || 'User'}</div>
            <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors ml-2"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
