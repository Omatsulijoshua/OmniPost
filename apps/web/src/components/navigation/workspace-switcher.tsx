'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../lib/auth-store';
import { apiFetch } from '../../lib/api-client';

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, setActiveWorkspace, setWorkspaces } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newWsName, setNewWsName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName) return;

    try {
      const slug = newWsName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const created = await apiFetch('/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name: newWsName, slug }),
      });
      setWorkspaces([...workspaces, created]);
      setActiveWorkspace(created);
      setNewWsName('');
      setCreating(false);
      setOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create workspace');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-850"
      >
        <span className="truncate">{activeWorkspace?.name || 'Select Workspace'}</span>
        <span className="text-xs text-indigo-400 font-bold ml-2 uppercase">
          {activeWorkspace?.role || 'OWNER'}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 p-2 space-y-1">
          <div className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase">
            Workspaces
          </div>
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => {
                setActiveWorkspace(ws);
                setOpen(false);
              }}
              className={`w-full flex justify-between items-center px-2 py-1.5 rounded-md text-xs font-medium text-left ${
                ws.id === activeWorkspace?.id
                  ? 'bg-indigo-950 text-indigo-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{ws.name}</span>
              <span className="text-[10px] text-slate-500 uppercase">{ws.role}</span>
            </button>
          ))}

          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full mt-2 text-center px-2 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-400 text-xs font-medium rounded-md"
            >
              + Create Workspace
            </button>
          ) : (
            <form onSubmit={handleCreate} className="mt-2 space-y-2 p-2 bg-slate-950 rounded-md">
              <input
                type="text"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                placeholder="Workspace name"
                className="w-full px-2 py-1 bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded focus:outline-none"
              />
              <div className="flex gap-1">
                <button
                  type="submit"
                  className="flex-1 py-1 bg-indigo-600 text-white text-[11px] font-semibold rounded"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-400 text-[11px] rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
