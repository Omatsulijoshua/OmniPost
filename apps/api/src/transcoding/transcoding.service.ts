import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaProcessor, TRANSCODING_PRESETS } from '@omnipost/media-core';
import {
  TranscodingJobDetail,
  TranscodingPresetName,
  TranscodingPresetSpec,
} from '@omnipost/types';
import { CreateTranscodingJobInput } from '@omnipost/validation';

@Injectable()
export class TranscodingService {
  constructor(private readonly prisma: PrismaService) {}

  getAvailablePresets(): TranscodingPresetSpec[] {
    return Object.values(TRANSCODING_PRESETS);
  }

  async createJob(
    workspaceId: string,
    input: CreateTranscodingJobInput,
  ): Promise<TranscodingJobDetail> {
    const asset = await this.prisma.mediaAsset.findFirst({
      where: { id: input.mediaAssetId, workspaceId },
    });

    if (!asset) throw new NotFoundException('Media asset not found');

    const generatedVariants: any[] = [];

    for (const presetName of input.presets as TranscodingPresetName[]) {
      const variantMeta = MediaProcessor.processVariantFallback(
        asset.originalUrl,
        presetName,
      );

      const variant = await this.prisma.mediaVariant.create({
        data: {
          mediaAssetId: asset.id,
          preset: presetName,
          url: variantMeta.variantUrl,
          width: variantMeta.width,
          height: variantMeta.height,
          aspectRatio: variantMeta.aspectRatio,
          format: variantMeta.format,
          fileSize: Math.round(asset.fileSize * 0.8),
        },
      });

      generatedVariants.push(variant);
    }

    const jobDetail: TranscodingJobDetail = {
      id: `job-${Date.now()}`,
      mediaAssetId: asset.id,
      presets: input.presets as TranscodingPresetName[],
      status: 'COMPLETED',
      progress: 100,
      generatedVariants: generatedVariants.map((v) => ({
        id: v.id,
        originalAssetId: v.mediaAssetId,
        preset: v.preset,
        width: v.width,
        height: v.height,
        aspectRatio: v.aspectRatio,
        url: v.url,
        format: v.format,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return jobDetail;
  }

  async getJobById(workspaceId: string, jobId: string): Promise<TranscodingJobDetail> {
    return {
      id: jobId,
      mediaAssetId: 'mock-asset',
      presets: ['INSTAGRAM_REEL'],
      status: 'COMPLETED',
      progress: 100,
      generatedVariants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
