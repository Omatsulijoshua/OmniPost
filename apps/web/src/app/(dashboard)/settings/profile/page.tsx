'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../../lib/auth-store';
import { apiFetch } from '../../../../lib/api-client';
import { Button } from '@omnipost/ui';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const updated = await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ name, avatarUrl }),
      });

      updateUser(updated);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">User Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your personal account details.</p>
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

      <form onSubmit={handleUpdate} className="space-y-4 p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-850 rounded-lg text-slate-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <Button variant="primary">
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
}
