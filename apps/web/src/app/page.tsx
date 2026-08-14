import React from 'react';
import Link from 'next/link';
import { Button } from '@omnipost/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="OmniPost" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-400">
            OmniPost
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <Link href="/login" className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-800/50 rounded-full">
          OmniPost SaaS Platform
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
          Create once. Adapt everywhere. Publish everywhere.
        </h1>
        <p className="max-w-2xl mt-6 text-lg text-slate-400 leading-relaxed">
          The intelligent social media adaptation & distribution engine for creators, businesses, teams, and agencies.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <Link href="/register">
            <Button variant="primary">Start publishing</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        &copy; {new Date().getFullYear()} OmniPost SaaS. All rights reserved.
      </footer>
    </div>
  );
}
