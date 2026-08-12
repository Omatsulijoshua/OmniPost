'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { Button } from '@omnipost/ui';

export default function OnboardingPage() {
  const router = useRouter();
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.name || '');
  const [loading, setLoading] = useState(false);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (workspaceName && workspaceName !== activeWorkspace?.name) {
        const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newWs = await apiFetch('/workspaces', {
          method: 'POST',
          body: JSON.stringify({ name: workspaceName, slug }),
        });
        useAuthStore.getState().setActiveWorkspace(newWs);
      }
      router.push('/dashboard');
    } catch (err: any) {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-lg p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 rounded-full">
            Welcome to OmniPost
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Set up your workspace</h1>
          <p className="mt-2 text-sm text-slate-400">
            Workspaces organize your social accounts, media library, team members, and content posts.
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Acme Marketing Team"
            />
          </div>

          <Button variant="primary">
            {loading ? 'Setting up...' : 'Continue to Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
}
