import { Injectable, NotFoundException } from '@nestjs/common';

export interface InfrastructureHealthItem {
  component: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE' | 'MAINTENANCE';
  latencyMs: number;
  details: string;
}

export interface BullQueueStatus {
  name: string;
  active: number;
  waiting: number;
  delayed: number;
  failed: number;
  completed: number;
  isPaused: boolean;
  throughputPerMin: number;
}

export interface WorkerProcessItem {
  id: string;
  type: 'PUBLISHING' | 'TRANSCODING' | 'AI' | 'EMAIL' | 'ANALYTICS';
  status: 'RUNNING' | 'IDLE' | 'HIGH_LOAD';
  currentJobId: string | null;
  cpuPercent: number;
  memoryMB: number;
  uptimeSeconds: number;
}

@Injectable()
export class AdminSystemService {
  private queues: BullQueueStatus[] = [
    { name: 'social-publishing-queue', active: 18, waiting: 142, delayed: 5, failed: 34, completed: 1284293, isPaused: false, throughputPerMin: 450 },
    { name: 'video-transcoding-queue', active: 4, waiting: 14, delayed: 0, failed: 3, completed: 45200, isPaused: false, throughputPerMin: 85 },
    { name: 'ai-generation-queue', active: 8, waiting: 22, delayed: 0, failed: 12, completed: 89400, isPaused: false, throughputPerMin: 320 },
    { name: 'webhook-dispatch-queue', active: 2, waiting: 0, delayed: 0, failed: 1, completed: 2450000, isPaused: false, throughputPerMin: 1200 },
  ];

  async getHealthOverview(): Promise<InfrastructureHealthItem[]> {
    return [
      { component: 'API Node Gateway', status: 'OPERATIONAL', latencyMs: 14, details: '3 cluster instances healthy' },
      { component: 'PostgreSQL Database', status: 'OPERATIONAL', latencyMs: 3, details: 'Active connections: 42/100, Pool latency 3ms' },
      { component: 'Redis Cache & Memory', status: 'OPERATIONAL', latencyMs: 1, details: 'Memory used: 412 MB / 4 GB (10%)' },
      { component: 'BullMQ Queue Engine', status: 'OPERATIONAL', latencyMs: 2, details: '4 active worker queues processing normally' },
      { component: 'AWS S3 Media Storage', status: 'OPERATIONAL', latencyMs: 45, details: 'Uploads/Downloads 100% success rate' },
      { component: 'OpenAI API Gateway', status: 'OPERATIONAL', latencyMs: 320, details: 'GPT-4o response time normal' },
      { component: 'FFmpeg Transcoding Engine', status: 'OPERATIONAL', latencyMs: 8, details: 'Worker GPU acceleration enabled' },
    ];
  }

  async listQueues(): Promise<BullQueueStatus[]> {
    return this.queues;
  }

  async toggleQueuePause(name: string, pause: boolean): Promise<BullQueueStatus> {
    const q = this.queues.find((item) => item.name === name);
    if (!q) throw new NotFoundException(`Queue ${name} not found`);
    q.isPaused = pause;
    return q;
  }

  async listWorkerFleet(): Promise<WorkerProcessItem[]> {
    return [
      { id: 'worker-node-01', type: 'PUBLISHING', status: 'RUNNING', currentJobId: 'job-901', cpuPercent: 14.2, memoryMB: 280, uptimeSeconds: 345600 },
      { id: 'worker-node-02', type: 'TRANSCODING', status: 'HIGH_LOAD', currentJobId: 'tjob-102', cpuPercent: 88.4, memoryMB: 1120, uptimeSeconds: 864000 },
      { id: 'worker-node-03', type: 'AI', status: 'RUNNING', currentJobId: 'ai-771', cpuPercent: 24.1, memoryMB: 410, uptimeSeconds: 120000 },
      { id: 'worker-node-04', type: 'EMAIL', status: 'IDLE', currentJobId: null, cpuPercent: 1.2, memoryMB: 140, uptimeSeconds: 432000 },
    ];
  }
}
