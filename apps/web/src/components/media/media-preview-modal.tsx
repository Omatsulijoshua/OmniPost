'use client';

import React, { useState } from 'react';
import { MediaAssetDetail, TranscodingPresetName } from '@omnipost/types';
import { apiFetch } from '../../lib/api-client';

interface MediaPreviewModalProps {
  asset: MediaAssetDetail | null;
  onClose: () => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

const availablePresets: { preset: TranscodingPresetName; label: string }[] = [
  { preset: 'INSTAGRAM_REEL', label: 'Instagram Reel (9:16)' },
  { preset: 'TIKTOK_VIDEO', label: 'TikTok Video (9:16)' },
  { preset: 'YOUTUBE_SHORT', label: 'YouTube Short (9:16)' },
  { preset: 'SQUARE_VIDEO', label: 'Square Video / Image (1:1)' },
  { preset: 'LANDSCAPE_VIDEO', label: 'Landscape Video (16:9)' },
];

export function MediaPreviewModal({
  asset,
  onClose,
  onRename,
  onDelete,
}: MediaPreviewModalProps) {
  if (!asset) return null;

  const [filename, setFilename] = useState(asset.filename);
  const [editing, setEditing] = useState(false);
  const [selectedPresets, setSelectedPresets] = useState<TranscodingPresetName[]>(['INSTAGRAM_REEL']);
  const [transcoding, setTranscoding] = useState(false);
  const [transcodeSuccess, setTranscodeSuccess] = useState<string | null>(null);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename) return;
    onRename(asset.id, filename);
    setEditing(false);
  };

  const togglePreset = (preset: TranscodingPresetName) => {
    setSelectedPresets((prev) =>
      prev.includes(preset) ? prev.filter((p) => p !== preset) : [...prev, preset],
    );
  };

  const handleStartTranscoding = async () => {
    if (selectedPresets.length === 0) return;
    setTranscoding(true);
    setTranscodeSuccess(null);

    try {
      await apiFetch('/transcoding/jobs', {
        method: 'POST',
        body: JSON.stringify({
          mediaAssetId: asset.id,
          presets: selectedPresets,
        }),
      });
      setTranscodeSuccess(`Successfully generated ${selectedPresets.length} platform variants!`);
    } catch (err: any) {
      alert(err.message || 'Failed to transcode media asset');
    } finally {
      setTranscoding(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        {/* Media Preview Area */}
        <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center overflow-hidden">
          {asset.mimeType.startsWith('image/') ? (
            <img
              src={asset.originalUrl}
              alt={asset.filename}
              className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
            />
          ) : asset.mimeType.startsWith('video/') ? (
            <video controls src={asset.originalUrl} className="max-h-full max-w-full rounded-lg" />
          ) : (
            <audio controls src={asset.originalUrl} className="w-full" />
          )}

          {asset.variants && asset.variants.length > 0 && (
            <div className="w-full mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="text-[11px] font-bold text-indigo-400 uppercase">Generated Variants ({asset.variants.length})</div>
              <div className="flex flex-wrap gap-2">
                {asset.variants.map((v) => (
                  <a
                    key={v.id}
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-[10px] font-bold text-slate-200 bg-slate-950 border border-slate-800 rounded-md hover:border-indigo-500"
                  >
                    {v.preset} ({v.aspectRatio})
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="w-full md:w-85 p-6 border-l border-slate-800 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1 mr-2">
              {!editing ? (
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100 truncate">
                    {asset.filename}
                  </h3>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRenameSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none"
                  />
                  <div className="flex gap-1">
                    <button
                      type="submit"
                      className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-slate-400 font-semibold uppercase">Metadata</div>
            <div className="space-y-1.5 p-3 bg-slate-950 rounded-lg text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">MIME Type:</span>
                <span>{asset.mimeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Size:</span>
                <span>{formatSize(asset.fileSize)}</span>
              </div>
              {asset.width && asset.height && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolution:</span>
                  <span>{asset.width} x {asset.height}</span>
                </div>
              )}
            </div>
          </div>

          {/* Transcoding Section */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-200 uppercase">Transcode & Adapt Asset</div>
            
            {transcodeSuccess && (
              <div className="p-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 rounded-lg">
                {transcodeSuccess}
              </div>
            )}

            <div className="space-y-1.5">
              {availablePresets.map((p) => (
                <label key={p.preset} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPresets.includes(p.preset)}
                    onChange={() => togglePreset(p.preset)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleStartTranscoding}
              disabled={transcoding || selectedPresets.length === 0}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-600/20"
            >
              {transcoding ? 'Transcoding...' : '⚡ Generate Platform Variants'}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => onDelete(asset.id)}
              className="w-full py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold rounded-lg"
            >
              Delete Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
