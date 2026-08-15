'use client';

import React from 'react';
import { SocialAccountDetail, PlatformType } from '@omnipost/types';

interface AccountCardProps {
  platformType: PlatformType;
  accounts: SocialAccountDetail[];
  onConnect: (platformType: PlatformType) => void;
  onRefresh: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function AccountCard({
  platformType,
  accounts,
  onConnect,
  onRefresh,
  onDisconnect,
}: AccountCardProps) {
  const isConnected = accounts.length > 0;
  const platformTitle =
    platformType === 'OTHER'
      ? 'Custom Platform'
      : platformType.charAt(0) + platformType.slice(1).toLowerCase().replace('_', ' ');

  return (
    <div className="p-5 bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 text-sm">
              {platformType === 'OTHER' ? '✨' : platformType.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{platformTitle}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {isConnected
                  ? `${accounts.length} ${accounts.length === 1 ? 'Account' : 'Accounts'} Linked`
                  : 'Not Connected'}
              </p>
            </div>
          </div>

          <div>
            {isConnected ? (
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full">
                {accounts.length} Active
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full">
                Disconnected
              </span>
            )}
          </div>
        </div>

        {/* Connected Accounts Handles List */}
        {isConnected && (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <div className="text-xs font-extrabold text-slate-900 truncate">
                    {acc.accountName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {acc.isMock ? 'Mock Account' : 'Live OAuth Connected'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRefresh(acc.id)}
                    className="text-[11px] text-blue-600 hover:underline font-bold"
                    title="Refresh token"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => onDisconnect(acc.id)}
                    className="text-[11px] text-rose-600 hover:underline font-bold"
                    title="Disconnect account"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => onConnect(platformType)}
          className="w-full py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-extrabold text-xs rounded-xl border border-blue-200 transition-all shadow-xs"
        >
          {isConnected ? `+ Add Another ${platformTitle} Account` : `+ Connect ${platformTitle}`}
        </button>
      </div>
    </div>
  );
}
