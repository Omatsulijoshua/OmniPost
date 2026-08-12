'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { PostDetail, PostStatus } from '@omnipost/types';

export default function ContentPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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
        return <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 rounded-full">PUBLISHED</span>;
      case 'SCHEDULED':
        return <span className="px-2.5 py-1 text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/50 rounded-full">SCHEDULED</span>;
      case 'PUBLISHING':
        return <span className="px-2.5 py-1 text-[10px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 rounded-full animate-pulse">PUBLISHING</span>;
      case 'FAILED':
        return <span className="px-2.5 py-1 text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800/50 rounded-full">FAILED</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded-full">DRAFT</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Content Library</h1>
          <p className="mt-1 text-sm text-slate-400">
            View, filter, schedule, publish, and retry post versions across platforms.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 text-center"
        >
          + Create New Post
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-max gap-1">
        {['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              filterStatus === st
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
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
            <div key={i} className="h-20 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-sm">
          No posts found. Click "+ Create New Post" to write your first content post.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {posts.map((post) => (
            <div key={post.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-100">{post.title || 'Untitled Post'}</h3>
                  {getStatusBadge(post.status)}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {post.universalCaption}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span>Author: {post.authorName}</span>
                  <span>• {post.versions.length} Target Channels</span>
                  <span>• Created {new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.scheduledAt && (
                    <span className="text-amber-400 font-semibold">
                      • Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Per-platform Version Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.versions.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px]"
                    >
                      <span className="font-bold text-slate-300">{v.platformType}</span>
                      {v.status === 'FAILED' ? (
                        <button
                          onClick={() => handleRetryVersion(v.id)}
                          className="text-rose-400 font-bold hover:underline"
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

              <div className="flex items-center gap-3">
                {post.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handlePublishNow(post.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20"
                  >
                    Publish Now
                  </button>
                )}
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 text-xs font-semibold rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
