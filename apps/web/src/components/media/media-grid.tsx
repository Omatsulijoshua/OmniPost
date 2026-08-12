'use client';

import React from 'react';
import { MediaAssetDetail } from '@omnipost/types';

interface MediaGridProps {
  assets: MediaAssetDetail[];
  selectedIds: string[];
  viewMode: 'grid' | 'list';
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onOpenPreview: (asset: MediaAssetDetail) => void;
}

export function MediaGrid({
  assets,
  selectedIds,
  viewMode,
  onToggleSelect,
  onSelectAll,
  onOpenPreview,
}: MediaGridProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getMediaBadge = (mimeType: string) => {
    if (mimeType.startsWith('video/')) {
      return <span className="px-2 py-0.5 text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/50 rounded-md">VIDEO</span>;
    }
    if (mimeType.startsWith('image/')) {
      return <span className="px-2 py-0.5 text-[10px] font-bold text-sky-400 bg-sky-950/80 border border-sky-800/50 rounded-md">IMAGE</span>;
    }
    return <span className="px-2 py-0.5 text-[10px] font-bold text-purple-400 bg-purple-950/80 border border-purple-800/50 rounded-md">AUDIO</span>;
  };

  if (assets.length === 0) {
    return (
      <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-sm">
        No media assets found. Upload files using the upload zone above.
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length === assets.length && assets.length > 0}
              onChange={onSelectAll}
              className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
            />
            <span>Filename</span>
          </div>
          <div className="flex items-center gap-8">
            <span>Type</span>
            <span>Size</span>
            <span>Dimensions</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="px-4 py-3 flex items-center justify-between hover:bg-slate-850 cursor-pointer"
              onClick={() => onOpenPreview(asset)}
            >
              <div className="flex items-center gap-3 truncate max-w-md">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(asset.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelect(asset.id);
                  }}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <span className="text-sm font-semibold text-slate-200 truncate">
                  {asset.filename}
                </span>
              </div>

              <div className="flex items-center gap-8 text-xs text-slate-400">
                <div>{getMediaBadge(asset.mimeType)}</div>
                <div className="w-16 text-right">{formatSize(asset.fileSize)}</div>
                <div className="w-24 text-right">
                  {asset.width && asset.height ? `${asset.width}x${asset.height}` : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          onClick={() => onOpenPreview(asset)}
          className={`group relative p-3 bg-slate-900 border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-indigo-500/50 ${
            selectedIds.includes(asset.id)
              ? 'border-indigo-500 bg-indigo-950/20'
              : 'border-slate-800'
          }`}
        >
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selectedIds.includes(asset.id)}
              onChange={(e) => {
                e.stopPropagation();
                onToggleSelect(asset.id);
              }}
              className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
            />
          </div>

          <div className="absolute top-2 right-2 z-10">{getMediaBadge(asset.mimeType)}</div>

          <div className="w-full h-32 bg-slate-950 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {asset.mimeType.startsWith('image/') ? (
              <img
                src={asset.originalUrl}
                alt={asset.filename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : asset.mimeType.startsWith('video/') ? (
              <div className="text-2xl font-bold text-slate-600">▶ VIDEO</div>
            ) : (
              <div className="text-2xl font-bold text-slate-600">🎵 AUDIO</div>
            )}
          </div>

          <div className="truncate">
            <div className="text-xs font-bold text-slate-200 truncate">{asset.filename}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{formatSize(asset.fileSize)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
