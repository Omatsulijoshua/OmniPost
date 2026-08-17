'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href.toLowerCase();
      const currentHost = window.location.host.toLowerCase();
      if (currentUrl.includes('admin-gamma-ten-89') || currentHost.includes('admin-gamma-ten-89')) {
        window.location.replace('/admin');
      }
    }
  }, []);
  const tiers = [
    {
      name: 'Free Starter',
      price: '$0',
      channels: '3 Social Channels',
      posts: '1 Post / mo (Free Trial)',
      storage: '30-Day Media Auto-Wipe',
      desc: 'For individuals exploring multi-channel publishing',
      features: ['3 Connected Social Channels', '1 Post per month (Free Trial)', '30-Day Media Retention', 'Basic Analytics'],
      cta: 'Start Free Trial',
      variant: 'secondary' as const,
    },
    {
      name: 'Creator Tier',
      price: '$29',
      channels: '10 Social Channels',
      posts: '100 Posts / mo',
      storage: '30-Day Media Auto-Wipe',
      desc: 'For growing creators scaling across up to 10 channels',
      features: ['10 Connected Social Channels', '100 Posts per month', '1,000 AI Studio Credits', '3 Collaborator Seats'],
      badge: 'POPULAR FOR CREATORS',
      cta: 'Get Creator Plan',
      variant: 'primary' as const,
    },
    {
      name: 'Pro Growth',
      price: '$79',
      channels: '25 Social Channels',
      posts: '500 Posts / mo',
      storage: 'Permanent Storage Included',
      desc: 'For multi-brand teams needing high channel capacity & permanent media storage',
      features: ['25 Connected Social Channels', '500 Posts per month', 'Permanent Lifetime Storage', '5,000 AI Credits', '10 Team Seats & Approvals'],
      badge: 'RECOMMENDED FOR TEAMS',
      cta: 'Get Pro Growth',
      variant: 'primary' as const,
    },
    {
      name: 'Agency Unlimited',
      price: '$199',
      channels: 'UNLIMITED Socials',
      posts: 'UNLIMITED Posts',
      storage: 'Permanent Storage Included',
      desc: 'For agencies managing client portfolios',
      features: ['UNLIMITED Social Channels', 'UNLIMITED Posts per month', 'Permanent Lifetime Storage', '25,000 AI Credits', 'Unlimited Team Collaborators'],
      cta: 'Get Agency Plan',
      variant: 'emerald' as const,
    },
  ];

  const features = [
    {
      icon: '🎥',
      title: 'Multi-Account YouTube & TikTok Support',
      desc: 'Link multiple YouTube channels (@gaming, @vlogs) and TikTok accounts under the same workspace with account-level preview tabs.',
    },
    {
      icon: '✍️',
      title: 'Interactive Channel Checkboxes',
      desc: 'Select Photo, Video, or Text post types and check target social channels with one-click Select All / Deselect All actions.',
    },
    {
      icon: '🛡️',
      title: 'Team Roles & Approval Workflows',
      desc: 'Assign Admin, Editor (drafts only), and Publisher roles. Editors submit posts for approval before any content goes live.',
    },
    {
      icon: '📦',
      title: 'Flexible Media Retention Policies',
      desc: 'Standard 30-day auto-wipe policy saves cloud space, or upgrade to Permanent Lifetime Storage to archive raw media forever.',
    },
    {
      icon: '📜',
      title: 'Multi-Channel Post Audit Inspector',
      desc: 'View comprehensive post histories, live post URLs, platform-specific status breakdowns, and governance audit timelines.',
    },
    {
      icon: '✨',
      title: 'Custom Platform & Webhook Posting',
      desc: 'Post to unlisted platforms (Bluesky, Medium, Substack, Lemon8) or Webhooks with custom AI writing instructions.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            OP
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
              OmniPost
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
              Multi-Channel SaaS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <Link href="/login" className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-6xl mx-auto space-y-16">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 text-xs font-extrabold tracking-wider text-blue-700 uppercase bg-blue-50 border border-blue-200 rounded-full shadow-xs">
            ✨ Multi-Platform Social Media SaaS
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl max-w-4xl text-slate-900 leading-tight">
            Create once. Select channels. <span className="text-blue-600">Publish everywhere.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            The intelligent social media adaptation engine for creators, teams, and agencies. Manage multiple YouTube channels, TikTok accounts, team approvals, and custom platforms seamlessly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
            >
              🚀 Start Publishing Now (Free Trial)
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 shadow-xs transition-all"
            >
              Go to Dashboard →
            </Link>
          </div>
        </div>

        {/* Features Showcase Grid */}
        <div className="w-full space-y-8 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Built for Powerful Social Media Operations</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Everything you need to schedule, adapt, and scale content across channels</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {features.map((f, i) => (
              <div key={i} className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-sm hover:border-blue-300 transition-all">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="text-sm font-extrabold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers Section */}
        <div className="w-full space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
              PRICING & SOCIAL CAPACITY
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Flexible Plans Based on Social Channels</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
              Select a subscription based on how many social accounts your workspace accommodates (3 Channels, 10 Channels, 25 Channels, or Unlimited).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {tiers.map((t, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 relative transition-all ${
                  t.badge
                    ? 'bg-blue-50/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {t.badge && (
                  <span className="absolute -top-3 left-4 px-3 py-0.5 text-[9px] font-black text-white bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full shadow-xs">
                    {t.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-black text-slate-900">{t.name}</h3>
                  </div>

                  <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-center">
                    <div className="text-sm font-black text-blue-700">{t.channels}</div>
                    <div className="text-[10px] text-slate-600 font-bold mt-0.5">{t.posts}</div>
                  </div>

                  <div className="text-3xl font-black text-slate-900">
                    {t.price}
                    <span className="text-xs text-slate-500 font-normal"> /mo</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{t.desc}</p>

                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    {t.features.map((feat, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/register"
                  className={`w-full py-3 text-center text-xs font-extrabold rounded-xl transition-all shadow-md ${
                    t.variant === 'emerald'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : t.variant === 'primary'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>&copy; {new Date().getFullYear()} OmniPost SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
