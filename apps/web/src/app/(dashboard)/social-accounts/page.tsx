'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { PlatformType, SocialAccountDetail } from '@omnipost/types';
import { AccountCard } from '../../../components/social-accounts/account-card';
import { ConnectAccountModal } from '../../../components/social-accounts/connect-account-modal';

const allPlatforms: PlatformType[] = [
  'INSTAGRAM',
  'FACEBOOK',
  'TIKTOK',
  'YOUTUBE',
  'X',
  'LINKEDIN',
  'THREADS',
  'PINTEREST',
  'TELEGRAM',
  'DISCORD',
  'SLACK',
  'REDDIT',
  'GOOGLE_BUSINESS',
  'OTHER',
];

export default function SocialAccountsPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [accounts, setAccounts] = useState<SocialAccountDetail[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<SocialAccountDetail[]>('/social-accounts');
      setAccounts(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load social accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [activeWorkspace?.id]);

  const handleRefresh = async (id: string) => {
    try {
      const updated = await apiFetch<SocialAccountDetail>(`/social-accounts/${id}/refresh`, {
        method: 'POST',
      });
      setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      alert('Token refreshed successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to refresh token');
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return;
    try {
      await apiFetch(`/social-accounts/${id}`, { method: 'DELETE' });
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to disconnect account');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Social Accounts & Integrations
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Link single or multiple accounts per platform (e.g. 3 YouTube channels, 2 TikTok accounts) for active workspace:{' '}
            <span className="font-bold text-blue-600">{activeWorkspace?.name}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allPlatforms.map((platformType) => {
            const platformAccounts = accounts.filter((a) => a.platformType === platformType);
            return (
              <AccountCard
                key={platformType}
                platformType={platformType}
                accounts={platformAccounts}
                onConnect={setConnectingPlatform}
                onRefresh={handleRefresh}
                onDisconnect={handleDisconnect}
              />
            );
          })}
        </div>
      )}

      <ConnectAccountModal
        platformType={connectingPlatform}
        onClose={() => setConnectingPlatform(null)}
        onSuccess={loadAccounts}
      />
    </div>
  );
}
