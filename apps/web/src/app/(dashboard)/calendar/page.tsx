'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/auth-store';
import { apiFetch } from '../../../lib/api-client';
import { CalendarPostItem, ScheduleConflict } from '@omnipost/types';

export default function CalendarPage() {
  const activeWorkspace = useAuthStore((state) => state.activeWorkspace);

  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY'>('MONTH');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC');
  const [posts, setPosts] = useState<CalendarPostItem[]>([]);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCalendarData = async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [postsData, conflictsData] = await Promise.all([
        apiFetch<CalendarPostItem[]>('/calendar/posts'),
        apiFetch<ScheduleConflict[]>('/calendar/conflicts'),
      ]);
      setPosts(postsData || []);
      setConflicts(conflictsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, [activeWorkspace?.id]);

  const handleReschedule = async (postId: string, newDateIso: string) => {
    try {
      const updated = await apiFetch<CalendarPostItem>(`/calendar/posts/${postId}/reschedule`, {
        method: 'PATCH',
        body: JSON.stringify({ scheduledAt: newDateIso }),
      });
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      loadCalendarData();
    } catch (err: any) {
      alert(err.message || 'Failed to reschedule post');
    }
  };

  // Mock days of current month for calendar grid
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Content Calendar</h1>
          <p className="mt-1 text-sm text-slate-400">
            Schedule, queue, and visually drag & drop posts across platforms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timezone Selector */}
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="UTC">Timezone: UTC</option>
            <option value="America/New_York">Timezone: New York (EDT)</option>
            <option value="Europe/London">Timezone: London (BST)</option>
            <option value="Asia/Tokyo">Timezone: Tokyo (JST)</option>
          </select>

          {/* View Mode Toggles */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
            {(['MONTH', 'WEEK', 'DAY'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  viewMode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Schedule Conflicts Alert Banner */}
      {conflicts.length > 0 && (
        <div className="p-4 bg-amber-950/60 border border-amber-800/60 rounded-xl space-y-1 text-xs text-amber-300">
          <div className="font-bold flex items-center gap-2">
            ⚠️ Schedule Conflicts Detected ({conflicts.length})
          </div>
          <p className="text-amber-400/80">
            Multiple posts are scheduled on the same social account within 5 minutes. Adjust their schedule to maximize reach.
          </p>
        </div>
      )}

      {/* Calendar Grid (Month View) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">August 2026</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            <span>Scheduled</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ml-2" />
            <span>Published</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block ml-2" />
            <span>AI Optimal Slot</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-800">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const dayPosts = posts.filter((p) => {
              const dt = new Date(p.scheduledAt);
              return dt.getDate() === day;
            });

            const isOptimalDay = day === 15 || day === 19 || day === 26;

            return (
              <div
                key={day}
                className={`min-h-28 p-2 bg-slate-950 border rounded-xl flex flex-col justify-between transition ${
                  isOptimalDay ? 'border-amber-500/30' : 'border-slate-850'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                  <span>{day}</span>
                  {isOptimalDay && (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded">
                      🔥 AI Slot
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mt-2">
                  {dayPosts.map((p) => (
                    <div
                      key={p.id}
                      className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-left text-[11px] space-y-1 cursor-grab hover:border-indigo-500"
                    >
                      <div className="font-semibold text-slate-200 truncate">{p.title}</div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400">
                        {p.platformTypes.map((pt) => (
                          <span key={pt} className="px-1 bg-slate-950 rounded border border-slate-800">
                            {pt}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
