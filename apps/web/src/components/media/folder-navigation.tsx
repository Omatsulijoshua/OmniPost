'use client';

import React, { useState } from 'react';
import { FolderSummary } from '@omnipost/types';

interface FolderNavigationProps {
  folders: FolderSummary[];
  currentFolderId?: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export function FolderNavigation({
  folders,
  currentFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
}: FolderNavigationProps) {
  const [openModal, setOpenModal] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName) return;
    onCreateFolder(folderName);
    setFolderName('');
    setOpenModal(false);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Folders</h2>
        <button
          onClick={() => setOpenModal(true)}
          className="text-xs text-indigo-400 font-bold hover:underline"
        >
          + New Folder
        </button>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => onSelectFolder(null)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
            currentFolderId === null
              ? 'bg-indigo-950 text-indigo-300 font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span>📁 All Media (Root)</span>
        </button>

        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
              currentFolderId === folder.id
                ? 'bg-indigo-950 text-indigo-300 font-bold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <button
              onClick={() => onSelectFolder(folder.id)}
              className="flex-1 text-left truncate"
            >
              📁 {folder.name}
            </button>
            <button
              onClick={() => onDeleteFolder(folder.id)}
              className="text-rose-400 hover:underline ml-2 text-[10px]"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Create New Folder</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                required
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder name (e.g. Summer Campaign)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg"
                >
                  Create Folder
                </button>
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
