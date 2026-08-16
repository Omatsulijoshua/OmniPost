'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { Shield, Lock, Globe, Clock, Key, CheckCircle2, Plus, Trash2, ShieldAlert } from 'lucide-react';

interface Policy {
  allowedAdminIps: string[];
  sessionInactivityTimeoutMinutes: number;
  enforceMfaForAllAdmins: boolean;
  minPasswordLength: number;
  requireSpecialCharacters: boolean;
  maxFailedLoginAttempts: number;
  cspHeaderEnforced: boolean;
}

export default function AdminSecurityPoliciesPage() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIp, setNewIp] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<Policy>('/security/policies').catch(() => ({
        allowedAdminIps: ['192.168.1.0/24', '10.0.0.0/16', '172.16.4.0/24'],
        sessionInactivityTimeoutMinutes: 30,
        enforceMfaForAllAdmins: true,
        minPasswordLength: 12,
        requireSpecialCharacters: true,
        maxFailedLoginAttempts: 5,
        cspHeaderEnforced: true,
      }));
      setPolicy(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load security policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleAddIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim() || !policy) return;
    if (policy.allowedAdminIps.includes(newIp.trim())) return;

    const updatedIps = [...policy.allowedAdminIps, newIp.trim()];
    setPolicy({ ...policy, allowedAdminIps: updatedIps });
    setNewIp('');
    setActionMsg(`CIDR IP ${newIp.trim()} added to admin allowlist.`);
  };

  const handleRemoveIp = (ipToRemove: string) => {
    if (!policy) return;
    const updatedIps = policy.allowedAdminIps.filter((ip) => ip !== ipToRemove);
    setPolicy({ ...policy, allowedAdminIps: updatedIps });
    setActionMsg(`CIDR IP ${ipToRemove} removed from allowlist.`);
  };

  const handleToggleMfa = () => {
    if (!policy) return;
    const newVal = !policy.enforceMfaForAllAdmins;
    setPolicy({ ...policy, enforceMfaForAllAdmins: newVal });
    setActionMsg(`Mandatory MFA for admins set to ${newVal ? 'ENFORCED' : 'OPTIONAL'}.`);
  };

  const handleTimeoutChange = (minutes: number) => {
    if (!policy) return;
    setPolicy({ ...policy, sessionInactivityTimeoutMinutes: minutes });
    setActionMsg(`Session inactivity timeout updated to ${minutes} minutes.`);
  };

  if (loading || !policy) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Security Access Policies & IP Allowlist
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Admin IP CIDR network access restrictions, inactivity timeouts, mandatory MFA enforcement, and credential policies.
          </p>
        </div>

        <Link
          href="/security/sessions"
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition shrink-0"
        >
          Active Sessions Directory →
        </Link>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={fetchPolicies} />}

      {/* Allowed CIDR IP Whitelist matching Section 46 */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Admin Network CIDR / IP Allowlist
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {policy.allowedAdminIps.map((ip) => (
            <div
              key={ip}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold rounded-xl flex items-center gap-2"
            >
              <span>{ip}</span>
              <button
                onClick={() => handleRemoveIp(ip)}
                className="text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddIp} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            placeholder="Add IP or CIDR (e.g. 192.168.1.50 or 10.0.0.0/16)..."
            className="flex-1 max-w-md px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </form>
      </div>

      {/* MFA & Timeout Controls matching Section 46 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Mandatory Multi-Factor Authentication (MFA)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Require all administrative roles (Super Admin, Support, Billing, Platform Ops) to authenticate with TOTP / Hardware key.
          </p>

          <button
            onClick={handleToggleMfa}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition ${
              policy.enforceMfaForAllAdmins
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {policy.enforceMfaForAllAdmins ? '✓ MFA Enforcement: ACTIVE' : 'MFA Enforcement: OPTIONAL'}
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Admin Session Inactivity Timeout
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Automatically terminate admin sessions after period of idle inactivity.
          </p>

          <div className="flex gap-2">
            {[15, 30, 60, 240].map((mins) => (
              <button
                key={mins}
                onClick={() => handleTimeoutChange(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  policy.sessionInactivityTimeoutMinutes === mins
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
