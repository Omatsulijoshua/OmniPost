'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectedPlatformStatus } from '@omnipost/types';

interface ConnectedPlatformsProps {
  platforms: ConnectedPlatformStatus[];
}

export function ConnectedPlatforms({ platforms }: ConnectedPlatformsProps) {
  return (
    <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Connected Platforms</h2>
          <p className="text-xs text-slate-500">Social channels linked to active workspace</p>
        </div>
        <Link href="/social-accounts" className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-bold">
          Manage Accounts →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {platforms.map((platform) => (
          <div
            key={platform.platformType}
            className="p-3.5 bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 rounded-xl flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-blue-600 shadow-xs">
                {platform.platformType === 'OTHER' ? '✨' : platform.platformType.slice(0, 2)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {platform.platformType === 'OTHER' ? 'Custom Platform' : platform.platformName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{platform.accountName}</div>
              </div>
            </div>

            <div>
              {platform.isConnected ? (
                <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                  Connected
                </span>
              ) : (
                <Link
                  href="/social-accounts"
                  className="px-2.5 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
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
