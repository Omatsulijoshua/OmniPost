'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface Job {
  id: string;
  assetId: string;
  filename: string;
  workspaceName: string;
  status: string;
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

  useEffect(() => {
    adminApiFetch<Job[]>('/media/jobs')
      .then((data) => {
        setJobs(data);
        if (data.length > 0) setSelectedLogJob(data[0]);
      })
      .catch(() => {
        const dummy: Job[] = [
          {
            id: 'tjob-101',
            assetId: 'med-501',
            filename: 'product_launch_4k.mp4',
            workspaceName: 'Cyberdyne Systems',
            status: 'COMPLETED',
            targetFormat: 'h264_1080p_mp4',
            progressPercent: 100,
            durationMs: 34200,
            ffmpegLogs: [
              '[ffmpeg] Input #0, mov,mp4 from "input.mp4"',
              '[ffmpeg] Output #0, mp4, to "output_1080p.mp4"',
              '[ffmpeg] video:124500kB audio:1420kB muxing overhead: 0.12%',
            ],
            createdAt: new Date().toISOString(),
          },
        ];
        setJobs(dummy);
        setSelectedLogJob(dummy[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <Link href="/media" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Media Storage Overview
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">FFmpeg Transcoding Pipeline Queue</h1>
        <p className="mt-1 text-sm text-slate-400">
          Inspect video transcoding jobs, background worker progress, format conversions, and FFmpeg execution logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-100">Transcoding Queue</h2>
          <div className="divide-y divide-slate-800">
            {jobs.map((j) => (
              <div
                key={j.id}
                onClick={() => setSelectedLogJob(j)}
                className={`py-3 px-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                  selectedLogJob?.id === j.id ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-100">{j.filename}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{j.workspaceName} • {j.targetFormat}</div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  j.status === 'COMPLETED' ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-rose-400 bg-rose-950 border-rose-800'
                }`}>
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FFmpeg Log Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-100">FFmpeg Execution Log Inspector</h2>
          {selectedLogJob ? (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto h-72">
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
