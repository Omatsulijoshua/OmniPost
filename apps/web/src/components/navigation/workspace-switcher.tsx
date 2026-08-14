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
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-800 transition-all shadow-xs"
      >
        <span className="truncate">{activeWorkspace?.name || 'Select Workspace'}</span>
        <span className="text-[10px] text-blue-600 font-extrabold bg-blue-100 px-2 py-0.5 rounded-full ml-2 uppercase">
          {activeWorkspace?.role || 'OWNER'}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
            Active Workspaces
          </div>
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => {
                setActiveWorkspace(ws);
                setOpen(false);
              }}
              className={`w-full flex justify-between items-center px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                ws.id === activeWorkspace?.id
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{ws.name}</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase">{ws.role}</span>
            </button>
          ))}

          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full mt-2 text-center px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-all"
            >
              + Create Workspace
            </button>
          ) : (
            <form onSubmit={handleCreate} className="mt-2 space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="text"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                placeholder="Workspace name"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-900 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-1">
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-2 py-1.5 bg-slate-200 text-slate-700 text-[11px] rounded-lg font-semibold"
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
