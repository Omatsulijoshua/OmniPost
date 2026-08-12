'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface Policy {
  allowedAdminIps: string[];
  sessionInactivityTimeoutMinutes: number;
  enforceMfaForAllAdmins: boolean;
  cspHeaderEnforced: boolean;
  corsAllowedAdminOrigins: string[];
}

export default function AdminSecurityPoliciesPage() {
  const [policy, setPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    adminApiFetch<Policy>('/security/policies')
      .then((data) => setPolicy(data))
      .catch(() => {
        setPolicy({
          allowedAdminIps: ['192.168.1.0/24', '10.0.0.0/16'],
          sessionInactivityTimeoutMinutes: 30,
          enforceMfaForAllAdmins: true,
          cspHeaderEnforced: true,
          corsAllowedAdminOrigins: ['http://localhost:3002', 'https://admin.omnipost.com'],
        });
      });
  }, []);

  if (!policy) return <div className="p-8 text-center text-slate-500">Loading security policies...</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Security Access Policies & IP Whitelist</h1>
          <p className="mt-1 text-sm text-slate-400">
            Admin IP range CIDR restriction, session inactivity timeouts, mandatory MFA enforcement, and CSP rules.
          </p>
        </div>

        <Link
          href="/security/sessions"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
        >
          Active Admin Sessions →
        </Link>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-slate-100">Allowed Admin CIDR IP Whitelist</h2>
        <div className="flex flex-wrap gap-2">
          {policy.allowedAdminIps.map((ip, i) => (
            <span key={i} className="px-3 py-1 bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-400 font-bold rounded-lg">
              {ip}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-slate-100">Session & Auth Security Controls</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 font-sans font-bold">Inactivity Timeout</div>
            <div className="text-lg font-black text-slate-100">{policy.sessionInactivityTimeoutMinutes} minutes</div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 font-sans font-bold">Mandatory Admin MFA</div>
            <div className="text-lg font-black text-emerald-400">{policy.enforceMfaForAllAdmins ? 'ENFORCED' : 'OPTIONAL'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
