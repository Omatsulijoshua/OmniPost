'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { Button } from '@omnipost/ui';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('joshuaomatsuli01@gmail.com');
  const [password, setPassword] = useState('Jos@56567');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    // 1. Instant Platform Super Admin & Owner Authentication Check
    if (inputEmail === 'joshuaomatsuli01@gmail.com' && inputPass === 'Jos@56567') {
      const superAdminUser = {
        id: 'usr_admin_joshua',
        email: 'joshuaomatsuli01@gmail.com',
        fullName: 'Joshua Omatsuli',
        name: 'Joshua Omatsuli',
        role: 'SUPER_ADMIN',
        emailVerified: true,
        twoFactorEnabled: false,
      };

      const defaultWorkspace = {
        id: 'ws_primary_joshua',
        name: "Joshua's Publishing Workspace",
        slug: 'joshua-workspace',
        ownerId: 'usr_admin_joshua',
        role: 'OWNER' as const,
        createdAt: new Date().toISOString(),
      };

      const tokens = {
        accessToken: 'live_user_jwt_access_token',
        refreshToken: 'live_user_jwt_refresh_token',
        expiresIn: 86400,
      };

      setAuth(superAdminUser, tokens, defaultWorkspace);

      // Save cookie and localStorage for cross-page persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('omnipost_auth_token', tokens.accessToken);
        localStorage.setItem('omnipost_admin_authenticated', 'true');
        document.cookie = `omnipost_token=${tokens.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }

      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 300);
      return;
    }

    // 2. Standard Database Authentication via Live API
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: inputEmail, password: inputPass }),
      });

      setAuth(data.user, data.tokens, data.defaultWorkspace);

      if (typeof window !== 'undefined' && data.tokens?.accessToken) {
        localStorage.setItem('omnipost_auth_token', data.tokens.accessToken);
        document.cookie = `omnipost_token=${data.tokens.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 mx-auto">
            OP
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Sign in to OmniPost</h1>
          <p className="text-xs text-slate-400 font-medium">Create once. Adapt everywhere. Publish everywhere.</p>
        </div>

        {error && (
          <div className="p-3.5 text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/60 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] text-blue-400 hover:underline font-bold">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
          <div className="text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:underline font-bold">
              Create an account
            </Link>
          </div>

          <div className="pt-2">
            <a
              href="https://admin-gamma-ten-89.vercel.app/login"
              className="text-[11px] font-bold text-slate-500 hover:text-blue-400 transition"
            >
              👑 Access Dedicated Admin Portal →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
