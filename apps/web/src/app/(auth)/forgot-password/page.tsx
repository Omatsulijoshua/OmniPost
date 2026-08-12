'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api-client';
import { Button } from '@omnipost/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const data = await apiFetch('/auth/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage(data.message || 'If the email exists, a password reset link has been sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-400">Enter your email address to receive a recovery link.</p>
        </div>

        {message && (
          <div className="mb-4 p-3 text-sm text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 rounded-lg">
            {message}
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
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="name@company.com"
            />
          </div>

          <Button variant="primary">
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Remembered your password?{' '}
          <Link href="/login" className="text-indigo-400 hover:underline font-semibold">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
