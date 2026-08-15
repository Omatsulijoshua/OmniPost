'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { PlatformType, SocialAccountDetail, SocialGroupDetail } from '@omnipost/types';
import { AccountCard } from '../../../components/social-accounts/account-card';
import { ConnectAccountModal } from '../../../components/social-accounts/connect-account-modal';
import { CreateGroupModal } from '../../../components/social-groups/create-group-modal';

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
  const [groups, setGroups] = useState<SocialGroupDetail[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformType | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<SocialAccountDetail[]>('/social-accounts');
      setAccounts(data || []);

      // Load saved channel groups from localStorage or API
      const savedGroups = localStorage.getItem(`omnipost_groups_${activeWorkspace.id}`);
      if (savedGroups) {
        try {
          setGroups(JSON.parse(savedGroups));
        } catch {
          setGroups([]);
        }
      } else {
        // Mock default group
        const defaultGroup: SocialGroupDetail = {
          id: 'group_default',
          workspaceId: activeWorkspace.id,
          name: 'Primary Outlets Bundle',
          description: 'YouTube, Instagram & TikTok channels',
          socialAccountIds: (data || []).map((a) => a.id),
          createdAt: new Date().toISOString(),
        };
        setGroups([defaultGroup]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load social accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeWorkspace?.id]);

  const handleSaveGroup = (newGroup: SocialGroupDetail) => {
    const updated = [...groups.filter((g) => g.id !== newGroup.id), newGroup];
    setGroups(updated);
    if (activeWorkspace?.id) {
      localStorage.setItem(`omnipost_groups_${activeWorkspace.id}`, JSON.stringify(updated));
    }
  };

  const handleDeleteGroup = (id: string) => {
    if (!confirm('Are you sure you want to delete this channel group?')) return;
    const updated = groups.filter((g) => g.id !== id);
    setGroups(updated);
    if (activeWorkspace?.id) {
      localStorage.setItem(`omnipost_groups_${activeWorkspace.id}`, JSON.stringify(updated));
    }
  };

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
            Social Accounts & Channel Groups
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Link multiple accounts per platform or bundle them into custom publishing groups for active workspace:{' '}
            <span className="font-bold text-blue-600">{activeWorkspace?.name}</span>
          </p>
        </div>

        <button
          onClick={() => setShowGroupModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/20 whitespace-nowrap transition-all"
        >
          📁 + Create Channel Group
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Social Channel Groups Section */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">📁 Custom Social Channel Groups ({groups.length})</h2>
            <p className="text-xs text-slate-500">Preset bundles of channels (e.g. 2 YouTube + Instagram + TikTok) to publish to in one click</p>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium">
            No channel groups created yet. Click "+ Create Channel Group" to create your first publishing bundle!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{group.name}</span>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-slate-400 hover:text-rose-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  {group.description && (
                    <p className="text-[11px] text-slate-500 font-medium">{group.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                  <span className="font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {group.socialAccountIds.length} Channels Bundled
                  </span>
                  <span className="text-slate-400">Ready to post</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Individual Social Accounts Matrix */}
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

      {/* Group Creation Modal */}
      {showGroupModal && (
        <CreateGroupModal
          accounts={accounts}
          onClose={() => setShowGroupModal(false)}
          onSaveGroup={handleSaveGroup}
          onConnectNewAccount={() => {
            setShowGroupModal(false);
            setConnectingPlatform('OTHER');
          }}
        />
      )}

      <ConnectAccountModal
        platformType={connectingPlatform}
        onClose={() => setConnectingPlatform(null)}
        onSuccess={loadData}
      />
    </div>
  );
}
