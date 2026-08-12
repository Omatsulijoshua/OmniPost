import React from 'react';
import { Button } from '@omnipost/ui';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-800/50 rounded-full">
        OmniPost SaaS Platform
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
        Create once. Adapt everywhere. Publish everywhere.
      </h1>
      <p className="max-w-2xl mt-6 text-lg text-slate-400">
        The intelligent social media adaptation & distribution engine for creators, businesses, teams, and agencies.
      </p>
      <div className="flex gap-4 mt-8">
        <Button variant="primary">Start publishing</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </main>
  );
}
