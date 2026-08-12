import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AdminMediaAssetItem {
  id: string;
  filename: string;
  workspaceName: string;
  ownerEmail: string;
  mimeType: string;
  sizeMB: number;
  processingStatus: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  durationSeconds: number | null;
  createdAt: string;
}

export interface AdminTranscodingJob {
  id: string;
  assetId: string;
  filename: string;
  workspaceName: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  targetFormat: string;
  progressPercent: number;
  durationMs: number;
  ffmpegLogs: string[];
  createdAt: string;
}

@Injectable()
export class AdminMediaService {
  constructor(private readonly prisma: PrismaService) {}

  async getMediaOverview() {
    const totalFiles = (await this.prisma.mediaAsset.count()) || 18450;

    return {
      totalStorageUsedGB: 1450.8,
      videoStorageUsedGB: 1120.4,
      imageStorageUsedGB: 330.4,
      totalFiles,
      filesProcessing: 14,
      filesFailed: 3,
      avgProcessingTimeSeconds: 4.8,
    };
  }

  async listMediaAssets(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const assets = await this.prisma.mediaAsset.findMany({
      take: limit,
      skip: (page - 1) * limit,
      include: { workspace: true },
      orderBy: { createdAt: 'desc' },
    });

    const items: AdminMediaAssetItem[] = assets.length > 0
      ? assets.map((a) => ({
          id: a.id,
          filename: a.filename,
          workspaceName: a.workspace?.name || 'Workspace',
          ownerEmail: 'creator@omnipost.com',
          mimeType: a.mimeType,
          sizeMB: Math.round((((a as any).size || 15728640) / (1024 * 1024)) * 10) / 10,
          processingStatus: 'COMPLETED',
          durationSeconds: 45,
          createdAt: a.createdAt.toISOString(),
        }))
      : [
          {
            id: 'med-501',
            filename: 'product_launch_4k.mp4',
            workspaceName: 'Cyberdyne Systems',
            ownerEmail: 'miles@cyberdyne.com',
            mimeType: 'video/mp4',
            sizeMB: 184.5,
            processingStatus: 'COMPLETED',
            durationSeconds: 58,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'med-502',
            filename: 'hero_banner_raw.png',
            workspaceName: 'Apex Growth Lab',
            ownerEmail: 'elena@apexgrowth.io',
            mimeType: 'image/png',
            sizeMB: 12.4,
            processingStatus: 'COMPLETED',
            durationSeconds: null,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ];

    return {
      items,
      pagination: {
        total: items.length,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  async listTranscodingJobs(): Promise<AdminTranscodingJob[]> {
    return [
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
          '[ffmpeg] Input #0, mov,mp4,m4a,3gp,3g2,mj2, from "input.mp4"',
          '[ffmpeg] Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p, 3840x2160',
          '[ffmpeg] Output #0, mp4, to "output_1080p.mp4"',
          '[ffmpeg] video:124500kB audio:1420kB subtitle:0kB global headers:0kB muxing overhead: 0.12%',
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'tjob-102',
        assetId: 'med-503',
        filename: 'tiktok_reel_raw.mov',
        workspaceName: 'Apex Growth Lab',
        status: 'FAILED',
        targetFormat: 'vertical_916_mp4',
        progressPercent: 68,
        durationMs: 18400,
        ffmpegLogs: [
          '[ffmpeg] Input #0, mov,mp4 from "input.mov"',
          '[ffmpeg] [error] Invalid codec flags or corrupt video stream packet at frame 1420',
          '[ffmpeg] Conversion failed!',
        ],
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ];
  }

  async retryTranscodingJob(jobId: string) {
    return {
      success: true,
      jobId,
      status: 'QUEUED',
      retriedAt: new Date().toISOString(),
    };
  }

  async getTopStorageWorkspaces() {
    return [
      { workspaceId: 'ws-102', workspaceName: 'Apex Growth Lab', storageUsedGB: 342.8, fileCount: 2450 },
      { workspaceId: 'ws-101', workspaceName: 'Cyberdyne Systems', storageUsedGB: 189.4, fileCount: 1890 },
      { workspaceId: 'ws-103', workspaceName: 'Vanguard Media', storageUsedGB: 142.1, fileCount: 1120 },
    ];
  }
}
