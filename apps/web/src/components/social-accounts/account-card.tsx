'use client';

import React from 'react';
import { SocialAccountDetail, PlatformType } from '@omnipost/types';

interface AccountCardProps {
  platformType: PlatformType;
  account?: SocialAccountDetail;
  onConnect: (platformType: PlatformType) => void;
  onRefresh: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function AccountCard({
  platformType,
  account,
  onConnect,
  onRefresh,
  onDisconnect,
}: AccountCardProps) {
  const isConnected = !!account;

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-indigo-400 text-sm">
              {platformType.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                {platformType.charAt(0) + platformType.slice(1).toLowerCase().replace('_', ' ')}
              </h3>
              <p className="text-xs text-slate-400">
                {account ? account.accountName : 'Not Connected'}
              </p>
            </div>
          </div>

          <div>
            {isConnected ? (
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 rounded-full">
                {account.isMock ? 'Mock Connected' : 'Live Connected'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-950 border border-slate-800 rounded-full">
                Disconnected
              </span>
            )}
          </div>
        </div>

        {/* Capabilities Pills */}
        <div className="flex flex-wrap gap-1">
          {account?.capabilities.supportsImages && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-slate-400 bg-slate-950 rounded">Images</span>
          )}
          {account?.capabilities.supportsVideos && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-slate-400 bg-slate-950 rounded">Videos</span>
          )}
          {account?.capabilities.supportsReels && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-purple-400 bg-purple-950/60 rounded">Reels</span>
          )}
          {account?.capabilities.supportsShorts && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-rose-400 bg-rose-950/60 rounded">Shorts</span>
          )}
          {account?.capabilities.supportsStories && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-950/60 rounded">Stories</span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        {isConnected ? (
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => onRefresh(account.id)}
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              Refresh Token
            </button>
            <button
              onClick={() => onDisconnect(account.id)}
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => onConnect(platformType)}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            + Connect Channel
          </button>
        )}
      </div>
    </div>
  );
}
