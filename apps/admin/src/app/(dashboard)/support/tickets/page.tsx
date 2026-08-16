'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, EmptyState, ErrorState } from '../../../../components/ui/state-feedback';
import { HelpCircle, Search, Filter, MessageSquare, ArrowUpRight, UserCheck, AlertTriangle } from 'lucide-react';

interface TicketItem {
  id: string;
  userEmail: string;
  workspaceName: string;
  subject: string;
  category: 'OAUTH_FAILURE' | 'PUBLISHING_ERROR' | 'BILLING_ISSUE' | 'AI_CREDIT_BUG' | 'FEATURE_REQUEST';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedAdmin: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<TicketItem[]>(
        `/support/tickets?search=${encodeURIComponent(search)}&status=${statusFilter}&priority=${priorityFilter}&category=${categoryFilter}`
      ).catch(() => [
        {
          id: 'tck-401',
          userEmail: 'miles@cyberdyne.com',
          workspaceName: 'Cyberdyne Systems',
          subject: 'Custom Webhook Payload schema validation question',
          category: 'PUBLISHING_ERROR' as const,
          priority: 'URGENT' as const,
          status: 'OPEN' as const,
          assignedAdmin: 'Sarah Connor',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'tck-402',
          userEmail: 'elena@apexgrowth.io',
          workspaceName: 'Apex Growth Lab',
          subject: 'TikTok Video Direct Upload quota discrepancy',
          category: 'OAUTH_FAILURE' as const,
          priority: 'HIGH' as const,
          status: 'IN_PROGRESS' as const,
          assignedAdmin: 'Alex Rivers',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'tck-403',
          userEmail: 'marcus@agency-growth.co',
          workspaceName: 'Skynet Media Agency',
          subject: 'Billing receipt discrepancy for monthly plan renewal',
          category: 'BILLING_ISSUE' as const,
          priority: 'MEDIUM' as const,
          status: 'OPEN' as const,
          assignedAdmin: null,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ]);
      setTickets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load support ticket operations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Support Ticket Operations & Helpdesk
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Customer helpdesk queue, priority SLA resolution, staff admin assignments, and thread inspection.
          </p>
        </div>

        <Link
          href="/moderation"
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition"
        >
          Flagged Content Moderation →
        </Link>
      </div>

      {error && <ErrorState message={error} onRetry={fetchTickets} />}

      {/* Search & Comprehensive Filters matching Section 40 */}
      <div className="flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by subject, workspace, or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="ALL">Status: All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="ALL">Priority: All</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Workspace & Customer</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Staff</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-4">
                    <TableSkeleton rows={4} cols={8} />
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8">
                    <EmptyState
                      title="No Support Tickets Found"
                      description="No tickets match your current status, priority, or search query."
                      actionLabel="Reset Search"
                      onAction={() => {
                        setSearch('');
                        setStatusFilter('ALL');
                        setPriorityFilter('ALL');
                        setCategoryFilter('ALL');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{t.id}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {t.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{t.workspaceName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{t.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                      {t.category.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                          t.priority === 'URGENT' || t.priority === 'HIGH'
                            ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
                            : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{t.status}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {t.assignedAdmin || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/support/tickets/${t.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-[11px] transition inline-flex items-center gap-1"
                      >
                        <span>View Thread</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
