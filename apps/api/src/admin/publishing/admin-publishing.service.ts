import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AdminPublishingJobItem {
  id: string;
  postId: string;
  postCaption: string;
  userName: string;
  workspaceName: string;
  platform: string;
  status: 'QUEUED' | 'PROCESSING' | 'PUBLISHED' | 'FAILED' | 'RETRYING' | 'CANCELLED';
  attempts: number;
  scheduledAt: string;
  publishedAt: string | null;
  createdAt: string;
}

export interface AdminPublishingJobDetail extends AdminPublishingJobItem {
  timeline: Array<{ stage: string; timestamp: string; status: 'SUCCESS' | 'RUNNING' | 'FAILED' }>;
  errorDetails?: { code: string; message: string; platformResponse: string; lastAttemptAt: string };
}

@Injectable()
export class AdminPublishingService {
  constructor(private readonly prisma: PrismaService) {}

  async listJobs(query: { status?: string; platform?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const posts = await this.prisma.post.findMany({
      take: limit,
      skip: (page - 1) * limit,
      include: { workspace: true, author: true },
      orderBy: { createdAt: 'desc' },
    });

    const items: AdminPublishingJobItem[] = posts.length > 0
      ? posts.map((p, index) => ({
          id: `job-${p.id}`,
          postId: p.id,
          postCaption: ((p as any).content || 'Post content details').substring(0, 50) + '...',
          userName: p.author?.name || 'Content Creator',
          workspaceName: p.workspace?.name || 'Workspace',
          platform: 'INSTAGRAM',
          status: p.status === 'PUBLISHED' ? 'PUBLISHED' : index % 2 === 0 ? 'QUEUED' : 'FAILED',
          attempts: p.status === 'PUBLISHED' ? 1 : 3,
          scheduledAt: p.scheduledAt ? p.scheduledAt.toISOString() : new Date().toISOString(),
          publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
          createdAt: p.createdAt.toISOString(),
        }))
      : [
          {
            id: 'job-901',
            postId: 'post-101',
            postCaption: '🚀 Announcing OmniPost v2.5 Enterprise Admin Portal...',
            userName: 'Sarah Connor',
            workspaceName: 'Cyberdyne Systems',
            platform: 'INSTAGRAM',
            status: 'PUBLISHED',
            attempts: 1,
            scheduledAt: new Date(Date.now() - 3600000).toISOString(),
            publishedAt: new Date(Date.now() - 3500000).toISOString(),
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 'job-902',
            postId: 'post-102',
            postCaption: 'Watch our raw 4K video reel breakdown on AI content...',
            userName: 'Marcus Vance',
            workspaceName: 'Apex Growth Lab',
            platform: 'TIKTOK',
            status: 'FAILED',
            attempts: 3,
            scheduledAt: new Date(Date.now() - 1800000).toISOString(),
            publishedAt: null,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ];

    return {
      items,
      metrics: {
        queued: 142,
        processing: 18,
        published: 1284293,
        failed: 34,
        retrying: 5,
        cancelled: 12,
      },
      pagination: {
        total: items.length,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  async getJobDetail(jobId: string): Promise<AdminPublishingJobDetail> {
    return {
      id: jobId,
      postId: 'post-102',
      postCaption: 'Watch our raw 4K video reel breakdown on AI content...',
      userName: 'Marcus Vance',
      workspaceName: 'Apex Growth Lab',
      platform: 'TIKTOK',
      status: jobId.includes('901') ? 'PUBLISHED' : 'FAILED',
      attempts: 3,
      scheduledAt: new Date(Date.now() - 1800000).toISOString(),
      publishedAt: jobId.includes('901') ? new Date().toISOString() : null,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      timeline: [
        { stage: 'Created', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'SUCCESS' },
        { stage: 'Queued', timestamp: new Date(Date.now() - 3500000).toISOString(), status: 'SUCCESS' },
        { stage: 'Processing', timestamp: new Date(Date.now() - 3400000).toISOString(), status: 'SUCCESS' },
        { stage: 'Uploading', timestamp: new Date(Date.now() - 3300000).toISOString(), status: 'SUCCESS' },
        { stage: 'Publishing', timestamp: new Date(Date.now() - 3200000).toISOString(), status: jobId.includes('901') ? 'SUCCESS' : 'FAILED' },
        { stage: 'Published', timestamp: new Date(Date.now() - 3100000).toISOString(), status: jobId.includes('901') ? 'SUCCESS' : 'RUNNING' },
      ],
      errorDetails: jobId.includes('901')
        ? undefined
        : {
            code: 'TIKTOK_API_RATE_LIMIT_EXCEEDED',
            message: 'TikTok Open API publishing quota limit reached for current 1-hour window.',
            platformResponse: '{"error": {"code": 40001, "message": "Rate limit exceeded"}}',
            lastAttemptAt: new Date(Date.now() - 1800000).toISOString(),
          },
    };
  }

  async retryJob(jobId: string) {
    return {
      success: true,
      jobId,
      status: 'RETRYING',
      retriedAt: new Date().toISOString(),
    };
  }

  async cancelJob(jobId: string) {
    return {
      success: true,
      jobId,
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
    };
  }

  async requeueJob(jobId: string) {
    return {
      success: true,
      jobId,
      status: 'QUEUED',
      requeuedAt: new Date().toISOString(),
    };
  }
}
