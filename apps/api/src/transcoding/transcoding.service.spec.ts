import { Test, TestingModule } from '@nestjs/testing';
import { TranscodingService } from './transcoding.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TranscodingService', () => {
  let service: TranscodingService;

  const mockPrismaService = {
    mediaAsset: {
      findFirst: jest.fn(),
    },
    mediaVariant: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranscodingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TranscodingService>(TranscodingService);
    jest.clearAllMocks();
  });

  it('should list available transcoding presets', () => {
    const presets = service.getAvailablePresets();
    expect(presets.length).toBeGreaterThanOrEqual(8);
    expect(presets.some((p) => p.preset === 'INSTAGRAM_REEL')).toBe(true);
    expect(presets.some((p) => p.preset === 'YOUTUBE_SHORT')).toBe(true);
  });

  it('should enqueue and complete transcoding job creating MediaVariants', async () => {
    mockPrismaService.mediaAsset.findFirst.mockResolvedValue({
      id: 'asset-video-1',
      workspaceId: 'ws-1',
      originalUrl: '/uploads/ws-1/originals/video.mp4',
      fileSize: 1000000,
    });

    mockPrismaService.mediaVariant.create.mockImplementation((dto: any) => ({
      id: `var-${dto.data.preset}`,
      mediaAssetId: dto.data.mediaAssetId,
      preset: dto.data.preset,
      width: dto.data.width,
      height: dto.data.height,
      aspectRatio: dto.data.aspectRatio,
      url: dto.data.url,
      format: dto.data.format,
    }));

    const job = await service.createJob('ws-1', {
      mediaAssetId: 'asset-video-1',
      presets: ['INSTAGRAM_REEL', 'TIKTOK_VIDEO'],
    });

    expect(job.status).toBe('COMPLETED');
    expect(job.generatedVariants.length).toBe(2);
    expect(mockPrismaService.mediaVariant.create).toHaveBeenCalledTimes(2);
  });

  it('should throw NotFoundException if media asset does not exist', async () => {
    mockPrismaService.mediaAsset.findFirst.mockResolvedValue(null);

    await expect(
      service.createJob('ws-1', {
        mediaAssetId: 'invalid-asset',
        presets: ['INSTAGRAM_REEL'],
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
