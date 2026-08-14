'use client';

import React from 'react';
import { PlatformType, SocialAccountDetail } from '@omnipost/types';

interface PlatformPreviewCardProps {
  account: SocialAccountDetail;
  universalCaption: string;
  universalTitle: string;
  overrideCaption: string;
  overrideTitle: string;
  overrideHashtags: string;
  onOverrideChange: (field: 'caption' | 'title' | 'hashtags', value: string) => void;
}

const charLimits: Record<PlatformType, number> = {
  X: 280,
  INSTAGRAM: 2200,
  TIKTOK: 2200,
  LINKEDIN: 3000,
  FACEBOOK: 63206,
  YOUTUBE: 5000,
  THREADS: 500,
  PINTEREST: 500,
  TELEGRAM: 4096,
  DISCORD: 2000,
  SLACK: 40000,
  REDDIT: 40000,
  GOOGLE_BUSINESS: 1500,
  OTHER: 5000,
};

export function PlatformPreviewCard({
  account,
  universalCaption,
  universalTitle,
  overrideCaption,
  overrideTitle,
  overrideHashtags,
  onOverrideChange,
}: PlatformPreviewCardProps) {
  const pType = account.platformType;
  const maxLimit = charLimits[pType] || 2000;
  const currentCaption = overrideCaption !== undefined && overrideCaption !== '' ? overrideCaption : universalCaption;
  const currentTitle = overrideTitle !== undefined && overrideTitle !== '' ? overrideTitle : universalTitle;
  const currentLength = currentCaption.length;
  const isOverLimit = currentLength > maxLimit;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
      {/* Live Preview Render */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {account.platformName} Live Preview
          </span>
          <span className="text-xs font-semibold text-indigo-400">{account.accountName}</span>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-black text-xs text-indigo-400">
              {pType.slice(0, 2)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">{account.accountName}</div>
              <div className="text-[10px] text-slate-500">{account.platformName}</div>
            </div>
          </div>

          {currentTitle && (
            <div className="text-sm font-bold text-slate-100">{currentTitle}</div>
          )}

          <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {currentCaption || <span className="italic text-slate-600">No caption entered...</span>}
          </div>

          {overrideHashtags && (
            <div className="text-xs text-indigo-400 font-semibold">{overrideHashtags}</div>
          )}
        </div>
      </div>

      {/* Per-Platform Override Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Custom Platform Overrides
          </span>
          <span
            className={`text-xs font-bold ${
              isOverLimit ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {currentLength} / {maxLimit} chars
          </span>
        </div>

        {isOverLimit && (
          <div className="p-2.5 bg-rose-950/60 border border-rose-800/60 text-[11px] font-semibold text-rose-300 rounded-lg">
            ⚠️ Exceeds max limit of {maxLimit} characters for {account.platformName}!
          </div>
        )}

        {(pType === 'YOUTUBE' || pType === 'PINTEREST') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Custom Title ({pType})
            </label>
            <input
              type="text"
              value={overrideTitle}
              onChange={(e) => onOverrideChange('title', e.target.value)}
              placeholder={universalTitle || `Title for ${pType}...`}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
            Custom Caption Override
          </label>
          <textarea
            rows={4}
            value={overrideCaption}
            onChange={(e) => onOverrideChange('caption', e.target.value)}
            placeholder={universalCaption || 'Defaults to universal caption...'}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
            Hashtags (space separated)
          </label>
          <input
            type="text"
            value={overrideHashtags}
            onChange={(e) => onOverrideChange('hashtags', e.target.value)}
            placeholder="#omnipost #marketing #growth"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
