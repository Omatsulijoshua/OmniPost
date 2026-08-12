'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, LogOut, Shield } from 'lucide-react';
import { useAdminAuthStore } from '../../stores/admin-auth-store';

export function AdminHeader() {
  const router = useRouter();
  const admin = useAdminAuthStore((state) => state.admin);
  const logoutAdmin = useAdminAuthStore((state) => state.logoutAdmin);

  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logoutAdmin();
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    alert(`Searching OmniPost Admin records for: "${searchQuery}"`);
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-80">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users, workspaces, posts, jobs..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </form>

      {/* Header Actions & Profile Pill */}
      <div className="flex items-center gap-4">
        {/* Incident Alerts */}
        <button
          onClick={() => alert('No active critical incidents!')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl relative"
          title="Incident Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-slate-900" />
        </button>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="text-right space-y-0.5">
            <div className="text-xs font-bold text-slate-100">{admin?.name || 'Platform Admin'}</div>
            <div className="flex items-center justify-end gap-1">
              <Shield className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-400">{admin?.role || 'SUPER_ADMIN'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-rose-400 hover:bg-rose-950/60 border border-rose-800/40 rounded-xl"
            title="Sign Out Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
