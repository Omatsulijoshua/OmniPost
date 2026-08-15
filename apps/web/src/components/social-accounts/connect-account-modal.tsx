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

  const isOther = platformType === 'OTHER';

  const [mode, setMode] = useState<'oauth' | 'mock'>('mock');
  const [customPlatformName, setCustomPlatformName] = useState('Bluesky');
  const [accountName, setAccountName] = useState(
    isOther ? '@creator' : `@omnipost_${platformType.toLowerCase()}`,
  );
  const [aiInstructions, setAiInstructions] = useState(
    'Adapt post to match platform style: use concise paragraphs, relevant hashtags, and a clear call-to-action.',
  );
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatErrorMessage = (err: any) => {
    const msg = err.message || String(err);
    if (msg.includes('Failed to fetch') || msg.includes('fetch')) {
      return '⚡ Backend API server is waking up on Render (cold start delay). Please wait 10 seconds and click again!';
    }
    return msg || 'Failed to connect account';
  };

  const handleOAuthConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ authorizationUrl: string }>(
        `/social-accounts/oauth-url/${platformType}`,
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.data === 'oauth_success') {
          window.removeEventListener('message', handleMessage);
          onSuccess();
          onClose();
        }
      };
      window.addEventListener('message', handleMessage);

      window.open(data.authorizationUrl, '_blank', 'width=600,height=700');
    } catch (err: any) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleMockConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const displayName = isOther
      ? `${customPlatformName} (${accountName})`
      : accountName;

    try {
      await apiFetch('/social-accounts/connect-mock', {
        method: 'POST',
        body: JSON.stringify({
          platformType,
          accountName: displayName,
          customPlatformName: isOther ? customPlatformName : undefined,
          webhookUrl: webhookUrl.trim() || undefined,
          aiInstructions: isOther ? aiInstructions : undefined,
        }),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isOther ? 'Connect Custom / Other Platform' : `Connect ${platformType} Account`}
            </h3>
            <p className="text-xs text-slate-500">
              {isOther
                ? 'Configure custom social network, blog, or Webhook API for AI posting'
                : 'Link single or multiple accounts to active workspace'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-lg px-2">
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <div>{error}</div>
            {error.includes('Render') && (
              <button
                type="button"
                onClick={() => setError(null)}
                className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 text-[11px]"
              >
                🔄 Retry Connection Now
              </button>
            )}
          </div>
        )}

        {!isOther && (
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setMode('mock')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                mode === 'mock'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ Instant Connect (Recommended)
            </button>
            <button
              onClick={() => setMode('oauth')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                mode === 'oauth'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔐 Real OAuth Flow
            </button>
          </div>
        )}

        {mode === 'mock' || isOther ? (
          <form onSubmit={handleMockConnect} className="space-y-4">
            {isOther && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Platform Name
                </label>
                <input
                  type="text"
                  required
                  value={customPlatformName}
                  onChange={(e) => setCustomPlatformName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="e.g. Bluesky, Medium, Substack, Mastodon, Lemon8, Custom API"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Handle / Profile Name
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                placeholder="e.g. @gaming_vlogs, @tech_channel, or My Official Page"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tip: You can link multiple accounts of the same type (e.g. 2 YouTube channels or 3 TikTok accounts)
              </p>
            </div>

            {isOther && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    AI Adaptation Instructions (How AI should write for this platform)
                  </label>
                  <textarea
                    rows={3}
                    value={aiInstructions}
                    onChange={(e) => setAiInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium leading-relaxed"
                    placeholder="e.g. Keep under 300 chars, use markdown formatting, add top 3 tech hashtags, and end with a link."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Webhook / API Endpoint URL <span className="text-slate-400 font-normal">(Optional for automated posting)</span>
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="https://api.yourplatform.com/v1/posts or https://hooks.zapier.com/hooks/..."
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
            >
              {loading
                ? 'Connecting Channel...'
                : isOther
                ? `Add & Train AI for ${customPlatformName}`
                : `Instant Connect ${accountName} (${platformType})`}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium rounded-xl leading-relaxed text-left">
              <strong>⚙️ Production OAuth API Setup Note:</strong>
              <p className="mt-1">
                Real OAuth flow redirects directly to {platformType}'s live login servers (e.g. tiktok.com or google.com).
              </p>
              <p className="mt-1 text-[11px] text-amber-800">
                To complete real OAuth authentication, your registered Developer App Client Key (`{platformType}_CLIENT_KEY`) must be configured in Render environment variables. For instant testing without Developer Keys, switch to <strong>Instant Connect</strong>.
              </p>
            </div>

            <button
              onClick={handleOAuthConnect}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
            >
              {loading ? 'Opening Authorizer...' : `Open Live ${platformType} OAuth Screen`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
