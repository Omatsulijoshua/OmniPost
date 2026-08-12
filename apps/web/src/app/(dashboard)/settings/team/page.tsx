'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../lib/auth-store';
import { apiFetch } from '../../../../lib/api-client';
import { RoleName, WorkspaceMemberDetail } from '@omnipost/types';
import { Button } from '@omnipost/ui';

export default function TeamPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [members, setMembers] = useState<WorkspaceMemberDetail[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleName>('EDITOR');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadWorkspace = async () => {
    if (!activeWorkspace?.id) return;
    try {
      const data = await apiFetch(`/workspaces/${activeWorkspace.id}`);
      setMembers(data.members || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load workspace members');
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [activeWorkspace?.id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace?.id) return;
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const newMember = await apiFetch(`/workspaces/${activeWorkspace.id}/members`, {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      });
      setMembers([...members, newMember]);
      setEmail('');
      setMessage(`Member ${email} added successfully!`);
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!activeWorkspace?.id) return;
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await apiFetch(`/workspaces/${activeWorkspace.id}/members/${memberId}`, {
        method: 'DELETE',
      });
      setMembers(members.filter((m) => m.id !== memberId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Team & Workspace Members</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage roles and permissions for workspace: <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
        </p>
      </div>

      {message && (
        <div className="p-3 text-sm text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-rose-400 bg-rose-950/50 border border-rose-800/50 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleInvite} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 uppercase">Invite New Team Member</h2>
        <div className="flex gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@company.com"
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleName)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="EDITOR">EDITOR</option>
            <option value="PUBLISHER">PUBLISHER</option>
            <option value="ANALYST">ANALYST</option>
            <option value="VIEWER">VIEWER</option>
          </select>
          <Button variant="primary">
            {loading ? 'Inviting...' : 'Add Member'}
          </Button>
        </div>
      </form>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <h2 className="text-sm font-semibold text-slate-200 uppercase mb-4">Workspace Members</h2>
        <div className="divide-y divide-slate-800">
          {members.map((m) => (
            <div key={m.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-200">{m.user.name}</div>
                <div className="text-xs text-slate-500">{m.user.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 rounded-full">
                  {m.role}
                </span>
                {m.role !== 'OWNER' && (
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
