'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../../lib/auth-store';

export default function SecuritySettingsPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const user = useAuthStore((state) => state.user);

  const [downloadingLogs, setDownloadingLogs] = useState(false);

  const handleExportAuditLogs = async () => {
    setDownloadingLogs(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://omnipost-api.onrender.com/api/v1';
      const response = await fetch(
        `${apiUrl}/approvals/audit-logs/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('omnipost_access_token')}`,
            'x-workspace-id': activeWorkspace?.id || '',
          },
        },
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omnipost_audit_logs_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message || 'Failed to export audit logs');
    } finally {
      setDownloadingLogs(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Security & Hardening Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Governance audit logs, encryption at rest status, and security compliance for{' '}
          <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
        </p>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">AES-256-GCM Encryption</span>
            <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
              ACTIVE
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Tokens & Secrets Encrypted</div>
          <p className="text-xs text-slate-400">All OAuth credentials and API secrets are encrypted at rest using AES-256-GCM.</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Helmet & Rate Limiting</span>
            <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full">
              PROTECTED
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">DDoS & Brute Force Shield</div>
          <p className="text-xs text-slate-400">API endpoints protected via ThrottlerGuard, HSTS, and strict CORS rules.</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Two-Factor Auth (2FA)</span>
            <span className="px-2 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-950 border border-amber-800 rounded-full">
              OPTIONAL
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">TOTP Authenticator</div>
          <p className="text-xs text-slate-400">Account status: {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}.</p>
        </div>
      </div>

      {/* Security Audit Log Export Section */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100">Security Audit Trail CSV Export</h2>
            <p className="text-xs text-slate-400 mt-1">
              Download complete raw audit logs of all user actions, post approvals, role modifications, and login events.
            </p>
          </div>

          <button
            onClick={handleExportAuditLogs}
            disabled={downloadingLogs}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 whitespace-nowrap"
          >
            {downloadingLogs ? 'Exporting...' : '📥 Export Audit CSV'}
          </button>
        </div>
      </div>

      {/* Active User Sessions */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Active Security Sessions</h2>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-xs">
          <div className="p-3.5 flex items-center justify-between text-slate-300">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <span>Current Web Session (Windows / Chrome)</span>
                <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 rounded">
                  THIS DEVICE
                </span>
              </div>
              <div className="text-slate-500 text-[10px]">{user?.email} • Last active just now</div>
            </div>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
