'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../lib/auth-store';
import { DeveloperKeysModal } from '../../components/settings/developer-keys-modal';

export default function AdminPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const user = useAuthStore((state) => state.user);

  const [showDeveloperKeysModal, setShowDeveloperKeysModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Admin Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">OmniPost Admin Portal</h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded-full uppercase">
                  System Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Workspace: <span className="text-blue-400 font-bold">{activeWorkspace?.name || 'Primary Workspace'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>👤</span> Switch to User Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Body Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Admin Command Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage global developer API credentials, user access roles, workspace security, and platform billing.
          </p>
        </div>

        {/* Quick Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-2xl">
              🔑
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Developer API Keys</h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure production OAuth Client Keys & Secrets for TikTok, Meta, YouTube, X, and LinkedIn.
              </p>
            </div>
            <button
              onClick={() => setShowDeveloperKeysModal(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all"
            >
              Configure API Keys
            </button>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Team & Roles</h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage team member access roles (Owner, Admin, Editor, Publisher, Analyst).
              </p>
            </div>
            <Link
              href="/settings/team"
              className="block w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-center text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Manage Team Members
            </Link>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Security & Audit</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enforce 2FA, session timeout controls, and view platform security audit logs.
              </p>
            </div>
            <Link
              href="/settings/security"
              className="block w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-center text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Security Settings
            </Link>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-2xl">
              💳
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Billing & Plans</h3>
              <p className="text-xs text-slate-400 mt-1">
                View workspace plan tier, monthly posting quotas, and active payment subscriptions.
              </p>
            </div>
            <Link
              href="/billing"
              className="block w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-center text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Billing Admin
            </Link>
          </div>
        </div>

        {/* System Diagnostics Card */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚙️</span>
              <div>
                <h3 className="text-sm font-extrabold text-white">Production System Environment</h3>
                <p className="text-xs text-slate-400">Current active endpoints and cloud infrastructure</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 font-sans text-[11px] mb-1">Frontend Web Domain</div>
              <div className="text-blue-400 font-bold truncate">https://omnipost-web-ivory.vercel.app</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 font-sans text-[11px] mb-1">Backend API Domain</div>
              <div className="text-emerald-400 font-bold truncate">https://omnipost-api.onrender.com</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 font-sans text-[11px] mb-1">OAuth Redirect URI</div>
              <div className="text-amber-400 font-bold truncate">.../oauth/callback</div>
            </div>
          </div>
        </div>
      </main>

      <DeveloperKeysModal
        isOpen={showDeveloperKeysModal}
        onClose={() => setShowDeveloperKeysModal(false)}
      />
    </div>
  );
}
