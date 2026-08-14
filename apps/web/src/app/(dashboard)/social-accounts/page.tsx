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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Social Accounts & Integrations
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage OAuth credentials and connected channels for active workspace:{' '}
          <span className="font-semibold text-indigo-400">{activeWorkspace?.name}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allPlatforms.map((platformType) => {
            const account = accounts.find((a) => a.platformType === platformType);
            return (
              <AccountCard
                key={platformType}
                platformType={platformType}
                account={account}
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
