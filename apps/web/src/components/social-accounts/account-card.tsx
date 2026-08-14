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
    <div className="p-5 bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 text-sm">
              {platformType === 'OTHER' ? '✨' : platformType.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {platformType === 'OTHER'
                  ? 'Other / Custom Platform'
                  : platformType.charAt(0) + platformType.slice(1).toLowerCase().replace('_', ' ')}
              </h3>
              <p className="text-xs text-slate-500">
                {account ? account.accountName : 'Not Connected'}
              </p>
            </div>
          </div>

          <div>
            {isConnected ? (
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                {account.isMock ? 'Mock Connected' : 'Live Connected'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full">
                Disconnected
              </span>
            )}
          </div>
        </div>

        {/* Capabilities Pills */}
        <div className="flex flex-wrap gap-1">
          {account?.capabilities.supportsImages && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-slate-600 bg-slate-100 rounded">Images</span>
          )}
          {account?.capabilities.supportsVideos && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-slate-600 bg-slate-100 rounded">Videos</span>
          )}
          {account?.capabilities.supportsReels && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-purple-700 bg-purple-50 rounded">Reels</span>
          )}
          {account?.capabilities.supportsShorts && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-rose-700 bg-rose-50 rounded">Shorts</span>
          )}
          {account?.capabilities.supportsStories && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 rounded">Stories</span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        {isConnected ? (
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => onRefresh(account.id)}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Refresh Token
            </button>
            <button
              onClick={() => onDisconnect(account.id)}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => onConnect(platformType)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            + Connect Channel
          </button>
        )}
      </div>
    </div>
  );
}
