'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuthStore } from '../../stores/admin-auth-store';
import { AdminRole, AdminPermission } from '../../types/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const setAdminAuth = useAdminAuthStore((state) => state.setAdminAuth);

  const [email, setEmail] = useState('joshuaomatsuli01@gmail.com');
  const [password, setPassword] = useState('Jos@56567');
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('joshuaomatsuli01@gmail.com');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Simulate MFA step for super admin logins
      if (email.trim() === 'joshuaomatsuli01@gmail.com' && !mfaStep) {
        setMfaStep(true);
        setLoading(false);
        return;
      }

      // Successful Admin Auth Completion
      const adminUser = {
        id: 'usr_admin_joshua',
        email: email.trim() || 'joshuaomatsuli01@gmail.com',
        name: 'Joshua Omatsuli (Super Admin)',
        role: 'SUPER_ADMIN' as AdminRole,
        permissions: ['*'] as AdminPermission[],
        mfaEnabled: true,
        lastLoginAt: new Date().toISOString(),
        activeSessions: [
          {
            id: `sess_${Date.now()}`,
            adminId: 'usr_admin_joshua',
            ipAddress: '127.0.0.1',
            userAgent: 'Chrome / Windows (Admin Workstation)',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
            lastActiveAt: new Date().toISOString(),
            isCurrentSession: true,
          },
        ],
      };

      setAdminAuth(adminUser, 'admin_jwt_access_token_live', 'admin_jwt_refresh_token_live', 86400);
      setLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 mx-auto">
            OP
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">OmniPost Admin Portal</h1>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-50 border border-blue-200 text-blue-700 rounded-full uppercase">
              👑 System Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Authorized OmniPost platform administrators and operations staff only.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {!mfaStep ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joshuaomatsuli01@gmail.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Admin Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            <div className="space-y-3 bg-blue-50/50 p-4 border border-blue-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔐</span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">MFA / 2FA Verification</h3>
                  <p className="text-[11px] text-slate-500">Enter the 6-digit code from your authenticator app.</p>
                </div>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>👑</span>
            <span>{loading ? 'Authenticating Admin...' : mfaStep ? 'Verify MFA Code & Enter' : 'Sign In to Admin Portal'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <a
            href="https://omnipost-web-ivory.vercel.app"
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            ← Back to Customer Web Application
          </a>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Admin Password Reset</h3>
              <button
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Enter your registered administrator email address. A secure single-use password reset link will be dispatched.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@omnipost.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                >
                  Send Admin Reset Link
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <span className="text-2xl">✅</span>
                <p className="text-xs font-extrabold text-emerald-800">Reset instructions dispatched!</p>
                <p className="text-[11px] text-emerald-700">Check inbox for {forgotEmail}. Link expires in 15 minutes.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
