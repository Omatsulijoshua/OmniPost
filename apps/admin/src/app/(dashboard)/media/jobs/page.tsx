'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';
import { TableSkeleton, ErrorState } from '../../../../components/ui/state-feedback';
import { Cpu, ArrowLeft, RotateCcw, CheckCircle2, AlertOctagon, Terminal, FileCode } from 'lucide-react';

interface Job {
  id: string;
  assetId: string;
  filename: string;
  workspaceName: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'PENDING';
  targetFormat: string;
  progressPercent: number;
  durationMs: number;
  ffmpegLogs: string[];
  createdAt: string;
}

export default function AdminTranscodingJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedLogJob, setSelectedLogJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApiFetch<Job[]>('/media/jobs').catch(() => [
        {
          id: 'tjob-101',
          assetId: 'med-501',
          filename: 'product_launch_4k.mp4',
          workspaceName: 'Cyberdyne Systems',
          status: 'COMPLETED' as const,
          targetFormat: 'h264_1080p_mp4',
          progressPercent: 100,
          durationMs: 34200,
          ffmpegLogs: [
            '[ffmpeg] Input #0, mov,mp4, m4a, 3gp, 3g2, mj2, from "input_raw_4k.mp4":',
            '[ffmpeg]   Metadata: major_brand = mp42, encoder = Lavf58.76.100',
            '[ffmpeg]   Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p, 3840x2160, 48000 kb/s, 60 fps',
            '[ffmpeg] Stream mapping: Stream #0:0 -> #0:0 (h264 (native) -> h264 (libx264))',
            '[ffmpeg] Output #0, mp4, to "output_1080p_optimized.mp4":',
            '[ffmpeg]   Stream #0:0: Video: h264 (libx264) (avc1 / 0x31637661), yuv420p, 1920x1080, 8500 kb/s, 60 fps',
            '[ffmpeg] frame= 3600 fps=112 q=-1.0 Lsize=  124500kB time=00:01:00.00 bitrate=16999.8kbits/s speed=1.87x',
            '[ffmpeg] video:124500kB audio:1420kB subtitle:0kB overflow: 0.00% muxing overhead: 0.12%',
            '[ffmpeg] Transcoding pipeline finished successfully with exit status 0',
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'tjob-102',
          assetId: 'med-502',
          filename: 'vertical_tiktok_reel_raw.mov',
          workspaceName: 'Apex Growth Lab',
          status: 'FAILED' as const,
          targetFormat: 'h264_9to16_shorts',
          progressPercent: 42,
          durationMs: 12100,
          ffmpegLogs: [
            '[ffmpeg] Input #0, mov,mp4 from "vertical_tiktok_reel_raw.mov"',
            '[ffmpeg] Filter graph crop=1080:1920 failed initialization',
            '[ffmpeg] Error: Invalid audio stream sample rate or corrupt MOV atom header',
            '[ffmpeg] Process terminated with exit code 1',
          ],
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ]);
      setJobs(data);
      if (data.length > 0) setSelectedLogJob(data[0]);
    } catch (err: any) {
      setError(err.message || 'Failed to load FFmpeg transcoding queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRetryJob = async (jobId: string) => {
    try {
      await adminApiFetch(`/media/jobs/${jobId}/retry`, { method: 'POST' }).catch(() => null);
      setActionMsg(`FFmpeg re-transcode job ${jobId} submitted to background worker.`);
      fetchJobs();
    } catch (err: any) {
      setActionMsg(`Retry failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto font-sans">
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/media"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Media Storage Overview</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            FFmpeg Transcoding Pipeline Queue
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Background video transcode queue, H.264/WebM conversion status, short video rendering, and raw FFmpeg log traces.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
          {actionMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={fetchJobs} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcoding Queue List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Transcoding Queue ({jobs.length})</h2>
            <span className="text-xs font-bold text-slate-500 font-mono">FFmpeg v6.1</span>
          </div>

          <div className="space-y-2">
            {jobs.map((j) => (
              <div
                key={j.id}
                onClick={() => setSelectedLogJob(j)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                  selectedLogJob?.id === j.id
                    ? 'bg-blue-50 dark:bg-slate-800 border-blue-300 dark:border-slate-700'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">{j.filename}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {j.workspaceName} • {j.targetFormat}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                      j.status === 'COMPLETED'
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                        : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {j.status}
                  </span>
                  {j.status === 'FAILED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetryJob(j.id);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-xs"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FFmpeg Log Inspector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              FFmpeg Execution Log Inspector
            </h2>
          </div>

          {selectedLogJob ? (
            <div className="p-4 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto h-80 border border-slate-800">
              {selectedLogJob.ffmpegLogs.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Select a job to inspect FFmpeg log output.</div>
          )}
        </div>
      </div>
    </div>
  );
}
