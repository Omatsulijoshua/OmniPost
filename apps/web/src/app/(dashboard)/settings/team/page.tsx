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
      setMessage(`Member ${email} added with role ${role}!`);
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
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Team Collaboration & Governance</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage roles, post creation restrictions, and channel permissions for workspace:{' '}
          <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
        </p>
      </div>

      {message && (
        <div className="p-4 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-xl">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/60 rounded-xl">
          {error}
        </div>
      )}

      {/* Role Permission Matrix Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span>🛡️ Collaboration & Posting Restriction Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <div className="font-bold text-indigo-400 flex items-center justify-between">
              <span>ADMIN / OWNER</span>
              <span className="px-2 py-0.5 text-[9px] bg-indigo-950 border border-indigo-800 rounded">Full Access</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Full administrative access. Can invite team members, connect social channels, approve pending posts, and publish directly.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <div className="font-bold text-amber-400 flex items-center justify-between">
              <span>EDITOR / CREATOR</span>
              <span className="px-2 py-0.5 text-[9px] bg-amber-950 border border-amber-800 rounded">Restricted to Drafts</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Can create and edit post drafts and submit posts for approval. Cannot directly publish or schedule without Admin sign-off.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <div className="font-bold text-emerald-400 flex items-center justify-between">
              <span>PUBLISHER / SCHEDULER</span>
              <span className="px-2 py-0.5 text-[9px] bg-emerald-950 border border-emerald-800 rounded">Queue Manager</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Can schedule posts, manage publishing queues, and submit pre-approved posts to connected channels.
            </p>
          </div>
        </div>
      </div>

      {/* Invite Member Form */}
      <form onSubmit={handleInvite} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Invite Team Collaborator</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleName)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="ADMIN">ADMIN (Full Permissions)</option>
            <option value="EDITOR">EDITOR (Drafts & Approval Request Only)</option>
            <option value="PUBLISHER">PUBLISHER (Queue & Schedule Access)</option>
            <option value="ANALYST">ANALYST (Read-Only Stats)</option>
            <option value="VIEWER">VIEWER (Read-Only Preview)</option>
          </select>
          <Button variant="primary">
            {loading ? 'Inviting...' : 'Add Team Member'}
          </Button>
        </div>
      </form>

      {/* Workspace Members Table */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Active Workspace Team ({members.length})</h2>
        
        <div className="divide-y divide-slate-800/80">
          {members.map((m) => (
            <div key={m.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>{m.user.name}</span>
                  {m.role === 'OWNER' && (
                    <span className="px-2 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-950 border border-amber-800 rounded-full">
                      Workspace Owner
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{m.user.email}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="px-3 py-1 text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded-full">
                    {m.role}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {m.role === 'EDITOR' ? 'Requires Final Approval' : 'Can Direct Publish'}
                  </div>
                </div>

                {m.role !== 'OWNER' && (
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="px-3 py-1.5 text-xs text-rose-400 bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 rounded-xl font-semibold transition-all"
                  >
                    Remove Access
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
