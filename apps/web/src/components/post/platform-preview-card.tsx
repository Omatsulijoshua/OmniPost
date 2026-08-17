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
  QUORA: 50000,
  BLUESKY: 300,
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
      {/* Live Preview Render */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {account.platformName} Live Preview
          </span>
          <span className="text-xs font-bold text-blue-600">{account.accountName}</span>
        </div>

        <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
              pType === 'QUORA' ? 'bg-[#B92B27] text-white font-serif' : 'bg-blue-100 text-blue-600'
            }`}>
              {pType === 'QUORA' ? 'Q' : pType === 'OTHER' ? '✨' : pType.slice(0, 2)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{account.accountName}</div>
              <div className="text-[10px] text-slate-500">{account.platformName}</div>
            </div>
          </div>

          {currentTitle && (
            <div className="text-sm font-bold text-slate-900">
              {pType === 'QUORA' ? `Q: ${currentTitle}` : currentTitle}
            </div>
          )}

          <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
            {currentCaption || <span className="italic text-slate-400">No caption entered...</span>}
          </div>

          {overrideHashtags && (
            <div className="text-xs text-blue-600 font-semibold">{overrideHashtags}</div>
          )}

          {pType === 'QUORA' && (
            <div className="pt-2 border-t border-slate-200 flex items-center gap-4 text-[10px] text-slate-500 font-semibold">
              <span>▲ Upvote (1.2k)</span>
              <span>💬 84 Answers</span>
              <span>🔄 32 Shares</span>
            </div>
          )}
        </div>
      </div>

      {/* Per-Platform Override Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Custom Platform Overrides
          </span>
          <span
            className={`text-xs font-bold ${
              isOverLimit ? 'text-rose-600' : 'text-slate-500'
            }`}
          >
            {currentLength} / {maxLimit} chars
          </span>
        </div>

        {isOverLimit && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-[11px] font-semibold text-rose-700 rounded-xl">
            ⚠️ Exceeds max limit of {maxLimit} characters for {account.platformName}!
          </div>
        )}

        {(pType === 'YOUTUBE' || pType === 'PINTEREST' || pType === 'QUORA' || pType === 'REDDIT') && (
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              {pType === 'QUORA' ? 'Quora Question / Space Topic' : `Custom Title (${pType})`}
            </label>
            <input
              type="text"
              value={overrideTitle}
              onChange={(e) => onOverrideChange('title', e.target.value)}
              placeholder={universalTitle || (pType === 'QUORA' ? 'e.g. What is the best strategy to scale SaaS in 2026?' : `Title for ${pType}...`)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Custom Caption Override
          </label>
          <textarea
            rows={4}
            value={overrideCaption}
            onChange={(e) => onOverrideChange('caption', e.target.value)}
            placeholder={universalCaption || 'Defaults to universal caption...'}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Hashtags (space separated)
          </label>
          <input
            type="text"
            value={overrideHashtags}
            onChange={(e) => onOverrideChange('hashtags', e.target.value)}
            placeholder="#omnipost #marketing #growth"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>
    </div>
  );
}
