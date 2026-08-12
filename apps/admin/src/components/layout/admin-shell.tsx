'use client';

import React from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
