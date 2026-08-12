'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface RoleItem {
  role: string;
  displayName: string;
  description: string;
  permissions: string[];
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);

  useEffect(() => {
    adminApiFetch<RoleItem[]>('/settings/roles')
      .then((data) => setRoles(data))
      .catch(() => {
        setRoles([
          { role: 'SUPER_ADMIN', displayName: 'Super Administrator', description: 'Full unrestricted system access, billing, security', permissions: ['*'] },
          { role: 'PLATFORM_ADMIN', displayName: 'Platform Administrator', description: 'Platform management, social accounts, publishing', permissions: ['platforms:*', 'publishing:*'] },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <Link href="/settings/flags" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Feature Flags
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Admin Roles & RBAC Permission Matrix</h1>
        <p className="mt-1 text-sm text-slate-400">
          Role-Based Access Control matrix governing administrative privileges across all 7 operational roles.
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((r) => (
          <div key={r.role} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-100">{r.displayName}</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 rounded-full">
                {r.role}
              </span>
            </div>
            <p className="text-xs text-slate-400">{r.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {r.permissions.map((perm, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-950 border border-slate-800 rounded">
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
