'use client';

import React from 'react';
import { useAdminAuthStore } from '../stores/admin-auth-store';

export default function AdminLandingPage() {
  const admin = useAdminAuthStore((state) => state.admin);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 font-black text-xl shadow-lg shadow-indigo-600/30">
            OP
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">OmniPost Admin Portal</h1>
          <p className="text-xs text-slate-400">Enterprise Operations & Operational Control System</p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Admin Account</span>
            <span className="font-bold text-indigo-400">{admin?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Role</span>
            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
              {admin?.role}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">MFA Status</span>
            <span className="text-slate-200 font-semibold">{admin?.mfaEnabled ? 'Protected 🔒' : 'Disabled'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href="/dashboard"
            className="block w-full py-3 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
          >
            Enter Executive Dashboard →
          </a>
          <a
            href="/login"
            className="block w-full py-2.5 text-center bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs rounded-xl transition border border-slate-700"
          >
            Sign In with Different Admin Credentials
          </a>
        </div>
      </div>
    </div>
  );
}
