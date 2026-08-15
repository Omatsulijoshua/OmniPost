'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '../../../lib/api-client';

function OAuthSandboxContent() {
  const searchParams = useSearchParams();
  const platform = (searchParams.get('platform') || 'TIKTOK').toUpperCase();

  const [accountName, setAccountName] = useState(`@${platform.toLowerCase()}_creator`);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthorize = async () => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch('/social-accounts/connect-mock', {
        method: 'POST',
        body: JSON.stringify({
          platformType: platform,
          accountName,
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage('oauth_success', '*');
        }
        window.close();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to authorize account in sandbox');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
      {/* Brand & Platform Header */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl font-black text-blue-600 mx-auto shadow-md">
          {platform === 'OTHER' ? '✨' : platform.slice(0, 2)}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Authorize {platform} Account
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            OmniPost Developer Sandbox Authorization Gateway
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      {success ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
          <div className="text-3xl">✅</div>
          <div className="text-sm font-extrabold text-emerald-800">
            {platform} Account Connected Successfully!
          </div>
          <p className="text-xs text-emerald-600">Closing authorization window...</p>
        </div>
      ) : (
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Account Handle / Channel Profile
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. @gaming_vlogs or My Channel"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5 text-xs text-slate-600">
            <div className="font-bold text-blue-900 uppercase text-[10px]">
              Permissions Requested by OmniPost:
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Read user profile basic info</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Publish video & photo posts to channel</span>
            </div>
          </div>

          <button
            onClick={handleAuthorize}
            disabled={loading || !accountName}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
          >
            {loading ? 'Authorizing Account...' : `Authorize & Connect ${accountName}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function OAuthSandboxPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
      <Suspense fallback={<div className="text-xs font-bold text-slate-500">Loading OAuth Sandbox Gateway...</div>}>
        <OAuthSandboxContent />
      </Suspense>
    </div>
  );
}
