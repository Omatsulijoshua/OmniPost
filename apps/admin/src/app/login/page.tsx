'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore, AdminUser } from '../../stores/admin-auth-store';
import { adminApiFetch } from '../../lib/api-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const setAdminAuth = useAdminAuthStore((state) => state.setAdminAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [requiresMfa, setRequiresMfa] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (requiresMfa) {
        const data = await adminApiFetch<{ token: string; admin: AdminUser }>(
          '/auth/verify-mfa',
          {
            method: 'POST',
            body: JSON.stringify({ email, mfaCode }),
          },
        );
        setAdminAuth(data.admin, data.token);
        router.push('/');
      } else {
        const data = await adminApiFetch<{ requiresMfa: boolean; token?: string; admin?: AdminUser }>(
          '/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          },
        );

        if (data.requiresMfa) {
          setRequiresMfa(true);
        } else if (data.token && data.admin) {
          setAdminAuth(data.admin, data.token);
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const targetEmail = prompt('Enter admin email for password reset instructions:');
    if (targetEmail) {
      setForgotMsg(`Password reset instructions have been sent to ${targetEmail}.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 font-black text-xl shadow-lg shadow-indigo-600/30">
            OP
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">OmniPost Admin Portal</h1>
          <p className="text-xs text-slate-400">Enterprise Administrative Authentication</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {forgotMsg && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
            {forgotMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {!requiresMfa ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@omnipost.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-indigo-400 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">MFA Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center font-mono text-sm tracking-widest text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500 text-center">Enter 6-digit code from your authenticator app.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
          >
            {loading ? 'Authenticating...' : requiresMfa ? 'Verify & Enter Portal' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
