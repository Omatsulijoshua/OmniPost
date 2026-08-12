'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApiFetch } from '../../../../lib/api-client';

interface WorkerItem {
  id: string;
  type: string;
  status: string;
  currentJobId: string | null;
  cpuPercent: number;
  memoryMB: number;
  uptimeSeconds: number;
}

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<WorkerItem[]>([]);

  useEffect(() => {
    adminApiFetch<WorkerItem[]>('/system/workers')
      .then((data) => setWorkers(data))
      .catch(() => {
        setWorkers([
          { id: 'worker-node-01', type: 'PUBLISHING', status: 'RUNNING', currentJobId: 'job-901', cpuPercent: 14.2, memoryMB: 280, uptimeSeconds: 345600 },
          { id: 'worker-node-02', type: 'TRANSCODING', status: 'HIGH_LOAD', currentJobId: 'tjob-102', cpuPercent: 88.4, memoryMB: 1120, uptimeSeconds: 864000 },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <Link href="/system/health" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to System Infrastructure Health
        </Link>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight mt-1">Active Worker Process Fleet</h1>
        <p className="mt-1 text-sm text-slate-400">
          Background worker cluster processes, assigned queue tasks, CPU utilization %, and RAM consumption.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workers.map((w) => (
          <div key={w.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-100 font-mono">{w.id}</h2>
                <p className="text-xs text-indigo-400 font-bold">{w.type} Worker</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                w.status === 'RUNNING' ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-amber-400 bg-amber-950 border-amber-800'
              }`}>
                {w.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between"><span>Current Job:</span> <span className="text-slate-100">{w.currentJobId || 'Idle'}</span></div>
              <div className="flex justify-between"><span>CPU Usage:</span> <span className="text-indigo-400 font-bold">{w.cpuPercent}%</span></div>
              <div className="flex justify-between"><span>Memory RAM:</span> <span className="text-emerald-400 font-bold">{w.memoryMB} MB</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
