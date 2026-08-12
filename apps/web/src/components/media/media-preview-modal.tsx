'use client';

import React, { useState } from 'react';
import { MediaAssetDetail } from '@omnipost/types';

interface MediaPreviewModalProps {
  asset: MediaAssetDetail | null;
  onClose: () => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export function MediaPreviewModal({
  asset,
  onClose,
  onRename,
  onDelete,
}: MediaPreviewModalProps) {
  if (!asset) return null;

  const [filename, setFilename] = useState(asset.filename);
  const [editing, setEditing] = useState(false);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename) return;
    onRename(asset.id, filename);
    setEditing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        {/* Media Preview Area */}
        <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-hidden">
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
        </div>

        {/* Metadata & Actions Sidebar */}
        <div className="w-full md:w-80 p-6 border-l border-slate-800 space-y-6 overflow-y-auto">
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

          <div className="space-y-3 text-xs">
            <div className="text-slate-400 font-semibold uppercase">File Information</div>
            <div className="space-y-2 p-3 bg-slate-950 rounded-lg">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">MIME Type:</span>
                <span>{asset.mimeType}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">File Size:</span>
                <span>{formatSize(asset.fileSize)}</span>
              </div>
              {asset.width && asset.height && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Resolution:</span>
                  <span>{asset.width} x {asset.height}</span>
                </div>
              )}
              {asset.duration && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Duration:</span>
                  <span>{asset.duration}s</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Uploaded:</span>
                <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
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
