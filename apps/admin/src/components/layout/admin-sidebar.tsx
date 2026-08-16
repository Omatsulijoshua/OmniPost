'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Briefcase,
  FileText,
  Clock,
  AlertOctagon,
  Image,
  Layers,
  Share2,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Bot,
  DollarSign,
  Cpu,
  Server,
  CreditCard,
  Package,
  Receipt,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  LifeBuoy,
  Bell,
  ShieldAlert,
  Sliders,
  Shield,
  Flag,
  Settings as SettingsIcon,
  Menu,
  X,
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
      { label: 'Teams', href: '/settings/roles', icon: UserCheck },
      { label: 'Agencies', href: '/agencies', icon: Briefcase },
    ],
  },
  {
    title: 'Content & Publishing',
    items: [
      { label: 'Posts', href: '/publishing', icon: FileText },
      { label: 'Publishing Queue', href: '/publishing', icon: Clock },
      { label: 'Failed Jobs', href: '/publishing/failed', icon: AlertOctagon },
      { label: 'Media Assets', href: '/media', icon: Image },
      { label: 'FFmpeg Jobs', href: '/media/jobs', icon: Layers },
    ],
  },
  {
    title: 'Platforms',
    items: [
      { label: 'Platforms Health', href: '/platforms', icon: Share2 },
      { label: 'Connected Accounts', href: '/social-accounts', icon: ShieldCheck },
      { label: 'API Health', href: '/system/health', icon: Activity },
      { label: 'Platform Errors', href: '/publishing/failed', icon: AlertTriangle },
    ],
  },
  {
    title: 'AI Management',
    items: [
      { label: 'AI Usage', href: '/ai', icon: Bot },
      { label: 'AI Model Routing', href: '/ai/routing', icon: Cpu },
      { label: 'AI Providers', href: '/ai/providers', icon: Server },
    ],
  },
  {
    title: 'Business & Billing',
    items: [
      { label: 'Subscriptions', href: '/billing/subscriptions', icon: CreditCard },
      { label: 'Plans & Entitlements', href: '/billing/plans', icon: Package },
      { label: 'Payments & Refunds', href: '/billing/payments', icon: Receipt },
    ],
  },
  {
    title: 'Analytics & BI',
    items: [
      { label: 'Executive BI', href: '/analytics', icon: TrendingUp },
      { label: 'Platform Analytics', href: '/analytics/platforms', icon: PieChart },
      { label: 'Product Analytics', href: '/analytics/product', icon: BarChart3 },
    ],
  },
  {
    title: 'Operations & Infrastructure',
    items: [
      { label: 'Support Tickets', href: '/support/tickets', icon: LifeBuoy },
      { label: 'Content Moderation', href: '/moderation', icon: Bell },
      { label: 'Audit Logs', href: '/audit-logs', icon: ShieldAlert },
      { label: 'System Health', href: '/system/health', icon: Sliders },
      { label: 'BullMQ Queues', href: '/system/queues', icon: Activity },
      { label: 'Worker Fleet', href: '/system/workers', icon: Cpu },
    ],
  },
  {
    title: 'Settings & Security',
    items: [
      { label: 'Platform Config', href: '/settings/platform', icon: SettingsIcon },
      { label: 'Feature Flags', href: '/settings/flags', icon: Flag },
      { label: 'Security & Policies', href: '/security/policies', icon: Shield },
      { label: 'Active Sessions', href: '/security/sessions', icon: ShieldCheck },
      { label: 'RBAC Roles', href: '/settings/roles', icon: UserCheck },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 font-black text-sm text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
            OP
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-100 tracking-tight">OmniPost Admin</h1>
            <span className="text-[10px] text-blue-400 font-mono font-bold">Enterprise v2.5</span>
          </div>
        </Link>

        {/* Close Button on Mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="p-3 sm:p-4 space-y-6 flex-1 overflow-y-auto">
        {navSections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <div className="px-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={`${sec.title}-${item.label}`}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="md:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 shadow-md flex items-center justify-center"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop Blur */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
