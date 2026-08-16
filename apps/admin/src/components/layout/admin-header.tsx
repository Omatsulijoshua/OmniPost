'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, LogOut, Shield, User, Lock, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useAdminAuthStore } from '../../stores/admin-auth-store';
import { getRoleDisplayName } from '../../lib/rbac';

export function AdminHeader() {
  const router = useRouter();
  const { admin, logoutAdmin } = useAdminAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    router.push('/login');
  };

  const notificationsList = [
    {
      id: '1',
      title: 'TikTok Publishing Rate Limit Warning',
      desc: 'TikTok API rate limit reached 88% capacity for Workspace ABC.',
      time: '12m ago',
      type: 'warning',
    },
    {
      id: '2',
      title: 'Critical Job Execution Retry',
      desc: 'YouTube video upload retry succeeded for Job #839203.',
      time: '45m ago',
      type: 'info',
    },
    {
      id: '3',
      title: 'Stripe Webhook Payment Failed',
      desc: 'Invoice #inv_992 failed payment for Pro Growth tier.',
      time: '2h ago',
      type: 'error',
    },
  ];

  return (
    <header className="h-16 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 pl-14 md:pl-6 pr-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-xs sm:max-w-sm md:w-80">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onFocus={() => setShowSearchModal(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search OmniPost..."
          className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
        />

        {/* Global Search Results Overlay Modal */}
        {showSearchModal && (
          <div className="fixed sm:absolute top-16 sm:top-12 left-2 right-2 sm:left-0 sm:right-auto sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Global Admin Search
              </span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {searchQuery ? (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-blue-600 dark:text-blue-400">👥 Users matching &quot;{searchQuery}&quot;</div>
                  <div className="text-[11px] text-slate-500">Found 3 matching accounts</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">🏢 Workspaces matching &quot;{searchQuery}&quot;</div>
                  <div className="text-[11px] text-slate-500">Found 1 active workspace</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Quick Searches:</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button onClick={() => setSearchQuery('joshua')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-medium rounded-lg">joshua</button>
                  <button onClick={() => setSearchQuery('failed')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-medium rounded-lg">failed jobs</button>
                  <button onClick={() => setSearchQuery('inv_')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-medium rounded-lg">invoices</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Actions & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition"
            title="System Incident Alerts"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-12 w-[calc(100vw-1rem)] sm:w-80 max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">System Notifications</h4>
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full">
                  3 Unread
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notificationsList.map((item) => (
                  <div key={item.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>{item.title}</span>
                      <span className="text-[10px] font-normal text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-xs shadow-md">
              {admin?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-black text-slate-900 dark:text-slate-100 leading-tight">
                {admin?.name || 'Super Administrator'}
              </div>
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                {admin?.role ? getRoleDisplayName(admin.role) : 'Super Admin'}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl z-50 space-y-2">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">{admin?.email || 'admin@omnipost.com'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Last login: {new Date(admin?.lastLoginAt || Date.now()).toLocaleTimeString()}</div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/security/policies"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Security & MFA</span>
                </Link>
                <Link
                  href="/settings/roles"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>RBAC Role Permissions</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 font-extrabold text-xs rounded-xl transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
