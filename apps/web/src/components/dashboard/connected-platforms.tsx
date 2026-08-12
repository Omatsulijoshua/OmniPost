'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectedPlatformStatus } from '@omnipost/types';

interface ConnectedPlatformsProps {
  platforms: ConnectedPlatformStatus[];
}

export function ConnectedPlatforms({ platforms }: ConnectedPlatformsProps) {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Connected Platforms</h2>
          <p className="text-xs text-slate-400">Social accounts linked to active workspace</p>
        </div>
        <Link href="/social-accounts" className="text-xs text-indigo-400 hover:underline font-semibold">
          Manage Accounts →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {platforms.map((platform) => (
          <div
            key={platform.platformType}
            className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                {platform.platformType.slice(0, 2)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-200 truncate">{platform.platformName}</div>
                <div className="text-[11px] text-slate-500 truncate">{platform.accountName}</div>
              </div>
            </div>

            <div>
              {platform.isConnected ? (
                <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 rounded-full">
                  Connected
                </span>
              ) : (
                <Link
                  href="/social-accounts"
                  className="px-2 py-0.5 text-[10px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 rounded-full hover:bg-indigo-900"
                >
                  Connect
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
