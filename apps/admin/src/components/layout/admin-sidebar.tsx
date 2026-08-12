'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Share2,
  FileText,
  AlertOctagon,
  Image,
  Bot,
  DollarSign,
  BarChart3,
  LifeBuoy,
  ShieldAlert,
  Activity,
  Settings,
  ShieldCheck,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: { label: string; href: string; icon: React.ElementType }[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Users & Organizations',
    items: [
      { label: 'Users', href: '/users', icon: Users },
      { label: 'Workspaces', href: '/workspaces', icon: Building2 },
    ],
  },
  {
    title: 'Content & Publishing',
    items: [
      { label: 'Publishing Queue', href: '/publishing', icon: FileText },
      { label: 'Failed Jobs', href: '/publishing/failed', icon: AlertOctagon },
      { label: 'Media Assets', href: '/media', icon: Image },
    ],
  },
  {
    title: 'Platforms & Accounts',
    items: [
      { label: 'Platforms Health', href: '/platforms', icon: Share2 },
      { label: 'Social Accounts', href: '/social-accounts', icon: ShieldCheck },
    ],
  },
  {
    title: 'AI Management',
    items: [{ label: 'AI Usage & Costs', href: '/ai', icon: Bot }],
  },
  {
    title: 'Business & Billing',
    items: [{ label: 'Subscriptions', href: '/billing', icon: DollarSign }],
  },
  {
    title: 'Analytics',
    items: [{ label: 'Product Analytics', href: '/analytics', icon: BarChart3 }],
  },
  {
    title: 'Operations & Health',
    items: [
      { label: 'Support Tickets', href: '/support', icon: LifeBuoy },
      { label: 'Audit Logs', href: '/audit-logs', icon: ShieldAlert },
      { label: 'System Health', href: '/system-health', icon: Activity },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 font-black text-sm text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
          OP
        </div>
        <div>
          <h1 className="text-sm font-black text-slate-100 tracking-tight">OmniPost Admin</h1>
          <span className="text-[10px] text-slate-400 font-mono">v2.5 Enterprise</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="p-4 space-y-6 flex-1">
        {navSections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
