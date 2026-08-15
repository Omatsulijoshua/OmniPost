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

export type PostContentType = 'text' | 'image' | 'video';

export default function CreatePostPage() {
  const router = useRouter();
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [contentType, setContentType] = useState<PostContentType>('image');
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccountDetail[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [activeTabAccountId, setActiveTabAccountId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [universalCaption, setUniversalCaption] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ url: string; name: string; type: 'image' | 'video' }[]>([]);

  const [overrides, setOverrides] = useState<Record<string, OverrideState>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    apiFetch<SocialAccountDetail[]>('/social-accounts')
      .then((data) => {
        setConnectedAccounts(data || []);
        if (data && data.length > 0) {
          const defaultSelected = data.map((a) => a.id);
          setSelectedAccountIds(defaultSelected);
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

  const handleSelectAll = () => {
    const allIds = connectedAccounts.map((a) => a.id);
    setSelectedAccountIds(allIds);
    if (allIds.length > 0) setActiveTabAccountId(allIds[0]);
  };

  const handleDeselectAll = () => {
    setSelectedAccountIds([]);
    setActiveTabAccountId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMedia = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith('video/') ? ('video' as const) : ('image' as const),
    }));

    setMediaFiles((prev) => [...prev, ...newMedia]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
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

  const handleSubmit = async (action: 'draft' | 'schedule' | 'publish' | 'approval') => {
    if (!universalCaption) {
      setError('Universal caption is required');
      return;
    }
    if (selectedAccountIds.length === 0) {
      setError('Select at least one social channel to publish to');
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
        contentType,
        mediaUrls: mediaFiles.map((m) => m.url),
        isDraft: action === 'draft' || action === 'approval',
        publishNow: action === 'publish',
        scheduledAt: action === 'schedule' && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        overrides: formattedOverrides,
      };

      await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (action === 'approval') {
        alert('Post submitted for team approval!');
        router.push('/approvals');
      } else {
        router.push('/content');
      }
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create & Adapt Post</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
          Create once. Select target social channels. Adapt format automatically everywhere.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Step 1: Content Type Selector */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Select Post Content Type
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setContentType('image')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              contentType === 'image'
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="text-2xl">🖼️</span>
            <div className="text-left">
              <div className="text-xs font-bold">Photo / Image Post</div>
              <div className="text-[10px] text-slate-500">Single image or multi-photo carousel</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setContentType('video')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              contentType === 'video'
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="text-2xl">🎥</span>
            <div className="text-left">
              <div className="text-xs font-bold">Video / Reel / Short</div>
              <div className="text-[10px] text-slate-500">Vertical 9:16 or Landscape 16:9 video</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setContentType('text')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              contentType === 'text'
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="text-2xl">📝</span>
            <div className="text-left">
              <div className="text-xs font-bold">Text-Only Post</div>
              <div className="text-[10px] text-slate-500">Caption update for X, Threads, LinkedIn</div>
            </div>
          </button>
        </div>
      </div>

      {/* Step 2: Universal Content & Media Upload */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          2. Universal Content & Media Attachments
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Universal Post Title (Optional for YouTube/Pinterest/Blogs)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Major Product Launch v2.0"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Universal Caption (Primary Message)
          </label>
          <textarea
            rows={5}
            required
            value={universalCaption}
            onChange={(e) => setUniversalCaption(e.target.value)}
            placeholder="Write your core message here. OmniPost will automatically adapt formatting, hashtags, and character limits for each checked social channel..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium leading-relaxed"
          />
        </div>

        {/* Media File Upload Dropzone */}
        {contentType !== 'text' && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {contentType === 'video' ? 'Attach Video File (MP4/MOV)' : 'Attach Image Files (PNG/JPG)'}
            </label>

            <div className="p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 rounded-2xl text-center cursor-pointer transition-all relative">
              <input
                type="file"
                multiple={contentType === 'image'}
                accept={contentType === 'video' ? 'video/*' : 'image/*'}
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="text-2xl mb-1">{contentType === 'video' ? '🎥' : '📷'}</div>
              <div className="text-xs font-bold text-slate-800">
                Click or drag & drop {contentType} files here
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Supports HD 1080p, 4K, 9:16 vertical, 16:9 landscape, and 1:1 square formats
              </div>
            </div>

            {/* Media Thumbnails List */}
            {mediaFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {mediaFiles.map((m, i) => (
                  <div key={i} className="relative group w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-xs">
                    {m.type === 'video' ? (
                      <video src={m.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 3: Checkbox Social Channels Matrix */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Check Channels to Publish To ({selectedAccountIds.length} Selected)
            </h2>
            <p className="text-[11px] text-slate-500">Tick the checkboxes for the target platforms where this post will go live</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg hover:bg-blue-100"
            >
              ✓ Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg hover:bg-slate-200"
            >
              ✕ Deselect All
            </button>
          </div>
        </div>

        {connectedAccounts.length === 0 ? (
          <div className="text-xs text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200 font-medium">
            No connected accounts found for this workspace. Go to{' '}
            <a href="/social-accounts" className="underline font-bold text-blue-600">
              Social Accounts
            </a>{' '}
            to connect channels first.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {connectedAccounts.map((acc) => {
              const isChecked = selectedAccountIds.includes(acc.id);
              return (
                <label
                  key={acc.id}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-blue-500 bg-blue-50/80 text-slate-900 shadow-xs'
                      : 'border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAccountSelection(acc.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div className="truncate">
                    <div className="text-xs font-extrabold text-slate-900 truncate">
                      {acc.platformType === 'OTHER' ? 'Custom Platform' : acc.platformName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{acc.accountName}</div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 4: Tabbed Platform Previews & Overrides */}
      {selectedAccountIds.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            4. Live Channel Previews & Per-Platform Overrides
          </h2>

          <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
            {selectedAccountIds.map((id) => {
              const acc = connectedAccounts.find((a) => a.id === id);
              if (!acc) return null;
              const isActive = activeTabAccountId === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTabAccountId(id)}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    isActive
                      ? 'border-blue-600 text-blue-700 bg-blue-50/60'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

      {/* Step 5: Publishing & Scheduling Action Bar */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase">Schedule Post:</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-all"
          >
            Save Draft
          </button>

          {scheduledAt && (
            <button
              onClick={() => handleSubmit('schedule')}
              disabled={loading}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 active:scale-98 transition-all"
            >
              📅 Schedule Post
            </button>
          )}

          <button
            onClick={() => handleSubmit('approval')}
            disabled={loading}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 active:scale-98 transition-all"
          >
            🛡️ Submit for Approval
          </button>

          <button
            onClick={() => handleSubmit('publish')}
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
          >
            {loading ? 'Publishing...' : '🚀 Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
