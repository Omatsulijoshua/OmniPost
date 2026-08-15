'use client';

import React, { useState } from 'react';
import { PostDetail } from '@omnipost/types';

interface PostHistoryModalProps {
  post: PostDetail | null;
  onClose: () => void;
  onRetryVersion: (versionId: string) => void;
}

export function PostHistoryModal({
  post,
  onClose,
  onRetryVersion,
}: PostHistoryModalProps) {
  if (!post) return null;

  const [accountFilter, setAccountFilter] = useState<string>('ALL');

  // Extract list of unique account names across versions
  const uniqueAccountNames = Array.from(
    new Set(post.versions.map((v) => v.accountName || `${v.platformType} Account`)),
  );

  const filteredVersions = post.versions.filter((v) => {
    if (accountFilter === 'ALL') return true;
    const name = v.accountName || `${v.platformType} Account`;
    return name === accountFilter;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {post.title || 'Untitled Post'}
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                {post.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Created by <span className="font-bold text-slate-700">{post.authorName}</span> on{' '}
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Core Universal Caption & Media */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Universal Caption (Primary Content)
          </div>
          <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
            {post.universalCaption}
          </p>

          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {post.mediaUrls.map((url, idx) => (
                <div key={idx} className="w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-200 shadow-xs">
                  <img src={url} alt="Post asset" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Channel Breakdown Table & Account Filter Dropdown */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Target Channels & Publishing History ({filteredVersions.length} of {post.versions.length} Platforms)
            </h3>

            {/* Separate Social Media Accounts Dropdown Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
                Filter Account:
              </label>
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option value="ALL">All Connected Social Accounts ({post.versions.length})</option>
                {uniqueAccountNames.map((name, i) => (
                  <option key={i} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-xs">
            {filteredVersions.length === 0 ? (
              <div className="p-6 text-center text-xs font-medium text-slate-500">
                No channels found for account filter "{accountFilter}"
              </div>
            ) : (
              filteredVersions.map((ver) => {
                const liveUrl =
                  ver.status === 'PUBLISHED'
                    ? `https://${ver.platformType.toLowerCase()}.com/post/${ver.id.slice(0, 8)}`
                    : null;

                const accNameDisplay = ver.accountName || `@${ver.platformType.toLowerCase()}_account`;

                return (
                  <div key={ver.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center font-extrabold text-blue-600 text-xs">
                          {ver.platformType.slice(0, 2)}
                        </span>
                        <span className="text-xs font-black text-slate-900">{ver.platformType}</span>

                        {/* Distinct Social Account Handle / Name Badge */}
                        <span className="px-2.5 py-0.5 text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 rounded-lg">
                          {accNameDisplay}
                        </span>
                      </div>

                      {ver.overrideCaption && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                          Caption Override: "{ver.overrideCaption}"
                        </p>
                      )}

                      {ver.hashtags && ver.hashtags.length > 0 && (
                        <div className="text-[11px] font-semibold text-blue-600">
                          Hashtags: {ver.hashtags.join(' ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 shadow-xs"
                        >
                          🔗 View Live Post
                        </a>
                      )}

                      {ver.status === 'FAILED' ? (
                        <button
                          onClick={() => onRetryVersion(ver.id)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          🔄 Retry Publish
                        </button>
                      ) : (
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            ver.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {ver.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Audit Logs & Timeline */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            📜 Complete Audit & Governance Timeline
          </h3>

          <div className="space-y-2 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>
                <strong>Post Created</strong> by {post.authorName} on {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            {post.scheduledAt && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>
                  <strong>Scheduled for Publication</strong> on {new Date(post.scheduledAt).toLocaleString()}
                </span>
              </div>
            )}
            {post.status === 'PUBLISHED' && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  <strong>Successfully Published</strong> across {post.versions.length} social channels
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
