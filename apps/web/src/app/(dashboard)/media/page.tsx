'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { FolderSummary, MediaAssetDetail } from '@omnipost/types';
import { UploadZone } from '../../../components/media/upload-zone';
import { FolderNavigation } from '../../../components/media/folder-navigation';
import { MediaGrid } from '../../../components/media/media-grid';
import { MediaPreviewModal } from '../../../components/media/media-preview-modal';

export default function MediaPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [assets, setAssets] = useState<MediaAssetDetail[]>([]);
  const [folders, setFolders] = useState<FolderSummary[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'image' | 'audio'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewAsset, setPreviewAsset] = useState<MediaAssetDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        search,
        type: typeFilter,
        sort,
        ...(currentFolderId ? { folderId: currentFolderId } : {}),
      });

      const [assetsData, foldersData] = await Promise.all([
        apiFetch<{ assets: MediaAssetDetail[]; total: number }>(`/media?${queryParams.toString()}`),
        apiFetch<FolderSummary[]>('/media/folders'),
      ]);

      setAssets(assetsData.assets || []);
      setFolders(foldersData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeWorkspace?.id, currentFolderId, typeFilter, sort, search]);

  const handleCreateFolder = async (name: string) => {
    try {
      await apiFetch('/media/folders', {
        method: 'POST',
        body: JSON.stringify({ name, parentId: currentFolderId }),
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;
    try {
      await apiFetch(`/media/folders/${folderId}`, { method: 'DELETE' });
      if (currentFolderId === folderId) setCurrentFolderId(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete folder');
    }
  };

  const handleRename = async (id: string, filename: string) => {
    try {
      const updated = await apiFetch<MediaAssetDetail>(`/media/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ filename }),
      });
      setAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (previewAsset?.id === id) setPreviewAsset(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to rename asset');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await apiFetch(`/media/${id}`, { method: 'DELETE' });
      setAssets((prev) => prev.filter((a) => a.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      if (previewAsset?.id === id) setPreviewAsset(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete asset');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} assets?`)) return;

    try {
      await apiFetch('/media/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ assetIds: selectedIds }),
      });
      setAssets((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      setSelectedIds([]);
    } catch (err: any) {
      alert(err.message || 'Failed to bulk delete assets');
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === assets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assets.map((a) => a.id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Media Library</h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload and manage original video, image, and audio assets.
        </p>
      </div>

      <UploadZone currentFolderId={currentFolderId} onUploadSuccess={loadData} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FolderNavigation
          folders={folders}
          currentFolderId={currentFolderId}
          onSelectFolder={setCurrentFolderId}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
        />

        <div className="md:col-span-3 space-y-4">
          {/* Controls Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {(['all', 'video', 'image', 'audio'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
                    typeFilter === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media..."
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>

              <div className="flex bg-slate-950 rounded-lg border border-slate-800 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300">
                {selectedIds.length} assets selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
              >
                Delete Selected
              </button>
            </div>
          )}

          {/* Media Grid */}
          <MediaGrid
            assets={assets}
            selectedIds={selectedIds}
            viewMode={viewMode}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onOpenPreview={setPreviewAsset}
          />
        </div>
      </div>

      <MediaPreviewModal
        asset={previewAsset}
        onClose={() => setPreviewAsset(null)}
        onRename={handleRename}
        onDelete={handleDelete}
      />
    </div>
  );
}
