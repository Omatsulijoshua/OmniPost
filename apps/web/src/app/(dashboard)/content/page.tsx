'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { PostDetail, PostStatus } from '@omnipost/types';
import { PostHistoryModal } from '../../../components/post/post-history-modal';

export default function ContentPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [inspectingPost, setInspectingPost] = useState<PostDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const statusParam = filterStatus !== 'ALL' ? `?status=${filterStatus}` : '';
      const data = await apiFetch<PostDetail[]>(`/posts${statusParam}`);
      setPosts(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeWorkspace?.id, filterStatus]);

  const handlePublishNow = async (id: string) => {
    try {
      const updated = await apiFetch<PostDetail>(`/posts/${id}/publish-now`, {
        method: 'POST',
      });
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      alert(err.message || 'Failed to publish post');
    }
  };

  const handleRetryVersion = async (versionId: string) => {
    try {
      await apiFetch('/publishing/retry', {
        method: 'POST',
        body: JSON.stringify({ postVersionId: versionId }),
      });
      loadPosts();
    } catch (err: any) {
      alert(err.message || 'Failed to retry publishing');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiFetch(`/posts/${id}`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full">PUBLISHED</span>;
      case 'SCHEDULED':
        return <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 rounded-full">SCHEDULED</span>;
      case 'PUBLISHING':
        return <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-blue-800 bg-blue-100 border border-blue-300 rounded-full animate-pulse">PUBLISHING</span>;
      case 'FAILED':
        return <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-rose-800 bg-rose-100 border border-rose-300 rounded-full">FAILED</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-full">DRAFT</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Library & Publishing History</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            View detailed post history, target channel breakdowns, live post links, and publishing logs.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-block px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/20 text-center transition-all"
        >
          + Create New Post
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200/80 w-max gap-1 shadow-xs">
        {['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === st
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Post Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 bg-white border border-dashed border-slate-200 rounded-2xl text-center text-slate-500 text-xs font-medium">
          No posts found. Click "+ Create New Post" to write your first content post.
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
          {posts.map((post) => (
            <div key={post.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-extrabold text-slate-900">{post.title || 'Untitled Post'}</h3>
                  {getStatusBadge(post.status)}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                  {post.universalCaption}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-semibold">
                  <span>Author: {post.authorName}</span>
                  <span>• {post.versions.length} Target Channels</span>
                  <span>• Created {new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.scheduledAt && (
                    <span className="text-amber-600 font-bold">
                      • Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Per-platform Version Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {post.versions.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px]"
                    >
                      <span className="font-bold text-slate-800">{v.platformType}</span>
                      {v.status === 'FAILED' ? (
                        <button
                          onClick={() => handleRetryVersion(v.id)}
                          className="text-rose-600 font-bold hover:underline"
                        >
                          🔄 Retry
                        </button>
                      ) : (
                        <span className="text-slate-500">{v.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setInspectingPost(post)}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl transition-all"
                >
                  📜 Inspect History
                </button>

                {post.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handlePublishNow(post.id)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition-all"
                  >
                    🚀 Publish Now
                  </button>
                )}

                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-xl transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Audit History Inspector Modal */}
      <PostHistoryModal
        post={inspectingPost}
        onClose={() => setInspectingPost(null)}
        onRetryVersion={handleRetryVersion}
      />
    </div>
  );
}
