'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api-client';
import { Button } from '@omnipost/ui';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const data = await apiFetch('/auth/password-reset/confirm', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
      setMessage(data.message || 'Password updated successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Set new password</h1>
        <p className="mt-2 text-sm text-slate-400">Choose a strong password with at least 8 characters.</p>
      </div>

      {message && (
        <div className="mb-4 p-3 text-sm text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 rounded-lg">
          {message} Redirecting to sign in...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 text-sm text-rose-400 bg-rose-950/50 border border-rose-800/50 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            placeholder="••••••••"
          />
        </div>

        <Button variant="primary">
          {loading ? 'Updating password...' : 'Update Password'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        <Link href="/login" className="text-indigo-400 hover:underline font-semibold">
          Back to Sign in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
