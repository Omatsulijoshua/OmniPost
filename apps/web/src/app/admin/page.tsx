'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../lib/auth-store';
import { DeveloperKeysModal } from '../../components/settings/developer-keys-modal';
import {
  LayoutDashboard,
  Users,
  Building2,
  Share2,
  Clock,
  AlertOctagon,
  Image,
  Bot,
  CreditCard,
  TrendingUp,
  LifeBuoy,
  ShieldAlert,
  Sliders,
  Shield,
  Flag,
  Settings as SettingsIcon,
  Activity,
  Zap,
  Lock,
  ExternalLink,
  ArrowRight,
  DollarSign,
  Calendar,
  Download,
  Radio,
  RefreshCw,
} from 'lucide-react';

type RevenueTimeframe = 'live' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
type Currency = 'USD' | 'EUR' | 'GBP' | 'NGN';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
};

const CURRENCY_RATES: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  NGN: 1620,
};

interface LiveTransaction {
  id: string;
  customerName: string;
  customerEmail: string;
  planTier: string;
  amount: number;
  gateway: 'Stripe' | 'PayPal' | 'Crypto' | 'Bank';
  timestamp: string;
  status: 'COMPLETED' | 'PROCESSING';
}

export default function AdminPage() {
  const { user, setAuth } = useAuthStore();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('omnipost_admin_authenticated') === 'true' || !!user;
    }
    return true;
  });

  const [email, setEmail] = useState('joshuaomatsuli01@gmail.com');
  const [password, setPassword] = useState('Jos@56567');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showDeveloperKeysModal, setShowDeveloperKeysModal] = useState(false);

  // Revenue & Financial Filters
  const [timeframe, setTimeframe] = useState<RevenueTimeframe>('monthly');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().slice(0, 16);
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 16);
  });

  // Live real-time transactions stream
  const [liveTransactions, setLiveTransactions] = useState<LiveTransaction[]>([
    {
      id: 'tx_live_101',
      customerName: 'Marcus Vance',
      customerEmail: 'm.vance@apexmedia.co',
      planTier: 'Enterprise Agency ($249/mo)',
      amount: 249,
      gateway: 'Stripe',
      timestamp: 'Just now',
      status: 'COMPLETED',
    },
    {
      id: 'tx_live_102',
      customerName: 'Sophia Lin',
      customerEmail: 'sophia@creativelab.io',
      planTier: 'Growth Team ($79/mo)',
      amount: 79,
      gateway: 'Stripe',
      timestamp: '2 mins ago',
      status: 'COMPLETED',
    },
    {
      id: 'tx_live_103',
      customerName: 'David Kalu',
      customerEmail: 'david@brandforge.ng',
      planTier: 'Pro Creator ($29/mo)',
      amount: 29,
      gateway: 'PayPal',
      timestamp: '5 mins ago',
      status: 'COMPLETED',
    },
    {
      id: 'tx_live_104',
      customerName: 'Elena Rostova',
      customerEmail: 'elena@novamarketing.eu',
      planTier: 'AI Token Booster (5M)',
      amount: 45,
      gateway: 'Crypto',
      timestamp: '8 mins ago',
      status: 'COMPLETED',
    },
  ]);

  // Simulated live transaction ticker when timeframe === 'live'
  useEffect(() => {
    if (timeframe !== 'live') return;

    const interval = setInterval(() => {
      const plans = [
        { name: 'Pro Creator ($29/mo)', amount: 29 },
        { name: 'Growth Team ($79/mo)', amount: 79 },
        { name: 'Enterprise Agency ($249/mo)', amount: 249 },
        { name: 'AI Token Pack 10M', amount: 80 },
        { name: 'Extra Storage 500GB', amount: 35 },
      ];
      const names = [
        { name: 'Liam Chen', email: 'liam@hypefeed.com' },
        { name: 'Zainab Ahmed', email: 'zainab@pulsemedia.net' },
        { name: 'Chloe Dubois', email: 'chloe@atelier.fr' },
        { name: 'Mateo Garcia', email: 'mateo@solarmarketing.es' },
        { name: 'Amara Eze', email: 'amara@creativespark.io' },
      ];
      const gateways: LiveTransaction['gateway'][] = ['Stripe', 'PayPal', 'Crypto', 'Bank'];

      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const randomUser = names[Math.floor(Math.random() * names.length)];
      const randomGateway = gateways[Math.floor(Math.random() * gateways.length)];

      const newTx: LiveTransaction = {
        id: `tx_live_${Date.now()}`,
        customerName: randomUser.name,
        customerEmail: randomUser.email,
        planTier: randomPlan.name,
        amount: randomPlan.amount,
        gateway: randomGateway,
        timestamp: 'Just now',
        status: 'COMPLETED',
      };

      setLiveTransactions((prev) => [newTx, ...prev.slice(0, 7)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [timeframe]);

  const ALLOWED_ADMIN_EMAIL = 'joshuaomatsuli01@gmail.com';
  const ALLOWED_ADMIN_PASS = 'Jos@56567';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    if (inputEmail !== ALLOWED_ADMIN_EMAIL.toLowerCase() || inputPass !== ALLOWED_ADMIN_PASS) {
      setTimeout(() => {
        setLoginError('Access Denied. Invalid admin credentials. Only authorized platform administrator accounts are permitted.');
        setLoginLoading(false);
      }, 400);
      return;
    }

    const adminUser = {
      id: 'usr_admin_joshua',
      email: ALLOWED_ADMIN_EMAIL,
      name: 'Joshua Omatsuli (System Admin)',
      emailVerified: true,
      twoFactorEnabled: false,
    };

    const defaultWs = {
      id: 'ws_admin_primary',
      name: "Joshua's Admin Workspace",
      slug: 'joshua-admin',
      ownerId: 'usr_admin_joshua',
      role: 'OWNER' as const,
      createdAt: new Date().toISOString(),
    };

    const tokens = {
      accessToken: 'mock_admin_access_token',
      refreshToken: 'mock_admin_refresh_token',
      expiresIn: 86400,
    };

    setAuth(adminUser, tokens, defaultWs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('omnipost_admin_authenticated', 'true');
    }
    setIsAdminLoggedIn(true);
    setLoginLoading(false);
  };

  const handleAdminLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('omnipost_admin_authenticated');
    }
    setIsAdminLoggedIn(false);
  };

  // Dynamic Revenue Dataset Calculation
  const revenueData = useMemo(() => {
    const rate = CURRENCY_RATES[currency];
    const sym = CURRENCY_SYMBOLS[currency];

    switch (timeframe) {
      case 'live':
        return {
          title: 'Real-Time Revenue Activity (Live Stream)',
          periodLabel: 'Live Active Stream',
          totalGross: 1485 * rate,
          arr: 514080 * rate,
          mrr: 42840 * rate,
          arpu: 28.5 * rate,
          ltv: 740 * rate,
          growthPercent: 14.8,
          chartBars: [
            { label: '10m ago', value: 120 * rate, height: '40%' },
            { label: '8m ago', value: 249 * rate, height: '70%' },
            { label: '6m ago', value: 79 * rate, height: '30%' },
            { label: '4m ago', value: 328 * rate, height: '85%' },
            { label: '2m ago', value: 249 * rate, height: '70%' },
            { label: '1m ago', value: 180 * rate, height: '55%' },
            { label: 'Now', value: 280 * rate, height: '95%', isCurrent: true },
          ],
        };
      case 'daily':
        return {
          title: "Today's Revenue (Hourly Breakdown)",
          periodLabel: 'Last 24 Hours',
          totalGross: 3840 * rate,
          arr: 514080 * rate,
          mrr: 42840 * rate,
          arpu: 26.2 * rate,
          ltv: 690 * rate,
          growthPercent: 9.6,
          chartBars: [
            { label: '00:00', value: 140 * rate, height: '20%' },
            { label: '04:00', value: 210 * rate, height: '30%' },
            { label: '08:00', value: 680 * rate, height: '75%' },
            { label: '12:00', value: 920 * rate, height: '95%' },
            { label: '16:00', value: 840 * rate, height: '85%' },
            { label: '20:00', value: 650 * rate, height: '70%' },
            { label: '23:00', value: 400 * rate, height: '45%', isCurrent: true },
          ],
        };
      case 'weekly':
        return {
          title: "This Week's Revenue (Day-by-Day)",
          periodLabel: 'Last 7 Days (Mon - Sun)',
          totalGross: 21450 * rate,
          arr: 514080 * rate,
          mrr: 42840 * rate,
          arpu: 27.8 * rate,
          ltv: 720 * rate,
          growthPercent: 12.3,
          chartBars: [
            { label: 'Mon', value: 2800 * rate, height: '55%' },
            { label: 'Tue', value: 3400 * rate, height: '68%' },
            { label: 'Wed', value: 3950 * rate, height: '78%' },
            { label: 'Thu', value: 4200 * rate, height: '85%' },
            { label: 'Fri', value: 4600 * rate, height: '95%' },
            { label: 'Sat', value: 1500 * rate, height: '35%' },
            { label: 'Sun', value: 1000 * rate, height: '25%', isCurrent: true },
          ],
        };
      case 'yearly':
        return {
          title: 'Annual Performance (12-Month Trajectory)',
          periodLabel: 'Current Fiscal Year',
          totalGross: 486200 * rate,
          arr: 514080 * rate,
          mrr: 42840 * rate,
          arpu: 32.4 * rate,
          ltv: 890 * rate,
          growthPercent: 38.4,
          chartBars: [
            { label: 'Jan', value: 28000 * rate, height: '35%' },
            { label: 'Feb', value: 31000 * rate, height: '40%' },
            { label: 'Mar', value: 34500 * rate, height: '48%' },
            { label: 'Apr', value: 36000 * rate, height: '52%' },
            { label: 'May', value: 39000 * rate, height: '60%' },
            { label: 'Jun', value: 41200 * rate, height: '68%' },
            { label: 'Jul', value: 42840 * rate, height: '75%' },
            { label: 'Aug', value: 46100 * rate, height: '85%' },
            { label: 'Sep', value: 49000 * rate, height: '90%' },
            { label: 'Oct', value: 52400 * rate, height: '95%' },
            { label: 'Nov', value: 55000 * rate, height: '98%' },
            { label: 'Dec', value: 58000 * rate, height: '100%', isCurrent: true },
          ],
        };
      case 'custom':
        return {
          title: 'Custom Range Revenue Performance',
          periodLabel: `${customStartDate.replace('T', ' ')} → ${customEndDate.replace('T', ' ')}`,
          totalGross: 29420 * rate,
          arr: 514080 * rate,
          mrr: 42840 * rate,
          arpu: 29.1 * rate,
          ltv: 780 * rate,
          growthPercent: 15.2,
          chartBars: [
            { label: 'Period 1', value: 5200 * rate, height: '45%' },
            { label: 'Period 2', value: 6800 * rate, height: '60%' },
            { label: 'Period 3', value: 7400 * rate, height: '70%' },
            { label: 'Period 4', value: 8200 * rate, height: '80%' },
            { label: 'Period 5', value: 9100 * rate, height: '95%', isCurrent: true },
          ],
        };
      case 'monthly':
      default:
        return {
          title: 'Monthly Recurring Revenue (MRR Breakdown)',
          periodLabel: 'Current Month (30 Days)',
          totalGross: 42840 * rate,
          arr: 514080 * rate,
          mrr: 42840 * rate,
          arpu: 28.5 * rate,
          ltv: 740 * rate,
          growthPercent: 11.2,
          chartBars: [
            { label: 'Week 1', value: 8400 * rate, height: '50%' },
            { label: 'Week 2', value: 10200 * rate, height: '65%' },
            { label: 'Week 3', value: 11800 * rate, height: '80%' },
            { label: 'Week 4', value: 12440 * rate, height: '95%', isCurrent: true },
          ],
        };
    }
  }, [timeframe, currency, customStartDate, customEndDate]);

  const sym = CURRENCY_SYMBOLS[currency];

  const exportRevenueCSV = () => {
    const headers = 'Timestamp,Customer,Email,Plan,Amount,Gateway,Status\n';
    const rows = liveTransactions
      .map(
        (t) =>
          `"${t.timestamp}","${t.customerName}","${t.customerEmail}","${t.planTier}",${t.amount},"${t.gateway}","${t.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnipost_revenue_${timeframe}_${Date.now()}.csv`;
    a.click();
  };

  const topKPIs = [
    { title: 'Total Registered Users', value: '24,812', change: '+12.4%', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
    { title: 'Active Workspaces', value: '8,294', change: '+8.2%', icon: Building2, color: 'text-purple-600 dark:text-purple-400' },
    { title: 'Total Posts Published', value: '1,284,293', change: '+17.8%', icon: Clock, color: 'text-indigo-600 dark:text-indigo-400' },
    { title: 'Publishing Success Rate', value: '98.7%', change: 'Normal', icon: Activity, color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Monthly Recurring (MRR)', value: `${sym}${(42840 * CURRENCY_RATES[currency]).toLocaleString()}`, change: '+11.2%', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'AI Tokens Processed', value: '3.85M', change: `${sym}${(1686 * CURRENCY_RATES[currency]).toLocaleString()} Cost`, icon: Bot, color: 'text-purple-600 dark:text-purple-400' },
    { title: 'Active Paid Subscriptions', value: '4,120', change: '84.2% Ret.', icon: CreditCard, color: 'text-blue-600 dark:text-blue-400' },
    { title: 'Platform Infrastructure Health', value: '100% OK', change: '7 Services', icon: Shield, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  const adminModules = [
    {
      category: 'Users & Organizations',
      items: [
        { label: 'User Directory & Security Inspector', href: '/admin/users', desc: 'Manage 24,812 user accounts, password resets, and audit actions.' },
        { label: 'Workspaces & Agency Client Hub', href: '/admin/workspaces', desc: 'Inspect 8,294 client workspaces, seats, and white-label agencies.' },
      ],
    },
    {
      category: 'Publishing & Platforms',
      items: [
        { label: 'Publishing Queue & Failed Jobs', href: '/admin/publishing', desc: 'Live BullMQ queue, 6-category error diagnostics, and 1-click retries.' },
        { label: '13-Platform Integrations & Capability Matrix', href: '/admin/platforms', desc: 'Instagram, TikTok, YouTube, X, Threads, LinkedIn API telemetry.' },
        { label: 'Social Accounts & Token Health', href: '/admin/social-accounts', desc: 'Token expiration warnings (<7d) and secure credential masking.' },
        { label: 'Media Storage & FFmpeg Transcode Queue', href: '/admin/media', desc: 'Video/image quotas, 4K rendering logs, and transcode jobs.' },
      ],
    },
    {
      category: 'AI & Business Governance',
      items: [
        { label: 'AI LLM Cost & Model Routing Hub', href: '/admin/ai', desc: 'OpenAI, Claude, Gemini allocations, routing rules, and live latency.' },
        { label: 'Subscriptions & Billing History', href: '/admin/billing', desc: 'Stripe/Paystack revenue, invoice ledger, refunds, and 6-tier quotas.' },
        { label: 'Executive BI & Product Analytics', href: '/admin/analytics', desc: 'DAU/MAU ratios (74.3%), LTV/CAC (6.6x), and feature adoption.' },
      ],
    },
    {
      category: 'Operations, Security & Config',
      items: [
        { label: 'Support Helpdesk & Ticket Threading', href: '/admin/support', desc: 'Priority SLA tickets, customer chat, and private staff notes.' },
        { label: 'Content Moderation & AI Abuse Control', href: '/admin/moderation', desc: 'Spam flags, AI abuse score confidence, and enforcement actions.' },
        { label: 'Immutable Security Audit Logs (SHA-256)', href: '/admin/audit-logs', desc: 'Append-only ledger with cryptographic hash verification.' },
        { label: 'System Infrastructure & Worker Fleet', href: '/admin/system', desc: 'CPU/RAM/Disk meters, Redis memory, and BullMQ worker clusters.' },
        { label: 'Feature Flags & Maintenance Kill Switch', href: '/admin/settings', desc: 'Canary percentage rollouts and emergency maintenance mode.' },
      ],
    },
  ];

  // If not logged in as Admin, show Admin Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-900 dark:text-slate-100">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 mx-auto">
              OP
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <h1 className="text-xl font-black tracking-tight">OmniPost Admin Portal</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-full uppercase">
                👑 System Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Enter system admin credentials to access full platform operations.
            </p>
          </div>

          {loginError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-semibold text-rose-700 dark:text-rose-400">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joshuaomatsuli01@gmail.com"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Admin Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>👑</span>
              <span>{loginLoading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
            >
              ← Back to User Publishing Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Complete Executive Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
              OP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                  OmniPost Platform Admin Command Center
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-full uppercase">
                  👑 SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Signed in as: <span className="text-blue-600 dark:text-blue-400 font-bold">{user?.email || 'joshuaomatsuli01@gmail.com'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
              {(['USD', 'EUR', 'GBP', 'NGN'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2.5 py-1 text-xs font-black rounded-lg transition ${
                    currency === c
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {c} ({CURRENCY_SYMBOLS[c]})
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowDeveloperKeysModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>🔑</span> OAuth Keys
            </button>
            <Link
              href="/dashboard"
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>👤</span> User Workspace
            </Link>
            <button
              onClick={handleAdminLogout}
              className="px-3 py-2 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-rose-700 dark:text-rose-400 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-800 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Executive Operations & Revenue Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time platform telemetry across users, financial accounting, multi-currency revenue filters, AI routing, and microservice health.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 💰 COMPREHENSIVE REVENUE & FINANCIAL INTELLIGENCE CENTER */}
        {/* ========================================================= */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Revenue Navigation & Time Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {revenueData.title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium pl-11">
                Active Period: <span className="font-bold text-slate-700 dark:text-slate-300">{revenueData.periodLabel}</span>
              </p>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              {(
                [
                  { id: 'live', label: '🔴 Live Stream', isLive: true },
                  { id: 'daily', label: 'Daily (24h)' },
                  { id: 'weekly', label: 'Weekly (7d)' },
                  { id: 'monthly', label: 'Monthly (30d)' },
                  { id: 'yearly', label: 'Yearly (12m)' },
                  { id: 'custom', label: '📅 Custom Pick' },
                ] as { id: RevenueTimeframe; label: string; isLive?: boolean }[]
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTimeframe(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 ${
                    timeframe === item.id
                      ? item.isLive
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-white animate-ping mr-0.5" />
                  )}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date & Time Picker Controls */}
          {timeframe === 'custom' && (
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">From Date & Time:</span>
                <input
                  type="datetime-local"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">To Date & Time:</span>
                <input
                  type="datetime-local"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 ml-auto">
                ✓ Instant Slice Calculation Active
              </div>
            </div>
          )}

          {/* Top 4 Financial KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                <span>Gross Revenue ({timeframe})</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight">
                {sym}{Math.round(revenueData.totalGross).toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+{revenueData.growthPercent}% vs previous window</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Annual Run Rate (ARR)</span>
                <Zap className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {sym}{Math.round(revenueData.arr).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Based on {sym}{Math.round(revenueData.mrr).toLocaleString()}/mo MRR
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Avg Revenue / User (ARPU)</span>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                {sym}{revenueData.arpu.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Customer Lifetime Value: {sym}{Math.round(revenueData.ltv).toLocaleString()}
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Refund & Churn Impact</span>
                <CreditCard className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                0.6%
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                99.4% net revenue retention
              </div>
            </div>
          </div>

          {/* Revenue Visual Bar Chart & Tier Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* Interactive Bar Chart */}
            <div className="lg:col-span-2 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Revenue Trajectory ({revenueData.periodLabel})
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Dynamic volume progression across selected period intervals
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  Peak: {sym}{Math.round(Math.max(...revenueData.chartBars.map((b) => b.value))).toLocaleString()}
                </span>
              </div>

              {/* Visual Bar Columns */}
              <div className="h-44 flex items-end justify-between gap-2 pt-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                {revenueData.chartBars.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-extrabold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                      {sym}{Math.round(bar.value).toLocaleString()}
                    </div>
                    {/* Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-t-lg overflow-hidden h-full flex items-end">
                      <div
                        style={{ height: bar.height }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          bar.isCurrent
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20 animate-pulse'
                            : 'bg-gradient-to-t from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400'
                        }`}
                      />
                    </div>
                    {/* X Axis Label */}
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-100 truncate">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Meta */}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Standard Inflows
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 animate-pulse" /> Active Current Point
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Payment Gateways: Stripe (68%) • PayPal (19%) • Crypto (8%) • Bank (5%)
                </span>
              </div>
            </div>

            {/* Subscription Tier Distribution */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Subscription Plan Share
              </h3>

              <div className="space-y-3">
                {[
                  { name: 'Starter (Free)', users: '18,450', rev: '$0', percent: 0, color: 'bg-slate-400' },
                  { name: 'Creator Pro ($29/mo)', users: '2,410', rev: '$69,890', percent: 34, color: 'bg-blue-500' },
                  { name: 'Growth Team ($79/mo)', users: '1,280', rev: '$101,120', percent: 45, color: 'bg-indigo-500' },
                  { name: 'Enterprise ($249/mo)', users: '430', rev: '$107,070', percent: 21, color: 'bg-emerald-500' },
                ].map((tier) => (
                  <div key={tier.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{tier.name}</span>
                      <span className="font-mono text-slate-500">
                        {tier.users} users • {tier.percent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${tier.color} h-full rounded-full transition-all`}
                        style={{ width: `${tier.percent || 4}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add-on revenue box */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Add-on Inflows (Monthly)</div>
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>AI Token Packs & Storage</span>
                  <span className="text-emerald-600 dark:text-emerald-400">+{sym}{(14280 * CURRENCY_RATES[currency]).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Incoming Transactions Ticker */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Live Transaction Stream & Audit Ledger
                </h3>
              </div>
              <button
                onClick={exportRevenueCSV}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV Ledger
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {liveTransactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 hover:border-blue-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                      {tx.customerName}
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      +{sym}{(tx.amount * CURRENCY_RATES[currency]).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{tx.planTier}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{tx.gateway}</span>
                    <span>{tx.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8 Top Metric Cards matching Phase D */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topKPIs.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.title}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>{kpi.title}</span>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{kpi.value}</div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{kpi.change}</div>
              </div>
            );
          })}
        </div>

        {/* Operational Modules Categorized */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">
            Administrative Control Centers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminModules.map((section) => (
              <div
                key={section.category}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4"
              >
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {section.category}
                </h4>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Active ✓
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure & Endpoints */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚙️</span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Live Production Infrastructure & Endpoints
                </h3>
                <p className="text-xs text-slate-500 font-medium">Real-time status across frontend domains and backend microservices</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational (100% Uptime)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-slate-500 font-sans text-[11px] font-semibold mb-1">Customer Web Platform</div>
              <a href="https://omnipost-web-ivory.vercel.app" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-bold truncate hover:underline block">
                omnipost-web-ivory.vercel.app
              </a>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-slate-500 font-sans text-[11px] font-semibold mb-1">Dedicated Admin Portal</div>
              <a href="https://admin-gamma-ten-89.vercel.app" target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 font-bold truncate hover:underline block">
                admin-gamma-ten-89.vercel.app
              </a>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-slate-500 font-sans text-[11px] font-semibold mb-1">Backend API Engine</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold truncate">
                omnipost-api.onrender.com
              </div>
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
