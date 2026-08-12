'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../lib/auth-store';

interface UploadZoneProps {
  currentFolderId?: string | null;
  onUploadSuccess: () => void;
}

interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export function UploadZone({ currentFolderId, onUploadSuccess }: UploadZoneProps) {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);
  const tokens = useAuthStore((state) => state.tokens);

  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !activeWorkspace?.id || !tokens?.accessToken) return;

    const fileList = Array.from(files);
    const initialProgress = fileList.map((f) => ({
      filename: f.name,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploads((prev) => [...prev, ...initialProgress]);

    for (const file of fileList) {
      const formData = new FormData();
      formData.append('file', file);
      if (currentFolderId) {
        formData.append('folderId', currentFolderId);
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        const res = await fetch(`${baseUrl}/media/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            'x-workspace-id': activeWorkspace.id,
          },
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        setUploads((prev) =>
          prev.map((item) =>
            item.filename === file.name
              ? { ...item, progress: 100, status: 'completed' }
              : item,
          ),
        );
        onUploadSuccess();
      } catch (err) {
        setUploads((prev) =>
          prev.map((item) =>
            item.filename === file.name
              ? { ...item, progress: 0, status: 'error' }
              : item,
          ),
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-indigo-500 bg-indigo-950/20'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="media-file-input"
        />
        <label htmlFor="media-file-input" className="cursor-pointer block">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
            ↑
          </div>
          <div className="text-sm font-semibold text-slate-200">
            Drag & drop media files here, or{' '}
            <span className="text-indigo-400 underline">browse</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Supports MP4, MOV, AVI, JPG, PNG, WEBP, MP3, WAV (Up to 2GB)
          </p>
        </label>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2 p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Upload Queue</div>
          <div className="space-y-2">
            {uploads.map((u, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-200 truncate max-w-xs">{u.filename}</span>
                <span
                  className={
                    u.status === 'completed'
                      ? 'text-emerald-400 font-semibold'
                      : u.status === 'error'
                      ? 'text-rose-400 font-semibold'
                      : 'text-amber-400 font-semibold'
                  }
                >
                  {u.status === 'completed'
                    ? '100% Complete'
                    : u.status === 'error'
                    ? 'Failed'
                    : 'Uploading...'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
