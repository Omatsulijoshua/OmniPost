'use client';

import React, { useState } from 'react';
import { PlatformType } from '@omnipost/types';
import { apiFetch } from '../../lib/api-client';

interface ConnectAccountModalProps {
  platformType: PlatformType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConnectAccountModal({
  platformType,
  onClose,
  onSuccess,
}: ConnectAccountModalProps) {
  if (!platformType) return null;

  const [mode, setMode] = useState<'oauth' | 'mock'>('mock');
  const [accountName, setAccountName] = useState(`@omnipost_${platformType.toLowerCase()}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ authorizationUrl: string }>(
        `/social-accounts/oauth-url/${platformType}`,
      );
      window.open(data.authorizationUrl, '_blank', 'width=600,height=700');
    } catch (err: any) {
      setError(err.message || 'Failed to initialize OAuth URL');
    } finally {
      setLoading(false);
    }
  };

  const handleMockConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch('/social-accounts/connect-mock', {
        method: 'POST',
        body: JSON.stringify({
          platformType,
          accountName,
        }),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to connect mock account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Connect {platformType}</h3>
            <p className="text-xs text-slate-400">Add social channel to your active workspace</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-400 bg-rose-950/60 border border-rose-800/60 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('mock')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
              mode === 'mock' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mock Connect (Dev / Preview)
          </button>
          <button
            onClick={() => setMode('oauth')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
              mode === 'oauth' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Real OAuth Flow
          </button>
        </div>

        {mode === 'mock' ? (
          <form onSubmit={handleMockConnect} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Mock Account Handle / Name
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Connecting...' : `Connect Mock ${platformType}`}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-xs text-slate-400">
              Click below to authenticate with {platformType} via OAuth 2.0.
            </p>
            <button
              onClick={handleOAuthConnect}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Opening Authorizer...' : `Authorize ${platformType} Account`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
