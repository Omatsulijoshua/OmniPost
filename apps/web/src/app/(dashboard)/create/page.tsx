'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { SocialAccountDetail } from '@omnipost/types';
import { PlatformPreviewCard } from '../../../components/post/platform-preview-card';
import { Button } from '@omnipost/ui';

interface OverrideState {
  caption: string;
  title: string;
  hashtags: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccountDetail[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [activeTabAccountId, setActiveTabAccountId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [universalCaption, setUniversalCaption] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const [overrides, setOverrides] = useState<Record<string, OverrideState>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    apiFetch<SocialAccountDetail[]>('/social-accounts')
      .then((data) => {
        setConnectedAccounts(data || []);
        if (data && data.length > 0) {
          setSelectedAccountIds([data[0].id]);
          setActiveTabAccountId(data[0].id);
        }
      })
      .catch(() => setConnectedAccounts([]));
  }, [activeWorkspace?.id]);

  const toggleAccountSelection = (id: string) => {
    setSelectedAccountIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0 && (!activeTabAccountId || !next.includes(activeTabAccountId))) {
        setActiveTabAccountId(next[0]);
      }
      return next;
    });
  };

  const handleOverrideChange = (
    accountId: string,
    field: 'caption' | 'title' | 'hashtags',
    value: string,
  ) => {
    setOverrides((prev) => ({
      ...prev,
      [accountId]: {
        ...(prev[accountId] || { caption: '', title: '', hashtags: '' }),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (action: 'draft' | 'schedule' | 'publish') => {
    if (!universalCaption) {
      setError('Universal caption is required');
      return;
    }
    if (selectedAccountIds.length === 0) {
      setError('Select at least one social channel');
      return;
    }

    setLoading(true);
    setError(null);

    const formattedOverrides = Object.entries(overrides).map(([accId, ov]) => ({
      socialAccountId: accId,
      caption: ov.caption || undefined,
      title: ov.title || undefined,
      hashtags: ov.hashtags ? ov.hashtags.split(' ').filter(Boolean) : undefined,
    }));

    try {
      const payload: any = {
        title: title || undefined,
        universalCaption,
        socialAccountIds: selectedAccountIds,
        isDraft: action === 'draft',
        publishNow: action === 'publish',
        scheduledAt: action === 'schedule' && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        overrides: formattedOverrides,
      };

      await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      router.push('/content');
    } catch (err: any) {
      setError(err.message || 'Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  const activeTabAccount = connectedAccounts.find((a) => a.id === activeTabAccountId);

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Create Post</h1>
        <p className="mt-1 text-sm text-slate-400">
          Create once. Adapt everywhere. Publish everywhere.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Step 1: Universal Content Inputs */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          1. Universal Content Input
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Universal Post Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Major Product Update v2.0"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Universal Caption (Primary Message)
          </label>
          <textarea
            rows={5}
            required
            value={universalCaption}
            onChange={(e) => setUniversalCaption(e.target.value)}
            placeholder="Write your core caption here. This will automatically adapt to all selected social channels..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>
      </div>

      {/* Step 2: Target Channels Selector */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          2. Target Channels Selector
        </h2>

        {connectedAccounts.length === 0 ? (
          <div className="text-xs text-amber-400 bg-amber-950/40 p-3 rounded-lg border border-amber-800/40">
            No connected accounts found for this workspace. Go to{' '}
            <a href="/social-accounts" className="underline font-bold">
              Social Accounts
            </a>{' '}
            to connect channels first.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {connectedAccounts.map((acc) => (
              <label
                key={acc.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedAccountIds.includes(acc.id)
                    ? 'border-indigo-500 bg-indigo-950/20 text-slate-100'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAccountIds.includes(acc.id)}
                  onChange={() => toggleAccountSelection(acc.id)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <div className="truncate">
                  <div className="text-xs font-bold truncate">{acc.platformName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{acc.accountName}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Step 3: Tabbed Platform Previews & Overrides */}
      {selectedAccountIds.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            3. Platform Previews & Per-Channel Overrides
          </h2>

          <div className="flex border-b border-slate-800 gap-1 overflow-x-auto">
            {selectedAccountIds.map((id) => {
              const acc = connectedAccounts.find((a) => a.id === id);
              if (!acc) return null;
              const isActive = activeTabAccountId === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTabAccountId(id)}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                    isActive
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {acc.platformName} ({acc.accountName})
                </button>
              );
            })}
          </div>

          {activeTabAccount && (
            <PlatformPreviewCard
              account={activeTabAccount}
              universalCaption={universalCaption}
              universalTitle={title}
              overrideCaption={overrides[activeTabAccount.id]?.caption || ''}
              overrideTitle={overrides[activeTabAccount.id]?.title || ''}
              overrideHashtags={overrides[activeTabAccount.id]?.hashtags || ''}
              onOverrideChange={(field, val) =>
                handleOverrideChange(activeTabAccount.id, field, val)
              }
            />
          )}
        </div>
      )}

      {/* Step 4: Submission Actions */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase">Schedule Time:</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl"
          >
            Save Draft
          </button>
          {scheduledAt && (
            <button
              onClick={() => handleSubmit('schedule')}
              disabled={loading}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-600/20"
            >
              Schedule Post
            </button>
          )}
          <button
            onClick={() => handleSubmit('publish')}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Publishing...' : '🚀 Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
