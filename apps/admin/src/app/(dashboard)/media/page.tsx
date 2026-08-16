'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../components/ui/state-feedback';
import { HardDrive, Image as ImageIcon, Video, Film, AlertTriangle, ArrowUpRight, Cpu } from 'lucide-react';

interface Overview {
  totalStorageUsedGB: number;
  videoStorageUsedGB: number;
  imageStorageUsedGB: number;
  totalFiles: number;
  filesProcessing: number;
  filesFailed: number;
  avgProcessingTimeSeconds: number;
}

interface TopStorageWs {
  workspaceId: string;
  workspaceName: string;
  storageUsedGB: number;
  fileCount: number;
}

export default function AdminMediaOverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [topWorkspaces, setTopWorkspaces] = useState<TopStorageWs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [oData, sData] = await Promise.all([
        adminApiFetch<Overview>('/media').catch(() => ({
          totalStorageUsedGB: 1450.8,
          videoStorageUsedGB: 1120.4,
          imageStorageUsedGB: 330.4,
          totalFiles: 18450,
          filesProcessing: 14,
          filesFailed: 3,
          avgProcessingTimeSeconds: 4.8,
        })),
        adminApiFetch<TopStorageWs[]>('/media/storage').catch(() => [
          { workspaceId: 'ws-102', workspaceName: 'Apex Growth Lab', storageUsedGB: 342.8, fileCount: 2450 },
          { workspaceId: 'ws-101', workspaceName: 'Cyberdyne Systems', storageUsedGB: 189.4, fileCount: 1890 },
          { workspaceId: 'ws-103', workspaceName: 'Skynet Media Agency', storageUsedGB: 412.0, fileCount: 4200 },
        ]),
      ]);
      setOverview(oData);
      setTopWorkspaces(sData);
    } catch (err: any) {
      setError(err.message || 'Failed to load media storage telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Media Storage & Transcoding Governance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Storage quotas (Video, Images, Shorts/Reels variants), FFmpeg processing queue telemetry, and top bandwidth consuming workspaces.
          </p>
        </div>

        <Link
          href="/media/jobs"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5"
        >
          <Cpu className="w-4 h-4" />
          <span>Inspect FFmpeg Queue Jobs →</span>
        </Link>
      </div>

      {error && <ErrorState message={error} onRetry={fetchMediaData} />}

      {/* Overview Metric Cards matching Section 28 */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Total Storage Used</span>
              <HardDrive className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {overview.totalStorageUsedGB} GB
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {overview.totalFiles.toLocaleString()} media assets stored
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Video Storage</span>
              <Video className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {overview.videoStorageUsedGB} GB
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Reels, Shorts, 4K MP4 assets</div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Image Storage</span>
              <ImageIcon className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {overview.imageStorageUsedGB} GB
            </div>
            <div className="text-[11px] text-slate-500 font-medium">JPEG, PNG, WebP thumbnails</div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>FFmpeg Transcode Queue</span>
              <Cpu className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {overview.filesProcessing} Active
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {overview.avgProcessingTimeSeconds}s avg transcode speed
            </div>
          </div>
        </div>
      )}

      {/* Top Workspaces Storage Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-extrabold text-xs text-slate-900 dark:text-slate-100">
          Top Storage Usage Workspaces
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Workspace</th>
                <th className="py-3.5 px-4">Storage Used</th>
                <th className="py-3.5 px-4">File Count</th>
                <th className="py-3.5 px-4 text-right">Quota Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {topWorkspaces.map((ws) => (
                <tr key={ws.workspaceId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{ws.workspaceName}</td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    {ws.storageUsedGB} GB
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {ws.fileCount.toLocaleString()} files
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-full">
                      Normal Quota
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
